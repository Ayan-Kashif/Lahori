


"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Trash, User, MapPin, Phone, Truck, Store } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast, Toaster } from 'sonner'
const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", address: "", phone: "" });
  const [changingIndex, setChangingIndex] = useState(null)
  const [showPopup, setShowPopup] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("Delivery");
  const [error, setError] = useState("");
    const url = process.env.NEXT_PUBLIC_API_URL
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("cart", JSON.stringify(cart));
  // }, [cart]);  // This updates storage whenever cartItems changes.

  const updateQuantity = (id, selectedSize, amount) => {
    const updatedCart = cart.map((item) => {
      // Ensure only the targeted item is updated
      if (item.id === id && item.size === selectedSize) {
        return { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // input validation
  const validateInputs = () => {
    const { name, address, phone } = userInfo;
    if (!name.trim() || !address.trim() || !phone.trim()) {
      setError("All fields are required.");
      toast('All fields are required.')
      return false;
    }
    if (!/^03[0-9]{9}$/.test(phone)) {
      toast('Invalid phone number. ')
      setError("Invalid phone number. Must be 11 digits and start with 03.");
      return false;
    }
    setError("");
    return true;
  };


  // Increase the quantity of an item
  const increaseQty = (index) => {
    console.log('Activated')
    setChangingIndex(index + "1");

    const updatedCart = [...cart];
    if (updatedCart[index].quantity < 100) {
      updatedCart[index].quantity += 1;
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    setTimeout(() => {
      setChangingIndex(null);
    }, 200);
  };

  //Decrease
  const decreaseQty = (index) => {
    setChangingIndex(index + "2");

    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    } else {
      updatedCart.splice(index, 1);
      //  Remove item if quantity is 1
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    setTimeout(() => {
      setChangingIndex(null);
    }, 200);
  };

  const removeItem = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleUserInput = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };


  const handleOrderSubmit = async () => {
    setShowPopup(false)
    if (!validateInputs()) return;

    const orderDetails = {
      user: userInfo,
      items: cart.map((item) => ({
        ...item,
        price:
          item.selectedSize && item.sizes?.length > 0
            ? item.sizes.find((s) => s.size === item.selectedSize)?.price || item.price || 0
            : item.price || 0,
      })),
      total: cart.reduce((acc, item) => {
        let itemPrice =
          item.selectedSize && item.sizes?.length > 0
            ? item.sizes.find((s) => s.size === item.selectedSize)?.price || item.price || 0
            : item.price || 0;

        return acc + itemPrice * (item.quantity || 1);
      }, 0),
      deliveryMethod,
    };


    try {
      const response = await fetch(`${url}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      if (response.ok) {
       
        toast.success('Order placed successfully!')
        localStorage.removeItem("cart");
        localStorage.setItem('My Orders',JSON.stringify([orderDetails]))
        setCart([]);
      } else {
        throw new Error("Failed to place order.");
        toast('Failed to place order."')
      }
    } catch (error) {
      setError("Error placing order. Please try again.");
      toast('Error placing order. Please try again.')
    }
  };



  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
    <div className='bg-white text-black min-w-screen'>
      <div className="p-6 mt-20 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold flex items-center border-b pb-4 mb-4">
          <ShoppingCart className="mr-2 text-blue-500" /> Your Cart
        </h2>

        {/* User Info */}
        <div className="mb-6 space-y-4">
          {[
            { icon: <User />, name: "name", placeholder: "Enter your name" },
            { icon: <MapPin />, name: "address", placeholder: "Enter your address" },
            { icon: <Phone />, name: "phone", placeholder: "Enter your phone number", type: "tel" },
          ].map((field) => (
            <div key={field.name} className="flex items-center border rounded-lg p-3 bg-gray-50">
              <span className="text-gray-500 mr-2">{field.icon}</span>
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={userInfo[field.name]}
                onChange={handleUserInput}
                className="w-full outline-none bg-transparent"
              />
            </div>
          ))}
        </div>


        {/* Delivery Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Delivery Method:</h3>
          <div className="flex space-x-4">
            <button
              className={`flex items-center cursor-pointer justify-center w-1/2 p-3 border rounded-lg text-lg ${deliveryMethod === "Delivery" ? "bg-orange-500 text-white" : "bg-gray-200"
                }`}
              onClick={() => setDeliveryMethod("Delivery")}
            >
              <Truck className="mr-2" /> Delivery
            </button>
            <button
              className={`flex items-center cursor-pointer justify-center w-1/2 p-3 border rounded-lg text-lg ${deliveryMethod === "Pickup" ? "bg-orange-500 text-white" : "bg-gray-200"
                }`}
              onClick={() => setDeliveryMethod("Pickup")}
            >
              <Store className="mr-2" /> Pickup
            </button>
          </div>
        </div>


        {/* Cart Items */}
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        ) : (
          cart.map((item, index) => {
            const selectedSize = item.size || (item.sizes?.length ? item.sizes[0].size : "default");
            return (
              <div key={index} className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex items-center space-x-4">
                  <img src={`/${item.image.split("/").pop()}`} alt={item.name} className="w-16 h-16 rounded-lg object-cover shadow" />
                  <div>
                    <h3 className="font-semibold text-md md:text-lg">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Rs.{" "}
                      {item.selectedSize && item.sizes?.length > 0
                        ? item.sizes.find((s) => s.size === item.selectedSize)?.price || item.price
                        : item.price}
                    </p>

                    {item.selectedSize && (
                      <p className="text-blue-500 text-sm">
                        {item.category === "Pizza" ? "Size" : "Type"}: {item.selectedSize}
                      </p>
                    )}

                  </div>
                </div>
                <div className="flex sm:mt-0 mt-28 items-center space-x-3">
                  <button
                    onClick={() => decreaseQty(index)}
                    className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-semibold text-lg">{item.quantity || 1}</span>
                  <button
                    onClick={() => increaseQty(index)}
                    className="px-3 py-1 border rounded-lg bg-gray-200 hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 ml-3 hover:text-red-700"
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Total Price */}
        <div className="text-right font-bold text-2xl mt-6">
          Total: Rs.{" "}
          {cart.reduce((acc, item) => {
            let itemPrice = item.price; // Default price

            // If item has selectedSize, find its price in sizes array
            if (item.selectedSize && item.sizes?.length > 0) {
              const selectedSizeObj = item.sizes.find((s) => s.size === item.selectedSize);
              if (selectedSizeObj) {
                itemPrice = selectedSizeObj.price; // Use the selected size's price
              }
            }

            return acc + itemPrice * (item.quantity || 1);
          }, 0)}
        </div>

        {/* Place Order Button */}
        <button
          onClick={() => {
            if (validateInputs() === false)
              setError('All fields are required')
            else if (cart.length < 0)
              setError('Your Cart is Empty!')
            else
              setShowPopup(true)
          }
          }
          className="w-full mt-6 cursor-pointer bg-gradient-to-r  from-red-500 to-orange-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Place Order
        </button>

        {/* Confirmation Popup */}
        {showPopup && (
          <div className="fixed inset-0 flex justify-center items-center bg-transparent bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-lg font-bold mb-4">Confirm Order</h2>
              <p>
                You are ordering {cart.length} items totaling Rs{" "}
                {cart.reduce((acc, item) => {
                  let itemPrice = item.price; // Default price

                  // If item has selectedSize, find its price in sizes array
                  if (item.selectedSize && item.sizes?.length > 0) {
                    const selectedSizeObj = item.sizes.find((s) => s.size === item.selectedSize);
                    if (selectedSizeObj) {
                      itemPrice = selectedSizeObj.price; // Use the selected size's price
                    }
                  }

                  return acc + itemPrice * (item.quantity || 1);
                }, 0)}
                {' '}via{" "}
                <strong>{deliveryMethod}</strong>.
              </p>
              <div className="mt-4 space-x-4">
                <button onClick={handleOrderSubmit} className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg">
                  Confirm
                </button>
                <button onClick={() => setShowPopup(false)} className="px-4 py-2 cursor-pointer bg-gray-400 text-white rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
          </div>
    </>
  );
};

export default CheckoutPage;



// "use client";
// import { useState, useEffect } from "react";
// import { ShoppingCart, Trash, User, MapPin, Phone, Truck, Store } from "lucide-react";
// import Navbar from "../components/Navbar";
// import { Elsie_Swash_Caps } from "next/font/google";

// const CheckoutPage = () => {
//   const [cart, setCart] = useState([]);
//   const [userInfo, setUserInfo] = useState({ name: "", address: "", phone: "" });
//   const [error, setError] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   const [deliveryMethod, setDeliveryMethod] = useState("Delivery");

//   useEffect(() => {
//     const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCart(savedCart);
//   }, []);

//   const validateInputs = () => {
//     const { name, address, phone } = userInfo;
//     if (!name.trim() || !address.trim() || !phone.trim()) {
//       setError("All fields are required.");
//       return false;
//     }
//     if (!/^03[0-9]{9}$/.test(phone)) {
//       setError("Invalid phone number. Must be 11 digits and start with 03.");
//       return false;
//     }
//     setError("");
//     return true;
//   };

//   const handleOrderSubmit = async () => {
//     if (!validateInputs()) return;

//     const orderDetails = {
//       user: userInfo,
//       items: cart.map((item) => ({
//         ...item,
//         price:
//           item.selectedSize && item.sizes?.length > 0
//             ? item.sizes.find((s) => s.size === item.selectedSize)?.price || item.price || 0
//             : item.price || 0,
//       })),
//       total: cart.reduce((acc, item) => {
//         let itemPrice =
//           item.selectedSize && item.sizes?.length > 0
//             ? item.sizes.find((s) => s.size === item.selectedSize)?.price || item.price || 0
//             : item.price || 0;

//         return acc + itemPrice * (item.quantity || 1);
//       }, 0),
//       deliveryMethod,
//     };


//     try {
//       const response = await fetch("http://localhost:5000/api/order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(orderDetails),
//       });

//       if (response.ok) {
//         alert("Order placed successfully!");
//         localStorage.removeItem("cart");
//         setCart([]);
//       } else {
//         throw new Error("Failed to place order.");
//       }
//     } catch (error) {
//       setError("Error placing order. Please try again.");
//     }
//   };


//   return (
//     <>
//       <Navbar />
//       <div className="p-6 mt-22 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
//         <h2 className="text-2xl font-bold flex items-center border-b pb-4 mb-4">
//           <ShoppingCart className="mr-2 text-blue-500" /> Your Cart
//         </h2>

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         {/* User Info */}
//         <div className="mb-6 space-y-4">
//           {[
//             { icon: <User />, name: "name", placeholder: "Enter your name" },
//             { icon: <MapPin />, name: "address", placeholder: "Enter your address" },
//             { icon: <Phone />, name: "phone", placeholder: "Enter your phone number", type: "tel" },
//           ].map((field) => (
//             <div key={field.name} className="flex items-center border rounded-lg p-3 bg-gray-50">
//               <span className="text-gray-500 mr-2">{field.icon}</span>
//               <input
//                 type={field.type || "text"}
//                 name={field.name}
//                 placeholder={field.placeholder}
//                 value={userInfo[field.name]}
//                 onChange={(e) => setUserInfo({ ...userInfo, [e.target.name]: e.target.value })}
//                 className="w-full outline-none bg-transparent"
//               />
//             </div>
//           ))}
//         </div>

//         {/* Delivery Method Selection */}
//         <div className="mb-6">
//           <h3 className="text-lg font-semibold mb-2">Select Delivery Method:</h3>
//           <div className="flex space-x-4">
//             <button
//               className={`flex items-center justify-center w-1/2 p-3 border rounded-lg text-lg ${deliveryMethod === "Delivery" ? "bg-orange-500 text-white" : "bg-gray-200"
//                 }`}
//               onClick={() => setDeliveryMethod("Delivery")}
//             >
//               <Truck className="mr-2" /> Delivery
//             </button>
//             <button
//               className={`flex items-center justify-center w-1/2 p-3 border rounded-lg text-lg ${deliveryMethod === "Pickup" ? "bg-orange-500 text-white" : "bg-gray-200"
//                 }`}
//               onClick={() => setDeliveryMethod("Pickup")}
//             >
//               <Store className="mr-2" /> Pickup
//             </button>
//           </div>
//         </div>

//         {/* Cart Items */}
//         {cart.length === 0 ? (
//           <p className="text-gray-500 text-center">Your cart is empty.</p>
//         ) : (
//           cart.map((item, index) => (
//             <div key={index} className="flex items-center justify-between border-b pb-4 mb-4">
//               <div className="flex items-center space-x-4">
//                 <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shadow" />
//                 <div>
//                   <h3 className="font-semibold text-md md:text-lg">{item.name}</h3>
//                   <p className="text-gray-600 text-sm">
//                     Rs.{" "}
//                     {item.selectedSize && item.sizes?.length > 0
//                       ? item.sizes.find((s) => s.size === item.selectedSize)?.price || item.price
//                       : item.price}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setCart(cart.filter((_, idx) => idx !== index))}
//                 className="text-red-500 ml-3 hover:text-red-700"
//               >
//                 <Trash />
//               </button>
//             </div>
//           ))
//         )}

//         {/* Total Price */}
//         <div className="text-right font-bold text-2xl mt-6">
//           Total: Rs.
//           {cart.reduce((acc, item) => {
//             let itemPrice = item.price; // Default price

//             // If item has selectedSize, find its price in sizes array
//             if (item.selectedSize && item.sizes?.length > 0) {
//               const selectedSizeObj = item.sizes.find((s) => s.size === item.selectedSize);
//               if (selectedSizeObj) {
//                 itemPrice = selectedSizeObj.price; // Use the selected size's price
//               }
//             }

//             return acc + itemPrice * (item.quantity || 1);
//           }, 0)}
//         </div>

//         {/* Place Order Button */}
//         <button
//           onClick={() => {
//             if(validateInputs()===false)
//               setError('All fields are required')
//             else if (cart.length < 0)
//               setError('Your Cart is Empty!')
//             else
//             setShowPopup(true)
//           }
//           }
//           className="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg hover:bg-blue-600"
//         >
//           Place Order
//         </button>

//         {/* Confirmation Popup */}
//         {showPopup && (
//           <div className="fixed inset-0 flex justify-center items-center bg-transparent bg-opacity-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//               <h2 className="text-lg font-bold mb-4">Confirm Order</h2>
//               <p>
//                 You are ordering {cart.length} items totaling Rs{" "}
//                 {cart.reduce((acc, item) => {
//                   let itemPrice = item.price; // Default price

//                   // If item has selectedSize, find its price in sizes array
//                   if (item.selectedSize && item.sizes?.length > 0) {
//                     const selectedSizeObj = item.sizes.find((s) => s.size === item.selectedSize);
//                     if (selectedSizeObj) {
//                       itemPrice = selectedSizeObj.price; // Use the selected size's price
//                     }
//                   }

//                   return acc + itemPrice * (item.quantity || 1);
//                 }, 0)}
//                 {' '}via{" "}
//                 <strong>{deliveryMethod}</strong>.
//               </p>
//               <div className="mt-4 space-x-4">
//                 <button onClick={handleOrderSubmit} className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg">
//                   Confirm
//                 </button>
//                 <button onClick={() => setShowPopup(false)} className="px-4 py-2 cursor-pointer bg-gray-400 text-white rounded-lg">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default CheckoutPage;
