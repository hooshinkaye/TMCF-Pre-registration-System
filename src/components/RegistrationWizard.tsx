import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, ChevronRight, ChevronLeft, Upload,
  ShieldCheck, AlertTriangle, Info, CheckCircle, MapPin,
} from 'lucide-react';
import { StepIndicator } from './StepIndicator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface RegistrationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowTerms: () => void;
  onShowSuccess: () => void;
}

const PSGC_API = 'https://psgc.gitlab.io/api';

interface Province { name: string; code: string; }
interface City { name: string; code: string; }
interface Barangay { name: string; }

export function RegistrationWizard({ open, onOpenChange, onShowTerms, onShowSuccess }: RegistrationWizardProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ln: '', fn: '', mn: '', ext: '', no_mn: false,
    gen: 'Male', bday: '', age: '', rel: '',
    shsg: '', shss: '', jhsg: '', elemg: '',
    sel_province: '', sel_city: '', sel_brgy: '', street_part: '', addr: '',
    prog: '', profile_pic: null as File | null,
    privacy: false, lat: '', lng: '', quiz: '',
  });

  // Load provinces
  useEffect(() => {
    if (open) {
      fetch(`${PSGC_API}/provinces/`)
        .then(r => r.json())
        .then((data: Province[]) => {
          data.sort((a, b) => a.name.localeCompare(b.name));
          setProvinces(data);
        });
    }
  }, [open]);

  // Province → Cities
  useEffect(() => {
    if (!formData.sel_province) { setCities([]); return; }
    fetch(`${PSGC_API}/provinces/${formData.sel_province}/cities-municipalities/`)
      .then(r => r.json())
      .then((data: City[]) => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        setCities(data);
        setFormData(prev => ({ ...prev, sel_city: '', sel_brgy: '', addr: '' }));
        setBarangays([]);
      });
  }, [formData.sel_province]);

  // City → Barangays
  useEffect(() => {
    if (!formData.sel_city) { setBarangays([]); return; }
    fetch(`${PSGC_API}/cities-municipalities/${formData.sel_city}/barangays/`)
      .then(r => r.json())
      .then((data: Barangay[]) => {
        data.sort((a, b) => a.name.localeCompare(b.name));
        setBarangays(data);
        setFormData(prev => ({ ...prev, sel_brgy: '', addr: '' }));
      });
  }, [formData.sel_city]);

  const combineAddress = useCallback(() => {
    const st = formData.street_part;
    const br = formData.sel_brgy;
    const ct = cities.find(c => c.code === formData.sel_city)?.name || '';
    const pr = provinces.find(p => p.code === formData.sel_province)?.name || '';
    setFormData(prev => ({ ...prev, addr: [st, br, ct, pr].filter(Boolean).join(', ') }));
  }, [formData.street_part, formData.sel_brgy, formData.sel_city, formData.sel_province, cities, provinces]);

  useEffect(() => { combineAddress(); }, [combineAddress]);

  const calculateAge = (bday: string) => {
    if (!bday) return '';
    const today = new Date();
    const birth = new Date(bday);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age <= 0 ? '0' : String(age);
  };

  const updateField = (field: string, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      updateField('profile_pic', file);
    }
  };

  const validateStep = (s: number): boolean => {
    if (s === 1) {
      if (!formData.ln || !formData.fn) return false;
      if (!formData.no_mn && !formData.mn) return false;
      if (!formData.bday || !formData.rel) return false;
      return true;
    }
    if (s === 2) {
      if (!formData.sel_province || !formData.sel_city || !formData.sel_brgy || !formData.street_part) return false;
      if (!formData.shsg || !formData.shss || !formData.jhsg || !formData.elemg) return false;
      return true;
    }
    if (s === 3) {
      if (!formData.prog) return false;
      if (!formData.privacy) return false;
      return true;
    }
    return false;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep(s => Math.min(s + 1, 3));
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = () => {
    // Build and submit the form
    const fd = new FormData();
    fd.append('prog', formData.prog);
    fd.append('ln', formData.ln);
    fd.append('fn', formData.fn);
    fd.append('mn', formData.no_mn ? '' : formData.mn);
    fd.append('ext', formData.ext);
    fd.append('gen', formData.gen);
    fd.append('bday', formData.bday);
    fd.append('age', formData.age);
    fd.append('rel', formData.rel);
    fd.append('addr', formData.addr);
    fd.append('shsg', formData.shsg);
    fd.append('shss', formData.shss);
    fd.append('jhsg', formData.jhsg);
    fd.append('elemg', formData.elemg);
    fd.append('submit_reg', '1');
    fd.append('lat', formData.lat);
    fd.append('lng', formData.lng);
    fd.append('quiz', formData.quiz);
    // Honeypot
    fd.append('website_url', '');
    if (formData.profile_pic) {
      fd.append('profile_pic', formData.profile_pic);
    }

    fetch('/api/submit-preregistration.php', {
      method: 'POST',
      body: fd,
    })
      .then(() => {
        onOpenChange(false);
        onShowSuccess();
      })
      .catch(() => {
        alert('Submission failed. Please try again.');
      });
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[720px] p-0 gap-0 max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
        <DialogHeader className="bg-[#0B1F3F] px-6 py-4 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2 text-base font-bold">
              <GraduationCap className="w-5 h-5 text-[#D4A843]" />
              Pre-Registration
            </DialogTitle>
          </div>
        </DialogHeader>

        <StepIndicator currentStep={step} steps={['Personal Info', 'Address & Education', 'Program']} />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="px-6 py-5"
          >
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name *</Label>
                    <Input value={formData.ln} onChange={e => updateField('ln', e.target.value)} placeholder="Enter last name" className="mt-1" required />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name *</Label>
                    <Input value={formData.fn} onChange={e => updateField('fn', e.target.value)} placeholder="Enter first name" className="mt-1" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Middle Name {!formData.no_mn && '*'}</Label>
                      <div className="flex items-center gap-1.5">
                        <Checkbox
                          id="no_mn"
                          checked={formData.no_mn}
                          onCheckedChange={(checked) => updateField('no_mn', checked === true)}
                        />
                        <label htmlFor="no_mn" className="text-[11px] text-gray-400 cursor-pointer">No Middle Name</label>
                      </div>
                    </div>
                    <Input
                      value={formData.mn}
                      onChange={e => updateField('mn', e.target.value)}
                      placeholder={formData.no_mn ? 'N/A' : 'Enter middle name'}
                      className="mt-1"
                      readOnly={formData.no_mn}
                      required={!formData.no_mn}
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Extension Name</Label>
                    <Input value={formData.ext} onChange={e => updateField('ext', e.target.value)} placeholder="Jr., Sr., III (optional)" className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender *</Label>
                    <select value={formData.gen} onChange={e => updateField('gen', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm">
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Birth Date *</Label>
                    <Input
                      type="date"
                      value={formData.bday}
                      onChange={e => {
                        const val = e.target.value;
                        updateField('bday', val);
                        updateField('age', calculateAge(val));
                      }}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</Label>
                    <Input value={formData.age} readOnly className="mt-1 bg-gray-50" />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Religion *</Label>
                    <select value={formData.rel} onChange={e => updateField('rel', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm" required>
                      <option value="">Select</option>
                      <optgroup label="Christianity">
                        <option>Roman Catholic</option>
                        <option>Protestant</option>
                        <option>Evangelical</option>
                        <option>Born Again Christian</option>
                        <option>Iglesia ni Cristo</option>
                        <option>Seventh-day Adventist</option>
                        <option>Jehovahs Witnesses</option>
                        <option>Philippine Independent Church (Aglipayan)</option>
                        <option>United Church of Christ in the Philippines</option>
                        <option>Bible Baptist Church</option>
                        <option>Church of Christ</option>
                        <option>Orthodox Christian</option>
                      </optgroup>
                      <optgroup label="Islam">
                        <option>Islam (Sunni)</option>
                        <option>Islam (Shia)</option>
                      </optgroup>
                      <optgroup label="Other Religions">
                        <option>Buddhism</option>
                        <option>Hinduism</option>
                        <option>Judaism</option>
                        <option>Sikhism</option>
                        <option>Taoism</option>
                        <option>Confucianism</option>
                      </optgroup>
                      <optgroup label="Indigenous / Others">
                        <option>Indigenous Beliefs</option>
                        <option>None</option>
                        <option>Others</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address & Education */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3F] mb-3 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Permanent Address
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-xs text-gray-500">Province *</Label>
                      <select value={formData.sel_province} onChange={e => updateField('sel_province', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm" required>
                        <option value="">Select Province</option>
                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">City/Municipality *</Label>
                      <select value={formData.sel_city} onChange={e => updateField('sel_city', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm" required>
                        <option value="">Select City</option>
                        {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Barangay *</Label>
                      <select value={formData.sel_brgy} onChange={e => { updateField('sel_brgy', e.target.value); }} className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm" required>
                        <option value="">Select Barangay</option>
                        {barangays.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-xs text-gray-500">Street / House No. *</Label>
                    <Input value={formData.street_part} onChange={e => updateField('street_part', e.target.value)} placeholder="e.g. 123 Main St." className="mt-1" required />
                  </div>
                  <input type="hidden" name="addr" value={formData.addr} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#0B1F3F] mb-3">Educational Background</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-gray-500">Senior High School Graduated *</Label>
                      <Input value={formData.shsg} onChange={e => updateField('shsg', e.target.value.replace(/[^a-zA-Z .\-]/g, ''))} placeholder="School Name" className="mt-1" required />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">SHS Strand *</Label>
                      <Input value={formData.shss} onChange={e => updateField('shss', e.target.value.replace(/[^a-zA-Z .\-]/g, ''))} placeholder="e.g. STEM, HUMSS, TVL" className="mt-1" required />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Junior High School Graduated *</Label>
                      <Input value={formData.jhsg} onChange={e => updateField('jhsg', e.target.value.replace(/[^a-zA-Z .\-]/g, ''))} placeholder="School Name" className="mt-1" required />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Elementary School Graduated *</Label>
                      <Input value={formData.elemg} onChange={e => updateField('elemg', e.target.value.replace(/[^a-zA-Z .\-]/g, ''))} placeholder="School Name" className="mt-1" required />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Program & Confirmation */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Desired Program *</Label>
                  <select value={formData.prog} onChange={e => updateField('prog', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm" required>
                    <option value="">Choose Program</option>
                    <option>BSIT</option>
                    <option>BSCS</option>
                    <option>BSHM</option>
                    <option>BSCRIM</option>
                    <option>BEED</option>
                  </select>
                </div>

                {/* Photo Upload */}
                <div>
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">2x2 Photo</Label>
                  <div className="mt-2">
                    {photoPreview ? (
                      <div className="flex flex-col items-center gap-3">
                        <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
                        <button onClick={() => { setPhotoPreview(null); updateField('profile_pic', null); }} className="text-xs text-red-500 hover:underline">Remove</button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#D4A843]/50 hover:bg-[#F8F6F1] transition-colors">
                        <Upload className="w-8 h-8 text-gray-300 mb-2" />
                        <span className="text-sm text-gray-500">Drop photo here or click to browse</span>
                        <span className="text-[11px] text-gray-400 mt-1">2x2 photo, white background recommended</span>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Privacy */}
                <div className="bg-[#F8F6F1] rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-[#0B1F3F] mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-sm font-bold text-[#0B1F3F]">Data Privacy Statement</h5>
                      <p className="text-[11px] text-gray-500 mt-1">In compliance with the Data Privacy Act of 2012, your data is processed only for admission and enrollment purposes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="privacy"
                      checked={formData.privacy}
                      onCheckedChange={(checked) => updateField('privacy', checked === true)}
                    />
                    <label htmlFor="privacy" className="text-xs leading-relaxed cursor-pointer">
                      I agree to the{' '}
                      <button onClick={onShowTerms} className="text-[#0B1F3F] font-bold hover:underline">Terms and Conditions</button>
                      {' '}and I understand the instructions below.
                    </label>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-amber-50 p-2 rounded border-l-4 border-[#D4A843]">
                    <Info className="w-3.5 h-3.5 text-[#D4A843] flex-shrink-0 mt-0.5" />
                    <span>Check &quot;I Agree&quot; to enable submission. GPS must be ACTIVE for security verification.</span>
                  </div>
                  <div className="flex items-start gap-2 text-[11px] text-gray-500 bg-red-50 p-2 rounded border-l-4 border-red-400">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>Button not working? Check your internet or try a different browser (Chrome/Edge).</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center flex-shrink-0">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#0B1F3F] transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              disabled={!validateStep(step)}
              className="flex items-center gap-1 bg-[#0B1F3F] hover:bg-[#16325B] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(3)}
              className="flex items-center gap-1.5 bg-[#D4A843] hover:bg-[#C49A3A] text-[#0B1F3F] px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" /> Submit Application
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
