"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  ShieldCheck,
  Clock,
  Zap,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Camera,
  Upload,
  RefreshCw,
  X,
  ChevronRight,
  User,
  Wallet,
  Star,
  Filter,
  Heart,
  Lock,
  Key,
  Award,
  ArrowUpRight,
  Check,
  Info,
  Calendar,
  Layers,
  Settings,
  Eye,
  Sliders,
  Tag,
  ThumbsUp,
  CreditCard,
  MessageSquare,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";

// ==========================================
// TYPES & DATA STRUCTURES
// ==========================================
export interface RentalItem {
  id: string;
  title: string;
  category: "Hostel & Daily" | "DIY & Tools" | "Party & Media" | "Cameras" | "Gaming" | "Trekking & Sports";
  rentDaily: number;
  rentHourly?: number;
  deposit: number;
  retailValue: number;
  distanceMeters: number;
  distanceLabel: string;
  lenderName: string;
  lenderTrust: number; // e.g. 99 for 99%
  lenderAvatar?: string;
  aiConditionScore: number; // e.g. 9.6
  aiConditionNotes: string;
  image: string;
  isPopular?: boolean;
}

export interface ActiveRental {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  role: "borrower" | "lender";
  partnerName: string;
  rentTotal: number;
  depositLocked: number;
  otp: string;
  status: "Handover Pending" | "Active in Hand" | "Return Inspection" | "Completed";
  expiresIn: string;
}

// 8 Realistic Pre-Populated Indian Neighborhood/Campus Seed Items
const SEED_ITEMS: RentalItem[] = [
  {
    id: "item-1",
    title: "BenQ 1080p Portable Movie Projector",
    category: "Party & Media",
    rentDaily: 350,
    rentHourly: 60,
    deposit: 2000,
    retailValue: 18500,
    distanceMeters: 180,
    distanceLabel: "180m away",
    lenderName: "Aarav S.",
    lenderTrust: 99,
    aiConditionScore: 9.6,
    aiConditionNotes: "Lens verified scratch-free • 3500 ANSI lumens tested",
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
  },
  {
    id: "item-2",
    title: "Bosch Cordless Impact Drill + 40-Bit Kit",
    category: "DIY & Tools",
    rentDaily: 120,
    rentHourly: 30,
    deposit: 800,
    retailValue: 4800,
    distanceMeters: 320,
    distanceLabel: "320m away",
    lenderName: "Vikram M.",
    lenderTrust: 97,
    aiConditionScore: 9.2,
    aiConditionNotes: "Chuck & 18V dual batteries health tested • 0% motor play",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
  },
  {
    id: "item-3",
    title: "Philips Garment Steamer & Heavy Steam Iron",
    category: "Hostel & Daily",
    rentDaily: 49,
    rentHourly: 15,
    deposit: 300,
    retailValue: 2200,
    distanceMeters: 90,
    distanceLabel: "90m away (Hostel Block B)",
    lenderName: "Riya K.",
    lenderTrust: 100,
    aiConditionScore: 9.8,
    aiConditionNotes: "Soleplate clean • Zero calcification • Ready to steam",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
  },
  {
    id: "item-4",
    title: "Raymond Tailored Navy Blue Interview Blazer (Size 40/M)",
    category: "Hostel & Daily",
    rentDaily: 150,
    deposit: 700,
    retailValue: 6500,
    distanceMeters: 150,
    distanceLabel: "150m away",
    lenderName: "Kabir D.",
    lenderTrust: 98,
    aiConditionScore: 9.5,
    aiConditionNotes: "Dry-cleaned • Zero stains or fabric tears • Wrinkle-free",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "item-5",
    title: "Sony DualSense PS5 Wireless Controller (x2 Bundle)",
    category: "Gaming",
    rentDaily: 180,
    rentHourly: 40,
    deposit: 1200,
    retailValue: 11000,
    distanceMeters: 210,
    distanceLabel: "210m away",
    lenderName: "Rohan T.",
    lenderTrust: 96,
    aiConditionScore: 9.4,
    aiConditionNotes: "Zero analog stick drift • Haptic triggers calibrated",
    image: "https://images.unsplash.com/photo-1606318801954-d46846592d0b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "item-6",
    title: "GoPro Hero 12 Black + Chest Mount",
    category: "Cameras",
    rentDaily: 450,
    deposit: 2500,
    retailValue: 38000,
    distanceMeters: 600,
    distanceLabel: "600m away",
    lenderName: "Neha G.",
    lenderTrust: 99,
    aiConditionScore: 9.7,
    aiConditionNotes: "Waterproof seal intact • Lens protector clean • 2x Enduro batteries",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "item-7",
    title: "Quechua 60L Trekking Rucksack + Minus 5°C Sleeping Bag",
    category: "Trekking & Sports",
    rentDaily: 200,
    deposit: 1000,
    retailValue: 7500,
    distanceMeters: 450,
    distanceLabel: "450m away",
    lenderName: "Siddharth P.",
    lenderTrust: 95,
    aiConditionScore: 9.1,
    aiConditionNotes: "All buckles intact • Sanitized lining • Rain cover included",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "item-8",
    title: "JBL PartyBox 110 Portable Bluetooth Speaker",
    category: "Party & Media",
    rentDaily: 400,
    deposit: 2000,
    retailValue: 26000,
    distanceMeters: 290,
    distanceLabel: "290m away",
    lenderName: "Ananya V.",
    lenderTrust: 99,
    aiConditionScore: 9.5,
    aiConditionNotes: "Bass & dynamic LED ring verified • Battery holds 11+ hours",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
  },
];

