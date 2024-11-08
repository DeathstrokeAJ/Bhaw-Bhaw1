import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConnectNewsletter from "@/components/ConnectNewsletter";
import { AuthProvider } from './context/AuthContext';
import { CartWishlistProvider } from './context/CartWishlistContext';
import ClientProvider from "@/components/ClientProvider";

export const metadata = {
  title: "Bhaw Bhaw",
  description: "Bhaw bhaw User Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Staatliches&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white">
        <AuthProvider>
          <CartWishlistProvider>
            <ClientProvider>
              <Navbar />
                {children}
              <Footer />
            </ClientProvider>
          </CartWishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
