import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { marked } from 'marked';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-chat-ai',
  templateUrl: './chat-ai.component.html',
  styleUrls: ['./chat-ai.component.scss'],
  standalone: false
})
export class ChatAiComponent {
  
  messages: Message[] = [];
  userInput = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  sendMessage(): void {
    const content = this.userInput.trim();
    if (!content) return;

    this.messages.push({ role: 'user', content });
    this.userInput = '';
    this.isLoading = true;

    const payload = {
      messages: [
        ...this.messages.map(m => ({ role: m.role, content: m.content }))
      ]
    };

    this.http.post<any>('http://localhost:3000/api/chat', payload).subscribe({
      next: (res) => {
        const reply = res.choices?.[0]?.message?.content || '[Nincs válasz]';
        this.messages.push({ role: 'assistant', content: reply });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({ role: 'assistant', content: '[Hiba történt a válasz lekérésekor.]' });
        this.isLoading = false;
      }
    });
  }

  clearChat(): void {
    this.messages = [];
  }

  parseMarkdown(text: string): string {
    return marked.parse(text) as string;
  }
}
