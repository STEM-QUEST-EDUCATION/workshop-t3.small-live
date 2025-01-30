// src/lib/schemas/booking.ts
import { z } from 'zod';

export const bookingSchema = z.object({
  workshop: z.object({
    id: z.string(),
    name: z.string(),
    date: z.string(),
    price: z.number()
  }),
  children: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    age: z.string().min(1, "Age is required")
  })),
  parent: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone1: z.string().min(10, "Phone number is required"),
    phone2: z.string().optional(),
    address: z.string().min(1, "Address is required")
  }),
  payment: z.object({
    method: z.string(),
    status: z.string().default('pending')
  })
});

export type BookingFormData = z.infer<typeof bookingSchema>;
