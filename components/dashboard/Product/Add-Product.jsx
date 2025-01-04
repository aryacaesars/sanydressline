"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/schemas/productSchemas";
import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddProduct = () => {
    const [categories, setCategories] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            sizes: [{ Size: "", Stock: 0 }],
            description: "",
            price: 0,
            images: [],
            categoryID: "",
            isVisible: true,
            orderCount: 0,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "sizes",
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/category");
                if (!response.ok) throw new Error("Failed to fetch categories");
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        form.setValue("images", files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("Name", data.name);
        formData.append("Description", data.description);
        formData.append("Price", String(data.price));
        formData.append("OrderCount", data.orderCount);
        formData.append("IsVisible", data.isVisible);
        formData.append("CategoryID", data.categoryID);
        formData.append(
            "Sizes",
            JSON.stringify(
                data.sizes.map((size) => ({
                    Size: size.Size,
                    Stock: size.Stock,
                }))
            )
        );

        data.images.forEach((image) => {
            formData.append("Image", image);
        });

        try {
            const response = await fetch("/api/dress", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.error || "Failed to add product");
            }

            router.push("/dashboard");
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-center text-xl font-semibold mb-4">Add New Product</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Product Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Product Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Product Price"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryID"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="block w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="" disabled>
                                            Select Category
                                        </option>
                                        {categories.map((category) => (
                                            <option key={category.CategoryID} value={category.CategoryID}>
                                                {category.Name}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isVisible"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Is Visible</FormLabel>
                                <FormControl>
                                    <input type="checkbox" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="orderCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Order Count</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Order Count" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex space-x-4">
                            <FormField
                                control={form.control}
                                name={`sizes.${index}.Size`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Size</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Size" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`sizes.${index}.Stock`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Stock"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" onClick={() => remove(index)}>
                                Remove
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => append({ Size: "", Stock: 0 })}>
                        Add Size
                    </Button>
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-wrap gap-4">
                        {imagePreviews.map((preview, index) => (
                            <img
                                key={index}
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-32 h-32 object-cover rounded"
                            />
                        ))}
                    </div>
                    <Button type="submit">Add Product</Button>
                </form>
            </Form>
        </div>
    );
};

export default AddProduct;