export default function RentNearApp() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<"explore" | "concierge" | "snap" | "scanner" | "hub">("explore");
  
  // App state
  const [items, setItems] = useState<RentalItem[]>(SEED_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [radiusMeters, setRadiusMeters] = useState<number>(1000); // 1.0km default
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pricingMode, setPricingMode] = useState<"daily" | "hourly">("daily");

  // Gemini API Key State
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [tempApiKeyInput, setTempApiKeyInput] = useState<string>("");

  // Booking Modal State
  const [bookingItem, setBookingItem] = useState<RentalItem | null>(null);
  const [bookingDuration, setBookingDuration] = useState<number>(1);
  const [bookingConfirmed, setBookingConfirmed] = useState<boolean>(false);
  const [generatedOtp, setGeneratedOtp] = useState<string>("");

  // My Hub Active Rentals
  const [activeRentals, setActiveRentals] = useState<ActiveRental[]>([
    {
      id: "rental-101",
      itemId: "item-1",
      itemTitle: "BenQ 1080p Portable Movie Projector",
      itemImage: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80",
      role: "borrower",
      partnerName: "Aarav S. (Dwarka Sec 3)",
      rentTotal: 350,
      depositLocked: 2000,
      otp: "8492",
      status: "Active in Hand",
      expiresIn: "18h 40m remaining",
    },
  ]);
  const [escrowLockedBalance, setEscrowLockedBalance] = useState<number>(2000);

  // AI Concierge State
  const [conciergePrompt, setConciergePrompt] = useState<string>("");
  const [conciergeLoading, setConciergeLoading] = useState<boolean>(false);
  const [conciergeResult, setConciergeResult] = useState<{
    bundleTitle: string;
    description: string;
    bundledItems: RentalItem[];
    originalTotal: number;
    discountedTotal: number;
    savings: number;
  } | null>(null);

  // 1-Snap AI Listing Studio State
  const [snapImage, setSnapImage] = useState<string | null>(null);
  const [snapAnalyzing, setSnapAnalyzing] = useState<boolean>(false);
  const [snapResult, setSnapResult] = useState<{
    title: string;
    category: RentalItem["category"];
    estimatedRetail: number;
    suggestedDailyRent: number;
    suggestedHourlyRent: number;
    suggestedDeposit: number;
    conditionScore: number;
    conditionNotes: string;
    safetyTip: string;
  } | null>(null);

  // AI Scanner (Damage Verification) State
  const [scannerCheckinPhoto, setScannerCheckinPhoto] = useState<string | null>(null);
  const [scannerCheckoutPhoto, setScannerCheckoutPhoto] = useState<string | null>(null);
  const [scannerAnalyzing, setScannerAnalyzing] = useState<boolean>(false);
  const [scannerResult, setScannerResult] = useState<{
    status: "PASS_VERIFIED" | "DAMAGE_DETECTED";
    matchConfidence: number;
    verdictTitle: string;
    verdictExplanation: string;
    escrowRefundAmount: number;
    repairDeduction: number;
  } | null>(null);

  // Initialize API Key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("rentnear_gemini_api_key");
    if (saved) {
      setGeminiApiKey(saved);
      setTempApiKeyInput(saved);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem("rentnear_gemini_api_key", tempApiKeyInput.trim());
    setGeminiApiKey(tempApiKeyInput.trim());
    setShowSettingsModal(false);
  };

  // Filter items by category, radius, and search query
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesRadius = item.distanceMeters <= radiusMeters;
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aiConditionNotes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesRadius && matchesSearch;
  });

  // ==========================================
  // WORKFLOW 1: RENT BOOKING & ESCROW LOCK
  // ==========================================
  const handleOpenBooking = (item: RentalItem) => {
    setBookingItem(item);
    setBookingDuration(1);
    setBookingConfirmed(false);
    setGeneratedOtp(Math.floor(1000 + Math.random() * 9000).toString());
  };

  const handleConfirmRental = () => {
    if (!bookingItem) return;
    const rentCost = bookingItem.rentDaily * bookingDuration;
    const newRental: ActiveRental = {
      id: `rental-${Date.now()}`,
      itemId: bookingItem.id,
      itemTitle: bookingItem.title,
      itemImage: bookingItem.image,
      role: "borrower",
      partnerName: `${bookingItem.lenderName} (${bookingItem.distanceLabel})`,
      rentTotal: rentCost,
      depositLocked: bookingItem.deposit,
      otp: generatedOtp,
      status: "Handover Pending",
      expiresIn: `${bookingDuration * 24}h remaining`,
    };

    setActiveRentals((prev) => [newRental, ...prev]);
    setEscrowLockedBalance((prev) => prev + bookingItem.deposit);
    setBookingConfirmed(true);
  };

  // ==========================================
  // WORKFLOW 2: AI CONCIERGE (PROBLEM TO BUNDLE)
  // ==========================================
  const handleRunConcierge = async (situationQuery: string) => {
    setConciergePrompt(situationQuery);
    setConciergeLoading(true);
    setConciergeResult(null);

    // If API key is set, call Gemini. If not, use high-intelligence simulation
    if (geminiApiKey) {
      try {
        const prompt = `You are RentNear AI's hyper-local concierge. A user in a college campus/neighborhood says: "${situationQuery}".
Here is the available inventory JSON:
${JSON.stringify(items.map((i) => ({ id: i.id, title: i.title, category: i.category, rentDaily: i.rentDaily, deposit: i.deposit })))}

Pick 2 items that solve their problem, explain why, calculate a 10% bundle discount, and output STRICT JSON format:
{
  "bundleTitle": "Catchy Bundle Name",
  "description": "Short explanation of why these items solve the problem",
  "itemIds": ["id1", "id2"]
}`;
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);

        const matchedItems = items.filter((i) => parsed.itemIds?.includes(i.id));
        if (matchedItems.length > 0) {
          const original = matchedItems.reduce((acc, i) => acc + i.rentDaily, 0);
          const discounted = Math.round(original * 0.9);
          setConciergeResult({
            bundleTitle: parsed.bundleTitle || "AI Curated Solution Bundle",
            description: parsed.description || "Optimized items for your specific situation.",
            bundledItems: matchedItems,
            originalTotal: original,
            discountedTotal: discounted,
            savings: original - discounted,
          });
          setConciergeLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Gemini call failed, using smart fallback:", err);
      }
    }

    // Smart Fallback Simulation
    setTimeout(() => {
      let matchedIds: string[] = [];
      let title = "Neighborhood Solution Bundle";
      let desc = "Curated high-utility rental gear within 300m of you.";

      const q = situationQuery.toLowerCase();
      if (q.includes("interview") || q.includes("placement") || q.includes("sharp")) {
        matchedIds = ["item-4", "item-3"]; // Blazer + Steamer
        title = "👔 Placement Interview Ready Bundle";
        desc = "Tailored Raymond blazer (Size 40/M) paired with Philips garment steamer to ensure you walk in crisp and crease-free.";
      } else if (q.includes("party") || q.includes("match") || q.includes("terrace") || q.includes("watch")) {
        matchedIds = ["item-1", "item-8"]; // Projector + PartyBox
        title = "🎉 Ultimate Terrace Watch Party Kit";
        desc = "1080p BenQ Portable Cinema Projector with 160W JBL PartyBox 110 for stadium-grade sound and screen.";
      } else if (q.includes("bookshelf") || q.includes("curtains") || q.includes("fix") || q.includes("tool")) {
        matchedIds = ["item-2"]; // Drill + tools
        title = "🛠️ Home Repair & Mounting Essentials";
        desc = "Bosch 18V Cordless Impact Drill with complete masonry and wood bit kit for clean drywall and curtain rod mounting.";
      } else {
        matchedIds = ["item-1", "item-5"];
        title = "🎮 Weekend Entertainment Setup";
        desc = "Big-screen projector paired with dual PS5 controllers for multiplayer gaming.";
      }

      const matched = items.filter((i) => matchedIds.includes(i.id));
      const original = matched.reduce((acc, i) => acc + i.rentDaily, 0);
      const discounted = Math.round(original * 0.9);

      setConciergeResult({
        bundleTitle: title,
        description: desc,
        bundledItems: matched,
        originalTotal: original,
        discountedTotal: discounted,
        savings: original - discounted,
      });
      setConciergeLoading(false);
    }, 1200);
  };

  // ==========================================
  // WORKFLOW 3: 1-SNAP AI LISTING STUDIO
  // ==========================================
  const handleSelectDemoPhoto = (photoUrl: string, samplePreset: any) => {
    setSnapImage(photoUrl);
    setSnapAnalyzing(true);
    setSnapResult(null);

    setTimeout(() => {
      setSnapResult(samplePreset);
      setSnapAnalyzing(false);
    }, 1500);
  };

  const handlePublishNewItem = () => {
    if (!snapResult || !snapImage) return;

    const newItem: RentalItem = {
      id: `item-${Date.now()}`,
      title: snapResult.title,
      category: snapResult.category,
      rentDaily: snapResult.suggestedDailyRent,
      rentHourly: snapResult.suggestedHourlyRent,
      deposit: snapResult.suggestedDeposit,
      retailValue: snapResult.estimatedRetail,
      distanceMeters: 60,
      distanceLabel: "60m away (Your Flat)",
      lenderName: "You (⭐ 100% Verified)",
      lenderTrust: 100,
      aiConditionScore: snapResult.conditionScore,
      aiConditionNotes: snapResult.conditionNotes,
      image: snapImage,
      isPopular: true,
    };

    setItems((prev) => [newItem, ...prev]);
    setSnapImage(null);
    setSnapResult(null);
    setCurrentTab("explore");
  };

  // ==========================================
  // WORKFLOW 4: AI DAMAGE VERIFICATION SCANNER
  // ==========================================
  const handleRunDamageScan = (scenario: "clean" | "damage") => {
    setScannerAnalyzing(true);
    setScannerResult(null);

    if (scenario === "clean") {
      setScannerCheckinPhoto("https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80");
      setScannerCheckoutPhoto("https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&q=80");
    } else {
      setScannerCheckinPhoto("https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80");
      setScannerCheckoutPhoto("https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80");
    }

    setTimeout(() => {
      if (scenario === "clean") {
        setScannerResult({
          status: "PASS_VERIFIED",
          matchConfidence: 99.4,
          verdictTitle: "Zero Wear or Damage Detected",
          verdictExplanation: "Multimodal pixel matching verified zero scratches on optical glass lens, intact casing seals, and matching serial stamps.",
          escrowRefundAmount: 2000,
          repairDeduction: 0,
        });
      } else {
        setScannerResult({
          status: "DAMAGE_DETECTED",
          matchConfidence: 96.8,
          verdictTitle: "Impact Scuff Detected on Chuck Casing",
          verdictExplanation: "Comparison identified a 2.4cm deep hairline scratch and chuck abrasion not present in the Check-In baseline photo.",
          escrowRefundAmount: 550,
          repairDeduction: 250,
        });
      }
      setScannerAnalyzing(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-24 md:pb-8 selection:bg-emerald-500 selection:text-white">
      {/* ========================================== */}
      {/* 1. TOP HEADER / APP BAR                     */}
      {/* ========================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 md:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab("explore")}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  RentNear<span className="text-emerald-600 font-black">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/80">
                  Buildathon 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Hyper-Local P2P Daily Utility Rentals</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentTab("explore")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentTab === "explore" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Explore Feed
            </button>
            <button
              onClick={() => setCurrentTab("concierge")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                currentTab === "concierge" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Concierge</span>
            </button>
            <button
              onClick={() => setCurrentTab("snap")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                currentTab === "snap" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-emerald-600"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Snap & Lend</span>
            </button>
            <button
              onClick={() => setCurrentTab("scanner")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                currentTab === "scanner" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Damage Scanner</span>
            </button>
            <button
              onClick={() => setCurrentTab("hub")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                currentTab === "hub" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>My Hub ({activeRentals.length})</span>
            </button>
          </nav>

          {/* Right Header Controls (API Key Badge & Wallet) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowSettingsModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                geminiApiKey
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm"
                  : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {geminiApiKey ? "⚡ Gemini 2.5 Flash Active" : "⚡ Demo Simulation Mode"}
              </span>
              <Settings className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => setCurrentTab("hub")}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>₹{escrowLockedBalance} Escrow</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* VIEW 1: HOME / HYPER-LOCAL EXPLORE FEED   */}
      {/* ========================================== */}
      {currentTab === "explore" && (
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 pt-5 flex flex-col gap-5">
          {/* Hero AI Search Bar + Neighborhood Radius */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-950/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Borrow Anything in 15 Minutes • Zero Ownership Burden
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                Don't Buy What You Only Need For A Day.
              </h2>
              <p className="text-xs md:text-sm text-emerald-100 mt-1 mb-5">
                Projectors, drill machines, interview suits, and cameras available within 500m of your door.
              </p>

              {/* Natural Language Prompt Search Bar */}
              <div className="bg-white rounded-2xl p-2 shadow-2xl flex items-center gap-2">
                <Search className="w-5 h-5 text-slate-400 ml-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gear or say: 'need projector for watch party'..."
                  className="w-full text-slate-800 placeholder-slate-400 text-xs md:text-sm bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (searchQuery.length > 3) {
                      handleRunConcierge(searchQuery);
                      setCurrentTab("concierge");
                    } else {
                      setCurrentTab("concierge");
                    }
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask AI Concierge</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Neighborhood Radius & Location Filter */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="leading-tight">Dwarka Sector 3 / University Campus</p>
                <p className="text-[11px] text-slate-400 font-normal">Active Hyper-Local Node #ND-42</p>
              </div>
            </div>

            {/* Radius Slider */}
            <div className="w-full sm:w-72 flex items-center gap-3">
              <span className="text-xs text-slate-500 whitespace-nowrap font-medium">Radius:</span>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md whitespace-nowrap border border-emerald-200">
                {(radiusMeters / 1000).toFixed(1)} km
              </span>
            </div>

            {/* Pricing Toggle: Daily vs Hourly */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto border border-slate-200">
              <button
                onClick={() => setPricingMode("daily")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  pricingMode === "daily" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                }`}
              >
                Per Day
              </button>
              <button
                onClick={() => setPricingMode("hourly")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  pricingMode === "hourly" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
                }`}
              >
                Per Hour
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              "All",
              "Hostel & Daily",
              "DIY & Tools",
              "Party & Media",
              "Cameras",
              "Gaming",
              "Trekking & Sports",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {cat === "All" ? "🔥 All Nearby" : cat}
              </button>
            ))}
          </div>

          {/* Product Feed Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredItems.map((item) => {
              const priceDisplay =
                pricingMode === "hourly" && item.rentHourly
                  ? `₹${item.rentHourly}/hr`
                  : `₹${item.rentDaily}/day`;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group hover:border-emerald-300"
                >
                  {/* Image Container with Badges */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Distance Pill */}
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-800 shadow-sm flex items-center gap-1 border border-slate-200/80">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{item.distanceLabel}</span>
                    </div>

                    {/* AI Condition Score Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-indigo-600 text-white px-2 py-0.5 rounded-lg text-[10px] font-extrabold shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                      <span>{item.aiConditionScore}/10</span>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md text-[9px] font-medium tracking-wide">
                      {item.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition">
                        {item.title}
                      </h3>

                      {/* AI Verified Condition Note */}
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{item.aiConditionNotes}</span>
                      </p>

                      {/* Lender Info & Trust Score */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">{item.lenderName}</span>
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          ⭐ {item.lenderTrust}% Trust
                        </span>
                      </div>
                    </div>

                    {/* Price, Refundable Deposit & Rent CTA */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-base font-extrabold text-slate-900">{priceDisplay}</div>
                        <div className="text-[10px] text-slate-400 font-medium">
                          Deposit: ₹{item.deposit} <span className="text-emerald-600">(Refundable)</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenBooking(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1 active:scale-95"
                      >
                        <span>Rent Now</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 2: "AI CONCIERGE" (BUNDLE FINDER)     */}
      {/* ========================================== */}
      {currentTab === "concierge" && (
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 pt-6 flex flex-col gap-6">
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Autonomous Bundle Problem Solver
              </span>
              <h2 className="text-2xl font-extrabold tracking-tight">AI Rental Concierge</h2>
              <p className="text-xs md:text-sm text-indigo-200 mt-1">
                Tell the AI your exact situation or task. It searches your 1km neighborhood radius and bundles the right gear with a <strong>10% instant discount</strong>.
              </p>
            </div>
          </div>

          {/* Quick Situation Prompts */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Try Preset Situations (Click to Test):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <button
                onClick={() =>
                  handleRunConcierge("I have a placement interview tomorrow morning and need to look sharp.")
                }
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition flex flex-col justify-between"
              >
                <span className="font-bold text-slate-900 mb-1">👔 Placement Interview</span>
                <span className="text-[11px] text-slate-500">
                  "I have a placement interview tomorrow morning and need to look sharp."
                </span>
              </button>

              <button
                onClick={() =>
                  handleRunConcierge("Hosting a champion's league watch party on my terrace tonight.")
                }
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition flex flex-col justify-between"
              >
                <span className="font-bold text-slate-900 mb-1">🎉 Terrace Match Screening</span>
                <span className="text-[11px] text-slate-500">
                  "Hosting a champion's league watch party on my terrace tonight."
                </span>
              </button>

              <button
                onClick={() =>
                  handleRunConcierge("Need to fix a loose bookshelf and hang curtains in my flat.")
                }
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs text-slate-700 transition flex flex-col justify-between"
              >
                <span className="font-bold text-slate-900 mb-1">🛠️ Flat DIY & Curtain Mounting</span>
                <span className="text-[11px] text-slate-500">
                  "Need to fix a loose bookshelf and hang curtains in my flat."
                </span>
              </button>
            </div>

            {/* Custom Input */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={conciergePrompt}
                onChange={(e) => setConciergePrompt(e.target.value)}
                placeholder="Or type anything: 'Going on a 2-day weekend trek in Himachal'..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleRunConcierge(conciergePrompt)}
                disabled={conciergeLoading || !conciergePrompt}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0"
              >
                {conciergeLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Gear...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Find Bundle</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Recommended Bundle Result */}
          {conciergeResult && (
            <div className="bg-white rounded-3xl border border-indigo-200 p-6 shadow-xl animate-fadeIn flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    Gemini Solution Match
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">{conciergeResult.bundleTitle}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{conciergeResult.description}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 line-through">₹{conciergeResult.originalTotal}/day</div>
                  <div className="text-xl font-extrabold text-emerald-600">
                    ₹{conciergeResult.discountedTotal}/day
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Save ₹{conciergeResult.savings} (10% Bundle Off)
                  </span>
                </div>
              </div>

              {/* Bundled Items Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {conciergeResult.bundledItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200"
                  >
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        {item.distanceLabel} • Lender: {item.lenderName}
                      </p>
                      <div className="text-xs font-bold text-emerald-600 mt-1">₹{item.rentDaily}/day</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 1-Click Bundle Booking Action */}
              <button
                onClick={() => {
                  const bundleItem: RentalItem = {
                    id: `bundle-${Date.now()}`,
                    title: conciergeResult.bundleTitle,
                    category: "Hostel & Daily",
                    rentDaily: conciergeResult.discountedTotal,
                    deposit: conciergeResult.bundledItems.reduce((acc, i) => acc + i.deposit, 0),
                    retailValue: conciergeResult.bundledItems.reduce((acc, i) => acc + i.retailValue, 0),
                    distanceMeters: 150,
                    distanceLabel: "Within 250m",
                    lenderName: "Neighborhood Bundle Host",
                    lenderTrust: 99,
                    aiConditionScore: 9.7,
                    aiConditionNotes: "Pre-verified paired bundle",
                    image: conciergeResult.bundledItems[0]?.image || "",
                  };
                  handleOpenBooking(bundleItem);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs md:text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-yellow-300" />
                <span>Rent This Entire Bundle (1-Click Escrow Lock)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 3: "1-SNAP AI LISTING STUDIO" (LEND)  */}
      {/* ========================================== */}
      {currentTab === "snap" && (
        <div className="max-w-3xl mx-auto w-full px-4 md:px-8 pt-6 flex flex-col gap-6">
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl p-6 md:p-8 shadow-xl">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Camera className="w-3.5 h-3.5 text-yellow-300" />
              Lender Flow Powered by Gemini Vision
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">1-Snap AI Listing Studio</h2>
            <p className="text-xs md:text-sm text-emerald-100 mt-1">
              Snap a single photo of any idle product in your room. Gemini Vision identifies the model, rates its physical condition, and suggests optimal hourly & daily rental pricing.
            </p>
          </div>

          {/* Upload / Demo Photos Selection */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Select A Sample Product Photo To Test:</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Demo Sample 1 */}
              <button
                onClick={() =>
                  handleSelectDemoPhoto(
                    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=80",
                    {
                      title: "Havells Aqua Plus 1.5L Stainless Steel Kettle",
                      category: "Hostel & Daily",
                      estimatedRetail: 1899,
                      suggestedDailyRent: 35,
                      suggestedHourlyRent: 10,
                      suggestedDeposit: 300,
                      conditionScore: 9.6,
                      conditionNotes: "Stainless steel interior spotless • Heating base intact • Auto-cut verified",
                      safetyTip: "Inspect cord before handover; remind borrower not to immerse base in water.",
                    }
                  )
                }
                className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 rounded-2xl text-left transition flex items-center gap-3"
              >
                <img
                  src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=200&q=80"
                  alt="Electric Kettle"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Electric Kettle</p>
                  <p className="text-[10px] text-slate-500">Hostel & Daily</p>
                </div>
              </button>

              {/* Demo Sample 2 */}
              <button
                onClick={() =>
                  handleSelectDemoPhoto(
                    "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=500&q=80",
                    {
                      title: "Yonex Nanoray Carbon Badminton Pair + 3 Shuttles",
                      category: "Trekking & Sports",
                      estimatedRetail: 3200,
                      suggestedDailyRent: 80,
                      suggestedHourlyRent: 20,
                      suggestedDeposit: 400,
                      conditionScore: 9.3,
                      conditionNotes: "Grip freshly wrapped • 24 lbs string tension intact • Zero frame warps",
                      safetyTip: "Remind borrower to use non-marking shoes on indoor badminton court.",
                    }
                  )
                }
                className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 rounded-2xl text-left transition flex items-center gap-3"
              >
                <img
                  src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=200&q=80"
                  alt="Badminton Set"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">Badminton Set</p>
                  <p className="text-[10px] text-slate-500">Sports & Fitness</p>
                </div>
              </button>

              {/* Demo Sample 3 */}
              <button
                onClick={() =>
                  handleSelectDemoPhoto(
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=500&q=80",
                    {
                      title: "Neewer 18-inch Dimmable LED Ring Light + 6ft Tripod",
                      category: "Party & Media",
                      estimatedRetail: 4200,
                      suggestedDailyRent: 150,
                      suggestedHourlyRent: 35,
                      suggestedDeposit: 800,
                      conditionScore: 9.5,
                      conditionNotes: "All 240 LED diodes operational • Bi-color dimmer smooth • Phone mount sturdy",
                      safetyTip: "Pack tripod legs fully collapsed in protective canvas sleeve.",
                    }
                  )
                }
                className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-400 rounded-2xl text-left transition flex items-center gap-3"
              >
                <img
                  src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=200&q=80"
                  alt="Ring Light"
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">LED Ring Light</p>
                  <p className="text-[10px] text-slate-500">Content / Media</p>
                </div>
              </button>
            </div>

            {/* Custom Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition cursor-pointer bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Drag & Drop or Choose an Image from your Device</p>
              <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB • Evaluated via Gemini Vision</p>
            </div>
          </div>

          {/* Analyzing State */}
          {snapAnalyzing && (
            <div className="bg-white rounded-3xl p-8 border border-indigo-200 shadow-lg text-center flex flex-col items-center justify-center animate-pulse">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Gemini 2.5 Flash Vision Auditing Photo...</h3>
              <p className="text-xs text-slate-500 mt-1">
                Detecting model number, inspecting scratches, computing fair neighborhood rental pricing.
              </p>
            </div>
          )}

          {/* Generated AI Listing Result */}
          {snapResult && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-300 shadow-xl flex flex-col gap-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    AI Listing Ready For Review
                  </span>
                </div>
                <span className="text-xs font-extrabold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  AI Condition Score: {snapResult.conditionScore}/10
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <img
                  src={snapImage || ""}
                  alt="Uploaded Product"
                  className="w-full h-44 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />

                <div className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{snapResult.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">Category: {snapResult.category}</p>

                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <span className="font-bold text-slate-700 block mb-0.5">Gemini Vision Condition Audit:</span>
                      <p className="text-slate-600">{snapResult.conditionNotes}</p>
                    </div>

                    <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <strong>Packaging Tip:</strong> {snapResult.safetyTip}
                    </div>
                  </div>

                  {/* Pricing Overview */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-medium">Suggested Daily</span>
                      <p className="text-sm font-extrabold text-emerald-600">₹{snapResult.suggestedDailyRent}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-medium">Hourly Rent</span>
                      <p className="text-sm font-extrabold text-slate-800">₹{snapResult.suggestedHourlyRent}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-400 font-medium">Escrow Deposit</span>
                      <p className="text-sm font-extrabold text-indigo-600">₹{snapResult.suggestedDeposit}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publish Button */}
              <button
                onClick={handlePublishNewItem}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs md:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Publish to Neighborhood Feed (Instant Live)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 4: "AI SCANNER" (DAMAGE VERIFICATION) */}
      {/* ========================================== */}
      {currentTab === "scanner" && (
        <div className="max-w-3xl mx-auto w-full px-4 md:px-8 pt-6 flex flex-col gap-6">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Automated P2P Trust Protocol
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight">AI Return & Damage Scanner</h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1">
              Solves the #1 fear in peer-to-peer rentals: <em>"What if the borrower breaks my gear?"</em>. Gemini Vision compares the Handover Check-In photo against the Return Check-Out photo to instantly authorize escrow release.
            </p>
          </div>

          {/* Test Scenarios Selector */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Select A Demonstration Return Scenario:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleRunDamageScan("clean")}
                className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 text-left transition flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Scenario A: Pristine Return</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    BenQ Projector returned in original condition. 100% of ₹2,000 escrow unlocked.
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleRunDamageScan("damage")}
                className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 text-left transition flex items-start gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Scenario B: Abrasion / Chipped Return</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Bosch Drill returned with deep chuck scratches. Escrow docks ₹250 repair claim.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Visual Comparison Splitter */}
          {(scannerCheckinPhoto || scannerAnalyzing) && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col gap-5">
              <h3 className="text-sm font-bold text-slate-900">Computer Vision Pixel Comparison</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo 1: Check-in baseline */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    1. Check-In Baseline Photo (Handover)
                  </span>
                  <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={scannerCheckinPhoto || ""} alt="Check-in" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Timestamp: 10:14 AM
                    </span>
                  </div>
                </div>

                {/* Photo 2: Check-out return */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    2. Check-Out Return Photo (Return)
                  </span>
                  <div className="relative h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={scannerCheckoutPhoto || ""} alt="Check-out" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Timestamp: 06:42 PM
                    </span>
                  </div>
                </div>
              </div>

              {/* Analysis Loading */}
              {scannerAnalyzing && (
                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-center animate-pulse flex items-center justify-center gap-2 text-indigo-700 text-xs font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini Vision comparing spatial features and surface integrity...</span>
                </div>
              )}

              {/* Scanner Result Card */}
              {scannerResult && (
                <div
                  className={`p-5 rounded-2xl border ${
                    scannerResult.status === "PASS_VERIFIED"
                      ? "bg-emerald-50/70 border-emerald-300"
                      : "bg-rose-50/70 border-rose-300"
                  } animate-fadeIn flex flex-col gap-3`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {scannerResult.status === "PASS_VERIFIED" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      )}
                      <h4 className="font-extrabold text-sm text-slate-900">{scannerResult.verdictTitle}</h4>
                    </div>
                    <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded-full border border-slate-200 font-bold">
                      Confidence: {scannerResult.matchConfidence}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{scannerResult.verdictExplanation}</p>

                  {/* Financial Escrow Verdict */}
                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <div>
                      <span className="text-slate-500">Refund to Borrower: </span>
                      <strong className="text-emerald-700">₹{scannerResult.escrowRefundAmount}</strong>
                    </div>

                    {scannerResult.repairDeduction > 0 && (
                      <div>
                        <span className="text-slate-500">Deduction to Lender Escrow: </span>
                        <strong className="text-rose-600">₹{scannerResult.repairDeduction}</strong>
                      </div>
                    )}

                    <button
                      onClick={() => alert("Smart Escrow Disbursed via UPI Autopay!")}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      Disburse Escrow Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* VIEW 5: "MY HUB" (ACTIVE ESCROW & PROFILE) */}
      {/* ========================================== */}
      {currentTab === "hub" && (
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 pt-6 flex flex-col gap-6">
          {/* User Trust & Escrow Header */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-extrabold text-lg">
                  KV
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-extrabold text-lg text-slate-900">Krrish Vimal</h2>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-slate-500">Dwarka Sec 3 Node • 14 Rentals Completed • 0 Claims</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                    ⭐ 99.8% Trust Score
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                    DigiLocker Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Escrow Wallet Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-md min-w-[200px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> Escrow Balance
              </span>
              <p className="text-xl font-extrabold text-emerald-400 mt-1">₹{escrowLockedBalance}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Automated UPI Release on Safe Return</p>
            </div>
          </div>

          {/* Active Rentals List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Active Rentals in Hand ({activeRentals.length})</span>
            </h3>

            {activeRentals.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No active rentals right now.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {activeRentals.map((rental) => (
                  <div
                    key={rental.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 transition bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={rental.itemImage} alt={rental.itemTitle} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{rental.itemTitle}</h4>
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {rental.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{rental.partnerName}</p>
                        <p className="text-[11px] text-indigo-600 font-semibold mt-1">⏳ {rental.expiresIn}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-center">
                        <span className="text-[9px] text-slate-400 block font-medium">HANDOVER OTP</span>
                        <span className="font-mono font-extrabold text-sm text-slate-900">{rental.otp}</span>
                      </div>

                      <button
                        onClick={() => setCurrentTab("scanner")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition flex items-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Return & Verify</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* BOOKING MODAL (ESCROW BREAKDOWN & CONFIRM) */}
      {/* ========================================== */}
      {bookingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 relative">
            <button
              onClick={() => setBookingItem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmed ? (
              <>
                <div className="flex items-center gap-3">
                  <img
                    src={bookingItem.image}
                    alt={bookingItem.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                      Instant P2P Rental
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight">{bookingItem.title}</h3>
                    <p className="text-xs text-slate-500">{bookingItem.distanceLabel}</p>
                  </div>
                </div>

                {/* Duration Slider / Counter */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Rental Duration:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBookingDuration(Math.max(1, bookingDuration - 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-700 flex items-center justify-center hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-900 px-2">{bookingDuration} Day(s)</span>
                    <button
                      onClick={() => setBookingDuration(bookingDuration + 1)}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-700 flex items-center justify-center hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Smart Escrow Breakdown */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col gap-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Daily Rent (₹{bookingItem.rentDaily} × {bookingDuration}d)
                    </span>
                    <span className="font-bold text-slate-900">₹{bookingItem.rentDaily * bookingDuration}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Refundable Escrow Deposit</span>
                    <span className="font-bold text-indigo-600">₹{bookingItem.deposit}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Platform Trust Fee (Buildathon Demo)</span>
                    <span>₹0 (Waived)</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-extrabold text-sm text-slate-900">
                    <span>Total Authorized Amount</span>
                    <span>₹{bookingItem.rentDaily * bookingDuration + bookingItem.deposit}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Your ₹{bookingItem.deposit} deposit is held in a protected Smart Escrow lock. It is returned via instant UPI Autopay the second you return the item undamaged.
                  </span>
                </div>

                <button
                  onClick={handleConfirmRental}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Confirm Booking & Authorize Escrow</span>
                </button>
              </>
            ) : (
              <div className="text-center py-4 flex flex-col items-center animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">Rental Authorized!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Your escrow deposit is secured. Share this 4-digit code with <strong>{bookingItem.lenderName}</strong> during physical handover:
                </p>

                <div className="my-4 bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-mono text-2xl font-extrabold tracking-widest">
                  {generatedOtp}
                </div>

                <p className="text-[11px] text-slate-400">Item is ready for pickup at {bookingItem.distanceLabel}.</p>

                <button
                  onClick={() => {
                    setBookingItem(null);
                    setCurrentTab("hub");
                  }}
                  className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  Go to My Hub & Track Rental
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* GEMINI API SETTINGS MODAL                  */}
      {/* ========================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-4 relative">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-extrabold text-base text-slate-900">Google Gemini API Configuration</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              RentNear AI is powered by <strong>Gemini 2.5 Flash</strong> for multimodal visual condition inspection and problem-to-bundle concierge reasoning.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Paste Google AI Studio API Key:
              </label>
              <input
                type="password"
                value={tempApiKeyInput}
                onChange={(e) => setTempApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <span className="text-[10px] text-slate-400">
                Key is stored safely in your browser's <code className="bg-slate-100 px-1 rounded">localStorage</code>.
              </span>
            </div>

            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-[11px] text-indigo-800">
              💡 <strong>Demo Fallback Notice:</strong> If you don't enter an API key, the app automatically runs in intelligent simulation mode so your presentation never stalls!
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleSaveApiKey}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
              >
                Save & Activate Key
              </button>
              {geminiApiKey && (
                <button
                  onClick={() => {
                    localStorage.removeItem("rentnear_gemini_api_key");
                    setGeminiApiKey("");
                    setTempApiKeyInput("");
                    setShowSettingsModal(false);
                  }}
                  className="px-4 py-2.5 border border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MOBILE BOTTOM NAVIGATION DOCK (5 TABS)     */}
      {/* ========================================== */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setCurrentTab("explore")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
            currentTab === "explore" ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setCurrentTab("concierge")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
            currentTab === "concierge" ? "text-indigo-600" : "text-slate-400"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Concierge</span>
        </button>

        {/* Floating Center Snap CTA */}
        <button
          onClick={() => setCurrentTab("snap")}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-lg -translate-y-4 border-2 border-white active:scale-95 transition"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentTab("scanner")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
            currentTab === "scanner" ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Scanner</span>
        </button>

        <button
          onClick={() => setCurrentTab("hub")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition ${
            currentTab === "hub" ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span>My Hub</span>
        </button>
      </nav>
    </div>
  );
}
