import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { AddBookComponent } from './components/add-book/add-book.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'add', component: AddBookComponent },
];
