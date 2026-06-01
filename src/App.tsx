import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useSchedule } from '@/hooks/useSchedule';
import { MaintenancePage } from '@/components/MaintenancePage';
import { Navbar } from '@/components/Navbar';
import { Chatbot } from '@/components/Chatbot';
import { RegistrationWizard } from '@/components/RegistrationWizardNew';
import { LoginModal } from '@/components/LoginModal';
import { TermsModal } from '@/components/TermsModal';
import { SuccessModal } from '@/components/SuccessModal';
import { CaptchaModal } from '@/components/CaptchaModal';
import { HomePageNew } from '@/pages/HomePageNew';
import { SchedulePage } from '@/pages/SchedulePage';
import { AdminPage } from '@/pages/AdminPage';
import '@/styles/design-system.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      setSuccessOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar onRegisterClick={() => setRegisterOpen(true)} />
              <HomePageNew
                onRegister={() => setRegisterOpen(true)}
                onLogin={() => setLoginOpen(true)}
              />
              <Chatbot />
            </>
          }
        />
        <Route
          path="/schedule"
          element={<SchedulePage />}
        />
        <Route
          path="/admin"
          element={<AdminPage />}
        />
      </Routes>

      <RegistrationWizard
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onShowTerms={() => { setRegisterOpen(false); setTermsOpen(true); }}
        onShowSuccess={() => setSuccessOpen(true)}
      />

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
      />

      <TermsModal
        open={termsOpen}
        onOpenChange={(open) => {
          setTermsOpen(open);
          if (!open) setRegisterOpen(true);
        }}
      />

      <SuccessModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
      />

      <CaptchaModal
        open={captchaOpen}
        onOpenChange={setCaptchaOpen}
        onVerify={(ans, lat, lng) => {
          console.log('Verified:', ans, lat, lng);
        }}
      />
    </>
  );
}

function App() {
  const { isOpen, nextOpen, currentTime } = useSchedule();

  if (!isOpen) {
    return <MaintenancePage nextOpen={nextOpen} currentTime={currentTime} />;
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
