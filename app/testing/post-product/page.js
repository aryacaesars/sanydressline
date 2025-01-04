"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const [form, setForm] = useState({
    Name: "",
    Description: "",
    Price: "",
    OrderCount: "",
    IsVisible: false,
    CategoryID: "",
    Sizes: [{ Size: "", Stock: "" }],
    Images: [{ file: null, error: "" }],
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSizeChange = (index, e) => {
    const { name, value } = e.target;
    const newSizes = form.Sizes.map((size, i) =>
      i === index ? { ...size, [name]: value } : size
    );
    setForm({ ...form, Sizes: newSizes });
  };

  const handleAddSize = () => {
    setForm({ ...form, Sizes: [...form.Sizes, { Size: "", Stock: "" }] });
  };

  const handleRemoveSize = (index) => {
    const newSizes = form.Sizes.filter((_, i) => i !== index);
    setForm({ ...form, Sizes: newSizes });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const error = !validImageTypes.includes(file.type)
      ? `${file.name} is not a valid image file.`
      : "";

    const newImages = form.Images.map((image, i) =>
      i === index ? { file, error } : image
    );
    setForm({ ...form, Images: newImages });
  };

  const handleAddImage = () => {
    setForm({ ...form, Images: [...form.Images, { file: null, error: "" }] });
  };

  const handleRemoveImage = (index) => {
    const newImages = form.Images.filter((_, i) => i !== index);
    setForm({ ...form, Images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", form.Name);
    formData.append("Description", form.Description);
    formData.append("Price", form.Price);
    formData.append("OrderCount", form.OrderCount);
    formData.append("IsVisible", form.IsVisible);
    formData.append("CategoryID", form.CategoryID);
    formData.append("Sizes", JSON.stringify(form.Sizes));

    form.Images.forEach((image) => {
      if (image.file) {
        formData.append("Image", image.file);
      }
    });

    try {
      const response = await fetch("/api/dress", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Dress berhasil dibuat: " + JSON.stringify(result));
      } else {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          alert("Error: " + JSON.stringify(error));
        } catch (e) {
          alert("Error: " + errorText);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat membuat dress");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button onClick={() => (window.location.href = "/testing/post-category")}>
        Tambah kategori
      </Button>
      <Button onClick={() => (window.location.href = "/testing/post-product")}>
        Tambah product
      </Button>
      <Button
        onClick={() => (window.location.href = "/testing/get-all-product")}
      >
        Semua product
      </Button>

      <h1>Buat Dress Baru</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nama Dress:</label>
        <input
          type="text"
          id="name"
          name="Name"
          placeholder="Nama Dress"
          value={form.Name}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="description">Deskripsi:</label>
        <textarea
          id="description"
          name="Description"
          placeholder="Deskripsi"
          value={form.Description}
          onChange={handleChange}
          required
        ></textarea>
        <br />
        <br />

        <label htmlFor="price">Harga:</label>
        <input
          type="number"
          id="price"
          name="Price"
          placeholder="Harga"
          value={form.Price}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="orderCount">Sudah dipesan berapa kali:</label>
        <input
          type="number"
          id="orderCount"
          name="OrderCount"
          placeholder="Order Count"
          value={form.OrderCount}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <label htmlFor="isVisible">Tampilkan di Katalog:</label>
        <input
          type="checkbox"
          id="isVisible"
          name="IsVisible"
          checked={form.IsVisible}
          onChange={handleChange}
        />
        <br />
        <br />

        <label htmlFor="categoryID">ID Kategori:</label>
        <select
          id="categoryID"
          name="CategoryID"
          value={form.CategoryID}
          onChange={handleChange}
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((category) => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.Name}
            </option>
          ))}
        </select>
        <br />
        <br />

        <label>Ukuran dan Stok:</label>
        {form.Sizes.map((size, index) => (
          <div key={index}>
            <input
              type="text"
              name="Size"
              placeholder="Ukuran"
              value={size.Size}
              onChange={(e) => handleSizeChange(index, e)}
              required
            />
            <input
              type="number"
              name="Stock"
              placeholder="Stok"
              value={size.Stock}
              onChange={(e) => handleSizeChange(index, e)}
              required
            />
            <button type="button" onClick={() => handleRemoveSize(index)}>
              Hapus
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddSize}>
          Tambah Ukuran
        </button>
        <br />
        <br />

        <label>Gambar:</label>
        {form.Images.map((image, index) => (
          <div key={index}>
            <input
              type="file"
              name="Image"
              onChange={(e) => handleImageChange(index, e)}
              required
            />
            {image.error && <p style={{ color: "red" }}>{image.error}</p>}
            <button type="button" onClick={() => handleRemoveImage(index)}>
              Hapus
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddImage}>
          Tambah Gambar
        </button>
        <br />
        <br />

        <button type="submit">Buat Dress</button>
      </form>
    </div>
  );
}
