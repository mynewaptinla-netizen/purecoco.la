/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PaymentForm, CreditCard } from 'react-square-web-payments-sdk';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Menu, 
  X, 
  Instagram, 
  MapPin, 
  ArrowRight, 
  CheckCircle2,
  Phone,
  Mail,
  Sun,
  Droplets,
  Disc,
  Music,
  Calendar,
  Clock,
  Upload,
  ShoppingCart,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';

export type CartItemType = {
  name: string;
  price: number;
  image: string;
  quantity: number;
};


// --- Helper Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string, key?: React.Key }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- Components ---

const FloatingMusicNotes = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  const notes = ['♪', '♫', '♬', '♩'];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-5">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl md:text-8xl text-coco-ink"
          initial={{
            y: "110vh",
            x: `${Math.random() * 100}vw`,
            rotate: Math.random() * 360,
          }}
          animate={{
            y: "-10vh",
            x: `${Math.random() * 100}vw`,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 15 + Math.random() * 15,
            repeat: Infinity,
            delay: Math.random() * 20,
            ease: "linear",
          }}
        >
          {notes[Math.floor(Math.random() * notes.length)]}
        </motion.div>
      ))}
    </div>
  );
};

const Navbar = ({ cart, onCartClick }: { cart: CartItemType[], onCartClick: () => void }) => {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Products', href: '#products' },
    { name: 'Locations', href: '#locations' },
    { name: 'Gallery', href: '#gallery' },
  ];

  return (
    <header className="fixed w-full z-50 transition-all duration-500">
      <div className="bg-coco-green text-coco-sand py-2 flex items-center justify-center relative overflow-hidden">
        <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-center px-4 animate-marquee-fast md:animate-none whitespace-nowrap md:whitespace-normal">
          <span className="inline-block md:hidden">🌴 NOW DELIVERING FRESH COCONUTS ACROSS LONG BEACH AND LOS ANGELES 🥥</span>
          <span className="hidden md:inline-block">🌴 NOW DELIVERING FRESH COCONUTS ACROSS LONG BEACH AND LOS ANGELES 🥥</span>
        </p>
      </div>
      <nav className={`transition-all duration-500 border-b border-transparent ${scrolled ? 'bg-coco-sand/90 backdrop-blur-xl py-3 border-coco-ink/10 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="flex items-center group">
          {/* Logo updated to use /logo.png */}
          <img 
            src="/logo.png" 
            alt="Pure Coco Logo" 
            className={`object-contain transition-all duration-500 ${scrolled ? 'h-36' : 'h-60 md:h-72'} group-hover:scale-105`}
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-10 items-center">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-semibold uppercase tracking-widest hover:text-coco-green relative group transition-colors"
            >
              <span className="relative z-10">{link.name}</span>
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-coco-green transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <button 
            onClick={onCartClick}
            className="flex items-center gap-2 bg-coco-green text-coco-sand px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-coco-ink hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-coco-green/20"
          >
            <ShoppingCart size={18} /> Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-coco-ink p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-coco-sand border-t border-coco-ink/10 shadow-2xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-8 space-y-6">
              {navLinks.map((link, i) => (
                <motion.a 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-display font-bold uppercase tracking-tight text-coco-ink hover:text-coco-green transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setIsOpen(false);
                  onCartClick();
                }}
                className="flex items-center justify-center gap-2 bg-coco-green text-coco-sand py-4 rounded-xl text-center font-bold uppercase tracking-widest shadow-lg shadow-coco-green/20 w-full"
              >
                <ShoppingCart size={18} /> Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </header>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 250]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 origin-top">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          poster="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=2000"
        >
        </video>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=2000" 
            alt="Beach vibe"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-coco-sand via-coco-sand/70 to-black/30"></div>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-64 md:pt-64 lg:pt-48"
      >
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md text-coco-ink px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-white/60 shadow-sm"
          >
            <Sun size={14} className="text-coco-green" /> Long Beach, CA
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] mb-6 leading-[0.85] text-coco-ink drop-shadow-md">
            <span className="block mb-2 font-display">STAY</span>
            <span className="text-coco-green relative inline-block">
              HYDRATED
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute -bottom-2 left-0 h-3 md:h-5 bg-coco-blue/50 -z-10"
              ></motion.span>
            </span>
          </h1>
          
          <p className="text-xl md:text-3xl text-coco-ink/90 mb-10 max-w-2xl font-medium leading-tight">
            Serving fresh coconuts and raw island energy to streets of Long Beach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <a 
              href="#locations" 
              className="bg-coco-ink text-coco-sand px-10 py-5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-coco-green hover:scale-105 transition-all duration-300 group shadow-2xl"
            >
              Find Us <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Animated Coconuts */}
      <motion.div 
        animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 right-10 md:right-24 hidden lg:block z-20"
      >
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl rotate-3 border border-white border-2">
          <img 
            src="/purecocoecommer.png" 
            alt="Fresh Coconut" 
            className="w-56 h-56 object-cover rounded-[1.5rem] mb-4 shadow-inner"
            referrerPolicy="no-referrer"
          />
          <div className="px-2 pb-2">
            <p className="inline-block bg-coco-green/10 text-coco-green px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-2">Always Fresh</p>
            <p className="font-display font-bold uppercase text-lg leading-none">Coco for Coconuts</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <FadeIn className="relative order-2 lg:order-1">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-coco-sand">
              <img 
                src="/kenaselling.png" 
                alt="Kena selling fresh coconuts" 
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-10 -left-10 bg-coco-blue p-10 rounded-[2.5rem] hidden md:block max-w-[320px] shadow-2xl"
            >
              <Droplets size={32} className="text-coco-ink mb-4" />
              <p className="text-coco-ink font-bold text-xl leading-snug">
                "We started with a cooler and a dream. Now we're bringing the island everywhere."
              </p>
            </motion.div>
          </FadeIn>
          
          <div className="order-1 lg:order-2">
            <FadeIn>
              <h4 className="text-coco-green font-bold uppercase tracking-widest mb-4">Our Culture</h4>
              <h2 className="text-5xl md:text-7xl mb-8 leading-[0.9]">More Than <br/> Just Water.</h2>
            </FadeIn>
            <FadeIn delay={0.2} className="space-y-6 text-xl text-coco-ink/70 leading-relaxed font-medium">
              <p>
                Pure Coco was born from a simple obsession: the perfect, ice-cold coconut after a long day in the California sun. We saw the true energy of Long Beach and knew they needed something better than processed drinks.
              </p>
              <p>
                What started as a hustle at local street pop-ups has grown into a community staple. We source the freshest coconuts, crack them on the spot, and serve them with authentic island soul.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4} className="mt-12 grid grid-cols-2 gap-8 pt-8 border-t border-coco-ink/10">
              <div className="flex flex-col gap-3">
                <div className="w-14 h-14 bg-coco-green/10 rounded-2xl flex items-center justify-center text-coco-green">
                  <span className="font-display font-bold text-xl">100</span>
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wide">Raw & Natural</h4>
                  <p className="text-sm text-coco-ink/60">No additives, just nature.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-14 h-14 bg-coco-blue/30 rounded-2xl flex items-center justify-center text-coco-ink">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wide">LB Local</h4>
                  <p className="text-sm text-coco-ink/60">Rooted in the community.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

const Products = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {
  const items = [
    {
      name: "Fresh Coconut",
      price: "$12",
      desc: "Freshly cracked young coconut. Drink the water, eat the meat. The classic.",
      image: "/purecocoimage.png"
    },
    {
      name: "Coco Pineapple",
      price: "$20",
      desc: "Sweet pineapple blended perfectly with fresh coconut water and meat.",
      image: "/purepine.png"
    },
    {
      name: "Seeded Watermelon Juice",
      price: "$10",
      desc: "Freshly pressed seeded watermelon. Crisp, sweet, and ultra-refreshing.",
      image: "/purewater.png"
    },
    {
      name: "Fresh Pineapple Juice",
      price: "$10",
      desc: "100% pure pressed pineapple juice. Literal liquid sunshine.",
      image: "/cocopine.png"
    }
  ];

  return (
    <section id="products" className="py-32 bg-coco-sand relative">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
          <div>
            <h4 className="text-coco-green font-bold uppercase tracking-widest mb-2">The Menu</h4>
            <h2 className="text-6xl md:text-8xl">Fresh Cuts.</h2>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <FadeIn key={item.name} delay={i * 0.1} className="h-full">
              <motion.div 
                whileHover={{ y: -15 }}
                className="bg-white rounded-[2.5rem] overflow-hidden group border border-coco-ink/5 shadow-xl shadow-coco-ink/5 flex flex-col h-full cursor-pointer"
                onClick={() => onAddToCart(item)}
              >
                <div className="h-80 overflow-hidden relative shrink-0">
                  <div className="absolute inset-0 bg-coco-ink/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center backdrop-blur-sm">
                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="bg-white text-coco-ink px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl hover:bg-coco-green hover:text-white transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 right-6 z-20 bg-coco-green text-coco-sand px-5 py-2 rounded-full font-bold text-lg shadow-lg">
                    {item.price}
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-3xl mb-4 group-hover:text-coco-green transition-colors">{item.name}</h3>
                  <p className="text-coco-ink/70 text-lg leading-relaxed mb-8 flex-grow">{item.desc}</p>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="w-full py-4 rounded-xl border-2 border-coco-ink text-coco-ink font-bold uppercase tracking-widest hover:bg-coco-ink hover:text-white transition-colors mt-auto">
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-20 bg-coco-ink text-white rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl mb-4 text-coco-sand">Off-Menu Specials.</h3>
              <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                Looking for something a little more spirited? Ask us about our secret drink specials when you visit us in person. We have exclusive mixes crafted for the perfect sunset vibe.
              </p>
            </div>
            <div className="relative z-10 shrink-0">
              <a href="#locations" className="inline-block bg-coco-green text-coco-ink px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 shadow-xl">
                Find Us
              </a>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-coco-green/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const BannerAd = () => {
  return (
    <section className="pt-24 pb-8 bg-coco-sand relative z-10 -mb-16">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn>
          <div className="rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-center gap-12 relative overflow-hidden group">
            <img 
              src="/logo.png" 
              alt="Pure Coco Logo" 
              className="w-96 md:w-[36rem] max-w-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-700 drop-shadow-xl"
              referrerPolicy="no-referrer"
            />
            
            <div className="text-center md:text-left relative z-10 text-coco-ink max-w-xl">
              <h3 className="text-4xl md:text-5xl font-bold mb-4">Pure Vibes. Pure Coco.</h3>
              <p className="text-lg text-coco-ink/70 mb-8">
                Catch us live across Long Beach and Los Angeles. Serving up the freshest cuts daily.
              </p>
              <a href="#events" className="inline-block bg-coco-ink text-coco-sand px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-coco-green hover:text-coco-ink transition-colors duration-300 shadow-xl">
                Find Our Cart
              </a>
            </div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-coco-green/20 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

const EventUpdates = () => {
  const events = [
    {
      date: "Wednesday - Sunday",
      title: "Alamitos Beach Pop-Up",
      location: "Front of Gauchos Bar and Grill",
      time: "12:00 PM to Sunset",
      desc: "Catch the Pure Coco cart at Alamitos Beach right in front of Gauchos Bar and Grill."
    }
  ];

  return (
    <section id="events" className="py-32 bg-coco-sand relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn className="mb-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-6">Upcoming Drops.</h2>
          <p className="text-xl text-coco-ink/70 max-w-2xl">Find out where the Pure Coco cart is landing next. Pull up for fresh coconuts and good vibes.</p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <FadeIn key={i} delay={i * 0.1} className="h-full">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 border border-coco-ink/5 hover:-translate-y-2 h-full flex flex-col">
                <div className="flex items-center gap-2 text-coco-green font-bold uppercase tracking-widest mb-4">
                  <Calendar size={18} />
                  <span>{event.date}</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">{event.title}</h3>
                <div className="space-y-2 mb-6 text-coco-ink/80 flex-grow">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span className="font-medium">{event.time}</span>
                  </div>
                </div>
                <p className="text-coco-ink/70 mb-8">{event.desc}</p>
                <button className="w-full py-4 rounded-xl border-2 border-coco-ink text-coco-ink font-bold uppercase tracking-widest hover:bg-coco-ink hover:text-white transition-colors mt-auto">
                  Add to Calendar
                </button>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Locations = () => {
  return (
    <section id="locations" className="py-32 bg-coco-ink text-coco-sand relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-coco-green rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-coco-blue rounded-full blur-[150px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <FadeIn>
              <h2 className="text-6xl md:text-8xl mb-8 text-white">Catch Us.</h2>
              <p className="text-2xl text-white/70 mb-12 font-medium">
                We move around Long Beach to keep the vibes fresh. Follow the cart or check out our latest drops on Instagram.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.4} className="mt-14 flex flex-wrap gap-4">
              <a 
                href="https://instagram.com/purecoco.la" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-coco-ink px-8 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-coco-blue hover:text-coco-ink transition-all shadow-xl hover:-translate-y-1"
              >
                <Instagram size={24} /> @purecoco.la
              </a>
              <a 
                href="https://tiktok.com/@purecoco.la" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-coco-ink px-8 py-5 rounded-full font-bold uppercase tracking-widest hover:bg-coco-blue hover:text-coco-ink transition-all shadow-xl hover:-translate-y-1"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> @purecoco.la
              </a>
            </FadeIn>
          </div>
          <FadeIn delay={0.3} className="h-[700px] rounded-[3rem] overflow-hidden relative group shadow-2xl border border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200" 
              alt="Long Beach Map Context" 
              className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-1000 scale-105 group-hover:scale-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coco-ink/90 via-transparent to-transparent flex flex-col justify-end p-10">
              <div className="flex items-center gap-5">
                <div className="bg-coco-green p-5 rounded-full animate-bounce shadow-lg shadow-coco-green/50">
                  <MapPin size={36} className="text-white" />
                </div>
                <p className="text-3xl font-bold text-white">Currently in LBC</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const PickupCheckoutForm = ({ cart, updateQuantity, removeFromCart }: { cart: CartItemType[], updateQuantity: (name: string, d: number) => void, removeFromCart: (name: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart');
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [orderState, setOrderState] = useState({ deliveryType: 'pickup', name: '', email: '', phone: '', address: '' });
  const [deliverySelection, setDeliverySelection] = useState('pickup');
  const [success, setSuccess] = useState(false);
  const [squareConfig, setSquareConfig] = useState<{applicationId: string, locationId: string} | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  
  useEffect(() => {
    try {
      setIsIframe(window.self !== window.top);
    } catch (e) {
      setIsIframe(true);
    }
    
    const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID;
    const locId = import.meta.env.VITE_SQUARE_LOCATION_ID;

    if (appId && locId) {
      setSquareConfig({
        applicationId: appId,
        locationId: locId
      });
    }
    setConfigLoaded(true);
  }, []);

  const handleDetailsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const deliveryType = formData.get('deliveryType') as string;
    const address = formData.get('address') as string || '';
    const name = formData.get('name') as string || '';
    const email = formData.get('email') as string || '';
    const phone = formData.get('phone') as string || '';
    
    setOrderState({ ...orderState, deliveryType, name, email, phone, address });
    setErrorMessage("");
    setStep('payment');
  };

  const handlePaymentSubmit = async (token: any) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: token.token,
          buyerName: orderState.name,
          buyerEmail: orderState.email,
          buyerPhone: orderState.phone,
          buyerAddress: orderState.address,
          items: cart,
          deliveryType: orderState.deliveryType
        }),
      });

      const data = await response.json();
      
      if (data.payment) {
        setSuccess(true);
      } else if (data.error) {
        console.error("Checkout error:", data.error);
        setErrorMessage(data.error);
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-coco-green text-coco-sand rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-4xl font-bold mb-4">Payment Successful!</h3>
        <p className="text-xl text-coco-ink/70">Your coconuts will be ready soon.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {errorMessage}
        </div>
      )}

      
      {step === 'cart' && (
        <motion.div 
          key="form-cart"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-coco-ink/50">Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.map((item) => (
                  <div key={item.name} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-coco-ink/5">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-coco-green font-bold">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-coco-sand p-2 rounded-xl">
                      <button type="button" onClick={() => updateQuantity(item.name, -1)} className="p-2 hover:bg-white rounded-lg transition-colors text-coco-ink"><Minus size={16} /></button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.name, 1)} className="p-2 hover:bg-white rounded-lg transition-colors text-coco-ink"><Plus size={16} /></button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.name)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl border border-coco-ink/5 shadow-sm">
                <span className="text-xl font-bold uppercase tracking-widest text-coco-ink/70">Total</span>
                <span className="text-3xl font-bold text-coco-green">${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => setStep('details')} className="w-full bg-coco-green text-coco-sand py-6 rounded-2xl font-bold uppercase text-xl tracking-widest hover:bg-coco-ink hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-coco-green/30">
                Proceed to Checkout
              </button>
            </>
          )}
        </motion.div>
      )}

      {step === 'details' && (
        <motion.form 
          key="form-details"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleDetailsSubmit}
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Full Name</label>
              <input required name="name" defaultValue={orderState.name} type="text" placeholder="Your Name" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Email Address</label>
              <input required name="email" defaultValue={orderState.email} type="email" placeholder="Your Email" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
            </div>
          </div>
          <div className="grid md:grid-cols-1 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Phone Number</label>
              <input required name="phone" defaultValue={orderState.phone} type="tel" placeholder="Your Phone Number" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Delivery Method</label>
              <select name="deliveryType" value={deliverySelection} onChange={(e) => setDeliverySelection(e.target.value)} className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg uppercase shadow-sm">
                <option value="pickup">Pickup (Free)</option>
                <option value="delivery_lb">Delivery - Long Beach (+$10)</option>
                <option value="delivery_la">Delivery - Los Angeles (+$20)</option>
              </select>
            </div>
            
            <AnimatePresence>
              {deliverySelection !== 'pickup' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Delivery Address</label>
                  <input required name="address" defaultValue={orderState.address} type="text" placeholder="123 Ocean Ave, Long Beach, CA" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>


          <button type="submit" className="w-full mt-4 bg-coco-green text-coco-sand py-6 rounded-2xl font-bold uppercase text-xl tracking-widest hover:bg-coco-ink hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-coco-green/30">
            Continue to Payment
          </button>
        </motion.form>
      )}

      {step === 'payment' && (
        <motion.div 
          key="form-payment"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-coco-ink/5"
        >
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-coco-ink/10">
            <div>
              <h3 className="text-2xl font-bold">Complete Payment</h3>
              <p className="text-coco-ink/60 uppercase tracking-widest font-bold text-sm mt-1">
                {orderState.quantity}x Coconut • {orderState.deliveryType.replace('_', ' ')}
              </p>
              <div className="mt-4 text-sm text-coco-ink/80">
                <p className="font-semibold">{orderState.name}</p>
                <p>{orderState.email}</p>
                <p>{orderState.phone}</p>
              </div>
            </div>
            <button 
              onClick={() => setStep('details')}
              className="text-coco-ink/60 hover:text-coco-ink font-bold uppercase tracking-widest text-sm bg-coco-sand px-4 py-2 rounded-full transition-colors mt-1"
            >
              Back
            </button>
          </div>
          
          <div className="min-h-[250px] relative">
            {!configLoaded && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <div className="animate-spin w-8 h-8 border-4 border-coco-green border-t-transparent rounded-full"></div>
              </div>
            )}
            
            {(configLoaded && !squareConfig) && (
              <div className="absolute inset-0 bg-red-50 text-red-600 p-6 flex flex-col items-center justify-center rounded-xl border border-red-100 z-20 text-center">
                <svg className="w-12 h-12 mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h4 className="font-bold mb-2">Missing Configuration</h4>
                <p className="text-sm">Please add <strong>VITE_SQUARE_APPLICATION_ID</strong> and <strong>VITE_SQUARE_LOCATION_ID</strong> to your environment secrets to display the payment form.</p>
              </div>
            )}
            
            {loading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <div className="animate-spin w-8 h-8 border-4 border-coco-green border-t-transparent rounded-full"></div>
              </div>
            )}
            
            {squareConfig && isIframe && (
              <div className="absolute inset-0 bg-yellow-50 text-yellow-800 p-6 flex flex-col items-center justify-center rounded-xl border border-yellow-200 z-20 text-center">
                <svg className="w-12 h-12 mb-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h4 className="font-bold mb-2">Preview Limitation</h4>
                <p className="text-sm">Square Payments cannot be rendered inside the AI Studio preview frame for security reasons. <strong>Please open the app in a new tab</strong> to see the checkout.</p>
              </div>
            )}
            
            {squareConfig && !isIframe && (
              <PaymentForm
                applicationId={squareConfig.applicationId}
                locationId={squareConfig.locationId}
                cardTokenizeResponseReceived={async (token) => {
                  await handlePaymentSubmit(token);
                }}
              >
                <CreditCard 
                  buttonProps={{
                    css: {
                      backgroundColor: "#1c2c25",
                    color: "#f8f5ee",
                    "&:hover": {
                      backgroundColor: "#131f1a",
                    },
                  },
                }} 
              />
            </PaymentForm>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const EventQuoteForm = ({ onSubmit }: { onSubmit: (e: React.FormEvent) => void }) => {
  const [branded, setBranded] = useState('none');
  
  return (
    <motion.form 
      key="form-event"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={onSubmit} 
      className="space-y-8 text-left"
    >
      <div className="space-y-10">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-widest text-coco-ink mb-6 border-b border-coco-ink/10 pb-4">1. Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <input required type="text" placeholder="Full Name" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
            <input required type="email" placeholder="Email Address" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
            <input required type="tel" placeholder="Phone Number" className="md:col-span-2 w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
          </div>
        </div>

        <div>
           <h3 className="text-xl font-bold uppercase tracking-widest text-coco-ink mb-6 border-b border-coco-ink/10 pb-4">2. Event Logistics</h3>
           <div className="grid md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Event Date</label>
                <input required type="date" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg uppercase shadow-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Serving Start Time</label>
                <input required type="time" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg uppercase shadow-sm" />
             </div>
             <input required type="text" placeholder="Event Venue / Location (e.g., Beach, Private Residence)" className="md:col-span-2 w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
             <input required type="number" min="1" placeholder="Estimated Guest Count" className="md:col-span-2 w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
           </div>
        </div>

        <div>
           <h3 className="text-xl font-bold uppercase tracking-widest text-coco-ink mb-6 border-b border-coco-ink/10 pb-4">3. Service & Coconut Options</h3>
           <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Service Style Preferred</label>
                <select className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg shadow-sm">
                  <option>Full Catering & Live Cracking</option>
                  <option>Buffet Table (Self-Serve Pickup/Drop-off)</option>
                  <option>Not Sure / Need Advice</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Total Number of Coconuts Requested</label>
                <input required type="number" min="1" placeholder="Quantity" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Sustainable Straw Selection</label>
                <select className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg shadow-sm">
                  <option>Green Straws</option>
                  <option>Opaque Clear Straws</option>
                  <option>No Preference</option>
                  <option>None (No straws needed)</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Do you require a COI for this venue?</label>
                <select className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg shadow-sm">
                  <option>Yes</option>
                  <option>No</option>
                  <option>Not Sure</option>
                </select>
             </div>
           </div>
        </div>

        <div>
           <h3 className="text-xl font-bold uppercase tracking-widest text-coco-ink mb-6 border-b border-coco-ink/10 pb-4">4. Custom Brand Stamping</h3>
           <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Add a custom logo or design?</label>
                <select className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg md:text-base shadow-sm" value={branded} onChange={(e) => setBranded(e.target.value)}>
                  <option value="none">No, standard unbranded/PureCoco.LA branding is fine.</option>
                  <option value="hot">Yes, Premium Hot Fire-Branding (Starts at $480 setup fee)</option>
                  <option value="ink">Yes, Custom Ink Branding (Starts at $150 setup fee)</option>
                </select>
             </div>
             {branded === 'ink' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Select your color</label>
                  <select className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg shadow-sm">
                    <option>Black</option>
                    <option>Blue</option>
                    <option>Green</option>
                    <option>Red</option>
                    <option>Purple</option>
                  </select>
                </div>
             )}
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70">Is this a rush order?</label>
                <select className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg shadow-sm">
                  <option>No (Outside 7-14 day windows)</option>
                  <option>Yes, this is a rush item</option>
                </select>
             </div>
             
             <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-coco-ink/70 block">Upload Your Logo/Artwork File</label>
                <p className="text-xs text-coco-ink/60 mb-3">Supported formats: .AI, .PSD, high-res JPG/PNG</p>
                <label className="flex items-center justify-center w-full p-8 bg-white rounded-2xl border-2 border-dashed border-coco-ink/20 cursor-pointer hover:border-coco-green hover:bg-coco-green/5 transition-all">
                  <div className="flex flex-col items-center gap-3 text-coco-ink/60">
                    <Upload size={32} />
                    <span className="font-bold tracking-widest uppercase text-sm">Select File</span>
                  </div>
                  <input type="file" className="hidden" accept=".ai,.psd,.jpg,.jpeg,.png" />
                </label>
             </div>
           </div>
        </div>

        <div>
           <h3 className="text-xl font-bold uppercase tracking-widest text-coco-ink mb-6 border-b border-coco-ink/10 pb-4">5. Additional Notes</h3>
           <textarea 
             rows={4} 
             placeholder="Tell us more about your event vision or any special requests..."
             className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg resize-none placeholder:text-coco-ink/30 shadow-sm"
           ></textarea>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-coco-green text-coco-sand py-6 rounded-2xl font-bold uppercase text-xl tracking-widest hover:bg-coco-ink hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-coco-green/30 mt-8"
      >
        Submit Quote Request
      </button>
    </motion.form>
  )
}

const BookingForm = ({ isOpen, onClose, mode, cart, updateQuantity, removeFromCart, clearCart }: { isOpen: boolean, onClose: () => void, mode: 'cart' | 'event', cart: CartItemType[], updateQuantity: (name: string, d: number) => void, removeFromCart: (name: string) => void, clearCart: () => void }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formType, setFormType] = useState<'event' | 'cart'>(mode);

  useEffect(() => {
    setFormType(mode);
  }, [mode, isOpen]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setSubmitted(true);
      setFormType('cart');
      clearCart();
    }
    if (query.get('canceled')) {
      setFormType('cart');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-white overflow-y-auto"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-coco-sand rounded-full text-coco-ink hover:bg-coco-green hover:text-coco-sand transition-colors z-50 shadow-md"
          >
            <X size={28} />
          </button>
          <div className="py-24">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
              <FadeIn className="text-center mb-16">
                <h2 className="text-5xl md:text-8xl mb-6">{formType === 'event' ? 'Get a Quote' : 'Your Cart'}</h2>
                <p className="text-coco-ink/60 uppercase tracking-widest font-bold text-sm md:text-lg">
                  {formType === 'event' 
                    ? 'Large purchases, Private Events, Festivals, Office Drops'
                    : 'Review your items and checkout.'}
                </p>
              </FadeIn>

              <FadeIn delay={0.2} className="mb-8 flex justify-center gap-2 md:gap-4 flex-wrap">
                <button 
                  onClick={() => setFormType('event')}
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest transition-all text-xs md:text-sm ${formType === 'event' ? 'bg-coco-green text-coco-sand shadow-lg' : 'bg-coco-sand text-coco-ink hover:bg-coco-ink/5'}`}
                >
                  Event Quote
                </button>
                <button 
                  onClick={() => setFormType('pickup')}
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest transition-all text-xs md:text-sm ${formType === 'pickup' ? 'bg-coco-green text-coco-sand shadow-lg' : 'bg-coco-sand text-coco-ink hover:bg-coco-ink/5'}`}
                >
                  Pickup Order
                </button>
              </FadeIn>

        <FadeIn delay={0.4}>
          <div className="bg-coco-sand p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-coco-ink/5 border border-coco-ink/5">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-16"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ type: "spring", duration: 1 }}
                    className="w-28 h-28 bg-white text-coco-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
                  >
                    <CheckCircle2 size={56} />
                  </motion.div>
                  <h3 className="text-5xl mb-6">Vibes Received!</h3>
                  <p className="text-xl text-coco-ink/70 mb-10">We'll get back to you soon to confirm the details.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-coco-green font-bold uppercase tracking-widest border-b-2 border-coco-green pb-1 hover:text-coco-ink hover:border-coco-ink transition-colors"
                  >
                    Send another request
                  </button>
                </motion.div>
              ) : formType === 'event' ? (
                <EventQuoteForm onSubmit={handleSubmit} />
              ) : (
                <PickupCheckoutForm cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MusicVibes = () => {
  return (
    <section id="music" className="py-32 relative overflow-hidden bg-coco-green text-coco-ink">
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden flex items-center justify-center">
         <span className="text-[40rem] leading-none font-bold">♪</span>
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
            <FadeIn>
              <h4 className="font-bold uppercase tracking-widest mb-4 opacity-70">The Sound of Pure Coco</h4>
              <h2 className="text-5xl md:text-7xl mb-8 leading-[0.9]">Afrobeats <br/> & Fresh Coconuts.</h2>
            </FadeIn>
            <FadeIn delay={0.2} className="space-y-6 text-xl leading-relaxed font-medium opacity-90">
              <p>
                We don't just sell coconuts; we bring the party to the streets. Wherever the Pure Coco cart drops, the vibes follow.
              </p>
              <p>
                Expect a curated mix of Afrobeats, Amapiano, and dancehall spun live by our resident DJs. Grab a freshly cracked coconut, feel the bass, and catch the island energy right here in the city.
              </p>
            </FadeIn>
            <FadeIn delay={0.4} className="mt-12 flex items-center gap-4">
               <Music size={32} className="opacity-80" />
               <span className="text-2xl font-bold uppercase tracking-widest">More than a drink. It's a movement.</span>
            </FadeIn>
          </div>
          
          <FadeIn className="relative order-1 md:order-2">
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-coco-sand/20">
              <img 
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1200" 
                alt="DJ spinning Afrobeats" 
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-10 -right-10 bg-coco-sand p-10 rounded-[2.5rem] hidden md:flex flex-col items-center max-w-[320px] shadow-2xl"
            >
              <Disc size={48} className="text-coco-ink mb-4 animate-[spin_4s_linear_infinite]" />
              <p className="text-coco-ink font-bold text-center text-xl leading-snug">
                "Live DJ sets at every major pop-up."
              </p>
            </motion.div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

const VibesMarquee = () => {
  const content = [
    "AFROBEATS", "•", "FRESH COCOS", "•", "AMAPIANO", "•", "ISLAND VIBES", "•", "DANCEHALL", "•", 
    "AFROBEATS", "•", "FRESH COCOS", "•", "AMAPIANO", "•", "ISLAND VIBES", "•", "DANCEHALL", "•",
    "AFROBEATS", "•", "FRESH COCOS", "•", "AMAPIANO", "•", "ISLAND VIBES", "•", "DANCEHALL", "•"
  ];

  return (
    <div className="w-full overflow-hidden bg-coco-ink text-coco-sand py-6 border-y-4 border-coco-green whitespace-nowrap flex relative z-20">
      <motion.div
        className="text-3xl md:text-5xl font-bold uppercase tracking-widest flex gap-8 md:gap-16 items-center"
        animate={{ x: [0, -2000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {content.map((text, i) => (
          <span key={i} className={text === "•" ? "text-coco-green" : ""}>
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const Gallery = () => {
  const images = [
    "/pineappledrinks.jpg",
    "/purecocoad2.png",
    "/purecocoad3.png",
  ];

  return (
    <section id="gallery" className="py-32 bg-coco-sand overflow-hidden relative border-t border-coco-ink/5">
      <div className="absolute top-10 right-10 flex gap-4 opacity-5 pointer-events-none">
        <span className="text-[12rem] font-display font-bold leading-none">VIBES</span>
      </div>
      
      <div className="flex space-x-6 animate-marquee whitespace-nowrap px-6 pt-10">
        {[...images, ...images, ...images].map((img, i) => (
          <div key={i} className="inline-block w-[300px] md:w-[450px] h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden flex-shrink-0 relative group shadow-2xl">
            <div className="absolute inset-0 bg-coco-green/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            <img 
              src={img} 
              alt={`Pure Coco Vibe ${i}`} 
              className="w-full h-full object-cover filter grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

const Footer = ({ onCartClick }: { onCartClick: () => void }) => {
  return (
    <footer className="bg-white pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5">
            <a href="#" className="flex items-center gap-4 mb-8">
              <img 
                src="/logo.png" 
                alt="Pure Coco Logo" 
                className="h-96 md:h-[27rem] object-contain"
                referrerPolicy="no-referrer"
              />
            </a>
            <p className="text-2xl text-coco-ink/70 max-w-sm mb-10 font-medium">
              Bringing island energy to the streets. Fresh, raw, and always chilled.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/purecoco.la" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-coco-sand rounded-full flex items-center justify-center text-coco-ink hover:bg-coco-green hover:text-white transition-all shadow-md hover:-translate-y-1">
                <Instagram size={24} />
              </a>
              <a href="https://tiktok.com/@purecoco.la" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-coco-sand rounded-full flex items-center justify-center text-coco-ink hover:bg-coco-green hover:text-white transition-all shadow-md hover:-translate-y-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
              </a>
              <a href="mailto:hello@purecocolb.com" className="w-14 h-14 bg-coco-sand rounded-full flex items-center justify-center text-coco-ink hover:bg-coco-green hover:text-white transition-all shadow-md hover:-translate-y-1">
                <Mail size={24} />
              </a>
              <a href="tel:5625550123" className="w-14 h-14 bg-coco-sand rounded-full flex items-center justify-center text-coco-ink hover:bg-coco-green hover:text-white transition-all shadow-md hover:-translate-y-1">
                <Phone size={24} />
              </a>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-8 text-coco-ink/40">Explore</h4>
            <ul className="space-y-5 text-coco-ink/80 font-bold text-lg">
              <li><a href="#about" className="hover:text-coco-green transition-colors inline-block hover:translate-x-2 duration-300">Our Story</a></li>
              <li><a href="#products" className="hover:text-coco-green transition-colors inline-block hover:translate-x-2 duration-300">The Menu</a></li>
              <li><a href="#locations" className="hover:text-coco-green transition-colors inline-block hover:translate-x-2 duration-300">Find Locations</a></li>
              <li><button onClick={onCartClick} className="hover:text-coco-green transition-colors inline-block hover:translate-x-2 duration-300">Checkout</button></li>
            </ul>
          </div>

          <div className="lg:col-span-4 bg-coco-sand p-10 rounded-[2.5rem] shadow-sm border border-coco-ink/5">
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6 text-coco-ink/40">Direct Contact</h4>
            <ul className="space-y-5 text-coco-ink/80 font-medium text-lg">
              <li className="flex items-center gap-4"><MapPin size={24} className="text-coco-green" /> Long Beach, CA</li>
              <li className="flex items-center gap-4"><Mail size={24} className="text-coco-green" /> hello@purecocolb.com</li>
              <li className="text-coco-green font-bold text-2xl mt-6 pt-6 border-t border-coco-ink/10 flex items-center gap-3">
                <Phone size={24} /> Text (562) 555-0123
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-coco-ink/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-widest text-coco-ink/40">
          <p>© 2026 Pure Coco Street Carts. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-coco-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-coco-ink transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---


export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [bookingMode, setBookingMode] = useState<'cart' | 'event'>('cart');

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === product.name);
      if (existing) {
        return prev.map(item => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item);
      }
      const priceNum = parseFloat(product.price.replace('$', ''));
      return [...prev, { name: product.name, price: priceNum, quantity: 1, image: product.image }];
    });
    setBookingMode('cart');
    setIsBookingOpen(true);
  };

  const updateQuantity = (name: string, delta: number) => {
    setCart(prev => prev.map(item => item.name === name ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const removeFromCart = (name: string) => {
    setCart(prev => prev.filter(item => item.name !== name));
  };

  const clearCart = () => setCart([]);

  const openCart = () => {
    setBookingMode('cart');
    setIsBookingOpen(true);
  };

  const openQuote = () => {
    setBookingMode('event');
    setIsBookingOpen(true);
  };


  return (
    <div className="min-h-screen bg-coco-sand selection:bg-coco-green/20 selection:text-coco-ink overflow-x-hidden text-coco-ink">
      <FloatingMusicNotes />
      <Navbar cart={cart} onCartClick={openCart} />
      <main>
        <Hero />
        <About />
        <Products onAddToCart={addToCart} />
        <BannerAd />
        <EventUpdates />
        <Locations />
        <BookingForm isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} mode={bookingMode} cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} />
        <MusicVibes />
        <VibesMarquee />
        <Gallery />
      </main>
      <Footer onCartClick={openCart} />
    </div>
  );
}
