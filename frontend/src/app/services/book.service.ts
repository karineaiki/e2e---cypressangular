import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Book {
  id?: number;
  title: string;
  author: string;
  availableCopies: number;
  totalCopies: number;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      catchError(this.handleError<Book[]>('getBooks', []))
    );
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book).pipe(
      catchError(this.handleError<Book>('addBook'))
    );
  }

  borrowBook(id: number): Observable<any> {
    const borrowUrl = `${this.apiUrl}/${id}/borrow`;
    return this.http.put(borrowUrl, {}).pipe(
      catchError(this.handleError<any>('borrowBook'))
    );
  }

  returnBook(id: number): Observable<any> {
    const returnUrl = `${this.apiUrl}/${id}/return`;
    return this.http.put(returnUrl, {}).pipe(
      catchError(this.handleError<any>('returnBook'))
    );
  }

  deleteBook(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError<any>('deleteBook'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
