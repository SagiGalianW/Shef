import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { BookingFormData, platingVariants } from "../../schema/booking";

export default function Step3() {
  const { register, watch, formState: { errors } } = useFormContext<BookingFormData>();
  const watchPropertyType = watch('property_type');

  return (
    <motion.div variants={platingVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4 md:space-y-8">
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">לוגיסטיקה</h2>
        <p className="text-sm md:text-lg text-gray-500">לאן אנחנו מגיעים?</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">עיר</label>
          <input type="text" placeholder="תל אביב" {...register('city')} className="w-full py-3 md:py-4 px-4 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-sm" />
          {errors.city && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.city.message}</p>}
        </div>

        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">רחוב</label>
          <input type="text" placeholder="דיזנגוף" {...register('street')} className="w-full py-3 md:py-4 px-4 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-sm" />
          {errors.street && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.street.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">סוג נכס</label>
          <select {...register('property_type')} className="w-full py-3 md:py-4 px-4 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-sm bg-none cursor-pointer">
            <option value="apartment">דירה בבניין</option>
            <option value="house">בית פרטי</option>
          </select>
          {errors.property_type && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.property_type.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">מס' בית</label>
            <input type="text" {...register('house_number')} className="w-full py-3 md:py-4 px-4 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-sm" />
            {errors.house_number && <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">{errors.house_number.message}</p>}
          </div>

          {watchPropertyType === 'apartment' && (
            <div className="relative">
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">קומה</label>
              <input type="text" {...register('floor')} className="w-full py-3 md:py-4 px-4 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all shadow-sm" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}