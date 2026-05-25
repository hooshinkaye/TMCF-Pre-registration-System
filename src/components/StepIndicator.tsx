import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="px-6 py-5 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    backgroundColor: isCompleted ? '#059669' : isActive ? '#D4A843' : '#F0EEEA',
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span
                      className={`text-xs font-semibold ${
                        isActive ? 'text-[#0B1F3F]' : 'text-gray-400'
                      }`}
                    >
                      {stepNum}
                    </span>
                  )}
                </motion.div>
                <span
                  className={`text-[10px] font-medium uppercase tracking-wide ${
                    isActive ? 'text-[#0B1F3F]' : 'text-gray-400'
                  }`}
                >
                  {step}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div className="w-12 h-[2px] bg-gray-200 mx-2 mb-5 relative">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: isCompleted ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-y-0 left-0 bg-[#059669]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
