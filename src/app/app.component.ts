import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  coursesCollection: AngularFirestoreCollection<Course>;
  courseDoc: AngularFirestoreDocument<Course>;
  courses: Observable<Course[]>;
  snapshot: any;

  total: number;

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    this.coursesCollection = this.db.collection('courses');
    // this.courses = this.coursesCollection.valueChanges(); // observable of notes data
    this.snapshot = this.coursesCollection.snapshotChanges().pipe(
      map(
        changes => changes.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }))
      )
    );
    this.courses = this.snapshot;
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
