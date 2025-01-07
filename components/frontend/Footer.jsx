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
    if (href.startsWith("http")) return;

    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offset = 180;
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
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
    <footer id="footer" className="bg-green-800 text-white py-10 px-6 md:px-20">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Logo dan Media Sosial */}
        <div className="text-center md:text-left">
          <Link href="/" legacyBehavior>
            <Image src={logo} alt="SanyDressline Logo" width={128} height={32} priority className="mx-auto md:mx-0"/>
          </Link>
          <p className="font-bold text-lg mt-4 mb-4">Sosial Media</p>
          <div className="flex justify-center md:justify-start space-x-4">
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-white hover:text-gray-300" size={20} />
            </Link>
            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-white hover:text-gray-300" size={20} />
            </Link>
            <Link
              href="https://www.instagram.com/sanydressline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-white hover:text-gray-300" size={20} />
            </Link>
          </div>
        </div>

        {/* Navigasi */}
        <div className="text-center md:text-left">
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
              className="block text-white hover:text-green-200 transition duration-300"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Informasi */}
        <div className="text-center md:text-left">
          <p className="font-bold text-lg mb-4">Informasi</p>
          <a href="https://maps.app.goo.gl/yZ9itjLNrb5SRoZKA" target="blank">
          <p className="text-white font-bold">Alamat: <span className="font-normal"><br />Perum De Nirwana Garden, Jl. Bebedahan 1 No.01 Blok D, Sukanagara, Purbaratu, Tasikmalaya Regency, West Java </span> </p>
          </a>
          <p className="text-white font-bold">Email: <span className="font-normal"><br />sanydressline@gmail.com</span></p>
          <p className="text-white font-bold">No. Handphone: <span className="font-normal"><br />0895361619535</span></p> 
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
        <p className="mt-4">&copy; 2025 SanyDressline. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
