import React from "react";

export default function Partners() {
  const partners = [
    { name: "FORT CAFE" },
    { name: "DAKSHIN FILTER COFFEE" },
    { name: "ABRISTA" },
    { name: "PAISTRY" },
    { name: "Magneta Ice Creams" },
  ];

  // Duplicated for a seamless looping marquee
  const marqueeLogos = [...partners, ...partners];

  const ctaFeatures = [
    {  label: "Sponsor run events" },
    {  label: "Product sampling" },
    {  label: "Brand marketing" },
    {  label: "Community campaigns" },
  ];

  return (
    <section id="sponsors" className="bg-white px-6 py-20 lg:px-8">
      <style>{`
        @keyframes ixg-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ixg-marquee-track {
          animation: ixg-marquee 28s linear infinite;
        }
        .ixg-marquee-wrapper:hover .ixg-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* ---------- Part 1: Our Community Partners ---------- */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-800/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Community Partners
            </span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Brands That Ran With Us
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-500 sm:text-lg">
            these local businesses have helped make our community runs
            possible by sponsoring individual IXG events. every partnership
            helps us create better experiences for our runners
          </p>
        </div>

        {/* Marquee */}
        <div className="ixg-marquee-wrapper relative mt-14 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-32" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-32" />

          <div className="ixg-marquee-track flex w-max items-center gap-6">
            {marqueeLogos.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex shrink-0 items-center gap-3 rounded-full border border-gray-100 bg-gray-50 px-6 py-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-800 shadow-sm ring-1 ring-gray-100">
                  {partner.name.charAt(0)}
                </div>
                <span className="whitespace-nowrap text-sm font-semibold text-gray-700">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Partner grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group flex flex-col items-center rounded-3xl bg-gray-50 px-8 py-10 text-center shadow-sm shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-gray-200/60"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-blue-800 shadow-sm ring-1 ring-gray-100 transition-transform duration-300 group-hover:scale-105">
                {partner.name.charAt(0)}
              </div>
              <p className="mt-5 text-base font-semibold text-gray-900">
                {partner.name}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                Run Partner
              </p>
            </div>
          ))}
        </div>

        {/* ---------- Part 2: Become a Community Partner ---------- */}
        <div className="relative mt-24 overflow-hidden rounded-3xl bg-gray-900 px-8 py-14 shadow-2xl shadow-gray-300/50 sm:px-14 sm:py-16">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-800/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-800/10 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left: content */}
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Why Partner With IXG?
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                Connect your brand with one of Belagavi's fastest-growing
                fitness communities. Sponsor a community run, launch
                products, support wellness initiatives, or collaborate on
                unforgettable experiences.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                {ctaFeatures.map((feature) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2.5 ring-1 ring-white/10"
                  >
                    <span className="text-base">{feature.icon}</span>
                    <span className="text-xs font-medium text-white/80 sm:text-sm">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
{/* Right: CTA */}
<div className="flex flex-col items-start gap-6 lg:items-end lg:text-right">

  <a
    href="#contact"
    className="inline-flex items-center justify-center rounded-full bg-blue-800 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
  >
    Become a Partner
    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
      →
    </span>
  </a>

  <div className="space-y-1">
    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
      Partnership Enquiries
    </p>

    <a
      href="tel:+919113817253"
      className="text-lg font-semibold text-white transition hover:text-blue-400"
    >
      +91 91138 17253
    </a>
  </div>

</div>
          </div>
        </div>
      </div>
    </section>
  );
}