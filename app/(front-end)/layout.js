// app/(front-end)/layout.js
import "../globals.css";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

export const metadata = {
    title: "Sanydressline",
    description: "dress",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        <CartProvider>
            <Navbar />
            {children}
            <div className="mt-96">
                <Toaster />
                <Footer />
            </div>
        </CartProvider>
        </body>
        </html>
    );
}