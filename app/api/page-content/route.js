import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pageName = searchParams.get("pageName");

    if (!pageName) {
      return new Response(
        JSON.stringify({ error: "Missing pageName query parameter" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const contents = await prisma.pageContent.findMany({
      where: { PageName: pageName },
    });

    return new Response(JSON.stringify(contents), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error fetching page content" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const isArray = Array.isArray(body);

    // Utilitas untuk validasi input
    const validateInput = ({ PageName, Section, Title, Paragraph, Img }) => {
      if (!PageName || !Section || !Title || !Paragraph || !Img) {
        throw new Error("Missing required fields");
      }
    };

    if (!isArray) {
      // Validasi untuk single object
      validateInput(body);

      // Buat satu entri
      const newContent = await prisma.pageContent.create({
        data: body,
      });

      return new Response(JSON.stringify(newContent), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Validasi untuk array
      body.forEach(validateInput);

      // Buat banyak entri menggunakan Promise.all
      const createdContents = await Promise.all(
        body.map((item) =>
          prisma.pageContent.create({
            data: item,
          })
        )
      );

      return new Response(JSON.stringify(createdContents), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error.message || error);
    return new Response(
      JSON.stringify({ error: error.message || "Error creating page content" }),
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
    const ContentID = url.searchParams.get("ContentID");

    // Validasi query parameter ContentID
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

    const body = await req.json();
    const { PageName, Section, Title, Paragraph, Img } = body;

    // Validasi body untuk memastikan semua field yang diperlukan ada
    if (!PageName || !Section || !Title || !Paragraph || !Img) {
      return new Response(
        JSON.stringify({ error: "Missing required fields in body" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validasi keberadaan data berdasarkan ContentID
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

    // Update data di database
    const updatedContent = await prisma.pageContent.update({
      where: { ContentID: parseInt(ContentID) },
      data: {
        PageName,
        Section,
        Title,
        Paragraph,
        Img
      },
    });

    return new Response(JSON.stringify(updatedContent), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error Details:", error);
    return new Response(
      JSON.stringify({
        error: "Error updating page content",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
