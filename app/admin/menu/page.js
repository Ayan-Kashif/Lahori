


'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function AdminPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState("");
    const url = process.env.NEXT_PUBLIC_API_URL;

    const [newItem, setNewItem] = useState({
        name: "",
        category: "",
        price: "",
        description: "",
        sizes: [],
    });
    const [size, setSize] = useState("");
    const [sizePrice, setSizePrice] = useState("");
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editImage, setEditImage] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("adminKey");
        if (!storedToken) {
            toast.error("Access denied! Login as admin.");
            router.push("admin/login");
            return;
        }
        setToken(storedToken);
        fetchMenu(storedToken);
    }, []);

    const fetchMenu = async (token) => {
        try {
            const res = await fetch(`${url}/api/menu`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setMenuItems(data);
            } else {
                toast.error(data.message || "Error fetching menu!");
            }
            setLoading(false);
        } catch (error) {
            toast.error("Error fetching menu!");
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleEditImageChange = (e) => {
        setEditImage(e.target.files[0]);
    };

    const addSize = () => {
        if (size && sizePrice) {
            setNewItem({ ...newItem, sizes: [...newItem.sizes, { size, price: sizePrice }] });
            setSize("");
            setSizePrice("");
        } else {
            toast.error("Enter both size and price!");
        }
    };

    const removeSize = (index) => {
        const updatedSizes = newItem.sizes.filter((_, i) => i !== index);
        setNewItem({ ...newItem, sizes: updatedSizes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image && !editingId) {
            toast.error("Please upload an image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", newItem.name);
        formData.append("category", newItem.category);
        formData.append("description", newItem.description);
        if (image) formData.append("image", image);
        if (editImage) formData.append("image", editImage);
        formData.append("sizes", JSON.stringify(newItem.sizes));
        if (newItem.sizes.length === 0) {
            formData.append("price", newItem.price);
        }

        try {
            const endpoint = editingId ? `${url}/admin/update/${editingId}` : `${url}/admin/add`;
            const method = editingId ? "PUT" : "POST";
            
            const res = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(editingId ? "Item updated successfully!" : "Item added successfully!");
                resetForm();
                fetchMenu(token);
            } else {
                toast.error(data.message || (editingId ? "Error updating item!" : "Error adding item!"));
            }
        } catch (error) {
            toast.error(editingId ? "Error updating item!" : "Error adding item!");
            console.error(error);
        }
    };

    const resetForm = () => {
        setNewItem({ name: "", category: "", price: "", description: "", sizes: [] });
        setImage(null);
        setEditImage(null);
        setEditingId(null);
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setNewItem({
            name: item.name,
            category: item.category,
            price: item.price || "",
            description: item.description,
            sizes: item.sizes || [],
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            try {
                const res = await fetch(`${url}/admin/delete/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    toast.success("Item deleted successfully!");
                    fetchMenu(token);
                } else {
                    toast.error(data.message || "Error deleting item!");
                }
            } catch (error) {
                toast.error("Error deleting item!");
                console.error(error);
            }
        }
    };

    return (
        <div className='bg-white min-w-screen text-black'>
        <div className="max-w-5xl text-black mx-auto py-10">
            <Toaster />
            <h1 className="text-3xl font-bold  text-green-700 text-center mb-6">Admin Menu</h1>

            {/* Add/Edit Item Form */}
            <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    {editingId ? "Edit Item" : "Add New Item"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <input
                        name="name"
                        value={newItem.name}
                        onChange={handleChange}
                        placeholder="Item Name"
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        name="category"
                        value={newItem.category}
                        onChange={handleChange}
                        placeholder="Category"
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                        name="description"
                        value={newItem.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    
                    {/* Image Upload */}
                    <div>
                        <label className="block mb-1">Image {!editingId && '(required)'}</label>
                        <input
                            type="file"
                            onChange={editingId ? handleEditImageChange : handleImageChange}
                            required={!editingId}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                        {editingId && !editImage && (
                            <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
                        )}
                    </div>

                    {newItem.sizes.length === 0 && (
                        <input
                            name="price"
                            value={newItem.price}
                            onChange={handleChange}
                            placeholder="Price (if no sizes)"
                            type="number"
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    )}

                    {/* Size Inputs */}
                    <div>
                        <h3 className="text-sm font-semibold">Add Sizes (Optional)</h3>
                        <div className="flex gap-2 mt-2">
                            <input
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                placeholder="Size (e.g., Small, Large)"
                                className="px-4 py-2 border rounded-lg w-1/2"
                            />
                            <input
                                value={sizePrice}
                                onChange={(e) => setSizePrice(e.target.value)}
                                placeholder="Price"
                                type="number"
                                className="px-4 py-2 border rounded-lg w-1/2"
                            />
                            <button type="button" onClick={addSize} className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-lg">
                                Add
                            </button>
                        </div>
                        {newItem.sizes.map((s, index) => (
                            <div key={index} className="flex justify-between bg-gray-100 p-2 rounded-lg mt-2">
                                <span>{s.size}: ${s.price}</span>
                                <button type="button" onClick={() => removeSize(index)} className="bg-red-500 cursor-pointer text-white px-2 py-1 rounded-lg">
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-green-500 text-white cursor-pointer px-4 py-2 rounded-lg font-semibold">
                            {editingId ? "Update Item" : "Add Item"}
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="bg-gray-500 cursor-pointer text-white px-4 py-2 rounded-lg font-semibold">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Menu Items List */}
            <div className="bg-white p-6 text-black shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-center">Menu Items</h2>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : menuItems.length === 0 ? (
                    <div className="text-center">No menu items found</div>
                ) : (
                    <div className="space-y-4">
                        {menuItems.map((item) => (
                            <div key={item._id} className="border p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    {item.image && (
                                        <img 
                                            src={`/${item.image.split("/").pop()}`}
                                            alt={item.name} 
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-600">{item.category}</p>
                                        <p className="text-sm">{item.description}</p>
                                        {item.sizes && item.sizes.length > 0 ? (
                                            <div className="mt-1">
                                                {item.sizes.map((size, idx) => (
                                                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded mr-1">
                                                        {size.size}: ${size.price}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm font-medium">${item.price}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleEdit(item)}
                                        className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded-lg text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item._id)}
                                        className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded-lg text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
                    </div>
    );
}
