import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from 'next/image';

const ProductCard = React.memo(({ product, onEdit, onDelete }) => {
  const { Image: ProductImage, Name, PriceFormatted, Sizes } = product;
  const totalStock = Sizes.reduce((acc, size) => acc + size.Stock, 0);

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
              className="relative h-48 sm:h-64 overflow-hidden"
          >
            <Image
                src={ProductImage?.[0]?.Url || null}
                alt={Name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 ease-in-out transform hover:scale-110"
                loading="lazy"
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
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-gray-600 text-xs sm:text-sm"
            >
              Total Stock: {totalStock}
            </motion.p>
          </CardContent>
          <CardFooter className="p-2 sm:p-4 bg-gray-50 flex justify-between">
            <button
              onClick={() => onEdit(product)}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </CardFooter>
        </motion.div>
      </Card>
  );
});

export default ProductCard;