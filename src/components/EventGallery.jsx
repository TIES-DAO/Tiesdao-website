import { motion } from "framer-motion";
import { Camera } from "lucide-react";

// --- Step 1: Import your images one by one ---
// Make sure the image files exist in the 'src/assets/gallery/' folder.
import eventPhoto01 from '../assets/gallery/event_photo_01.jpg';
import eventPhoto02 from '../assets/gallery/event_photo_02.jpg';
import eventPhoto03 from '../assets/gallery/event_photo_03.jpg';
import eventPhoto04 from '../assets/gallery/event_photo_04.jpg';
import eventPhoto05 from '../assets/gallery/event_photo_05.jpg';
import eventPhoto06 from '../assets/gallery/event_photo_06.jpg';
import eventPhoto07 from '../assets/gallery/event_photo_07.jpg';
import eventPhoto08 from '../assets/gallery/event_photo_08.jpg';
import eventPhoto09 from '../assets/gallery/event_photo_09.jpg';
import eventPhoto10 from '../assets/gallery/event_photo_10.jpg';
import eventPhoto11 from '../assets/gallery/event_photo_11.jpg';
import eventPhoto12 from '../assets/gallery/event_photo_12.jpg';
import eventPhoto13 from '../assets/gallery/event_photo_13.jpg';
import eventPhoto14 from '../assets/gallery/event_photo_14.jpg';
import eventPhoto15 from '../assets/gallery/event_photo_15.jpg';
import eventPhoto16 from '../assets/gallery/event_photo_16.jpg';

// --- Step 2: Add the imported images to an array ---
// The order you place them here is the order they will appear in the gallery.
const imagePaths = [
  eventPhoto01, eventPhoto02, eventPhoto03, eventPhoto04, eventPhoto05,
  eventPhoto06, eventPhoto07, eventPhoto08, eventPhoto09, eventPhoto10,
  eventPhoto11, eventPhoto12, eventPhoto13, eventPhoto14, eventPhoto15,
  eventPhoto16, 
];

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