type Book = {
    id: number;
    name: string;
    author: string;
    publication: Date;
    description: string;
    pngBlob: any;
};

type ClientSession = {
    clientSecret: string;
    clientId: string;
}
type User = {
    id: number;
    firstname: string;
    surname: string;
    email: string;
    borrowedBooks?: Book[];
    openSessions: ClientSession[];
};

type BookBorrow = {
    bookId: number;
    userId: number;
    endDate: Date;
};

class Library {
    books: Map<number, Book>;
    users: Map<number, User>;
    borrowedBooks: Map<number, BookBorrow>;

    constructor(books: Map<number, Book> = new Map(), users: Map<number, User> = new Map(), borrowedBooks: Map<number, BookBorrow> = new Map()) {
        this.books = books;
        this.users = users;
        this.borrowedBooks = borrowedBooks;
    }

    addBook(book: Book) {
        this.books.set(book.id, book);
    }
    addUser(user: User) {
        this.users.set(user.id, user);
    }
    borrowBook(bookId: number, userId: number, endDate: Date) {
        this.borrowedBooks.set(bookId, { bookId, userId, endDate });
    }
    returnBook(bookId: number) {
        this.borrowedBooks.delete(bookId);
    }
}