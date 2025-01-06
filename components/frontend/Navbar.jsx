// components/frontend/Navbar.jsx
"use client";
import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import CartIcon from "@/components/frontend/CartIcon";
import { useCart } from "@/context/CartContext";
import logo from "../../public/logo.svg";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Beranda", href: "#home" },
    { name: "Produk", href: "#product-section" },
    { name: "Tentang Kami", href: "#about-us" },
    { name: "Kontak", href: "#" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCartClick = () => {
    router.push("/checkout");
  };

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (pathname === "/checkout") {
      router.push(`/${href}`);
    } else {
      const targetElement = document.querySelector(href);
      if (targetElement) {
        const offset = 180;
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    const phoneNumber = "6289524396489";
    const whatsappMessage = "Halo *SanyDressline*, saya ingin bertanya tentang produk";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.location.href = whatsappUrl;
  };

  return (
    <nav
      className={`fixed top-0 md:px-20 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-lg lg:shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between py-4 px-6 lg:px-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src={logo}
            priority={true}
            alt="SanyDressline Logo"
            width={128}
            height={32}
          />
        </Link>

        {/* Menu untuk Desktop */}
        <div className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={(e) => {
                if (item.name === "Kontak") {
                  e.preventDefault();
                  handleContactClick();
                } else {
                  handleLinkClick(e, item.href);
                }
              }}
            >
              <p className="relative text-gray-700 hover:text-green-700 transition-all duration-300 after:content-[''] after:block after:h-[2px] after:bg-green-700 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                {item.name}
              </p>
            </Link>
          ))}
        </div>

        {/* Cart Icon */}
        <CartIcon itemCount={cartItems.length} onClick={handleCartClick} />

        {/* Hamburger Icon untuk Mobile */}
        <div className={`lg:hidden relative z-50`}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-8 h-8" />
            ) : (
              <Bars3Icon className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Menu untuk Mobile */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed min-h-screen left-0 top-0 w-full bg-white shadow-b-lg shadow-t-0 p-6 z-40"
            >
              <div className="flex flex-col items-center space-y-6">
                {/* Logo di tengah mobile menu */}
                <div className="w-full flex mb-40 justify-center">
                  <Image
                    src={logo}
                    alt="SanyDressline Logo"
                    width={128}
                    height={32}
                  />
                </div>

                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                  >
                    <p className="text-gray-700 hover:text-green-700 transition-all duration-300 w-full text-center">
                      {item.name}
                    </p>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
