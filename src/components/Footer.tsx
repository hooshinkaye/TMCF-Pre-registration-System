import { Facebook, Twitter, Instagram, MapPin } from 'lucide-react';
import { SchoolLogo } from '@/components/SchoolLogo';

export function Footer() {
  return (
    <footer className="bg-[#0B1F3F] text-gray-400">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Brand */}
          <div className="text-center md:text-left">
            <SchoolLogo
              showTagline
              className="mb-4 justify-center md:justify-start"
              markClassName="bg-white text-slate-950"
              textClassName="text-white"
            />
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <a
                href="https://www.facebook.com/tantingbing.tmcf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4A843] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <span className="text-gray-400 hover:text-[#D4A843] transition-colors cursor-pointer">
                <Twitter className="w-5 h-5" />
              </span>
              <span className="text-gray-400 hover:text-[#D4A843] transition-colors cursor-pointer">
                <Instagram className="w-5 h-5" />
              </span>
            </div>
            <p className="text-sm">Northern Samar, Philippines</p>
          </div>

          {/* Spacer */}
          <div></div>

          {/* GPS Note */}
          <div className="text-center md:text-right">
            <p className="text-sm flex items-center justify-center md:justify-end gap-1.5">
              <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
              Requires GPS device for verification in the Pre-Registration Process.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 text-center">
          <p className="text-xs text-gray-500">
            TMCFI Enrollment Hub
          </p>
        </div>
      </div>
    </footer>
  );
}
