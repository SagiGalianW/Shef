import * as z from 'zod';
import { CalendarDays, Utensils, MapPin, UserCheck } from 'lucide-react';

// Added explicit messages to prevent Zod's default English fallbacks
export const bookingSchema = z.object({
  
  // ==========================
  // Step 1: Timing & Guests
  // ==========================
  date: z.string({ message: 'חובה לבחור תאריך' })
    .min(1, 'חובה לבחור תאריך')
    .refine((val) => {
      const selectedDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      return selectedDate >= today;
    }, { message: 'לא ניתן לבחור תאריך בעבר' }),
  time: z.string({ message: 'חובה לבחור שעה' }).min(1, 'חובה לבחור שעה'),
  adults_count: z.coerce.number({ message: 'חובה לבחור מספר' })
    .min(15, 'הזמנת שף פרטי מותנית במינימום 15 מבוגרים'),
  kids_count: z.coerce.number({ message: 'נא להזין מספר' }).min(0, 'אי אפשר מספר שלילי').default(0),

  // ==========================
  // Step 2: Serving Style
  // ==========================
  serving_style: z.enum(['buffet', 'center'], { 
    message: 'חובה לבחור סגנון הגשה'
  }),
  desserts_included: z.boolean().default(false),

  // ==========================
  // Step 3: Logistics
  // ==========================
  city: z.string({ message: 'חובה להזין עיר' }).min(2, 'אנא הזן שם עיר תקין'),
  street: z.string({ message: 'חובה להזין רחוב' }).min(2, 'אנא הזן שם רחוב תקין'),
  house_number: z.string({ message: 'חובה להזין מס׳ בית' }).min(1, 'אנא הזן מספר בית'),
  property_type: z.enum(['house', 'apartment'], { 
    message: 'חובה לבחור סוג נכס'
  }),
  floor: z.string().optional(), // Only relevant if property_type is 'apartment'

  // ==========================
  // Step 4: Contact & Notes
  // ==========================
  name: z.string({ message: 'אנא הזן שם מלא' }).min(2, 'אנא הזן שם מלא'),
  phone: z.string({ message: 'מספר טלפון לא תקין' }).min(9, 'מספר טלפון לא תקין'),
  notes: z.string().optional(),

});

export type BookingFormInput = z.input<typeof bookingSchema>;
export type BookingFormData = z.output<typeof bookingSchema>;

// Navigation steps configuration updated to match the new 4-step flow
export const STEPS = [
  { id: 1, title: 'האירוע', icon: CalendarDays },
  { id: 2, title: 'האוכל', icon: Utensils },
  { id: 3, title: 'לוגיסטיקה', icon: MapPin },
  { id: 4, title: 'פרטי קשר', icon: UserCheck },
];

// Reusable plating animation for all steps
export const platingVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, rotateX: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    rotateX: 0,
    transition: { type: 'spring' as const, stiffness: 250, damping: 25 } 
  },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
};