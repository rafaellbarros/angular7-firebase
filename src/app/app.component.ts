import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

interface Course {
  key?: string;
  color: string;
  title: string;
  users: string[];
  votes: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'angular7-firebase';
  private user: Observable<firebase.User>;
  public userDetails: firebase.User = null;
  coursesCollection: AngularFirestoreCollection<Course>;
  courseDoc: AngularFirestoreDocument<Course>;
  courses: Observable<Course[]>;
  snapshot: any;
  total: number;

  constructor(
    private router: Router,
    private db: AngularFirestore,
    private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.user = this.afAuth.user;
    this.coursesCollection = this.db.collection('courses', ref => {
      return ref.orderBy('votes', 'desc');
    });
    this.snapshot = this.coursesCollection.snapshotChanges().pipe(
      map(
        changes => changes.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }))
      )
    );
    this.courses = this.snapshot;

    this.user.subscribe(user => {
      if (user) {
        this.userDetails = user;
        console.log(this.userDetails);
      } else {
        this.userDetails = null;
      }
    });
  }

  public signInWithGithub() {
    const provider = new firebase.auth.GithubAuthProvider();
    return this.afAuth.auth.signInWithPopup(provider);
  }

  public logout(): void {
    this.afAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }

  public create(e: any, value: string): void {
    e.preventDefault();

    const emails = [
      this.userDetails.email
    ];

    const data: Course = {
      title: value,
      color: this.getColor(),
      users: emails,
      votes: 1
    };

    this.coursesCollection.add(data);
  }

  public remove(key: string): void {
    this.coursesCollection.doc(key).delete();
  }

  private getColor() {
    const colors = [
     'mdl-color--red',
     'mdl-color--blue',
     'mdl-color--green',
     'mdl-color--yellow',
     'mdl-color--orange',
     'mdl-color--lime',
     'mdl-color--indigo',
     'mdl-color--pink',
     'mdl-color--purple',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

  public update(key: string): void {
    this.courseDoc = this.db.doc(`courses/${key}`);

    this.db.firestore.runTransaction(transaction =>

      transaction.get(this.courseDoc.ref).then(doc => {
        if (!doc.exists) {
          throw 'Documento não existe!';
        }

        const emails =  doc.data().users || [];

        console.log(emails);

        if (emails.indexOf(this.userDetails.email) >= 0) {
          return;
        }

        this.total = doc.data().votes || 0;
        this.total++;
        emails.push(this.userDetails.email);
        const data = {
          votes: this.total,
          users: emails
        };

        transaction.update(this.courseDoc.ref, data);
      })
    );
  }

}
