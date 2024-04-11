import * as sqlite3 from "sqlite3";

class LibraryDB {
    db: sqlite3.Database;

    constructor(file: string) {
        this.db = new sqlite3.Database(file);
    }

    async setup() {
        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                firstname TEXT,
                surname TEXT,
                email TEXT
            );
            
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY,
                name TEXT,
                author TEXT,
                publication DATE,
                description TEXT,
                pngBlob BLOB
            );
            
            CREATE TABLE IF NOT EXISTS borrowedBooks (
                bookId INTEGER,
                userId INTEGER,
                endDate DATE,
                FOREIGN KEY (bookId) REFERENCES books(id),
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `);
    }

    close() { this.db.close(); }
}