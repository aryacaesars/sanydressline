// components/dashboard/Product/EditProduct.jsx
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProductSchema } from "@/schemas/productSchemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditProductModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [formData, setFormData] = useState(null);

  const form = useForm({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: "",
      sizes: [],
      description: "",
      price: "",
      images: [],
      categoryID: "",
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
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (product) {
      form.reset({
        name: product.Name,
        sizes: product.Sizes,
        description: product.Description,
        price: product.Price,
        categoryID: String(product.CategoryID),
      });
      setImagePreviews(product.Image.map((img) => img.Url));
    }

    fetchCategories();
  }, [product, form]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    form.setValue("images", files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

const handleSubmit = (data) => {
  const parsedData = {
    ...data,
    sizes: data.sizes.map((size) => ({
      ...size,
      Stock: String(size.Stock),
    })),
  };
  setFormData(parsedData);
  setIsAlertOpen(true);
};

  const handleConfirm = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label>Name</Label>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
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
                    <Label>Price</Label>
                    <FormControl>
                      <Input type="number" placeholder="Product Price" {...field} />
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
                    <Label>Category</Label>
                    <FormControl>
                      <select {...field} className="block w-full p-2 border border-gray-300 rounded">
                        <option value="" disabled>
                          Select Category
                        </option>
                        {categories.map((category) => (
                          <option key={category.CategoryID} value={String(category.CategoryID)}>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <Label>Description</Label>
                    <FormControl>
                      <Input placeholder="Product Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <Label>Images</Label>
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
                <img key={index} src={preview} alt={`Preview ${index + 1}`} className="w-32 h-32 object-cover rounded" />
              ))}
            </div>
            <div>
              <Label>Sizes</Label>
              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-2 mb-2">
                  <FormField
                    control={form.control}
                    name={`sizes.${index}.Size`}
                    render={({ field }) => (
                      <FormItem>
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
                        <FormControl>
                          <Input type="number" placeholder="Stock" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" onClick={() => remove(index)}>Remove</Button>
                </div>
              ))}
              <Button type="button" onClick={() => append({ Size: "", Stock: 0 })}>Add Size</Button>
            </div>
            <DialogFooter>
              <Button type="submit">Update Product</Button>
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to update this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will update the product details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default EditProductModal;