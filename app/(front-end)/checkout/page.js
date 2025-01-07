"use client";

import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import { toast } from "sonner";

const Checkout = React.memo(() => {
  const router = useRouter();
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } =
    useCart();

  const handleIncreaseQuantity = useCallback(
    (item) => {
      const stock = item.Sizes.find(
        (size) => size.SizeID === item.selectedSize
      ).Stock;
      if (item.quantity < stock) {
        increaseQuantity(item.id, item.selectedSize);
      } else {
        toast("Cannot increase quantity", {
          description: "Quantity exceeds available stock",
        });
      }
    },
    [increaseQuantity]
  );

  const handleDecreaseQuantity = useCallback(
    (item) => {
      if (item.quantity > 1) {
        decreaseQuantity(item.id, item.selectedSize);
      } else {
        toast("Cannot decrease quantity", {
          description: "Quantity cannot be less than 1",
        });
      }
    },
    [decreaseQuantity]
  );

  const handleRemoveFromCart = useCallback(
    (id, selectedSize, name) => {
      removeFromCart(id, selectedSize);
      toast("Item removed", { description: `Removed ${name} from cart` });
    },
    [removeFromCart]
  );

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const itemPrice = parseFloat(
        item.PriceFormatted.replace(/[^0-9,-]+/g, "").replace(",", ".")
      );
      return sum + itemPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  const handleProceedToPayment = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_ADMIN_PHONE_NUMBER; 
    const message = cartItems
      .map((item) => {
        const size = item.Sizes.find(
          (size) => size.SizeID === item.selectedSize
        ).Size;
        return `Produk: *${item.Name}*\nUkuran: ${size}\nJumlah: ${item.quantity}\nHarga satuan: ${item.PriceFormatted}\n`;
      })
      .join("\n");

    const totalFormatted = `Total: Rp ${total.toLocaleString("id-ID", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

    const whatsappMessage = `Halo, saya ingin memesan produk berikut:\n\n${message}\n${totalFormatted}\n\nTerima kasih.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.location.href = whatsappUrl;
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-3xl my-20 mx-auto rounded-lg shadow-xl p-8 bg-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-center"
        >
          Checkout
        </motion.h1>
        <div className="space-y-6">
          {cartItems.map((item) => (
            <motion.div
              key={item.DressID}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-between items-center border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.Image[0]?.Url}
                  alt={item.Name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h2 className="font-semibold text-lg">{item.Name}</h2>
                  <p className="text-gray-600">
                    Size:{" "}
                    {
                      item.Sizes.find(
                        (size) => size.SizeID === item.selectedSize
                      ).Size
                    }
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        className={`p-3 w-10 h-10 text-center text-lg text-gray-700 border-r hover:bg-gray-100 ${
                          item.quantity <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={item.quantity <= 1}
                      >
                        <AiOutlineMinus />
                      </button>
                      <span className="px-4 text-lg font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="p-3 w-10 h-10 text-center text-lg text-gray-700 border-l hover:bg-gray-100"
                      >
                        <AiOutlinePlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-lg">{item.PriceFormatted}</p>
                <button
                  onClick={() =>
                    handleRemoveFromCart(item.id, item.selectedSize, item.Name)
                  }
                  className="p-3 w-10 h-10 text-center text-lg text-gray-700 border rounded-md hover:bg-gray-100 flex items-center justify-center"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-between items-center pt-4"
          >
            <h2 className="text-xl font-bold">Total:</h2>
            <p className="text-xl font-bold">
              Rp{" "}
              {total.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 space-y-4"
        >
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-lg"
            onClick={handleProceedToPayment}
          >
            Pesan sekarang
          </Button>
          <Button
            variant="outline"
            className="w-full py-3 rounded-lg"
            onClick={() => router.push("/")}
          >
            Lanjutkan memilih produk
          </Button>
        </motion.div>
      </div>
    </div>
  );
});

export default Checkout;
