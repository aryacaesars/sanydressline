import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const CartIcon = ({ itemCount, onClick }) => {
    return (
        <motion.div
            className="relative cursor-pointer"
            onClick={onClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
                <motion.span
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    {itemCount}
                </motion.span>
            )}
        </motion.div>
    );
};

export default CartIcon;

