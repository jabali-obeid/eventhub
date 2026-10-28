export type EventCategory = 
  | 'egresados'
  | 'boda'
  | 'cumple15'
  | 'corporativo'
  | 'festival'
  | 'social';

export type EventStatus = 
  | 'prospecto'
  | 'confirmado'
  | 'en_curso'
  | 'finalizado'
  | 'cancelado';

export interface PaymentRecord {
  id: string;
  concept: string; // ej: Seña 30%, 2do Pago, Saldo final
  amount: number;
  date: string;
  method: 'efectivo' | 'transferencia' | 'tarjeta' | 'otro';
  reference?: string;
  receiptFileName?: string;
  notes?: string;
}

export interface ExpenseRecord {
  id: string;
  concept: string;
  category: 'salon' | 'catering' | 'tecnica_dj' | 'seguridad' | 'ambientacion' | 'personal' | 'otros';
  amount: number;
  paid: boolean;
  dueDate?: string;
}

export interface TimelineItem {
  id: string;
  time: string; // ej: "21:30"
  title: string;
  description?: string;
  responsible?: string; // ej: DJ, Coordinador, Catering
  status: 'pendiente' | 'en_progreso' | 'completado';
}

export interface SupplierItem {
  id: string;
  serviceType: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  cost: number;
  confirmed: boolean;
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  completed: boolean;
  priority: 'baja' | 'media' | 'alta' | 'urgente';
}

export interface GuestRecord {
  id: string;
  fullName: string;
  category: 'titular' | 'acompañante' | 'vip' | 'staff' | 'menor';
  tableOrZone?: string;
  checkedIn: boolean;
  dniOrPass?: string;
  dietaryRestrictions?: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  category: 'contrato' | 'plano' | 'comprobante' | 'foto' | 'otro';
  dataUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  status: EventStatus;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  venueName: string; // Salón / Hostería / Refugio en SMA
  venueAddress: string;
  geoCoordinates?: string; // Ej: "-40.1581, -71.3532" o query de búsqueda de Google Maps
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  expectedGuests: number;
  totalBudget: number; // en pesos argentinos ARS
  organizerInCharge: string;
  bannerImage?: string;
  notes?: string;

  // Módulos
  payments: PaymentRecord[];
  expenses: ExpenseRecord[];
  timeline: TimelineItem[];
  suppliers: SupplierItem[];
  tasks: TaskItem[];
  guests: GuestRecord[];
  attachments: AttachedFile[];
  createdAt: string;
  updatedAt: string;
}
