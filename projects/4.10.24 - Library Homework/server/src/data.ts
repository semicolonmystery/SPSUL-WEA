import { LibraryDB } from "./db.js";

export type Book = {
    id?: number;
    name: string;
    author: string;
    publication: Date;
    description: string;
    pngBlob: any;
    update?: boolean;
};

export type ClientSession = {
    clientId: string;
    clientSecret: string;
    expiration: Date;
}
export type User = {
    id?: number;
    username: string;
    firstname: string;
    surname: string;
    email: string;
    borrowedBooks?: Book[];
    openSessions?: ClientSession[];
    hashedPassword: string;
    update?: boolean;
};

export type BookBorrow = {
    bookId: number;
    userId: number;
    endDate: Date;
};

// vím že je to nesmislné ukládat do ramky ale podle zadání to dává nejvíce smysl
// je to neefektivní a pomalí
export class Library {
    private books: Map<number, Book>;
    private newBooks: number[];
    private users: Map<number, User>;
    private newUsers: number[];
    private bookBorrows: Map<number, BookBorrow>;
    private newBookBorrows: number[];
    private db: LibraryDB;
    private booksBuffer: Map<Book, boolean> = new Map<Book, boolean>();
    private usersBuffer: Map<User, boolean> = new Map<User, boolean>();
    private bookBorrowsBuffer: Map<BookBorrow, boolean> = new Map<BookBorrow, boolean>();

    constructor(loadFrom: string = "library.db") {
        this.db = new LibraryDB(loadFrom);

        this.db.getBooks().then((books => {
            this.books = this.arrayToMap(books);
        }));
        this.db.getUsers().then((users => {
            this.users = this.arrayToMap(users);
        }));
        this.db.getBookBorrows().then((bookBorrows => {
            this.bookBorrows = this.arrayToMap(bookBorrows);
        }));
    }

    private arrayToMap<T extends object>(array: T[]): Map<number, T> {
        const map = new Map<number, T>();

        for (const element of array) {
            if ("id" in element) map.set((element as any).id, element);
            else if ("userId" in element) map.set((element as any).userId, element);
        }

        return map;
    }

    addBook(book: Book) {
        if (typeof this.books !== "undefined") {
            if (typeof book.id !== "undefined")
                this.books.set(book.id, book);
            else {
                const newId = this.findNextNumber(Array.from(this.books.keys()));
                this.books.set(newId, book);
                this.newBooks.push(newId);
            }
        } else this.booksBuffer.set(book, true);
    }
    addUser(user: User) {
        if (typeof this.users !== "undefined") {
            if (typeof user.id !== "undefined")
                this.users.set(user.id, user);
            else {
                const newId = this.findNextNumber(Array.from(this.users.keys()));
                this.users.set(newId, user);
                this.newUsers.push(newId);
            }
        } else this.usersBuffer.set(user, true);
    }
    borrowBook(bookBorrow: BookBorrow) {
        if (typeof this.bookBorrows !== "undefined")
            this.bookBorrows.set(bookBorrow.bookId, bookBorrow);
        else this.bookBorrowsBuffer.set(bookBorrow, true);
    }
    returnBook(bookId: number) {
        if (typeof this.bookBorrows !== "undefined")
            this.bookBorrows.delete(bookId);
        else this.bookBorrowsBuffer.set({bookId, userId: -1, endDate: new Date(-1)}, false);
    }

    getBooks(): Book[] { return Array.from(this.books.values()); }
    getBook(id: number): Book { return this.books.get(id); }

    getUsers(): User[] { return Array.from(this.users.values()); }
    getUser(id: number): User { return this.users.get(id); }

    getBookBorrows(userId?: number): BookBorrow[] {
        if (typeof userId !== "undefined") {
            let bookBorrows = [];
            Array.from(this.bookBorrows.values()).forEach(bookBorrow => {
                if (bookBorrow.userId == userId)
                    bookBorrows.push(bookBorrow);
            });
    
            return bookBorrows;
        }
        return Array.from(this.bookBorrows.values());
    }

    private findNextNumber(nums: number[]): number {
        nums.sort((a, b) => a - b);
        for (let i = 0; i < nums.length; i++) {
            if (nums[i] !== i + 1) return i + 1;
        }
        return nums.length + 1;
    }

    save() {
        for (const user of this.getUsers()) {
            if (this.newUsers.includes(user.id))
                this.db.addUsers(user);
            else this.db.setUsers(user);
        }

        for (const book of this.getBooks()) {
            if (this.newBooks.includes(book.id))
                this.db.addBooks(book);
            else this.db.setBooks(book);
        }
    }
    close() {
        this.save();
        this.db.close();
    }
}