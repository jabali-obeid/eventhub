import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { db, initDatabase } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Carpeta física para contratos en PDF, planos y comprobantes subidos
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// Configuración de Multer para almacenar archivos con nombres seguros
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// Helper para deserializar JSON de columnas
function parseEventRow(row: any) {
  if (!row) return null;
  return {
    ...row,
    payments: JSON.parse(row.payments || '[]'),
    expenses: JSON.parse(row.expenses || '[]'),
    timeline: JSON.parse(row.timeline || '[]'),
    suppliers: JSON.parse(row.suppliers || '[]'),
    tasks: JSON.parse(row.tasks || '[]'),
    guests: JSON.parse(row.guests || '[]'),
    attachments: JSON.parse(row.attachments || '[]'),
  };
}

// 1. Obtener todos los eventos
app.get('/api/events', (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
    const events = rows.map(parseEventRow);
    res.json(events);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Obtener un evento por ID
app.get('/api/events/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(parseEventRow(row));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Crear un nuevo evento
app.post('/api/events', (req, res) => {
  try {
    const evt = req.body;
    const stmt = db.prepare(`
      INSERT INTO events (
        id, title, category, status, date, startTime, endTime, venueName, venueAddress,
        geoCoordinates, clientName, clientPhone, clientEmail, expectedGuests, totalBudget,
        organizerInCharge, bannerImage, notes, payments, expenses, timeline, suppliers,
        tasks, guests, attachments, createdAt, updatedAt
      ) VALUES (
        @id, @title, @category, @status, @date, @startTime, @endTime, @venueName, @venueAddress,
        @geoCoordinates, @clientName, @clientPhone, @clientEmail, @expectedGuests, @totalBudget,
        @organizerInCharge, @bannerImage, @notes, @payments, @expenses, @timeline, @suppliers,
        @tasks, @guests, @attachments, @createdAt, @updatedAt
      )
    `);

    stmt.run({
      id: evt.id || `evt-${Date.now()}`,
      title: evt.title,
      category: evt.category || 'egresados',
      status: evt.status || 'confirmado',
      date: evt.date,
      startTime: evt.startTime || '21:30',
      endTime: evt.endTime || '06:00',
      venueName: evt.venueName,
      venueAddress: evt.venueAddress,
      geoCoordinates: evt.geoCoordinates || '',
      clientName: evt.clientName || '',
      clientPhone: evt.clientPhone || '',
      clientEmail: evt.clientEmail || '',
      expectedGuests: evt.expectedGuests || 0,
      totalBudget: evt.totalBudget || 0,
      organizerInCharge: evt.organizerInCharge || 'Nico Rossi (SMA)',
      bannerImage: evt.bannerImage || '',
      notes: evt.notes || '',
      payments: JSON.stringify(evt.payments || []),
      expenses: JSON.stringify(evt.expenses || []),
      timeline: JSON.stringify(evt.timeline || []),
      suppliers: JSON.stringify(evt.suppliers || []),
      tasks: JSON.stringify(evt.tasks || []),
      guests: JSON.stringify(evt.guests || []),
      attachments: JSON.stringify(evt.attachments || []),
      createdAt: evt.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const created = db.prepare('SELECT * FROM events WHERE id = ?').get(evt.id);
    res.status(201).json(parseEventRow(created));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Actualizar un evento existente
app.put('/api/events/:id', (req, res) => {
  try {
    const evt = req.body;
    const stmt = db.prepare(`
      UPDATE events SET
        title = @title,
        category = @category,
        status = @status,
        date = @date,
        startTime = @startTime,
        endTime = @endTime,
        venueName = @venueName,
        venueAddress = @venueAddress,
        geoCoordinates = @geoCoordinates,
        clientName = @clientName,
        clientPhone = @clientPhone,
        clientEmail = @clientEmail,
        expectedGuests = @expectedGuests,
        totalBudget = @totalBudget,
        organizerInCharge = @organizerInCharge,
        bannerImage = @bannerImage,
        notes = @notes,
        payments = @payments,
        expenses = @expenses,
        timeline = @timeline,
        suppliers = @suppliers,
        tasks = @tasks,
        guests = @guests,
        attachments = @attachments,
        updatedAt = @updatedAt
      WHERE id = @id
    `);

    stmt.run({
      id: req.params.id,
      title: evt.title,
      category: evt.category,
      status: evt.status,
      date: evt.date,
      startTime: evt.startTime,
      endTime: evt.endTime,
      venueName: evt.venueName,
      venueAddress: evt.venueAddress,
      geoCoordinates: evt.geoCoordinates || '',
      clientName: evt.clientName || '',
      clientPhone: evt.clientPhone || '',
      clientEmail: evt.clientEmail || '',
      expectedGuests: evt.expectedGuests || 0,
      totalBudget: evt.totalBudget || 0,
      organizerInCharge: evt.organizerInCharge || '',
      bannerImage: evt.bannerImage || '',
      notes: evt.notes || '',
      payments: JSON.stringify(evt.payments || []),
      expenses: JSON.stringify(evt.expenses || []),
      timeline: JSON.stringify(evt.timeline || []),
      suppliers: JSON.stringify(evt.suppliers || []),
      tasks: JSON.stringify(evt.tasks || []),
      guests: JSON.stringify(evt.guests || []),
      attachments: JSON.stringify(evt.attachments || []),
      updatedAt: new Date().toISOString()
    });

    const updated = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
    res.json(parseEventRow(updated));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Eliminar un evento
app.delete('/api/events/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM events WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Evento eliminado correctamente' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Subir archivo físico a disco (PDF de contratos, planos, fotos)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió ningún archivo' });
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({
      name: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      filename: req.file.filename,
      url: fileUrl
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Servidor de Eventos SMA] Corriendo en http://localhost:${PORT}`);
});
