'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChefHat, Loader2 } from 'lucide-react';

import { bookingSchema, BookingFormInput, BookingFormData } from '../../schema/booking';
import Step1 from '../../components/book/Step1';
import Step2 from '../../components/book/Step2';
import Step3 from '../../components/book/Step3';
import ProgressBar from '../../components/book/ProgressBar';
import { createNewLead } from '../../actions/leads';

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Initialize the form with react-hook-form
  // const methods = useForm<BookingFormData>({
  //   resolver: zodResolver(bookingSchema),
  //   mode: 'onTouched',
  //   defaultValues: { 
  //     date: '',
  //     time: '',
  //     adults_count: 1, 
  //     kids_count: 0,
  //     location: '',
  //     desserts_included: false,
  //     name: '',
  //     phone: ''
  //   }
  // });
  const methods = useForm<BookingFormInput, any, BookingFormData>({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
    defaultValues: { 
      date: '',
      time: '',
      adults_count: 1, 
      kids_count: 0,
      location: '',
      desserts_included: false,
      name: '',
      phone: ''
    }
  });
  
  // Extract isSubmitting to show a loading state on the button
  const { formState: { isSubmitting }, handleSubmit, trigger, reset } = methods;
  
  // Navigation Logic
  const nextStep = async () => {
    let fields: (keyof BookingFormData)[] = [];
    if (currentStep === 0) fields = ['date', 'time', 'adults_count', 'kids_count'];
    if (currentStep === 1) fields = ['location'];
  
    const isValid = await trigger(fields);
    if (isValid) setCurrentStep((prev) => prev + 1);
  };
  
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  
  // Final Submit Logic connected to Supabase
  const onSubmit = async (data: BookingFormData) => {
    try {
      const result = await createNewLead(data);
      
      if (result.success) {
        alert('הפרטים נשלחו בהצלחה! השף יחזור אליכם בהקדם האפשרי.');
        reset(); // Clear the form
        setCurrentStep(0); // Return to the first step
      } else {
        alert('אירעה שגיאה בשליחת הטופס. אנא נסו שוב.');
      }
    } catch (error) {
      console.error(error);
      alert('בעיית תקשורת, אנא נסו שוב מאוחר יותר.');
    }
  };
  
  return (
    <div className="h-[100dvh] flex flex-col w-full bg-[#faf9f6] relative overflow-hidden" dir="rtl">
      {/* Background Watermark */}
      <motion.div 
        className="absolute -left-20 -bottom-20 text-gray-200/40 pointer-events-none z-0"
        animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
      >
        <ChefHat size={400} strokeWidth={0.5} />
      </motion.div>
  
      {/* Progress Bar Component */}
      <ProgressBar currentStep={currentStep} />
  
      <FormProvider {...methods}>
<form onSubmit={handleSubmit(onSubmit, (errors) => console.log('Zod Errors:', errors))} className="flex-1 flex flex-col min-h-0 w-full relative z-10">          
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col justify-center items-center px-4 py-2 w-full">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                {currentStep === 0 && <Step1 key="step1" />}
                {currentStep === 1 && <Step2 key="step2" />}
                {currentStep === 2 && <Step3 key="step3" />}
              </AnimatePresence>
            </div>
          </div>
  
          <div className="shrink-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-20">
            <div className="max-w-2xl mx-auto flex gap-3">
              {currentStep > 0 && (
                <motion.button 
                  whileTap={{ scale: 0.95 }} 
                  type="button" 
                  onClick={prevStep} 
                  disabled={isSubmitting}
                  className="px-4 md:px-8 py-3 md:py-4 bg-gray-100 text-gray-700 font-bold rounded-xl md:rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm md:text-lg disabled:opacity-50"
                >
                  <ChevronRight size={20} /> <span className="hidden sm:inline">חזור</span>
                </motion.button>
              )}
              
              {currentStep < 2 ? (
                <motion.button 
                  whileTap={{ scale: 0.95 }} 
                  type="button" 
                  onClick={nextStep} 
                  className="flex-1 px-4 py-3 md:py-4 bg-[#1e293b] text-white font-bold rounded-xl md:rounded-2xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20 flex justify-center items-center gap-2 text-base md:text-xl"
                >
                  המשך <ChevronLeft size={20} />
                </motion.button>
              ) : (
                <motion.button 
                  whileTap={!isSubmitting ? { scale: 0.95 } : {}} 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 md:py-4 bg-orange-600 text-white font-black rounded-xl md:rounded-2xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30 flex justify-center items-center gap-2 text-lg md:text-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      מעבד בקשה...
                      <Loader2 className="animate-spin" size={24} />
                    </>
                  ) : (
                    <>
                      שלח
                      <ChefHat size={24} />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}