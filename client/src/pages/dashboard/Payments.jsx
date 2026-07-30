import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaMoneyBillWave, FaCreditCard, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { Card, PageHeader, StatisticsCard, DataTable, StatusBadge, Button, Modal, FormInput, FormSelect } from "../../components/UI";

function Payments() {
    const { user } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [role, setRole] = useState("customer");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ policy_id: "", amount: "" });

    useEffect(() => {
        if (user) {
            setRole(user.role?.toLowerCase() || "customer");
        }
        fetchPolicies();
    }, [user]);

    useEffect(() => {
        if (policies.length > 0) {
            fetchPayments();
        }
    }, [policies]);

    const fetchPayments = async () => {
        try {
            const res = await api.get("/payments");
            if (user?.role?.toLowerCase() === "customer") {
                const userPolicies = policies.map(p => p.id);
                setPayments(res.data.filter(p => userPolicies.includes(p.policy_id) || p.policy_id === 1 || p.policy_id === 2));
            } else {
                setPayments(res.data);
            }
        } catch (err) {
            console.error("Error fetching payments", err);
        }
    };

    const fetchPolicies = async () => {
        try {
            const res = await api.get("/policies");
            if (user?.role?.toLowerCase() === "customer") {
                const customerPols = res.data.filter(p => p.customer_id === 1);
                setPolicies(customerPols);
                if (customerPols.length > 0) {
                    setForm(prev => ({ ...prev, policy_id: customerPols[0].id, amount: customerPols[0].premium_amount }));
                }
            } else {
                setPolicies(res.data);
                if (res.data.length > 0) {
                    setForm(prev => ({ ...prev, policy_id: res.data[0].id, amount: res.data[0].premium_amount }));
                }
            }
        } catch (err) {
            console.error("Error fetching policies", err);
        }
    };

    const handlePolicyChange = (policyId) => {
        const matched = policies.find(p => p.id === Number(policyId));
        setForm({
            policy_id: policyId,
            amount: matched ? matched.premium_amount : ""
        });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/payments/pay", {
                policy_id: Number(form.policy_id),
                amount: Number(form.amount),
                payment_method: "Credit Card"
            });
            alert(res.data.message || "Payment processed successfully!");
            setShowModal(false);
            fetchPayments();
        } catch (err) {
            alert(err.response?.data?.message || "Payment failed");
        }
    };

    const handleDownloadReceipt = (txId) => {
        alert(`Downloading invoice receipt for transaction: ${txId}`);
    };

    const renderCustomerPayments = () => (
        <div className="space-y-6">
            <PageHeader 
                title="Billing & Payments"
                breadcrumb="Manage automatic monthly withdrawals, review upcoming bills, and download transaction invoices."
                actionButton={
                    <Button variant="primary" className="h-9" onClick={() => setShowModal(true)}>
                        Pay Balance Due
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard title="Next Scheduled Payment" value="Oct 15, 2024" change="Tesla Model Y & Townhouse Premium" description="upcoming due date" indicatorColor="bg-amber-500" />
                <StatisticsCard title="Monthly Outflow Amount" value="$350.00" change="Debited automatically" description="active premium payments" indicatorColor="bg-blue-500" />
                <StatisticsCard title="Combined YTD Premium Paid" value="$3,510.00" change="Across all active lines" description="accrued premium paid" indicatorColor="bg-emerald-500" />
                <StatisticsCard title="Global Auto-pay Configuration" value="Enabled" change="automatic premium drafts active" description="system auto-debit status" indicatorColor="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upcoming Schedule table */}
                <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h3 className="text-[15px] font-bold text-[#111827] mb-4">Upcoming Premium Schedule</h3>
                    <DataTable headers={["Policy Product/Plan", "Due Date", "Amount", "Method", "Auto-pay"]}>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827]">2023 Tesla Model Y</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Oct 15, 2024</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">$120.00</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Visa ending in 4321</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status="Active" />
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827]">Water Front Townhouse</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Oct 15, 2024</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">$230.00</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Visa ending in 4321</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status="Active" />
                            </td>
                        </tr>
                    </DataTable>
                </div>

                {/* Saved Methods */}
                <div>
                    <Card className="p-5 bg-white border border-[#E5E7EB] space-y-4">
                        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                            <h3 className="text-[14px] font-bold text-[#111827]">Saved Methods</h3>
                            <button className="text-[12px] font-semibold text-blue-600 hover:underline cursor-pointer">+ Add New</button>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 border border-[#2563EB] rounded-xl flex items-center justify-between">
                                <div>
                                    <h4 className="text-[13px] font-bold text-[#111827]">Visa ending in 4321</h4>
                                    <span className="text-[10px] text-gray-400">Expires 08/27 • Default</span>
                                </div>
                                <button className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">Edit</button>
                            </div>
                            <div className="p-3 border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                                <div>
                                    <h4 className="text-[13px] font-bold text-[#111827]">Bank account ending in 9876</h4>
                                    <span className="text-[10px] text-gray-400">Active</span>
                                </div>
                                <button className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer">Edit</button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Historical Payments table */}
                <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h3 className="text-[15px] font-bold text-[#111827] mb-4">Historical Payments & Receipts</h3>
                    <DataTable headers={["Processed Date", "Policy Product", "Amount Paid", "Charged Card", "Receipt"]}>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Sep 15, 2024</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827]">Tesla Model Y + Townhouse</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">$350.00</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Visa ending in 4321</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                                <button onClick={() => handleDownloadReceipt("TXN-902")} className="text-blue-600 hover:underline cursor-pointer">📄 Receipt</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Aug 15, 2024</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827]">Tesla Model Y + Townhouse</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">$350.00</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Visa ending in 4321</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                                <button onClick={() => handleDownloadReceipt("TXN-901")} className="text-blue-600 hover:underline cursor-pointer">📄 Receipt</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Jul 15, 2024</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827]">Tesla Model Y + Townhouse</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">$350.00</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Visa ending in 4321</td>
                            <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                                <button onClick={() => handleDownloadReceipt("TXN-900")} className="text-blue-600 hover:underline cursor-pointer">📄 Receipt</button>
                            </td>
                        </tr>
                    </DataTable>
                </div>

                {/* Self-Service Billing */}
                <div>
                    <Card className="p-5 bg-white border border-[#E5E7EB] space-y-4">
                        <h3 className="text-[14px] font-bold text-[#111827]">Self-Service Billing</h3>
                        <p className="text-[11.5px] text-[#6B7280] leading-relaxed">
                            Need custom print templates, changed details on account invoices, receipt downloads or premium history?
                        </p>
                        <Button variant="primary" className="w-full py-2">Download Full Billing Statement</Button>
                    </Card>
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout>
            {role === "admin" || role === "agent" ? (
                <div className="space-y-6">
                    {/* Upper Header Control Row */}
                    <PageHeader 
                        title="Premium Payments Ledger"
                        breadcrumb="Overview of active customer premium collections, transactions, and invoices."
                        actionButton={<></>}
                    />

                    {/* Grid of 3 Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <StatisticsCard title="Total Collected Volume" value="$284,920" change="+14.2%" description="this quarter" indicatorColor="bg-blue-500" />
                        <StatisticsCard title="SLA Success Rate" value="99.8%" change="+0.4%" description="successful transactions" indicatorColor="bg-emerald-500" />
                        <StatisticsCard title="Pending Payments due" value="28 Accounts" change="Critical SLA" description="notices dispatched" indicatorColor="bg-amber-500" />
                    </div>

                    {/* Payments Table Records */}
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Payment Transactions</h2>
                        {payments.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                No payment transactions recorded.
                            </div>
                        ) : (
                            <DataTable headers={["Transaction ID", "Policy ID", "Amount", "Method", "Status", "Date Due / Processed", "Invoice Link"]}>
                                {payments.map((p) => {
                                    const isSuccess = p.payment_status?.toLowerCase() === "paid" || p.payment_status?.toLowerCase() === "success";
                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-mono text-[#111827]">{p.transaction_id || `TXN-8204${p.id}`}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">POL-00{p.policy_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827]">${Number(p.amount).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">{p.payment_method || "Credit Card"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={isSuccess ? "Paid" : "Pending"} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">
                                                {p.payment_date ? p.payment_date.split("T")[0] : p.due_date ? p.due_date.split("T")[0] : "Recently"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                                                <button 
                                                    onClick={() => handleDownloadReceipt(p.transaction_id || p.id)}
                                                    className="text-blue-600 hover:underline font-semibold cursor-pointer"
                                                >
                                                    Download Invoice
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </DataTable>
                        )}
                    </div>
                </div>
            ) : role === "customer" ? (
                renderCustomerPayments()
            ) : (
                <div className="p-6 text-center text-[#6B7280]">Access Denied.</div>
            )}

            {/* Pay Premium Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Pay Premium">
                {policies.length === 0 ? (
                    <div className="text-center py-4 text-slate-400">
                        No active policy records found to pay.
                    </div>
                ) : (
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-[12px] font-medium text-[#6B7280] uppercase tracking-wider">
                                Select Policy
                            </label>
                            <select
                                required
                                value={form.policy_id}
                                onChange={(e) => handlePolicyChange(e.target.value)}
                                className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[14px] text-[#111827] focus:outline-none focus:border-[#2563EB] transition-colors duration-150"
                            >
                                {policies.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        POL-00{p.id} - Premium: ${p.premium_amount}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <FormInput required label="Payment Amount ($)" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                        
                        <div className="flex justify-end gap-3 pt-2 border-t border-[#E5E7EB]">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="primary">
                                Authorize Transaction
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </MainLayout>
    );
}

export default Payments;
