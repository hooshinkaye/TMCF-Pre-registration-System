import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle, Camera, Info,
} from 'lucide-react';
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
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', middleName: '', extension: '', hasMiddleName: true,
    gender: 'Male', birthDate: '', age: '', relationship: '',
    seniorHighSchool: '', seniorHighSchoolYear: '', juniorHighSchool: '', elementary: '',
    province: '', city: '', barangay: '', street: '', fullAddress: '',
    program: '', profilePic: null as File | null,
    agreeTerms: false, email: '', phone: '', honeypot: '',
  });

  // Load provinces
  useEffect(() => {
    if (open) {
      fetch(`${PSGC_API}/provinces/`)
        .then(r => r.json())
        .then((data: Province[]) => setProvinces(data))
        .catch(console.error);
    }
  }, [open]);

  // Load cities when province changes
  useEffect(() => {
    if (formData.province) {
      const prov = provinces.find(p => p.name === formData.province);
      if (prov) {
        fetch(`${PSGC_API}/provinces/${prov.code}/cities-municipalities/`)
          .then(r => r.json())
          .then((data: City[]) => setCities(data.sort((a, b) => a.name.localeCompare(b.name))))
          .catch(console.error);
      }
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCities([]);
      setBarangays([]);
    }
  }, [formData.province, provinces]);

  // Load barangays when city changes
  useEffect(() => {
    if (formData.city) {
      const city = cities.find(c => c.name === formData.city);
      if (city) {
        fetch(`${PSGC_API}/cities-municipalities/${city.code}/barangays/`)
          .then(r => r.json())
          .then((data: Barangay[]) => setBarangays(data.sort((a, b) => a.name.localeCompare(b.name))))
          .catch(console.error);
      }
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBarangays([]);
    }
  }, [formData.city, cities]);

  // Calculate age from birth date
  useEffect(() => {
    if (formData.birthDate) {
      const today = new Date();
      const birth = new Date(formData.birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.birthDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const val = e.target instanceof HTMLInputElement && e.target.type === 'checkbox'
      ? e.target.checked
      : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
        setPhotoPreview(null);
        setFormData(prev => ({ ...prev, profilePic: null }));
        setErrors(prev => ({ ...prev, profilePic: 'Please upload a JPG, PNG, or WebP image.' }));
        e.target.value = '';
        return;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        setPhotoPreview(null);
        setFormData(prev => ({ ...prev, profilePic: null }));
        setErrors(prev => ({ ...prev, profilePic: 'The selected image exceeds 5MB. Please upload a smaller photo.' }));
        e.target.value = '';
        return;
      }

      setFormData(prev => ({ ...prev, profilePic: file }));
      setErrors(prev => ({ ...prev, profilePic: '' }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = (stepNum: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (stepNum === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.birthDate) newErrors.birthDate = 'Birth date is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    } else if (stepNum === 2) {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.province) newErrors.province = 'Province is required';
      if (!formData.city) newErrors.city = 'City is required';
    } else if (stepNum === 3) {
      if (!formData.program) newErrors.program = 'Program selection is required';
      if (!formData.profilePic) newErrors.profilePic = 'Profile photo is required';
    } else if (stepNum === 4) {
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    if (formData.honeypot) {
      // Honeypot field filled, likely a bot
      onShowSuccess();
      onOpenChange(false);
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.firstName);
      formDataToSend.append('last_name', formData.lastName);
      formDataToSend.append('middle_name', formData.middleName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('birth_date', formData.birthDate);
      formDataToSend.append('program', formData.program);
      formDataToSend.append('address', formData.fullAddress || `${formData.street}, ${formData.barangay}, ${formData.city}, ${formData.province}`);
      if (formData.profilePic) {
        formDataToSend.append('profile_pic', formData.profilePic);
      }

      const response = await fetch('/api/submit-preregistration', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        onShowSuccess();
        onOpenChange(false);
      } else {
        const data = await response.json().catch(() => null);
        setErrors({ submit: data?.error || 'Failed to submit. Please try again.' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Check if we're on mobile for animation optimization
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const transitionConfig = isMobile 
    ? { duration: 0.2, ease: 'easeInOut' }
    : { type: 'spring', stiffness: 300, damping: 30 };

  const stepContent = [
    null,
    // Step 1: Personal Information
    <motion.div key="step1" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transitionConfig} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="block text-sm font-bold mb-2 text-slate-900">First Name *</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            className="form-input"
          />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>
        <div>
          <Label htmlFor="lastName" className="block text-sm font-bold mb-2 text-slate-900">Last Name *</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            className="form-input"
          />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-3">
          <Checkbox
            id="hasMiddleName"
            checked={formData.hasMiddleName}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasMiddleName: checked === true }))}
          />
          <Label htmlFor="hasMiddleName" className="text-sm font-medium">I have a middle name</Label>
        </div>
        {formData.hasMiddleName && (
          <Input
            name="middleName"
            value={formData.middleName}
            onChange={handleInputChange}
            placeholder="Middle Name"
            className="form-input"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="birthDate" className="block text-sm font-bold mb-2 text-slate-900">Birth Date *</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange}
            className="form-input"
          />
          {errors.birthDate && <p className="form-error">{errors.birthDate}</p>}
        </div>
        <div>
          <Label htmlFor="age" className="block text-sm font-bold mb-2 text-slate-900">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            disabled
            className="form-input bg-slate-100"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="gender" className="block text-sm font-bold mb-2 text-slate-900">Gender *</Label>
        <select name="gender" value={formData.gender} onChange={handleInputChange} className="form-select">
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </motion.div>,

    // Step 2: Contact & Location
    <motion.div key="step2" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transitionConfig} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="block text-sm font-bold mb-2 text-slate-900">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="your@email.com"
            className="form-input"
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="block text-sm font-bold mb-2 text-slate-900">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="09123456789"
            className="form-input"
          />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="province" className="block text-sm font-bold mb-2 text-slate-900">Province *</Label>
          <select name="province" value={formData.province} onChange={handleInputChange} className="form-select">
            <option value="">Select Province</option>
            {provinces.map(p => (
              <option key={p.code} value={p.name}>{p.name}</option>
            ))}
          </select>
          {errors.province && <p className="form-error">{errors.province}</p>}
        </div>
        <div>
          <Label htmlFor="city" className="block text-sm font-bold mb-2 text-slate-900">City/Municipality *</Label>
          <select name="city" value={formData.city} onChange={handleInputChange} className="form-select" disabled={!formData.province}>
            <option value="">Select City</option>
            {cities.map(c => (
              <option key={c.code} value={c.name}>{c.name}</option>
            ))}
          </select>
          {errors.city && <p className="form-error">{errors.city}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="barangay" className="block text-sm font-bold mb-2 text-slate-900">Barangay</Label>
        <select name="barangay" value={formData.barangay} onChange={handleInputChange} className="form-select" disabled={!formData.city}>
          <option value="">Select Barangay</option>
          {barangays.map(b => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="street" className="block text-sm font-bold mb-2 text-slate-900">Street Address</Label>
        <Input
          id="street"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          placeholder="House No., Street Name"
          className="form-input"
        />
      </div>
    </motion.div>,

    // Step 3: Program & Photo
    <motion.div key="step3" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transitionConfig} className="space-y-4">
      <div>
        <Label htmlFor="program" className="block text-sm font-bold mb-2 text-slate-900">Program of Interest *</Label>
        <select name="program" value={formData.program} onChange={handleInputChange} className="form-select">
          <option value="">Select Program</option>
          <option value="K-12 Education">K-12 Education</option>
          <option value="BEED">Bachelor of Elementary Education</option>
          <option value="BSCRIM">Bachelor of Science in Criminology</option>
          <option value="BSIT">Bachelor of Science in Information Technology</option>
          <option value="BSHM">Bachelor of Science in Hospitality Management</option>
          <option value="BSCS">Bachelor of Science in Computer Science</option>
        </select>
        {errors.program && <p className="form-error">{errors.program}</p>}
      </div>

      <div>
        <Label className="block text-sm font-bold mb-3 text-slate-900">Profile Photo *</Label>
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors bg-blue-50/50">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoChange}
            className="hidden"
            id="photo-input"
          />
          <label htmlFor="photo-input" className="cursor-pointer">
            {photoPreview ? (
              <div className="flex flex-col items-center gap-2">
                <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                <p className="text-sm text-slate-600">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Camera className="w-8 h-8 text-blue-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-900">Click to upload photo</p>
                <p className="text-xs text-slate-500">JPG, PNG, WebP (Max 5MB)</p>
              </div>
            )}
          </label>
        </div>
        {errors.profilePic && <p className="form-error">{errors.profilePic}</p>}
      </div>
    </motion.div>,

    // Step 4: Review & Confirm
    <motion.div key="step4" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={transitionConfig} className="space-y-4">
      <div className="glass-card !p-4 space-y-3">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-slate-700"><strong>Name:</strong> {formData.firstName} {formData.lastName}</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-slate-700"><strong>Program:</strong> {formData.program}</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-slate-700"><strong>Email:</strong> {formData.email}</span>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900">Review your information before submitting. Make sure all details are correct.</p>
        </div>
      </div>

      <div className="flex items-start gap-3 pt-4 border-t">
        <Checkbox
          id="agreeTerms"
          checked={formData.agreeTerms}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            setFormData(prev => ({ ...prev, agreeTerms: isChecked }));
            if (isChecked && errors.agreeTerms) {
              setErrors(prev => ({ ...prev, agreeTerms: '' }));
            }
          }}
        />
        <Label htmlFor="agreeTerms" className="text-sm text-slate-700">
          I agree to the <button onClick={onShowTerms} className="text-blue-600 hover:underline">Terms and Conditions</button> and <button onClick={onShowTerms} className="text-blue-600 hover:underline">Privacy Policy</button>
        </Label>
      </div>
      {errors.agreeTerms && <p className="form-error">{errors.agreeTerms}</p>}

      <input type="text" name="honeypot" value={formData.honeypot} onChange={handleInputChange} className="hidden" />

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-900">{errors.submit}</p>
        </div>
      )}
    </motion.div>,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl sm:text-3xl font-black text-slate-900">Create Your Account</DialogTitle>
          <p className="text-sm text-slate-600 mt-2">Step {step} of 4 • {['Personal Info', 'Contact Info', 'Program & Photo', 'Review'][step - 1]}</p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="min-h-[300px] mb-6">
          <AnimatePresence mode="wait" custom={direction}>
            {stepContent[step]}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="btn btn-secondary rounded-lg flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="btn btn-primary rounded-lg flex-1"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn btn-primary rounded-lg flex-1"
            >
              {loading ? 'Submitting...' : 'Complete Registration'}
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
