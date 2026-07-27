import { motion } from "framer-motion";
import { Camera } from "lucide-react";

// Use Vite's import.meta.glob to automatically import all images from the gallery folder
const galleryImageModules = import.meta.glob('/src/assets/gallery/*');

// Correctly resolve image paths for both development and production
const imagePaths = Object.keys(galleryImageModules).map(
  (path) => new URL(path, import.meta.url).href
);

const EventGallery = () => {
  return (
    <div className="bg-gray-900/50 rounded-3xl border border-gray-700/50 p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Camera className="text-red-500" />
          Event Gallery
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Highlights from our past community events, workshops, and meetups.
        </p>
        <p className="text-yellow-400 font-semibold mt-4">
          Thank you to everyone who joined and made our events a success!
        </p>
      </motion.div>

      {imagePaths.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {imagePaths.map((path, index) => (
            <motion.div
              key={path}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="aspect-square bg-gray-800 rounded-xl overflow-hidden"
            >
              <img src={path} alt={`Event gallery image ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No event images have been added yet. Check back soon!</p>
      )}
    </div>
  );
};

export default EventGallery;