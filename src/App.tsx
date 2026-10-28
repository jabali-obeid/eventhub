import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  LayoutDashboard,
  Calendar as CalendarIcon,
  Ticket,
  ShoppingBag,
  Mail,
  DollarSign,
  Moon,
  Sun,
  Loader2,
  Bell
} from 'lucide-react';
import type { EventItem } from './types/event';
import { StatsOverview } from './components/StatsOverview';
import { EventListView } from './components/EventListView';
import { EventDetailModal } from './components/EventDetailModal';
import { NewEventModal } from './components/NewEventModal';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { OrdersView } from './components/OrdersView';
import { CommunicationsView } from './components/CommunicationsView';
import { FinanceView } from './components/FinanceView';
import { eventService } from './services/eventService';
import { TENANT_CONFIG } from './config/tenantConfig';

const THEME_KEY = 'eventum_theme_pref';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    } catch (e) {
      console.error(e);
    }
    return 'light';
  });

  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'calendar' | 'events' | 'orders' | 'email' | 'finance'>('dashboard');

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Sincronizar tema con <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Cargar eventos directamente desde la base de datos real SQLite
  const loadEventsFromDatabase = async () => {
    setIsLoading(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error al conectar con la base de datos SQLite:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventsFromDatabase();
  }, []);

  // Crear evento persistido en SQLite
  const handleCreateEvent = async (newEvent: EventItem) => {
    try {
      const created = await eventService.createEvent(newEvent);
      setEvents(prev => [created, ...prev]);
      setSelectedEventId(created.id);
    } catch (err) {
      console.error('Error al guardar evento en base de datos:', err);
      alert('Error al guardar evento en base de datos.');
    }
  };

  // Actualizar evento en SQLite
  const handleUpdateEvent = async (updatedEvent: EventItem) => {
    try {
      const updated = await eventService.updateEvent(updatedEvent.id, updatedEvent);
      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    } catch (err) {
      console.error('Error al actualizar evento en base de datos:', err);
      alert('Error al actualizar evento en base de datos.');
    }
  };

  // Eliminar evento en SQLite
  const handleDeleteEvent = async (id: string) => {
    if (confirm('¿Estás seguro de que deseás eliminar este evento de la base de datos de San Martín de los Andes?')) {
      try {
        await eventService.deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
        if (selectedEventId === id) {
          setSelectedEventId(null);
        }
      } catch (err) {
        console.error('Error al eliminar evento:', err);
        alert('Error al eliminar evento en base de datos.');
      }
    }
  };

  // Exportar Backup JSON real
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eventos_sma_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar Backup a SQLite
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setIsLoading(true);
          for (const item of imported) {
            await eventService.createEvent(item);
          }
          await loadEventsFromDatabase();
          alert('¡Copia de seguridad restaurada correctamente en SQLite!');
        }
      } catch (err) {
        console.error(err);
        alert('Error al restaurar el archivo JSON en la base de datos.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // Navegación estilo Finexy con cápsulas superiores y sidebar fino con iconos
  const navTabs = [
    { id: 'dashboard', label: 'Panel General', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
    { id: 'events', label: 'Eventos SMA', icon: Ticket },
    { id: 'orders', label: 'Contrataciones', icon: ShoppingBag },
    { id: 'email', label: 'Comunicaciones', icon: Mail },
    { id: 'finance', label: 'Finanzas & BPN', icon: DollarSign },
  ] as const;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-app)',
      padding: '1.25rem',
      gap: '1.25rem'
    }}>
      {/* SIDEBAR ULTRA-SLIM CON ESTILO FINEXY (Iconos verticales + Toggle de Tema) */}
      <aside style={{
        width: '68px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRadius: 'var(--radius-2xl)',
        padding: '1.25rem 0.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--border-light)'
      }}>
        {/* Top: Logo Naranja Finexy */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
          <div 
            onClick={() => { setActiveMenu('dashboard'); setSelectedEventId(null); }}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'var(--primary-accent)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(249, 95, 53, 0.35)',
              cursor: 'pointer'
            }}
            title={`${TENANT_CONFIG.company.name} • ${TENANT_CONFIG.company.tagline}`}
          >
            {TENANT_CONFIG.company.logoSymbol}
          </div>

          {/* Toggle Modo Nocturno en cápsula redonda vertical como Finexy */}
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: '999px',
            padding: '0.3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            border: '1px solid var(--border-light)'
          }}>
            <button
              onClick={() => setTheme('light')}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme === 'light' ? '#ffffff' : 'transparent',
                color: theme === 'light' ? 'var(--text-main)' : 'var(--text-muted)',
                boxShadow: theme === 'light' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
              }}
              title="Modo Claro"
            >
              <Sun size={15} />
            </button>
            <button
              onClick={() => setTheme('dark')}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme === 'dark' ? 'var(--primary-accent)' : 'transparent',
                color: theme === 'dark' ? '#ffffff' : 'var(--text-muted)'
              }}
              title="Modo Nocturno"
            >
              <Moon size={15} />
            </button>
          </div>

          {/* Iconos de Navegación Verticales */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem', width: '100%', alignItems: 'center' }}>
            {navTabs.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id && !selectedEventId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id);
                    setSelectedEventId(null);
                  }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive ? '#14171f' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                  title={item.label}
                >
                  <Icon size={19} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom del Sidebar: Base de datos SQLite y backup */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem', width: '100%' }}>
          <button
            onClick={handleExportBackup}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-subtle)',
              color: 'var(--text-secondary)'
            }}
            title="Descargar Respaldo JSON de SQLite"
          >
            <Download size={16} />
          </button>

          <label style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-subtle)',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }} title="Restaurar base de datos">
            <Upload size={16} />
            <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
          </label>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, gap: '1.25rem' }}>
        {/* HEADER SUPERIOR CON PÍLDORAS FINEXY */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Logo y Nombre de Marca Finexy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {TENANT_CONFIG.company.name}
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--primary-subtle)',
              color: 'var(--primary-accent)'
            }}>
              {TENANT_CONFIG.company.tagline}
            </span>
          </div>

          {/* Menú de Cápsulas Superior Horizontal Estilo Finexy */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-full)',
            padding: '0.35rem 0.45rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-light)'
          }}>
            {navTabs.map((tab) => {
              const isActive = activeMenu === tab.id && !selectedEventId;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveMenu(tab.id);
                    setSelectedEventId(null);
                  }}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    background: isActive ? '#14171f' : 'transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Acciones Derecha (Búsqueda rápida, Notificación, Perfil de Usuario Finexy) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--shadow-card)',
              cursor: 'pointer'
            }} title="Notificaciones operativas">
              <Bell size={16} />
            </div>

            {/* Perfil del Productor como Finexy */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'var(--bg-card)',
              padding: '0.35rem 0.85rem 0.35rem 0.45rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-card)'
            }}>
              <img
                src={TENANT_CONFIG.producer.avatar}
                alt="Avatar"
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {TENANT_CONFIG.producer.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {TENANT_CONFIG.producer.role}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CUERPO PRINCIPAL CONMUTADO SEGÚN SOLAPA ACTIVA */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {isLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6rem 0',
              color: 'var(--text-secondary)',
              gap: '0.75rem'
            }}>
              <Loader2 size={36} className="animate-spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--primary-accent)' }} />
              <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>Cargando datos de San Martín de los Andes...</p>
            </div>
          ) : selectedEvent ? (
            /* Vista Detalle Modal del Evento */
            <EventDetailModal
              event={selectedEvent}
              onBack={() => setSelectedEventId(null)}
              onUpdateEvent={handleUpdateEvent}
            />
          ) : activeMenu === 'dashboard' ? (
            /* SOLAPA 1: PANEL GENERAL ESTILO FINEXY */
            <DashboardView
              events={events}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
              onCreateEvent={() => setIsNewModalOpen(true)}
            />
          ) : activeMenu === 'calendar' ? (
            /* SOLAPA 2: CALENDARIO */
            <CalendarView
              events={events}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
              onCreateEvent={() => setIsNewModalOpen(true)}
            />
          ) : activeMenu === 'orders' ? (
            /* SOLAPA 3: CONTRATACIONES */
            <OrdersView
              events={events}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
            />
          ) : activeMenu === 'email' ? (
            /* SOLAPA 4: COMUNICACIONES */
            <CommunicationsView
              events={events}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
            />
          ) : activeMenu === 'finance' ? (
            /* SOLAPA 5: FINANZAS & BPN */
            <FinanceView
              events={events}
              onSelectEvent={(evt) => setSelectedEventId(evt.id)}
            />
          ) : (
            /* SOLAPA 6: EVENTOS SMA (LISTA DE EVENTOS) */
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <StatsOverview
                events={events}
                onSelectEvent={(evt) => setSelectedEventId(evt.id)}
              />

              {/* BARRA DE FILTROS ESTILO FINEXY */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-2xl)',
                padding: '0.85rem 1.35rem',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 280px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Todos los eventos ({filteredEvents.length})
                  </span>

                  <div style={{ position: 'relative', flex: 1, maxWidth: '340px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Buscar por colegio, salón en SMA, cliente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '2.2rem',
                        paddingTop: '0.55rem',
                        paddingBottom: '0.55rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-light)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: 'var(--radius-full)' }}
                  >
                    <option value="all">Todas las Categorías</option>
                    <option value="egresados">🎓 Egresados</option>
                    <option value="boda">💍 Bodas</option>
                    <option value="cumple15">👑 Fiestas de 15</option>
                    <option value="corporativo">💼 Corporativos</option>
                    <option value="festival">🎪 Festivales</option>
                    <option value="social">🎉 Sociales</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: 'var(--radius-full)' }}
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="confirmado">Confirmados</option>
                    <option value="prospecto">Borrador</option>
                    <option value="en_curso">En Vivo</option>
                    <option value="finalizado">Finalizados</option>
                  </select>

                  <button
                    onClick={() => setIsNewModalOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.35rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--primary-accent)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      boxShadow: '0 4px 12px rgba(249, 95, 53, 0.35)'
                    }}
                  >
                    <Plus size={16} /> Crear Evento
                  </button>
                </div>
              </div>

              {/* LISTA DE EVENTOS ORGANIZADA POR MES */}
              <EventListView
                events={filteredEvents}
                onSelectEvent={(evt) => setSelectedEventId(evt.id)}
                onEditEvent={(evt) => setSelectedEventId(evt.id)}
                onDeleteEvent={handleDeleteEvent}
              />
            </div>
          )}
        </main>
      </div>

      {/* MODAL NUEVO EVENTO */}
      <NewEventModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleCreateEvent}
      />
    </div>
  );
}

export default App;
