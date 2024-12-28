'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TambahProduk() {
  const router = useRouter();
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
      const response = await fetch('/api/produk', {
        method: 'POST',
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
        throw new Error(data.error || 'Gagal menambahkan produk');
      }

      setSuccessMessage('Produk berhasil ditambahkan!');

      setTimeout(() => {
        router.push('/dashboard/produk');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 shadow-lg rounded-lg bg-white max-w-sm mx-auto">
      <h2 className="text-center text-xl font-semibold mb-4">Tambah Produk</h2>
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
      <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 mb-4 border rounded-md" required />
      {isLoading && <p className="text-secondary mb-4">Mengunggah gambar...</p>}
      <button type="submit" className="w-full p-2 bg-green-800 text-white rounded-xl hover:bg-green-500">
        Simpan
      </button>
    </form>
  );
}