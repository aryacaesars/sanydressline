import { z } from "zod";

export const contentSchema = z.object({
    pageName: z.string().min(1, "Page Name is required"),
    section: z.string().min(1, "Section is required"),
    title: z.string().min(1, "Title is required"),
    paragraph: z.string().min(1, "Paragraph is required"),
    images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
});