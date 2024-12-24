"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/logo-footer.png';
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';


const Footer = () => {
  const menuItems = [
    { name: "Beranda", href: "#beranda" },
    { name: "Produk", href: "#produk" },
    { name: "Tentang Kami", href: "#tentang-kami" },
    { name: "Kontak", href: "#kontak" },
  ];

  return (
    <footer id="footer" className="bg-green-800 text-white py-10">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-8 text-sm">
        {/* Logo and Social Media */}
        <div className="text-center lg:text-left lg:px-5">
          <Link href="/" legacyBehavior>
              <Image
                src={logo}
                alt="SanyDressline Logo"
                width={128}
                height={32}
                priority={true}
              />
          </Link>
            <p className="font-bold text-lg mt-8 mb-4">Sosial Media</p>
            <div className="flex justify-center lg:justify-start space-x-4">
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="text-white hover:text-gray-300" size={20} />
                </Link>
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="text-white hover:text-gray-300" size={20} />
                </Link>
                <Link href="https://www.instagram.com/sanydressline?igsh=MXBnZTd2NHZ0bHhjMA==" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-white hover:text-gray-300" size={20} />
                </Link>
            </div>
        </div>

        {/* Shop Links */}
        <div className="text-center lg:text-left">
          <p className="font-bold text-lg mb-4">Navigasi</p>
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} legacyBehavior className="hover:underline">{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Email Form */}
        <div className="text-center lg:text-left">
          <p className="font-bold text-lg mb-4">Kirim Pesan</p>
          <form>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                name="email"
                className="w-64 px-3 py-2 text-black rounded-xl"
                placeholder='Masukkan email Anda'
                required
              />
            </div>
            <div className="mb-4">
              <textarea
                id="message"
                name="message"
                className="w-64 px-3 py-2 text-black rounded-xl"
                rows="4"
                placeholder='Tulis pesan Anda'
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-white hover:bg-slate-200 text-green-800 hover:text-green-700 font-bold py-2 px-4 rounded"
            >
              Kirim
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white mt-8 pt-4 text-center text-sm">
        <div className="flex justify-center space-x-4">
          <Link href="/" legacyBehavior><a className="hover:underline">Terms</a></Link>
          <Link href="/" legacyBehavior><a className="hover:underline">Privacy</a></Link>
          <Link href="/" legacyBehavior><a className="hover:underline">Cookies</a></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;