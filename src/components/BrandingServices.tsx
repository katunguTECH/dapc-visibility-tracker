// src/components/BrandingServices.tsx
"use client";

import Image from "next/image";

const SERVICES = [
  {
    title: "Corporate Identity & Brand Development",
    items: [
      "Logo design and redesign",
      "Brand name development and positioning",
      "Corporate colour palette development",
      "Brand typography and font selection",
      "Brand guidelines and identity manuals",
      "Company profiles and corporate presentations",
      "Brand messaging, slogans and taglines",
      "Business stationery design",
      "Brand registration support and coordination",
    ],
  },
  {
    title: "Digital Branding",
    items: [
      "Website design and development",
      "E-commerce website development",
      "Social media profile setup and optimisation",
      "Social media branding and templates",
      "Google Business Profile setup and optimisation",
      "Online reputation management",
      "Search Engine Optimisation (SEO)",
      "Generative Engine Optimisation (GEO)",
      "Digital brand audits",
      "Online brand visibility campaigns",
    ],
  },
  {
    title: "Marketing & Advertising Materials",
    items: [
      "Flyers, posters and brochures",
      "Product catalogues",
      "Company presentations",
      "Promotional banners",
      "Digital advertisements",
      "Email marketing templates",
      "WhatsApp marketing creatives",
      "Product launch campaigns",
      "Marketing campaign strategy and execution",
    ],
  },
  {
    title: "Physical & Outdoor Branding",
    items: [
      "Office branding: reception walls, glass frosting, signage",
      "Vehicle branding: full wraps, partial wraps, fleet branding",
      "Uniform branding: staff uniforms, T-shirts, jackets, caps",
      "Outdoor advertising: billboards, shop signage, building branding",
      "Shopfront branding",
      "Exhibition stands and display booths",
      "Promotional merchandise",
      "Branded corporate gifts",
      "Wall graphics and murals",
      "Point-of-sale branding",
    ],
  },
  {
    title: "Product Branding & Packaging",
    items: [
      "Product logo and identity design",
      "Packaging design",
      "Product labels and stickers",
      "Bottle and container branding",
      "Food and beverage packaging",
      "Retail display packaging",
      "Product photography",
      "Product launch branding",
    ],
  },
  {
    title: "Photography, Video & Creative Production",
    items: [
      "Corporate photography",
      "Staff and executive portraits",
      "Product photography",
      "Corporate profile videos",
      "Promotional videos and adverts",
      "Social media reels",
      "Animation and motion graphics",
      "Explainer videos",
      "Customer testimonials",
      "Event photography and videography",
    ],
  },
  {
    title: "Events & Experiential Branding",
    items: [
      "Corporate event branding",
      "Conference and exhibition branding",
      "Stage backdrops and media walls",
      "Product launch activations",
      "Roadshow branding",
      "Promotional tents and gazebos",
      "Branded event merchandise",
      "Experiential marketing campaigns",
      "Brand ambassadors and promotional staff coordination",
    ],
  },
  {
    title: "School & Institutional Branding",
    items: [
      "School logo design and modernisation",
      "School prospectuses",
      "Admission campaign materials",
      "School websites",
      "School social media management",
      "Branded school uniforms and sportswear",
      "School signage and wayfinding",
      "School vehicle branding",
      "Graduation and awards ceremony branding",
      "Digital reputation management",
      "Online enrolment marketing campaigns",
    ],
  },
];

const PACKAGES = [
  { name: "Brand Starter", covers: "Logo, colours, business cards and basic brand identity." },
  { name: "Digital Starter", covers: "Social media setup, Google Business Profile and online visibility." },
  { name: "Business Growth", covers: "SEO, GEO, social media and digital advertising." },
  { name: "Corporate Identity", covers: "Company profile, stationery, signage and brand guidelines." },
  { name: "Complete Brand Transformation", covers: "Corporate identity, website, physical branding and digital marketing." },
];

export default function BrandingServices() {
  return (
    <section id="branding" className="mt-20 pt-16 border-t border-gray-200">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-6">
          <span className="text-sm text-purple-700 font-medium">Full-Service Branding</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          We Build Brands. <span className="gradient-text">We Build Visibility.</span>
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          From the first logo to a fully established brand, DAPC provides the creative, digital and marketing solutions businesses need to compete and grow.
        </p>
        <p className="text-blue-600 font-semibold mt-2">
          We Build Brands. We Build Visibility. We Build Business.
        </p>
      </div>

      <div className="mb-16 max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
          <div className="relative w-full h-[280px] sm:h-[420px] md:h-[500px]">
            <Image
              src="/branded-vehicle-blurred.jpeg"
              alt="DAPC branded vehicle - full wrap fleet branding example"
              fill
              priority={false}
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1000px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white z-10">
              <p className="text-sm uppercase tracking-widest opacity-80">Portfolio</p>
              <h3 className="text-2xl md:text-3xl font-bold">Vehicle Branding - Full Wrap</h3>
              <p className="text-sm opacity-90">Fleet branding · Digital marketing · Business growth</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-3">
          Number plates have been blurred for privacy. Vehicle branding is one of DAPC&apos;s physical branding services.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {SERVICES.map((service, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-blue-200 transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {String(idx + 1).padStart(2, "0")}
              </div>
              <h3 className="font-bold text-gray-900 leading-tight">{service.title}</h3>
            </div>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {service.items.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-blue-500 shrink-0">{"\u2713"}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-2">Recommended DAPC Service Packages</h3>
        <p className="text-gray-600 text-center mb-8">Bundled solutions that match your needs and budget.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.map((pkg) => (
            <div key={pkg.name} className="rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6 hover:border-blue-300 transition">
              <h4 className="font-bold text-lg text-blue-800 mb-2">{pkg.name}</h4>
              <p className="text-sm text-gray-700">{pkg.covers}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h3 className="text-2xl font-bold text-center mb-8">DAPC Business Divisions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "DAPC Branding Studio", desc: "Corporate identity, graphic design, packaging and physical branding." },
            { name: "DAPC Digital", desc: "Websites, SEO, GEO, social media and online marketing." },
            { name: "DAPC Marketing & Activations", desc: "Events, campaigns, advertising and brand activations." },
            { name: "DAPC Business Growth Solutions", desc: "SME visibility, lead generation, customer acquisition and digital business development." },
          ].map((div) => (
            <div key={div.name} className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:shadow-md transition">
              <h4 className="font-semibold text-gray-900 mb-2">{div.name}</h4>
              <p className="text-xs text-gray-600">{div.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white">
        <h3 className="text-3xl font-bold mb-3">Ready to Build Your Brand?</h3>
        <p className="opacity-90 mb-6 max-w-xl mx-auto">
          Talk to DAPC about your branding, digital marketing and business growth needs. Free consultation available.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="https://wa.me/254719584440?text=Hello%20DAPC!%20I%27d%20like%20to%20discuss%20branding%20services." target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition">
            WhatsApp: +254 719 584 440
          </a>
          <a href="mailto:info@dapc.co.ke?subject=Branding%20Services%20Enquiry" className="px-6 py-3 bg-black/30 border border-white/40 rounded-xl font-semibold hover:bg-black/40 transition">
            info@dapc.co.ke
          </a>
        </div>
      </div>
    </section>
  );
}