"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [pageContent, setPageContent] = useState([]);
  const [error, setError] = useState("");
  const [editContent, setEditContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editParagraph, setEditParagraph] = useState("");
  const [newImages, setNewImages] = useState([{ file: null, error: "" }]);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const response = await fetch("/api/page-content?pageName=home");
      if (response.ok) {
        const data = await response.json();
        setPageContent(data);
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
      console.error("Error fetching page content:", error);
      setError("Terjadi kesalahan saat mengambil data konten halaman");
    }
  };

  const handleEdit = (content) => {
    setEditContent(content);
    setEditTitle(content.Title);
    setEditParagraph(content.Paragraph);
    setNewImages([{ file: null, error: "" }]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/page-content?ContentID=${editContent.ContentID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Title: editTitle,
            Paragraph: editParagraph,
          }),
        }
      );

      if (response.ok) {
        const updatedContent = await response.json();
        setPageContent((prevContent) =>
          prevContent.map((content) =>
            content.ContentID === updatedContent.ContentID
              ? updatedContent
              : content
          )
        );
        setEditContent(null);
      } else {
        const errorText = await response.text();
        setError(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating content:", error);
      setError("Terjadi kesalahan saat memperbarui konten halaman");
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
        `/api/page-content/image?ContentID=${editContent.ContentID}`,
        {
          method: "POST",
          body: imageFormData,
        }
      );

      if (imageResponse.ok) {
        const imageResult = await imageResponse.json();
        alert(`Gambar berhasil ditambahkan: ${JSON.stringify(imageResult)}`);
        fetchPageContent(); // Refresh the list after image upload
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
      const response = await fetch(
        `/api/page-content/image?ImageID=${imageID}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`Gambar berhasil dihapus: ${JSON.stringify(result)}`);

        // Update the state to remove the deleted image
        setPageContent((prevContent) =>
          prevContent.map((content) =>
            content.ContentID === editContent.ContentID
              ? {
                  ...content,
                  Images: content.Images.filter(
                    (image) => image.ImageID !== imageID
                  ),
                }
              : content
          )
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

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between items-center mb-6 md:mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl md:text-3xl font-extrabold text-green-900 text-center md:text-left"
        >
          Content List
        </motion.h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto w-full">
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Section</th>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Paragraph</th>
              <th className="border border-gray-300 px-4 py-2">Images</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageContent.map((content) => (
              <tr key={content.ContentID} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {content.Section}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.Title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {content.Paragraph}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {Array.isArray(content.Images) && content.Images.length > 0
                    ? content.Images.map((img, index) => (
                        <div key={index}>
                          <Image
                            src={img.Url}
                            alt={img.Alt}
                            width={50}
                            height={50}
                          />
                        </div>
                      ))
                    : "No Images"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="text-blue-500 hover:textblue-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
            <h2 className="text-lg font-bold mb-4">Edit Content</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              {/* Paragraph Field */}
              <div className="space-y-2">
                <label
                  htmlFor="editParagraph"
                  className="block text-sm font-medium text-gray-700"
                >
                  Paragraph
                </label>
                <textarea
                  id="editParagraph"
                  value={editParagraph}
                  onChange={(e) => setEditParagraph(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  rows="4"
                ></textarea>
              </div>

              <label>Gambar:</label>
              {Array.isArray(editContent.Images) &&
                editContent.Images.map((img, index) => (
                  <div key={index}>
                    <Image src={img.Url} alt={img.Alt} width={50} height={50} />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(img.ImageID)}
                    >
                      Hapus
                    </button>
                  </div>
                ))}

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

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditContent(null)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-black bg-white rounded-md shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-black border border-transparent rounded-md shadow-sm hover:bg-gray-800"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
