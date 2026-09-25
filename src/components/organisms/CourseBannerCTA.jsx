import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const FEATURES = [
  {
    index: '01',
    titleKey: 'course.banner.card1.title',
    descKey:  'course.banner.card1.desc',
    titleFallback: 'XP Reward System',
    descFallback:  'Accumulate experience points for every concept mastered, module shipped, and challenge conquered.',
  },
  {
    index: '02',
    titleKey: 'course.banner.card2.title',
    descKey:  'course.banner.card2.desc',
    titleFallback: 'Daily Streak Engine',
    descFallback:  'Build consistent engineering habits through a structured streak and accountability framework.',
  },
  {
    index: '03',
    titleKey: 'course.banner.card3.title',
    descKey:  'course.banner.card3.desc',
    titleFallback: 'Live Code Evaluator',
    descFallback:  'Your code runs in real-time. Instant feedback, automated assertions, zero context-switching.',
  },
  {
    index: '04',
    titleKey: 'course.banner.card4.title',
    descKey:  'course.banner.card4.desc',
    titleFallback: 'League Leaderboard',
    descFallback:  'Compete in weekly coding leagues. Earn your rank. Make progress measurable and public.',
  },
];

export function CourseBannerCTA() {
  const { t } = useTranslation();
  const { ref, isInView } = useScrollAnimation({ margin: '-50px' });

  return (
    <section className="w-full px-6 md:px-12 mb-24 md:mb-40 overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-screen-2xl mx-auto flex flex-col gap-12 md:gap-20"
      >
        {/* Header / Meta */}
        <div className="flex justify-between items-start border-t-2 border-[#111111] pt-6 md:pt-8">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-[#111111]">
              {t('course.banner.subtitle', '[ Coding Course ]')}
            </span>
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-[#666666]">
              {t('course.banner.tag', 'New Platform')}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#111111] animate-pulse" />
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-[#111111] whitespace-nowrap">
              {t('course.banner.status', 'Coming Soon')}
            </span>
          </div>
        </div>

        {/* Massive Headline */}
        <div className="flex flex-col w-full">
          <h2 className="text-[14vw] sm:text-[13vw] lg:text-[12vw] leading-[0.8] font-black tracking-tighter uppercase text-[#111111] -ml-[1vw]">
            SKILLSTREAK
          </h2>
          <h2 className="text-[14vw] sm:text-[13vw] lg:text-[12vw] leading-[0.8] font-black tracking-tighter uppercase text-[#E5E5E5] -ml-[1vw]">
            WEB.ID
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 lg:gap-24 pt-12 md:pt-16 border-t border-[#E5E5E5]">
          
          {/* Left: Copy & CTA */}
          <div className="xl:col-span-5 flex flex-col justify-between">
            <div>
              <p className="font-serif-editorial text-2xl md:text-4xl italic text-[#111111] leading-[1.1] mb-8 md:mb-12 pr-4">
                &ldquo;{t('course.banner.headline', 'The fastest path from zero to deployable engineer, built like a game, engineered for the real world.')}&rdquo;
              </p>
              <p className="text-sm md:text-base text-[#666666] leading-relaxed max-w-md text-justify md:text-left">
                {t('course.banner.description', 'Most developers quit because learning feels like a grind with no visible progress. skillstreak.web.id changes the feedback loop. You earn XP, unlock levels, maintain streaks, and ship real projects while the system adapts to your pace. Built with the engagement mechanics of Duolingo, applied to serious software engineering.')}
              </p>
            </div>
            
            <div className="mt-12 md:mt-16 flex flex-col gap-6">
              <div className="inline-flex items-center gap-4">
                <a 
                  href="https://skillstreak.web.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 rounded-full bg-[#111111] text-white px-6 py-4 md:px-8 md:py-5 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#333333] transition-colors duration-300"
                >
                  <span>{t('course.banner.cta', 'Get Early Access')}</span>
                  <span className="transform -rotate-45">→</span>
                </a>
              </div>
              <p className="font-mono text-[9px] md:text-[10px] text-[#AAAAAA] uppercase tracking-[0.15em] leading-relaxed max-w-xs">
                {t('course.banner.footnote', '* Early members receive Founder Badge + lifetime discounted access')}
              </p>
            </div>
          </div>

          {/* Right: Features */}
          <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
            {FEATURES.map((f, i) => (
              <motion.div 
                key={f.index} 
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-end gap-3 border-b border-[#E5E5E5] pb-3 mb-2">
                  <span className="font-mono text-sm md:text-base font-bold text-[#CCCCCC] leading-none">
                    {f.index}
                  </span>
                  <h4 className="font-bold text-sm md:text-base uppercase tracking-tight text-[#111111] leading-none">
                    {t(f.titleKey, f.titleFallback)}
                  </h4>
                </div>
                <p className="text-xs md:text-sm text-[#666666] leading-relaxed text-justify md:text-left">
                  {t(f.descKey, f.descFallback)}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>
    </section>
  );
}
