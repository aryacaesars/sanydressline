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

    if (!dressID) {
      return NextResponse.json(
          { error: "DressID diperlukan" },
          { status: 400 }
      );
    }

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

    return NextResponse.json(
        { message: "Gambar berhasil ditambahkan" },
        { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
        {
          error: error.message || "Terjadi kesalahan saat menambahkan gambar",
        },
        { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { imageIDs } = await req.json();

    if (!imageIDs || imageIDs.length === 0) {
      return NextResponse.json(
          { error: "Field imageIDs diperlukan" },
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
      return NextResponse.json(
          { error: "Gambar tidak ditemukan" },
          { status: 404 }
      );
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
        console.error("Kesalahan saat menghapus gambar:", error);
        return NextResponse.json(
            { error: "Kesalahan saat menghapus gambar" },
            { status: 500 }
        );
      }
    }

    return NextResponse.json(
        { message: "Gambar berhasil dihapus" },
        { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
        {
          error: error.message || "Terjadi kesalahan saat menghapus gambar",
        },
        { status: 500 }
    );
  }
}
