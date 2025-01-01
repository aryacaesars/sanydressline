import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { names } = await req.json();

    // Utility for input validation
    const validateInput = async (Name) => {
      if (!Name) {
        throw new Error("Field yang diperlukan hilang: Nama");
      }

      // Check if the category name already exists
      const existingCategory = await prisma.category.findUnique({
        where: { Name },
      });
      if (existingCategory) {
        throw new Error(`Kategori dengan nama "${Name}" sudah ada`);
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

    return NextResponse.json(newCategories, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Error membuat kategori",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { CategoryID, Name } = await req.json();

    // Validate input
    if (!CategoryID || !Name) {
      return NextResponse.json(
        { error: "Field yang diperlukan hilang: CategoryID, Name" },
        { status: 400 }
      );
    }

    // Check if the category with the given CategoryID exists
    const existingCategory = await prisma.category.findUnique({
      where: { CategoryID: parseInt(CategoryID) },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check if the Name is already used by another category
    const nameConflict = await prisma.category.findUnique({
      where: { Name },
    });

    if (nameConflict && nameConflict.CategoryID !== parseInt(CategoryID)) {
      return NextResponse.json(
        { error: `Kategori dengan nama "${Name}" sudah ada` },
        { status: 409 }
      );
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { CategoryID: parseInt(CategoryID) },
      data: { Name },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Error update kategori",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const categoryIDs = url.searchParams.getAll("CategoryID");

    // Validate query parameter CategoryID
    if (categoryIDs.length === 0) {
      return NextResponse.json(
        { error: "Query parameter CategoryID diperlukan" },
        { status: 400 }
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
      return NextResponse.json(
        { error: "Salah satu atau beberapa kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    // Check for related records in other tables
    for (const id of categoryIDs) {
      const relatedRecords = await prisma.dress.findMany({
        where: { CategoryID: parseInt(id) },
      });

      if (relatedRecords.length > 0) {
        return NextResponse.json(
          {
            error: `Kategori dengan ID ${id} memiliki ${relatedRecords.length} dress terkait`,
          },
          { status: 409 }
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

    return NextResponse.json(deletedCategories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Error menghapus kategori",
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Mengambil seluruh kategori
    const categories = await prisma.category.findMany({
      include: {
        Dress: true,
      },
    });

    if (categories.length === 0) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      categories.map((category) => ({
        ...category,
        DressCount: category.Dress.length,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Error mengambil kategori",
      },
      { status: 500 }
    );
  }
}
