'use client'

import { useEffect, useState } from 'react';
import { FaClock, FaCheckCircle, FaMotorcycle, FaStore, FaPhone, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import { RiBillFill } from 'react-icons/ri';
import Link from 'next/link'
import Navbar from '../components/Navbar'

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            const storedOrders = JSON.parse(localStorage.getItem('My Orders')) || [];
            setOrders(storedOrders);
            setLoading(false);
        }, 800);
    }, []);

    const handleDeleteOrder = (index) => {
        const updatedOrders = [...orders];
        updatedOrders.splice(index, 1);
        setOrders(updatedOrders);
        localStorage.setItem('My Orders', JSON.stringify(updatedOrders));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Ready': return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-2xl font-semibold text-orange-600">Loading your orders...</div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <>
                <Navbar />

                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                        <RiBillFill className="mx-auto text-6xl text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
                        <p className="text-gray-600 mb-6">You have not placed any orders with us yet.</p>
                        <Link href='/' className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                            Order Now
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen mt-16 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                        <RiBillFill className="mr-3 text-orange-600" />
                        My Orders
                    </h1>

                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center mb-1">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                    <FaClock className="mr-1" /> {order.status}
                                                </span>
                                                <span className="ml-3 text-sm text-gray-500">
                                                    Order #{index + 1}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {new Date().toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Total</p>
                                            <p className="text-xl font-bold text-orange-600">Rs. {order.total.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <div className="flex items-center mb-3">
                                            {order.deliveryMethod === 'Delivery' ? (
                                                <FaMotorcycle className="text-orange-500 mr-2" />
                                            ) : (
                                                <FaStore className="text-orange-500 mr-2" />
                                            )}
                                            <span className="font-medium">{order.deliveryMethod}</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="flex items-start">
                                                <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Delivery Address</p>
                                                    <p className="text-gray-800">{order.user.address}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <FaPhone className="text-gray-400 mt-1 mr-2" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Contact</p>
                                                    <p className="text-gray-800">{order.user.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-md mr-3 overflow-hidden">
                                                            <img
                                                                src={item.image || 'https://via.placeholder.com/40'}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-800 font-medium">{item.name}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-800 font-medium">Rs. {item.price}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-6 flex justify-between">

                                        <button
                                            onClick={() => handleDeleteOrder(index)}
                                            className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <FaTrash className="mr-1" /> Remove Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyOrders;
