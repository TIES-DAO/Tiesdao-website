// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { FaXTwitter } from "react-icons/fa6";
// import { Eye, TrendingUp } from "lucide-react";
// import { supabase } from "../lib/supabase";

// const collaborators = [
//   {
//     id: "alex",
//     name: "Alex Builder",
//     role: "Web3 Engineer",
//     image: "https://i.pravatar.cc/300?img=12",
//     x: "https://x.com/alexbuilder",
//   },
//   {
//     id: "maya",
//     name: "Maya Labs",
//     role: "Product Designer",
//     image: "https://i.pravatar.cc/300?img=32",
//     x: "https://x.com/mayalabs",
//   },
//   {
//     id: "nova",
//     name: "Nova Dev",
//     role: "Smart Contract Dev",
//     image: "https://i.pravatar.cc/300?img=45",
//     x: "https://x.com/novadev",
//   },
// ];

// const getViewerId = () => {
//   let id = localStorage.getItem("viewer_id");
//   if (!id) {
//     id = crypto.randomUUID();
//     localStorage.setItem("viewer_id", id);
//   }
//   return id;
// };

// export default function Collaboration() {
//   const [views, setViews] = useState({});
//   const [ranked, setRanked] = useState(collaborators);

//   const loadViews = async () => {
//     const counts = {};
//     for (const c of collaborators) {
//       const { count } = await supabase
//         .from("collaboration_views")
//         .select("*", { count: "exact", head: true })
//         .eq("collaborator_id", c.id);

//       counts[c.id] = count || 0;
//     }
//     setViews(counts);

//     // Sort collaborators by views
//     setRanked([...collaborators].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)));
//   };

//   useEffect(() => {
//     const viewerId = getViewerId();

//     collaborators.forEach(async (c) => {
//       // Avoid duplicate views for the same viewer
//       const { data: existing } = await supabase
//         .from("collaboration_views")
//         .select("*")
//         .eq("collaborator_id", c.id)
//         .eq("viewer_id", viewerId)
//         .limit(1);

//       if (!existing?.length) {
//         await supabase.from("collaboration_views").insert({
//           collaborator_id: c.id,
//           viewer_id: viewerId,
//         });
//       }
//     });

//     loadViews();

//     // Real-time listener for new views
//     const channel = supabase
//       .channel("collaboration-realtime")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "collaboration_views" },
//         loadViews
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, []);

//   return (
//     <section id="collaboration" className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-transparent via-gray-900/40 to-transparent">
//       {/* Background glows */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[140px] animate-pulse" />
//         <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[140px] animate-pulse" />
//       </div>

//       <div className="text-center max-w-4xl mx-auto mb-16">
//         <motion.div
//           initial={{ scale: 0.8, opacity: 0 }}
//           whileInView={{ scale: 1, opacity: 1 }}
//           className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-300 backdrop-blur mb-6"
//         >
//           <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
//           Collaborations
//         </motion.div>

//         <h2 className="text-5xl sm:text-6xl font-black text-white">
//           Popular{" "}
//           <span className="bg-gradient-to-r from-blue-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
//             Collaborations
//           </span>
//         </h2>
//         <p className="mt-6 text-gray-300 text-lg font-medium">Ranked by real community interest</p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//         {ranked.map((p, index) => (
//           <motion.div
//             key={p.id}
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.15 }}
//             whileHover={{ y: -15, scale: 1.05 }}
//             className="group relative rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-white/10 shadow-2xl overflow-hidden cursor-pointer backdrop-blur-xl hover:border-pink-500/30 transition-all"
//           >
//             {/* Top rank badge */}
//             {index === 0 && (
//               <motion.div
//                 animate={{ rotate: [0, 5, -5, 0] }}
//                 transition={{ duration: 3, repeat: Infinity }}
//                 className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-yellow-600/40"
//               >
//                 <TrendingUp size={16} /> Top Collab
//               </motion.div>
//             )}

//             <div className="h-60 relative overflow-hidden">
//               <motion.img
//                 src={p.image}
//                 alt={p.name}
//                 className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all" />
//             </div>

