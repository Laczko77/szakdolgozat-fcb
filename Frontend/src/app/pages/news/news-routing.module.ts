import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewsCreateComponent } from './news-create/news-create.component';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { AuthGuard } from '../../../shared/services/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent }, // /home
  { path: 'news/create', component: NewsCreateComponent, canActivate: [AuthGuard], data: { adminOnly: true } },
  { path: 'news/:id', component: NewsDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule {}
