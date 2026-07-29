import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/dashboard/Customer";
import Employees from "./pages/dashboard/Employees";
import Policies from "./pages/dashboard/Policies";
import Claims from "./pages/dashboard/Claims";
import Payments from "./pages/dashboard/Payments";
import Documents from "./pages/dashboard/Documents";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/claims" element={<Claims />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;