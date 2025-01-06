import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import cloudinary from "../../../lib/api/config/cloudinary-config";

const prisma = new PrismaClient();
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const Images = formData.getAll("Image");
    const Name = formData.get("Name");
    const Description = formData.get("Description");
    const Price = formData.get("Price");
    const OrderCount = formData.get("OrderCount");
    const IsVisible = formData.get("IsVisible");
    const CategoryID = formData.get("CategoryID");
    const Sizes = JSON.parse(formData.get("Sizes"));

    // Utility untuk validasi input
    const validateInput = async ({
                                   Name,
                                   Description,
                                   Price,
                                   OrderCount,
                                   IsVisible,
                                   CategoryID,
                                   Sizes,
                                 }) => {
      if (
          !Name ||
          !Description ||
          !Price ||
          !OrderCount ||
          !IsVisible ||
          !CategoryID ||
          !Sizes
      ) {
        throw new Error("Field yang diperlukan tidak lengkap");
      }
      // Validasi ukuran
      Sizes.forEach((size) => {
        if (!size.Size || size.Stock === undefined) {
          throw new Error("Ukuran atau stok untuk setiap ukuran tidak lengkap");
        }
      });
    };

    // Validasi input
    await validateInput({
      Name,
      Description,
      Price,
      OrderCount,
      IsVisible,
      CategoryID,
      Sizes,
    });

    // Upload images to Cloudinary
    const imageUrls = [];
    const publicIds = [];
    for (const Image of Images) {
      const buffer = Buffer.from(await Image.arrayBuffer());
      const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "sanydressline" }, // Optional: specify a folder in Cloudinary
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
      imageUrls.push(uploadResponse.secure_url);
      publicIds.push(uploadResponse.public_id);
    }

    // Membulatkan harga menjadi dua desimal sebelum disimpan
    const priceFormatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Price);
    const priceRounded = parseFloat(Price).toFixed(2); // Membulatkan ke dua desimal

    // Buat satu entri untuk Dress
    const newDress = await prisma.dress.create({
      data: {
        Name,
        Description,
        Price: parseFloat(priceRounded), // Pastikan harga dibulatkan
        OrderCount: parseInt(OrderCount),
        IsVisible: IsVisible === "true",
        Category: {
          connect: { CategoryID: parseInt(CategoryID) }, // Menghubungkan dengan category
        },
        // Tambahkan Sizes terkait dengan Dress
        Sizes: {
          create: Sizes.map((size) => ({
            Size: size.Size,
            Stock: parseInt(size.Stock),
          })),
        },
      },
      include: {
        Category: true,
        Sizes: true,
      },
    });

    // Buat entri untuk setiap Image
    for (let i = 0; i < imageUrls.length; i++) {
      await prisma.image.create({
        data: {
          DressID: newDress.DressID,
          PublicID: publicIds[i],
          Url: imageUrls[i],
          Alt: `${Name} - Image ${i + 1}`,
        },
      });
    }

    return NextResponse.json(newDress, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
        {
          error: error.message || "Terjadi kesalahan saat membuat dress",
        },
        { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const fetchAll = url.searchParams.get("fetchAll") === "true";

    const dresses = await prisma.dress.findMany({
      where: fetchAll ? {} : { IsVisible: true },
      include: {
        Category: true,
        Sizes: true,
        Image: true,
      },
    });

    const formattedDresses = dresses.map((dress) => ({
      ...dress,
      PriceFormatted: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(dress.Price),
    }));

    return NextResponse.json(formattedDresses, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Error retrieving dresses",
      },
      { status: 500 }
    );
  }
}


async function deleteImageWithRetry(publicId, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const dressID = url.searchParams.get("DressID");

    if (!dressID) {
      return NextResponse.json(
          { error: "DressID diperlukan" },
          { status: 400 }
      );
    }

    const images = await prisma.image.findMany({
      where: { DressID: parseInt(dressID) },
    });

    for (const image of images) {
      const publicId = image.PublicID;
      console.log("Retrieved image:", image); // Log the retrieved image
      if (!publicId) {
        console.error("PublicID tidak ditemukan untuk gambar:", image);
        continue;
      }
      try {
        await deleteImageWithRetry(publicId);
      } catch (error) {
        console.error("Kesalahan saat menghapus gambar dari Cloudinary:", error);
        return NextResponse.json(
            { error: "Kesalahan saat menghapus gambar dari Cloudinary" },
            { status: 500 }
        );
      }
    }

    await prisma.size.deleteMany({
      where: { DressID: parseInt(dressID) },
    });

    await prisma.image.deleteMany({
      where: { DressID: parseInt(dressID) },
    });

    const deletedDress = await prisma.dress.delete({
      where: { DressID: parseInt(dressID) },
    });

    return NextResponse.json(
        { message: "Dress berhasil dihapus", deletedDress },
        { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { error: error.message || "Terjadi kesalahan saat menghapus dress" },
        { status: 500 }
    );
  }
}


export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const dressID = url.searchParams.get("DressID");

    if (!dressID) {
      return NextResponse.json(
        { error: "DressID is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const updateData = {};

    if (formData.has("Name")) updateData.Name = formData.get("Name");
    if (formData.has("Description")) updateData.Description = formData.get("Description");
    if (formData.has("Price")) updateData.Price = parseFloat(formData.get("Price")).toFixed(2);
    if (formData.has("OrderCount")) updateData.OrderCount = parseInt(formData.get("OrderCount"));
    if (formData.has("IsVisible")) updateData.IsVisible = formData.get("IsVisible") === "true";
    if (formData.has("CategoryID")) updateData.Category = { connect: { CategoryID: parseInt(formData.get("CategoryID")) } };
    if (formData.has("Sizes")) {
      const Sizes = JSON.parse(formData.get("Sizes"));
      updateData.Sizes = {
        deleteMany: {},
        create: Sizes.map((size) => ({
          Size: size.Size,
          Stock: parseInt(size.Stock),
        })),
      };
    }

    const updatedDress = await prisma.dress.update({
      where: { DressID: parseInt(dressID, 10) },
      data: updateData,
      include: {
        Category: true,
        Sizes: true,
      },
    });

    const priceFormatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(updatedDress.Price);

    const responsePayload = {
      ...updatedDress,
      PriceFormatted: priceFormatted,
    };

    if (!responsePayload) {
      throw new Error("Failed to create response payload");
    }

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Dress not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "An error occurred while updating the dress",
      },
      { status: 500 }
    );
  }
}