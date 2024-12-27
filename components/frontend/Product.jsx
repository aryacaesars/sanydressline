'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onProductClick }) => {
  const { Image, Name, PriceFormatted, Description } = product;

  return (
      <Card className="w-full overflow-hidden bg-white shadow-lg rounded-lg">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
        >
          <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative h-48 sm:h-64 overflow-hidden cursor-pointer"
              onClick={() => onProductClick(product)}
          >
            <img
                src={Image[0]?.Url}
                alt={Name}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
            />
          </motion.div>
          <CardContent className="p-2 sm:p-4">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2 truncate"
            >
              {Name}
            </motion.h2>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-1 sm:mb-2"
            >
              <span className="text-xl sm:text-2xl font-bold text-primary">{PriceFormatted}</span>
            </motion.div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2"
            >
              {Description}
            </motion.p>
          </CardContent>
          <CardFooter className="p-2 sm:p-4 bg-gray-50">
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
            >
              <Button onClick={() => onAddToCart(product)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </motion.div>
          </CardFooter>
        </motion.div>
      </Card>
  );
};

export default ProductCard;