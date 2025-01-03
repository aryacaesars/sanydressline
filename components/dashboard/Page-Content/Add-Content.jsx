"use client";

import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema } from "@/schemas/contentSchemas";
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

const AddContent = () => {
    const [imagePreviews, setImagePreviews] = useState([]);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(contentSchema),
        defaultValues: {
            pageName: "",
            section: "",
            title: "",
            paragraph: "",
            images: [],
        },
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        form.setValue("images", files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("PageName", data.pageName);
        formData.append("Section", data.section);
        formData.append("Title", data.title);
        formData.append("Paragraph", data.paragraph);

        data.images.forEach((image) => {
            formData.append("Image", image);
        });

        try {
            const response = await fetch("/api/page-content", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.error || "Failed to add content");
            }

            router.push("/dashboard");
        } catch (error) {
            console.error("Error adding content:", error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-center text-xl font-semibold mb-4">Add New Content</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="pageName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Page Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Page Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="section"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Section</FormLabel>
                                <FormControl>
                                    <Input placeholder="Section" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="paragraph"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Paragraph</FormLabel>
                                <FormControl>
                                    <Input placeholder="Paragraph" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <Button type="submit">Add Content</Button>
                </form>
            </Form>
        </div>
    );
};

export default AddContent;