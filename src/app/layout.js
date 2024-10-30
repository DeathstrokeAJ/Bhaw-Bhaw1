import localFont from "next/font/local"; // Import local font if needed
import "./globals.css"; // Global CSS styles
import Navbar from "@/components/Navbar"; // Import Navbar component
import Footer from "@/components/Footer"; // Import Footer component
import ConnectNewsletter from "@/components/ConnectNewsletter"; // Import Newsletter connection component

export const metadata = {
  title: "Bhaw Bhaw",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Load Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Staatliches&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Kiwi+Maru:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
