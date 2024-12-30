'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function UpdateProduk() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    status: '',
    image: null,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = dummyProducts.find((p) => p.id === parseInt(productId, 10));
        if (!product) {
          throw new Error('Produk tidak ditemukan');
        }
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category,
          status: product.status,
          image: product.image,
        });
      } catch (error) {
        setErrorMessage(error.message);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formDataFile = new FormData();
    formDataFile.append('file', file);

    setIsLoading(true);
    setUploadError('');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataFile,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengunggah gambar');
      }

      const data = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        image: data.url,
      }));
    } catch (error) {
      setUploadError('Gagal mengunggah gambar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, stock, category, status, image } = formData;

    if (!name || !description || !price || !stock || !category || !status || !image) {
      setErrorMessage('Semua field harus diisi dengan benar');
      return;
    }

    if (isNaN(stock) || isNaN(price)) {
      setErrorMessage('Stok dan Harga harus berupa angka');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`/api/produk/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price: parseInt(price, 10),
          stock: parseInt(stock, 10),
          category,
          status,
          image,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal memperbarui produk');
      }

      setSuccessMessage('Produk berhasil diperbarui!');

      setTimeout(() => {
        router.push('/dashboard/produk');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 shadow-lg rounded-lg bg-white max-w-sm mx-auto">
      <h2 className="text-center text-xl font-semibold mb-4">Update Produk</h2>
      {errorMessage && <p className="text-red-700 mb-4">{errorMessage}</p>}
      {uploadError && <p className="text-red-700 mb-4">{uploadError}</p>}
      {successMessage && <p className="text-secondary mb-4">{successMessage}</p>}
      <input type="text" name="name" placeholder="Nama Produk" value={formData.name} onChange={handleChange} className="w-full p-2 mb-4 border rounded-md" required />
      <textarea name="description" placeholder="Deskripsi Produk" value={formData.description} onChange={handleChange} className="w-full p-2 mb-4 border rounded-md" rows="4" required />
      <input type="number" name="price" placeholder="Harga Produk" value={formData.price} onChange={handleChange} className="w-full p-2 mb-4 border rounded-md" required />
      <input type="number" name="stock" placeholder="Stok" value={formData.stock} onChange={handleChange} className="w-full p-2 mb-4 border rounded-md" required />
      <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 mb-4 border rounded-md" required>
        <option value="">Pilih Kategori</option>
        <option value="Category 1">Category 1</option>
        <option value="Category 2">Category 2</option>
      </select>
      <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 mb-4 border rounded-md" required>
        <option value="">Pilih Status</option>
        <option value="Ready">Ready</option>
        <option value="Not Ready">Not Ready</option>
      </select>
      <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 mb-4 border rounded-md" />
      {isLoading && <p className="text-secondary mb-4">Mengunggah gambar...</p>}
      <button type="submit" className="w-full p-2 bg-green-800 text-white rounded-xl hover:bg-green-500">
        Perbarui
      </button>
    </form>
  );
}