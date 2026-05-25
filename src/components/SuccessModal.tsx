import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog, DialogContent,
} from '@/components/ui/dialog';

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SuccessModal({ open, onOpenChange }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] p-0 gap-0 rounded-2xl border-0 shadow-2xl overflow-hidden">
        <div className="flex flex-col items-center text-center px-8 pt-10 pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <CheckCircle className="w-16 h-16 text-[#059669] mb-4" />
          </motion.div>

          <h3 className="text-2xl font-bold text-[#0B1F3F] mb-2">Application Submitted!</h3>
          <p className="text-sm text-gray-500 mb-4">Your pre-registration was successful.</p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 w-full">
            <p className="text-xs text-amber-700 font-medium">
              You can&apos;t login/access the student portal yet.
            </p>
          </div>

          <div className="text-left w-full mb-6">
            <p className="text-xs font-bold text-[#0B1F3F] mb-2 uppercase tracking-wide">Next Steps:</p>
            <ol className="space-y-2">
              {[
                'Submit your documents to the campus for Initial Setup.',
                'Wait for account activation to perform Subject Verification.',
                'After login, update the Additional Information in your dashboard to complete your profile.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-[#0B1F3F] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1F3F] font-bold px-8 py-3 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Great, thank you!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
