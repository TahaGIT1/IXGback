import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic to be added later
  };

  const contactCards = [
    {
      icon: "📍",
      label: "Location",
      value: "Belagavi, Karnataka",
      href: null,
    },
    {
      icon: "📧",
      label: "Email",
      value: "ixgrunclub@gmail.com",
      href: "ixgrunclub@gmail.com",
    },
    {
      icon: "📱",
      label: "WhatsApp",
      value: "Join Community",
      href: "https://chat.whatsapp.com/EX4eHkOuP9d8saoLDeCEOB",
    },
    {
      icon: "📷",
      label: "Instagram",
      value: "@ixg_runclub",
      href: "https://www.instagram.com/ixg_runclub?igsh=dnl0M2hzb25jd2x5",
    },
  ];

  return (
    <section id= "contact"className="relative overflow-hidden bg-gray-50 px-6 py-20 lg:px-8">
      {/* Decorative background blobs for glassmorphism to sit on */}
      <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600">
                Contact
              </span>
            </div>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Ready For Your Next Run?
            </h2>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
              Join one of Belagavi's fastest-growing fitness communities.
              Whether you're looking to run, volunteer, partner with us, or
              simply say hello, we'd love to hear from you.
            </p>

            {/* Contact cards */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contactCards.map((card) => {
                const CardTag = card.href ? "a" : "div";
                const cardProps = card.href
                  ? {
                      href: card.href,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {};

                return (
                  <CardTag
                    key={card.label}
                    {...cardProps}
                    className="group flex items-start gap-4 rounded-3xl border border-white/60 bg-white/60 p-5 shadow-sm shadow-gray-200/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-lg hover:shadow-orange-100"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-1 ring-gray-100 transition-transform duration-300 group-hover:scale-105">
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        {card.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-gray-900">
                        {card.value}
                      </p>
                    </div>
                  </CardTag>
                );
              })}
            </div>
          </div>

          {/* Right column: form */}
          <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-md sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="text-xs font-semibold uppercase tracking-wide text-gray-500"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help..."
                  className="mt-2 w-full resize-none rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600 hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps placeholder */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-xl shadow-gray-200/50 backdrop-blur-md">
          <div className="flex flex-col items-center justify-between gap-6 p-8 sm:flex-row sm:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-2xl">
                📍
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900 sm:text-lg">
                  Club Road, Belgaum
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Location may vary, but usually around this area
                </p>
              </div>
            </div>

            <a

            
              href="https://maps.app.goo.gl/vjyQmHkrVpCRrujf7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              Open in Google Maps
            </a>
          </div>

         {/* Google Map */}
<div className="relative h-56 w-full overflow-hidden sm:h-64">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7675.4502176343!2d74.50360979999999!3d15.871038700000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbf66ab0a262e4d%3A0x5fe81c248a96ea02!2sGolf%20Greens!5e0!3m2!1sen!2sin!4v1784107270197!5m2!1sen!2sin"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className="h-full w-full"
  ></iframe>
</div>
        </div>
      </div>
    </section>
  );
}