import React from "react";
import { motion } from "framer-motion";

export default function SkeletonDashboard() {
  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="surface p-4">
        <div className="grid gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton-shell p-3">
              <div className="skeleton-bar h-3 w-24" />
              <div className="mt-4 skeleton-bar h-8 w-32" />
              <div className="mt-4 skeleton-bar h-3 w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_390px]">
        <div className="surface h-[620px] p-4">
          <div className="skeleton-bar h-4 w-44" />
          <div className="mt-3 skeleton-bar h-3 w-80" />
          <div className="mt-6 h-[520px] rounded-[8px] border border-white/6 bg-[#0a1017]" />
        </div>
        <div className="space-y-4">
          <div className="surface h-[390px] p-4" />
          <div className="surface h-[220px] p-4" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="surface h-[420px] p-4" />
        <div className="surface h-[420px] p-4" />
      </div>
    </motion.div>
  );
}

