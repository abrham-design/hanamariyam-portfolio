import { useState, useEffect, useContext, createContext, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  Menu,
  X,
  Briefcase,
  ShieldCheck,
  Gavel,
  Handshake,
  Leaf,
  GraduationCap,
  Award,
  Quote,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { FaFacebookF, FaWhatsapp, FaLinkedinIn, FaEnvelope, FaPhone } from "react-icons/fa";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import headshotImg from "./assets/headshot.jpg";
import logoImg from "./assets/logo.png";

/* ---------------------------------------------------------------
   Translations — UI chrome & section copy.
   NOTE: the Amharic strings below are a good-faith translation,
   not a certified legal translation. Have a colleague or native
   speaker read them over before this goes live.
--------------------------------------------------------------- */

const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      practice: "Practice Areas",
      insights: "Insights",
      contact: "Contact",
      consultation: "Consultation",
    },
    hero: {
      credentials: "LL.B., LL.M.",
      cta: "Request a Consultation",
      secondaryCta: "View practice areas",
      portraitCaption: "Hanamariyam Getnet Asmare — Attorney & former Judge",
    },
    homeAboutTeaser: {
      eyebrow: "About",
      text: "Hanamariyam Getnet Asmare is an accomplished legal practitioner with extensive experience across judicial adjudication, legal advisory, and academic instruction, now serving clients at 5A Law Firm LLP in Addis Ababa.",
      link: "Learn more about her background",
    },
    stats: {
      items: [
        { number: "2+", label: "Years on the Judicial Bench" },
        { number: "5", label: "Practice Areas" },
        { number: "3", label: "Degrees & Certifications" },
        { number: "2", label: "Professional Recognitions" },
      ],
    },
    process: {
      eyebrow: "How It Works",
      heading: "Your path to working together",
      steps: [
        { title: "Book a Consultation", text: "Reach out through the form, WhatsApp, or a call to share what you're facing." },
        { title: "Initial Discussion", text: "She reviews your matter and discusses the best way forward with you." },
        { title: "Engagement", text: "Once aligned, work begins on your case, contract, or legal question." },
      ],
    },
    homePracticeTeaser: {
      eyebrow: "Practice Areas",
      heading: "Counsel grounded in commercial law and judicial experience",
      link: "View all practice areas",
    },
    homeInsightsTeaser: {
      eyebrow: "Insights",
      heading: "Recent legal commentary",
      link: "View all insights",
    },
    homeCta: {
      heading: "Ready to discuss your legal matter?",
      text: "Schedule a consultation and describe what you're facing — she'll follow up within one business day.",
      cta: "Request a Consultation",
      whatsapp: "Message on WhatsApp",
    },
    about: {
      eyebrow: "About",
      eduHeading: "Education & Credentials",
      awardsHeading: "Recognition",
      highlightsHeading: "Case Highlights",
      testimonialsHeading: "Testimonials",
      portraitCaption: "5A Law Firm LLP — Bole Road, Addis Ababa",
    },
    practice: {
      eyebrow: "Practice Areas",
      heading: "Counsel grounded in commercial law and judicial experience",
      cta: "Discuss your matter",
    },
    insights: {
      eyebrow: "Insights",
      heading: "Legal commentary and updates",
      readMore: "Read more",
      backToInsights: "Back to Insights",
      notFoundTitle: "Post not found",
      notFoundText: "That article may have been moved or removed.",
    },
    contact: {
      eyebrow: "Contact",
      heading: "Get in touch",
      fullName: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      area: "Practice Area / Legal Issue",
      areaPlaceholder: "Select an area",
      generalInquiry: "General Inquiry",
      message: "Message",
      messagePlaceholder: "Briefly describe your legal matter",
      submit: "Submit",
      errorRequired: "Please fill in your name, email, and message.",
      thankYouHeading: "Thank you",
      thankYouText:
        "Your inquiry has been received. We aim to respond within one business day.",
      sendAnother: "Send another message",
    },
    consultation: {
      eyebrow: "Consultation",
      heading: "Book a consultation",
      intro:
        "Share a few details about your matter and a preferred time, and she'll confirm your appointment by phone or email.",
      preferredDate: "Preferred Date",
      preferredTime: "Preferred Time",
      timeOptions: ["Morning", "Afternoon", "Evening"],
      submit: "Request Appointment",
      thankYouHeading: "Request received",
      thankYouText:
        "Your consultation request has been received. You'll get a confirmation call or email shortly.",
    },
    footer: {
      disclaimer:
        "The information on this website is for general informational purposes only and does not constitute formal legal advice. Accessing this site or submitting an inquiry through the contact form does not establish an attorney-client relationship.",
      rights: "All rights reserved.",
    },
    whatsappMessage: "Hello, I would like to inquire about your legal services.",
  },

  am: {
    nav: {
      home: "ዋና ገጽ",
      about: "ስለ እኔ",
      practice: "የስራ ዘርፎች",
      insights: "ጽሁፎች",
      contact: "አግኙን",
      consultation: "ምክክር ይያዙ",
    },
    hero: {
      credentials: "LL.B., LL.M.",
      cta: "ምክክር ይያዙ",
      secondaryCta: "የስራ ዘርፎችን ይመልከቱ",
      portraitCaption: "ሀናማርየም ጌትነት አሰማረ — ጠበቃና የቀድሞ ዳኛ",
    },
    homeAboutTeaser: {
      eyebrow: "ስለ እኔ",
      text: "ሀናማርየም ጌትነት አሰማረ በዳኝነት፣ በሕግ ምክር አገልግሎትና በአካዳሚክ ትምህርት ሰፊ ልምድ ያላት ስኬታማ የሕግ ባለሙያ ስትሆን፣ በአሁኑ ወቅት በአዲስ አበባ በ5A ጠበቆች ደንበኞችን እያገለገለች ትገኛለች።",
      link: "ስለ ልምዷ የበለጠ ይወቁ",
    },
    stats: {
      items: [
        { number: "2+", label: "ዓመታት በዳኝነት ወንበር" },
        { number: "5", label: "የስራ ዘርፎች" },
        { number: "3", label: "ዲግሪዎችና ብቃቶች" },
        { number: "2", label: "ሙያዊ እውቅናዎች" },
      ],
    },
    process: {
      eyebrow: "እንዴት እንደሚሰራ",
      heading: "አብረን ለመስራት የሚያስፈልገው መንገድ",
      steps: [
        { title: "ምክክር ይያዙ", text: "በቅጹ፣ በWhatsApp ወይም በስልክ ጉዳይዎን ያጋሩ።" },
        { title: "የመጀመሪያ ውይይት", text: "ጉዳይዎን ከገመገመች በኋላ የተሻለውን መንገድ ከእርስዎ ጋር ትወያያለች።" },
        { title: "ስራ መጀመር", text: "ከተስማማን በኋላ በጉዳይዎ፣ ውልዎ ወይም የሕግ ጥያቄዎ ላይ ስራ ይጀምራል።" },
      ],
    },
    homePracticeTeaser: {
      eyebrow: "የስራ ዘርፎች",
      heading: "በንግድ ሕግና በዳኝነት ልምድ ላይ የተመሰረተ የሕግ ምክር",
      link: "ሁሉንም የስራ ዘርፎች ይመልከቱ",
    },
    homeInsightsTeaser: {
      eyebrow: "ጽሁፎች",
      heading: "የቅርብ ጊዜ የሕግ ትንታኔዎች",
      link: "ሁሉንም ጽሁፎች ይመልከቱ",
    },
    homeCta: {
      heading: "ስለ ሕግ ጉዳይዎ ለመወያየት ዝግጁ ነዎት?",
      text: "ምክክር ይያዙና እየገጠመዎት ያለውን ጉዳይ ይግለጹ — በአንድ የስራ ቀን ውስጥ ምላሽ ይሰጥዎታል።",
      cta: "ምክክር ይያዙ",
      whatsapp: "በWhatsApp ይላኩ",
    },
    about: {
      eyebrow: "ስለ እኔ",
      eduHeading: "ትምህርትና ብቃቶች",
      awardsHeading: "እውቅናዎች",
      highlightsHeading: "ጎላ ያሉ የስራ ውጤቶች",
      testimonialsHeading: "የደንበኞች አስተያየት",
      portraitCaption: "5A ጠበቆች ኃ.የተ.የግ.ማ — ቦሌ መንገድ፣ አዲስ አበባ",
    },
    practice: {
      eyebrow: "የስራ ዘርፎች",
      heading: "በንግድ ሕግና በዳኝነት ልምድ ላይ የተመሰረተ የሕግ ምክር",
      cta: "ጉዳይዎን ያወያዩ",
    },
    insights: {
      eyebrow: "ጽሁፎች",
      heading: "የሕግ ትንታኔዎችና ዝማኔዎች",
      readMore: "ተጨማሪ ያንብቡ",
      backToInsights: "ወደ ጽሁፎች ተመለስ",
      notFoundTitle: "ጽሁፉ አልተገኘም",
      notFoundText: "ይህ ጽሁፍ ተነስቶ ወይም ተቀይሮ ሊሆን ይችላል።",
    },
    contact: {
      eyebrow: "አግኙን",
      heading: "ያግኙን",
      fullName: "ሙሉ ስም",
      email: "ኢሜይል አድራሻ",
      phone: "ስልክ ቁጥር",
      area: "የስራ ዘርፍ / የሕግ ጉዳይ",
      areaPlaceholder: "ዘርፍ ይምረጡ",
      generalInquiry: "አጠቃላይ ጥያቄ",
      message: "መልእክት",
      messagePlaceholder: "የሕግ ጉዳይዎን በአጭሩ ይግለጹ",
      submit: "ላክ",
      errorRequired: "እባክዎ ስምዎን፣ ኢሜይልዎን እና መልእክትዎን ይሙሉ።",
      thankYouHeading: "እናመሰግናለን",
      thankYouText: "ጥያቄዎ ደርሶናል። በአንድ የስራ ቀን ውስጥ ምላሽ ለመስጠት እንጥራለን።",
      sendAnother: "ሌላ መልእክት ላክ",
    },
    consultation: {
      eyebrow: "ምክክር",
      heading: "ምክክር ይያዙ",
      intro: "ስለ ጉዳይዎ አጭር መረጃና ተመራጭ ሰዓት ያጋሩ፤ በስልክ ወይም በኢሜይል ቀጠሮዎን ታረጋግጣለች።",
      preferredDate: "ተመራጭ ቀን",
      preferredTime: "ተመራጭ ሰዓት",
      timeOptions: ["ጠዋት", "ከሰዓት በኋላ", "ማታ"],
      submit: "ቀጠሮ ይጠይቁ",
      thankYouHeading: "ጥያቄው ደርሷል",
      thankYouText: "የምክክር ጥያቄዎ ደርሷል። በቅርቡ የማረጋገጫ ጥሪ ወይም ኢሜይል ይደርስዎታል።",
    },
    footer: {
      disclaimer:
        "በዚህ ድረ-ገጽ ላይ ያለው መረጃ ለአጠቃላይ መረጃ ዓላማ ብቻ የቀረበ ሲሆን መደበኛ የሕግ ምክር አይሆንም። ይህን ድረ-ገጽ መጎብኘት ወይም በአግኙን ቅጽ በኩል ጥያቄ ማስገባት በጠበቃና በደንበኛ መካከል ግንኙነት አይፈጥርም።",
      rights: "ሁሉም መብቶች የተጠበቁ ናቸው።",
    },
    whatsappMessage: "ሰላም፣ ስለ ሕግ አገልግሎቶችዎ መጠየቅ እፈልጋለሁ።",
  },
};

