import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Course {
  key: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'angular7-firebase';

  coursesCollection: AngularFirestoreCollection<Course>;
  courses: Observable<Course[]>;
  snapshot: any;

  constructor(private afs: AngularFirestore) { }

  public update(key: string) {
    console.log(key);
  }

  ngOnInit() {
    this.coursesCollection = this.afs.collection('courses');
    // this.courses = this.coursesCollection.valueChanges(); // observable of notes data
    this.snapshot = this.coursesCollection.snapshotChanges().pipe(
        map(
          changes => changes.map(c => ({ key: c.payload.doc.id, ...c.payload.doc.data() }))
        )
    );

    this.courses = this.snapshot;

  }
}
