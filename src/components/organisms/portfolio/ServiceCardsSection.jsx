import React from 'react';

export function ServiceCardsSection() {
  return (
    <section id="services" className="relative w-full min-h-screen bg-white flex flex-col justify-center items-center py-12 lg:py-16 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">
          {/* Service Card 1 */}
          <div className="flex flex-col">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 text-white min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] xl:min-h-[580px] flex flex-col justify-start relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-4 sm:mb-6">
                  Experience &amp;<br />interface design
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  Users are at the center of our experience creation process. We design pixel-by-pixel relevant digital products that people love to use.
                </p>
              </div>
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              Our design thinking process helps empower your project from day zero.
            </p>
          </div>

          {/* Service Card 2 */}
          <div className="flex flex-col">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 text-white min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] xl:min-h-[580px] flex flex-col justify-start relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-4 sm:mb-6">
                  Custom website<br />development
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  Our team specializes in developing fully self-manageable websites built on the latest technologies to achieve top performance, quality, and security.
                </p>
              </div>
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              Every development is tailored to each client following international standards.
            </p>
          </div>

          {/* Service Card 3 */}
          <div className="flex flex-col">
            <div className="bg-skillstreak-orange-grid rounded-3xl p-6 sm:p-10 lg:p-12 text-white min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] xl:min-h-[580px] flex flex-col justify-start relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-[28px] lg:text-[32px] xl:text-[36px] font-semibold leading-[1.12] tracking-tight mb-4 sm:mb-6">
                  Tailored digital<br />services
                </h3>
                <p className="text-white/85 text-[14px] sm:text-[15px] xl:text-[15.5px] leading-relaxed max-w-[340px]">
                  We take care of all the technical aspects every project requires: infrastructure, security, continuous support, and supervision over every detail.
                </p>
              </div>
            </div>
            <p className="text-[12.5px] sm:text-[13px] text-gray-500 mt-3 sm:mt-4 leading-relaxed pr-2">
              Your website, our responsibility. Long-term partnerships tailored to each client.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
