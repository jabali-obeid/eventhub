import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Download, 
  Trash2, 
  Phone, 
  Mail, 
  Briefcase,
  UploadCloud,
  ExternalLink,
  Navigation
} from 'lucide-react';
import type { 
  EventItem, 
  PaymentRecord, 
  TimelineItem, 
  SupplierItem, 
  TaskItem, 
  GuestRecord, 
  AttachedFile 
} from '../types/event';
import { formatCurrency, formatDateSpanish, formatFileSize, getDaysRemaining } from '../utils/formatters';
import { eventService } from '../services/eventService';

interface EventDetailModalProps {
  event: EventItem;
  onBack: () => void;
  onUpdateEvent: (updated: EventItem) => void;
}

type TabType = 'resumen' | 'mapa' | 'finanzas' | 'itinerario' | 'proveedores' | 'tareas' | 'invitados' | 'archivos';

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onBack,
  onUpdateEvent
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('resumen');

  // Dirección editable para el mapa
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedAddress, setEditedAddress] = useState(event.venueAddress);
  const [editedVenue, setEditedVenue] = useState(event.venueName);

  // Formularios rápidos modales / inline
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayConcept, setNewPayConcept] = useState('');
  const [newPayAmount, setNewPayAmount] = useState('');
  const [newPayDate, setNewPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPayMethod, setNewPayMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('transferencia');
  const [newPayRef, setNewPayRef] = useState('');

  // Timeline
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [newTimeTitle, setNewTimeTitle] = useState('');
  const [newTimeResp, setNewTimeResp] = useState('');
  const [newTimeDesc, setNewTimeDesc] = useState('');

  // Proveedores
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [newSupType, setNewSupType] = useState('');
  const [newSupName, setNewSupName] = useState('');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupCost, setNewSupCost] = useState('');

  // Tareas
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssigned, setNewTaskAssigned] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'baja' | 'media' | 'alta' | 'urgente'>('media');

  // Invitados
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestCat, setNewGuestCat] = useState<'titular' | 'acompañante' | 'vip' | 'staff' | 'menor'>('titular');
  const [newGuestTable, setNewGuestTable] = useState('');
  const [newGuestDni, setNewGuestDni] = useState('');

  // Métricas financieras
  const totalPaid = event.payments.reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = Math.max(0, event.totalBudget - totalPaid);
  const percentCollected = event.totalBudget > 0 ? Math.round((totalPaid / event.totalBudget) * 100) : 0;
  
  const totalExpenses = event.expenses.reduce((acc, e) => acc + e.amount, 0);
  const estimatedProfit = event.totalBudget - totalExpenses;

  // Actualizar Dirección y Salón
  const handleSaveVenueAndAddress = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEvent({
      ...event,
      venueName: editedVenue,
      venueAddress: editedAddress,
      updatedAt: new Date().toISOString()
    });
    setIsEditingAddress(false);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayConcept || !newPayAmount) return;

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      concept: newPayConcept,
      amount: parseFloat(newPayAmount),
      date: newPayDate,
      method: newPayMethod,
      reference: newPayRef
    };

    onUpdateEvent({
      ...event,
      payments: [newPayment, ...event.payments],
      updatedAt: new Date().toISOString()
    });
    setShowAddPayment(false);
    setNewPayConcept('');
    setNewPayAmount('');
    setNewPayRef('');
  };

  const handleDeletePayment = (payId: string) => {
    if (!confirm('¿Eliminar este registro de pago?')) return;
    onUpdateEvent({
      ...event,
      payments: event.payments.filter(p => p.id !== payId),
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newTimeTitle) return;

    const newItem: TimelineItem = {
      id: 'tl-' + Date.now(),
      time: newTime,
      title: newTimeTitle,
      responsible: newTimeResp,
      description: newTimeDesc,
      status: 'pendiente'
    };

    const updatedTimeline = [...event.timeline, newItem].sort((a, b) => a.time.localeCompare(b.time));
    onUpdateEvent({
      ...event,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    });
    setShowAddTimeline(false);
    setNewTime('');
    setNewTimeTitle('');
    setNewTimeResp('');
    setNewTimeDesc('');
  };

  const handleToggleTimelineStatus = (id: string) => {
    const updatedTimeline = event.timeline.map(item => {
      if (item.id === id) {
        const nextStatus: TimelineItem['status'] = 
          item.status === 'pendiente' ? 'en_progreso' : 
          item.status === 'en_progreso' ? 'completado' : 'pendiente';
        return { ...item, status: nextStatus };
      }
      return item;
    });

    onUpdateEvent({
      ...event,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteTimeline = (id: string) => {
    onUpdateEvent({
      ...event,
      timeline: event.timeline.filter(t => t.id !== id),
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupType || !newSupName) return;

    const newSup: SupplierItem = {
      id: 'sup-' + Date.now(),
      serviceType: newSupType,
      name: newSupName,
      contactPerson: newSupContact,
      phone: newSupPhone,
      cost: parseFloat(newSupCost) || 0,
      confirmed: true
    };

    onUpdateEvent({
      ...event,
      suppliers: [...event.suppliers, newSup],
      updatedAt: new Date().toISOString()
    });
    setShowAddSupplier(false);
    setNewSupType('');
    setNewSupName('');
    setNewSupContact('');
    setNewSupPhone('');
    setNewSupCost('');
  };

  const handleToggleSupplierConfirm = (id: string) => {
    onUpdateEvent({
      ...event,
      suppliers: event.suppliers.map(s => s.id === id ? { ...s, confirmed: !s.confirmed } : s),
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteSupplier = (id: string) => {
    onUpdateEvent({
      ...event,
      suppliers: event.suppliers.filter(s => s.id !== id),
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: TaskItem = {
      id: 'tsk-' + Date.now(),
      title: newTaskTitle,
      assignedTo: newTaskAssigned || 'Sin asignar',
      dueDate: newTaskDate || event.date,
      completed: false,
      priority: newTaskPriority
    };

    onUpdateEvent({
      ...event,
      tasks: [...event.tasks, newTask],
      updatedAt: new Date().toISOString()
    });
    setShowAddTask(false);
    setNewTaskTitle('');
    setNewTaskAssigned('');
    setNewTaskDate('');
  };

  const handleToggleTask = (id: string) => {
    onUpdateEvent({
      ...event,
      tasks: event.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t),
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteTask = (id: string) => {
    onUpdateEvent({
      ...event,
      tasks: event.tasks.filter(t => t.id !== id),
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName) return;

    const newGuest: GuestRecord = {
      id: 'gst-' + Date.now(),
      fullName: newGuestName,
      category: newGuestCat,
      tableOrZone: newGuestTable,
      dniOrPass: newGuestDni,
      checkedIn: false
    };

    onUpdateEvent({
      ...event,
      guests: [...event.guests, newGuest],
      updatedAt: new Date().toISOString()
    });
    setShowAddGuest(false);
    setNewGuestName('');
    setNewGuestTable('');
    setNewGuestDni('');
  };

  const handleToggleGuestCheckin = (id: string) => {
    onUpdateEvent({
      ...event,
      guests: event.guests.map(g => g.id === id ? { ...g, checkedIn: !g.checkedIn } : g),
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteGuest = (id: string) => {
    onUpdateEvent({
      ...event,
      guests: event.guests.filter(g => g.id !== id),
      updatedAt: new Date().toISOString()
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Subir archivo real a disco mediante la API
      const uploaded = await eventService.uploadFile(file);
      const newFile: AttachedFile = {
        id: 'att-' + Date.now(),
        name: uploaded.name,
        size: uploaded.size,
        type: uploaded.mimetype,
        uploadedAt: new Date().toISOString(),
        category: file.name.toLowerCase().includes('contrato') ? 'contrato' : 
                  file.name.toLowerCase().includes('plano') ? 'plano' : 'comprobante',
        dataUrl: uploaded.url // URL real servida por el backend: http://localhost:3001/uploads/...
      };

      onUpdateEvent({
        ...event,
        attachments: [newFile, ...event.attachments],
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error al subir archivo:', err);
      alert('Error al subir archivo al servidor.');
    } finally {
      e.target.value = '';
    }
  };

  const handleDeleteAttachment = (id: string) => {
    onUpdateEvent({
      ...event,
      attachments: event.attachments.filter(a => a.id !== id),
      updatedAt: new Date().toISOString()
    });
  };

  const daysLeft = getDaysRemaining(event.date);

  const mapSearchQuery = encodeURIComponent(
    `${event.venueName}, ${event.venueAddress || 'San Martín de los Andes, Neuquén, Argentina'}`
  );
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${mapSearchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const googleMapsExternalUrl = `https://www.google.com/maps/search/?api=1&query=${mapSearchQuery}`;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Barra de Encabezado Superior */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0.9rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            fontSize: '0.86rem',
            fontWeight: 600,
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
        >
          <ArrowLeft size={16} /> Volver a Lista de Eventos
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Estado:</span>
          <select 
            value={event.status}
            onChange={(e) => onUpdateEvent({ ...event, status: e.target.value as any, updatedAt: new Date().toISOString() })}
            style={{ fontWeight: 600, padding: '0.45rem 0.8rem' }}
          >
            <option value="prospecto">⏳ En Tratativa / Borrador</option>
            <option value="confirmado">✅ Confirmado</option>
            <option value="en_curso">🔥 En Curso (Hoy)</option>
            <option value="finalizado">🏁 Finalizado</option>
            <option value="cancelado">❌ Cancelado</option>
          </select>
        </div>
      </div>

      {/* Hero Banner Sobrio del Evento */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span className="badge badge-egresados" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
            {event.category.toUpperCase()}
          </span>
          <span style={{ 
            fontSize: '0.78rem', 
            background: 'var(--bg-subtle)', 
            color: 'var(--text-secondary)', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '999px',
            fontWeight: 600 
          }}>
            📍 San Martín de los Andes, Neuquén
          </span>
          {daysLeft >= 0 ? (
            <span style={{ fontSize: '0.78rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontWeight: 600 }}>
              ⏳ Faltan {daysLeft} días
            </span>
          ) : (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
              Evento concluido
            </span>
          )}
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          {event.title}
        </h1>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.25rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--primary-subtle)', color: 'var(--primary-accent)', padding: '0.5rem', borderRadius: '10px' }}>
              <Calendar size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>FECHA Y HORARIO</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{formatDateSpanish(event.date)}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{event.startTime} hs - {event.endTime} hs</div>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('mapa')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
            title="Ver ubicación en el mapa interactivo"
          >
            <div style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#4ade80', padding: '0.5rem', borderRadius: '10px' }}>
              <MapPin size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                LOCACIÓN (SMA) <Navigation size={11} color="#4ade80" />
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{event.venueName}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--primary-accent)', fontWeight: 500 }}>{event.venueAddress}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(37, 99, 235, 0.12)', color: '#60a5fa', padding: '0.5rem', borderRadius: '10px' }}>
              <Users size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>AFORO ESTIMADO</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{event.expectedGuests} personas</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Acreditados: {event.guests.filter(g => g.checkedIn).length}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(124, 58, 237, 0.12)', color: '#a78bfa', padding: '0.5rem', borderRadius: '10px' }}>
              <Briefcase size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>PRODUCTOR A CARGO</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>{event.organizerInCharge}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Comisión: {event.clientName.split(' ')[0]}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Sobrias */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem'
      }}>
        {[
          { id: 'resumen', label: 'Resumen & Contacto', count: null },
          { id: 'mapa', label: '🗺️ Ubicación & Mapa SMA', count: 'GPS' },
          { id: 'finanzas', label: 'Finanzas & Pagos', count: `${percentCollected}%` },
          { id: 'itinerario', label: 'Minuto a Minuto', count: event.timeline.length },
          { id: 'proveedores', label: 'Proveedores SMA', count: event.suppliers.length },
          { id: 'tareas', label: 'Checklist', count: `${event.tasks.filter(t => t.completed).length}/${event.tasks.length}` },
          { id: 'invitados', label: 'Invitados / Accesos', count: event.guests.length },
          { id: 'archivos', label: 'Archivos & Contratos', count: event.attachments.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
              fontSize: '0.86rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: activeTab === tab.id ? 'var(--bg-card)' : 'transparent',
              color: activeTab === tab.id ? 'var(--primary-accent)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary-accent)' : '2px solid transparent'
            }}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span style={{
                fontSize: '0.72rem',
                background: activeTab === tab.id ? 'var(--primary-subtle)' : 'var(--bg-subtle)',
                padding: '0.1rem 0.45rem',
                borderRadius: '999px',
                color: activeTab === tab.id ? 'var(--primary-accent)' : 'var(--text-secondary)'
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CONTENIDO DE PESTAÑAS */}

      {/* 1. RESUMEN Y CONTACTO */}
      {activeTab === 'resumen' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.2fr) minmax(300px, 1fr)', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-main)' }}>
              Información de la Comisión o Cliente
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COMISIÓN / COLEGIO / TITULAR</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 600, marginTop: '0.2rem', color: 'var(--text-main)' }}>{event.clientName}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={16} color="var(--primary-accent)" />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TELÉFONO (CÓDIGO DE ÁREA 2972 - SMA)</div>
                  <a href={`tel:${event.clientPhone}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem' }}>
                    {event.clientPhone}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={16} color="var(--primary-accent)" />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CORREO ELECTRÓNICO</div>
                  <a href={`mailto:${event.clientEmail}`} style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: 500, fontSize: '0.88rem' }}>
                    {event.clientEmail}
                  </a>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>REQUISITOS MUNICIPALES Y OPERATIVOS (SMA)</div>
                <div style={{ 
                  background: 'var(--bg-subtle)', 
                  padding: '0.85rem', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.86rem',
                  lineHeight: '1.6',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-light)'
                }}>
                  {event.notes || 'Sin especificaciones particulares registradas.'}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                Resumen Económico (ARS)
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Presupuesto Pactado:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(event.totalBudget)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Percibido:</span>
                  <span style={{ fontWeight: 700, color: '#4ade80' }}>{formatCurrency(totalPaid)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Saldo Pendiente:</span>
                  <span style={{ fontWeight: 700, color: '#fbbf24' }}>{formatCurrency(pendingAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Margen Neto Proyectado:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(estimatedProfit)}</span>
                </div>
              </div>
            </div>

            {/* Acceso Rápido al Mapa */}
            <div 
              onClick={() => setActiveTab('mapa')}
              style={{
                background: 'var(--bg-card)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>UBICACIÓN EN MAPA</span>
                <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>{event.venueName}</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{event.venueAddress}</p>
              </div>
              <div style={{ background: 'rgba(22, 163, 74, 0.12)', color: '#4ade80', padding: '0.5rem', borderRadius: '8px' }}>
                <Navigation size={18} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAPA & UBICACIÓN EN SAN MARTÍN DE LOS ANDES */}
      {activeTab === 'mapa' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  🗺️ Ubicación del Evento en San Martín de los Andes
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Visualizá y modificá la dirección del salón o predio. Podés abrir la ruta directa en Google Maps.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 600
                  }}
                >
                  {isEditingAddress ? 'Cancelar Edición' : 'Editar Dirección'}
                </button>

                <a
                  href={googleMapsExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--primary-accent)',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(225, 29, 72, 0.25)'
                  }}
                >
                  <ExternalLink size={15} /> Abrir en Google Maps
                </a>
              </div>
            </div>

            {/* Formulario de edición rápida de dirección */}
            {isEditingAddress && (
              <form 
                onSubmit={handleSaveVenueAndAddress}
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 2fr auto',
                  gap: '0.85rem',
                  alignItems: 'end'
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Nombre del Salón / Predio
                  </label>
                  <input
                    type="text"
                    required
                    value={editedVenue}
                    onChange={(e) => setEditedVenue(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Dirección exacta en San Martín de los Andes
                  </label>
                  <input
                    type="text"
                    required
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '0.65rem 1.25rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}
                >
                  Actualizar Mapa
                </button>
              </form>
            )}

            {/* Iframe Interactivo de Google Maps con la ubicación de SMA */}
            <div style={{
              width: '100%',
              height: '460px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-light)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
              position: 'relative'
            }}>
              <iframe
                title="Mapa de ubicación en San Martín de los Andes"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={googleMapsEmbedUrl}
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>📍 <strong>Dirección registrada:</strong> {event.venueAddress}</span>
              <span>San Martín de los Andes, Provincia del Neuquén, Patagonia Argentina</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. FINANZAS Y PAGOS */}
      {activeTab === 'finanzas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>PRESUPUESTO ACORDADO</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-main)' }}>
                {formatCurrency(event.totalBudget)}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TOTAL PERCIBIDO</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem', color: '#4ade80' }}>
                {formatCurrency(totalPaid)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {percentCollected}% cobrado
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>SALDO PENDIENTE</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem', color: '#fbbf24' }}>
                {formatCurrency(pendingAmount)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                {pendingAmount === 0 ? 'Cobranza liquidada' : 'A cobrar previo al evento'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>COSTOS PROVEEDORES</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.35rem', color: 'var(--text-main)' }}>
                {formatCurrency(totalExpenses)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '0.2rem', fontWeight: 600 }}>
                Ganancia est.: {formatCurrency(estimatedProfit)}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Historial de Pagos y Señas
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Registros emitidos por el cliente con número de transferencia bancaria o recibo.
                </p>
              </div>

              <button
                onClick={() => setShowAddPayment(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary-accent)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.82rem'
                }}
              >
                <Plus size={15} /> Registrar Pago
              </button>
            </div>

            {showAddPayment && (
              <form 
                onSubmit={handleAddPayment} 
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  marginBottom: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '0.85rem',
                  alignItems: 'end'
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Concepto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seña 35%, Saldo"
                    value={newPayConcept}
                    onChange={(e) => setNewPayConcept(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Monto ($ ARS)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Monto"
                    value={newPayAmount}
                    onChange={(e) => setNewPayAmount(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={newPayDate}
                    onChange={(e) => setNewPayDate(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    Medio
                  </label>
                  <select 
                    value={newPayMethod}
                    onChange={(e) => setNewPayMethod(e.target.value as any)}
                    style={{ width: '100%' }}
                  >
                    <option value="transferencia">Transferencia BPN / Banco</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                    N° Comprobante / Referencia
                  </label>
                  <input
                    type="text"
                    placeholder="BPN-889021"
                    value={newPayRef}
                    onChange={(e) => setNewPayRef(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    style={{
                      background: 'var(--primary-accent)',
                      color: '#ffffff',
                      fontWeight: 600,
                      padding: '0.65rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      flex: 1
                    }}
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(false)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-secondary)',
                      padding: '0.65rem 0.8rem',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {event.payments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No hay pagos registrados para este evento.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {event.payments.map((payment) => (
                  <div
                    key={payment.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.1rem',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {payment.concept}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.15rem' }}>
                        <span>📅 {payment.date}</span>
                        <span>💳 {payment.method.toUpperCase()}</span>
                        {payment.reference && <span>Ref: {payment.reference}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#4ade80' }}>
                        +{formatCurrency(payment.amount)}
                      </span>
                      <button
                        onClick={() => handleDeletePayment(payment.id)}
                        style={{ color: 'var(--text-muted)', padding: '0.3rem' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Eliminar pago"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. ITINERARIO / MINUTO A MINUTO */}
      {activeTab === 'itinerario' && (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Cronograma Minuto a Minuto del Evento
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Hacé clic en el círculo para cambiar el estado (Pendiente / En Progreso / Cumplido).
              </p>
            </div>

            <button
              onClick={() => setShowAddTimeline(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-accent)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <Plus size={15} /> Agregar Hito
            </button>
          </div>

          {showAddTimeline && (
            <form 
              onSubmit={handleAddTimeline} 
              style={{
                background: 'var(--bg-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '120px 2fr 1.5fr 2fr auto',
                gap: '0.85rem',
                alignItems: 'end'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Hora
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Momento / Actividad
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Vals de egresados"
                  value={newTimeTitle}
                  onChange={(e) => setNewTimeTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Responsable
                </label>
                <input
                  type="text"
                  placeholder="DJ / Coordinador"
                  value={newTimeResp}
                  onChange={(e) => setNewTimeResp(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Detalles
                </label>
                <input
                  type="text"
                  placeholder="Indicaciones clave"
                  value={newTimeDesc}
                  onChange={(e) => setNewTimeDesc(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="submit"
                  style={{
                    background: 'var(--primary-accent)',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '0.65rem 0.9rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  Agregar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTimeline(false)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)',
                    padding: '0.65rem 0.8rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  ✕
                </button>
              </div>
            </form>
          )}

          {event.timeline.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No hay momentos cargados en el cronograma.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {event.timeline.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: item.status === 'completado' ? 'rgba(22, 163, 74, 0.12)' : item.status === 'en_progreso' ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-card)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      onClick={() => handleToggleTimelineStatus(item.id)}
                      style={{
                        color: item.status === 'completado' ? '#4ade80' : item.status === 'en_progreso' ? '#60a5fa' : 'var(--text-muted)'
                      }}
                    >
                      {item.status === 'completado' ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                    </button>

                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      background: 'var(--bg-subtle)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)'
                    }}>
                      {item.time}
                    </div>

                    <div>
                      <div style={{ 
                        fontSize: '0.92rem', 
                        fontWeight: 600, 
                        color: 'var(--text-main)',
                        textDecoration: item.status === 'completado' ? 'line-through' : 'none'
                      }}>
                        {item.title}
                      </div>
                      {item.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {item.responsible && (
                      <span style={{ fontSize: '0.75rem', background: 'var(--bg-subtle)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        👤 {item.responsible}
                      </span>
                    )}

                    <button
                      onClick={() => handleDeleteTimeline(item.id)}
                      style={{ color: 'var(--text-muted)', padding: '0.3rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. PROVEEDORES */}
      {activeTab === 'proveedores' && (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Proveedores y Equipamiento en San Martín de los Andes
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Técnica, catering patagónico, seguridad habilitada por SMA y fotografía cordillerana.
              </p>
            </div>

            <button
              onClick={() => setShowAddSupplier(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-accent)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <Plus size={15} /> Agregar Proveedor
            </button>
          </div>

          {showAddSupplier && (
            <form 
              onSubmit={handleAddSupplier} 
              style={{
                background: 'var(--bg-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.85rem',
                alignItems: 'end'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Rubro
                </label>
                <input
                  type="text"
                  required
                  placeholder="DJ, Catering, Fotografía"
                  value={newSupType}
                  onChange={(e) => setNewSupType(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Empresa / Proveedor
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nombre fantasía"
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Contacto
                </label>
                <input
                  type="text"
                  placeholder="Persona a cargo"
                  value={newSupContact}
                  onChange={(e) => setNewSupContact(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Teléfono (SMA)
                </label>
                <input
                  type="text"
                  placeholder="+54 9 2972 ..."
                  value={newSupPhone}
                  onChange={(e) => setNewSupPhone(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Costo Acordado ($ ARS)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newSupCost}
                  onChange={(e) => setNewSupCost(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="submit"
                  style={{
                    background: 'var(--primary-accent)',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    flex: 1
                  }}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddSupplier(false)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)',
                    padding: '0.65rem 0.8rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  ✕
                </button>
              </div>
            </form>
          )}

          {event.suppliers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No hay proveedores cargados todavía para este evento.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {event.suppliers.map((sup) => (
                <div
                  key={sup.id}
                  style={{
                    padding: '1.1rem',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.85rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', background: 'var(--bg-subtle)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {sup.serviceType}
                      </span>

                      <button
                        onClick={() => handleToggleSupplierConfirm(sup.id)}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: sup.confirmed ? '#4ade80' : '#fbbf24',
                          background: sup.confirmed ? 'rgba(22, 163, 74, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}
                      >
                        {sup.confirmed ? '✓ Confirmado' : '⏳ Pendiente'}
                      </button>
                    </div>

                    <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.5rem' }}>
                      {sup.name}
                    </h4>

                    {sup.contactPerson && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                        Contacto: {sup.contactPerson}
                      </div>
                    )}

                    {sup.phone && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary-accent)', marginTop: '0.15rem' }}>
                        📞 {sup.phone}
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    paddingTop: '0.65rem', 
                    borderTop: '1px solid var(--border-light)' 
                  }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Costo acordado: </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{formatCurrency(sup.cost)}</strong>
                    </div>

                    <button
                      onClick={() => handleDeleteSupplier(sup.id)}
                      style={{ color: 'var(--text-muted)', padding: '0.3rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. CHECKLIST */}
      {activeTab === 'tareas' && (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Checklist Operativo y Tareas Pendientes
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Trámites municipales SMA, seguridad y fechas límites de producción.
              </p>
            </div>

            <button
              onClick={() => setShowAddTask(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-accent)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <Plus size={15} /> Nueva Tarea
            </button>
          </div>

          {showAddTask && (
            <form 
              onSubmit={handleAddTask} 
              style={{
                background: 'var(--bg-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr auto',
                gap: '0.85rem',
                alignItems: 'end'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Descripción de la tarea
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Trámite municipal de ruidos molestos SMA"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Asignado a
                </label>
                <input
                  type="text"
                  placeholder="Nico / Valeria"
                  value={newTaskAssigned}
                  onChange={(e) => setNewTaskAssigned(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Fecha Límite
                </label>
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Prioridad
                </label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  style={{ width: '100%' }}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="submit"
                  style={{
                    background: 'var(--primary-accent)',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)',
                    padding: '0.65rem 0.8rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  ✕
                </button>
              </div>
            </form>
          )}

          {event.tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No hay tareas operativas creadas.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {event.tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: task.completed ? 'var(--bg-subtle)' : 'var(--bg-card)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      style={{ color: task.completed ? '#4ade80' : 'var(--text-muted)' }}
                    >
                      {task.completed ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                    </button>

                    <div>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        textDecoration: task.completed ? 'line-through' : 'none'
                      }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem', marginTop: '0.1rem' }}>
                        <span>👤 {task.assignedTo}</span>
                        {task.dueDate && <span>📅 Hasta: {task.dueDate}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: task.priority === 'urgente' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-subtle)',
                      color: task.priority === 'urgente' ? '#f87171' : 'var(--text-secondary)'
                    }}>
                      {task.priority}
                    </span>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      style={{ color: 'var(--text-muted)', padding: '0.3rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. INVITADOS & ACCESOS */}
      {activeTab === 'invitados' && (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Acreditación y Lista de Acceso en Puerta
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Control de aforo, asignación de mesas y check-in en el acceso del salón.
              </p>
            </div>

            <button
              onClick={() => setShowAddGuest(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--primary-accent)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.82rem'
              }}
            >
              <Plus size={15} /> Registrar Invitado
            </button>
          </div>

          {showAddGuest && (
            <form 
              onSubmit={handleAddGuest} 
              style={{
                background: 'var(--bg-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '2fr 1.2fr 1.2fr 1.2fr auto',
                gap: '0.85rem',
                alignItems: 'end'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Nombre y Apellido
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lucas Martínez"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Categoría
                </label>
                <select
                  value={newGuestCat}
                  onChange={(e) => setNewGuestCat(e.target.value as any)}
                  style={{ width: '100%' }}
                >
                  <option value="titular">Egresado / Titular</option>
                  <option value="acompañante">Familiar / Acompañante</option>
                  <option value="vip">VIP / Autoridad</option>
                  <option value="staff">Staff / Seguridad</option>
                  <option value="menor">Menor</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  Mesa / Sector
                </label>
                <input
                  type="text"
                  placeholder="Mesa 4"
                  value={newGuestTable}
                  onChange={(e) => setNewGuestTable(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                  DNI
                </label>
                <input
                  type="text"
                  placeholder="45.123.890"
                  value={newGuestDni}
                  onChange={(e) => setNewGuestDni(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="submit"
                  style={{
                    background: 'var(--primary-accent)',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddGuest(false)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--text-secondary)',
                    padding: '0.65rem 0.8rem',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  ✕
                </button>
              </div>
            </form>
          )}

          {event.guests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Aún no cargaste asistentes para este evento.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {event.guests.map((guest) => (
                <div
                  key={guest.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    background: guest.checkedIn ? 'rgba(22, 163, 74, 0.12)' : 'var(--bg-card)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <button
                      onClick={() => handleToggleGuestCheckin(guest.id)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: guest.checkedIn ? '#16a34a' : 'var(--bg-subtle)',
                        color: guest.checkedIn ? '#ffffff' : 'var(--text-secondary)'
                      }}
                    >
                      {guest.checkedIn ? '✓ INGRESÓ' : 'CHECK-IN'}
                    </button>

                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {guest.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.75rem' }}>
                        <span>Categoría: <strong>{guest.category}</strong></span>
                        {guest.tableOrZone && <span>📍 {guest.tableOrZone}</span>}
                        {guest.dniOrPass && <span>DNI: {guest.dniOrPass}</span>}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteGuest(guest.id)}
                    style={{ color: 'var(--text-muted)', padding: '0.3rem' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. ARCHIVOS & CONTRATOS */}
      {activeTab === 'archivos' && (
        <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Archivos Adjuntos, Planos y Contratos
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Contratos firmados en PDF, habilitaciones municipales y planos de distribución del salón.
              </p>
            </div>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-accent)',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}>
              <UploadCloud size={15} /> Subir Archivo
              <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {event.attachments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
              <FileText size={36} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
              <p>No hay documentos adjuntos para este evento.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {event.attachments.map((file) => (
                <div
                  key={file.id}
                  style={{
                    padding: '1.1rem',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary-subtle)', color: 'var(--primary-accent)', padding: '0.6rem', borderRadius: '8px' }}>
                      <FileText size={20} />
                    </div>

                    <div style={{ overflow: 'hidden' }}>
                      <h4 style={{ 
                        fontSize: '0.88rem', 
                        fontWeight: 600, 
                        color: 'var(--text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {file.name}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                        {formatFileSize(file.size)} • {file.category.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {file.dataUrl ? (
                      <a
                        href={file.dataUrl}
                        download={file.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.78rem',
                          color: 'var(--primary-accent)',
                          textDecoration: 'none',
                          fontWeight: 600
                        }}
                      >
                        <Download size={14} /> Descargar
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En almacenamiento</span>
                    )}

                    <button
                      onClick={() => handleDeleteAttachment(file.id)}
                      style={{ color: 'var(--text-muted)', padding: '0.3rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
