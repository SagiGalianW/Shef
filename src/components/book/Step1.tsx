import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Baby } from 'lucide-react';
import { BookingFormData, platingVariants } from '../../schema/booking';

export default function Step1() {
  // Pulling form methods from the context provided by the parent
  const { register, formState: { errors } } = useFormContext<BookingFormData>();

  return (
    <motion.div 
      variants={platingVariants} initial="hidden" animate="visible" exit="exit"
      className="space-y-4 md:space-y-8"
    >
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">בונים תפריט</h2>
        <p className="text-sm md:text-lg text-gray-500">מתי נגיע לבשל עבורכם?</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">תאריך</label>
          <div className="relative flex items-center">
            <Calendar className="absolute right-3 md:right-4 text-gray-400 z-10 pointer-events-none" size={20} />
            <input 
              type="date" 
              {...register('date')} 
              className="w-full py-2.5 md:py-4 pl-3 pr-10 md:pr-12 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-right font-medium shadow-sm relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
            />
          </div>
          {errors.date && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.date.message}</p>}
        </div>

        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">שעה</label>
          <div className="relative flex items-center">
            <Clock className="absolute right-3 md:right-4 text-gray-400 z-10 pointer-events-none" size={20} />
            <input 
              type="time" 
              {...register('time')} 
              className="w-full py-2.5 md:py-4 pl-3 pr-10 md:pr-12 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-right font-medium shadow-sm relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
            />
          </div>
          {errors.time && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.time.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">מבוגרים</label>
          <div className="relative flex items-center">
            <Users className="absolute right-3 md:right-4 text-gray-400" size={20} />
            <input type="number" {...register('adults_count')} className="w-full py-2.5 md:py-4 pl-3 pr-10 md:pr-12 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-right font-medium shadow-sm" />
          </div>
          {errors.adults_count && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.adults_count.message}</p>}
        </div>

        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">ילדים</label>
          <div className="relative flex items-center">
            <Baby className="absolute right-3 md:right-4 text-gray-400" size={20} />
            <input type="number" {...register('kids_count')} className="w-full py-2.5 md:py-4 pl-3 pr-10 md:pr-12 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-right font-medium shadow-sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}