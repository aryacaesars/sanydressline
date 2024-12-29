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
    const CategoryID = formData.get("CategoryID");
    const Sizes = JSON.parse(formData.get("Sizes"));

    // Utility untuk validasi input
    const validateInput = async ({
      Name,
      Description,
      Price,
      CategoryID,
      Sizes,
    }) => {
      if (!Name || !Description || !Price || !CategoryID || !Sizes) {
        throw new Error("Missing required fields");
      }
      // Validasi ukuran
      Sizes.forEach((size) => {
        if (!size.Size || size.Stock === undefined) {
          throw new Error("Missing size or stock for each size");
        }
      });
    };

    // Validasi input
    await validateInput({ Name, Description, Price, CategoryID, Sizes });

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
        OrderCount: 0,
        Category: {
          connect: { CategoryID: parseInt(CategoryID) }, // Menghubungkan dengan category
        },
        // Tambahkan Sizes terkait dengan Dress
        Sizes: {
          create: Sizes.map((size) => ({
            Size: size.Size,
            Stock: size.Stock,
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

    return new Response(
      JSON.stringify({
        ...newDress,
        PriceFormatted: priceFormatted,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error creating dress",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  try {
    const dresses = await prisma.dress.findMany({
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
      return new Response(JSON.stringify({ error: "DressID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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
        console.error("Error deleting image from Cloudinary:", error);
        return new Response(
          JSON.stringify({ error: "Error deleting image from Cloudinary" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
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

    return new Response(
      JSON.stringify({
        message: "Dress and associated images deleted successfully",
        deletedDress,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.stack);
    }
    console.error(error || "Unknown error");
    return new Response(
      JSON.stringify({
        error: error?.message || "Error deleting dress",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const dressID = url.searchParams.get("DressID");

    if (!dressID) {
      return new Response(JSON.stringify({ error: "DressID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formData = await req.formData();
    const Name = formData.get("Name");
    const Description = formData.get("Description");
    const Price = formData.get("Price");
    const CategoryID = formData.get("CategoryID");
    const Sizes = JSON.parse(formData.get("Sizes"));

    // Validate input
    if (
      !Name ||
      !Description ||
      !Price ||
      !CategoryID ||
      !Sizes ||
      !Array.isArray(Sizes)
    ) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    for (const size of Sizes) {
      if (!size.Size || size.Stock == null) {
        return new Response(
          JSON.stringify({ error: "Each size must include Size and Stock" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
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
        Category: {
          connect: { CategoryID: parseInt(CategoryID) },
        },
        Sizes: {
          deleteMany: {},
          create: Sizes.map((size) => ({
            Size: size.Size,
            Stock: size.Stock,
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

    return new Response(
      JSON.stringify({
        ...updatedDress,
        PriceFormatted: priceFormatted,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);

    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Dress not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        error: error.message || "Error updating dress",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
