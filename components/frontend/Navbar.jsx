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
    const phoneNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER;
    const whatsappMessage =
      "Halo *SanyDressline*, saya ingin bertanya tentang produk";
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
        {/* Mobile View: Logo, Cart Icon, Hamburger */}
        <div className="lg:hidden flex items-center justify-between w-full">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo}
              priority={true}
              alt="SanyDressline Logo"
              width={100}
              height={28}
            />
          </Link>
          <div className="flex items-center space-x-4">
            <CartIcon itemCount={cartItems.length} onClick={handleCartClick} />
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
        </div>

        {/* Desktop View: Menu Items */}
        <div className="hidden lg:flex items-center justify-between w-full">
          <Link href="/" className="flex-shrink-0">
            <Image
              src={logo}
              priority={true}
              alt="SanyDressline Logo"
              width={128}
              height={32}
            />
          </Link>
          <div className="flex items-center space-x-8">
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
          <CartIcon itemCount={cartItems.length} onClick={handleCartClick} />
        </div>

        {/* Mobile Menu */}
{/* Mobile Menu */}
<AnimatePresence>
  {isMenuOpen && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="lg:hidden fixed min-h-screen left-0 top-0 w-full bg-white shadow-lg p-6 z-40"
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Close button */}
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-700 focus:outline-none"
          >
            <XMarkIcon className="w-8 h-8" />
          </button>
        </div>

        {/* Logo di tengah mobile menu */}
        <div className="w-full flex mb-auto justify-center">
          <Image
            src={logo}
            alt="SanyDressline Logo"
            width={128}
            height={32}
          />
        </div>

        {/* Menu Items */}
        <div className="flex flex-col items-center space-y-6">
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
      </div>
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </nav>
  );
};

export default Navbar;
