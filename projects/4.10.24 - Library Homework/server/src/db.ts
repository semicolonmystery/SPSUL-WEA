import * as sqlite3 from "sqlite3";
import { User, Book, BookBorrow, ClientSession } from "./data.js";

export class LibraryDB {
    db: sqlite3.Database;

    constructor(file: string) {
        this.db = new sqlite3.Database(file);
    }

    setup() {
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT,
                firstname TEXT,
                surname TEXT,
                email TEXT,
                hashedPassword TEXT,
                UNIQUE(username, email) ON CONFLICT IGNORE
            );
            
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY,
                name TEXT,
                author TEXT,
                publication DATE,
                description TEXT,
                pngBlob BLOB
            );

            CREATE TABLE IF NOT EXISTS bookBorrows (
                bookId INTEGER,
                userId INTEGER UNIQUE,
                endDate DATE,
                FOREIGN KEY (bookId) REFERENCES books(id),
                FOREIGN KEY (userId) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS clientSessions (
                userId INTEGER,
                clientSecret TEXT,
                clientId TEXT,
                expiration DATE,
                FOREIGN KEY (userId) REFERENCES users(id),
                UNIQUE(clientId, clientSecret) ON CONFLICT IGNORE
            );
        `);
    }

    addUsers(users: User | User[]): User[] {
        const self = this;
        let usersOut: User[] = [];

        if (!Array.isArray(users)) users = [users];
        const stmt = this.db.prepare("INSERT INTO users (username, firstname, surname, email, hashedPassword) VALUES (?, ?, ?, ?, ?)");
        for (const u of users) {
            if (u.update || typeof u.update === "undefined") {
                stmt.run(u.username, u.firstname, u.surname, u.email, u.hashedPassword, function (err) {
                    if (self.checkError(err)) return;
                    if (!u.id) u.id = this.lastId;
                    usersOut.push(u);
                });
            }
        }
        stmt.finalize();

        return usersOut;
    }

    addBooks(books: Book | Book[]): Book[] {
        const self = this;
        let booksOut: Book[] = [];
        
        if (!Array.isArray(books)) books = [books];
        const stmt = this.db.prepare("INSERT INTO books (name, author, publication, description, pngBlob) VALUES (?, ?, ?, ?, ?)");
        for (const b of books) {
            if (b.update || typeof b.update === "undefined") {
                stmt.run(b.name, b.author, b.publication.toISOString(), b.description, b.pngBlob, function (err) {
                    if (self.checkError(err)) return;
                    if (!b.id) b.id = this.lastId;
                    booksOut.push(b);
                });
            }
        }
        stmt.finalize();

        return booksOut;

    }

    borrowBooks(bookBorrow: BookBorrow) {
        this.db.run("INSERT INTO bookBorrows (bookId, userId, endDate) VALUES (?, ?, ?)", bookBorrow.bookId, bookBorrow.userId, bookBorrow.endDate.toISOString(), (err) => {
            if (this.checkError(err)) return;
        });
    }

    returnBook(bookId: number) {
        this.db.run("DELETE FROM bookBorrows WHERE bookId = ?", bookId);
    }

    getBook(bookId: number): Book {
        return this.db.get("SELECT * FROM books WHERE id = ?", bookId) as any;
    }

    getBooks(): Book[] {
        let r: any[] = [];
        this.db.all("SELECT rowid AS id, name, author, publication, description, pngBlob FROM books", (err, rows) => {
            if (this.checkError(err)) return;
            r = rows;
        });
        r.forEach(book => book.date = new Date(book.date));
        return r;
    }

    getUsers(): User[] {
        let r = [];
        this.db.all("SELECT rowid AS id, username, firstname, surname, email, hashedPassword FROM users", (err, rows) => {
            if (this.checkError(err)) return;
            r = rows;
        });
        return r;
    }

    getBookBorrows(): BookBorrow[] {
        this.db.all("SELECT * FROM bookBorrows", (err, rows) => {
            if (this.checkError(err)) return;
            return rows;
        });
        return [];
    }

    getSession(userId: number): Promise<ClientSession | undefined> {
        return this.db.get("SELECT * FROM clientSessions WHERE userId = ?", userId) as any;
    }

    removeSession(userId: number) {
        this.db.run("DELETE FROM clientSessions WHERE userId = ?", userId);
    }

    private generateRandomString(length: number): string {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    private generateUniqueClientId(): string {
        let clientId;
        do {
            clientId = this.generateRandomString(16);
        } while ((this.db.get("SELECT COUNT(*) as count FROM clientSessions WHERE clientId = ?", clientId) as any).count > 0);
        return clientId;
    }

    private generateUniqueClientSecret(): string {
        let clientSecret;
        do {
            clientSecret = this.generateRandomString(32);
        } while ((this.db.get("SELECT COUNT(*) as count FROM clientSessions WHERE clientSecret = ?", clientSecret) as any).count > 0);
        return clientSecret;
    }

    addSession(userId: number, session: ClientSession) {
        const clientId = this.generateUniqueClientId();
        const clientSecret = this.generateUniqueClientSecret();
        const stmt = this.db.prepare("INSERT INTO clientSessions (userId, clientSecret, clientId, expiration) VALUES (?, ?, ?, ?)");
        stmt.run(userId, clientSecret, clientId, session.expiration.toISOString());
        stmt.finalize();
        return { clientId, clientSecret };
    }

    private checkError(err: Error): boolean {
        if (err) { console.log(err.message); }
        return typeof err === "undefined";
    }

    close() { this.db.close(); }
}