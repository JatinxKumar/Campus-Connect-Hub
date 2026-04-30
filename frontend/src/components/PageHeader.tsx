import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  variant?: "blue" | "indigo" | "violet" | "sky";
}

const variants = {
  blue: "from-blue-600 via-blue-500 to-indigo-400",
  indigo: "from-indigo-600 via-indigo-500 to-purple-400",
  violet: "from-violet-600 via-violet-500 to-fuchsia-400",
  sky: "from-sky-600 via-sky-500 to-blue-400",
};

const blobColors = {
  blue: "bg-blue-400/20",
  indigo: "bg-indigo-400/20",
  violet: "bg-violet-400/20",
  sky: "bg-sky-400/20",
};

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  variant = "blue" 
}) => {
  return (
    <section className={`relative overflow-hidden py-20 md:py-28 bg-gradient-to-br ${variants[variant]} animate-mesh`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl ${blobColors[variant]} animate-float`} />
        <div className={`absolute top-1/2 -right-24 w-80 h-80 rounded-full blur-3xl ${blobColors[variant]} animate-float-delayed`} />
        <div className={`absolute -bottom-24 left-1/2 w-64 h-64 rounded-full blur-3xl ${blobColors[variant]} animate-float-slow`} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-xl">
            {Icon && <Icon className="w-5 h-5 text-white/90" />}
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/90">
              Campus Connect Hub
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white tracking-tight drop-shadow-2xl">
            {title}
          </h1>
          
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-white/30 rounded-full" />
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed font-medium max-w-2xl drop-shadow-lg">
              {description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Decorative Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
};

export default PageHeader;
