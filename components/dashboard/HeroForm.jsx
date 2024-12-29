"use client";

import { useState } from "react";

const HeroForm = () => {
  const [heroData, setHeroData] = useState({ title: "", subtitle: "", images: [], isActive: true });
  const [heroes, setHeroes] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(true); // State untuk kontrol form visibility
  const [editingIndex, setEditingIndex] = useState(null); // Menyimpan indeks hero yang sedang diedit

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingIndex !== null) {
      // Jika sedang mengedit hero yang sudah ada
      const updatedHeroes = heroes.map((hero, index) =>
        index === editingIndex ? heroData : hero
      );
      setHeroes(updatedHeroes);
      setEditingIndex(null); // Reset status editing
    } else {
      // Menambahkan hero baru
      setHeroes([...heroes, heroData]);
    }

    setHeroData({ title: "", subtitle: "", images: [], isActive: true });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setHeroData({ ...heroData, images: [...heroData.images, ...imagePreviews] });
  };

  const handleImageDelete = (index) => {
    setHeroData({
      ...heroData,
      images: heroData.images.filter((_, i) => i !== index),
    });
  };

  const handleDeleteHero = (index) => {
    setHeroes(heroes.filter((_, i) => i !== index));
  };

  const toggleHeroActive = (index) => {
    setHeroes(
      heroes.map((hero, i) =>
        i === index
          ? { ...hero, isActive: true } // Set hero yang dipilih menjadi aktif
          : { ...hero, isActive: false } // Set semua hero lainnya menjadi tidak aktif
      )
    );
  };

  const handleEditHero = (index) => {
    setEditingIndex(index);
    setHeroData(heroes[index]); // Memasukkan data hero yang dipilih ke form
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Hero Management</h2>
        <div className="relative">
          <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isFormVisible ? "Hide Form" : "Show Form"}
          </button>
          {/* Dropdown toggle */}
          <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ${isFormVisible ? "block" : "hidden"}`}>
            <ul>
              <li>
               
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form to Add or Edit Hero */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="block w-full p-2 border border-gray-300 rounded"
            value={heroData.title}
            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Subtitle"
            className="block w-full p-2 border border-gray-300 rounded"
            value={heroData.subtitle}
            onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
          />
          <div>
            <label
              htmlFor="upload-image"
              className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded"
            >
              Upload Images
            </label>
            <input
              id="upload-image"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {heroData.images.map((image, index) => (
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
            {editingIndex !== null ? "Save Changes" : "Add Hero"}
          </button>
        </form>
      )}

      {/* Hero List */}
      <h3 className="text-lg font-semibold mt-4">Hero List</h3>

      {heroes.length > 0 ? (
        <div className="mt-6">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Title</th>
                <th className="border px-4 py-2 text-left">Subtitle</th>
                <th className="border px-4 py-2 text-left">Images</th>
                <th className="border px-4 py-2 text-left">Active</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {heroes.map((hero, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{hero.title}</td>
                  <td className="border px-4 py-2">{hero.subtitle}</td>
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      {hero.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image.preview}
                          alt={hero.title}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => toggleHeroActive(index)}
                      className={`px-4 py-2 rounded text-white ${
                        hero.isActive ? "bg-green-600" : "bg-gray-400"
                      }`}
                    >
                      {hero.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditHero(index)} // Set index hero yang ingin diedit
                        className="px-4 py-2 rounded-xl text-white bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteHero(index)}
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
        </div>
      ) : (
        <p className="text-gray-600">No heroes available. Start by adding a new hero!</p>
      )}
    </div>
  );
};

export default HeroForm;
