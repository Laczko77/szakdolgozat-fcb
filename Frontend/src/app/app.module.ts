import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../shared/menu/menu.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ForumComponent } from './pages/forum/forum/forum.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from '../shared/footer/footer.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

registerLocaleData(localeHu);


@NgModule({ declarations: [
        AppComponent,
        RegisterComponent,
        LoginComponent,
        ProfileComponent,
        MenuComponent,
        FooterComponent,


    ],
    bootstrap: [
        AppComponent
    ], 
    
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        SlickCarouselModule,
        ReactiveFormsModule,
        CommonModule,
        MatSnackBarModule,
        BrowserAnimationsModule
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        { provide: LOCALE_ID, useValue: 'hu-HU' }
        
        
    ] 

        
    
    })
export class AppModule {}
