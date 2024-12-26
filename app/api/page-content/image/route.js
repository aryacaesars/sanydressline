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
      return new Response(JSON.stringify({ error: "Image not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(image.PublicID);

    // Delete the image from the database
    await prisma.image.delete({
      where: { ImageID: parseInt(ImageID) },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error deleting image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const formData = await req.formData();
    const Image = formData.get("Image");
    const ContentID = url.searchParams.get("ContentID");
    const findSectionName = await prisma.pageContent.findUnique({
      where: { ContentID: parseInt(ContentID) },
      select: { Section: true },
    });
    const sectionName = findSectionName?.Section;
    const imgCount = await prisma.image.count({
      where: { ContentID: parseInt(ContentID) },
    });

    if (!Image) {
      return new Response(
        JSON.stringify({ error: "Missing required field: Image" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Upload image to Cloudinary
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
        Alt: `${sectionName} - Image ${imgCount + 1}`,
      },
    });

    return new Response(JSON.stringify(newImage), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error uploading image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
