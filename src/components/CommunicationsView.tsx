import React, { useState } from 'react';
import { 
  Mail, 
  Smartphone,
  Copy,
  Check
} from 'lucide-react';
import type { EventItem } from '../types/event';
import { formatDateSpanish } from '../utils/formatters';
import { TENANT_CONFIG } from '../config/tenantConfig';

interface CommunicationsViewProps {
  events: EventItem[];
  onSelectEvent?: (event: EventItem) => void;
}

export const CommunicationsView: React.FC<CommunicationsViewProps> = ({ events }) => {
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentEvent = events.find(e => e.id === selectedEventId) || events[0];
  const primaryBank = TENANT_CONFIG.virtualCards[0];

  const templates = [
    {
      title: 'Recordatorio de Cuota / Saldo - Graduación o Fiesta',
      subject: `[${TENANT_CONFIG.company.name}] Aviso de cuota: ${currentEvent?.title || 'Tu Evento'}`,
      body: `Hola delegados y familias del ${currentEvent?.title || 'colegio'},\n\nLes recordamos que se aproxima la fecha límite para completar la seña del evento que celebraremos el ${formatDateSpanish(currentEvent?.date || '')} en ${currentEvent?.venueName || TENANT_CONFIG.company.tagline}.\n\n${primaryBank?.accountType || 'Cuenta'}: ${primaryBank?.cbuOrCvu || ''}\nAlias: ${primaryBank?.alias || ''}\nTitular: ${primaryBank?.holder || ''}\n\nPor favor envíen el comprobante de transferencia por este medio indicando el nombre del alumno/asistente. ¡Muchas gracias!`
    },
    {
      title: 'Cronograma y Horarios Oficiales para Familias',
      subject: `[${TENANT_CONFIG.company.name}] Cronograma de ingreso e información para ${currentEvent?.title || 'el evento'}`,
      body: `Estimada comunidad de ${currentEvent?.title || TENANT_CONFIG.company.tagline},\n\nCompartimos los detalles del evento:\n📍 Ubicación: ${currentEvent?.venueName || 'Salón'} (${currentEvent?.venueAddress || TENANT_CONFIG.company.locationDefault})\n📅 Fecha: ${formatDateSpanish(currentEvent?.date || '')}\n⏰ Horario de recepción: ${currentEvent?.startTime || '21:00'} hs\n👔 Código de vestimenta: Elegante / Fiesta\n\nRecordar presentar el DNI en el acceso para la lista de invitados. ¡Los esperamos para una noche inolvidable!`
    },
    {
      title: 'Confirmación y Firma de Menú / Restricciones Alimentarias',
      subject: `[${TENANT_CONFIG.company.name}] Solicitud de celíacos y dietas especiales - ${currentEvent?.title || 'Evento'}`,
      body: `Hola a todos,\n\nEstamos cerrando el servicio gastronómico y de catering para ${currentEvent?.title}. Necesitamos nos confirmen hasta el próximo viernes si algún invitado requiere menú celíaco (sin TACC), vegetariano o vegano.\n\nCualquier consulta estamos a su disposición.`
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-2xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'var(--primary-accent)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(249, 95, 53, 0.3)'
          }}>
            <Mail size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Comunicaciones & Circulares
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Plantillas oficiales de WhatsApp y correo para delegados, colegios y clientes de San Martín de los Andes.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>Evento Activo:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: '0.84rem'
            }}
          >
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Comunicaciones */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {templates.map((tpl, idx) => (
          <div key={idx} style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'var(--primary-subtle)',
                  color: 'var(--primary-accent)'
                }}>
                  Plantilla #{idx + 1}
                </span>
                <button
                  onClick={() => handleCopy(tpl.body, idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    color: copiedIndex === idx ? '#10b981' : 'var(--text-secondary)'
                  }}
                >
                  {copiedIndex === idx ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                  {copiedIndex === idx ? '¡Copiado!' : 'Copiar Texto'}
                </button>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {tpl.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Asunto sugerido: <strong>{tpl.subject}</strong>
              </p>

              <div style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                maxHeight: '220px',
                overflowY: 'auto'
              }}>
                {tpl.body}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(tpl.body)}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  textDecoration: 'none'
                }}
              >
                <Smartphone size={14} /> Enviar a WhatsApp
              </a>

              <a
                href={`mailto:?subject=${encodeURIComponent(tpl.subject)}&body=${encodeURIComponent(tpl.body)}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  textDecoration: 'none'
                }}
              >
                <Mail size={14} /> Enviar por Email
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
