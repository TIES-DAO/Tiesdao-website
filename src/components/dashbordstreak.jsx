// import { useAuth } from '../context/AuthContext'
// import DailyStreak from './streak'
// import { Sun } from 'lucide-react'

// export default function Dashboard() {
//   const { user, streak } = useAuth()

//   if (!user) return <p>Please log in</p>

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-4 bg-gray-50 dark:bg-gray-900">
//       <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
//         Welcome, {user.email}
//       </h1>

//       <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//         <Sun size={36} className="text-yellow-400 animate-pulse" />
//         <div>
//           <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
//             Current Streak: {streak.current || 0} {streak.current === 1 ? 'day' : 'days'}
//           </p>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Best Streak: {streak.best || 0} {streak.best === 1 ? 'day' : 'days'}
//           </p>
//         </div>
//       </div>

//       <DailyStreak />
//     </div>
//   )
// }
