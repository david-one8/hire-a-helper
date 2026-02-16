export default function NotificationItem({ notification }) {
  return (
    <div className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-200 dark:border-slate-800 last:border-0 cursor-pointer">
      <p className="text-sm text-slate-900 dark:text-white">{notification.body}</p>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>
  )
}
