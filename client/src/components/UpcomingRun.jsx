
import React, { useEffect, useState } from "react";
import api from "../api/axios";



export default function UpcomingRun({ onRegister }) {
  const [run, setRun] = useState(null);
  
  useEffect(() => {
  const fetchRun = async () => {
    try {
      const res = await api.get("/api/runs");

     
     const runs = Array.isArray(res.data) ? res.data : [];
const nextOpenRun = runs.find((item) => item.registrationOpen);

setRun(nextOpenRun || null);
    } catch (error) {
      
    }
  };

  fetchRun();
}, []);
if (!run) {
  return (
    <section className="bg-white py-20 text-center">
      <p className="text-gray-500">
        Registrations are currently closed. Please check back soon.
      </p>
    </section>
  );
}
  const details = [
    {
      label: "Location",
      value: run.location,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      ),
    },
    {
      label: "Date",
     value: run.date,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0V11.25A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      ),
    },
    {
      label: "Time",
     value: run.time,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l4 2"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Distance",
      value: run.distance,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.5l3-3 3.5 3.5L15 8.5l6 6M3 20.25h18"
          />
        </svg>
      ),
    },
    {
      label: "Registered",
      value: `${run.registered} runners`,
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="runs" className="bg-gray-100 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/40 sm:p-10">
          {/* Decorative background accent */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-blue-900/5 transition-transform duration-500 group-hover:scale-110" />

          {/* Badge */}
          <div className="relative inline-flex items-center gap-2 rounded-full bg-blue-900/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-900" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-900">
              Upcoming
            </span>
          </div>

          {/* Title */}
          <h2 className="relative mt-5 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Next Community Run
          </h2>

          <p className="relative mt-2 text-sm text-gray-500">
            Show up, run at your pace, and grab a coffee with the crew after
          </p>

          {/* Details */}
          <div className="relative mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {details.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3.5 transition-colors duration-200 group-hover:bg-gray-50/80"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue-900 shadow-sm ring-1 ring-gray-100">
                  {item.icon}
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {item.label}
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="relative mt-9 flex flex-col gap-3 sm:flex-row">
           <button
  onClick={() => onRegister(run)}
  className="inline-flex flex-1 items-center hover:cursor-pointer justify-center rounded-full bg-blue-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/25 transition hover:bg-blue-800 hover:shadow-blue-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
>
  Register Now
</button>

           <a
  href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=IXG+Community+Run&dates=20260719T013000Z/20260719T030000Z&details=Join+IXG+Run+Club+for+our+Sunday+community+run!&location=Vaccine+Depot,+Belagavi"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex flex-1 items-center justify-center rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
>
  Add to Calendar
</a>
          </div>
        </div>
      </div>
    
    </section>
  );
}