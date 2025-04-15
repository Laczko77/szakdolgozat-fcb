import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../shared/menu/menu.component';
import { HomeComponent } from './pages/main/home/home.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NewsDetailComponent } from './pages/news/news-detail/news-detail.component';
import { NewsCreateComponent } from './pages/news/news-create/news-create.component';


@NgModule({ declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ProfileComponent,
        MenuComponent,
        HomeComponent,
        NewsDetailComponent,
        NewsCreateComponent

    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        SlickCarouselModule,
        ReactiveFormsModule,
        CommonModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
