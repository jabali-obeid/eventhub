import type { EventItem } from '../types/event';

const API_URL = 'http://localhost:3001/api';

export const eventService = {
  // Obtener eventos desde la base de datos real
  async getEvents(): Promise<EventItem[]> {
    const res = await fetch(`${API_URL}/events`);
    if (!res.ok) throw new Error('Error al obtener eventos de la base de datos');
    return res.json();
  },

  // Obtener un evento específico
  async getEventById(id: string): Promise<EventItem> {
    const res = await fetch(`${API_URL}/events/${id}`);
    if (!res.ok) throw new Error('Error al obtener el evento');
    return res.json();
  },

  // Crear un nuevo evento en base de datos
  async createEvent(event: Partial<EventItem>): Promise<EventItem> {
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Error al guardar el evento');
    return res.json();
  },

  // Actualizar un evento existente
  async updateEvent(id: string, event: EventItem): Promise<EventItem> {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!res.ok) throw new Error('Error al actualizar el evento');
    return res.json();
  },

  // Eliminar un evento
  async deleteEvent(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar el evento');
  },

  // Subir archivo real a disco en el servidor
  async uploadFile(file: File): Promise<{ url: string; name: string; size: number; mimetype: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Error al subir el archivo al servidor');
    return res.json();
  }
};
