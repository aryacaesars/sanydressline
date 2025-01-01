"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    sizes: [],
    description: "",
    price: "",
    images: [],
    isActive: true,
    categoryID: "",
  });
  const [selectedSize, setSelectedSize] = useState("");
  const [stock, setStock] = useState("");
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, sizes, description, price, images, categoryID } = productData;

    if (!name || !sizes.length || !description || !price || !images.length || !categoryID) {
      setErrorMessage('Semua field harus diisi dengan benar');
      return;
    }

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("Price", price);
    formData.append("CategoryID", categoryID);
    formData.append("Sizes", JSON.stringify(sizes));
    images.forEach((image) => {
      formData.append("Image", image.file);
    });

    try {
      const response = await fetch('/api/dress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Gagal menambah produk');
      }

      setSuccessMessage('Produk berhasil ditambahkan!');

      setTimeout(() => {
        router.push('/dashboard/produk');
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
    const sizeData = productData.sizes.find((s) => s.Size === size);
    setStock(sizeData ? sizeData.Stock : "");
  };

  const handleStockChange = (e) => {
    setStock(e.target.value);
    setProductData((prevData) => {
      const sizes = prevData.sizes.map((size) =>
        size.Size === selectedSize ? { ...size, Stock: e.target.value } : size
      );
      if (!sizes.find((size) => size.Size === selectedSize)) {
        sizes.push({ Size: selectedSize, Stock: e.target.value });
      }
      return { ...prevData, sizes };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productData.images.length > 2) {
      alert("Only 2 images can be uploaded");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setProductData({ ...productData, images: [...productData.images, ...newImages] });
  };

  const handleImageDelete = (index) => {
    const updatedImages = productData.images.filter((_, i) => i !== index);
    setProductData({ ...productData, images: updatedImages });
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-xl font-semibold mb-4">
        Add New Product
      </h2>
      {errorMessage && <p className="text-red-700 mb-4">{errorMessage}</p>}
      {successMessage && <p className="text-green-700 mb-4">{successMessage}</p>}

      <ProductFormComponent
        productData={productData}
        selectedSize={selectedSize}
        stock={stock}
        handleSubmit={handleSubmit}
        handleSizeClick={handleSizeClick}
        handleStockChange={handleStockChange}
        handleImageUpload={handleImageUpload}
        handleImageDelete={handleImageDelete}
        setProductData={setProductData}
        categories={categories}
      />
    </div>
  );
};

const ProductFormComponent = ({
  productData,
  selectedSize,
  stock,
  handleSubmit,
  handleSizeClick,
  handleStockChange,
  handleImageUpload,
  handleImageDelete,
  setProductData,
  categories,
}) => (
  <div>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Nama Dress"
        className="block w-full p-2 border border-gray-300 rounded"
        value={productData.name}
        onChange={(e) => setProductData({ ...productData, name: e.target.value })}
      />

      <div className="flex space-x-2">
        {["S", "M", "L", "XL"].map((size) => (
          <button
            type="button"
            key={size}
            className={`px-4 py-2 border rounded ${
              selectedSize === size ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleSizeClick(size)}
          >
            {size}
          </button>
        ))}
      </div>

      {selectedSize && (
        <input
          type="number"
          placeholder={`Stok untuk ukuran ${selectedSize}`}
          className="block w-full p-2 border border-gray-300 rounded mt-2"
          value={stock}
          onChange={handleStockChange}
        />
      )}

      <textarea
        placeholder="Deskripsi"
        className="block w-full p-2 border border-gray-300 rounded"
        value={productData.description}
        onChange={(e) => setProductData({ ...productData, description: e.target.value })}
      ></textarea>
      <input
        type="number"
        placeholder="Harga"
        className="block w-full p-2 border border-gray-300 rounded"
        value={productData.price}
        onChange={(e) => setProductData({ ...productData, price: e.target.value })}
      />

      <select
        className="block w-full p-2 border border-gray-300 rounded"
        value={productData.categoryID}
        onChange={(e) => setProductData({ ...productData, categoryID: e.target.value })}
      >
        <option value="" disabled>Pilih Kategori</option>
        {categories.map((category) => (
          <option key={category.CategoryID} value={category.CategoryID}>
            {category.Name}
          </option>
        ))}
      </select>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <label
            htmlFor="upload-image"
            className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded"
          >
            Upload Gambar
          </label>
          <input
            id="upload-image"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <div className="flex space-x-4">
          {productData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.preview}
                alt="Preview"
                className="w-32 h-32 object-cover border rounded"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                onClick={() => handleImageDelete(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
        Add Product
      </button>
    </form>
  </div>
);

ProductFormComponent.propTypes = {
  productData: PropTypes.object.isRequired,
  selectedSize: PropTypes.string.isRequired,
  stock: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleSizeClick: PropTypes.func.isRequired,
  handleStockChange: PropTypes.func.isRequired,
  handleImageUpload: PropTypes.func.isRequired,
  handleImageDelete: PropTypes.func.isRequired,
  setProductData: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
};

export default AddProduct;