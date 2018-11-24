import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'angular7-firebase';

  items: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.items = db.collection('/courses').valueChanges();
  }
}
