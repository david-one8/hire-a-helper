'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, Plus, Send, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Feed', href: '/feed', icon: Home },
  { name: 'My Tasks', href: '/my-tasks', icon: Briefcase },
  { name: 'Add', href: '/add-task', icon: Plus },
  { name: 'Requests', href: '/my-requests', icon: Send },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
      <div className="grid grid-cols-5">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-3 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-600 dark:text-slate-400'
              )}
            >
              <item.icon className={cn('w-6 h-6 mb-1', item.name === 'Add' && 'w-7 h-7')} />
              {item.name}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
