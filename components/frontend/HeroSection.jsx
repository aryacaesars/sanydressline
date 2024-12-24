import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-white rounded-2xl shadow-lg p-6 md:p-10 gap-6 md:gap-10">
      {/* Text Content */}
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
        <button className="bg-green-800 text-white py-3 px-6 rounded-md shadow-md hover:bg-green-900">
          JELAJAHI SEKARANG!
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex justify-center">
        <Image
          src="/path-to-your-image.jpg" // Ganti dengan path gambar yang Anda gunakan
          alt="Tampil Anggun"
          width={500}
          height={600}
          className="rounded-2xl shadow-md"
        />
      </div>
    </section>
  );
};

export default HeroSection;
