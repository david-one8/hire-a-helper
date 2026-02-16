import { cn } from '@/lib/utils'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors bg-white dark:bg-slate-900 text-slate-900 dark:text-white',
          error 
            ? 'border-red-500 dark:border-red-500' 
            : 'border-slate-300 dark:border-slate-700',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
