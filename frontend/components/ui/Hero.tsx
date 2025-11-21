'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  return (
    <section ref={sectionRef} className="relative h-[90vh] w-full bg-zinc-200 overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1920&q=80"
          alt="Hero Background"
          fill
          className="object-cover scale-[1.02]"
          priority
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </motion.div>
      
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        style={{ opacity: copyOpacity }}
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <motion.span
          className="inline-block mb-4 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/90 border border-white/30 px-4 py-2 backdrop-blur-sm"
          variants={heroVariants}
        >
          Spring / Summer 2025
        </motion.span>
        <motion.h1
          className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 uppercase text-white drop-shadow-lg"
          variants={heroVariants}
        >
          Essential<br />Minimalism
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-10 max-w-xl mx-auto text-white/90 font-light leading-relaxed"
          variants={heroVariants}
        >
          Curated essentials for the modern wardrobe. Uncompromising quality, sustainable materials, and timeless design.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={heroVariants}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link 
              href="/products" 
              className="block bg-white text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors min-w-[200px] hover:shadow-xl"
            >
              Shop Collection
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link 
              href="/about" 
              className="block bg-transparent border border-white text-white px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-colors min-w-[200px]"
            >
              Read Our Story
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
