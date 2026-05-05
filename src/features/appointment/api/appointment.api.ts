import axiosClient from '@/src/core/http/axiosClient';
import { Appointment, CreateAppointmentDto } from '../types';

export const appointmentApi = {
  getAppointments: async (params?: any): Promise<Appointment[]> => {
    // In a real app: const { data } = await axiosClient.get('/appointments', { params });
    // return data;
    
    // Mocking response
    return [
      {
        id: '1',
        patientId: 'p1',
        patientName: 'Alex Johnson',
        doctorId: 'd1',
        doctorName: 'Dr. Smith',
        chairId: 'c1',
        date: '2026-05-10',
        time: '09:00',
        status: 'CONFIRMED' as any,
        type: 'Routine Checkup',
      },
    ];
  },

  createAppointment: async (data: CreateAppointmentDto): Promise<Appointment> => {
    const response = await axiosClient.post('/appointments', data);
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Appointment> => {
    const response = await axiosClient.patch(`/appointments/${id}/status`, { status });
    return response.data;
  },

  getAvailableSlots: async (date: string, doctorId: string): Promise<string[]> => {
    // Logic to check for conflicts (doctor/chair) would be here or on server
    return ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  },
};
