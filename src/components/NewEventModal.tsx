import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { EventItem, EventCategory, EventStatus } from '../types/event';
import { TENANT_CONFIG } from '../config/tenantConfig';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newEvent: EventItem) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('egresados');
  const [status, setStatus] = useState<EventStatus>('confirmado');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('21:30');
  const [endTime, setEndTime] = useState('06:00');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState(TENANT_CONFIG.company.locationDefault);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState(TENANT_CONFIG.company.phoneCodeDefault);
  const [clientEmail, setClientEmail] = useState('');
  const [expectedGuests, setExpectedGuests] = useState('250');
  const [totalBudget, setTotalBudget] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !venueName) return;

    const defaultImages: Record<EventCategory, string> = {
      egresados: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      boda: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      cumple15: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      corporativo: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      festival: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      social: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'
    };

    const newEvent: EventItem = {
      id: 'evt-' + Date.now(),
      title,
      category,
      status,
      date,
      startTime,
      endTime,
      venueName,
      venueAddress,
      clientName,
      clientPhone,
      clientEmail,
      expectedGuests: parseInt(expectedGuests) || 0,
      totalBudget: parseFloat(totalBudget) || 0,
      organizerInCharge: `${TENANT_CONFIG.producer.name} (${TENANT_CONFIG.producer.role})`,
      bannerImage: defaultImages[category],
      notes,
      payments: [],
      expenses: [],
      timeline: [
        {
          id: 'tl-init-1',
          time: startTime,
          title: 'Apertura de puertas y acreditación en puerta',
          status: 'pendiente'
        }
      ],
      suppliers: [],
      tasks: [
        {
          id: 'tsk-init-1',
          title: 'Tramitar habilitación municipal SMA y cobertura médica',
          assignedTo: 'Nico Rossi',
          dueDate: date,
          completed: false,
          priority: 'alta'
        }
      ],
      guests: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(newEvent);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div 
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-2xl)',
          padding: '2rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-modal)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Crear Nuevo Evento (San Martín de los Andes)
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Completá los datos para agendar la producción con mapa y ficha técnica.
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{ color: 'var(--text-muted)', padding: '0.4rem', borderRadius: '6px' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Nombre o Título del Evento *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Fiesta de Egresados 2026 - CPEM N° 13, Boda en Chapelco..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', fontSize: '0.92rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Categoría del Evento
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                style={{ width: '100%' }}
              >
                <option value="egresados">🎓 Fiesta de Egresados</option>
                <option value="boda">💍 Boda / Casamiento</option>
                <option value="cumple15">👑 Fiesta de 15</option>
                <option value="corporativo">💼 Evento Corporativo</option>
                <option value="festival">🎪 Festival / Concierto</option>
                <option value="social">🎉 Fiesta Social / Cumpleaños</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Estado
              </label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                style={{ width: '100%' }}
              >
                <option value="confirmado">Confirmado</option>
                <option value="prospecto">Borrador / Presupuestado</option>
                <option value="en_curso">En Vivo (Hoy)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Fecha del Evento *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Hora Inicio
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Hora Fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Salón / Predio / Hostería *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Salón Le Village, Loi Suites Chapelco..."
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Dirección exacta (SMA) para el mapa *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Gral. Roca 816, San Martín de los Andes"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Aforo Estimado (Invitados)
              </label>
              <input
                type="number"
                placeholder="250"
                value={expectedGuests}
                onChange={(e) => setExpectedGuests(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Presupuesto Total Acordado ($ ARS)
              </label>
              <input
                type="number"
                placeholder="14500000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Comisión / Cliente Responsable
              </label>
              <input
                type="text"
                placeholder="Ej: Comisión Egresados CPEM 13"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Teléfono de Contacto (SMA)
              </label>
              <input
                type="text"
                placeholder="+54 9 2972 ..."
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="contacto@gmail.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Notas y Requisitos Especiales (SMA)
            </label>
            <textarea
              rows={2}
              placeholder="Habilitación de nocturnidad, ambulancia, menús celíacos, sonido..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.65rem 1.35rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
                fontWeight: 600
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-accent)',
                color: '#ffffff',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(249, 95, 53, 0.35)'
              }}
            >
              Guardar y Crear Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
