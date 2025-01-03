"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Dashboard() {
  const [pageContent, setPageContent] = useState([]);
  const [error, setError] = useState("");
  const [editContent, setEditContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editParagraph, setEditParagraph] = useState("");

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
                      <Image
                        key={index}
                        src={img.Url}
                        alt={img.Alt}
                        width={50}
                        height={50}
                      />
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
