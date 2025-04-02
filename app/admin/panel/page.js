



"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Line } from "react-chartjs-2";
import Spinner from "../../components/Spinner";


const StaffPanel = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorFetchingOrders, setErrorFetchingOrders] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [channelFilter, setChannelFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStats, setOrderStats] = useState({ labels: [], data: [] });
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [expandedInstructions, setExpandedInstructions] = useState(null);
  const [authChecked, setAuthChecked] = useState(false)
  const url = process.env.NEXT_PUBLIC_API_URL
  useEffect(() => {
    const adminAuthToken = localStorage.getItem("adminKey");

    if (!adminAuthToken) {
      console.log("No token found, redirecting to login"); // Debugging line
      router.push("/admin/login");
      return;
    }
  }, [])
  const checkAdminAuth = async () => {
    const adminAuthToken = localStorage.getItem("adminKey");

    const [loading, setLoading] = useState(false)

    const handlePageLoad = () => {
      setLoading(true);
      // Simulate fetching data (for example, from API)
      setTimeout(() => {
        setLoading(false); // End loading after data is fetched
      }, 2000); // Simulate a 2-second loading time
    };

    useEffect(() => {
      handlePageLoad();
    }, []);

    console.log("Admin Auth Token:", adminAuthToken); // Debugging line

    if (!adminAuthToken) {
      console.log("No token found, redirecting to login"); // Debugging line
      router.push("/admin/Login");
      return;
    }

    try {
      const response = await fetch(`${url}/admin/validate-token`, {
        headers: {
          Authorization: `Bearer ${adminAuthToken}`,
        },
      });

      const data = await response.json();
      console.log("Token validation response:", data); // Debugging line

      // Check if the message is "Authorized" instead of `data.success`
      if (data.message === 'Authorized') {
        setAuthChecked(true); // Auth is valid
      } else {
        router.push("/AdminLogin");
      }
    } catch (error) {
      console.error("Error checking admin auth:", error);
      router.push("/AdminLogin");
    }
  };
  useEffect(() => {


    checkAdminAuth();
  }, []);

  const toggleInstructions = (orderId) => {
    setExpandedInstructions(expandedInstructions === orderId ? null : orderId);
  };

  // Fetch orders function
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${url}/admin/orders`);
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
      setLoading(false);
      updateGraphData(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setErrorFetchingOrders(true);
      setLoading(false);
    }
  };

  const updateGraphData = (orders) => {
    const labels = [];
    const data = [];

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString();
      const orderTotal = order.totalPrice;

      const index = labels.indexOf(orderDate);
      if (index === -1) {
        labels.push(orderDate);
        data.push(orderTotal);
      } else {
        data[index] += orderTotal;
      }
    });

    setOrderStats({ labels, data });
  };




  const filterOrders = () => {
    let filtered = [...orders];

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order._id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (channelFilter !== "All") {
      filtered = filtered.filter((order) => order.deliveryMethod === channelFilter);
    }

    if (timeFilter !== "All") {
      const now = new Date();
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (timeFilter === "Last Hour") {
          return now - orderDate <= 3600000;
        } else if (timeFilter === "Last Day") {
          return now - orderDate <= 86400000;
        } else if (timeFilter === "Last Month") {
          return now - orderDate <= 2592000000;
        }
        return true;
      });
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, timeFilter, channelFilter, searchQuery]);

  const updateOrderStatus = async (id, status) => {
    try {
      const response = await fetch(`${url}/admin/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
    finally {
      fetchOrders()
    }
  };


  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterOrders();
  };
  return (
    <>
      {loading ? <Spinner /> : (
        <>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="bg-gray-100 md:overflow-x-hidden overflow-x-auto  text-black min-h-screen py-10">
            <div className="container mx-auto px-4">
              <h1 class="my-8 text-center  text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black">Staff Panel</h1>

              {/* Filters Section */}
              <div className="mb-6 flex justify-between items-center space-x-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded px-4 py-2 shadow-md transition duration-200 hover:shadow-lg"
                  >
                    <option value="All">All Orders</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Ready">Ready</option>
                  </select>

                  <select
                    value={channelFilter}
                    onChange={(e) => setChannelFilter(e.target.value)}
                    className="border rounded px-4 py-2 shadow-md transition duration-200 hover:shadow-lg"
                  >
                    <option value="All">All Channels</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Delivery">Delivery</option>
                  </select>

                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="border rounded px-4 py-2 shadow-md transition duration-200 hover:shadow-lg"
                  >
                    <option value="All">All Time</option>
                    <option value="Last Hour">Last Hour</option>
                    <option value="Last Day">Last Day</option>
                    <option value="Last Month">Last Month</option>
                  </select>
                </div>



                <form class=" w-[400px] mx-auto" onSubmit={handleSearch}>
                  <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                  <div class="relative w-full">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                      </svg>
                    </div>
                    <input type="text" value={searchQuery} placeholder="Search by Order ID or Name" onChange={(e) => setSearchQuery(e.target.value)} id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500  focus:border-blue-500 dark:bg-white dark:border-gray-600 font-sans dark:placeholder-gray-400 shadow-md hover:shadow-lg dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    <button type="submit" class="text-white cursor-pointer absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                  </div>


                </form>
              </div>



              {/* Orders Table */}
              {loading ? (
                <div role="status text-center">
                  <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              ) : errorFetchingOrders ? (
                toast.error("Error fetching orders. Please try again.")
              ) : (
                <table className="w-full  border-collapse border border-gray-300 bg-white shadow-lg rounded-lg">
                  <thead className="bg-[#f9fafb]">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300">Order ID</th>
                      <th className="px-4 py-2 border border-gray-300">Date</th>
                      <th className="px-4 py-2 border border-gray-300">Customer Name</th>
                      <th className="px-4 py-2 border border-gray-300">Items</th>
                      <th className="px-4 py-2 border border-gray-300">Phone</th>
                      <th className="px-4 py-2 border border-gray-300">Address</th>
                      <th className="px-4 py-2 border border-gray-300">Channel</th>

                      <th className="px-4 py-2 border border-gray-300">Total</th>
                      <th className="px-4 py-2 border border-gray-300">Status</th>
                      <th className="px-4 py-2 border border-gray-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <React.Fragment key={order._id}>
                        {/* Main order row */}
                        <tr className="hover:bg-gray-100 font-sans">
                          <td className="px-4 py-2 border font-roboto-condensed border-gray-300">{order._id}</td>
                          <td className="px-4 py-2 border border-gray-300">{order.createdAt.slice(0, 10)}</td>
                          <td className="px-4 py-2 border border-gray-300">{order.customerName}</td>


                          <td className="px-4 py-2 border font-sans border-gray-300">
                            {order.items.length}{" items "}
                            <button
                              onClick={() => toggleOrderDetails(order._id)}
                              className="ml-2 text-sm"
                            >
                              <span
                                className={`inline-block cursor-pointer transform transition-transform duration-300 ${expandedOrder === order._id ? "rotate-180" : "rotate-0"
                                  }`}
                              >
                                ▼
                              </span>
                            </button>
                          </td>
                          <td className="px-4 py-2 border border-gray-300">{order.customerPhone}</td>
                          <td className="px-4 py-2 border border-gray-300">{order.address}</td>
                          <td className="px-4 py-2 border border-gray-300">{order.deliveryMethod}</td>




                          <td className="px-4 py-2 border border-gray-300">Rs. {order.totalAmount}</td>
                          <td className="px-4 py-2 border border-gray-300">{order.status}</td>
                          {/* <td className="px-4 py-2 border border-gray-300">
                      {order.status === "Pending" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "In Progress")}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {order.status === "In Progress" && (
                        <button
                          onClick={() => updateOrderStatus(order._id, "Ready")}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Mark Ready
                        </button>
                      )}
                    </td> */}

                          <td className="px-4 py-2 border border-gray-300">
                            {order.status === "Pending" ? (
                              <button
                                onClick={() => updateOrderStatus(order._id, "In Progress")}
                                className="bg-yellow-500 cursor-pointer text-white px-4 py-2 rounded-lg"
                              >
                                Mark as Progress
                              </button>
                            ) : order.status === "Ready" || order.status === "Delivered" ? (
                              <span className="text-gray-500 font-semibold">No Action Needed ✅</span>
                            ) : order.deliveryMethod === "Delivery" ? (
                              <button
                                onClick={() => updateOrderStatus(order._id, "Delivered")}
                                className="bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-lg"
                              >
                                Mark Delivered
                              </button>
                            ) : (
                              <button
                                onClick={() => updateOrderStatus(order._id, "Ready")}
                                className="bg-orange-600 cursor-pointer text-white px-4 py-2 rounded-lg"
                              >
                                Mark Ready
                              </button>
                            )}

                          </td>
                        </tr>

                        {/* Expanded order details */}
                        {expandedOrder === order._id && (
                          <tr className="transition-all duration-500 ease-in-out">
                            <td colSpan="11" className="px-4 py-4 bg-gray-50 rounded-lg shadow-md">
                              <h3 className="text-lg font-semibold mb-4 text-gray-800">Items Details</h3>
                              <ul className="space-y-3">
                                {order.items.map((item) => (
                                  <li
                                    key={item._id}
                                    className="flex justify-between items-center py-2 px-4 rounded-md bg-white shadow-sm hover:bg-gray-100 transition duration-300"
                                  >
                                    <div className="flex-1">
                                      <span className="font-sans text-gray-700">{item.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <span className="font-sans text-gray-500">Qty: {item.quantity}</span>
                                      {item.selectedSize && (
                                        <span className="font-sans text-gray-500">Size: {item.selectedSize}</span>
                                      )}
                                      <span className="font-sans text-gray-700">Rs {item.price}</span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}

                      </React.Fragment>
                    ))}
                  </tbody>

                </table>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StaffPanel;
