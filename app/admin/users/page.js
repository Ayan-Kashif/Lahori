'use client';

import { useEffect, useState } from "react";
import { Search, ShoppingBag, User, Mail } from "lucide-react";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const url = process.env.NEXT_PUBLIC_API_URL
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${url}/admin/customers`);
      const data = await res.json();
      setUsers(data.customers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-10 text-white">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center">Customer Details</h2>
        <div className="relative w-full mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:ring-purple-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-center text-gray-400">Loading customers...</p>
        ) : (
          <div className="space-y-4">
            {users
              .filter((user) => user.customerName.toLowerCase().includes(search.toLowerCase()))
              .map((user, index) => (
                <div key={index} className="flex items-center justify-between bg-white/10 p-4 rounded-xl shadow-md hover:bg-white/20 transition">
                  <div className="flex items-center gap-4">
                    <User className="text-purple-400" size={30} />
                    <div>
                      <h3 className="text-lg font-semibold">{user.customerName}</h3>
                      <p className="text-gray-300 flex items-center gap-2">
                        <Mail size={16} /> {user.email || "No email provided"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-purple-400 font-semibold">
                    <ShoppingBag size={24} />
                    <span>{user.orders.length} Orders</span>
                  </div>
                </div>
              ))}
          </div>

        )}
      </div>
    </div>
  );
}
