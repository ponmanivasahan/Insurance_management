import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/dashboard/Customer";
import Employees from "./pages/dashboard/Employees";
import Policies from "./pages/dashboard/Policies";
import Claims from "./pages/dashboard/Claims";
import Payments from "./pages/dashboard/Payments";
import Documents from "./pages/dashboard/Documents";
import Reports from "./pages/dashboard/Reports";
import Quotes from "./pages/dashboard/Quotes";
import Calendar from "./pages/dashboard/Calendar";
import Support from "./pages/dashboard/Support";
import Commission from "./pages/dashboard/Commission";

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <BrowserRouter>
                <Routes>
                    {/* Public Route */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />


                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                    <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                    <Route path="/policies" element={<ProtectedRoute><Policies /></ProtectedRoute>} />
                    <Route path="/claims" element={<ProtectedRoute><Claims /></ProtectedRoute>} />
                    <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                    <Route path="/quotes" element={<ProtectedRoute><Quotes /></ProtectedRoute>} />
                    <Route path="/commission" element={<ProtectedRoute><Commission /></ProtectedRoute>} />
                    <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                    <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;