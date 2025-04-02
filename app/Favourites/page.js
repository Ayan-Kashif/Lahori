'use client'

import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]); // 🛒 Cart State

    useEffect(() => {
        // Fetch favorites from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem("liked")) || [];
        setFavorites(storedFavorites);
    }, []);

    return (
        <>
        <Navbar/>
      
        <div className="min-h-screen mt-16 bg-gray-100   p-6">
            <h1 className="text-3xl  font-bold text-center mb-6">Your Favorites</h1>
            {favorites.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {favorites.map((item, index) => (
                        <div key={index} className="bg-gray-800 rounded-2xl p-4 shadow-lg transition-transform hover:scale-105">
                            <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                            <h2 className="text-xl font-semibold">{item.title}</h2>
                            <p className="text-gray-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400">No favorites added yet.</p>
            )}
        </div>
        </>
    );
}
