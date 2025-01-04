"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AllDresses() {
  const [dresses, setDresses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [editDress, setEditDress] = useState(null);
  const [editForm, setEditForm] = useState({
    Name: "",
    Description: "",
    Price: "",
    OrderCount: "",
    IsVisible: false,
    CategoryID: "",
    Sizes: [{ Size: "", Stock: "" }],
  });
  const [newImages, setNewImages] = useState([{ file: null, error: "" }]);

  useEffect(() => {
    fetchDresses();
    fetchCategories();
  }, []);

  const fetchDresses = async () => {
    try {
      const response = await fetch("/api/dresses");
      if (response.ok) {
        const data = await response.json();
        setDresses(data);
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
      console.error("Error fetching dresses:", error);
      setError("Terjadi kesalahan saat mengambil data dress");
    }
  };

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

  const handleDelete = async (dressID) => {
    try {
      const response = await fetch(`/api/dress?DressID=${dressID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Dress berhasil dihapus: ${JSON.stringify(result)}`);
        fetchDresses(); // Refresh the list after deletion
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
      alert("Terjadi kesalahan saat menghapus dress");
    }
  };

  const handleEdit = (dress) => {
    setEditDress(dress);
    setEditForm({
      Name: dress.Name,
      Description: dress.Description,
      Price: dress.Price,
      OrderCount: dress.OrderCount,
      IsVisible: dress.IsVisible,
      CategoryID: dress.Category.CategoryID,
      Sizes: dress.Sizes.map((size) => ({
        Size: size.Size,
        Stock: size.Stock,
      })),
    });
    setNewImages([{ file: null, error: "" }]);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleEditSizeChange = (index, e) => {
    const { name, value } = e.target;
    const newSizes = editForm.Sizes.map((size, i) =>
      i === index ? { ...size, [name]: value } : size
    );
    setEditForm({ ...editForm, Sizes: newSizes });
  };

  const handleAddEditSize = () => {
    setEditForm({
      ...editForm,
      Sizes: [...editForm.Sizes, { Size: "", Stock: "" }],
    });
  };

  const handleRemoveEditSize = (index) => {
    const newSizes = editForm.Sizes.filter((_, i) => i !== index);
    setEditForm({ ...editForm, Sizes: newSizes });
  };

  const handleNewImageChange = (index, e) => {
    const file = e.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    const error = !validImageTypes.includes(file.type)
      ? `${file.name} is not a valid image file.`
      : "";

    const updatedNewImages = newImages.map((image, i) =>
      i === index ? { file, error } : image
    );
    setNewImages(updatedNewImages);
  };

  const handleAddNewImage = () => {
    setNewImages([...newImages, { file: null, error: "" }]);
  };

  const handleRemoveNewImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
  };

  const handleRemoveExistingImage = async (imageID) => {
    try {
      const response = await fetch(`/api/dress/image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageIDs: [imageID] }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Gambar berhasil dihapus: ${JSON.stringify(result)}`);

        // Update the state to remove the deleted image
        setDresses((prevDresses) =>
          prevDresses.map((dress) => ({
            ...dress,
            Image: dress.Image.filter((image) => image.ImageID !== imageID),
          }))
        );
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
      alert("Terjadi kesalahan saat menghapus gambar");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", editForm.Name);
    formData.append("Description", editForm.Description);
    formData.append("Price", editForm.Price);
    formData.append("OrderCount", editForm.OrderCount);
    formData.append("IsVisible", editForm.IsVisible);
    formData.append("CategoryID", editForm.CategoryID);
    formData.append("Sizes", JSON.stringify(editForm.Sizes));

    try {
      const response = await fetch(`/api/dress?DressID=${editDress.DressID}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Dress berhasil diperbarui: ${JSON.stringify(result)}`);
        setEditDress(null);
        fetchDresses(); // Refresh the list after update
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
      alert("Terjadi kesalahan saat memperbarui dress");
    }

    // Upload new images
    const imageFormData = new FormData();
    newImages.forEach((image) => {
      if (image.file) {
        imageFormData.append("Image", image.file);
      }
    });

    try {
      const imageResponse = await fetch(
        `/api/dress/image?DressID=${editDress.DressID}`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      if (imageResponse.ok) {
        const imageResult = await imageResponse.json();
        alert(`Gambar berhasil ditambahkan: ${JSON.stringify(imageResult)}`);
        fetchDresses(); // Refresh the list after image upload
      } else {
        const errorText = await imageResponse.text();
        try {
          const error = JSON.parse(errorText);
          alert(`Error: ${JSON.stringify(error)}`);
        } catch (e) {
          alert(`Error: ${errorText}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menambahkan gambar");
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

      <h1>Daftar Dress</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Dress ID</th>
            <th>Nama</th>
            <th>Deskripsi</th>
            <th>Harga</th>
            <th>Jumlah Pesanan</th>
            <th>Aktif</th>
            <th>Kategori</th>
            <th>Ukuran dan Stok</th>
            <th>Gambar</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dresses.map((dress) => (
            <tr key={dress.DressID}>
              <td>{dress.DressID}</td>
              <td>{dress.Name}</td>
              <td>{dress.Description}</td>
              <td>{dress.PriceFormatted}</td>
              <td>{dress.OrderCount}</td>
              <td>{dress.IsVisible ? "Ya" : "Tidak"}</td>
              <td>{dress.Category.Name}</td>
              <td>
                {dress.Sizes.map((size) => (
                  <div key={size.SizeID}>
                    {size.Size}: {size.Stock}
                  </div>
                ))}
              </td>
              <td>
                {dress.Image.map((image) => (
                  <div key={image.ImageID}>
                    <Image
                      src={image.Url}
                      alt={image.Alt}
                      width={50}
                      height={50}
                    />
                  </div>
                ))}
              </td>
              <td>
                <button onClick={() => handleEdit(dress)}>Edit</button>
                <button onClick={() => handleDelete(dress.DressID)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editDress && (
        <div className="popover">
          <h2>Edit Dress</h2>
          <form onSubmit={handleEditSubmit}>
            <label htmlFor="editName">Nama Dress:</label>
            <input
              type="text"
              id="editName"
              name="Name"
              value={editForm.Name}
              onChange={handleEditChange}
              required
            />
            <br />
            <br />

            <label htmlFor="editDescription">Deskripsi:</label>
            <textarea
              id="editDescription"
              name="Description"
              value={editForm.Description}
              onChange={handleEditChange}
              required
            ></textarea>
            <br />
            <br />

            <label htmlFor="editPrice">Harga:</label>
            <input
              type="number"
              id="editPrice"
              name="Price"
              value={editForm.Price}
              onChange={handleEditChange}
              required
            />
            <br />
            <br />

            <label htmlFor="editOrderCount">Jumlah Pesanan:</label>
            <input
              type="number"
              id="editOrderCount"
              name="OrderCount"
              value={editForm.OrderCount}
              onChange={handleEditChange}
              required
            />
            <br />
            <br />

            <label htmlFor="editIsVisible">Terlihat di Katalog:</label>
            <input
              type="checkbox"
              id="editIsVisible"
              name="IsVisible"
              checked={editForm.IsVisible}
              onChange={handleEditChange}
            />
            <br />
            <br />

            <label htmlFor="editCategoryID">Kategori:</label>
            <select
              id="editCategoryID"
              name="CategoryID"
              value={editForm.CategoryID}
              onChange={handleEditChange}
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
            {editForm.Sizes.map((size, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="Size"
                  placeholder="Ukuran"
                  value={size.Size}
                  onChange={(e) => handleEditSizeChange(index, e)}
                  required
                />
                <input
                  type="number"
                  name="Stock"
                  placeholder="Stok"
                  value={size.Stock}
                  onChange={(e) => handleEditSizeChange(index, e)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveEditSize(index)}
                >
                  Hapus
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddEditSize}>
              Tambah Ukuran
            </button>
            <br />
            <br />

            <label>Tambah Gambar:</label>
            {newImages.map((image, index) => (
              <div key={index}>
                <input
                  type="file"
                  name="Image"
                  onChange={(e) => handleNewImageChange(index, e)}
                />
                {image.error && <p style={{ color: "red" }}>{image.error}</p>}
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                >
                  Hapus
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddNewImage}>
              Tambah Gambar
            </button>
            <br />
            <br />

            {editDress.Image.map((image) => (
              <div key={image.ImageID}>
                <Image src={image.Url} alt={image.Alt} width={50} height={50} />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(image.ImageID)}
                >
                  Hapus
                </button>
              </div>
            ))}
            <br />

            <button type="submit">Perbarui Dress</button>
            <button type="button" onClick={() => setEditDress(null)}>
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