//             <div className="p-8 relative z-10">
//               <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all">{p.name}</h3>
//               <p className="text-sm text-gray-400 mt-1">{p.role}</p>

//               <motion.a
//                 whileHover={{ scale: 1.05, x: 5 }}
//                 href={p.x}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-pink-400 hover:text-pink-300 transition-colors"
//               >
//                 <FaXTwitter size={16} /> View on X
//               </motion.a>
//             </div>

//             {/* View Counter */}
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               className="absolute bottom-4 right-4 flex items-center gap-2 bg-gradient-to-r from-pink-600/80 to-purple-600/80 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold text-white shadow-lg shadow-pink-600/40"
//             >
//               <Eye size={16} />
//               <span>{views[p.id] || 0} views</span>
//             </motion.div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//         ))}
//       </div>
//     </section>
//   );
// }


import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";
import { Eye, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase";

// ==========================
// TOGGLE VIEW COUNTER
// ==========================
const SHOW_VIEWS = false;

// ==========================
// COLLABORATORS
// ==========================
const collaborators = [
  {
    id: "alex",
    name: "Alex Builder",
    role: "Web3 Engineer",
    image: "https://i.pravatar.cc/300?img=12",
    x: "https://x.com/alexbuilder",
  },
  {
    id: "maya",
    name: "Maya Labs",
    role: "Product Designer",
    image: "https://i.pravatar.cc/300?img=32",
    x: "https://x.com/mayalabs",
  },
  {
    id: "nova",
    name: "Nova Dev",
    role: "Smart Contract Dev",
    image: "https://i.pravatar.cc/300?img=45",
    x: "https://x.com/novadev",
  },
];

// ==========================
// VIEWER ID (LOCAL)
// ==========================
const getViewerId = () => {
  let id = localStorage.getItem("viewer_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("viewer_id", id);
  }
  return id;
};

export default function Collaboration() {
  const [views, setViews] = useState({});
  const [ranked, setRanked] = useState(collaborators);

  // ==========================
  // LOAD VIEW COUNTS
  // ==========================
  const loadViews = async () => {
    if (!SHOW_VIEWS) return;

    const counts = {};
    for (const c of collaborators) {
      const { count } = await supabase
        .from("collaboration_views")
        .select("*", { count: "exact", head: true })
        .eq("collaborator_id", c.id);

      counts[c.id] = count || 0;
    }

    setViews(counts);
    setRanked(
      [...collaborators].sort(
        (a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)
      )
    );
  };

  useEffect(() => {
    if (!SHOW_VIEWS) return;

    const viewerId = getViewerId();

    collaborators.forEach(async (c) => {
      const { data: existing } = await supabase
        .from("collaboration_views")
        .select("*")
        .eq("collaborator_id", c.id)
        .eq("viewer_id", viewerId)
        .limit(1);

      if (!existing?.length) {
        await supabase.from("collaboration_views").insert({
          collaborator_id: c.id,
          viewer_id: viewerId,
        });
      }
    });

    loadViews();

    const channel = supabase
      .channel("collaboration-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "collaboration_views" },
        loadViews
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <section id="collaboration" className="py-28 px-6">
      <div className="text-center max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold">
          Popular{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
            Collaborations
          </span>
        </h2>
        <p className="mt-4 text-gray-500">Ranked by real community interest</p>
      </div>

      <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {ranked.map((p, index) => (
          <motion.div
            key={p.id}
            whileHover={{ y: -10 }}
            layout
            className="relative rounded-3xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden cursor-pointer"
          >
            {/* Rank Badge */}
            {index === 0 && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                <TrendingUp size={14} /> Top
              </div>
            )}

            <div className="h-60 relative">
              <img
                src={p.image}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="text-sm text-gray-500">{p.role}</p>

              <a
                href={p.x}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm hover:text-blue-500"
              >
                <FaXTwitter /> View on X
              </a>
            </div>

            {/* VIEW COUNTER (TOGGLED) */}
            {SHOW_VIEWS && (
              <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs shadow">
                <Eye size={14} />
                <span>{views[p.id] || 0}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
