// schemas/productSchema.js
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sizes: z.array(
    z.object({
      Size: z.string().min(1, "Size is required"),
      Stock: z.number().min(0, "Stock must be a positive number"),
    })
  ),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), {
      message: "Price must be a valid number",
    }),
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  categoryID: z.string().min(1, "Category is required"),
});