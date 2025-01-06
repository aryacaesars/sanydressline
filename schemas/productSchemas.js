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
    price: z.number().min(0, "Price must be a positive number"),
    images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
    categoryID: z.string().min(1, "Category is required"),
    isVisible: z.boolean(),
    orderCount: z.preprocess((val) => Number(val), z.number().min(0, "OrderCount must be a positive number").default(0)),
});


export const editProductSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    sizes: z
        .array(
            z.object({
                Size: z.string().min(1, { message: "Size is required" }),
                Stock: z.coerce.number().min(0, { message: "Stock must be a positive number" }),
            })
        )
        .min(1, { message: "At least one size is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.coerce.number().min(0, { message: "Price must be a positive number" }),
    categoryID: z.string().min(1, { message: "Category is required" }),
    isVisible: z.boolean().optional().default(true),
    orderCount: z.coerce.number().min(0, { message: "Order count must be a positive number" }).default(0),
});
