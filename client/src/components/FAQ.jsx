import React, { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Do I need to be fit to join?",
      answer:
        "Absolutely not. IXG welcomes complete beginners. Our community runs are designed so everyone can participate comfortably",
    },
    {
      question: "Is it free to join?",
      answer:
        "A registration fee is necessary to join",
    },
    {
      question: "How far do you run?",
      answer:
        "Most beginner runs are around 4 KM at an easy conversational pace",
    },
    {
      question: "Can beginners join?",
      answer:
        "Definitely. Many of our members started their running journey with IXG",
    },
    {
      question: "What should I bring?",
      answer: "Comfortable running shoes, water, and a positive attitude",
    },
    {
      question: "Do I need to register?",
      answer:
        "Registration is necessary so we know how many runners to expect",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1.5">
  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">
    Frequently Asked Questions
  </span>
</div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Everything You Need Before Your First Run
          </h2>

          <p className="mt-4 text-base leading-relaxed text-gray-500 sm:text-lg">
            Whether you're completely new to running or returning after a
            long break, we've got you covered.
          </p>
        </div>

        {/* Accordion */}
        <div className="mt-14 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-3xl border transition-colors duration-300 ${
                  isOpen
                    ? "border-gray-00 bg-gray-0/40"
                    : "border-gray-100 bg-gray-50 hover:bg-gray-100/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-8 sm:py-6"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "rotate-45 bg-gray-00 text-white"
                        : "bg-white text-gray-500 shadow-sm ring-1 ring-gray-100"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-gray-600 sm:px-8 sm:pb-7 sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom contact card */}
        <div className="mt-14 rounded-3xl border border-gray-100 bg-gray-50 p-8 text-center shadow-sm shadow-gray-200/40 sm:p-10">
          <h3 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
            Still have questions?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
            Reach out to us on Instagram or WhatsApp and we'll be happy to
            help.
          </p>

         <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
  <a
    href="https://www.instagram.com/ixg_runclub?igsh=dnl0M2hzb25jd2x5"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-00 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-00 focus-visible:ring-offset-2"
  >
    Message on Instagram
  </a>

  <a
    href="https://chat.whatsapp.com/EX4eHkOuP9d8saoLDeCEOB"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
  >
    Join WhatsApp Community
  </a>
</div>
        </div>
      </div>
    </section>
  );
}