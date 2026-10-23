import React from 'react';
import { ScrollReveal } from '../../atoms/ScrollReveal';
import { PcbViewer3D } from './PcbViewer3D';

export function ServiceCardsSection() {
  return (
    <section id="services" className="relative w-full min-h-screen bg-white flex flex-col justify-center items-center py-12 lg:py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">
          {/* Service Card 1 - Mobile Services */}
          <ScrollReveal delay={0.1} y={40} className="flex flex-col h-full">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 pb-0 sm:pb-0 lg:pb-0 text-white min-h-[480px] sm:min-h-[540px] lg:min-h-[560px] xl:min-h-[590px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-3 sm:mb-5">
                  Mobile app<br />services
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  Crafting intuitive, responsive, and high-performance mobile applications across iOS &amp; Android tailored to elevate your user experience.
                </p>
              </div>

              {/* Phone Mockup Showcase - Cropped matching height */}
              <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-4 flex items-start justify-center overflow-hidden">
                <div className="relative w-[200px] sm:w-[220px] lg:w-[235px] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]">
                  <img
                    src="/mobile.svg"
                    alt="Mobile App Services Mockup"
                    className="w-full h-auto drop-shadow-2xl select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              From mobile UI design to scalable cross-platform application deployment.
            </p>
          </ScrollReveal>

          {/* Service Card 2 - Web Development Services */}
          <ScrollReveal delay={0.25} y={40} className="flex flex-col h-full">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 pb-0 sm:pb-0 lg:pb-0 text-white min-h-[480px] sm:min-h-[540px] lg:min-h-[560px] xl:min-h-[590px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-3 sm:mb-5">
                  Web development<br />services
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  Specializing in modern, fully self-manageable websites and web applications built on cutting-edge stacks for top performance, speed, and security.
                </p>
              </div>

              {/* Desktop Mockup Showcase - Raised slightly higher */}
              <div className="relative w-full h-[220px] sm:h-[250px] xl:h-[270px] mt-4 flex items-center justify-center overflow-hidden">
                <div className="relative w-[114%] -mx-[7%] -translate-y-3 sm:-translate-y-5 transition-transform duration-500 ease-out group-hover:-translate-y-6 sm:group-hover:-translate-y-8 group-hover:scale-[1.02]">
                  <img
                    src="/dekstop.svg"
                    alt="Web Development Services Desktop Mockup"
                    className="w-full h-auto drop-shadow-2xl select-none pointer-events-none"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              Fullstack web architecture tailored to each client following international standards.
            </p>
          </ScrollReveal>

          {/* Service Card 3 - IoT & Hardware Services */}
          <ScrollReveal delay={0.4} y={40} className="flex flex-col h-full">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 pb-0 sm:pb-0 lg:pb-0 text-white min-h-[480px] sm:min-h-[540px] lg:min-h-[560px] xl:min-h-[590px] flex flex-col justify-between relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-3 sm:mb-5">
                  IoT &amp; hardware<br />services
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  We take care of all technical aspects: custom PCB schematic &amp; layout design, embedded IoT firmware, sensor telemetry, and continuous support.
                </p>
              </div>

              {/* Interactive 3D Custom PCB Showcase */}
              <PcbViewer3D />
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              Bridging hardware and software from prototype to reliable physical production.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}


