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

    if (!isArray) {
      const { PageName, Section, SubSection, Content } = body;

      if (!PageName || !Section || !SubSection || !Content) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const newContent = await prisma.pageContent.create({
        data: {
          PageName,
          Section,
          SubSection,
          Content,
          UpdatedAt: new Date(),
        },
      });

      return new Response(JSON.stringify(newContent), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      const createdContents = [];

      for (const item of body) {
        const { PageName, Section, SubSection, Content } = item;

        if (!PageName || !Section || !SubSection || !Content) {
          return new Response(
            JSON.stringify({ error: "Missing required fields in array item" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        const newContent = await prisma.pageContent.create({
          data: {
            PageName,
            Section,
            SubSection,
            Content,
            UpdatedAt: new Date(),
          },
        });

        createdContents.push(newContent);
      }

      return new Response(JSON.stringify(createdContents), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error creating page content" }),
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

    // Validasi query parameter
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
    const { PageName, Section, SubSection, Content } = body;

    // Validasi body
    if (!PageName || !Section || !SubSection || !Content) {
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
        SubSection,
        Content,
        UpdatedAt: new Date(),
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

// nu PATCH sigana can butuh jadi komen hela we
// export async function PATCH(req) {
//   try {
//     const url = new URL(req.url);
//     const PageName = url.searchParams.get("PageName");
//     const Section = url.searchParams.get("Section");
//     const SubSection = url.searchParams.get("SubSection");

//     // Validasi kunci unik wajib
//     if (!PageName || !Section || !SubSection) {
//       return new Response(
//         JSON.stringify({ error: "Missing required query parameters" }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     const body = await req.json();
//     const { Content } = body;

//     // Logika pembaruan hanya untuk field yang diberikan
//     const dataToUpdate = {
//       ...(Content && { Content }),
//       UpdatedAt: new Date(),
//     };

//     if (Object.keys(dataToUpdate).length === 1) {
//       return new Response(
//         JSON.stringify({ error: "No valid fields to update" }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     const updatedContent = await prisma.pageContent.update({
//       where: { PageName_Section_SubSection: { PageName, Section, SubSection } },
//       data: dataToUpdate,
//     });

//     return new Response(JSON.stringify(updatedContent), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(
//       JSON.stringify({ error: "Error updating page content" }),
//       {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   }
// }
