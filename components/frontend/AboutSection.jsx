"use client";
import {useState, useEffect} from "react";
import {CldImage} from "next-cloudinary";
import {motion} from "framer-motion";

const AboutSection = () => {
    const images = [
        "IMG_7778_g7yhon",
        "IMG_6701_rmoanh",
        "IMG_7787_wyvjb1",
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
        <section
            className="container md:px-20 mx-auto md:my-28 flex flex-col md:flex-row items-center justify-between rounded-2xl p-6 md:p-10 gap-40"
            >
            <div className="flex-1 order-2 md:order-1 md:ml-2">
                <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                className={`rounded-2xl transition-opacity duration-500 ${
                    fade ? "opacity-100" : "opacity-0"
                }`}
                >
                <CldImage
                    src={images[currentImageIndex]}
                    alt="Tampil Anggun"
                    width={500}
                    height={600}
                    crop="fill"
                    className="rounded-2xl w-[280px] h-[380px] lg:w-[340px] lg:h-[480px] rounded-tl-[70px] rounded-br-[70px] lg:rounded-tl-[100px] lg:rounded-br-[100px] rounded-tr-md rounded-bl-md mb-6 lg:mb-0 shadow-[0_8px_25px_rgba(0,0,0,0.6)] object-cover transition-opacity duration-500"
                />
                </motion.div>
            </div>

            <div className="flex-1 order-1 md:order-2 md:-ml-60">
                <motion.h1
                className="text-4xl font-bold text-green-800 leading-snug mb-4"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                >
                Mengapa SanyDressline?
                </motion.h1>
                <motion.p
                className="text-gray-700 mb-6 max-w-xl"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                >
                At SanyDressline, we believe fashion is more than just clothing. It's a
                way to express yourself, embrace your individuality, and feel confident in
                your own skin. Our mission is to provide exclusive, high-quality dresses
                and accessories that cater to every occasion, helping you to look and feel
                your best. From elegant evening wear to casual outfits, SanyDressline is
                here to bring style, comfort, and versatility to your wardrobe. We
                carefully curate our collections to ensure that every piece is not only
                fashionable but also timeless. Join us and discover the difference of
                shopping with SanyDressline!
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