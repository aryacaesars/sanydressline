"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategories, setNewCategories] = useState([{ name: "" }]);
  const [editCategory, setEditCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          setError(`Error: ${JSON.stringify(error)}`);
        } catch (e) {
          setError(`Error: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Terjadi kesalahan saat mengambil data kategori");
    }
  };

  const handleAddCategoryField = () => {
    setNewCategories([...newCategories, { name: "" }]);
  };

  const handleRemoveCategoryField = (index) => {
    const updatedCategories = newCategories.filter((_, i) => i !== index);
    setNewCategories(updatedCategories);
  };

  const handleCategoryChange = (index, e) => {
    const { value } = e.target;
    const updatedCategories = newCategories.map((category, i) =>
      i === index ? { ...category, name: value } : category
    );
    setNewCategories(updatedCategories);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const names = newCategories.map((category) => category.name);

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ names }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Kategori berhasil ditambahkan: ${JSON.stringify(result)}`);
        setNewCategories([{ name: "" }]);
        fetchCategories(); // Refresh the list after adding new categories
      } else {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          alert(`Error: ${JSON.stringify(error)}`);
        } catch (e) {
          alert(`Error: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menambahkan kategori");
    }
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setEditCategoryName(category.Name);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CategoryID: editCategory.CategoryID,
          Name: editCategoryName,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Kategori berhasil diperbarui: ${JSON.stringify(result)}`);
        setEditCategory(null);
        setEditCategoryName("");
        fetchCategories(); // Refresh the list after updating the category
      } else {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          alert(`Error: ${JSON.stringify(error)}`);
        } catch (e) {
          alert(`Error: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat memperbarui kategori");
    }
  };

  const handleDeleteCategory = async (categoryID) => {
    try {
      const response = await fetch(`/api/category?CategoryID=${categoryID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Kategori berhasil dihapus: ${JSON.stringify(result)}`);
        fetchCategories(); // Refresh the list after deletion
      } else {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          alert(`Error: ${JSON.stringify(error)}`);
        } catch (e) {
          alert(`Error: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus kategori");
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

      <h1>Daftar Kategori</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Nama</th>
            <th>Jumlah Dress</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.CategoryID}>
              <td>{category.CategoryID}</td>
              <td>{category.Name}</td>
              <td>{category.DressCount}</td>
              <td>
                <button onClick={() => handleEditCategory(category)}>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.CategoryID)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Tambah Kategori Baru</h2>
      <form onSubmit={handleAddCategory}>
        {newCategories.map((category, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Nama Kategori"
              value={category.name}
              onChange={(e) => handleCategoryChange(index, e)}
              required
            />
            <button
              type="button"
              onClick={() => handleRemoveCategoryField(index)}
            >
              Hapus
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddCategoryField}>
          Tambah Kategori
        </button>
        <br />
        <button type="submit">Simpan</button>
      </form>

      {editCategory && (
        <div className="popover">
          <h2>Edit Kategori</h2>
          <form onSubmit={handleUpdateCategory}>
            <label htmlFor="editCategoryName">Nama Kategori:</label>
            <input
              type="text"
              id="editCategoryName"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              required
            />
            <br />
            <button type="submit">Perbarui</button>
            <button type="button" onClick={() => setEditCategory(null)}>
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
