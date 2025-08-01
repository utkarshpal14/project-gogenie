
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background animation */}
      {isHydrated && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-goginie-primary/20 to-transparent blur-3xl opacity-30 pointer-events-none z-0"
            animate={{
              x: mousePosition.x / 10 - 300,
              y: mousePosition.y / 10 - 300,
            }}
            transition={{ type: "spring", mass: 5, stiffness: 40, damping: 30 }}
          />
          <motion.div
            className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-goginie-primary/10 to-transparent blur-3xl opacity-20 pointer-events-none z-0"
            animate={{
              x: -mousePosition.x / 20 + 200,
              y: -mousePosition.y / 20 + 200,
            }}
            transition={{ type: "spring", mass: 3, stiffness: 30, damping: 20 }}
          />
        </>
      )}
      
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={window.location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex-grow relative z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
