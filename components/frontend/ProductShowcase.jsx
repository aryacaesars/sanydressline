// components/frontend/ProductShowcase.jsx
"use client";
import React, {useState} from 'react';
import {motion} from 'framer-motion';
import ProductCard from "@/components/frontend/Product";
import ProductDetails from "@/components/frontend/ProductDetails";
import Navbar from "@/components/frontend/Navbar";
import {useRouter} from 'next/navigation';
import {useCart} from '@/context/CartContext';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const ITEMS_PER_PAGE = 6;

export default function DressShowcase() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const {cartItems, addToCart} = useCart();
    const router = useRouter();

    const dresses = [
        // ... (data dresses)
        {
            id: 1,
            image: "/placeholder.svg?height=400&width=400",
            title: "Elegant Evening Gown",
            price: 299.99,
            description: "A stunning floor-length gown perfect for formal events. Features a sweetheart neckline and a flowing skirt.",
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: "Midnight Blue",
            material: "Silk",
            careInstructions: "Dry clean only"
        },
        {
            id: 2,
            image: "/placeholder.svg?height=400&width=400",
            title: "Floral Summer Dress",
            price: 79.99,
            description: "A light and breezy dress perfect for summer days. Features a vibrant floral print and a comfortable fit.",
            sizes: ['S', 'M', 'L'],
            color: "Multicolor",
            material: "Cotton",
            careInstructions: "Machine wash cold, tumble dry low"
        },
        {
            id: 3,
            image: "/placeholder.svg?height=400&width=400",
            title: "Cocktail Party Dress",
            price: 149.99,
            description: "A chic and stylish dress for cocktail parties. Features a fitted bodice and a flared skirt.",
            sizes: ['XS', 'S', 'M', 'L'],
            color: "Ruby Red",
            material: "Polyester Blend",
            careInstructions: "Hand wash cold, line dry"
        },
        {
            id: 4,
            image: "/placeholder.svg?height=400&width=400",
            title: "Bohemian Maxi Dress",
            price: 129.99,
            description: "A free-spirited maxi dress with a bohemian flair. Features intricate embroidery and a relaxed fit.",
            sizes: ['S', 'M', 'L', 'XL'],
            color: "Ivory",
            material: "Rayon",
            careInstructions: "Machine wash cold, line dry"
        },
        {
            id: 5,
            image: "/placeholder.svg?height=400&width=400",
            title: "Little Black Dress",
            price: 199.99,
            description: "A timeless little black dress suitable for various occasions. Features a classic silhouette and a flattering fit.",
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            color: "Black",
            material: "Polyester",
            careInstructions: "Dry clean recommended"
        },
        {
            id: 6,
            image: "/placeholder.svg?height=400&width=400",
            title: "Wrap Midi Dress",
            price: 89.99,
            description: "A versatile wrap dress that can be dressed up or down. Features a flattering v-neckline and a tie waist.",
            sizes: ['S', 'M', 'L'],
            color: "Emerald Green",
            material: "Jersey Knit",
            careInstructions: "Machine wash cold, hang to dry"
        },
        {
            id: 7,
            image: "/placeholder.svg?height=400&width=400",
            title: "Off-Shoulder Sundress",
            price: 69.99,
            description: "A charming off-shoulder sundress perfect for beach days. Features a lightweight fabric and a relaxed fit.",
            sizes: ['XS', 'S', 'M', 'L'],
            color: "Coral",
            material: "Linen Blend",
            careInstructions: "Machine wash cold, tumble dry low"
        },
        {
            id: 8,
            image: "/placeholder.svg?height=400&width=400",
            title: "Sequin Party Dress",
            price: 179.99,
            description: "A dazzling sequin dress for special occasions. Features all-over sequins and a form-fitting silhouette.",
            sizes: ['S', 'M', 'L'],
            color: "Silver",
            material: "Polyester with Sequins",
            careInstructions: "Dry clean only"
        },
    ];

    const totalPages = Math.ceil(dresses.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentDresses = dresses.slice(startIndex, endIndex);

    const handleAddToCart = (product) => {
        if (product.price && !isNaN(product.price)) {
            addToCart(product);
        } else {
            console.error('Invalid product price:', product);
        }
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    const closeProductDetails = () => {
        setSelectedProduct(null);
    };

    const handleCartClick = () => {
        router.push('/checkout');
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <Navbar cart={cartItems}/>
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <motion.h1
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="text-4xl font-extrabold text-gray-900"
                    >
                        Elegant Dress Collection
                    </motion.h1>
                </div>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentDresses.map((dress) => (
                        <ProductCard
                            key={dress.id}
                            product={dress}
                            onAddToCart={handleAddToCart}
                            onProductClick={handleProductClick}
                        />
                    ))}
                </div>
                <div className="mt-12">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        href="#"
                                        onClick={() => setCurrentPage(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
            {selectedProduct && (
                <ProductDetails product={selectedProduct}
                                onClose={closeProductDetails}
                                onAddToCart={handleAddToCart}/>
            )}
        </div>
    );
}