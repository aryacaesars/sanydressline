import React from 'react';
import {motion} from 'framer-motion';
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ShoppingCart} from 'lucide-react';
import Image from 'next/image';

const ProductCard = React.memo(({product, onAddToCart, onProductClick}) => {
    const {
        Image: ProductImage,
        Name,
        PriceFormatted,
        Sizes,
        OrderCount
    } = product;
    const totalStock = Sizes.reduce((acc, size) => acc + size.Stock, 0);

    const handleAddToCart = () => {
        onProductClick(product);
    };

    return (
        <section className='container p-6'>
        <Card className="w-full overflow-hidden bg-white shadow-lg rounded-xl">
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{duration: 0.5}}
                className="relative"
            >
                <motion.div
                    whileHover={{scale: 1.05}}
                    transition={{duration: 0.3}}
                    className="relative h-48 sm:h-64 overflow-hidden cursor-pointer"
                    onClick={() => onProductClick(product)}
                >
                    <Image
                        src={ProductImage[0]?.Url}
                        alt={Name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                        loading="lazy"
                    />
                </motion.div>
                <CardContent className="p-2 sm:p-4">
                    <motion.h2
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{delay: 0.2, duration: 0.5}}
                        className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 truncate"
                    >
                        {Name}
                    </motion.h2>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.3, duration: 0.5}}
                        className="mb-1 sm:mb-2"
                    >
                        <span
                            className="text-xl sm:text-2xl font-bold text-primary">{PriceFormatted}</span>
                    </motion.div>
                    <motion.p
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.5, duration: 0.5}}
                        className="text-gray-600 text-xs sm:text-sm"
                    >
                        Total Stok: {totalStock}
                    </motion.p>
                    <motion.p
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.5, duration: 0.5}}
                        className="text-gray-600 text-xs sm:text-sm"
                    >
                        Jumlah Penggunaan: {OrderCount}
                    </motion.p>
                </CardContent>
                <CardFooter className="p-2 sm:p-4 bg-gray-50">
                    <motion.div
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        className="w-full"
                    >
                        <Button onClick={handleAddToCart}
                                className="w-full rounded-xl bg-primary text-green-900 hover:bg-primary/90">
                            <ShoppingCart className="mr-2 h-4 w-4"/> Order
                        </Button>
                    </motion.div>
                </CardFooter>
            </motion.div>
        </Card>
        </section>
    );
});

export default ProductCard;