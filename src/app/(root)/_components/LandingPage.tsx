"use client";

import React from "react";
import { 
  Zap, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin, 
  Terminal,
  Command,
  Box,
  Layers,
  MessageSquare,
  Code2
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020408] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Background Accents (Auras) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020408]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />
            <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-display">Codify</span>
          </Link>

          <Link 
            href="/editor" 
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full hover:from-blue-400 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 hover:translate-y-[-2px]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-6 lg:pt-40">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Piston Sandbox Engine 2.0</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tighter leading-[1.1] font-display"
            >
              The Last IDE You'll <br />
              <span className="bg-gradient-to-r from-white via-blue-400 to-purple-500 text-transparent bg-clip-text">Ever Need</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Experience unparalleled speed and limitless extensibility. Built for the modern developer who demands elite performance without compromise.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                href="/editor" 
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/docs" 
                className="text-base font-bold flex items-center gap-2 group text-slate-300 hover:text-blue-400 transition-colors py-4 px-6"
              >
                Read Documentation 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* 3D Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-24 max-w-6xl mx-auto px-4 group"
            >
              <div className="relative p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 [transform:perspective(1000px)_rotateX(2deg)_rotateY(-1deg)] hover:[transform:perspective(1000px)_rotateX(0deg)_rotateY(0deg)]">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none" />
                <img 
                   src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2670&auto=format&fit=crop" 
                   alt="IDE Preview"
                   className="rounded-xl border border-white/10 w-full object-cover h-[400px] md:h-[600px] opacity-90"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-slate-900/30 border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">Engineered for Excellence</h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">Everything you need to build world-class software, refined for high-performance teams.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                { icon: Zap, title: "Ultra-Fast Performance", desc: "Instant startup and zero-lag typing experience. Optimized for minimal memory footprint." },
                { icon: Command, title: "Built-in Debugger", desc: "Advanced breakpoints, call stack inspection, and real-time variable watching." },
                { icon: Layers, title: "Extension Ecosystem", desc: "Access thousands of community-built plugins or build your own with our robust API." }
              ].map((f, i) => (
                <div key={i} className="group p-10 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-blue-500/40 hover:-translate-y-2 transition-all duration-500">
                  <div className="h-16 w-16 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500 mb-6">
                    <f.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-4">The Global Choice</h2>
            <p className="text-2xl font-bold text-white/80 mb-16">Trusted by over 2 million developers</p>
            <div className="flex flex-wrap items-center justify-center gap-16 md:gap-24 opacity-40 grayscale invert brightness-200 hover:grayscale-0 hover:invert-0 transition-all duration-1000">
               <Github className="w-8 h-8" />
               <Twitter className="w-8 h-8" />
               <Linkedin className="w-8 h-8" />
               <Layers className="w-8 h-8" />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
            {[
              { quote: "Codify has completely transformed our team's velocity. The speed is incomparable to anything used in the past decade.", author: "Alex Rivers", role: "Senior Engineer at CloudScale" },
              { quote: "The debugger alone is worth the switch. It's so intuitive and powerful that bug fixing feels almost like a game now.", author: "Sarah Chen", role: "Lead Frontend Developer" }
            ].map((t, i) => (
              <div key={i} className="bg-white/[0.03] p-10 rounded-2xl border border-white/5 relative group hover:bg-white/[0.05] transition-colors">
                <MessageSquare className="w-16 h-16 text-blue-500 opacity-10 absolute top-8 right-8 group-hover:scale-125 transition-transform duration-500" />
                <p className="text-xl italic text-slate-300 mb-10 leading-relaxed font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-full border-2 border-blue-500/30 p-1" />
                  <div>
                    <h4 className="font-bold text-lg text-white">{t.author}</h4>
                    <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 blur-[100px] pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6 font-display">Stay in the Loop</h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">Get the latest updates, expert tips, and exclusive extensions delivered straight to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto p-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <input type="email" placeholder="Enter your email" className="flex-grow bg-transparent border-none px-6 py-4 focus:ring-0 text-white placeholder-slate-500" />
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#020408] py-20 border-t border-white/5 relative z-10">
         <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 text-center md:text-left">
               <div className="col-span-2 lg:col-span-2 flex flex-col items-center md:items-start">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                        <Terminal className="w-5 h-5" />
                     </div>
                     <span className="text-xl font-bold tracking-tight text-white font-display">Codify</span>
                  </div>
                  <p className="text-slate-500 text-base leading-relaxed max-w-xs mb-8">The ultimate development environment for creators who value speed, precision, and extensibility.</p>
                  <div className="flex gap-5">
                    <Github className="w-6 h-6 text-slate-400 hover:text-white transition-colors cursor-pointer" />
                    <Twitter className="w-6 h-6 text-slate-400 hover:text-white transition-colors cursor-pointer" />
                    <Linkedin className="w-6 h-6 text-slate-400 hover:text-white transition-colors cursor-pointer" />
                  </div>
               </div>
               {['Product', 'Resources', 'Legal'].map((title) => (
                 <div key={title}>
                   <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-white mb-6 font-display">{title}</h4>
                   <ul className="space-y-4 text-sm font-medium text-slate-500">
                     {['Features', 'Pricing', 'Changelog', 'Security'].slice(0, 4).map((item) => (
                       <li key={item}><Link href="#" className="hover:text-blue-400 transition-colors">{item}</Link></li>
                     ))}
                   </ul>
                 </div>
               ))}
            </div>
            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
               <p>© 2026 Codify Labs. All rights reserved.</p>
               <div className="flex gap-10">
                  <span className="hover:text-blue-400 cursor-pointer">Status</span>
                  <span className="hover:text-blue-400 cursor-pointer">Contact Us</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
