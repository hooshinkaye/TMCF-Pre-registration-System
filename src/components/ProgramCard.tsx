import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function ProgramCard({ icon: Icon, title, description, index }: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
        borderColor: 'rgba(212,168,67,0.3)',
      }}
      className="bg-white border border-[#F0EEEA] rounded-2xl p-8 transition-colors cursor-default"
    >
      <motion.div
        whileHover={{ backgroundColor: 'rgba(212,168,67,0.1)' }}
        className="w-12 h-12 rounded-full bg-[rgba(11,31,63,0.06)] flex items-center justify-center mb-4"
      >
        <Icon className="w-[22px] h-[22px] text-[#0B1F3F]" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-[13px] text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
