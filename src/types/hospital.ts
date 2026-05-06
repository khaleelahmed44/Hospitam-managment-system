export type UserRole = 'patient' | 'doctor' | 'admin';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  departmentId: string;
  bio?: string;
  imageUrl?: string;
  rate?: number;
  availability?: Record<string, string[]>; // e.g. { Monday: ["09:00", ...], ... }
  rating?: number;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
