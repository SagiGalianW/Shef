import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MapPin, Cake, CheckCircle2 } from 'lucide-react';
import { BookingFormData, platingVariants } from '../../schema/booking';

export default function Step2() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const watchDesserts = watch('desserts_included');

  return (
    <motion.div variants={platingVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 md:space-y-8">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">לאן להגיע?</h2>
        <p className="text-sm md:text-lg text-gray-500">אנחנו מגיעים עם כל הציוד</p>
      </div>
      
      <div className="relative">
        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">כתובת מלאה</label>
        <div className="relative flex items-center">
          <MapPin className="absolute right-3 md:right-4 text-gray-400" size={20} />
          <input type="text" placeholder="תל אביב, הרצל 10" {...register('location')} className="w-full py-3 md:py-4 pl-3 pr-10 md:pr-12 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-right font-medium shadow-sm" />
        </div>
        {errors.location && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.location.message}</p>}
      </div>

      <div className="pt-2">
        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">סיום מתוק (אופציונלי)</label>
        <motion.div 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setValue('desserts_included', !watchDesserts)}
          className={`cursor-pointer border-2 rounded-xl md:rounded-2xl p-4 flex items-center gap-4 transition-all shadow-sm ${watchDesserts ? 'border-orange-500 bg-orange-50' : 'border-transparent bg-white hover:border-orange-200'}`}
        >
          <div className={`p-3 rounded-full transition-colors ${watchDesserts ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
            <Cake size={24} />
          </div>
          <div className="flex-1">
            <p className={`font-bold text-base md:text-xl ${watchDesserts ? 'text-orange-900' : 'text-gray-800'}`}>תוספת קינוחי שף</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">קינוחי בוטיק בעבודת יד לסיום מושלם</p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${watchDesserts ? 'border-orange-500 bg-orange-500 text-white' : 'border-gray-200'}`}>
            {watchDesserts && <CheckCircle2 size={16} />}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}