'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

const Produk = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/dress'); // Menyesuaikan dengan endpoint API
        if (!response.ok) {
          throw new Error('Gagal mengambil data produk');
        }
        const data = await response.json();

        // Memperbarui state dengan data dari API
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/route?DressID=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Gagal menghapus produk');
      }

      // Hapus produk dari state setelah berhasil dihapus dari server
      setProducts(products.filter((product) => product.DressID !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="w-full my-10">
        <Link href="/dashboard/produk/tambah-produk">
          <div className="max-w-[220px] shadow-lg rounded-lg overflow-hidden mt-20 mb-10 transition duration-300 hover:scale-105 border-2 hover:shadow-md hover:shadow-green-300">
            <div className="flex justify-center">
              <h3 className="text-xl font-medium text-slate-500">Tambah Produk</h3>
            </div>
            <div className="flex justify-center bg-gray-100 py-5">
              <FaPlus className="text-lg md:text-5xl text-green-800" />
            </div>
          </div>
        </Link>
        <h2 className="font-medium text-slate-700 text-xl mt-1 mb-6 lg:text-2xl">Daftar Produk</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.DressID} className="border p-5 rounded shadow">
              <Image
                src={product.ImageURL} // Pastikan nama properti sesuai dengan API
                alt={product.Name}
                width={200}
                height={200}
              />
              <h2 className="text-xl font-semibold mt-3">{product.Name}</h2>
              <p className="text-gray-700 mt-2">Harga: Rp. {product.Price}</p>
              <p className="text-gray-700 mt-2">Stok: {product.Stock}</p>
              <p className="text-gray-700 mt-2">Kategori: {product.Category?.Name || 'Tidak ada'}</p>

              <div className="mt-10 flex justify-center space-x-10">
                <button
                  onClick={() => handleDelete(product.DressID)}
                  className="text-xl text-slate-500 hover:text-green-800 transition-colors"
                  aria-label="Hapus Produk"
                >
                  <FaTrashAlt />
                </button>
                <Link href={`/dashboard/produk/update-produk?id=${product.DressID}`}>
                  <button
                    className="text-xl text-slate-500 hover:text-green-800 transition-colors"
                    aria-label="Edit Produk"
                  >
                    <FaPencilAlt />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Produk;