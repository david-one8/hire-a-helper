'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Home, Briefcase, Inbox, Send, Plus, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Feed', href: '/feed', icon: Home },
  { name: 'My Tasks', href: '/my-tasks', icon: Briefcase },
  { name: 'Requests', href: '/requests', icon: Inbox },
  { name: 'My Requests', href: '/my-requests', icon: Send },
  { name: 'Add Task', href: '/add-task', icon: Plus },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
        <div className="flex items-center h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            HireHelper
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => signOut()}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
