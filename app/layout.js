import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from "./AuthContext";
import { SessionWrapper } from "./components/SessionWrapper";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lahori",
  description: "Developed by Ayan Kashif",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
        <AuthProvider>
        {/* <Navbar/> */}
        {children}
        <Footer />
        </AuthProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
