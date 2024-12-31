"use client";

import { useState } from "react";

const ProductForm = () => {
  const [productData, setProductData] = useState({
    name: "",
    sizes: {},
    description: "",
    price: "",
    images: [],
    isActive: true,
  });
  const [selectedSize, setSelectedSize] = useState("");
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing !== null) {
      const updatedProducts = products.map((product, index) =>
        index === isEditing ? productData : product
      );
      setProducts(updatedProducts);
      setIsEditing(null);
    } else {
      setProducts([...products, productData]);
    }
    setProductData({
      name: "",
      sizes: {},
      description: "",
      price: "",
      images: [],
      isActive: true,
    });
    setSelectedSize("");
  };

  const handleDelete = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setProductData(products[index]);
    setIsEditing(index);
  };

  const handleSizeClick = (size) => {
    setSelectedSize((prevSize) => (prevSize === size ? "" : size));
  };

  const handleStockChange = (e) => {
    setProductData({
      ...productData,
      sizes: {
        ...productData.sizes,
        [selectedSize]: e.target.value,
      },
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productData.images.length > 2) {
      alert("You can only upload up to 2 images.");
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

  const toggleProductStatus = (index) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, isActive: !product.isActive } : product
    );
    setProducts(updatedProducts);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {isEditing !== null ? "Edit Product" : "Add New Product"}
        </h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {showForm ? "Hide Form" : "Show Form"}
        </button>
      </div>

      {showForm && (
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
                value={productData.sizes[selectedSize] || ""}
                onChange={handleStockChange}
              />
            )}

            <textarea
              placeholder="Deskripsi"
              className="block w-full p-2 border border-gray-300 rounded"
              value={productData.description}
              onChange={(e) =>
                setProductData({ ...productData, description: e.target.value })
              }
            ></textarea>
            <input
              type="number"
              placeholder="Harga"
              className="block w-full p-2 border border-gray-300 rounded"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
            />
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
              {isEditing !== null ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Product List</h3>
        {products.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Nama</th>
                <th className="border px-4 py-2 text-left">Sizes</th>
                <th className="border px-4 py-2 text-left">Harga</th>
                <th className="border px-4 py-2 text-left">Deskripsi</th>
                <th className="border px-4 py-2 text-left">Gambar</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">
                    {Object.entries(product.sizes).map(([size, stock]) => (
                      <div key={size}>
                        {size}: {stock} pcs
                      </div>
                    ))}
                  </td>
                  <td className="border px-4 py-2">Rp{product.price}</td>
                  <td className="border px-4 py-2">{product.description}</td>
                  <td className="border px-4 py-2">
                    {product.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image.preview}
                        alt={product.name}
                        className="w-16 h-16 object-cover mt-2 rounded border"
                      />
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                  <button
                      onClick={() => toggleProductStatus(index)}
                      className={`px-4 py-2 rounded text-white ${
                        product.isActive ? "bg-green-600" : "bg-gray-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="px-4 py-2 rounded-xl text-white bg-blue-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(index)}
                        className="px-4 py-2 rounded-xl text-white bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">Belum ada produk yang ditambahkan.</p>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
