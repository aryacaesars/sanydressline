// app/(front-end)/layout.js
import "../globals.css";
import Navbar from "@/components/frontend/Navbar";
import Footer from "@/components/frontend/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

export const metadata = {
    title: "Sanydressline - Your Fashion Destination",
    description: "Discover the latest trends in dresses and fashion at Sanydressline. Shop now for the best deals and styles.",
    keywords: "fashion, dresses, online shopping, trendy clothes, Sanydressline",
    author: "Sanydressline Team",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content={metadata.description} />
            <meta name="keywords" content={metadata.keywords} />
            <meta name="author" content={metadata.author} />
            <title>{metadata.title}</title>
            <link rel="icon" href="/favicon.ico" />
        </head>
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