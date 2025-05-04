import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ForumService } from '../../../../shared/services/forum.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {trigger, transition, style, animate} from '@angular/animations';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  standalone: false,
  animations: [
    trigger('fadeSwitch', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ForumComponent implements OnInit, AfterViewInit {
  posts: any[] = [];
  text: string = '';
  selectedFile: File | null = null;
  editPostId: string | null = null;
  editText: string = '';
  editFile: File | null = null;
  editingCommentId: string | null = null;
  editingCommentText: string = '';
  showAI = false;
  expandedPostId: string | null = null;
  commentInputs: { [postId: string]: string } = {};
  @ViewChildren('fadeElement') fadeElements!: QueryList<ElementRef>;

  constructor(
    private forumService: ForumService,
    public auth: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPosts();
  }


  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
        
      });
    }, {
      threshold: 0.08
    });

    this.fadeElements.changes.subscribe((elements: QueryList<ElementRef>) => {
      elements.forEach((el) => observer.observe(el.nativeElement));
    });

    // Azonnal is lefuttatjuk, ha már van elem
    this.fadeElements.forEach((el) => observer.observe(el.nativeElement));
  }


  toggleAI(): void {
    this.showAI = !this.showAI;
  }

  loadPosts(): void {
    this.forumService.getPosts().subscribe(posts => {
      this.posts = posts.map(post => ({
        ...post,
        likedByCurrentUser: post.likes?.includes(this.auth.getUsername()) || false
      }));
    });
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  isOwnPost(post: any): boolean {
    return post.userId === this.auth.getUserId();
  }
  

  isOwnComment(comment: any): boolean {
    return comment.userId === this.auth.getUserId();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.editFile = input.files[0];
    }
  }

  submitPost(): void {
    if (!this.text && !this.selectedFile) {
      this.snackBar.open('A poszt nem lehet üres!', 'OK', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('text', this.text);
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.forumService.createPost(formData).subscribe(() => {
      this.text = '';
      this.selectedFile = null;
      this.loadPosts();
      this.snackBar.open('Poszt elküldve!', 'Ok', { duration: 3000 });
    });
  }

  startEdit(post: any): void {
    this.editPostId = post._id;
    this.editText = post.text;
    this.editFile = null;
  }

  cancelEdit(): void {
    this.editPostId = null;
    this.editText = '';
    this.editFile = null;
  }

  submitEdit(): void {
    if (!this.editPostId) return;

    const formData = new FormData();
    formData.append('text', this.editText);
    if (this.editFile) formData.append('image', this.editFile);

    this.forumService.updatePost(this.editPostId, formData).subscribe(() => {
      this.cancelEdit();
      this.loadPosts();
      this.snackBar.open('Poszt frissítve!', 'OK', { duration: 3000 });
    });
  }

  deletePost(id: string): void {
    this.forumService.deletePost(id).subscribe(() => {
      this.loadPosts();
      this.snackBar.open('Poszt törölve.', 'OK', { duration: 3000 });
    });
  }

  likePost(post: any): void {
    this.forumService.likePost(post._id).subscribe({
      next: () => this.loadPosts(),
      error: () => this.snackBar.open('Már lájkoltad ezt a posztot.', 'Ok', { duration: 3000 })
    });
  }

  toggleComments(postId: string): void {
    this.expandedPostId = this.expandedPostId === postId ? null : postId;
  }

  addComment(postId: string): void {
    const text = this.commentInputs[postId];
    if (!text?.trim()) return;

    this.forumService.addComment(postId, text).subscribe(() => {
      this.commentInputs[postId] = '';
      this.loadPosts();
    });
  }

  deleteComment(postId: string, comment: any): void {
    this.forumService.deleteComment(postId, comment._id).subscribe(() => {
      this.loadPosts();
    });
  }


  startEditComment(postId: string, comment: any): void {
    this.expandedPostId = postId;
    this.editingCommentId = comment._id;
    this.editingCommentText = comment.text;
  } 
  
  cancelEditComment(): void {
    this.editingCommentId = null;
    this.editingCommentText = '';
  }
  
  submitEditComment(postId: string): void {
    if (!this.editingCommentId) return;
  
    this.forumService.updateComment(postId, this.editingCommentId, this.editingCommentText)
      .subscribe(() => {
        this.cancelEditComment();
        this.loadPosts();
      });
  }
  
}
