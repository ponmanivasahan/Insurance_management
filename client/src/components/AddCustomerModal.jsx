import { useState } from "react";
import api from "../services/api";

function AddCustomerModal({ closeModal, refresh }) {
    const [form, setForm] = useState({
        customer_code: "",
        name: "",
        phone: "",
        email: "",
        address: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const saveCustomer = async () => {
        if (!form.customer_code || !form.name || !form.phone || !form.email) {
            alert("Please fill in all required fields!");
            return;
        }
        try {
            await api.post("/customers", form);
            refresh();
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || "Error saving customer");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-96 border border-slate-100 animate-slide-up">
                <h2 className="text-xl font-bold text-slate-800 mb-4 font-sans">
                    Register Customer Profile
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer Code</label>
                        <input
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            name="customer_code"
                            placeholder="e.g. C004"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                        <input
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            name="name"
                            placeholder="Rahul Sharma"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone</label>
                            <input
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                name="phone"
                                placeholder="9876543210"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                            <input
                                required
                                type="email"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                name="email"
                                placeholder="name@example.com"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Home Address</label>
                        <textarea
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            name="address"
                            placeholder="Street, City, State"
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
                    <button
                        onClick={closeModal}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={saveCustomer}
                        className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-5 rounded-xl font-semibold shadow-lg shadow-blue-500/10 transition-colors"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCustomerModal;