import { cn } from '@/lib/utils'

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
