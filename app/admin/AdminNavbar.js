

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
// import { FaUser, FaKey, FaSignOutAlt, FaBars, FaHome, FaUsers, FaBullhorn } from "react-icons/fa";
// import { useContext } from "react"
// import { AuthContext } from "../AuthContext";

// const PrinNavbar = () => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [active, setActive] = useState(false)
//   const { setAdminLoggedIn } = useContext(AuthContext)


//   const handleLogout = () => {
//     localStorage.removeItem("adminKey")
//     setAdminLoggedIn(false)
//   }



//   // Check if the current path is /admin/login or /change-password
//   const isLoginOrChangePasswordPage =
//     pathname.startsWith("/admin/login") || pathname.startsWith("/admin/change-password");

//   return (
//     <nav className="bg-gray-800 border-gray-200 text-white dark:bg-gray-900 shadow-lg">
//       <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//         <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">

//           <span className="self-center font-playfair text-2xl font-semibold whitespace-nowrap dark:text-white">
//             LAHORI
//           </span>
//         </a>

//         {/* Show only the Fundify name and logo on login or change-password pages */}
//         {!isLoginOrChangePasswordPage && (
//           <>
//             <div className="flex md:order-2 space-x-4 md:space-x-0 rtl:space-x-reverse">
//               {/* Change Password Link */}
//               <a
//                 href="/admin/change-password"
//                 className="flex mx-3 items-center text-white hover:text-yellow-200 transition-colors duration-300"
//                 title="Change Password "
//               >
//                 <FaKey className="w-5 h-5" />
//               </a>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 type="button"
//                 className="flex items-center cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-300"
//                 aria-label="Logout"
//               >
//                 <FaSignOutAlt className="mr-2" />
//                 Logout
//               </button>

//               {/* Mobile Menu Toggle */}
//               <button
//                 data-collapse-toggle="navbar-cta"
//                 type="button"
//                 className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//                 aria-controls="navbar-cta"
//                 aria-expanded="false"
//               >
//                 <span className="sr-only">Open main menu</span>
//                 <FaBars className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Navbar Links */}
//             <div
//               className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
//               id="navbar-cta"
//             >
//               <ul className="flex text-white flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-gray-800 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">


//                 <li>
//                   <a
//                     href="/admin/dashboard"
//                     className="flex items-center py-2 px-3 md:p-0 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-200 md:dark:hover:text-yellow-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-colors duration-300"
//                   >
//                     <FaHome className="mr-2" />
//                     Dashboard
//                   </a>
//                 </li>


//                 <li>
//                   <a
//                     href="/admin/panel"
//                     className="flex items-center py-2 px-3 md:p-0 text-white md:hover:text-yellow-200 bg-blue-700 rounded-sm md:bg-transparent md:dark:text-blue-500 transition-colors duration-300"
//                     aria-current="page"
//                   >
//                     <FaBullhorn className="mr-2" />
//                     Orders
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/admin/users"
//                     className="flex items-center py-2 px-3 md:p-0 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-200 md:dark:hover:text-yellow-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-colors duration-300"
//                   >
//                     <FaUsers className="mr-2" />
//                     Users
//                   </a>
//                 </li>


//                 <li>
//                   <a
//                     href="/admin/feedbacks"
//                     className="flex items-center py-2 px-3 md:p-0 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-yellow-200 md:dark:hover:text-yellow-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 transition-colors duration-300"
//                   >
//                     <FaHome className="mr-2" />
//                     Feedbacks
//                   </a>
//                 </li>

//               </ul>
//             </div>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default PrinNavbar;`









"use client";

import React, { useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaKey, FaSignOutAlt, FaBars, FaHome, FaUsers, FaBullhorn } from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import { Menu, Utensils } from 'lucide-react';
import Link from 'next/link'
const PrinNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { setAdminLoggedIn } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false); // Toggle state for mobile menu

  const handleLogout = () => {
    localStorage.removeItem("adminKey");
    setAdminLoggedIn(false);
  };

  // Check if the current path is /admin/login or /change-password
  const isLoginOrChangePasswordPage =
    pathname.startsWith("/admin/login") || pathname.startsWith("/admin/change-password");

  return (
    <nav className="bg-gray-800 border-gray-200 text-white shadow-lg">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center font-playfair text-2xl font-semibold whitespace-nowrap dark:text-white">
            LAHORI
          </span>
        </Link>

        {/* Show only on non-login pages */}
        {!isLoginOrChangePasswordPage && (
          <>
            <div className="flex md:order-2 space-x-4 md:space-x-0 rtl:space-x-reverse">
              {/* Change Password */}
              <Link
                href="/admin/change-password"
                className="flex mx-3 items-center text-white hover:text-yellow-200 transition-colors duration-300"
                title="Change Password"
              >
                <FaKey className="w-5 h-5" />
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors duration-300"
                aria-label="Logout"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)} // Toggle menu on click
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-cta"
                aria-expanded={menuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <FaBars className="w-5 h-5" />
              </button>
            </div>

            {/* Navbar Links - Mobile & Desktop */}
            <div
              className={`${menuOpen ? "block" : "hidden"
                } md:flex md:items-center w-full md:w-auto md:order-1`}
              id="navbar-cta"
            >
              <ul className="flex flex-col md:flex-row md:space-x-8 p-4 md:p-0 bg-gray-900 md:bg-transparent md:border-0 rounded-lg">
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center py-2 px-3 rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:hover:text-yellow-200 transition-colors"
                  >
                    <FaHome className="mr-2" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/panel"
                    className="flex items-center py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:hover:text-yellow-200 transition-colors"
                  >
                    <FaBullhorn className="mr-2" />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className="flex items-center py-2 px-3 rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:hover:text-yellow-200 transition-colors"
                  >
                    <FaUsers className="mr-2" />
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/feedbacks"
                    className="flex items-center py-2 px-3 rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:hover:text-yellow-200 transition-colors"
                  >
                    <FaHome className="mr-2" />
                    Feedbacks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/menu"
                    className="flex items-center py-2 px-3 rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:hover:text-yellow-200 transition-colors"
                  >
                    <Utensils className="mr-2" />
                    Menu
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default PrinNavbar;