/* ---------------------------------------------------------------
   Content data (language-paired where the content itself needs
   translating; language-independent where it shouldn't be, like
   direct quotes).
--------------------------------------------------------------- */

const ICON_MAP = { Briefcase, ShieldCheck, Gavel, Handshake, Leaf };
const ICON_KEYS = Object.keys(ICON_MAP);

const DEFAULT_PRACTICE_AREAS = [
  {
    id: "corporate-commercial",
    iconKey: "Briefcase",
    en: {
      title: "Corporate & Commercial Law",
      description:
        "Advising corporate clients on contract structuring, commercial code compliance, and financial transactions.",
    },
    am: {
      title: "የድርጅትና የንግድ ሕግ",
      description:
        "ለድርጅት ደንበኞች የውል አወቃቀር፣ የንግድ ሕግ ተገዢነት እና የፋይናንስ ግብይቶች ምክር አገልግሎት መስጠት።",
    },
  },
  {
    id: "shareholder-governance",
    iconKey: "ShieldCheck",
    en: {
      title: "Shareholder Rights & Governance",
      description:
        "Specialized legal analysis in corporate restructuring and minority shareholder protection.",
    },
    am: {
      title: "የባለአክሲዮኖች መብትና አስተዳደር",
      description: "በድርጅት ተሃድሶና በአናሳ ባለአክሲዮኖች ጥበቃ ላይ ልዩ የሕግ ትንተና።",
    },
  },
  {
    id: "litigation-disputes",
    iconKey: "Gavel",
    en: {
      title: "Litigation & Dispute Resolution",
      description:
        "Drafting court pleadings and legal defenses, drawing on direct judicial bench experience.",
    },
    am: {
      title: "ክርክርና የውዝግብ አፈታት",
      description:
        "በቀጥታ የዳኝነት ወንበር ልምድ ላይ በመመስረት የፍርድ ቤት አቤቱታዎችንና የሕግ መከላከያዎችን ማዘጋጀት።",
    },
  },
  {
    id: "labor-employment",
    iconKey: "Handshake",
    en: {
      title: "Labor & Employment Law",
      description:
        "Legal counsel on employment agreements, workplace dispute resolution, and labor rights.",
    },
    am: {
      title: "የሠራተኛና የቅጥር ሕግ",
      description: "በቅጥር ስምምነቶች፣ በስራ ቦታ ውዝግብ አፈታትና በሠራተኛ መብቶች ላይ የሕግ ምክር።",
    },
  },
  {
    id: "environmental-constitutional",
    iconKey: "Leaf",
    en: {
      title: "Environmental & Constitutional Law",
      description:
        "Comparative research and frameworks on constitutional rights to a healthy environment.",
    },
    am: {
      title: "የአካባቢና የሕገ መንግስት ሕግ",
      description: "ጤናማ አካባቢ የማግኘት ሕገ መንግስታዊ መብቶች ላይ የንጽጽር ጥናትና ማዕቀፎች።",
    },
  },
];

const EDUCATION = [
  {
    en: { degree: "Master of Laws (LL.M.) in Business Law", school: "Addis Ababa University" },
    am: { degree: "የቢዝነስ ሕግ ማስተርስ ዲግሪ (LL.M.)", school: "አዲስ አበባ ዩኒቨርሲቲ" },
  },
  {
    en: { degree: "Bachelor of Laws (LL.B.)", school: "Adigrat University" },
    am: { degree: "የሕግ ባችለር ዲግሪ (LL.B.)", school: "አዲግራት ዩኒቨርሲቲ" },
  },
  {
    en: {
      degree: "Certified Judicial Professional",
      school: "Amhara National Regional State Justice Professionals Training and Legal Institute",
    },
    am: {
      degree: "የተመሰከረለት የዳኝነት ባለሙያ",
      school: "የአማራ ብሔራዊ ክልላዊ መንግስት የፍትህ ባለሙያዎች ስልጠናና የሕግ ተቋም",
    },
  },
];

const AWARDS = [
  {
    en: { title: "Volunteer Appreciation Certificate", issuer: "Federal Attorney General of Ethiopia" },
    am: { title: "የበጎ ፈቃደኝነት አድናቆት የምስክር ወረቀት", issuer: "የኢትዮጵያ ፌዴራል ጠቅላይ አቃቤ ህግ" },
  },
  {
    en: { title: "Best Academic Performance Distinction", issuer: "Adigrat University" },
    am: { title: "ምርጥ የትምህርት አፈጻጸም ልዩነት", issuer: "አዲግራት ዩኒቨርሲቲ" },
  },
];

const HIGHLIGHTS = [
  {
    en: {
      title: "Published Research",
      text: "Authored comprehensive research on minority shareholder protection under the Ethiopian Commercial Code.",
    },
    am: {
      title: "የታተመ ጥናት",
      text: "በኢትዮጵያ የንግድ ሕግ ውስጥ ስለ አናሳ ባለአክሲዮኖች ጥበቃ ሰፊ ጥናት አዘጋጅታለች።",
    },
  },
  {
    en: {
      title: "Judicial Bench Experience",
      text: "Served over two years on the judicial bench presiding over woreda court proceedings.",
    },
    am: {
      title: "የዳኝነት ልምድ",
      text: "ከሁለት ዓመት በላይ በወረዳ ፍርድ ቤት የዳኝነት ወንበር ላይ አገልግላለች።",
    },
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Hanamariyam Getnet has been a professional, diligent, and reliable teaching assistant.",
    name: "Dr. Jetu Edosa",
    role: "Executive Vice Dean, Addis Ababa University",
  },
  {
    quote:
      "She was an active participant in class discussions whose contributions were consistently articulate and insightful. Impressively hard-working, well-organized, responsible, and sharp.",
    name: "Afewerki G/slassie",
    role: "Head of Department of Law, Adigrat University",
  },
];

