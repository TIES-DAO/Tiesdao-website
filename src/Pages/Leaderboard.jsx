import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Trophy } from "lucide-react";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("daily_streaks")
        .select("viewer_id, streak, username")
        .order("streak", { ascending: false })
        .limit(10);
      setLeaders(data || []);
    };

    fetchLeaderboard();
  }, []);

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Weekly Leaderboard
      </h2>

      <ul className="space-y-4">
        {leaders.map((user, idx) => (
          <li
            key={user.viewer_id}
            className="flex items-center justify-between bg-white dark:bg-black p-4 rounded-xl shadow-md"
          >
            <div className="flex items-center gap-4">
              <Trophy
                size={24}
                className={`${
                  idx === 0
                    ? "text-yellow-400"
                    : idx === 1
                    ? "text-gray-400"
                    : idx === 2
                    ? "text-orange-500"
                    : "text-gray-300"
                }`}
              />
              <span className="font-semibold text-gray-900 dark:text-white">
                {user.username || "Anonymous"}
              </span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              {user.streak} 🔥
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
