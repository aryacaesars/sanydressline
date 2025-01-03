"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ListContent() {
  const [contents, setContents] = useState([]);
  const [error, setError] = useState("");
  const [editContent, setEditContent] = useState(null);
  const [editForm, setEditForm] = useState({
    pageName: "",
    section: "",
    title: "",
    paragraph: "",
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const pageName = "home";
      const response = await fetch(`/api/page-content?pageName=${pageName}`);
      if (response.ok) {
        const data = await response.json();
        setContents(data);
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
      console.error("Error fetching contents:", error);
      setError("Terjadi kesalahan saat mengambil data konten");
    }
  };

  const handleDelete = async (contentID) => {
    try {
      const response = await fetch(`/api/page-content?ContentID=${contentID}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Konten berhasil dihapus");
        fetchContents();
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
      alert("Terjadi kesalahan saat menghapus konten");
    }
  };

  const handleEdit = (content) => {
    setEditContent(content);
    setEditForm({
      pageName: content.PageName,
      section: content.Section,
      title: content.Title,
      paragraph: content.Paragraph,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/page-content?ContentID=${editContent.ContentID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        alert("Konten berhasil diperbarui");
        setEditContent(null);
        fetchContents();
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
      alert("Terjadi kesalahan saat memperbarui konten");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Daftar Konten</h1>
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
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((content) => (
            <tr key={content.ContentID}>
              <td>{content.ContentID}</td>
              <td>{content.PageName}</td>
              <td>{content.Section}</td>
              <td>{content.Title}</td>
              <td>{content.Paragraph}</td>
              <td>
                {content.Images.map((image) => (
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
                <button onClick={() => handleEdit(content)}>Edit</button>
                <button onClick={() => handleDelete(content.ContentID)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editContent && (
        <div className="popover">
          <h2>Edit Konten</h2>
          <form onSubmit={handleEditSubmit}>
            <label htmlFor="editPageName">Page Name:</label>
            <input
              type="text"
              id="editPageName"
              name="pageName"
              value={editForm.pageName}
              onChange={handleEditChange}
              required
            />
            <br />
            <br />

            <label htmlFor="editSection">Section:</label>
            <input
              type="text"
              id="editSection"
              name="section"
              value={editForm.section}
              onChange={handleEditChange}
              required
            />
            <br />
            <br />

            <label htmlFor="editTitle">Title:</label>
            <input
              type="text"
              id="editTitle"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              required
            />
            <br />
            <br />

            <label htmlFor="editParagraph">Paragraph:</label>
            <textarea
              id="editParagraph"
              name="paragraph"
              value={editForm.paragraph}
              onChange={handleEditChange}
              required
            ></textarea>
            <br />
            <br />

            <button type="submit">Perbarui Konten</button>
            <button type="button" onClick={() => setEditContent(null)}>
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}