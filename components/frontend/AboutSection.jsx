"use client";
import { useState, useEffect } from "react";
import { CldImage } from "next-cloudinary";
import { motion } from "framer-motion";
import AboutSectionSkeleton from "@/components/frontend/skeleton/AboutSectionSkeleton";

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/page-content?pageName=home`);
        const data = await response.json();
        const aboutData = data.find(item => item.Section === 'about');
        setAboutContent(aboutData);
        console.log(aboutData);
      } catch (error) {
        console.error('Error fetching about content:', error);
      }
    };

    fetchAboutContent();
  }, []);

  useEffect(() => {
    if (aboutContent && aboutContent.Images && aboutContent.Images.length > 0) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % aboutContent.Images.length);
          setFade(true);
        }, 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [aboutContent]);

  if (!aboutContent) {
    return <AboutSectionSkeleton />;
  }

  return (
   <section id="about-us" className="container my-20 md:px-20 mx-auto md:my-28 flex flex-col md:flex-row items-center justify-between rounded-2xl p-6 md:p-10 gap-40">
  <div className="flex-1 order-1 md:order-1 md:ml-2">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`rounded-2xl transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"} md:opacity-100`}
    >
      <CldImage
        src={aboutContent.Images[currentImageIndex].Url}
        alt="About Image"
        width={500}
        height={600}
        crop="fill"
        className="rounded-2xl w-[280px] h-[380px] lg:w-[340px] lg:h-[480px] rounded-tl-[70px] rounded-br-[70px] lg:rounded-tl-[100px] lg:rounded-br-[100px] rounded-tr-md rounded-bl-md mb-6 lg:mb-0 shadow-[0_8px_25px_rgba(0,0,0,0.6)] object-cover transition-opacity duration-500"
      />
    </motion.div>
  </div>

  <div className="flex-1 order-2 md:order-1 md:-ml-60">
    <motion.h1
      className="text-4xl font-bold text-green-800 leading-snug mb-4"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {aboutContent.Title}
    </motion.h1>
    <motion.p
      className="text-gray-700 mb-6 max-w-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {aboutContent.Paragraph}
    </motion.p>
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
    ></motion.div>
  </div>
</section>
  );
};

export default AboutSection;