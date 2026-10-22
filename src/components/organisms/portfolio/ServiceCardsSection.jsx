import React from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';

export function ServiceCardsSection() {
  return (
    <section id="services" className="relative w-full min-h-screen bg-white flex flex-col justify-center items-center py-12 lg:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">
          {/* Service Card 1 - Mobile UI/UX Design Mockup (Cropped to match height) */}
          <ScrollReveal delay={0.1} y={40} className="flex flex-col h-full">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 pb-0 sm:pb-0 lg:pb-0 text-white min-h-[480px] sm:min-h-[540px] lg:min-h-[560px] xl:min-h-[590px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-3 sm:mb-5">
                  Experience &amp;<br />interface design
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  Users are at the center of our experience creation process. We design pixel-by-pixel relevant digital products that people love to use.
                </p>
              </div>

              {/* Phone Mockup Showcase - Cropped matching height */}
              <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-4 flex items-start justify-center overflow-hidden">
                <div className="relative w-[200px] sm:w-[220px] lg:w-[235px] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]">
                  <img
                    src="/mobile.svg"
                    alt="Mobile Experience Interface Design"
                    className="w-full h-auto drop-shadow-2xl select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              Our design thinking process helps empower your project from day zero.
            </p>
          </ScrollReveal>

          {/* Service Card 2 - Desktop / Laptop Web Development Mockup (Elevated) */}
          <ScrollReveal delay={0.25} y={40} className="flex flex-col h-full">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 pb-0 sm:pb-0 lg:pb-0 text-white min-h-[480px] sm:min-h-[540px] lg:min-h-[560px] xl:min-h-[590px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-3 sm:mb-5">
                  Custom website<br />development
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  Our team specializes in developing fully self-manageable websites built on the latest technologies to achieve top performance, quality, and security.
                </p>
              </div>

              {/* Desktop Mockup Showcase - Raised slightly higher */}
              <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-4 flex items-center justify-center overflow-hidden">
                <div className="relative w-[114%] -mx-[7%] -translate-y-3 sm:-translate-y-5 transition-transform duration-500 ease-out group-hover:-translate-y-6 sm:group-hover:-translate-y-8 group-hover:scale-[1.02]">
                  <img
                    src="/dekstop.svg"
                    alt="Custom Website Development Desktop Mockup"
                    className="w-full h-auto drop-shadow-2xl select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              Every development is tailored to each client following international standards.
            </p>
          </ScrollReveal>

          {/* Service Card 3 - Raspberry Pi IoT Hardware PNG */}
          <ScrollReveal delay={0.4} y={40} className="flex flex-col h-full">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 pb-0 sm:pb-0 lg:pb-0 text-white min-h-[480px] sm:min-h-[540px] lg:min-h-[560px] xl:min-h-[590px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-3 sm:mb-5">
                  Tailored digital &amp;<br />IoT services
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  We take care of all the technical aspects every project requires: embedded hardware, IoT sensor telemetry, infrastructure, and continuous support.
                </p>
              </div>

              {/* Raspberry Pi Hardware PNG Showcase */}
              <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-4 flex items-center justify-center overflow-hidden">
                <div className="relative w-full max-w-[280px] sm:max-w-[310px] flex items-center justify-center -translate-y-2 sm:-translate-y-3 transition-transform duration-500 ease-out group-hover:-translate-y-5 group-hover:scale-[1.04]">
                  <img
                    src="/raspberry-pi.png"
                    alt="Raspberry Pi IoT Hardware Engineering"
                    className="w-full max-h-[195px] sm:max-h-[225px] object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.45)] select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              Your website, our responsibility. Long-term partnerships tailored to each client.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}


