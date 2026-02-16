import { cn } from '@/lib/utils'

export default function Avatar({ src, alt, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20',
  }

  return (
    <div className={cn('rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold overflow-hidden', sizes[size])}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{alt?.[0]?.toUpperCase() || 'U'}</span>
      )}
    </div>
  )
}