const DEFAULT_BLOG_POSTS = [
  {
    slug: "written-contracts-matter",
    date: "2026-06-01",
    en: {
      title: "Why Written Contracts Matter in Commercial Deals",
      excerpt:
        "A short, practical look at why documenting terms in writing protects both sides of a business relationship.",
      body: [
        "[Sample post — replace this with your own article. This placeholder shows how a published piece will look on the site.]",
        "A written contract gives both sides a clear, shared record of what was agreed — pricing, deadlines, responsibilities, and what happens if something goes wrong. When disputes arise, that record is often what determines the outcome.",
        "For business owners, the habit of putting terms in writing early, even for informal arrangements, tends to prevent far more costly disagreements later.",
      ],
    },
    am: {
      title: "ለምን የተጻፉ ውሎች በንግድ ስምምነት ውስጥ አስፈላጊ ናቸው",
      excerpt: "የተጻፉ ውሎች ለሁለቱም ወገኖች ጥበቃ የሚሰጡበትን ምክንያት አጭርና ተግባራዊ በሆነ መንገድ የሚያሳይ ጽሑፍ።",
      body: [
        "[ናሙና ጽሁፍ — በራስዎ ጽሁፍ ይተኩት። ይህ ናሙና ጽሁፎች በድረ-ገጹ ላይ እንዴት እንደሚታዩ ያሳያል።]",
        "የተጻፈ ውል ለሁለቱም ወገኖች ስለተስማሙበት ጉዳይ ግልጽና የጋራ መዝገብ ይሰጣል — ዋጋ፣ ጊዜ ገደብ፣ ኃላፊነቶች እና ችግር ቢፈጠር ምን መደረግ እንዳለበት። ውዝግብ ሲፈጠር፣ ይህ መዝገብ ብዙ ጊዜ ውጤቱን ይወስናል።",
        "ለንግድ ባለቤቶች፣ ገና ከጅምሩ ስምምነቶችን በጽሁፍ የማስፈር ልማድ፣ ቢያንስ መደበኛ ላልሆኑ ስምምነቶችም ቢሆን፣ በኋላ ላይ በጣም ውድ ሊሆኑ የሚችሉ አለመግባባቶችን ይከላከላል።",
      ],
    },
  },
  {
    slug: "shareholder-rights-overview",
    date: "2026-05-15",
    en: {
      title: "A Brief Overview of Minority Shareholder Protections",
      excerpt:
        "An introductory look at why minority shareholder protection matters in corporate governance.",
      body: [
        "[Sample post — replace this with your own article. This placeholder shows how a published piece will look on the site.]",
        "Minority shareholders often have limited influence over day-to-day company decisions, which is why legal frameworks exist to protect their core interests — access to information, fair treatment in major transactions, and a path to recourse when those interests are overlooked.",
        "Understanding these protections early helps both founders and minority investors set healthier expectations from the start.",
      ],
    },
    am: {
      title: "ስለ አናሳ ባለአክሲዮኖች ጥበቃ አጭር ማብራሪያ",
      excerpt: "የአናሳ ባለአክሲዮኖች ጥበቃ በድርጅት አስተዳደር ውስጥ ለምን አስፈላጊ እንደሆነ የመግቢያ እይታ።",
      body: [
        "[ናሙና ጽሁፍ — በራስዎ ጽሁፍ ይተኩት። ይህ ናሙና ጽሁፎች በድረ-ገጹ ላይ እንዴት እንደሚታዩ ያሳያል።]",
        "አናሳ ባለአክሲዮኖች ብዙ ጊዜ በዕለት ተዕለት የድርጅት ውሳኔዎች ላይ ውስን ተጽዕኖ አላቸው፤ ለዚህም ነው መሰረታዊ ጥቅሞቻቸውን — መረጃ የማግኘት መብት፣ በዋና ዋና ግብይቶች ውስጥ ፍትሃዊ አያያዝ እና ጥቅማቸው ችላ ሲባል የመፍትሄ አማራጭ — የሚጠብቁ የሕግ ማዕቀፎች የሚኖሩት።",
        "እነዚህን ጥበቃዎች ገና ከጅምሩ መረዳት ለመስራች ድርጅቶችም ሆነ ለአናሳ ባለሃብቶች ጤናማ ግምቶችን ከመጀመሪያው ለማስቀመጥ ይረዳል።",
      ],
    },
  },
];

const DEFAULT_HERO_CONTENT = {
  en: {
    eyebrow: "Attorney & former Judge",
    subhead:
      "Experienced legal professional and former judge specializing in business law, corporate governance, and commercial dispute resolution.",
  },
  am: {
    eyebrow: "ጠበቃና የቀድሞ ዳኛ",
    subhead:
      "በንግድ ሕግ፣ በድርጅት አስተዳደርና በንግድ ውዝግብ አፈታት ላይ ልዩ ትኩረት ያደረገች ልምድ ያላት ጠበቃና የቀድሞ ዳኛ።",
  },
};

const DEFAULT_ABOUT_CONTENT = {
  en: {
    heading: "A career built on the bench and in the boardroom",
    bio: "Hanamariyam Getnet Asmare is an accomplished legal practitioner with extensive experience across judicial adjudication, legal advisory, and academic instruction. Her career began in the judiciary, serving as an Assistant Judge and subsequently as a Woreda Court Judge within the Amhara National Regional State. She currently serves as a Legal Assistant at 5A Law Firm LLP in Addis Ababa, managing commercial agreements, corporate compliance, and litigation matters.",
  },
  am: {
    heading: "በዳኝነት ወንበርና በቢዝነስ ጠረጴዛ ላይ የተገነባ ሙያ",
    bio: "ሀናማርየም ጌትነት አሰማረ በዳኝነት፣ በሕግ ምክር አገልግሎትና በአካዳሚክ ትምህርት ሰፊ ልምድ ያላት ስኬታማ የሕግ ባለሙያ ናት። የሙያ ጉዞዋን የጀመረችው በዳኝነት ሲሆን፣ በአማራ ብሔራዊ ክልላዊ መንግስት የረዳት ዳኛ ሆና፣ ቀጥሎም የወረዳ ፍርድ ቤት ዳኛ ሆና አገልግላለች። በአሁኑ ወቅት በአዲስ አበባ በሚገኘው 5A ጠበቆች ኃላፊነቱ የተወሰነ የሽርክና ማህበር ውስጥ የሕግ ረዳት ሆና በማገልገል፣ የንግድ ስምምነቶችን፣ የድርጅት ተገዢነትን እና የክርክር ጉዳዮችን ትከታተላለች።",
  },
};

const DEFAULT_CONTACT_INFO = {
  addressLine1: "5A Law Firm LLP",
  addressLine2: "Bole Road, Tropical Mall, 9th Floor",
  addressLine3: "Addis Ababa, Ethiopia",
  phone: "+251 924 485 788",
  email: "hanamariyamgetnet@gmail.com",
  hours: "Monday – Friday: 8:30 AM – 5:30 PM (EAT)",
};

const DEFAULT_IMAGES = {
  headshotUrl: null,
  aboutUrl: null,
  logoUrl: null,
};

const DEFAULT_CONTENT = {
  hero: DEFAULT_HERO_CONTENT,
  about: DEFAULT_ABOUT_CONTENT,
  practiceAreas: DEFAULT_PRACTICE_AREAS,
  blogPosts: DEFAULT_BLOG_POSTS,
  contactInfo: DEFAULT_CONTACT_INFO,
  images: DEFAULT_IMAGES,
};

const WHATSAPP_NUMBER = "251924485788";

// TODO: replace these two placeholder URLs with her real profile links.
const FACEBOOK_URL = "https://facebook.com/";
const LINKEDIN_URL = "https://linkedin.com/";

// Cloudinary — free image hosting, no credit card required.
// Sign up at cloudinary.com, then paste your Cloud Name (dashboard home
// page) and an unsigned upload preset name (Settings > Upload > Upload
// presets > Add upload preset > Signing Mode: Unsigned) below.
const CLOUDINARY_CLOUD_NAME = "ztaqujps";
const CLOUDINARY_UPLOAD_PRESET = "hanamariyam-portfolio";

/* ---------------------------------------------------------------
   Language context
--------------------------------------------------------------- */

const LanguageContext = createContext(null);

function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLang() {
  return useContext(LanguageContext);
}

/* ---------------------------------------------------------------
   Content context — editable site content, synced live from
   Firestore. Falls back to the defaults above until (or unless)
   a section has ever been saved from the admin page.
--------------------------------------------------------------- */

const ContentContext = createContext(null);
const CONTENT_DOC = ["content", "site"];

