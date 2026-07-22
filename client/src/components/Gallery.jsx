import React from "react";
import run1 from "../assets/run1.png";
import run2 from "../assets/run2.png";
import run3 from "../assets/run3.png";
import run4 from "../assets/run4.png";
import run5 from "../assets/run5.png";
import run6 from "../assets/run6.png";
import run7 from "../assets/run7.png";
import run9 from "../assets/run9.png";
export default function Gallery() {
  const photos = [
    { src: run7, location: "Magneta Cafe", date: "July 19 2026" },
    { src: run1, location: "Fort Cafe", date: "June 21 2026" },
    { src: run2, location: "Fort Cafe", date: "June 21 2026" },
    { src: run3, location: "Hanuman Nagar", date: "June 28 2026" },
    { src: run4, location: "Paistry", date: "July 1 2026" },
    { src: run5, location: "Abrista", date: "July 5 2026" },
    { src: run6, location: "Abrista", date: "July 5 2026" },
    { src: run9, location: "Fort Cafe", date: "June 21 2026" },
    
    
  ];

  return (
    <section  id="gallery" className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Run. Connect. Repeat.
          </h2>
          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            Real moments from the IXG community.
          </p>
        </div>

        {/* Masonry gallery */}
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="group relative mb-5 break-inside-avoid overflow-hidden rounded-3xl shadow-md shadow-gray-200/60 transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-300/60"
            >
              <img
                src={photo.src}
                alt={`${photo.location} run`}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Location + date */}
              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold text-white">
                  {photo.location}
                </p>
                <p className="text-xs text-white/70">{photo.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}