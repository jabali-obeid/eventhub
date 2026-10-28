import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio para base de datos y uploads
const dbDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'eventos_sma.sqlite');
export const db = new Database(dbPath);

// Crear tablas relacionales con soporte de JSON y Foreign Keys
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      date TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      venueName TEXT NOT NULL,
      venueAddress TEXT NOT NULL,
      geoCoordinates TEXT,
      clientName TEXT,
      clientPhone TEXT,
      clientEmail TEXT,
      expectedGuests INTEGER DEFAULT 0,
      totalBudget REAL DEFAULT 0,
      organizerInCharge TEXT,
      bannerImage TEXT,
      notes TEXT,
      payments TEXT DEFAULT '[]',
      expenses TEXT DEFAULT '[]',
      timeline TEXT DEFAULT '[]',
      suppliers TEXT DEFAULT '[]',
      tasks TEXT DEFAULT '[]',
      guests TEXT DEFAULT '[]',
      attachments TEXT DEFAULT '[]',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
}
