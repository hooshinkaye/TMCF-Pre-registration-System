import { FileText, Info } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] max-h-[80vh] overflow-y-auto p-0 gap-0 rounded-xl border-0 shadow-2xl">
        <DialogHeader className="bg-gray-50 px-6 py-4 border-b sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-[#0B1F3F]">
            <FileText className="w-5 h-5 text-[#D4A843]" />
            Terms and Conditions
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 text-sm leading-relaxed text-gray-600">
          <section>
            <h4 className="font-bold text-[#0B1F3F] mb-2">1. Data Privacy Agreement (DPA 2012)</h4>
            <p>
              By proceeding with this pre-registration, you explicitly authorize <strong>TMCFI EDU-HUB Enrollment System</strong> to collect and process your personal data, including but not limited to your full name, address, contact details, and academic records. This data is collected solely for:
            </p>
            <ul className="list-disc ml-5 mt-1.5 space-y-1">
              <li>Processing of admission and enrollment applications.</li>
              <li>Verification of identity and academic background.</li>
              <li>Communication regarding school updates and requirements.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-[#0B1F3F] mb-2">2. Accuracy of Information</h4>
            <p>
              You certify that all information provided in this form is true and correct to the best of your knowledge. Any false statements or withholding of relevant information may result in the disapproval of your application.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-[#0B1F3F] mb-2">3. Admission Policy</h4>
            <p>
              Submission of this pre-registration form does not guarantee automatic admission. All applications are subject to evaluation by the Registrar&apos;s Office. Enrollment is only considered official once all physical documents are submitted and fees are settled.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-[#0B1F3F] mb-2">4. Media Consent</h4>
            <p>
              You understand that the 2x2 photo uploaded will be used for your student profile in this system.
            </p>
          </section>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600">
              You may request to access, correct, or erase your personal data by contacting the school&apos;s Data Protection Officer at the <strong>Registrar&apos;s Office</strong>.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <Button onClick={() => onOpenChange(false)} className="bg-[#0B1F3F] hover:bg-[#16325B] text-white">
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
