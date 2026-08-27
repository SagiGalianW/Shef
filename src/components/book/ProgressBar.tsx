import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { STEPS } from '../../schema/booking';

// Define the props for the ProgressBar
interface ProgressBarProps {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="shrink-0 w-full bg-white/90 backdrop-blur-md shadow-sm px-4 py-3 z-50">
      <div className="max-w-2xl mx-auto relative">
        <div className="flex justify-between items-center relative z-10">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isPast = index < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <motion.div 
                  animate={isActive ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                  isActive || isPast ? 'bg-[#1e293b] text-white shadow-md' : 'bg-white text-gray-300 border border-gray-200'
                }`}>
                  {isPast ? <CheckCircle2 size={20} /> : <StepIcon size={20} />}
                </motion.div>
                <span className={`text-[10px] md:text-xs font-bold ${isActive || isPast ? 'text-[#1e293b]' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Background track */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200 -z-0" />
        
        {/* Animated progress fill */}
        <motion.div 
          className="absolute top-5 right-0 h-[2px] bg-orange-500 -z-0"
          animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}