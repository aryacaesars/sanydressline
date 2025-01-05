import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import cloudinary from "../../../lib/api/config/cloudinary-config";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageName = searchParams.get("pageName");

    if (!pageName) {
      return NextResponse.json(
        { error: "Parameter query yang diperlukan hilang: pageName" },
        { status: 400 }
      );
    }

    const contents = await prisma.pageContent.findMany({
      where: { PageName: pageName },
      include: {
        Images: true,
      },
    });

    return NextResponse.json(contents, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message || "Terjadi kesalahan saat mengambil data konten",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Utility for input validation
    const validateInput = ({ PageName, Section, Title, Paragraph }) => {
      if (!PageName || !Section || !Title || !Paragraph) {
        throw new Error("Missing required fields");
      }
    };

    // Validation for single object
    const PageName = formData.get("PageName");
    const Section = formData.get("Section");
    const Title = formData.get("Title");
    const Paragraph = formData.get("Paragraph");
    const Images = formData.getAll("Image");

    // Upload images to Cloudinary
    const imageUrls = [];
    const publicIds = [];
    for (const Img of Images) {
      const buffer = Buffer.from(await Img.arrayBuffer());
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
        uploadStream.end(buffer);
      });
      imageUrls.push(uploadResponse.secure_url);
      publicIds.push(uploadResponse.public_id);
    }

    const content = { PageName, Section, Title, Paragraph };
    validateInput(content);

    // Create a single entry for PageContent
    const newContent = await prisma.pageContent.create({
      data: content,
    });

    // Create entries for each Image
    for (let i = 0; i < imageUrls.length; i++) {
      await prisma.image.create({
        data: {
          ContentID: newContent.ContentID,
          PublicID: publicIds[i],
          Url: imageUrls[i],
          Alt: `${Section} - Image ${i + 1}`,
        },
      });
    }

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error(error.message || error);
    return NextResponse.json(
      { error: error.message || "Error creating page content" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const ContentID = url.searchParams.get("ContentID");

    // Validate query parameter ContentID
    if (!ContentID) {
      return NextResponse.json(
        { error: "Missing required query parameter: ContentID" },
        { status: 400 }
      );
    }

    const { Title, Paragraph } = await req.json();

    // Validate body to ensure all required fields are present
    if (!Title || !Paragraph) {
      return NextResponse.json(
        { error: "Missing required fields: Title, Paragraph" },
        { status: 400 }
      );
    }

    // Validate existence of data based on ContentID
    const existingContent = await prisma.pageContent.findUnique({
      where: { ContentID: parseInt(ContentID) },
    });

    if (!existingContent) {
      return NextResponse.json(
        { error: "ContentID not found in database" },
        { status: 404 }
      );
    }

    const content = {
      Title,
      Paragraph,
    };

    // Update data in the database
    const updatedContent = await prisma.pageContent.update({
      where: { ContentID: parseInt(ContentID) },
      data: content,
    });

    return NextResponse.json(updatedContent, { status: 200 });
  } catch (error) {
    console.error("Error Details:", error);
    return NextResponse.json(
      {
        error: error.message || "Error updating page content",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const ContentID = url.searchParams.get("ContentID");

    // Validate query parameter ContentID
    if (!ContentID) {
      return new Response(
        JSON.stringify({
          error: "Missing required query parameter: ContentID",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate existence of data based on ContentID
    const existingContent = await prisma.pageContent.findUnique({
      where: { ContentID: parseInt(ContentID) },
    });

    if (!existingContent) {
      return new Response(
        JSON.stringify({ error: "ContentID not found in database" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Find images associated with the content
    const images = await prisma.image.findMany({
      where: { ContentID: parseInt(ContentID) },
    });

    // Delete images from Cloudinary
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

    // Delete images from the database
    await prisma.image.deleteMany({
      where: { ContentID: parseInt(ContentID) },
    });

    // Delete the content from the database
    await prisma.pageContent.delete({
      where: { ContentID: parseInt(ContentID) },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error Details:", error);
    return new Response(
      JSON.stringify({
        error: "Error deleting page content",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
