

"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar"; // Import Navbar
import { toast, Toaster } from 'sonner'
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
const categories = [
  "Deal", "Pizza", "Burger", "Shawarma", "Quick Bite", "Beverage"
];

const App = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const categoryRefs = useRef({});
  const [cart, setCart] = useState([]); // 🛒 Cart State
  const url = process.env.NEXT_PUBLIC_API_URL
  console.log(process.env.NEXT_PUBLIC_API_URL)
  // State to store selected size/type for each item
  const [selectedOptions, setSelectedOptions] = useState({});

  // Function to handle selection change
  const handleSizeChange = (itemId, size) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [itemId]: size, // Update the selected size for the item
    }));
  };


  const [favorites, setFavorites] = useState([]);


  // On initial load, get favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("liked");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites)); // Set the state to the favorites from localStorage
    }
  }, []);

  // Check if an item is already in the favorites
  const isFavorite = (id) => {
    return favorites.some((item) => item._id === id);
  };

  // Toggle favorite status
  const toggleFavorite = (item) => {

    let updatedFavorites;

    // Check if the item is already in the favorites
    if (isFavorite(item._id)) {
      // Remove item from favorites if it exists
      toast('Item removed from Favourites')
      updatedFavorites = favorites.filter((val) => val._id !== item._id);
      // Dispatch a custom event to notify Navbar
      window.dispatchEvent(new Event("cartUpdated"));

    } else {
      // Add item to favorites if it doesn't exist
      toast('Item added to Favourites')
      updatedFavorites = [...favorites, item];
      // Dispatch a custom event to notify Navbar
      window.dispatchEvent(new Event("cartUpdated"));

    }

    // Update state and localStorage
    setFavorites(updatedFavorites);
    localStorage.setItem("liked", JSON.stringify(updatedFavorites)); // Update localStorage
  };



  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        console.log(url)
        const response = await fetch(`${url}/api/menu`)
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  // Scroll to category section
  const handleScroll = (category) => {
    if (categoryRefs.current[category]) {
      categoryRefs.current[category].scrollIntoView({ behavior: "smooth" });
    }
  };


  const addToCart = (item) => {
    setCart((prevCart) => {
      console.log("Adding item:", item);
      console.log("Previous Cart:", prevCart);

      const selectedSize = selectedOptions[item._id] || (item.sizes.length > 0 ? item.sizes[0].size : null);

      const existingItemIndex = prevCart.findIndex((cartItem) => {
        if (item.category.toLowerCase() === "pizza") {
          return cartItem.name === item.name && cartItem.selectedSize === selectedSize;
        } else if (["shake", "samosa"].some(type => item.name.toLowerCase().includes(type))) {
          return cartItem.name === item.name && cartItem.selectedType === selectedSize;
        } else {
          return cartItem.name === item.name;
        }
      });

      let updatedCart;
      if (existingItemIndex !== -1) {
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart = [...prevCart, { ...item, selectedSize, quantity: 1 }];
      }

      console.log("Updated Cart:", updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));


      //Toast
      toast.success('Item added to cart')

      // Dispatch a custom event to notify Navbar
      window.dispatchEvent(new Event("cartUpdated"));

      return updatedCart;
    });
  };


  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter(item => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-center" />
      {/* Pass cart state and addToCart function to Navbar */}
      <Navbar cartItems={cart} />

      <div className="container min-h-screen bg-white text-black  mt-20 mx-auto p-4">
        {/* Categories Navigation */}
        <div className="bg-purple-800 text-white flex space-x-4 p-3 rounded-lg sticky top-14 z-50 overflow-x-auto whitespace-nowrap">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded transition hover:bg-yellow-400 hover:text-black"
              onClick={() => handleScroll(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative my-4">
          <input
            type="text"
            placeholder="🔍 Search for Crunch"
            className="w-full p-3 pl-10 border rounded-lg shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Display Menu Items */}
        {categories.map((category) => {
          const categoryItems = filteredItems.filter((item) => item.category === category);
          if (categoryItems.length === 0) return null;

          return (
            <div className='bg-white text-black' key={category} ref={(el) => (categoryRefs.current[category] = el)}>
              <h2 className="text-2xl font-bold mt-6">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                {categoryItems.map((item) => (
                  <div key={item._id} className="flex bg-white shadow-lg p-4 rounded-lg items-center">
                    {/* Image */}
                    <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-lg" />

                    {/* Details */}
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p className="text-gray-600">{item.description}</p>

                      {/* Price & Size Selection for Pizzas */}
                      {item.sizes.length > 0 ? (
                        <div className="mt-2">
                          <label className="text-sm font-semibold block mb-1">
                            {item.category === "Pizzas" ? "Select Size:" : "Select Type:"}
                          </label>
                          <div className="relative">
                            <select
                              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 
                              focus:outline-none focus:ring-2 focus:ring-orange-500 transition 
                              appearance-none cursor-pointer"
                              value={selectedOptions[item._id] || ""}
                              onChange={(e) => handleSizeChange(item._id, e.target.value)}
                            >
                              <option disabled value="">
                                {item.category === "Pizzas" ? "Choose a size" : "Choose a type"}
                              </option>
                              {item.sizes.map((size) => (
                                <option key={size.size} value={size.size}>
                                  {size.size} - Rs {size.price}
                                </option>
                              ))}
                            </select>

                            {/* Custom Dropdown Arrow */}
                            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
                              🔽 {/* Replace this with an SVG icon */}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-md font-bold text-orange-600 mt-1">Rs {item.price}</p>
                      )}

                      {/* Add to Cart Button */}
                      <button
                        className="mt-3 bg-yellow-500 cursor-pointer text-black px-4 py-2 rounded-lg font-semibold w-full"
                        onClick={() =>
                          addToCart({
                            ...item,
                            selectedSize: selectedOptions[item._id] || null, // Pass selected size/type
                          })
                        }
                      >
                        Add To Cart
                      </button>
                    </div>

                    {/* Wishlist Icon */}
                    <button onClick={() => toggleFavorite(item)} className="ml-3 text-gray-500 text-2xl">
                      {isFavorite(item._id) ? (
                        <MdOutlineFavorite
                          className="icon cursor-pointer text-3xl"
                          onClick={toggleFavorite}
                          style={{ color: 'red' }}
                        /> // Filled heart icon with red color
                      ) : (
                        <MdOutlineFavoriteBorder
                          className="icon cursor-pointer text-3xl"
                          onClick={toggleFavorite}
                          style={{ color: 'gray' }}
                        /> // Outline heart icon with white color
                      )
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default App;
