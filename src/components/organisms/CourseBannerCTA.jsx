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
  const { ref, isInView } = useScrollAnimation({ margin: '0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full px-6 md:px-12 mb-16 md:mb-20"
    >
      <div className="w-full border border-[#111111] bg-white overflow-hidden">

        {/* Top strip */}
        <div className="flex items-center justify-between px-6 md:px-10 py-3 bg-[#111111] gap-4">
          <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-[0.22em] font-bold text-[#FAFAFA] leading-tight">
            {t('course.banner.tag', 'NEW PLATFORM // COMING SOON')}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-[0.22em] font-bold text-[#FAFAFA] whitespace-nowrap">
              {t('course.banner.status', 'COMING SOON')}
            </span>
          </div>
        </div>

        {/* Main body: stacks on mobile, side-by-side on lg */}
        <div className="flex flex-col lg:grid lg:grid-cols-12">

          {/* LEFT: editorial copy */}
          <div className="lg:col-span-7 px-6 md:px-10 py-8 md:py-12 flex flex-col justify-between border-b border-[#E5E5E5] lg:border-b-0 lg:border-r lg:border-[#E5E5E5]">

            <div>
              {/* Category label */}
              <span className="inline-block font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-[#666666] border border-[#E5E5E5] px-3 py-1 mb-5">
                {t('course.banner.subtitle', '[ Coding Course ]')}
              </span>

              {/* Domain headline */}
              <h3 className="text-[1.4rem] sm:text-5xl md:text-6xl font-black tracking-tighter text-[#111111] uppercase leading-none mb-5 whitespace-nowrap">
                {t('course.banner.title', 'course.ghiffa.dev')}
              </h3>

              {/* Serif sub-headline */}
              <p className="font-serif-editorial text-base md:text-xl italic text-[#333333] leading-snug mb-5 max-w-lg text-justify md:text-left">
                &ldquo;{t('course.banner.headline', 'The fastest path from zero to deployable engineer, built like a game, engineered for the real world.')}&rdquo;
              </p>

              {/* Body copy */}
              <p className="text-sm text-[#666666] leading-relaxed max-w-xl text-justify md:text-left">
                {t('course.banner.description', 'Most developers quit because learning feels like a grind with no visible progress. course.ghiffa.dev changes the feedback loop. You earn XP, unlock levels, maintain streaks, and ship real projects while the system adapts to your pace. Built with the engagement mechanics of Duolingo, applied to serious software engineering.')}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#111111]">
                  {t('course.banner.progress.label', 'Build Progress')}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-[#666666]">
                  {t('course.banner.progress.level', 'LVL 01 / LVL 99')}
                </span>
              </div>
              <div className="relative w-full h-[2px] bg-[#E5E5E5]">
                <div className="absolute left-0 top-0 h-full w-[78%] bg-[#111111]" />
              </div>
            </div>
          </div>

          {/* RIGHT: feature list + CTA */}
          <div className="lg:col-span-5 flex flex-col">

            {/* Feature rows — 2 col grid on sm, single col otherwise */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 divide-y divide-[#E5E5E5] sm:divide-y-0 lg:divide-y flex-1">
              {FEATURES.map((f, i) => (
                <div
                  key={f.index}
                  className={[
                    'flex items-start gap-4 px-6 md:px-8 py-5 hover:bg-[#FAFAFA] transition-colors duration-200',
                    /* sm: add right border to left-column items, top border to bottom row */
                    i % 2 === 0 ? 'sm:border-r sm:border-[#E5E5E5] lg:border-r-0' : '',
                    i >= 2     ? 'sm:border-t sm:border-[#E5E5E5] lg:border-t-0'  : '',
                  ].join(' ')}
                >
                  <span className="font-mono text-[10px] font-bold text-[#AAAAAA] shrink-0 pt-0.5 tracking-wider">
                    {f.index}
                  </span>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#111111] block mb-1">
                      {t(f.titleKey, f.titleFallback)}
                    </span>
                    <p className="text-[11px] text-[#666666] leading-relaxed text-justify md:text-left">
                      {t(f.descKey, f.descFallback)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-6 md:px-8 py-6 border-t border-[#E5E5E5]">
              <a
                href="https://course.ghiffa.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn w-full inline-flex items-center justify-between border border-[#111111] bg-[#111111] text-[#FAFAFA] hover:bg-transparent hover:text-[#111111] transition-all duration-300 font-mono text-[10px] font-bold uppercase tracking-[0.22em] px-6 py-4"
              >
                <span>{t('course.banner.cta', 'Get Early Access')}</span>
                <span className="text-sm transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200">
                  &#8599;
                </span>
              </a>

              <p className="font-mono text-[9px] text-[#AAAAAA] uppercase tracking-[0.18em] mt-3 leading-relaxed">
                {t('course.banner.footnote', '* Early members receive Founder Badge + lifetime discounted access')}
              </p>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
