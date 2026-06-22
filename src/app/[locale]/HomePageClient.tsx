"use client";

import { Suspense, lazy } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bomb,
  CalendarCheck,
  Check,
  ChevronsUp,
  CircleDashed,
  Clock,
  Cpu,
  Crosshair,
  Flame,
  FlaskConical,
  Gamepad2,
  Gauge,
  Hammer,
  Handshake,
  Heart,
  KeyRound,
  Map as MapIcon,
  MonitorDown,
  Move,
  Package,
  RefreshCw,
  Shield,
  ShieldCheck,
  Siren,
  Sparkles,
  Store,
  Sword,
  Swords,
  Tag,
  Target,
  TriangleAlert,
  TrendingDown,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// 模块 5-8 per-card distinct lucide icons（代码侧 index 数组，en.json 不带 icon 字段，越界 fallback Handshake）
const CAMPAIGN_PHASE_ICONS = [
  Handshake,
  Siren,
  ShieldCheck,
  RefreshCw,
  TrendingDown,
  Gamepad2,
];
const HORDE_MODE_ICONS = [Shield, Swords, Trophy, Heart, FlaskConical];
const WEAPON_ICONS = [
  Zap,
  Target,
  Bomb,
  Flame,
  Sword,
  ArrowLeftRight,
  Move,
  ChevronsUp,
  CircleDashed,
  TriangleAlert,
  Hammer,
];
const PC_SPEC_ICONS = [MonitorDown, BadgeCheck, Store, Gauge];

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined;
  children: React.ReactNode;
  className?: string;
  locale: string;
}) {
  if (linkData) {
    const href = locale === "en" ? linkData.url : `/${locale}${linkData.url}`;
    return (
      <Link
        href={href}
        className={`${className || ""} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}

// Module section header with eyebrow, icon, title and intro
function ModuleHeader({
  eyebrow,
  title,
  intro,
  icon: Icon,
  linkData,
  locale,
}: {
  eyebrow?: string;
  title: string;
  intro: string;
  icon: React.ComponentType<{ className?: string }>;
  linkData?: { url: string; title: string } | null;
  locale: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
          <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
          <span className="text-xs md:text-sm font-medium uppercase tracking-wider">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
        <LinkedTitle linkData={linkData} locale={locale}>
          {title}
        </LinkedTitle>
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {intro}
      </p>
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.gears-of-war-e-day.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Gears of War E-Day Wiki",
        description:
          "Complete Gears of War E-Day Wiki covering release date, beta, campaign co-op, Horde Siege PvE, Versus PvP, weapons, enemies, maps and beginner guide tips.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Gears of War E-Day - Brutal Third-Person Cover Shooter",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Gears of War E-Day Wiki",
        alternateName: "Gears of War E-Day",
        url: siteUrl,
        description:
          "Complete Gears of War E-Day Wiki resource hub for release date, beta, campaign co-op, Horde Siege, Versus, weapons, enemies and guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Gears of War E-Day Wiki - Brutal Third-Person Cover Shooter",
        },
        sameAs: [
          "https://www.gearsofwar.com/en-us/",
          "https://www.xbox.com/en-US/games/gears-of-war-eday",
          "https://store.steampowered.com/app/3010850/Gears_of_War_EDay/",
          "https://discord.com/invite/gearsofwar",
          "https://www.reddit.com/r/GearsOfWar/",
          "https://www.youtube.com/gearsofwar",
          "https://x.com/GearsofWar",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Gears of War: E-Day",
        gamePlatform: ["Xbox Series X|S", "Windows PC"],
        applicationCategory: "Game",
        genre: ["Third-Person Shooter", "Cover Shooter", "Action", "Horror"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 12,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://store.steampowered.com/app/3010850/Gears_of_War_EDay/",
        },
      },
      {
        "@type": "VideoObject",
        name: "Gears of War: E-Day | Official Announce Trailer",
        description:
          "Official Gears of War: E-Day announce trailer (in-engine) revealed at Xbox Games Showcase 2024.",
        uploadDate: "2024-06-09",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/EC20gLfUHeA",
        url: "https://www.youtube.com/watch?v=EC20gLfUHeA",
      },
    ],
  };

  const mobileBannerAd = getPreferredMobileBannerSelection();

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("beta-codes-and-open-beta-access")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <KeyRound className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/3010850/Gears_of_War_EDay/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区，桌面端放大展示（容器上限 max-w-5xl） */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="EC20gLfUHeA"
              title="Gears of War: E-Day | Official Announce Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 模块导航区（容器上限 max-w-5xl） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID（与下方 8 个模块一一对应）
              const sectionIds = [
                "release-date-and-platforms",
                "pre-order-editions-and-bonuses",
                "beta-codes-and-open-beta-access",
                "beginner-guide",
                "campaign-story-and-timeline",
                "horde-siege-and-versus-guide",
                "weapons-and-combat-mechanics",
                "pc-requirements-and-performance",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Release Date and Platforms (card-list) */}
      <section
        id="release-date-and-platforms"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.gearsOfDayReleasePlatforms.eyebrow}
            title={t.modules.gearsOfDayReleasePlatforms.title}
            intro={t.modules.gearsOfDayReleasePlatforms.intro}
            icon={CalendarCheck}
            linkData={moduleLinkMap["gearsOfDayReleasePlatforms"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.gearsOfDayReleasePlatforms.items.map(
              (item: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-[hsl(var(--nav-theme-light))]">
                    {item.value}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Pre Order Editions and Bonuses (comparison-table) */}
      <section
        id="pre-order-editions-and-bonuses"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.gearsOfDayPreOrderEditions.eyebrow}
            title={t.modules.gearsOfDayPreOrderEditions.title}
            intro={t.modules.gearsOfDayPreOrderEditions.intro}
            icon={Package}
            linkData={moduleLinkMap["gearsOfDayPreOrderEditions"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.gearsOfDayPreOrderEditions.editions.map(
              (ed: any, index: number) => (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[`gearsOfDayPreOrderEditions::editions::${index}`]
                        }
                        locale={locale}
                      >
                        {ed.name}
                      </LinkedTitle>
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      {ed.format}
                    </span>
                  </div>
                  <div className="space-y-1.5 mb-4 text-sm">
                    <p className="flex items-start gap-2">
                      <Tag className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">{ed.price}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="text-muted-foreground">{ed.access}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <CalendarCheck className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                      <span className="text-muted-foreground">{ed.earlyAccess}</span>
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Included
                    </p>
                    <ul className="space-y-1">
                      {ed.included.map((inc: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Pre-order Bonuses
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ed.bonuses.map((b: string, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                        >
                          <Sparkles className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-auto pt-3 border-t border-border text-sm text-muted-foreground">
                    {ed.bestFor}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Module 3: Beta Codes and Open Beta Access (step-by-step) */}
      <section
        id="beta-codes-and-open-beta-access"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.gearsOfDayOpenBetaAccess.eyebrow}
            title={t.modules.gearsOfDayOpenBetaAccess.title}
            intro={t.modules.gearsOfDayOpenBetaAccess.intro}
            icon={KeyRound}
            linkData={moduleLinkMap["gearsOfDayOpenBetaAccess"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.gearsOfDayOpenBetaAccess.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base md:text-lg font-bold">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[`gearsOfDayOpenBetaAccess::steps::${index}`]
                          }
                          locale={locale}
                        >
                          {step.title}
                        </LinkedTitle>
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {step.accessType}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-1.5">
                      {step.description}
                    </p>
                    <p className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--nav-theme-light))]">
                      <Clock className="w-3.5 h-3.5" />
                      {step.date}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 4: Beginner Guide (step-by-step) */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.gearsOfDayBeginnerGuide.eyebrow}
            title={t.modules.gearsOfDayBeginnerGuide.title}
            intro={t.modules.gearsOfDayBeginnerGuide.intro}
            icon={BookOpen}
            linkData={moduleLinkMap["gearsOfDayBeginnerGuide"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4 mb-8 md:mb-10">
            {t.modules.gearsOfDayBeginnerGuide.steps.map(
              (step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[`gearsOfDayBeginnerGuide::steps::${index}`]
                        }
                        locale={locale}
                      >
                        {step.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
          {/* Quick Tips */}
          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-base md:text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.gearsOfDayBeginnerGuide.quickTips.map(
                (tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm">{tip}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 5: Campaign Story and Timeline (story-timeline) */}
      <section
        id="campaign-story-and-timeline"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.gearsOfDayCampaignTimeline.eyebrow}
            title={t.modules.gearsOfDayCampaignTimeline.title}
            intro={t.modules.gearsOfDayCampaignTimeline.intro}
            icon={MapIcon}
            linkData={moduleLinkMap["gearsOfDayCampaignTimeline"]}
            locale={locale}
          />
          <div className="scroll-reveal relative pl-6 md:pl-8 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6 md:space-y-8">
            {t.modules.gearsOfDayCampaignTimeline.phases.map(
              (phase: any, index: number) => {
                const PhaseIcon = CAMPAIGN_PHASE_ICONS[index] || Handshake;
                return (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.6rem] md:-left-[2.1rem] w-4 h-4 md:w-5 md:h-5 rounded-full bg-[hsl(var(--nav-theme))] border-2 md:border-4 border-background" />
                  <div className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <PhaseIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] uppercase tracking-wider">
                        {phase.phase}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        {phase.timeframe}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[`gearsOfDayCampaignTimeline::phases::${index}`]
                        }
                        locale={locale}
                      >
                        {phase.title}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {phase.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {phase.characters.map((c: string, ci: number) => (
                        <span
                          key={ci}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border"
                        >
                          <Users className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          {c}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-[hsl(var(--nav-theme-light))]">
                      {phase.role}
                    </p>
                  </div>
                </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 6: Horde Siege and Versus Guide (mode-cards) */}
      <section
        id="horde-siege-and-versus-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.gearsOfDayHordeAndVersus.eyebrow}
            title={t.modules.gearsOfDayHordeAndVersus.title}
            intro={t.modules.gearsOfDayHordeAndVersus.intro}
            icon={Swords}
            linkData={moduleLinkMap["gearsOfDayHordeAndVersus"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.gearsOfDayHordeAndVersus.modes.map(
              (mode: any, index: number) => {
                const ModeIcon = HORDE_MODE_ICONS[index] || Shield;
                return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <ModeIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                        <LinkedTitle
                          linkData={
                            moduleLinkMap[`gearsOfDayHordeAndVersus::modes::${index}`]
                          }
                          locale={locale}
                        >
                          {mode.mode}
                        </LinkedTitle>
                      </h3>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] whitespace-nowrap">
                      {mode.type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 mb-3 text-sm">
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {mode.players} &middot; {mode.squad}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-muted-foreground">{mode.maps}</span>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {mode.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {mode.objectives.map((obj: string, oi: number) => (
                      <li key={oi} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                  {mode.rewards && mode.rewards.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Rewards
                      </p>
                      <ul className="space-y-1">
                        {mode.rewards.map((r: string, ri: number) => (
                          <li key={ri} className="flex items-start gap-2 text-sm">
                            <Sparkles className="w-4 h-4 mt-0.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {mode.classes.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-2">
                      {mode.classes.map((cls: string, ci: number) => (
                        <span
                          key={ci}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs"
                        >
                          <Swords className="w-3 h-3 text-[hsl(var(--nav-theme-light))]" />
                          {cls}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 7: Weapons and Combat Mechanics (weapon-grid) */}
      <section
        id="weapons-and-combat-mechanics"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.gearsOfDayWeaponsCombat.eyebrow}
            title={t.modules.gearsOfDayWeaponsCombat.title}
            intro={t.modules.gearsOfDayWeaponsCombat.intro}
            icon={Crosshair}
            linkData={moduleLinkMap["gearsOfDayWeaponsCombat"]}
            locale={locale}
          />
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.gearsOfDayWeaponsCombat.items.map(
              (item: any, index: number) => {
                const WeaponIcon = WEAPON_ICONS[index] || Crosshair;
                return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      <WeaponIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-1">
                    <LinkedTitle
                      linkData={
                        moduleLinkMap[`gearsOfDayWeaponsCombat::items::${index}`]
                      }
                      locale={locale}
                    >
                      {item.name}
                    </LinkedTitle>
                  </h3>
                  <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-2">
                    {item.role}
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.description}
                  </p>
                  <p className="mt-auto pt-3 border-t border-border text-xs md:text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Best use: </span>
                    {item.bestUse}
                  </p>
                </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Module 8: PC Requirements and Performance (spec-table) */}
      <section
        id="pc-requirements-and-performance"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.gearsOfDayPCRequirements.eyebrow}
            title={t.modules.gearsOfDayPCRequirements.title}
            intro={t.modules.gearsOfDayPCRequirements.intro}
            icon={Cpu}
            linkData={moduleLinkMap["gearsOfDayPCRequirements"]}
            locale={locale}
          />
          <div className="scroll-reveal space-y-6">
            {t.modules.gearsOfDayPCRequirements.sections.map(
              (section: any, si: number) => {
                const SpecIcon = PC_SPEC_ICONS[si] || Cpu;
                return (
                <div
                  key={si}
                  className="bg-white/5 border border-border rounded-xl overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-5 md:px-6 py-3 md:py-4 border-b border-border bg-[hsl(var(--nav-theme)/0.05)]">
                    <SpecIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold text-base md:text-lg">
                      <LinkedTitle
                        linkData={
                          moduleLinkMap[`gearsOfDayPCRequirements::sections::${si}`]
                        }
                        locale={locale}
                      >
                        {section.title}
                      </LinkedTitle>
                    </h3>
                  </div>
                  <div className="divide-y divide-border">
                    {section.rows.map((row: any, ri: number) => (
                      <div
                        key={ri}
                        className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 px-5 md:px-6 py-3"
                      >
                        <dt className="text-sm font-medium text-muted-foreground">
                          {row.label}
                        </dt>
                        <dd className="md:col-span-2 text-sm">{row.value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/gearsofwar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/GearsofWar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/GearsOfWar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/3010850/Gears_of_War_EDay/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
