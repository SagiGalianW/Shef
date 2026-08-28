// src/app/admin/loading.tsx

import { Loader2, ChefHat } from 'lucide-react';

export default function Loading() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[80vh] w-full gap-4" 
      dir="rtl"
    >
      <div className="relative flex items-center justify-center">
        {/* Static chef hat in the center */}
        <ChefHat size={32} className="text-orange-500 absolute" />
        
        {/* Spinning loader ring around the hat */}
        <Loader2 size={80} className="text-orange-200 animate-spin" strokeWidth={2} />
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-black text-gray-800">טוען נתונים...</h2>
        <p className="text-sm font-medium text-gray-500">מכין את המטבח</p>
      </div>
    </div>
  );
}