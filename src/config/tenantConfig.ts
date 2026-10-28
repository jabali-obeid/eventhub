/**
 * ARCHIVO MAESTRO DE CONFIGURACIÓN DE EMPRESA / CLIENTE (TENANT CONFIG)
 * 
 * Cuando vendas este software a una empresa organizadora de eventos:
 * Solo debes modificar este archivo con los datos del cliente.
 * Toda la plataforma (colores, nombres, tarjetas virtuales, alias bancarios, 
 * ciudades y plantillas de circulares) se adaptará automáticamente.
 */

export interface TenantBankCard {
  id: string;
  title: string;
  subtitle: string;
  alias: string;
  accountType: string;
  cbuOrCvu: string;
  holder: string;
  badge: string;
  gradient: string;
}

export interface TenantConfig {
  company: {
    name: string;             // Nombre de la productora (ej: "EvenTum", "Patagonia Events")
    tagline: string;          // Ciudad o región (ej: "San Martín de los Andes", "Bariloche")
    locationDefault: string;  // Ubicación por defecto para Google Maps y fichas
    logoSymbol: string;       // Símbolo o inicial del logo (ej: "❖", "⚡", "★")
    phoneCodeDefault: string; // Prefijo telefónico local (ej: "+54 9 2972 ")
  };
  producer: {
    name: string;             // Nombre del productor general asignado
    role: string;             // Cargo visible
    avatar: string;           // Foto de perfil
  };
  branding: {
    primaryColor: string;     // Color acento claro (ej Finexy Naranja: #f95f35, Azul: #2563eb, etc)
    primaryHover: string;     // Color acento hover
    primarySubtle: string;    // Fondo suave para badges
  };
  virtualCards: TenantBankCard[];
  support: {
    email: string;
    phone: string;
  };
}

export const TENANT_CONFIG: TenantConfig = {
  company: {
    name: "Twelve",
    tagline: "San Martín de los Andes",
    locationDefault: "San Martín de los Andes, Neuquén, Argentina",
    logoSymbol: "❖",
    phoneCodeDefault: "+54 9 2972 "
  },
  producer: {
    name: "Mariano Carmona",
    role: "Organización",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
  },
  branding: {
    primaryColor: "#f95f35",
    primaryHover: "#e84e24",
    primarySubtle: "#fff2ed"
  },
  virtualCards: [
    {
      id: "card-recaudacion",
      title: "MercadoPago",
      subtitle: "Cobros de cuotas y señas",
      alias: "twelve.bar",
      accountType: "CVU MP",
      cbuOrCvu: "0970001200001234567890",
      holder: "MARIANO CARMONA",
      badge: "Activa",
      gradient: "linear-gradient(135deg, #1c202a 0%, #0d0f14 100%)"
    },
    {
      id: "card-gastos",
      title: "FONDO OPERATIVO • SALONES & DJ",
      subtitle: "Gastos operativos y contrataciones",
      alias: "EJEMPLO",
      accountType: "CVU Fondo",
      cbuOrCvu: "0000003100098765432109",
      holder: "PRODUCTORES SMA",
      badge: "Gastos SMA",
      gradient: "linear-gradient(135deg, #f95f35 0%, #d83d15 100%)"
    }
  ],
  support: {
    email: "soporte@eventum.com.ar",
    phone: "+54 9 2972 41-2345"
  }
};
