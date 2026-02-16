'use client'

import { useSession } from 'next-auth/react'
import Avatar from '@/components/ui/Avatar'
import ThemeToggle from '@/components/layout/ThemeToggle'
import NotificationBell from '@/components/notifications/NotificationBell'
import { Menu } from 'lucide-react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <Menu className="w-6 h-6" />
        </button>

        <div className="lg:hidden">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            HireHelper
          </h1>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <ThemeToggle />
          <NotificationBell />
          <Avatar 
            src={session?.user?.image} 
            alt={session?.user?.name}
            size="md"
          />
        </div>
      </div>
    </header>
  )
}
