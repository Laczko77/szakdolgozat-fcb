import { Component, OnInit } from '@angular/core';
import { ForumService } from '../../../../shared/services/forum.service';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
  standalone: false
})
export class ForumComponent implements OnInit {
  text = '';
  image: File | null = null;
  posts: any[] = [];

  constructor(public forumService: ForumService, public auth: AuthService) {}

  ngOnInit() {
    this.loadPosts();
  }

  onFileSelected(event: any) {
    this.image = event.target.files[0];
  }

  submitPost() {
    const formData = new FormData();
    formData.append('text', this.text);
    if (this.image) formData.append('image', this.image);

    this.forumService.createPost(formData).subscribe(() => {
      this.text = '';
      this.image = null;
      this.loadPosts();
    });
  }

  loadPosts() {
    this.forumService.getPosts().subscribe((res: any) => {
      this.posts = res;
    });
  }

  deletePost(id: string) {
    this.forumService.deletePost(id).subscribe(() => {
      this.posts = this.posts.filter(p => p._id !== id);
    });
  }

  isOwnPost(post: any): boolean {
    return this.auth.getUsername() === post.username;
  }
}
