"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Dashboard Konten Halaman</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Content ID</th>
            <th>Page Name</th>
            <th>Section</th>
            <th>Title</th>
            <th>Paragraph</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageContent.map((content) => (
            <tr key={content.ContentID}>
              <td>{content.ContentID}</td>
              <td>{content.PageName}</td>
              <td>{content.Section}</td>
              <td>{content.Title}</td>
              <td>{content.Paragraph}</td>
              <td>
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
              <td>
                <button onClick={() => handleEdit(content)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editContent && (
        <div className="popover">
          <h2>Edit Konten</h2>
          <form onSubmit={handleUpdate}>
            <label htmlFor="editTitle">Title:</label>
            <input
              type="text"
              id="editTitle"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <br />
            <label htmlFor="editParagraph">Paragraph:</label>
            <textarea
              id="editParagraph"
              value={editParagraph}
              onChange={(e) => setEditParagraph(e.target.value)}
              required
            ></textarea>
            <br />

            <label>Gambar:</label>
            {editContent.Images.map((img, index) => (
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

            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditContent(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
