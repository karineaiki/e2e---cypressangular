import { Component } from '@angular/core';
import { BookService, Book } from '../../services/book.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-book',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent {
  title = '';
  author = '';
  totalCopies: number = 0;

  constructor(private bookService: BookService, private router: Router) { }

  addBook() {
    const newBook: Book = {
      title: this.title,
      author: this.author,
      availableCopies: this.totalCopies,
      totalCopies: this.totalCopies
    };
    this.bookService.addBook(newBook).subscribe({
      next: () => this.router.navigate(['']),
      error: (err) => console.error(err),
    });
  }
}
