import { Component, OnInit } from '@angular/core';
import { PollService } from '../../../../shared/services/poll.service';
import { AnalyticsService } from '../../../../shared/services/analytics.service';

@Component({
  selector: 'app-poll-user',
  templateUrl: './poll-user.component.html',
  styleUrls: ['./poll-user.component.scss'],
  standalone: false
})
export class PollUserComponent implements OnInit {
  polls: any[] = [];
  selectedAnswers: { [key: string]: string } = {};
  message = '';

  constructor(private pollService: PollService,private analyticsService: AnalyticsService) {}

  onButtonClick() {
    this.analyticsService.sendButtonClick('Szavazat leadása');
  }

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {
    const userId = this.getUserId();
    console.log('👤 getUserId() visszatérési érték:', userId);
    console.log('👤 Bejelentkezett user ID:', userId);

    this.pollService.getAllPolls().subscribe({
      next: data => {
        this.polls = data
          .filter((p: any) => !p.isClosed)
          .map((poll: any, pi: number) => {
            poll.questions = poll.questions.map((q: any, qi: number) => {
              let userAnswer = null;

              if (Array.isArray(q.answers)) {
                for (const a of q.answers) {
                  const rawId = a.userId;
                  const uid = typeof rawId === 'object' ? rawId._id : rawId;

                  console.log(`🔍 [${pi}.${qi}] Felhasználó ID összevetés:`, uid, '===', userId);

                  if (uid?.toString() === userId) {
                    userAnswer = a.selectedOption;
                    break;
                  }
                }
              }

              const result = {
                ...q,
                hasVoted: !!userAnswer,
                userAnswer: userAnswer
              };

              console.log(`📊 [${pi}.${qi}] Kérdés:`, q.question);
              console.log('  ▪ answers:', q.answers);
              console.log('  ▪ hasVoted:', result.hasVoted);
              console.log('  ▪ userAnswer:', result.userAnswer);

              return result;
            });

            return poll;
          });

        console.log('✅ Végső feldolgozott polls:', this.polls);
      },
      error: err => {
        console.error('Hiba a szavazások lekérésekor:', err);
      }
    });
  }

  selectAnswer(pollId: string, qIndex: number, option: string) {
    this.selectedAnswers[`${pollId}_${qIndex}`] = option;
  }

  submitVote(pollId: string, qIndex: number) {
    const selectedOption = this.selectedAnswers[`${pollId}_${qIndex}`];
    if (!selectedOption) {
      this.message = 'Kérlek válassz egy opciót!';
      return;
    }

    this.pollService.votePoll(pollId, {
      questionIndex: qIndex,
      selectedOption
    }).subscribe({
      next: () => {
        this.message = 'Szavazat sikeresen leadva!';
        this.polls = [];
        this.loadPolls();
      },
      error: err => {
        console.error('Hiba szavazás közben:', err);
        this.message = err.error?.error || 'Hiba történt.';
      }
    });
  }

  getUserId(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId; // ← EZ A HELYES
    } catch {
      return '';
    }
  }
  
  
}
