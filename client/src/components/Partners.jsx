import React from "react";

import fortCibusLogo from "../assets/partners/fort-cibus.png";
import dakshinLogo from "../assets/partners/dakshin.png";
import abristaLogo from "../assets/partners/abrista.png";
import paistryLogo from "../assets/partners/paistry.png";
import magnetaLogo from "../assets/partners/magneta.png";

export default function Partners() {
  const partners = [
    {
      name: "FORT CIBUS",
      logo: fortCibusLogo,
    },
    {
      name: "DAKSHIN FILTER COFFEE",
      logo: dakshinLogo,
    },
    {
      name: "ABRISTA",
      logo: abristaLogo,
    },
    {
      name: "PAISTRY",
      logo: paistryLogo,
    },
    {
      name: "Magneta Ice Creams",
      logo: magnetaLogo,
    },
  ];

  const marqueeLogos = [...partners, ...partners];

  const ctaFeatures = [
    { label: "Sponsor run events" },
    { label: "Product sampling" },
    { label: "Brand marketing" },
    { label: "Community campaigns" },
  ];

  return (
    <section id="sponsors" className="bg-white px-6 py-20 lg:px-8">
      <style>{`
        @keyframes ixg-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ixg-marquee-track {
          animation: ixg-marquee 28s linear infinite;
        }

        .ixg-marquee-wrapper:hover .ixg-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">

        {/* Header */}

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
            These local businesses have supported IXG Run Club by sponsoring
            community runs, experiences and giveaways. Their support helps us
            build a stronger running community in Belagavi.
          </p>

        </div>

        {/* Logo Marquee */}

        <div className="ixg-marquee-wrapper relative mt-16 overflow-hidden">

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />

          <div className="ixg-marquee-track flex w-max items-center gap-10">

            {marqueeLogos.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex h-24 w-44 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:shadow-md"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-14 w-auto object-contain"
                />
              </div>
            ))}

          </div>

        </div>
                {/* Partner Grid */}
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-24 items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 w-auto object-contain transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5 text-center">
                <h3 className="text-sm font-semibold tracking-wide text-gray-900">
                  {partner.name}
                </h3>

                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">
                  Community Partner
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Become a Partner */}
        <div className="relative mt-24 overflow-hidden rounded-[2rem] bg-gray-900 px-8 py-14 sm:px-14 lg:px-16">

          <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <span className="inline-block rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">
                Partner With IXG
              </span>

              <h3 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
                Help Shape Belagavi's Running Community
              </h3>

              <p className="mt-5 max-w-xl leading-8 text-gray-300">
                Whether you're launching a new product, growing your local
                presence or simply want to support a healthier community, we'd
                love to collaborate. Every partnership is tailored to create
                value for both your brand and our runners.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {ctaFeatures.map((feature) => (
                  <div
                    key={feature.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-gray-200 backdrop-blur-sm"
                  >
                    {feature.label}
                  </div>
                ))}
              </div>

            </div>

            <div className="flex flex-col items-start gap-8 lg:items-end lg:text-right">

              <a
                href="#contact"
                className="inline-flex items-center gap-3 rounded-full bg-blue-700 px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-blue-600"
              >
                Become a Partner
                <span className="text-lg">→</span>
              </a>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Partnership Enquiries
                </p>

                <a
                  href="tel:+919113817253"
                  className="mt-2 block text-2xl font-bold text-white transition hover:text-blue-400"
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