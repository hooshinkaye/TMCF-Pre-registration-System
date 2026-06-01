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
          'grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-slate-200',
          markClassName,
        )}
      >
        <img src="/school-logo.png" alt="J.A.Q National Colleges logo" className="h-full w-full object-cover" />
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
