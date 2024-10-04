import { Component, inject, OnInit } from '@angular/core';
import { BookService, Book } from '../../services/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  books: Book[] = [];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe({
      next: (books) => this.books = books,
      error: (err) => console.error('Erreur lors du chargement des livres', err),
    });
  }

  borrowBook(id: number) {
    this.bookService.borrowBook(id).subscribe(() => this.loadBooks());
  }

  returnBook(id: number) {
    this.bookService.returnBook(id).subscribe(() => this.loadBooks());
  }

  deleteBook(id: number): void {
    this.bookService.deleteBook(id).subscribe(() => this.loadBooks());
  }
}
