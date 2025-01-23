import { motion } from "motion/react";

export default function LoadingAnimation() {
  return (
    <motion.div className="flex items-center justify-center py-10">
      <motion.div
        className="rounded-full bg-indigo-400 h-16 w-16"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
