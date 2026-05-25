import { Hero } from '@/sections/Hero';
import { Programs } from '@/sections/Programs';
import { RegistrationCTA } from '@/sections/RegistrationCTA';
import { Footer } from '@/components/Footer';

interface HomePageProps {
  onRegister: () => void;
  onLogin: () => void;
}

export function HomePage({ onRegister, onLogin }: HomePageProps) {
  return (
    <>
      <Hero onRegister={onRegister} onLogin={onLogin} />
      <Programs />
      <RegistrationCTA onRegister={onRegister} />
      <Footer />
    </>
  );
}