function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ref = doc(db, ...CONTENT_DOC);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        const remote = snap.exists() ? snap.data() : {};
        setContent({
          hero: remote.hero || DEFAULT_HERO_CONTENT,
          about: remote.about || DEFAULT_ABOUT_CONTENT,
          practiceAreas: remote.practiceAreas || DEFAULT_PRACTICE_AREAS,
          blogPosts: remote.blogPosts || DEFAULT_BLOG_POSTS,
          contactInfo: remote.contactInfo || DEFAULT_CONTACT_INFO,
          images: remote.images || DEFAULT_IMAGES,
        });
        setReady(true);
      },
      () => {
        // If Firestore isn't reachable or isn't set up yet, keep showing the defaults.
        setContent(DEFAULT_CONTENT);
        setReady(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const saveSection = async (key, value) => {
    const ref = doc(db, ...CONTENT_DOC);
    await setDoc(ref, { [key]: value }, { merge: true });
  };

  return (
    <ContentContext.Provider value={{ content, ready, saveSection }}>
      {children}
    </ContentContext.Provider>
  );
}

function useContent() {
  return useContext(ContentContext);
}

/* ---------------------------------------------------------------
   Shared style block
--------------------------------------------------------------- */

function BrandStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

      :root{
        --navy: #10263F;
        --navy-deep: #081522;
        --charcoal: #2E2E32;
        --gold: #AD8A54;
        --gold-light: #C7A76D;
        --ivory: #FAF7F1;
        --ivory-line: #E3DCC9;
        --whatsapp: #25D366;
      }

      .lp-root { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; color: var(--charcoal); background-color: var(--ivory); scroll-behavior: smooth; }
      .lp-root h1, .lp-root h2, .lp-root h3, .lp-root .font-display { font-family: 'Playfair Display', Georgia, serif; }

      .bg-navy { background-color: var(--navy); }
      .bg-navy-deep { background-color: var(--navy-deep); }
      .bg-ivory { background-color: var(--ivory); }
      .bg-ivory-line { background-color: var(--ivory-line); }
      .bg-gold { background-color: var(--gold); }

      .text-navy { color: var(--navy); }
      .text-charcoal { color: var(--charcoal); }
      .text-charcoal-soft { color: rgba(46,46,50,0.72); }
      .text-gold { color: var(--gold); }
      .text-ivory { color: var(--ivory); }
      .text-ivory-soft { color: rgba(250,247,241,0.74); }
      .text-ivory-faint { color: rgba(250,247,241,0.5); }

      .border-navy { border-color: var(--navy); }
      .border-gold { border-color: var(--gold); }
      .border-ivory-line { border-color: var(--ivory-line); }
      .border-ivory-20 { border-color: rgba(250,247,241,0.2); }

      .lp-link { color: inherit; text-decoration: none; }

      .nav-link { position: relative; color: var(--charcoal); font-size: 0.95rem; padding-bottom: 3px; transition: color .2s ease; }
      .nav-link::after { content: ""; position: absolute; left: 0; right: 100%; bottom: 0; height: 1px; background: var(--gold); transition: right .25s ease; }
      .nav-link:hover { color: var(--navy); }
      .nav-link:hover::after { right: 0; }
      .nav-link-active { color: var(--navy); font-weight: 500; }
      .nav-link-active::after { right: 0; }

      .btn-gold { background-color: var(--gold); color: var(--navy-deep); border: 1px solid var(--gold); border-radius: 9999px; transition: background-color .2s ease, border-color .2s ease, transform .15s ease; }
      .btn-gold:hover { background-color: var(--gold-light); border-color: var(--gold-light); }
      .btn-gold:active { transform: translateY(1px); }

      .btn-outline-ivory { background-color: transparent; color: var(--ivory); border: 1px solid rgba(250,247,241,0.4); border-radius: 9999px; transition: background-color .2s ease, border-color .2s ease; }
      .btn-outline-ivory:hover { background-color: rgba(250,247,241,0.08); border-color: rgba(250,247,241,0.7); }

      .nav-pill { border-radius: 1.75rem; box-shadow: 0 10px 30px rgba(16,38,63,0.1); }

      .icon-badge { width: 3.25rem; height: 3.25rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .icon-badge-gold { background-color: var(--gold); color: var(--navy-deep); }
      .icon-badge-navy { background-color: var(--navy); color: var(--gold); }
      .icon-badge-ivory { background-color: rgba(250,247,241,0.12); color: var(--gold); }

      .tile-card { border-radius: 1.5rem; transition: transform .3s ease, box-shadow .3s ease; }
      .tile-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(16,38,63,0.16); }

      .call-badge { position: absolute; border-radius: 9999px; background-color: var(--gold); color: var(--navy-deep); box-shadow: 0 12px 28px rgba(0,0,0,0.28); display: flex; align-items: center; gap: 0.6rem; }

      .stats-bar { background-image: radial-gradient(rgba(250,247,241,0.06) 1px, transparent 1px); background-size: 18px 18px; }

      .step-badge { width: 3rem; height: 3rem; border-radius: 9999px; background-color: var(--navy); color: var(--gold); display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 1.1rem; flex-shrink: 0; }

      .text-link-gold { color: var(--gold); border-bottom: 1px solid rgba(173,138,84,0.4); padding-bottom: 2px; transition: border-color .2s ease, color .2s ease; }
      .text-link-gold:hover { border-color: var(--gold); color: var(--gold-light); }

      .practice-row { border-top: 1px solid var(--ivory-line); border-left: 2px solid transparent; transition: border-left-color .25s ease, background-color .25s ease, padding-left .25s ease; }
      .practice-row:hover { border-left-color: var(--gold); background-color: rgba(173,138,84,0.045); }

      .credential-node { position: relative; padding-left: 1.75rem; }
      .credential-node::before { content: ""; position: absolute; left: 0; top: 0.4rem; width: 9px; height: 9px; border-radius: 9999px; background: var(--gold); }
      .credential-node::after { content: ""; position: absolute; left: 4px; top: 1.05rem; bottom: -1.5rem; width: 1px; background: var(--ivory-line); }
      .credential-node:last-child::after { display: none; }

      .quote-panel { border-top: 1px solid var(--ivory-line); }

      .field-label { display: block; font-size: 0.8rem; letter-spacing: 0.01em; color: var(--charcoal); margin-bottom: 0.4rem; }
      .field-input { width: 100%; background-color: #FFFFFF; border: 1px solid var(--ivory-line); border-radius: 0.85rem; color: var(--charcoal); padding: 0.65rem 0.95rem; font-size: 0.95rem; transition: border-color .2s ease, box-shadow .2s ease; }
      .field-input:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(173,138,84,0.15); }
      .field-input::placeholder { color: rgba(46,46,50,0.35); }

      a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
        outline: 2px solid var(--gold);
        outline-offset: 3px;
      }

      .frame-plaque { background: linear-gradient(160deg, var(--navy) 0%, var(--navy-deep) 100%); border-radius: 1.75rem; }
      .frame-corner { position: absolute; width: 22px; height: 22px; border-color: rgba(199,167,109,0.55); }

      .lang-toggle { display: inline-flex; border: 1px solid var(--ivory-line); }
      .lang-toggle button { padding: 0.3rem 0.65rem; font-size: 0.78rem; color: var(--charcoal-soft); background: transparent; transition: background-color .2s ease, color .2s ease; }
      .lang-toggle button.active { background-color: var(--navy); color: var(--ivory); }

      .reveal { opacity: 0; transform: translateY(26px); transition: opacity .7s cubic-bezier(.22,.61,.36,1), transform .7s cubic-bezier(.22,.61,.36,1); }
      .reveal-visible { opacity: 1; transform: translateY(0); }

      .page-fade { animation: pageFadeIn .5s cubic-bezier(.22,.61,.36,1) both; }
      @keyframes pageFadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

      .hover-lift { transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease; }
      .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 14px 28px rgba(16,38,63,0.12); }

      .contact-fab-wrap { position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 50; display: flex; flex-direction: column; align-items: flex-end; gap: 0.85rem; }
      .contact-fab-item-wrap { position: relative; display: flex; align-items: center; opacity: 0; transform: translateY(14px) scale(0.85); pointer-events: none; transition: opacity .3s ease, transform .3s ease; }
      .contact-fab-wrap.open .contact-fab-item-wrap { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
      .contact-fab-item { width: 2.85rem; height: 2.85rem; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: #ffffff; box-shadow: 0 6px 16px rgba(0,0,0,0.2); transition: transform .2s ease; }
      .contact-fab-item:hover { transform: scale(1.08); }
      .fab-label { position: absolute; right: 3.5rem; background: #ffffff; color: var(--charcoal); font-size: 0.72rem; padding: 0.3rem 0.65rem; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.16); opacity: 0; transform: translateX(6px); transition: opacity .15s ease, transform .15s ease; white-space: nowrap; pointer-events: none; }
      .contact-fab-item-wrap:hover .fab-label { opacity: 1; transform: translateX(0); }
      .contact-fab-main { width: 3.75rem; height: 3.75rem; border-radius: 9999px; background-color: var(--navy); color: var(--gold); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.28); border: none; cursor: pointer; transition: background-color .2s ease, transform .2s ease; }
      .contact-fab-main:hover { background-color: var(--navy-deep); transform: scale(1.06); }
      .contact-fab-main svg { transition: transform .3s ease; }
      .contact-fab-wrap.open .contact-fab-main svg { transform: rotate(90deg); }

      @media (prefers-reduced-motion: reduce) {
        .lp-root * { transition: none !important; animation: none !important; }
      }
    `}</style>
  );
}

/* ---------------------------------------------------------------
   Floating contact cluster — click or hover to reveal channels
--------------------------------------------------------------- */

function ContactFab() {
  const { t } = useLang();
  const [hovering, setHovering] = useState(false);
  const [clicked, setClicked] = useState(false);
  const open = hovering || clicked;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.whatsappMessage)}`;

  const items = [
    { label: "Facebook", href: FACEBOOK_URL, icon: FaFacebookF, color: "#1877F2", external: true },
    { label: "WhatsApp", href: waUrl, icon: FaWhatsapp, color: "#25D366", external: true },
    { label: "LinkedIn", href: LINKEDIN_URL, icon: FaLinkedinIn, color: "#0A66C2", external: true },
    { label: "Email", href: "mailto:hanamariyamgetnet@gmail.com", icon: FaEnvelope, color: "var(--gold)" },
    { label: "Call", href: "tel:+251924485788", icon: FaPhone, color: "var(--navy)" },
  ];

  return (
    <div
      className={`contact-fab-wrap${open ? " open" : ""}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        const delay = (items.length - 1 - i) * 45;
        return (
          <span key={item.label} className="contact-fab-item-wrap" style={{ transitionDelay: `${delay}ms` }}>
            <span className="fab-label">{item.label}</span>
            <a
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="contact-fab-item"
              style={{ backgroundColor: item.color }}
              aria-label={item.label}
            >
              <Icon size={17} />
            </a>
          </span>
        );
      })}

      <button
        className="contact-fab-main"
        onClick={() => setClicked((v) => !v)}
        aria-label={open ? "Close contact options" : "Show contact options"}
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   Language toggle
--------------------------------------------------------------- */

function LangToggle({ className = "" }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-toggle ${className}`}>
      <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>
        EN
      </button>
      <button className={lang === "am" ? "active" : ""} onClick={() => setLang("am")}>
        አማ
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   Nav
--------------------------------------------------------------- */

function NavBar() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();
  const { content } = useContent();
  const logoSrc = content.images?.logoUrl || logoImg;

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/practice-areas", label: t.nav.practice },
    { to: "/insights", label: t.nav.insights },
    { to: "/contact", label: t.nav.contact },
  ];

  const linkClass = ({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`;

  return (
    <header className="sticky top-0 z-50 pt-4 px-4">
      <div className="nav-pill max-w-6xl mx-auto bg-ivory">
        <div className="flex items-center justify-between h-[4.5rem] px-5 lg:px-7">
          <Link to="/" className="flex items-center gap-3 lp-link">
            <span className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src={logoSrc} alt="HMG Legal Solutions logo" className="w-full h-full object-cover" />
            </span>
            <span className="leading-tight hidden sm:inline">
              <span className="block font-display text-base text-navy">
                Hanamariyam Getnet Asmare
              </span>
              <span className="block text-xs text-charcoal-soft">
                Attorney &amp; Legal Consultant
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className={linkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <LangToggle />
            <Link to="/consultation" className="btn-gold px-5 py-2.5 text-sm font-medium">
              {t.nav.consultation}
            </Link>
          </div>

          <button
            className="lg:hidden text-navy"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-ivory-line">
            <div className="px-6 py-5 flex flex-col gap-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                end={link.to === "/"}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <LangToggle className="self-start" />
            <Link
              to="/consultation"
              className="btn-gold px-5 py-2.5 text-sm font-medium text-center mt-2"
              onClick={() => setOpen(false)}
            >
              {t.nav.consultation}
            </Link>
          </div>
        </div>
      )}
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------
   Footer
--------------------------------------------------------------- */

function Footer() {
  const { t } = useLang();
  const { content } = useContent();
  const logoSrc = content.images?.logoUrl || logoImg;
  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/practice-areas", label: t.nav.practice },
    { to: "/insights", label: t.nav.insights },
    { to: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-navy-deep border-t border-ivory-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-navy flex items-center justify-center overflow-hidden">
              <img src={logoSrc} alt="HMG Legal Solutions logo" className="w-full h-full object-cover" />
            </span>
            <span className="font-display text-ivory text-sm">
              Hanamariyam Getnet Asmare
            </span>
          </div>
          <nav className="flex flex-wrap gap-x-7 gap-y-2">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="text-ivory-faint text-sm hover:text-gold">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="w-full h-px bg-ivory-20 my-8" />

        <p className="text-ivory-faint text-xs leading-relaxed max-w-3xl">
          {t.footer.disclaimer}
        </p>
        <p className="text-ivory-faint text-xs mt-4">
          © 2026 Hanamariyam Getnet Asmare. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------
   Reveal — fades and lifts content into view as it's scrolled to
--------------------------------------------------------------- */

function Reveal({ children, delay = 0, className = "", style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ ...style, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------
   PageFade — a light crossfade whenever the route or language changes
--------------------------------------------------------------- */

function PageFade({ children }) {
  const location = useLocation();
  const { lang } = useLang();
  return (
    <div key={`${location.pathname}-${lang}`} className="page-fade">
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------
   Layout wrapper (shared chrome for every page)
--------------------------------------------------------------- */

function Layout({ children }) {
  return (
    <div className="lp-root min-h-screen flex flex-col">
      <BrandStyles />
      <NavBar />
      <main className="flex-1">
        <PageFade>{children}</PageFade>
      </main>
      <Footer />
      <ContactFab />
    </div>
  );
}

/* ---------------------------------------------------------------
   Home
--------------------------------------------------------------- */

function Home() {
  const { t, lang } = useLang();
  const { content } = useContent();
  const hero = content.hero[lang];
  const about = content.about[lang];
  const headshotSrc = content.images?.headshotUrl || headshotImg;
  const aboutPhotoSrc = content.images?.aboutUrl || headshotImg;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  const base = "transition-all duration-700 ease-out";
  const hidden = "opacity-0 translate-y-3";
  const shown = "opacity-100 translate-y-0";

  return (
    <>
      <section className="bg-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-5 gap-14 items-center">
          <div className="lg:col-span-3">
            <p className={`${base} ${mounted ? shown : hidden} font-display italic text-gold text-lg mb-5`}>
              {hero.eyebrow}
            </p>
            <h1
              className={`${base} ${mounted ? shown : hidden} font-display text-ivory text-4xl sm:text-5xl lg:text-6xl leading-[1.12]`}
              style={{ transitionDelay: "90ms" }}
            >
              Hanamariyam Getnet Asmare
            </h1>
            <p
              className={`${base} ${mounted ? shown : hidden} font-display text-gold text-xl sm:text-2xl mt-2`}
              style={{ transitionDelay: "150ms" }}
            >
              {t.hero.credentials}
            </p>
            <div
              className={`${base} ${mounted ? shown : hidden} w-16 h-px bg-gold my-7`}
              style={{ transitionDelay: "210ms" }}
            />
            <p
              className={`${base} ${mounted ? shown : hidden} text-ivory-soft text-lg leading-relaxed max-w-xl`}
              style={{ transitionDelay: "260ms" }}
            >
              {hero.subhead}
            </p>
            <div
              className={`${base} ${mounted ? shown : hidden} flex flex-wrap items-center gap-x-8 gap-y-4 mt-10`}
              style={{ transitionDelay: "320ms" }}
            >
              <Link to="/consultation" className="btn-gold px-7 py-3.5 text-sm font-medium tracking-wide">
                {t.hero.cta}
              </Link>
              <Link to="/practice-areas" className="text-link-gold text-sm">
                {t.hero.secondaryCta}
              </Link>
            </div>
          </div>

          <div
            className={`${base} ${mounted ? shown : hidden} lg:col-span-2 flex justify-center lg:justify-end`}
            style={{ transitionDelay: "180ms" }}
          >
            <div className="w-full max-w-xs">
              <div className="relative">
                <div
                  className="absolute -z-10 rounded-full"
                  style={{ inset: "-1.25rem -1.25rem auto auto", top: "-1.25rem", right: "-1.25rem", width: "70%", height: "70%", backgroundColor: "var(--gold)", opacity: 0.18 }}
                />
                <div className="frame-plaque relative border border-ivory-20 aspect-[3/4] overflow-hidden">
                  <img
                    src={headshotSrc}
                    alt="Hanamariyam Getnet Asmare"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <a
                  href="tel:+251924485788"
                  className="call-badge px-5 py-3"
                  style={{ bottom: "-1.25rem", left: "-1.25rem" }}
                >
                  <Phone className="w-5 h-5" strokeWidth={1.75} />
                  <span className="text-sm font-medium">+251 924 485 788</span>
                </a>
              </div>
              <p className="text-center text-ivory-faint text-xs mt-10">{t.hero.portraitCaption}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-deep stats-bar">
        <Reveal className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {t.stats.items.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-gold text-4xl sm:text-5xl mb-2">{stat.number}</p>
              <p className="text-ivory-soft text-sm leading-snug">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-5 gap-12 items-center">
          <Reveal className="lg:col-span-2">
            <div className="relative border border-ivory-line bg-navy aspect-[4/5] max-w-sm overflow-hidden rounded-2xl">
              <img
                src={aboutPhotoSrc}
                alt="Hanamariyam Getnet Asmare"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: "center 20%" }}
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-3">
            <p className="font-display italic text-gold text-lg mb-4">{t.homeAboutTeaser.eyebrow}</p>
            <h2 className="font-display text-navy text-3xl sm:text-4xl mb-5 leading-tight">
              {about.heading}
            </h2>
            <p className="text-charcoal-soft leading-relaxed max-w-xl mb-6">{t.homeAboutTeaser.text}</p>
            <Link to="/about" className="text-link-gold text-sm">
              {t.homeAboutTeaser.link}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <Reveal>
            <p className="font-display italic text-gold text-lg mb-4">{t.homePracticeTeaser.eyebrow}</p>
            <h2 className="font-display text-ivory text-3xl sm:text-4xl leading-tight max-w-2xl mb-10">
              {t.homePracticeTeaser.heading}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-8">
            {content.practiceAreas.slice(0, 3).map((area, i) => {
              const Icon = ICON_MAP[area.iconKey] || Briefcase;
              const copy = area[lang];
              return (
                <Reveal
                  key={area.id}
                  delay={i * 100}
                  className="tile-card hover-lift p-7"
                  style={{ backgroundColor: "rgba(250,247,241,0.05)", border: "1px solid rgba(250,247,241,0.12)" }}
                >
                  <span className="icon-badge icon-badge-gold mb-5">
                    <Icon className="w-6 h-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-ivory text-lg mb-2">{copy.title}</h3>
                  <p className="text-ivory-soft text-sm leading-relaxed">{copy.description}</p>
                </Reveal>
              );
            })}
          </div>
          <Link to="/practice-areas" className="text-link-gold text-sm inline-block mt-10">
            {t.homePracticeTeaser.link}
          </Link>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <Reveal>
            <p className="font-display italic text-gold text-lg mb-4">{t.homeInsightsTeaser.eyebrow}</p>
            <h2 className="font-display text-navy text-3xl sm:text-4xl leading-tight max-w-2xl mb-10">
              {t.homeInsightsTeaser.heading}
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-8">
            {content.blogPosts.slice(0, 2).map((post, i) => {
              const copy = post[lang];
              return (
                <Reveal key={post.slug} delay={i * 100}>
                  <Link
                    to={`/insights/${post.slug}`}
                    className="lp-link hover-lift block border border-ivory-line p-6 hover:border-gold rounded-2xl"
                  >
                    <p className="text-xs text-charcoal-soft mb-2">{post.date}</p>
                    <h3 className="font-display text-navy text-xl mb-2">{copy.title}</h3>
                    <p className="text-charcoal-soft text-sm leading-relaxed">{copy.excerpt}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <Link to="/insights" className="text-link-gold text-sm inline-block mt-10">
            {t.homeInsightsTeaser.link}
          </Link>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <Reveal className="max-w-2xl mb-14">
            <p className="font-display italic text-gold text-lg mb-4">{t.process.eyebrow}</p>
            <h2 className="font-display text-navy text-3xl sm:text-4xl leading-tight">{t.process.heading}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-10">
            {t.process.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100} className="flex flex-col items-start">
                <span className="step-badge mb-5">{i + 1}</span>
                <h3 className="font-display text-navy text-lg mb-2">{step.title}</h3>
                <p className="text-charcoal-soft text-sm leading-relaxed">{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-deep">
        <Reveal className="max-w-7xl mx-auto px-6 lg:px-10 py-20 text-center">
          <h2 className="font-display text-ivory text-3xl sm:text-4xl mb-4">{t.homeCta.heading}</h2>
          <p className="text-ivory-soft max-w-xl mx-auto mb-8">{t.homeCta.text}</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/consultation" className="btn-gold px-7 py-3.5 text-sm font-medium tracking-wide">
              {t.homeCta.cta}
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-ivory px-7 py-3.5 text-sm font-medium tracking-wide"
            >
              {t.homeCta.whatsapp}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ---------------------------------------------------------------
   About
--------------------------------------------------------------- */

function About() {
  const { t, lang } = useLang();
  const { content } = useContent();
  const about = content.about[lang];
  const aboutPhotoSrc = content.images?.aboutUrl || headshotImg;

  return (
    <section className="bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-5 gap-16">
        <Reveal className="lg:col-span-2">
          <div className="relative border border-ivory-line bg-navy aspect-[4/5] max-w-sm overflow-hidden rounded-2xl">
            <img
              src={aboutPhotoSrc}
              alt="Hanamariyam Getnet Asmare at 5A Law Firm LLP"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
          </div>
          <p className="text-xs text-charcoal-soft mt-3 max-w-sm">{t.about.portraitCaption}</p>

          <div className="mt-10 max-w-sm">
            <h3 className="font-display text-navy text-xl mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" strokeWidth={1.75} />
              {t.about.awardsHeading}
            </h3>
            <ul className="space-y-3">
              {AWARDS.map((a) => (
                <li key={a.en.title} className="text-sm text-charcoal-soft leading-relaxed">
                  <span className="text-charcoal font-medium">{a[lang].title}</span>
                  <br />
                  {a[lang].issuer}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="lg:col-span-3">
          <Reveal>
            <p className="font-display italic text-gold text-lg mb-4">{t.about.eyebrow}</p>
            <h2 className="font-display text-navy text-3xl sm:text-4xl mb-6 leading-tight">
              {about.heading}
            </h2>
            <p className="text-charcoal-soft leading-relaxed max-w-2xl">{about.bio}</p>
          </Reveal>

          <h3 className="font-display text-navy text-xl mt-12 mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-gold" strokeWidth={1.75} />
            {t.about.eduHeading}
          </h3>
          <div className="space-y-6 max-w-2xl">
            {EDUCATION.map((e, i) => (
              <Reveal key={e.en.degree} delay={i * 90} className="credential-node">
                <p className="text-charcoal font-medium">{e[lang].degree}</p>
                <p className="text-charcoal-soft text-sm mt-0.5">{e[lang].school}</p>
              </Reveal>
            ))}
          </div>

          <h3 className="font-display text-navy text-xl mt-12 mb-6">{t.about.highlightsHeading}</h3>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal
                key={h.en.title}
                delay={i * 100}
                className="hover-lift border-l-2 border-gold pl-5 py-1"
              >
                <p className="text-charcoal font-medium mb-1">{h[lang].title}</p>
                <p className="text-charcoal-soft text-sm leading-relaxed">{h[lang].text}</p>
              </Reveal>
            ))}
          </div>

          <h3 className="font-display text-navy text-xl mt-12 mb-6">{t.about.testimonialsHeading}</h3>
          <div className="space-y-8 max-w-2xl quote-panel pt-8">
            {TESTIMONIALS.map((tItem, i) => (
              <Reveal key={tItem.name} delay={i * 100}>
                <figure>
                  <Quote className="w-6 h-6 text-gold opacity-70 mb-3" strokeWidth={1.5} />
                  <blockquote className="font-display italic text-navy text-lg leading-relaxed">
                    {tItem.quote}
                  </blockquote>
                  <figcaption className="text-charcoal-soft text-sm mt-3">
                    — {tItem.name}, {tItem.role}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   Practice Areas
--------------------------------------------------------------- */

function PracticeAreas() {
  const { t, lang } = useLang();
  const { content } = useContent();

  return (
    <section className="bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Reveal className="max-w-2xl mb-14">
          <p className="font-display italic text-gold text-lg mb-4">{t.practice.eyebrow}</p>
          <h2 className="font-display text-navy text-3xl sm:text-4xl leading-tight">{t.practice.heading}</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.practiceAreas.map((area, i) => {
            const Icon = ICON_MAP[area.iconKey] || Briefcase;
            const copy = area[lang];
            return (
              <Reveal
                key={area.id}
                delay={i * 70}
                className="tile-card hover-lift bg-white p-7"
                style={{ border: "1px solid var(--ivory-line)" }}
              >
                <span className="icon-badge icon-badge-navy mb-5">
                  <Icon className="w-6 h-6" strokeWidth={1.5} />
                </span>
                <h3 className="font-display text-navy text-xl mb-2">{copy.title}</h3>
                <p className="text-charcoal-soft leading-relaxed">{copy.description}</p>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12">
          <Link to="/consultation" className="btn-gold px-7 py-3.5 text-sm font-medium tracking-wide">
            {t.practice.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   Insights (list)
--------------------------------------------------------------- */

function Insights() {
  const { t, lang } = useLang();
  const { content } = useContent();

  return (
    <section className="bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Reveal className="max-w-2xl mb-14">
          <p className="font-display italic text-gold text-lg mb-4">{t.insights.eyebrow}</p>
          <h2 className="font-display text-navy text-3xl sm:text-4xl leading-tight">{t.insights.heading}</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-8">
          {content.blogPosts.map((post, i) => {
            const copy = post[lang];
            return (
              <Reveal key={post.slug} delay={i * 90}>
                <Link
                  to={`/insights/${post.slug}`}
                  className="lp-link hover-lift block border border-ivory-line p-7 hover:border-gold rounded-2xl"
                >
                  <p className="text-xs text-charcoal-soft mb-2">{post.date}</p>
                  <h3 className="font-display text-navy text-xl mb-3">{copy.title}</h3>
                  <p className="text-charcoal-soft text-sm leading-relaxed mb-4">{copy.excerpt}</p>
                  <span className="text-link-gold text-sm">{t.insights.readMore}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   Insight detail
--------------------------------------------------------------- */

function InsightDetail() {
  const { slug } = useParams();
  const { t, lang } = useLang();
  const { content } = useContent();
  const post = content.blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section className="bg-ivory">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-24 text-center">
          <h2 className="font-display text-navy text-3xl mb-4">{t.insights.notFoundTitle}</h2>
          <p className="text-charcoal-soft mb-8">{t.insights.notFoundText}</p>
          <Link to="/insights" className="text-link-gold text-sm">
            {t.insights.backToInsights}
          </Link>
        </div>
      </section>
    );
  }

  const copy = post[lang];

  return (
    <section className="bg-ivory">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Link to="/insights" className="text-link-gold text-sm inline-flex items-center gap-2 mb-10">
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          {t.insights.backToInsights}
        </Link>
        <Reveal>
          <p className="text-xs text-charcoal-soft mb-3">{post.date}</p>
          <h1 className="font-display text-navy text-3xl sm:text-4xl leading-tight mb-8">{copy.title}</h1>
          <div className="space-y-5">
            {copy.body.map((paragraph, i) => (
              <p key={i} className="text-charcoal-soft leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   Contact
--------------------------------------------------------------- */

function Contact() {
  const { t } = useLang();
  const { content } = useContent();
  const info = content.contactInfo;
  const [form, setForm] = useState({ name: "", email: "", phone: "", area: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t.contact.errorRequired);
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section className="bg-navy-deep">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid lg:grid-cols-5 gap-16">
        <Reveal className="lg:col-span-2">
          <p className="font-display italic text-gold text-lg mb-4">{t.contact.eyebrow}</p>
          <h2 className="font-display text-ivory text-3xl sm:text-4xl leading-tight mb-8">{t.contact.heading}</h2>

          <ul className="space-y-6">
            <li className="flex gap-4">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-ivory-soft leading-relaxed">
                {info.addressLine1}
                <br />
                {info.addressLine2}
                <br />
                {info.addressLine3}
              </span>
            </li>
            <li className="flex gap-4">
              <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-ivory-soft">{info.phone}</span>
            </li>
            <li className="flex gap-4">
              <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-ivory-soft">{info.email}</span>
            </li>
            <li className="flex gap-4">
              <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-ivory-soft">{info.hours}</span>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={120} className="lg:col-span-3">
          <div className="bg-ivory p-7 sm:p-10 rounded-2xl" style={{ borderTop: "3px solid var(--gold)" }}>
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-gold mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-navy text-2xl mb-2">
                  {t.contact.thankYouHeading}, {form.name.split(" ")[0]}
                </h3>
                <p className="text-charcoal-soft max-w-sm mx-auto">{t.contact.thankYouText}</p>
                <button
                  className="text-link-gold text-sm mt-6"
                  onClick={() => {
                    setForm({ name: "", email: "", phone: "", area: "", message: "" });
                    setSubmitted(false);
                  }}
                >
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">{t.contact.fullName}</label>
                    <input className="field-input" type="text" value={form.name} onChange={update("name")} />
                  </div>
                  <div>
                    <label className="field-label">{t.contact.email}</label>
                    <input className="field-input" type="email" value={form.email} onChange={update("email")} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="field-label">{t.contact.phone}</label>
                    <input className="field-input" type="tel" value={form.phone} onChange={update("phone")} />
                  </div>
                  <div>
                    <label className="field-label">{t.contact.area}</label>
                    <select className="field-input" value={form.area} onChange={update("area")}>
                      <option value="">{t.contact.areaPlaceholder}</option>
                      {content.practiceAreas.map((a) => (
                        <option key={a.id} value={a.en.title}>
                          {a.en.title}
                        </option>
                      ))}
                      <option value="General Inquiry">{t.contact.generalInquiry}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="field-label">{t.contact.message}</label>
                  <textarea
                    className="field-input"
                    rows={5}
                    value={form.message}
                    onChange={update("message")}
                    placeholder={t.contact.messagePlaceholder}
                  />
                </div>

                {error && <p className="text-sm" style={{ color: "#9A3B3B" }}>{error}</p>}

                <button onClick={handleSubmit} className="btn-gold px-7 py-3 text-sm font-medium w-full sm:w-auto">
                  {t.contact.submit}
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   Consultation (booking)
--------------------------------------------------------------- */

function Consultation() {
  const { t } = useLang();
  const { content } = useContent();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    date: "",
    time: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.date) {
      setError(t.contact.errorRequired);
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section className="bg-ivory">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
        <Reveal>
          <p className="font-display italic text-gold text-lg mb-4">{t.consultation.eyebrow}</p>
          <h1 className="font-display text-navy text-3xl sm:text-4xl leading-tight mb-4">
            {t.consultation.heading}
          </h1>
          <p className="text-charcoal-soft leading-relaxed max-w-xl mb-10">{t.consultation.intro}</p>
        </Reveal>

        <Reveal delay={100} className="bg-white p-7 sm:p-10 border border-ivory-line rounded-2xl" style={{ borderTop: "3px solid var(--gold)" }}>
          {submitted ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="w-10 h-10 text-gold mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-display text-navy text-2xl mb-2">{t.consultation.thankYouHeading}</h3>
              <p className="text-charcoal-soft max-w-sm mx-auto">{t.consultation.thankYouText}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="field-label">{t.contact.fullName}</label>
                  <input className="field-input" type="text" value={form.name} onChange={update("name")} />
                </div>
                <div>
                  <label className="field-label">{t.contact.email}</label>
                  <input className="field-input" type="email" value={form.email} onChange={update("email")} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="field-label">{t.contact.phone}</label>
                  <input className="field-input" type="tel" value={form.phone} onChange={update("phone")} />
                </div>
                <div>
                  <label className="field-label">{t.contact.area}</label>
                  <select className="field-input" value={form.area} onChange={update("area")}>
                    <option value="">{t.contact.areaPlaceholder}</option>
                    {content.practiceAreas.map((a) => (
                      <option key={a.id} value={a.en.title}>
                        {a.en.title}
                      </option>
                    ))}
                    <option value="General Inquiry">{t.contact.generalInquiry}</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="field-label flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold" strokeWidth={1.75} />
                    {t.consultation.preferredDate}
                  </label>
                  <input className="field-input" type="date" value={form.date} onChange={update("date")} />
                </div>
                <div>
                  <label className="field-label flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" strokeWidth={1.75} />
                    {t.consultation.preferredTime}
                  </label>
                  <select className="field-input" value={form.time} onChange={update("time")}>
                    <option value="">—</option>
                    {t.consultation.timeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">{t.contact.message}</label>
                <textarea
                  className="field-input"
                  rows={4}
                  value={form.message}
                  onChange={update("message")}
                  placeholder={t.contact.messagePlaceholder}
                />
              </div>

              {error && <p className="text-sm" style={{ color: "#9A3B3B" }}>{error}</p>}

              <button onClick={handleSubmit} className="btn-gold px-7 py-3 text-sm font-medium w-full sm:w-auto">
                {t.consultation.submit}
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   Admin — password-gated content editor. Writes go straight to
   Firestore, and every visitor's browser updates live because the
   public pages are subscribed to the same document.
--------------------------------------------------------------- */

function AdminShell({ children }) {
  return (
    <div className="lp-root min-h-screen">
      <BrandStyles />
      <div className="max-w-5xl mx-auto px-6 py-10">{children}</div>
    </div>
  );
}

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setError("Couldn't sign in — check the email and password and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-sm mx-auto py-16">
        <h1 className="font-display text-navy text-2xl mb-6">Admin sign in</h1>
        <div className="space-y-4">
          <div>
            <label className="field-label">Email</label>
            <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          {error && <p className="text-sm" style={{ color: "#9A3B3B" }}>{error}</p>}
          <button onClick={handleLogin} disabled={loading} className="btn-gold px-6 py-2.5 text-sm font-medium w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </div>
    </AdminShell>
  );
}

function SavedNote({ show }) {
  if (!show) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gold ml-4">
      <CheckCircle2 className="w-4 h-4" /> Saved — now live on the site
    </span>
  );
}

function HeroEditor() {
  const { content, saveSection } = useContent();
  const [draft, setDraft] = useState(content.hero);
  const [saved, setSaved] = useState(false);

  const setField = (langKey, field) => (e) =>
    setDraft((d) => ({ ...d, [langKey]: { ...d[langKey], [field]: e.target.value } }));

  const handleSave = async () => {
    await saveSection("hero", draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h2 className="font-display text-navy text-2xl mb-1">Hero section</h2>
      <p className="text-charcoal-soft text-sm mb-6">The eyebrow line and subheading shown at the top of the homepage.</p>
      <div className="grid sm:grid-cols-2 gap-8">
        {["en", "am"].map((langKey) => (
          <div key={langKey}>
            <p className="text-xs font-medium text-gold mb-3">{langKey === "en" ? "English" : "Amharic"}</p>
            <label className="field-label">Eyebrow</label>
            <input className="field-input mb-4" value={draft[langKey].eyebrow} onChange={setField(langKey, "eyebrow")} />
            <label className="field-label">Subheading</label>
            <textarea className="field-input" rows={4} value={draft[langKey].subhead} onChange={setField(langKey, "subhead")} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center">
        <button onClick={handleSave} className="btn-gold px-6 py-2.5 text-sm font-medium">
          Save hero section
        </button>
        <SavedNote show={saved} />
      </div>
    </div>
  );
}

function AboutEditor() {
  const { content, saveSection } = useContent();
  const [draft, setDraft] = useState(content.about);
  const [saved, setSaved] = useState(false);

  const setField = (langKey, field) => (e) =>
    setDraft((d) => ({ ...d, [langKey]: { ...d[langKey], [field]: e.target.value } }));

  const handleSave = async () => {
    await saveSection("about", draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h2 className="font-display text-navy text-2xl mb-1">About</h2>
      <p className="text-charcoal-soft text-sm mb-6">Her headline and full biography on the About page.</p>
      <div className="grid sm:grid-cols-2 gap-8">
        {["en", "am"].map((langKey) => (
          <div key={langKey}>
            <p className="text-xs font-medium text-gold mb-3">{langKey === "en" ? "English" : "Amharic"}</p>
            <label className="field-label">Heading</label>
            <input className="field-input mb-4" value={draft[langKey].heading} onChange={setField(langKey, "heading")} />
            <label className="field-label">Biography</label>
            <textarea className="field-input" rows={8} value={draft[langKey].bio} onChange={setField(langKey, "bio")} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center">
        <button onClick={handleSave} className="btn-gold px-6 py-2.5 text-sm font-medium">
          Save about section
        </button>
        <SavedNote show={saved} />
      </div>
    </div>
  );
}

function PracticeAreasEditor() {
  const { content, saveSection } = useContent();
  const [draft, setDraft] = useState(content.practiceAreas);
  const [saved, setSaved] = useState(false);

  const updateItem = (id, patch) =>
    setDraft((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const updateLang = (id, langKey, field) => (e) =>
    setDraft((list) =>
      list.map((item) =>
        item.id === id ? { ...item, [langKey]: { ...item[langKey], [field]: e.target.value } } : item
      )
    );

  const removeItem = (id) => setDraft((list) => list.filter((item) => item.id !== id));

  const addItem = () =>
    setDraft((list) => [
      ...list,
      {
        id: `practice-${Date.now()}`,
        iconKey: "Briefcase",
        en: { title: "New practice area", description: "" },
        am: { title: "አዲስ የስራ ዘርፍ", description: "" },
      },
    ]);

  const handleSave = async () => {
    await saveSection("practiceAreas", draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h2 className="font-display text-navy text-2xl mb-1">Practice areas</h2>
      <p className="text-charcoal-soft text-sm mb-6">Add, remove, or edit the areas listed on the Practice Areas page.</p>

      <div className="space-y-8">
        {draft.map((item) => (
          <div key={item.id} className="border border-ivory-line p-5">
            <div className="flex items-center justify-between mb-4">
              <select
                className="field-input max-w-[160px]"
                value={item.iconKey}
                onChange={(e) => updateItem(item.id, { iconKey: e.target.value })}
              >
                {ICON_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              <button onClick={() => removeItem(item.id)} className="text-sm text-charcoal-soft hover:text-gold">
                Remove
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {["en", "am"].map((langKey) => (
                <div key={langKey}>
                  <p className="text-xs font-medium text-gold mb-2">{langKey === "en" ? "English" : "Amharic"}</p>
                  <label className="field-label">Title</label>
                  <input
                    className="field-input mb-3"
                    value={item[langKey].title}
                    onChange={updateLang(item.id, langKey, "title")}
                  />
                  <label className="field-label">Description</label>
                  <textarea
                    className="field-input"
                    rows={3}
                    value={item[langKey].description}
                    onChange={updateLang(item.id, langKey, "description")}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={addItem} className="text-link-gold text-sm mt-6">
        + Add a practice area
      </button>

      <div className="mt-8 flex items-center">
        <button onClick={handleSave} className="btn-gold px-6 py-2.5 text-sm font-medium">
          Save practice areas
        </button>
        <SavedNote show={saved} />
      </div>
    </div>
  );
}

function BlogPostsEditor() {
  const { content, saveSection } = useContent();
  const [draft, setDraft] = useState(content.blogPosts);
  const [saved, setSaved] = useState(false);

  const updateMeta = (slug, field) => (e) =>
    setDraft((list) => list.map((p) => (p.slug === slug ? { ...p, [field]: e.target.value } : p)));

  const updateLangField = (slug, langKey, field) => (e) =>
    setDraft((list) =>
      list.map((p) => (p.slug === slug ? { ...p, [langKey]: { ...p[langKey], [field]: e.target.value } } : p))
    );

  const updateBody = (slug, langKey) => (e) =>
    setDraft((list) =>
      list.map((p) =>
        p.slug === slug
          ? { ...p, [langKey]: { ...p[langKey], body: e.target.value.split("\n").filter((line) => line.trim() !== "") } }
          : p
      )
    );

  const removeItem = (slug) => setDraft((list) => list.filter((p) => p.slug !== slug));

  const addItem = () => {
    const slug = `new-post-${Date.now()}`;
    setDraft((list) => [
      ...list,
      {
        slug,
        date: new Date().toISOString().slice(0, 10),
        en: { title: "New post title", excerpt: "", body: [""] },
        am: { title: "አዲስ ጽሁፍ ርዕስ", excerpt: "", body: [""] },
      },
    ]);
  };

  const handleSave = async () => {
    await saveSection("blogPosts", draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h2 className="font-display text-navy text-2xl mb-1">Blog / Insights posts</h2>
      <p className="text-charcoal-soft text-sm mb-1">Add, remove, or edit posts shown on the Insights page.</p>
      <p className="text-charcoal-soft text-xs mb-6">
        For the body text, put each paragraph on its own line — every line becomes a separate paragraph on the page.
      </p>

      <div className="space-y-10">
        {draft.map((post) => (
          <div key={post.slug} className="border border-ivory-line p-5">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="field-label">Date</label>
                <input
                  className="field-input"
                  type="date"
                  value={post.date}
                  onChange={updateMeta(post.slug, "date")}
                />
              </div>
              <div>
                <label className="field-label">URL slug</label>
                <input
                  className="field-input"
                  value={post.slug}
                  onChange={(e) =>
                    setDraft((list) =>
                      list.map((p) => (p.slug === post.slug ? { ...p, slug: e.target.value } : p))
                    )
                  }
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {["en", "am"].map((langKey) => (
                <div key={langKey}>
                  <p className="text-xs font-medium text-gold mb-2">{langKey === "en" ? "English" : "Amharic"}</p>
                  <label className="field-label">Title</label>
                  <input
                    className="field-input mb-3"
                    value={post[langKey].title}
                    onChange={updateLangField(post.slug, langKey, "title")}
                  />
                  <label className="field-label">Excerpt</label>
                  <textarea
                    className="field-input mb-3"
                    rows={2}
                    value={post[langKey].excerpt}
                    onChange={updateLangField(post.slug, langKey, "excerpt")}
                  />
                  <label className="field-label">Body (one paragraph per line)</label>
                  <textarea
                    className="field-input"
                    rows={6}
                    value={post[langKey].body.join("\n")}
                    onChange={updateBody(post.slug, langKey)}
                  />
                </div>
              ))}
            </div>

            <button onClick={() => removeItem(post.slug)} className="text-sm text-charcoal-soft hover:text-gold mt-4">
              Remove this post
            </button>
          </div>
        ))}
      </div>

      <button onClick={addItem} className="text-link-gold text-sm mt-6">
        + Add a post
      </button>

      <div className="mt-8 flex items-center">
        <button onClick={handleSave} className="btn-gold px-6 py-2.5 text-sm font-medium">
          Save posts
        </button>
        <SavedNote show={saved} />
      </div>
    </div>
  );
}

function ContactInfoEditor() {
  const { content, saveSection } = useContent();
  const [draft, setDraft] = useState(content.contactInfo);
  const [saved, setSaved] = useState(false);

  const setField = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  const handleSave = async () => {
    await saveSection("contactInfo", draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    ["addressLine1", "Address line 1"],
    ["addressLine2", "Address line 2"],
    ["addressLine3", "Address line 3"],
    ["phone", "Phone number"],
    ["email", "Email address"],
    ["hours", "Office hours"],
  ];

  return (
    <div>
      <h2 className="font-display text-navy text-2xl mb-1">Contact info</h2>
      <p className="text-charcoal-soft text-sm mb-6">
        Shown on the Contact page. Not translated — the same details appear regardless of language.
      </p>
      <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
        {fields.map(([key, label]) => (
          <div key={key}>
            <label className="field-label">{label}</label>
            <input className="field-input" value={draft[key]} onChange={setField(key)} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center">
        <button onClick={handleSave} className="btn-gold px-6 py-2.5 text-sm font-medium">
          Save contact info
        </button>
        <SavedNote show={saved} />
      </div>
    </div>
  );
}

function ImageUploadField({ label, hint, currentUrl, fallbackSrc, onUploaded, storagePath }) {
  const [preview, setPreview] = useState(currentUrl || fallbackSrc);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", storagePath);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (!data.secure_url) throw new Error("No URL returned from Cloudinary");

      await onUploaded(data.secure_url);
      setFile(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError("Upload failed — check your Cloudinary cloud name and upload preset in the code, then try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      {hint && <p className="text-xs text-charcoal-soft mt-0.5">{hint}</p>}
      <div className="flex items-center gap-5 mt-2">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-navy border border-ivory-line flex-shrink-0">
          <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          <div className="mt-3 flex items-center">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn-gold px-5 py-2 text-sm font-medium"
            >
              {uploading ? "Uploading…" : `Upload new ${label.toLowerCase()}`}
            </button>
            <SavedNote show={saved} />
          </div>
          {error && <p className="text-sm mt-2" style={{ color: "#9A3B3B" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

function ImagesEditor() {
  const { content, saveSection } = useContent();
  const images = content.images || DEFAULT_IMAGES;

  const saveImage = (key) => async (url) => {
    await saveSection("images", { ...images, [key]: url });
  };

  return (
    <div>
      <h2 className="font-display text-navy text-2xl mb-1">Site images</h2>
      <p className="text-charcoal-soft text-sm mb-6">
        Replace the photos and logo shown across the site. Uploads go live immediately.
      </p>
      <div className="space-y-8 max-w-lg">
        <ImageUploadField
          label="Hero Photo"
          hint="Shown at the top of the homepage."
          currentUrl={images.headshotUrl}
          fallbackSrc={headshotImg}
          storagePath="images/headshot"
          onUploaded={saveImage("headshotUrl")}
        />
        <ImageUploadField
          label="About Photo"
          hint="Shown in the homepage's About teaser and on the full About page."
          currentUrl={images.aboutUrl}
          fallbackSrc={headshotImg}
          storagePath="images/about"
          onUploaded={saveImage("aboutUrl")}
        />
        <ImageUploadField
          label="Logo"
          currentUrl={images.logoUrl}
          fallbackSrc={logoImg}
          storagePath="images/logo"
          onUploaded={saveImage("logoUrl")}
        />
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [section, setSection] = useState("hero");

  const sections = [
    { key: "hero", label: "Hero" },
    { key: "about", label: "About" },
    { key: "practice", label: "Practice Areas" },
    { key: "blog", label: "Blog Posts" },
    { key: "contact", label: "Contact Info" },
    { key: "images", label: "Images" },
  ];

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-navy text-2xl">Site content admin</h1>
        <div className="flex items-center gap-5">
          <Link to="/" className="text-link-gold text-sm">
            View live site
          </Link>
          <button onClick={() => signOut(auth)} className="text-sm text-charcoal-soft hover:text-gold">
            Log out
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-10">
        <nav className="sm:col-span-1 flex sm:flex-col gap-2 flex-wrap">
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setSection(s.key)}
              className="text-left px-3 py-2 text-sm"
              style={{
                backgroundColor: section === s.key ? "var(--navy)" : "transparent",
                color: section === s.key ? "var(--ivory)" : "var(--charcoal)",
              }}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <div className="sm:col-span-3">
          {section === "hero" && <HeroEditor />}
          {section === "about" && <AboutEditor />}
          {section === "practice" && <PracticeAreasEditor />}
          {section === "blog" && <BlogPostsEditor />}
          {section === "contact" && <ContactInfoEditor />}
          {section === "images" && <ImagesEditor />}
        </div>
      </div>
    </AdminShell>
  );
}

function Admin() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <AdminShell>
        <p className="text-charcoal-soft">Loading…</p>
      </AdminShell>
    );
  }

  return user ? <AdminDashboard /> : <AdminLogin />;
}

/* ---------------------------------------------------------------
   App
--------------------------------------------------------------- */

export default function LegalPortfolioSite() {
  return (
    <LanguageProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/practice-areas" element={<PracticeAreas />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/insights/:slug" element={<InsightDetail />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/consultation" element={<Consultation />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </LanguageProvider>
  );
}
