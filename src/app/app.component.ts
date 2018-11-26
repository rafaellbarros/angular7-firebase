import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';


interface Course {
  key: string;
  title: string;
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
    this.coursesCollection = this.db.collection('courses');
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

  logout() {
    this.afAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));

  }

  public update(key: string): void {
    this.courseDoc = this.db.doc(`courses/${key}`);

    this.db.firestore.runTransaction(transaction =>
      transaction.get(this.courseDoc.ref).then(doc => {
        if (!doc.exists) {
          throw 'Documento não existe!';
        }

        this.total = doc.data().votes || 0;
        this.total++;
        transaction.update(this.courseDoc.ref, { votes: this.total});
      })
    );
  }
}
