// Hero.jsx
import api from "../api/axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NextRunCard from "./NextRunCard";
import heroCollage from "../assets/collage.png";
import heroMobile from "../assets/collage1.png";


export default function Hero() {
  const [nextRun, setNextRun] = useState(null);

  useEffect(() => {
    const fetchNextRun = async () => {
      try {
       const res = await api.get("/api/runs");
        setNextRun(res.data[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNextRun();
  }, []);

  return (
    <section id="home" className="relative overflow-hidden bg-gray-100">
      {/* Background */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-500/5" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-500/5" />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:py-16 lg:px-8 lg:py-20">

        {/* HERO */}
        <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-2">

        {/* LEFT */}
<div className="mt-8 lg:mt-0">

           <div className="inline-flex max-w-full items-center rounded-full border border-blue-500/20 bg-blue-50 px-3 py-2">
  <span className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-600 sm:text-xs">
    Where Sport Meets Society
  </span>
</div>

         <h1 className="mt-6 max-w-xl text-5xl font-black leading-none tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Run Together.
              <br />
              <span className="text-blue-800">
                Coffee Later.
              </span>
              
            </h1>

           <div className="mt-8 max-w-xl space-y-5">
  <p className="text-lg font-medium leading-8 text-gray-700 sm:text-xl">
    Sundays, done differently.
  </p>

  <p className="text-base leading-8 text-gray-500 sm:text-lg">
    Leave with <span className="font-semibold text-gray-800">stronger legs</span>. Return with <span className="font-semibold text-gray-800">stronger friendships</span>. Join <span className="font-semibold text-gray-800">Belagavi's most welcoming running community</span> for relaxed runs, great coffee, and people you'll actually look forward to seeing again.
  </p>
</div>

            <motion.div
             className="mt-8 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <NextRunCard
                title={nextRun?.title || ""}
                location={nextRun?.location || ""}
                targetDate={
                  nextRun
                    ? `${nextRun.date}T${nextRun.time}`
                    : null
                }
                dayLabel={
                  nextRun
                    ? new Date(nextRun.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })
                    : ""
                }
                timeLabel={nextRun?.time || ""}
                peopleGoing={nextRun?.registered || 0}
              />
            </motion.div>

          </div>

         <motion.div
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="relative"
>

  <div className="relative overflow-hidden rounded-[36px] border border-gray-200 shadow-2xl">

 {/* Mobile */}
<img
  src={heroMobile}
  alt="IXG Run Club Community"
  className="block h-[720px] w-full object-cover sm:hidden"
/>

{/* Desktop */}
<img
  src={heroCollage}
  alt="IXG Run Club Community"
  className="hidden h-[550px] w-full object-cover lg:h-[850px] sm:block"
/>
   <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6">

 <div className="rounded-2xl border border-white/10 bg-black/15 p-2 sm:rounded-3xl sm:p-0.5 backdrop-blur-sm shadow-xl">

    <div className="grid grid-cols-2 divide-x divide-y divide-white/10">

      <div>
        <div className="p-2.5 sm:p-4">
       <h3 className="text-lg font-black text-yellow-400 sm:text-2xl lg:text-3xl">
  2500+
</h3>
        <p className="mt-1 text-xs text-white sm:text-sm">
          Community Members
        </p>
      </div>
      </div>

      <div>
         <div className="p-2.5 sm:p-4">
        <h3 className="text-lg font-black text-yellow-400 sm:text-2xl lg:text-3xl">
  4 KM
</h3>
        <p className="mt-1 text-xs text-white/80 sm:text-sm">
          Beginner Friendly
        </p>
      </div>
      </div>

      <div>
         <div className="p-2.5 sm:p-4">
       <h3 className="text-lg font-black text-yellow-400 sm:text-2xl lg:text-3xl">
  6+
</h3>
        <p className="mt-1 text-xs text-white/80 sm:text-sm">
          Runs Hosted
        </p>
      </div>
      </div>

      <div>
        <div className="p-2.5 sm:p-4">
       <h3 className="text-lg font-black text-yellow-400 sm:text-2xl lg:text-3xl">
  Every
</h3>
        <p className="mt-1 text-xs text-white/80 sm:text-sm">
          Sunday • 7:00 AM
        </p>
      </div>
      </div>

    </div>

  </div>

</div>

    {/* Dark gradient for readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

  </div>

</motion.div>

        </div>

       

        </div>

      
    </section>
  );
}