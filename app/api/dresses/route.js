import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

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
        error: error.message || "Terjadi kesalahan saat mengambil data dress",
      },
      { status: 500 }
    );
  }
}
