import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PollService } from '../../../../shared/services/poll.service';

@Component({
  selector: 'app-poll-admin',
  templateUrl: './poll-admin.component.html',
  styleUrls: ['./poll-admin.component.scss'],
  standalone: false
})
export class PollAdminComponent implements OnInit {
  pollForm!: FormGroup;
  matches: any[] = [];
  polls: any[] = [];
  isSubmitting = false;
  message = '';
  evaluatingPollId: string | null = null;
  evaluationAnswers: { questionIndex: number, correctAnswers: string[] }[] = [];
  selectedStatus: string = 'all'; // all | open | closed
  filteredPolls: any[] = [];
  


  constructor(private fb: FormBuilder, private pollService: PollService) {}

  ngOnInit(): void {
    this.pollForm = this.fb.group({
      matchId: ['', Validators.required],
      questions: this.fb.array([this.createQuestionGroup()])
    });

    this.fetchUpcomingMatches();
    this.fetchAllPolls();
  }

  get questions(): FormArray {
    return this.pollForm.get('questions') as FormArray;
  }

  createQuestionGroup(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required]
    });
  }

  addQuestion(): void {
    this.questions.push(this.createQuestionGroup());
  }

  removeQuestion(index: number): void {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
    }
  }

  fetchUpcomingMatches(): void {
    this.pollService.getUpcomingMatches().subscribe({
      next: (data) => {
        this.matches = data.filter(match => !match.score);
      },
      error: (err) => {
        console.error('Hiba a meccsek lekérésekor:', err);
      }
    });
  }

  fetchAllPolls(): void {
    this.pollService.getAllPolls().subscribe({
      next: (data) => {
        this.polls = data;
        this.applyFilters();
      },
      error: (err) => console.error(err)
    });
  }

  applyFilters(): void {
    this.filteredPolls = this.polls.filter(poll => {
      const matchesStatus =
        this.selectedStatus === 'all' ||
        (this.selectedStatus === 'open' && !poll.isClosed) ||
        (this.selectedStatus === 'closed' && poll.isClosed);
      return matchesStatus;
    });
  }

  onStatusChange(): void {
    this.applyFilters();
  }


  createPoll(): void {
    if (this.pollForm.invalid) return;

    this.isSubmitting = true;
    this.pollService.createPoll(this.pollForm.value).subscribe({
      next: () => {
        this.message = 'Szavazás sikeresen létrehozva!';
        this.pollForm.reset();
        this.questions.clear();
        this.questions.push(this.createQuestionGroup());
        this.isSubmitting = false;
        this.fetchAllPolls();
      },
      error: (err) => {
        console.error('Hiba szavazás létrehozásakor:', err);
        this.message = 'Hiba történt.';
        this.isSubmitting = false;
      }
    });
  }

  closePoll(pollId: string): void {
    this.pollService.closePoll(pollId).subscribe(() => this.fetchAllPolls());
  }

  deletePoll(pollId: string): void {
    this.pollService.deletePoll(pollId).subscribe(() => this.fetchAllPolls());
  }

  evaluatePoll(pollId: string): void {
    alert('Ez a funkció hamarosan elérhető: Kiértékelés');
  }
  startEvaluation(poll: any): void {
    this.evaluatingPollId = poll._id;
    this.evaluationAnswers = poll.questions.map((q: any, index: number) => ({
      questionIndex: index,
      correctAnswers: [] // vagy q.correctAnswers ha újraértékelhető
    }));
  }

  onSingleAnswerChange(questionIndex: number, selected: string) {
    this.evaluationAnswers[questionIndex] = {
      questionIndex,
      correctAnswers: [selected]
    };
  }
  
  cancelEvaluation(): void {
    this.evaluatingPollId = null;
    this.evaluationAnswers = [];
  }
  
  
  submitEvaluation(): void {
    if (!this.evaluatingPollId) return;
  
    // DEBUG: küldés előtti adatellenőrzés
    console.log('✔️ Küldésre kerülő kiértékelés:', this.evaluationAnswers);
  
    // ellenőrzés: minden elemben legyen questionIndex + correctAnswers (mint tömb!)
    const isValid = this.evaluationAnswers.every(entry =>
      typeof entry.questionIndex === 'number' &&
      Array.isArray(entry.correctAnswers)
    );
  
    if (!isValid) {
      console.error('❌ Hibás adatformátum:', this.evaluationAnswers);
      this.message = 'Hibás formátum: minden kérdéshez legalább 1 válasz kell.';
      return;
    }
  
    this.pollService.evaluatePoll(this.evaluatingPollId, this.evaluationAnswers).subscribe({
      next: () => {
        this.message = 'Kiértékelés sikeresen elmentve.';
        this.fetchAllPolls();
        this.evaluatingPollId = null;
      },
      error: (err) => {
        console.error('Hiba a kiértékelés során:', err);
        this.message = 'Nem sikerült elmenteni a kiértékelést.';
      }
    });
  }
  
  isPollEvaluated(poll: any): boolean {
    return poll.questions.every((q: any) => q.correctAnswers && q.correctAnswers.length > 0);
  }
  
}
