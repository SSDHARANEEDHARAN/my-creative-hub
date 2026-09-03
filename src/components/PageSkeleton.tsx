import { motion } from "framer-motion";

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background bg-mesh pt-24">
      <div className="container mx-auto px-6">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="skeleton h-12 w-64 mx-auto mb-4"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="skeleton h-6 w-96 mx-auto"
          />
        </div>
        
        {/* Grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="skeleton h-64 rounded-3xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;