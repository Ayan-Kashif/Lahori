"use client";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdOutlineFavorite } from "react-icons/md";

const Navbar = () => {
    const [isShaking, setIsShaking] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [favCount, setFavCount] = useState(0);

    // Update cart count and trigger shake
    const updateCartCount = () => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = savedCart.reduce((acc, item) => acc + (item.quantity || 1), 0);
        setCartCount(totalItems);

        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    // Update favorite count
    const updateFavCount = () => {
        const likedItems = JSON.parse(localStorage.getItem("liked")) || [];
        setFavCount(likedItems.length);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    // Load counts on mount
    useEffect(() => {
        updateCartCount();
        updateFavCount();

        // Listen for custom storage update events
        const handleCartUpdate = () => updateCartCount();
        const handleFavUpdate = () => updateFavCount();

        window.addEventListener("cartUpdated", handleCartUpdate);
        window.addEventListener("favUpdated", handleFavUpdate);

        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdate);
            window.removeEventListener("favUpdated", handleFavUpdate);
        };
    }, []);

    return (
        <nav className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 flex justify-between items-center shadow-lg fixed w-full top-0 z-50">
            {/* Logo */}
            <Link href='/' className="flex gap-2 justify-center items-center">
                <img  className='w-12' src='/logo.png' alt="Lahori Logo" />
                <h1 className="text-2xl font-bold tracking-wide">LAHORI</h1>
            </Link>

            {/* Icons Container */}
            <div className="flex items-center gap-6">
                {/* Favorites Icon */}
                <motion.div
                    className="relative cursor-pointer"
                    animate={isShaking ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <Link href="/Favourites" className="relative cursor-pointer">
                        <MdOutlineFavorite size={28} className="text-white" />
                        {favCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full px-2">
                                {favCount}
                            </span>
                        )}
                    </Link>
                </motion.div>
                {/* Cart Icon */}
                <motion.div
                    className="relative cursor-pointer"
                    animate={isShaking ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                >
                    <Link href="/Cart">
                        <ShoppingCart size={28} className="text-white" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full px-2">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </motion.div>
            </div>
        </nav>
    );
};

export default Navbar;
