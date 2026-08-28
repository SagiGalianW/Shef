import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import { User, Phone, FileText } from "lucide-react";
import { BookingFormData, platingVariants } from "../../schema/booking";

export default function Step4() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BookingFormData>();

  return (
    <motion.div
      variants={platingVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4 md:space-y-8"
    >
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">
          פרטים אחרונים
        </h2>
        <p className="text-sm md:text-lg text-gray-500">
          למי לשלוח את התפריט המלא?
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">
            שם מלא
          </label>
          <div className="relative flex items-center">
            <User
              className="absolute right-3 md:right-4 text-gray-400"
              size={20}
            />
            <input
              type="text"
              {...register("name")}
              className="w-full py-3 md:py-4 pl-3 pr-10 md:pr-12 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-right font-medium shadow-sm"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">
            טלפון נייד
          </label>
          <div className="relative flex items-center">
            <Phone
              className="absolute right-3 md:right-4 text-gray-400"
              size={20}
            />
            <input
              type="tel"
              dir="ltr"
              {...register("phone")}
              className="w-full py-3 md:py-4 pl-10 md:pl-12 pr-3 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-right font-medium shadow-sm"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-[10px] md:text-sm mt-1 font-semibold">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="relative">
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">
            הערות / בקשות מיוחדות
          </label>
          <div className="relative flex items-start">
            <FileText
              className="absolute right-3 md:right-4 top-4 text-gray-400"
              size={20}
            />
            <textarea
              rows={3}
              {...register("notes")}
              placeholder="אלרגיות, בקשות תזונתיות, או כל דבר אחר..."
              className="w-full py-3 md:py-4 pl-3 pr-10 md:pr-12 text-sm md:text-lg border-2 border-transparent bg-white rounded-xl md:rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all text-right font-medium shadow-sm resize-none"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}