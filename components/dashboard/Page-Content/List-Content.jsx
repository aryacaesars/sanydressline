"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const [pageContent, setPageContent] = useState([]);
  const [error, setError] = useState("");
  const [editContent, setEditContent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editParagraph, setEditParagraph] = useState("");
  const [newImages, setNewImages] = useState([{ file: null, error: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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
        setError(`Error: ${errorText}`);
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
    setIsChanged(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);
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
      } else {
        const errorText = await response.text();
        setError(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating content:", error);
      setError("Terjadi kesalahan saat memperbarui konten halaman");
    }

    await uploadNewImages();

    fetchPageContent();
    setIsLoading(false);
    setEditContent(null);
  };

  const uploadNewImages = async () => {
    const imagesToUpload = newImages.filter((image) => image.file !== null);
    if (imagesToUpload.length > 0) {
      const imageFormData = new FormData();
      imagesToUpload.forEach((image) => {
        imageFormData.append("Image", image.file);
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
        } else {
          const errorText = await imageResponse.text();
          alert(`Error: ${errorText}`);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat menambahkan gambar");
      }
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
    setIsChanged(true);
  };

  const handleAddNewImage = () => {
    setNewImages([...newImages, { file: null, error: "" }]);
    setIsChanged(true);
  };

  const handleRemoveNewImage = (index) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
    setIsChanged(true);
  };

  const handleRemoveExistingImage = async (imageID) => {
    setProgress(0);
    setIsLoading(true);
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

        setEditContent((prevContent) => ({
          ...prevContent,
          Images: prevContent.Images.filter(
            (image) => image.ImageID !== imageID
          ),
        }));

        let progressValue = 0;
        const interval = setInterval(() => {
          progressValue += 10;
          if (progressValue >= 100) {
            clearInterval(interval);
            setProgress(100);
            setIsLoading(false);
          } else {
            setProgress(progressValue);
          }
        }, 100);
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menghapus gambar");
      setIsLoading(false);
    }
  };

  const handleTitleChange = (e) => {
    setEditTitle(e.target.value);
    setIsChanged(true);
  };

  const handleParagraphChange = (e) => {
    setEditParagraph(e.target.value);
    setIsChanged(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsAlertOpen(true);
  };

  const handleConfirm = () => {
    setIsAlertOpen(false);
    handleUpdate();
  };

  return (
    <div className="p-4">
      <div className="mb-6 md:mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl md:text-3xl font-extrabold text-green-900 text-center md:text-left"
          >
            Product List
          </motion.h1>
        </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto w-full">
        <table className="table-auto border-collapse border border-gray-300 w-full text-left">
          <thead className="bg-gray-100 text-center">
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
                <td className="border border-gray-300 px-4 py-2 w-1/12">
                  {content.Section}
                </td>
                <td className="border border-gray-300 px-4 py-2 w-2/12">
                  {content.Title}
                </td>
                <td className="border border-gray-300 px-4 py-2 w-4/12">
                  {content.Paragraph}
                </td>
                <td className="border border-gray-300 px-4 py-2 w-3/12">
                  {Array.isArray(content.Images) &&
                  content.Images.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {content.Images.map((img, index) => (
                        <div
                          key={index}
                          className="w-24 h-24 relative overflow-hidden rounded-md"
                        >
                          <Image
                            src={img.Url}
                            alt={img.Alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    "No Images"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 w-1/12 text-center">
                  <button
                    onClick={() => handleEdit(content)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="editTitle"
                  className="block text-sm font-medium text-black"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="editTitle"
                  value={editTitle}
                  onChange={handleTitleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="editParagraph"
                  className="block text-sm font-medium text-black"
                >
                  Paragraph
                </label>
                <textarea
                  id="editParagraph"
                  value={editParagraph}
                  onChange={handleParagraphChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
                  rows="4"
                ></textarea>
              </div>

              <label className="block text-sm font-medium text-black">
                Images
              </label>
              {Array.isArray(editContent.Images) &&
                editContent.Images.length > 0 && (
                  <div
                    className={`flex ${
                      editContent.Images.length > 1 ? "flex-wrap gap-4" : ""
                    }`}
                  >
                    {editContent.Images.map((img, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="w-32 h-32 relative overflow-hidden rounded-md">
                          <Image
                            src={img.Url}
                            alt={img.Alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(img.ImageID)}
                          className="text-red-500 hover:text-red-700 mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              <label className="block text-sm font-medium text-black">
                Add Image
              </label>
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
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}

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
                  className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm ${
                    !isChanged || isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800"
                  }`}
                  disabled={!isChanged || isLoading}
                >
                  {isLoading ? "Updating..." : "Update Content"}
                </button>
              </div>
            </form>
            {isLoading && <Progress value={progress} className="w-full mt-4" />}
          </div>
        </div>
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to update this content?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action will update the content details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}