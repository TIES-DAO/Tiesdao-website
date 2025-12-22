import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaXTwitter } from "react-icons/fa6";
import { Eye, TrendingUp } from "lucide-react";
import { supabase } from "../lib/supabase";

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

  const loadViews = async () => {
    const counts = {};
    for (const c of collaborators) {
      const { count } = await supabase
        .from("collaboration_views")
        .select("*", { count: "exact", head: true })
        .eq("collaborator_id", c.id);

      counts[c.id] = count || 0;
    }
    setViews(counts);

    // Sort collaborators by views
    setRanked([...collaborators].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0)));
  };

  useEffect(() => {
    const viewerId = getViewerId();

    collaborators.forEach(async (c) => {
      // Avoid duplicate views for the same viewer
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

    // Real-time listener for new views
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

            {/* View Counter */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/90 dark:bg-black/70 backdrop-blur px-3 py-1 rounded-full text-xs shadow">
              <Eye size={14} />
              <span>{views[p.id] || 0}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
