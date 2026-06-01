import { BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SchoolLogoProps {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showTagline?: boolean;
  compact?: boolean;
}

export function SchoolLogo({
  className,
  markClassName,
  textClassName,
  showTagline = false,
  compact = false,
}: SchoolLogoProps) {
  return (
    <div className={cn('inline-flex items-center gap-3', className)}>
      <div
        className={cn(
          'grid h-11 w-11 place-items-center rounded-xl bg-[#0B1F3F] text-[#D4A843] shadow-sm ring-1 ring-white/10',
          markClassName,
        )}
      >
        <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className={cn('text-lg font-black tracking-tight text-slate-950', textClassName)}>
            TMCFI
          </div>
          {showTagline && (
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Enrollment Hub
            </div>
          )}
        </div>
      )}
    </div>
  );
}
