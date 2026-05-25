import { useState, useEffect } from 'react';
import { Shield, MapPinCheck, MapPinX } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CaptchaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (answer: string, lat: string, lng: string) => void;
}

export function CaptchaModal({ open, onOpenChange, onVerify }: CaptchaModalProps) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [answer, setAnswer] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [coords, setCoords] = useState({ lat: '', lng: '' });

  useEffect(() => {
    if (open) {
      setNum1(Math.floor(Math.random() * 10) + 1);
      setNum2(Math.floor(Math.random() * 10) + 1);
      setAnswer('');
      setGpsStatus('pending');
      setCoords({ lat: '', lng: '' });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({
              lat: String(pos.coords.latitude),
              lng: String(pos.coords.longitude),
            });
            setGpsStatus('success');
          },
          () => {
            setGpsStatus('error');
            alert('Location access is required for security verification. Please enable it in your browser settings.');
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        setGpsStatus('error');
      }
    }
  }, [open]);

  const handleVerify = () => {
    const correct = num1 + num2;
    if (parseInt(answer) !== correct) {
      alert('Incorrect answer. Please try again.');
      return;
    }
    if (gpsStatus !== 'success') {
      alert('Please allow location access to proceed.');
      return;
    }
    onVerify(answer, coords.lat, coords.lng);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0 gap-0 rounded-xl border-0 shadow-2xl overflow-hidden">
        <DialogHeader className="bg-[#0B1F3F] px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-white text-base font-bold">
            <Shield className="w-5 h-5 text-[#D4A843]" />
            Security Verification
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {/* Math Problem */}
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              Solve this math problem:
            </Label>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <span className="text-2xl font-bold text-[#0B1F3F]">{num1} + {num2} = ?</span>
            </div>
            <Input
              type="number"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Your answer"
              className="mt-3"
            />
          </div>

          {/* GPS Status */}
          <div className="flex items-center justify-center">
            {gpsStatus === 'success' && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                <MapPinCheck className="w-4 h-4" /> Location Verified
              </div>
            )}
            {gpsStatus === 'error' && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                <MapPinX className="w-4 h-4" /> Location Access Required
              </div>
            )}
            {gpsStatus === 'pending' && (
              <div className="flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-2 rounded-full text-sm">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-[#D4A843] rounded-full animate-spin" />
                Getting location...
              </div>
            )}
          </div>

          <button
            onClick={handleVerify}
            disabled={gpsStatus !== 'success' || !answer}
            className="w-full bg-[#0B1F3F] hover:bg-[#16325B] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Verify & Submit
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
