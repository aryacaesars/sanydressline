import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const formData = await req.formData();
    const names = formData.getAll("Name");

    // Utility for input validation
    const validateInput = async (Name) => {
      if (!Name) {
        throw new Error("Missing required field: Name");
      }

      // Check if the category name already exists
      const existingCategory = await prisma.category.findUnique({
        where: { Name },
      });
      if (existingCategory) {
        throw new Error(`Category with name "${Name}" already exists`);
      }
    };

    // Validate input for all names
    for (const Name of names) {
      await validateInput(Name);
    }

    // Create multiple entries
    const newCategories = await prisma.$transaction(
      names.map((Name) => prisma.category.create({ data: { Name } }))
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
    const formData = await req.formData();
    const Name = formData.get("Name");

    // Validate input
    if (!CategoryID || !Name) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: CategoryID or Name",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the category with the given CategoryID exists
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

    // Check if the Name is already used by another category
    const nameConflict = await prisma.category.findUnique({
      where: { Name },
    });

    if (nameConflict && nameConflict.CategoryID !== parseInt(CategoryID)) {
      return new Response(
        JSON.stringify({ error: `Category name "${Name}" already exists` }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update category
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
    const categoryIDs = url.searchParams.getAll("CategoryID");

    // Validate query parameter CategoryID
    if (categoryIDs.length === 0) {
      return new Response(
        JSON.stringify({
          error: "At least one CategoryID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the categories with the given CategoryIDs exist
    const existingCategories = await prisma.category.findMany({
      where: {
        CategoryID: {
          in: categoryIDs.map((id) => parseInt(id)),
        },
      },
    });

    if (existingCategories.length !== categoryIDs.length) {
      return new Response(
        JSON.stringify({
          error: "One or more categories do not exist",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check for related records in other tables
    for (const id of categoryIDs) {
      const relatedRecords = await prisma.dress.findMany({
        where: { CategoryID: parseInt(id) },
      });

      if (relatedRecords.length > 0) {
        return new Response(
          JSON.stringify({
            error: `Category with ID "${id}" cannot be deleted because it has related records`,
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Delete categories
    const deletedCategories = await prisma.$transaction(
      categoryIDs.map((id) =>
        prisma.category.delete({
          where: { CategoryID: parseInt(id) },
        })
      )
    );

    return new Response(JSON.stringify(deletedCategories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: error.message || "Error deleting categories",
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
