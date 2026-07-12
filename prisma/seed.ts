import { PrismaClient, MediaType } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";
import { PLACE_OPTIONS } from "../src/lib/constants";

const prisma = new PrismaClient();

// Deterministic pseudo-random generator so re-running the seed produces the
// same dataset (handy for demos and for writing tests against fixed data).
function makeRng(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}
const rng = makeRng(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
const pickSome = <T,>(arr: T[], min: number, max: number) => {
  const count = min + Math.floor(rng() * (max - min + 1));
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
};

const PLACES = PLACE_OPTIONS;

const SOURCES: {
  name: string;
  mediaType: MediaType;
  country: string;
  language: string;
  url: string;
}[] = [
  { name: "Metro Daily Times", mediaType: "NEWSPAPER", country: "United States", language: "en", url: "https://metrodailytimes.example.com" },
  { name: "Continental Herald", mediaType: "NEWSPAPER", country: "United Kingdom", language: "en", url: "https://continentalherald.example.com" },
  { name: "Der Tagesbote", mediaType: "NEWSPAPER", country: "Germany", language: "de", url: "https://dertagesbote.example.com" },
  { name: "Le Journal Central", mediaType: "NEWSPAPER", country: "France", language: "fr", url: "https://lejournalcentral.example.com" },
  { name: "El Diario Nacional", mediaType: "NEWSPAPER", country: "Spain", language: "es", url: "https://eldiarionacional.example.com" },
  { name: "Gazzetta del Sud", mediaType: "NEWSPAPER", country: "Italy", language: "it", url: "https://gazzettadelsud.example.com" },
  { name: "Folha Continental", mediaType: "NEWSPAPER", country: "Brazil", language: "pt", url: "https://folhacontinental.example.com" },
  { name: "The Weekly Compass", mediaType: "MAGAZINE", country: "United States", language: "en", url: "https://weeklycompass.example.com" },
  { name: "Horizon Magazine", mediaType: "MAGAZINE", country: "United Kingdom", language: "en", url: "https://horizonmagazine.example.com" },
  { name: "Der Spiegel Blick", mediaType: "MAGAZINE", country: "Germany", language: "de", url: "https://spiegelblick.example.com" },
  { name: "L'Observateur", mediaType: "MAGAZINE", country: "France", language: "fr", url: "https://lobservateur.example.com" },
  { name: "Skyline Broadcasting", mediaType: "TV", country: "United States", language: "en", url: "https://skylinebroadcasting.example.com" },
  { name: "Albion TV News", mediaType: "TV", country: "United Kingdom", language: "en", url: "https://albiontv.example.com" },
  { name: "NHK Sunrise", mediaType: "TV", country: "Japan", language: "ja", url: "https://nhksunrise.example.com" },
  { name: "Seoul Broadcast Network", mediaType: "TV", country: "South Korea", language: "ko", url: "https://seoulbroadcast.example.com" },
  { name: "Rede Continental TV", mediaType: "TV", country: "Brazil", language: "pt", url: "https://redecontinental.example.com" },
  { name: "Capital Radio One", mediaType: "RADIO", country: "United States", language: "en", url: "https://capitalradioone.example.com" },
  { name: "Radio Meridian", mediaType: "RADIO", country: "Canada", language: "en", url: "https://radiomeridian.example.com" },
  { name: "Radio Andalus", mediaType: "RADIO", country: "Spain", language: "es", url: "https://radioandalus.example.com" },
  { name: "Voice of Lagos", mediaType: "RADIO", country: "Nigeria", language: "en", url: "https://voiceoflagos.example.com" },
  { name: "TechPulse Online", mediaType: "ONLINE_NEWS", country: "United States", language: "en", url: "https://techpulse.example.com" },
  { name: "Global Wire Network", mediaType: "ONLINE_NEWS", country: "United Kingdom", language: "en", url: "https://globalwire.example.com" },
  { name: "Nihon Digital Times", mediaType: "ONLINE_NEWS", country: "Japan", language: "ja", url: "https://nihondigital.example.com" },
  { name: "Dubai Business Wire", mediaType: "ONLINE_NEWS", country: "United Arab Emirates", language: "ar", url: "https://dubaibusinesswire.example.com" },
  { name: "Mumbai Bulletin", mediaType: "ONLINE_NEWS", country: "India", language: "hi", url: "https://mumbaibulletin.example.com" },
  { name: "Sydney Wire", mediaType: "ONLINE_NEWS", country: "Australia", language: "en", url: "https://sydneywire.example.com" },
  { name: "Ciudad Digital MX", mediaType: "ONLINE_NEWS", country: "Mexico", language: "es", url: "https://ciudaddigitalmx.example.com" },
  { name: "The Analyst's Notebook", mediaType: "BLOG", country: "United States", language: "en", url: "https://analystsnotebook.example.com" },
  { name: "Policy Corner Blog", mediaType: "BLOG", country: "United Kingdom", language: "en", url: "https://policycorner.example.com" },
  { name: "PulseGrid Social", mediaType: "SOCIAL_MEDIA", country: "United States", language: "en", url: "https://pulsegrid.example.com" },
  { name: "StreamTalk Network", mediaType: "SOCIAL_MEDIA", country: "India", language: "hi", url: "https://streamtalk.example.com" },
];

type Topic = {
  keywords: string[];
  titles: (place: string) => string;
  summary: (place: string) => string;
  content: (place: string) => string;
};

const TOPICS: Topic[] = [
  {
    keywords: ["artificial intelligence", "AI regulation", "machine learning"],
    titles: (p) => `Lawmakers in ${p} debate new artificial intelligence oversight rules`,
    summary: (p) => `Policymakers in ${p} are weighing a fresh set of rules aimed at machine learning systems used in hiring and lending.`,
    content: (p) => `A draft bill circulating among regulators in ${p} would require companies deploying artificial intelligence in high-risk sectors to publish audit results. Supporters say the measure closes gaps left by voluntary guidelines, while industry groups warn it could slow innovation. Public comment closes next month.`,
  },
  {
    keywords: ["renewable energy", "solar power", "wind farm"],
    titles: (p) => `${p} announces record investment in renewable energy capacity`,
    summary: (p) => `A new funding package will expand solar and wind farm capacity across ${p} over the next five years.`,
    content: (p) => `Officials in ${p} unveiled a multi-year renewable energy plan combining solar power installations with offshore wind farm projects. The plan is expected to create thousands of construction jobs and reduce reliance on imported fuel, though grid operators caution that transmission upgrades will be needed to keep pace.`,
  },
  {
    keywords: ["central bank", "interest rates", "inflation"],
    titles: (p) => `Central bank in ${p} holds interest rates steady amid inflation concerns`,
    summary: (p) => `Policymakers opted to pause rate changes as inflation data from ${p} came in mixed this quarter.`,
    content: (p) => `The central bank governing monetary policy in ${p} kept its benchmark interest rate unchanged, citing uneven progress on inflation. Analysts had expected a small cut, but committee members flagged persistent price pressure in housing and services as reasons for caution.`,
  },
  {
    keywords: ["general election", "voter turnout", "coalition government"],
    titles: (p) => `Election results in ${p} point to a fragile coalition government`,
    summary: (p) => `Early results suggest no single party won a majority, setting up weeks of coalition talks in ${p}.`,
    content: (p) => `Voter turnout in ${p} exceeded expectations, but the fragmented results mean party leaders now face a delicate negotiation to form a coalition government. Analysts say the outcome could delay planned budget reforms.`,
  },
  {
    keywords: ["public health", "vaccination campaign", "disease outbreak"],
    titles: (p) => `Health officials in ${p} launch vaccination campaign after disease outbreak`,
    summary: (p) => `A localized outbreak prompted health authorities in ${p} to accelerate a public vaccination drive.`,
    content: (p) => `Public health officials in ${p} confirmed a cluster of cases and moved quickly to expand vaccination sites in affected districts. Clinics report high demand, and the health ministry says supply is sufficient for the current phase of the campaign.`,
  },
  {
    keywords: ["cybersecurity", "data breach", "ransomware"],
    titles: (p) => `Major data breach disrupts services for companies in ${p}`,
    summary: (p) => `A ransomware attack tied to a broader cybersecurity incident has knocked out systems for several firms in ${p}.`,
    content: (p) => `Security researchers say the ransomware group responsible for the incident in ${p} exploited an unpatched vulnerability in widely used remote-access software. Several companies have taken systems offline while forensic teams investigate the scope of the data breach.`,
  },
  {
    keywords: ["supply chain", "shipping delays", "semiconductor shortage"],
    titles: (p) => `Manufacturers in ${p} warn of supply chain disruption into next quarter`,
    summary: (p) => `Shipping delays and a lingering semiconductor shortage continue to squeeze factories in ${p}.`,
    content: (p) => `Industry groups in ${p} say shipping delays at major ports, combined with an ongoing semiconductor shortage, are pushing back delivery timelines for electronics and automotive parts. Some manufacturers are shifting to regional suppliers to reduce exposure.`,
  },
  {
    keywords: ["football world cup", "sports sponsorship", "stadium construction"],
    titles: (p) => `${p} accelerates stadium construction ahead of football world cup bid`,
    summary: (p) => `Organizers in ${p} say new sports sponsorship deals will help fund stadium upgrades.`,
    content: (p) => `As part of its bid to host future football world cup matches, ${p} has fast-tracked stadium construction and signed several sports sponsorship agreements with regional brands. Local officials hope the investment will boost tourism.`,
  },
  {
    keywords: ["startup funding", "venture capital", "tech unicorn"],
    titles: (p) => `Venture capital pours into ${p} as new tech unicorn emerges`,
    summary: (p) => `A fintech startup based in ${p} reached unicorn status after its latest funding round.`,
    content: (p) => `Startup funding in ${p} hit a multi-year high this quarter, led by a fintech company that crossed a billion-dollar valuation. Venture capital firms say they are increasingly looking beyond traditional tech hubs for early-stage deals.`,
  },
  {
    keywords: ["climate policy", "carbon emissions", "climate summit"],
    titles: (p) => `${p} unveils new climate policy ahead of international summit`,
    summary: (p) => `The plan sets binding targets for cutting carbon emissions over the next decade in ${p}.`,
    content: (p) => `Ahead of the upcoming climate summit, ${p} released a climate policy framework that sets binding carbon emissions targets for heavy industry. Environmental groups welcomed the move but said enforcement mechanisms remain unclear.`,
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.emailLog.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.savedSearch.deleteMany();
  await prisma.article.deleteMany();
  await prisma.source.deleteMany();
  await prisma.user.deleteMany();

  const sources = [];
  for (const s of SOURCES) {
    sources.push(await prisma.source.create({ data: s }));
  }
  console.log(`Created ${sources.length} sources.`);

  const now = Date.now();
  const articles: {
    title: string;
    summary: string;
    content: string;
    url: string;
    language: string;
    places: string[];
    keywords: string[];
    publishedAt: Date;
    sourceId: string;
  }[] = [];

  const ARTICLE_COUNT = 220;
  for (let i = 0; i < ARTICLE_COUNT; i++) {
    const topic = pick(TOPICS);
    const source = pick(sources);
    const primaryPlace = pick(PLACES);
    const extraPlaces = pickSome(
      PLACES.filter((p) => p !== primaryPlace),
      0,
      2
    );
    const places = [primaryPlace, ...extraPlaces];
    const keywords = pickSome(topic.keywords, 1, topic.keywords.length);

    // Skew publish dates toward the recent past, spread across ~60 days.
    const daysAgo = Math.floor(rng() * rng() * 60);
    const publishedAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - Math.floor(rng() * 24 * 60 * 60 * 1000));

    articles.push({
      title: topic.titles(primaryPlace),
      summary: topic.summary(primaryPlace),
      content: topic.content(primaryPlace),
      url: `${source.url}/articles/${i + 1}`,
      language: source.language,
      places,
      keywords,
      publishedAt,
      sourceId: source.id,
    });
  }

  await prisma.article.createMany({ data: articles });
  console.log(`Created ${articles.length} articles.`);

  const demoPasswordHash = await bcrypt.hash("password123", 10);
  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash: demoPasswordHash,
    },
  });

  await prisma.savedSearch.createMany({
    data: [
      {
        userId: demoUser.id,
        name: "AI Regulation Watch",
        keywords: ["artificial intelligence", "AI regulation"],
        matchType: "ANY",
        places: [],
        languages: [],
        mediaTypes: [],
        frequency: "DAILY",
      },
      {
        userId: demoUser.id,
        name: "Climate + Energy Bundle (US & UK, English)",
        keywords: ["climate policy", "renewable energy", "carbon emissions"],
        matchType: "ANY",
        places: ["United States", "United Kingdom"],
        languages: ["en"],
        mediaTypes: ["NEWSPAPER", "ONLINE_NEWS", "TV"],
        frequency: "INSTANT",
      },
    ],
  });

  console.log(`Created demo user (demo@example.com / password123) with 2 saved searches.`);
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
