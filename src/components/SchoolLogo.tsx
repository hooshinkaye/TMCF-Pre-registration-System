import { GraduationCap, Sparkles } from 'lucide-react';
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
          'relative grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-amber-400 shadow-sm ring-1 ring-white/10',
          markClassName,
        )}
      >
        <GraduationCap className="h-6 w-6" />
        <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-amber-400 p-0.5 text-slate-950" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className={cn('text-lg font-black tracking-tight text-slate-950', textClassName)}>
            J.A.Q
          </div>
          {showTagline && (
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Edu Hub
            </div>
          )}
        </div>
      )}
    </div>
  );
}
