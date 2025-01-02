import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import cloudinary from "../../../lib/api/config/cloudinary-config";

const prisma = new PrismaClient();

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

export async function GET() {
  try {
    const dresses = await prisma.dress.findMany({
      where: { IsVisible: true },
      include: {
        Category: true,
        Sizes: true,
        Image: true,
      },
    });

    // Format harga untuk setiap dress
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

    // Find all images associated with the dress
    const images = await prisma.image.findMany({
      where: { DressID: parseInt(dressID) },
    });

    // if (images.length === 0) {
    //   return new Response(JSON.stringify({ error: "Images not found" }), {
    //     status: 404,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    // Delete each image from Cloudinary
    for (const image of images) {
      try {
        await cloudinary.uploader.destroy(image.PublicID);
      } catch (error) {
        console.error(
          "Kesalahan saat menghapus gambar dari Cloudinary:",
          error
        );
        return NextResponse.json(
          {
            error: "Kesalahan saat menghapus gambar dari Cloudinary",
          },
          { status: 500 }
        );
      }
    }

    // Delete the dress and associated sizes from the database
    await prisma.size.deleteMany({
      where: { DressID: parseInt(dressID) },
    });

    // Delete the image records from the database
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
    if (error instanceof Error) {
      console.error(error.stack);
    }
    console.error(error || "Kesalahan tidak diketahui");
    return NextResponse.json(
      {
        error: error.message || "Terjadi kesalahan saat menghapus dress",
      },
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
    const Name = formData.get("Name");
    const Description = formData.get("Description");
    const Price = formData.get("Price");
    const OrderCount = formData.get("OrderCount");
    const IsVisible = formData.get("IsVisible");
    const CategoryID = formData.get("CategoryID");
    const Sizes = JSON.parse(formData.get("Sizes"));

    // Validate input
    if (
      !Name ||
      !Description ||
      !Price ||
      !OrderCount ||
      !IsVisible ||
      !CategoryID ||
      !Sizes ||
      !Array.isArray(Sizes)
    ) {
      return NextResponse.json(
        { error: "Field yang diperlukan tidak lengkap" },
        { status: 400 }
      );
    }

    for (const size of Sizes) {
      if (!size.Size || size.Stock == null) {
        return NextResponse.json(
          { error: "Ukuran atau stok untuk setiap ukuran tidak lengkap" },
          { status: 400 }
        );
      }
    }

    // Round price to two decimal places
    const priceRounded = parseFloat(Price).toFixed(2);

    // Update dress
    const updatedDress = await prisma.dress.update({
      where: { DressID: parseInt(dressID, 10) },
      data: {
        Name,
        Description,
        Price: parseFloat(priceRounded),
        OrderCount: parseInt(OrderCount),
        IsVisible: IsVisible === "true",
        Category: {
          connect: { CategoryID: parseInt(CategoryID) },
        },
        Sizes: {
          deleteMany: {},
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

    // Format price for response
    const priceFormatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(updatedDress.Price);

    const responsePayload = {
      ...updatedDress,
      PriceFormatted: priceFormatted,
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Dress tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: error.message || "Terjadi kesalahan saat memperbarui dress",
      },
      { status: 500 }
    );
  }
}
