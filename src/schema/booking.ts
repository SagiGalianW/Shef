import * as z from 'zod';
import { ChefHat, Utensils, MapPin } from 'lucide-react';

// Added explicit required_error messages to prevent Zod's default English fallbacks
export const bookingSchema = z.object({
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
  location: z.string({ message: 'אנא הזן עיר או כתובת מלאה' }).min(2, 'אנא הזן עיר או כתובת מלאה'),
  desserts_included: z.boolean().default(false),
  name: z.string({ message: 'אנא הזן שם מלא' }).min(2, 'אנא הזן שם מלא'),
  phone: z.string({ message: 'מספר טלפון לא תקין' }).min(9, 'מספר טלפון לא תקין'),
});

// export type BookingFormData = z.infer<typeof bookingSchema>;
export type BookingFormInput = z.input<typeof bookingSchema>;
export type BookingFormData = z.output<typeof bookingSchema>;

// Navigation steps configuration
export const STEPS = [
  { id: 1, title: 'התפריט', icon: Utensils },
  { id: 2, title: 'האירוע', icon: MapPin },
  { id: 3, title: 'השף אצלך', icon: ChefHat },
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