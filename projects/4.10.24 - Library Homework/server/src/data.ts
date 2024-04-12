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
    private users: Map<number, User>;
    private bookBorrows: Map<number, BookBorrow>;
    private db: LibraryDB;

    constructor(loadFrom: string = "library.db") {
        this.db = new LibraryDB(loadFrom);
        this.db.setup();

        this.books = this.arrayToMap(this.db.getBooks());
        this.users = this.arrayToMap(this.db.getUsers());
        this.bookBorrows = this.arrayToMap(this.db.getBookBorrows());
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
        this.books.set(book.id, book);
    }
    addUser(user: User) {
        this.users.set(user.id, user);
    }
    borrowBook(bookId: number, userId: number, endDate: Date) {
        this.bookBorrows.set(bookId, { bookId, userId, endDate });
    }
    returnBook(bookId: number) {
        this.bookBorrows.delete(bookId);
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

    save() {
        this.users = this.arrayToMap(this.db.addUsers(this.getUsers()));
        this.books = this.arrayToMap(this.db.addBooks(this.getBooks()));
    }
    close() {
        this.save();
        this.db.close();
    }
}