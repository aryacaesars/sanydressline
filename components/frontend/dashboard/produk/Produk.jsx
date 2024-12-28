'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaPlus, FaTrashAlt, FaPencilAlt } from 'react-icons/fa';

const dummyProducts = [
    {
      id: 1,
      name: 'Product 1',
      description: 'Desc product 1',
      price: '100.000',
      stock: 10,
      category: 'Category 1',
      status: 'Ready',
      image: '/images/product1.jpg',
    },
    {
      id: 2,
      name: 'Product 2',
      description: 'Desc product 2',
      price: '200.000',
      stock: 20,
      category: 'Category 2',
      status: 'Ready',
      image: '/images/product2.jpg',
    },
    {
      id: 3,
      name: 'Product 3',
      description: 'Desc product 3',
      price: '300.000',
      stock: 30,
      category: 'Category 1',
      status: 'Not Ready',
      image: '/images/product3.jpg',
    },
    {
      id: 4,
      name: 'Product 4',
      description: 'Desc product 4',
      price: '400.000',
      stock: 40,
      category: 'Category 2',
      status: 'Not Ready',
      image: '/images/product4.jpg',
    },
  ];

export default function Produk() {
    const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Simulate fetching data from an API
        const data = await new Promise((resolve) => {
          setTimeout(() => resolve(dummyProducts), 1000);
        });
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <>
      {/* Dashboard */}
      <div className="w-full my-10">
        <Link href="/dashboard/produk/tambah-produk">
          <div className="max-w-[220px] shadow-lg rounded-lg overflow-hidden mt-20 mb-10 trasition duration-300 hover:scale-105 border-2 hover:shadow-md hover:shadow-green-300">
            <div className="flex justify-center">
              <h3 className="text-xl font-medium text-slate-500">Tambah Produk</h3>
            </div>
            <div className="flex justify-center bg-gray-100 py-5">
              <FaPlus className="text-lg md:text-5xl text-green-800"/>
            </div>
          </div>
        </Link>
        <h2 className="font-medium text-slate-700 text-xl mt-1 mb-6 lg:text-2xl">Daftar Produk</h2>
        
        {/* Detail Produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-5 rounded shadow">
              <Image src={product.image} alt={product.name} width={200} height={200} />
              <h2 className="text-xl font-semibold mt-3">{product.name}</h2>
              <p className="text-gray-700 mt-2">Harga : Rp. {product.price}</p>
              <p className="text-gray-700 mt-2">Stok : {product.stock}</p>
              <p className="text-gray-700 mt-2">Kategori : {product.category}</p>
              <p className="text-gray-700 mt-2">Status : {product.status}</p>
              
            {/* Aksi Produk */}
            <div className="mt-10 flex justify-center space-x-10">
                <button
                className="text-xl text-slate-500 hover:text-green-800 transition-colors"
                aria-label="Hapus Buku"
                >
                <FaTrashAlt />
                </button>
                <Link href={`/dashboard/produk/update-produk?id=${product.id}`}>
                  <button
                    className="text-xl text-slate-500 hover:text-green-800 transition-colors"
                    aria-label="Edit Buku"
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
}