// src/app/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Zap, 
  Lock, 
  ArrowRight, 
  CreditCard, 
  Globe2, 
  TrendingUp,
  ChevronDown,
  Star,
  Quote,
  Briefcase,
  Building2,
  Calendar,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const productsAndServices = [
    {
      icon: <CreditCard className="h-6 w-6 text-blue-400" />,
      title: "Personal Checking & Savings",
      description: "Digital banking account with zero hidden fees, instant fund settlement, and smart balance analytics."
    },
    {
      icon: <Building2 className="h-6 w-6 text-indigo-400" />,
      title: "Corporate Banking",
      description: "Automated bulk payroll processing, sub-accounts, and merchant payment integration for enterprises."
    },
    {
      icon: <Briefcase className="h-6 w-6 text-purple-400" />,
      title: "Wealth & Investment",
      description: "Attractive annual yield on fixed savings deposits with automated recurring interest transfers."
    }
  ];

  const newsAndEvents = [
    {
      tag: "Feature Release",
      date: "September 01, 2026",
      title: "ApexBank Launches Next-Gen Instant Transfer Engine",
      description: "Our upgraded sub-second ledger processing engine now enables faster atomic transaction verification."
    },
    {
      tag: "Security Upgrade",
      date: "August 28, 2026",
      title: "Enhanced 256-Bit Cryptographic Security Standard",
      description: "Server architecture reinforced with end-to-end tokenization and hardware-level database isolation."
    },
    {
      tag: "Industry Event",
      date: "August 15, 2026",
      title: "Global FinTech Innovation Summit 2026",
      description: "ApexBank to host Asia's premier fintech developer conference on secure digital ledger technologies."
    }
  ];

  const faqs = [
    {
      question: "Is opening an account at ApexBank completely free?",
      answer: "Yes, you can register for a full digital account in less than two minutes without any opening or maintenance fees."
    },
    {
      question: "Are fund transfers processed in real time?",
      answer: "Yes. Using atomic database transactions, all money transfers are credited and debited instantly across accounts."
    },
    {
      question: "How is my account security protected?",
      answer: "We utilize enterprise-grade 256-bit encryption, JWT-based auth tokens, and isolated PostgreSQL database pools."
    },
    {
      question: "Can I view full transaction ledgers?",
      answer: "Yes, your personal dashboard provides transparent real-time debit and credit transaction histories with timestamps."
    }
  ];

  const testimonials = [
    {
      name: "Marcus Vance",
      role: "Lead Software Architect",
      content: "ApexBank's instant settlement speed is unbelievable. The dashboard UI is clean, intuitive, and extremely fast.",
      rating: 5,
      avatar: "MV"
    },
    {
      name: "Sarah Jenkins",
      role: "E-Commerce Founder",
      content: "Managing business payables with real-time ledger updates has transformed our operations. Enterprise-level security at its finest.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "David Chen",
      role: "Financial Analyst",
      content: "From registration to instant peer transfers, everything feels effortless. Easily the best digital banking experience.",
      rating: 5,
      avatar: "DC"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Next-Gen Banking Platform</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Smart & Secure <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Digital Banking
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Experience seamless fund transfers, real-time tracking, and enterprise-grade security powered by modern technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/auth?mode=signup"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl text-center transition-colors"
              >
                Explore Features
              </a>
            </div>

            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white">99.9%</h3>
                <p className="text-xs text-slate-400 mt-1">Uptime Guaranteed</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Instant</h3>
                <p className="text-xs text-slate-400 mt-1">Fund Settlement</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">256-Bit</h3>
                <p className="text-xs text-slate-400 mt-1">Data Encryption</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-400">Digital Banking Pass</span>
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
              <div className="py-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest">Available Balance</p>
                <p className="text-4xl font-extrabold text-white mt-1">$ 248,500.00</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Transfer Received</p>
                    <p className="text-xs text-slate-500">From Account #925296</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-400">+$ 50,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Services */}
      <section id="services" className="py-24 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Products & Services</h2>
            <p className="text-slate-400">Comprehensive financial solutions tailored for individuals and institutions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productsAndServices.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all space-y-4 group">
                <div className="p-3 bg-slate-800/80 w-fit rounded-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Designed for Modern Banking</h2>
            <p className="text-slate-400">Everything you need to send, receive, and manage your assets securely.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-4 hover:border-blue-500/50 transition-colors">
              <div className="p-3 bg-blue-500/10 w-fit rounded-xl text-blue-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Instant Transfers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Execute transfers instantly with atomic database precision and guaranteed balance consistency.
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-4 hover:border-blue-500/50 transition-colors">
              <div className="p-3 bg-indigo-500/10 w-fit rounded-xl text-indigo-400">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">JWT Authorization</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Bank-level session isolation ensuring every request is encrypted and cryptographically signed.
              </p>
            </div>

            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-4 hover:border-blue-500/50 transition-colors">
              <div className="p-3 bg-purple-500/10 w-fit rounded-xl text-purple-400">
                <Globe2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Transparent Ledger</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track full debit and credit statement histories complete with accurate server timestamps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* News & Events */}
      <section id="news" className="py-24 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">News & Events</h2>
            <p className="text-slate-400">Stay updated with our latest releases, security updates, and global events.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsAndEvents.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full font-semibold">
                      {item.tag}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <Link href="/auth?mode=signup" className="inline-flex items-center space-x-2 text-sm text-blue-400 font-semibold hover:text-blue-300 transition-colors pt-2">
                  <span>Read full story</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Customer Reviews</h2>
            <p className="text-slate-400">Trusted by thousands of individual users and digital businesses globally.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div 
                key={index} 
                className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all relative overflow-hidden"
              >
                <Quote className="absolute top-4 right-4 h-12 w-12 text-slate-800/40 pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="flex space-x-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{item.content}"
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4 border-t border-slate-800/60 relative z-10">
                  <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400">Find quick answers to common questions about ApexBank.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left font-semibold text-white flex justify-between items-center hover:text-blue-400 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>
                
                {openFaq === index && (
                  <div className="px-6 pb-5 text-sm text-slate-400 border-t border-slate-800/60 pt-4 leading-relaxed bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold text-slate-300">ApexBank System © 2026</span>
          </div>
          <p className="text-xs text-slate-500">Built with Go, PostgreSQL, Next.js & Tailwind CSS.</p>
        </div>
      </footer>

    </div>
  );
}