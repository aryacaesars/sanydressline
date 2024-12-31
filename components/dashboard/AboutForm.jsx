"use client";

import { useState } from "react";

const AboutForm = () => {
  const [aboutData, setAboutData] = useState({ content: "", image: null });
  const [aboutList, setAboutList] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // Track the index of the item being edited

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // If editing, update the existing item
      const updatedList = [...aboutList];
      updatedList[editIndex] = { ...aboutData, active: false };
      setAboutList(updatedList);
      setEditIndex(null); // Reset edit state
    } else {
      // If not editing, add a new item
      setAboutList([...aboutList, { ...aboutData, active: false }]);
    }
    setAboutData({ content: "", image: null }); // Reset form after submission
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAboutData({
        ...aboutData,
        image: { file, preview: URL.createObjectURL(file) },
      });
    }
  };

  const handleImageDelete = () => {
    setAboutData({ ...aboutData, image: null });
  };

  const toggleProductStatus = (index) => {
    // Set all items inactive first
    const updatedList = aboutList.map((about, idx) => ({
      ...about,
      active: idx === index ? !about.active : false, // Only toggle the clicked item, set others to inactive
    }));
    setAboutList(updatedList);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setAboutData(aboutList[index]); // Populate the form with the current item's data
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">About Management</h2>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {isFormVisible ? "Hide Form" : "Show Form"}
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="About Content"
            className="block w-full p-2 border border-gray-300 rounded"
            value={aboutData.content}
            onChange={(e) =>
              setAboutData({ ...aboutData, content: e.target.value })
            }
          ></textarea>
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
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex space-x-4">
              {aboutData.image && (
                <div className="relative">
                  <img
                    src={aboutData.image.preview}
                    alt="Preview"
                    className="w-32 h-32 object-cover border rounded"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    onClick={handleImageDelete}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {editIndex !== null ? "Update About Content" : "Add About Content"}
          </button>
        </form>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">About List</h3>
        {aboutList.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Content</th>
                <th className="border px-4 py-2 text-left">Image</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {aboutList.map((about, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{about.content}</td>
                  <td className="border px-4 py-2">
                    {about.image && (
                      <img
                        src={about.image.preview}
                        alt="About"
                        className="w-16 h-16 object-cover mt-2 rounded border"
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => toggleProductStatus(index)}
                      className={`px-4 py-2 rounded text-white ${
                        about.active ? "bg-green-600" : "bg-gray-400"
                      }`}
                    >
                      {about.active ? "Active" : "Set Active"}
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="px-4 py-2 rounded-xl text-white bg-blue-600"
                      onClick={() => handleEdit(index)} // Edit functionality
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl text-white bg-red-600 ml-2"
                      onClick={() => setAboutList(aboutList.filter((_, i) => i !== index))}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">Belum ada konten yang ditambahkan.</p>
        )}
      </div>
    </div>
  );
};

export default AboutForm;
