import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/api/config/cloudinary-config";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const ImageID = url.searchParams.get("ImageID");

    // Find the image to be deleted
    const image = await prisma.image.findUnique({
      where: { ImageID: parseInt(ImageID) },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(image.PublicID);

    // Delete the image from the database
    await prisma.image.delete({
      where: { ImageID: parseInt(ImageID) },
    });

    return NextResponse.json({ message: "Image deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Error deleting image",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const formData = await req.formData();
    const Images = formData.getAll("Image");
    const ContentID = url.searchParams.get("ContentID");
    const findSectionName = await prisma.pageContent.findUnique({
      where: { ContentID: parseInt(ContentID) },
      select: { Section: true },
    });
    const sectionName = findSectionName?.Section;
    const imgCount = await prisma.image.count({
      where: { ContentID: parseInt(ContentID) },
    });

    if (Images.length === 0) {
      return NextResponse.json(
        { error: "Field yang diperlukan hilang: Image" },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (let i = 0; i < Images.length; i++) {
      const Image = Images[i];
      const buffer = Buffer.from(await Image.arrayBuffer());
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "sanydressline" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(buffer);
      });

      // Save image details to the database
      const newImage = await prisma.image.create({
        data: {
          ContentID: parseInt(ContentID),
          PublicID: uploadResponse.public_id,
          Url: uploadResponse.secure_url,
          Alt: `${sectionName} - Image ${imgCount + i + 1}`,
        },
      });

      uploadedImages.push(newImage);
    }

    return NextResponse.json(uploadedImages, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Error creating image" },
      { status: 500 }
    );
  }
}
