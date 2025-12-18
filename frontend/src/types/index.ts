export interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'admin';
  created_at: Date;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: Date;
}

export interface Appointment {
  id: number;
  user_id: number;
  department_id: number;
  date: string;
  time: string;
  reason: string;
  queue_number: number;
  status: 'pending' | 'in_service' | 'completed' | 'cancelled';
  student_name?: string;
  department?: string;
  created_at: Date;
}
