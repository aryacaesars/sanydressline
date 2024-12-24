import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const isArray = Array.isArray(body);

    // Utility untuk validasi input
    const validateInput = async ({ Name }) => {
      if (!Name) {
        throw new Error("Missing required field: Name");
      }

      // Cek apakah nama kategori sudah ada
      const existingCategory = await prisma.category.findUnique({
        where: { Name },
      });
      if (existingCategory) {
        throw new Error(`Category with name "${Name}" already exists`);
      }
    };

    if (!isArray) {
      // Validasi untuk single object
      await validateInput(body);

      // Buat satu entri
      const newCategory = await prisma.category.create({
        data: body,
      });

      return new Response(JSON.stringify(newCategory), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validasi untuk multiple objects
    for (const item of body) {
      await validateInput(item);
    }

    // Buat banyak entri
    const newCategories = await prisma.$transaction(
      body.map((item) => prisma.category.create({ data: item }))
    );

    return new Response(JSON.stringify(newCategories), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error creating category",
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
    const CategoryID = url.searchParams.get("CategoryID");
    const body = await req.json();
    const { Name } = body;

    // Validasi input
    if (!CategoryID || !Name) {
      return new Response(
        JSON.stringify({
          error: "Missing required query parameter: CategoryID or Name in body",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Cek apakah kategori dengan CategoryID tersebut ada
    const existingCategory = await prisma.category.findUnique({
      where: { CategoryID: parseInt(CategoryID) },
    });

    if (!existingCategory) {
      return new Response(
        JSON.stringify({
          error: `Category with ID "${CategoryID}" does not exist`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Cek apakah Name sudah digunakan kategori lain
    const nameConflict = await prisma.category.findUnique({
      where: { Name },
    });

    if (nameConflict && nameConflict.CategoryID !== parseInt(CategoryID)) {
      return new Response(
        JSON.stringify({ error: `Category name "${Name}" already exists` }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update kategori
    const updatedCategory = await prisma.category.update({
      where: { CategoryID: parseInt(CategoryID) },
      data: { Name },
    });

    return new Response(JSON.stringify(updatedCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error updating category",
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
    const CategoryID = url.searchParams.get("CategoryID");

    // Validasi query parameter CategoryID
    if (!CategoryID) {
      return new Response(
        JSON.stringify({
          error: "Missing required query parameter: CategoryID",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Cek apakah kategori dengan CategoryID tersebut ada
    const existingCategory = await prisma.category.findUnique({
      where: { CategoryID: parseInt(CategoryID) },
    });

    if (!existingCategory) {
      return new Response(
        JSON.stringify({
          error: `Category with ID "${CategoryID}" does not exist`,
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hapus kategori
    const deletedCategory = await prisma.category.delete({
      where: { CategoryID: parseInt(CategoryID) },
    });

    return new Response(JSON.stringify(deletedCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error deleting category",
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
    // Mengambil seluruh kategori
    const categories = await prisma.category.findMany({
      include: {
        Dress: true, // Menyertakan data dress yang terkait dengan kategori
      },
    });

    // Jika tidak ada kategori, kembalikan pesan error
    if (categories.length === 0) {
      return new Response(JSON.stringify({ error: "No categories found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error retrieving categories",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
