import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: AppComponent }
];

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBNNCAfk5SiMuoMhrUz7VWOIIW3Jgmb4TE",
  authDomain: "voting-son-dev.firebaseapp.com",
  databaseURL: "https://voting-son-dev.firebaseio.com",
  projectId: "voting-son-dev",
  storageBucket: "voting-son-dev.appspot.com",
  messagingSenderId: "752662353365"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule {}
