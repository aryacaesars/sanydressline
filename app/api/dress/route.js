import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const isArray = Array.isArray(body);

    // Utility untuk validasi input
    const validateInput = async ({
      Name,
      Description,
      Price,
      CategoryID,
      Sizes, // Pastikan ada informasi ukuran dan stok untuk tiap ukuran
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

    if (!isArray) {
      // Validasi untuk single object
      await validateInput(body);

      // Membulatkan harga menjadi dua desimal sebelum disimpan
      const priceFormatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(body.Price);
      const priceRounded = parseFloat(body.Price).toFixed(2); // Membulatkan ke dua desimal

      // Buat satu entri untuk Dress
      const newDress = await prisma.dress.create({
        data: {
          Name: body.Name,
          Description: body.Description,
          Price: parseFloat(priceRounded), // Pastikan harga dibulatkan
          OrderCount: 0,
          Category: {
            connect: { CategoryID: body.CategoryID }, // Menghubungkan dengan category
          },
          // Tambahkan Sizes terkait dengan Dress
          Sizes: {
            create: body.Sizes.map((size) => ({
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

      return new Response(
        JSON.stringify({
          ...newDress,
          PriceFormatted: priceFormatted, // Tambahkan priceFormatted dalam respons
        }),
        {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validasi untuk multiple objects
    for (const item of body) {
      await validateInput(item);
    }

    // Buat banyak entri untuk Dress
    const newDresses = await prisma.$transaction(
      body.map((item) =>
        prisma.dress.create({
          data: {
            Name: item.Name,
            Description: item.Description,
            Price: parseFloat(item.Price).toFixed(2), // Membulatkan harga ke dua desimal
            OrderCount: 0,
            Category: {
              connect: { CategoryID: item.CategoryID }, // Menghubungkan dengan category
            },
            // Tambahkan Sizes terkait dengan Dress
            Sizes: {
              create: item.Sizes.map((size) => ({
                Size: size.Size,
                Stock: size.Stock,
              })),
            },
          },
          include: {
            Category: true,
            Sizes: true,
          },
        })
      )
    );

    // Format harga untuk setiap dress yang berhasil dibuat
    const formattedDresses = newDresses.map((dress) => ({
      ...dress,
      PriceFormatted: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(dress.Price),
    }));

    return new Response(JSON.stringify(formattedDresses), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
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

export async function GET(req) {
  try {
    const dress = await prisma.dress.findMany({
      include: {
        Category: true,
        Sizes: true,
      },
    });

    // Format harga untuk setiap dress
    const formattedDresses = dress.map((dress) => ({
      ...dress,
      PriceFormatted: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(dress.Price),
    }));

    return new Response(JSON.stringify(formattedDresses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error retrieving dress",
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
    const dressID = url.searchParams.get("DressID");

    if (!dressID) {
      return new Response(JSON.stringify({ error: "DressID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hapus semua size yang berkaitan dengan dress berdasarkan DressID
    await prisma.size.deleteMany({
      where: { DressID: parseInt(dressID) },
    });

    // Hapus dress berdasarkan DressID
    const deletedDress = await prisma.dress.delete({
      where: { DressID: parseInt(dressID) },
    });

    return new Response(
      JSON.stringify({ message: "Dress deleted successfully", deletedDress }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error deleting dress",
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

    const body = await req.json();
    const { Name, Description, Price, CategoryID, Sizes } = body;

    // Validasi data yang diperlukan
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

    // Validasi setiap elemen di Sizes
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

    // Membulatkan harga menjadi dua desimal sebelum disimpan
    const priceRounded = parseFloat(Price).toFixed(2);

    // Update dress berdasarkan DressID
    const updatedDress = await prisma.dress.update({
      where: { DressID: parseInt(dressID, 10) },
      data: {
        Name,
        Description,
        Price: parseFloat(priceRounded), // Pastikan harga dibulatkan
        Category: {
          connect: { CategoryID }, // Pastikan CategoryID valid
        },
        Sizes: {
          deleteMany: {}, // Hapus semua size lama terlebih dahulu
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

    // Format harga untuk respons
    const priceFormatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(updatedDress.Price);

    return new Response(
      JSON.stringify({
        ...updatedDress,
        PriceFormatted: priceFormatted, // Tambahkan priceFormatted dalam respons
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);

    // Tangani error spesifik ketika dress tidak ditemukan
    if (error.code === "P2025") {
      return new Response(JSON.stringify({ error: "Dress not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Tangani error lainnya
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
