"use client";
import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/button";

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
    <section className="container mx-auto md:my-28 flex flex-col md:flex-row items-center justify-between rounded-2xl p-6 md:p-10 gap-6 md:gap-10">
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-green-800 leading-snug mb-4">
          Tampil Anggun bersama <span className="italic">SanyDressline</span>!
        </h1>
        <p className="text-gray-700 mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <p className="text-gray-700 mb-6">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <Button className="bg-green-800 text-white py-6 px-6 rounded-md shadow-md hover:bg-green-900">
          JELAJAHI SEKARANG!
        </Button>
      </div>

      <div className="flex-1 flex justify-center">
        <div
          className={`rounded-2xl transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
        >
          <CldImage
            src={images[currentImageIndex]}
            alt="Tampil Anggun"
            width={500}
            height={600}
            crop="fill"
            className="rounded-2xl w-[280px] h-[380px] lg:w-[340px] lg:h-[480px]  rounded-tl-[70px] shadow-md rounded-br-[70px] lg:rounded-tl-[100px] lg:rounded-br-[100px] rounded-tr-md rounded-bl-md mx-auto mb-6 lg:mb-0 lg:ml-[160px] shadow-[0_8px_25px_rgba(0,0,0,0.6)] object-cover transition-opacity duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;