import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Cake, CheckCircle2, Utensils } from 'lucide-react';
import { BookingFormData, platingVariants } from '../../schema/booking';

export default function Step2() {
  const { watch, setValue, formState: { errors } } = useFormContext<BookingFormData>();
  const watchDesserts = watch('desserts_included');
  const watchServingStyle = watch('serving_style');

  return (
    <motion.div variants={platingVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 md:space-y-8">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">האוכל</h2>
        <p className="text-sm md:text-lg text-gray-500">איך תרצו שנגיש את המנות?</p>
      </div>
      
      <div className="space-y-3">
        <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">סגנון הגשה</label>
        <div className="grid grid-cols-2 gap-3">
          
          {/* Center Style Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setValue('serving_style', 'center', { shouldValidate: true })}
            className={`cursor-pointer border-2 rounded-xl md:rounded-2xl p-4 text-center transition-all shadow-sm ${
              watchServingStyle === 'center' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
          >
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
              watchServingStyle === 'center' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              <Utensils size={24} />
            </div>
            <p className={`font-bold text-sm md:text-lg ${watchServingStyle === 'center' ? 'text-orange-900' : 'text-gray-700'}`}>למרכז שולחן</p>
          </motion.div>

          {/* Buffet Style Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setValue('serving_style', 'buffet', { shouldValidate: true })}
            className={`cursor-pointer border-2 rounded-xl md:rounded-2xl p-4 text-center transition-all shadow-sm ${
              watchServingStyle === 'buffet' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white hover:border-orange-200'
            }`}
          >
            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
              watchServingStyle === 'buffet' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              <Utensils size={24} />
            </div>
            <p className={`font-bold text-sm md:text-lg ${watchServingStyle === 'buffet' ? 'text-orange-900' : 'text-gray-700'}`}>בופה (מזנון)</p>
          </motion.div>
        </div>
        {errors.serving_style && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.serving_style.message}</p>}
      </div>

      <div className="pt-4">
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