



"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css";

import { AuthContext } from "../../AuthContext"

const AdminLogin = () => {
    const router = useRouter();
    const { AdminLoggedIn, setAdminLoggedIn } = useContext(AuthContext)
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const url = process.env.NEXT_PUBLIC_API_URL

    // Check if the user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("adminAuthToken");
        if (token) {
            router.push("/admin/panel");
        }
    }, []);

    // Validate password length
    useEffect(() => {
        const isValidPassword = formData.password.length >= 8;
        setIsFormValid(isValidPassword);
    }, [formData]);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${url}/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: formData.username, password: formData.password }),
            });
            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("adminKey", data.token);
                toast.success(data.message || "Login successful!", { theme: "dark" });
                setFormData({ username: "", password: "" });
                setAdminLoggedIn(true)
                router.push("/admin/panel");
            } else {
                toast.error(data.message || "Invalid username or password", { theme: "dark" });
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.", { theme: "dark" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <ToastContainer position="top-right" theme="light" />
            <div className="main-container flex min-h-screen pt-20 p-8 w-screen justify-center items-center bg-gray-50">
                <div className="Adminlogin flex justify-around items-center flex-col w-[90%] max-w-lg p-6 rounded-lg bg-white shadow-lg">
                    <div className="header flex justify-between w-full mb-6">
                        <Link
                            href="/"
                            className="text-xl text-gray-700 hover:bg-gray-200 rounded-full p-2 transition-all"
                        >
                            &lt; Back
                        </Link>
                    </div>

                    <div className="welcome text-3xl font-semibold text-gray-800 mb-4">
                        <h1>Admin Login</h1>
                    </div>

                    <form className="flex flex-col gap-8 w-full">
                        {/* Username */}
                        <div className="relative w-full">
                            <input
                                name="username"
                                onChange={handleChange}
                                type="text"
                                value={formData.username}
                                id="username"
                                autoComplete="name"
                                className="block w-full h-14 px-4 pt-4 pb-2 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder=" "
                            />
                            <label
                                htmlFor="username"
                                className="absolute text-sm text-gray-500 top-1 left-4"
                            >
                                Username
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <input
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                type="password"
                                autoComplete="current-password"
                                id="password"
                                className="block w-full h-14 px-4 pt-4 pb-2 rounded-md border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder=" "
                            />
                            <label
                                htmlFor="password"
                                className="absolute text-sm text-gray-500 top-1 left-4"
                            >
                                Password
                            </label>
                        </div>
                    </form>

                    <div className="buttons mt-5 flex flex-col gap-2 w-full">
                        <button
                            onClick={handleAdminLogin}
                            className={`w-full text-white cursor-pointer font-bold h-12 rounded-md ${isFormValid ? "bg-blue-600" : "bg-gray-400"}`}
                            disabled={!isFormValid}
                        >
                            {isLoading ? "Loading..." : "Admin LOGIN"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;


