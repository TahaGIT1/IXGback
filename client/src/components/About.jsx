import React from "react";
import communityImage from "../assets/about.png";

export default function WhyJoin() {
  const features = [
    {
      icon: "",
      title: "Beginner Friendly",
      description: "No one gets left behind",
    },
    {
      icon: "",
      title: "Coffee & Community",
      description: "Every run ends with conversations",
    },
    {
      icon: "",
      title: "Meet Amazing People",
      description: "Students, professionals, and everyone in between",
    },
    {
      icon: "",
      title: "Explore Belagavi",
      description: "New routes, new corners of the city",
    },
  ];

  const stats = [
    { value: "3000+", label: "Community Members" },
    { value: "6+", label: "Runs Hosted" },
    { value: "4 KM", label: "Beginner Friendly" },
    { value: "Sunday", label: "7:00 AM" },
  ];

  return (
    <section id="about" className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        {/* Left Column - Content */}
        <div>
          {/* Badge */}
         

          {/* Heading */}
          <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Where Sport Meets Society.
          </h2>

          {/* Description */}
          <div className="mt-6 space-y-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            <p>
              What started as a small group of runners in Belagavi has quickly
              grown into one of the city's fastest growing running communities
            </p>

            <p>
              Every Sunday morning, we come together for an easy,
              beginner-friendly 4 KM run followed by coffee, conversations, and
              new friendships
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-colors duration-200 hover:bg-gray-100/80"
              >
                <div className="text-2xl">{feature.icon}</div>

                <p className="mt-3 text-sm font-semibold text-gray-900">
                  {feature.title}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-gray-200 pt-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

         
        </div>

        {/* Right Column - Image */}
        <div className="group relative overflow-hidden rounded-3xl shadow-xl shadow-gray-200/60">
          <img
            src={communityImage}
            alt="IXG Run Club community"
            className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  );
}