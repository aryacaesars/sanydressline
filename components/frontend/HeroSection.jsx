"use client";
import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const HeroSection = () => {
  const images = [
    "IMG_7787_wyvjb1",
    "IMG_7778_g7yhon",
    "IMG_6701_rmoanh",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="container max-w-7xl min-h-screen mx-auto my-24 md:my-10 flex flex-col md:flex-row items-center justify-between rounded-2xl p-6 md:p-10 gap-6 md:gap-40 overflow-hidden">
      <div className="flex-1">
        <motion.h1
          className="text-2xl md:text-4xl font-bold text-green-800 leading-snug mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Tampil Anggun bersama <span className="italic">SanyDressline</span>!
        </motion.h1>
        <motion.p
          className="text-sm md:text-base text-gray-700 mb-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </motion.p>
        <motion.p
          className="text-sm md:text-base text-gray-700 mb-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        >
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
        >
          <Button className="bg-green-800 text-white py-3 md:py-6 px-4 md:px-6 rounded-md shadow-md hover:bg-green-900">
            JELAJAHI SEKARANG!
          </Button>
        </motion.div>
      </div>

      <div className="flex-1 flex justify-center">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          className={`rounded-2xl transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
        >
          <CldImage
            src={images[currentImageIndex]}
            alt="Tampil Anggun"
            width={500}
            height={600}
            crop="fill"
            className="rounded-2xl w-[280px] h-[380px] md:w-[280px] md:h-[380px] lg:w-[340px] lg:h-[480px] rounded-tl-[70px] shadow-md rounded-br-[70px] lg:rounded-tl-[100px] lg:rounded-br-[100px] rounded-tr-md rounded-bl-md mx-auto mb-6 lg:mb-0 lg:ml-[160px] shadow-[0_8px_25px_rgba(0,0,0,0.6)] object-cover transition-opacity duration-500"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;