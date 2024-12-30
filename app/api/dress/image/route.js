import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import cloudinary from "../../../../lib/api/config/cloudinary-config";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const url = new URL(req.url);
    const formData = await req.formData();
    const images = formData.getAll("Image");
    const dressID = url.searchParams.get("DressID");
    const findDressName = await prisma.dress.findUnique({
      where: { DressID: parseInt(dressID) },
      select: { Name: true },
    });
    const dressName = findDressName?.Name;
    const imgCount = await prisma.image.count({
      where: { DressID: parseInt(dressID) },
    });

    // Upload images to Cloudinary
    const imageUrls = [];
    const publicIds = [];
    for (const image of images) {
      const buffer = Buffer.from(await image.arrayBuffer());
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
        const readStream = require("stream").Readable.from(buffer);
        readStream.pipe(uploadStream);
      });
      imageUrls.push(uploadResponse.secure_url);
      publicIds.push(uploadResponse.public_id);
    }

    // Create entries for each Image
    for (let i = 0; i < imageUrls.length; i++) {
      await prisma.image.create({
        data: {
          DressID: parseInt(dressID),
          PublicID: publicIds[i],
          Url: imageUrls[i],
          Alt: `${dressName} - Image ${imgCount + i + 1}`,
        },
      });
    }

    return new Response(
      JSON.stringify({ message: "Images uploaded successfully" }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error uploading images",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const imageIDs = url.searchParams.getAll("ImageID");

    if (imageIDs.length === 0) {
      return NextResponse.json(
        { error: "At least one ImageID is required" },
        { status: 400 }
      );
    }

    const images = await prisma.image.findMany({
      where: {
        ImageID: {
          in: imageIDs.map((id) => parseInt(id)),
        },
      },
    });

    if (images.length === 0) {
      return NextResponse.json({ error: "Images not found" }, { status: 404 });
    }

    // Delete each image from Cloudinary and the database
    for (const image of images) {
      try {
        await cloudinary.uploader.destroy(image.PublicID);
        await prisma.image.delete({
          where: {
            ImageID: image.ImageID,
          },
        });
      } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
          { error: "Error deleting one or more images" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Images deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Error deleting images",
      },
      { status: 500 }
    );
  }
}
