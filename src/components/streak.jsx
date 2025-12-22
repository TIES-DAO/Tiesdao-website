// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Sun } from "lucide-react";
// import { useAuth } from "../context/AuthContext";
// import { supabase } from "../lib/supabase";

// export default function DailyStreak() {
//   const { user, streak, loading } = useAuth();
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentStreak, setCurrentStreak] = useState(0);
//   const [bestStreak, setBestStreak] = useState(0);

//   useEffect(() => {
//     if (!user || loading) return;

//     const today = new Date().toDateString();
//     const lastCheckIn = streak.lastCheckIn ? new Date(streak.lastCheckIn).toDateString() : null;

//     let newCurrent = streak.current;

//     if (lastCheckIn !== today) {
//       // Update streak
//       const diff = lastCheckIn ? (new Date(today) - new Date(lastCheckIn)) / (1000 * 60 * 60 * 24) : 1;
//       newCurrent = diff === 1 ? streak.current + 1 : 1;

//       const newBest = Math.max(streak.best, newCurrent);

//       // Save to Supabase
//       supabase
//         .from("daily_streaks")
//         .upsert({
//           user_id: user.id,
//           current_streak: newCurrent,
//           best_streak: newBest,
//           last_check_in: new Date().toISOString(),
//         })
//         .then(() => {
//           setCurrentStreak(newCurrent);
//           setBestStreak(newBest);
//           setShowPopup(true);
//         });
//     }
//   }, [user, streak, loading]);

//   useEffect(() => {
//     if (showPopup) {
//       const timer = setTimeout(() => setShowPopup(false), 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [showPopup]);

//   if (!user) return null;

//   return (
//     <AnimatePresence>
//       {showPopup && (
//         <motion.div
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           exit={{ y: 50, opacity: 0 }}
//           transition={{ type: "spring", stiffness: 120 }}
//           className="fixed bottom-8 right-8 w-80 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-2xl p-4 flex flex-col items-center gap-2 z-50"
//         >
//           <div className="flex items-center gap-2">
//             <Sun size={28} className="animate-pulse" />
//             <span className="font-bold text-lg">🔥 Daily Streak!</span>
//           </div>
//           <p>Current Streak: {currentStreak} {currentStreak === 1 ? "day" : "days"}</p>
//           <p>Best Streak: {bestStreak} {bestStreak === 1 ? "day" : "days"}</p>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
