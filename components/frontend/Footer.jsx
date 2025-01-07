"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/logo-footer.png";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  const menuItems = [
    { name: "Beranda", href: "#home" },
    { name: "Produk", href: "#product-section" },
    { name: "Tentang Kami", href: "#about-us" },
    { name: "Kontak", href: "#" },
  ];

  const handleLinkClick = (e, href) => {
    if (href.startsWith("http")) {
      return;
    }

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
  };

  const handleContactClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER;
    const whatsappMessage = "Halo *SanyDressline*, saya ingin bertanya tentang produk";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.location.href = whatsappUrl;
  };

  return (
    <footer id="footer" className="bg-green-800 text-white py-10 px-20">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-8 text-sm">
        {/* Logo dan Media Sosial */}
        <div className="lg:px-5">
          <Link href="/" legacyBehavior>
            <Image
              src={logo}
              alt="SanyDressline Logo"
              width={128}
              height={32}
              priority={true}
            />
          </Link>
          <p className="font-bold text-lg mt-8 mb-4 lg:px-1">Sosial Media</p>
          <div className="flex space-x-4 lg:px-2">
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-white hover:text-gray-300" size={20} />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook
                className="text-white hover:text-gray-300"
                size={20}
              />
            </Link>
            <Link
              href="https://www.instagram.com/sanydressline?igsh=MXBnZTd2NHZ0bHhjMA=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                className="text-white hover:text-gray-300"
                size={20}
              />
            </Link>
          </div>
        </div>

        {/* Navigasi */}
        <div className="flex flex-col space-y-4">
          <p className="font-bold text-lg mb-4">Navigasi</p>
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
              <p className="text-white hover:text-green-200 transition-all duration-300">
                {item.name}
              </p>
            </Link>
          ))}
        </div>

        {/* Informasi */}
        <div className="flex flex-col space-y-4">
          <p className="font-bold text-lg mb-4">Informasi</p>
          <div className="mb-4">
            <p className="text-white">Alamat : Jl. Jalan No. 123, Jakarta</p>
          </div>
          <div className="mb-4">
            <p className="text-white">Email : sanydressline@mail.com</p>
          </div>
          <div className="mb-4">
            <p className="text-white">No. Handphone : +62 812-3456-7890</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white mt-8 pt-4 text-center text-sm">
        <div className="flex justify-center space-x-4">
          <Link href="/" legacyBehavior>
            <a className="hover:underline">Terms</a>
          </Link>
          <Link href="/" legacyBehavior>
            <a className="hover:underline">Privacy</a>
          </Link>
          <Link href="/" legacyBehavior>
            <a className="hover:underline">Cookies</a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
