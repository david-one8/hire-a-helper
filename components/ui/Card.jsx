import { cn } from '@/lib/utils'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
