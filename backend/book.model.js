const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE Book (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      availableCopies INTEGER NOT NULL CHECK (availableCopies >= 0),
      totalCopies INTEGER NOT NULL CHECK (totalCopies > 0)
    )
  `);
});

const getAllBooks = (callback) => {
  db.all("SELECT * FROM Book", [], (err, rows) => {
    callback(err, rows);
  });
};

const getBookById = (id, callback) => {
  db.get("SELECT * FROM Book WHERE id = ?", [id], (err, row) => {
    callback(err, row);
  });
};

const createBook = (book, callback) => {
  const { title, author, availableCopies, totalCopies } = book;
  db.run(
    "INSERT INTO Book (title, author, availableCopies, totalCopies) VALUES (?, ?, ?, ?)",
    [title, author, availableCopies, totalCopies],
    function (err) {
      callback(err, this.lastID);
    }
  );
};

const borrowBook = (id, callback) => {
  getBookById(id, (err, book) => {
    if (err || !book) return callback(err || new Error("Book not found"));
    if (book.availableCopies > 0) {
      const availableCopies = book.availableCopies - 1;
      db.run(
        "UPDATE Book SET availableCopies = ? WHERE id = ?",
        [availableCopies, id],
        function (err) {
          callback(err, this.changes);
        }
      );
    } else {
      callback(new Error("No copies available"));
    }
  });
};

const returnBook = (id, callback) => {
  getBookById(id, (err, book) => {
    if (err || !book) return callback(err || new Error("Book not found"));
    if (book.availableCopies < book.totalCopies) {
      const availableCopies = book.availableCopies + 1;
      db.run(
        "UPDATE Book SET availableCopies = ? WHERE id = ?",
        [availableCopies, id],
        function (err) {
          callback(err, this.changes);
        }
      );
    } else {
      callback(new Error("All copies are already returned"));
    }
  });
};

const deleteBook = (id, callback) => {
  db.run("DELETE FROM Book WHERE id = ?", [id], function (err) {
    callback(err, this.changes);
  });
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  borrowBook,
  returnBook,
  deleteBook,
};
