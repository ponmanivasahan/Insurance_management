import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
    const [name, setName] = useState("User");
    const [role, setRole] = useState("Customer");

    useEffect(() => {
        setName(sessionStorage.getItem("name") || "User");
        const storedRole = sessionStorage.getItem("role") || "customer";
        setRole(storedRole.charAt(0).toUpperCase() + storedRole.slice(1));
    }, []);

    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Portal Active ({role})
                </span>
            </div>

            <div className="flex items-center gap-6">
                {/* User Details */}
                <div className="flex items-center gap-3">
                    <div className="text-slate-400 text-2xl">
                        <FaUserCircle />
                    </div>
                    <div className="text-left leading-none">
                        <h4 className="text-sm font-bold text-slate-800">{name}</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                            {role}
                        </span>
                    </div>
                </div>

                {/* Logout Action */}
                <button
                    className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-600 border border-slate-100 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer"
                    onClick={() => {
                        sessionStorage.clear();
                        window.location.href = "/";
                    }}
                >
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;