import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaFilePdf, FaUpload, FaDownload } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { Card, PageHeader, DataTable, StatusBadge, Button, FormInput } from "../../components/UI";

function Documents() {
    const { user } = useContext(AuthContext);
    const [documents, setDocuments] = useState([]);
    const [role, setRole] = useState("customer");
    const [fileInput, setFileInput] = useState("");

    useEffect(() => {
        if (user) {
            setRole(user.role?.toLowerCase() || "customer");
        }
        fetchDocuments();
    }, [user]);

    const fetchDocuments = async () => {
        try {
            const res = await api.get("/documents");
            if (user?.role?.toLowerCase() === "customer") {
                setDocuments(res.data.filter(d => d.customer_id === 1));
            } else {
                setDocuments(res.data);
            }
        } catch (err) {
            console.error("Error fetching documents", err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!fileInput) return;
        try {
            await api.post("/documents", {
                customer_id: 1,
                file_name: fileInput
            });
            setFileInput("");
            fetchDocuments();
            alert("Document uploaded successfully!");
        } catch (err) {
            alert("Error uploading document");
        }
    };

    const renderCustomerDocuments = () => (
        <div className="space-y-6">
            <PageHeader 
                title="Document Center"
                breadcrumb="Access policy contract printouts, digital verification cards, and dynamic receipt reports."
                actionButton={
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="File name to upload..." 
                            value={fileInput}
                            onChange={(e) => setFileInput(e.target.value)}
                            className="bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[13px] focus:outline-none"
                        />
                        <Button variant="primary" className="h-9" onClick={handleUpload}>
                            <FaUpload className="text-xs" /> Upload New File
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard title="Total Safe Folders" value="6 Folders" change="12 Items indexed" description="total catalog groups" indicatorColor="bg-blue-500" />
                <StatisticsCard title="Last Document Uploaded" value="Sep 25, 2024" change="Tesla_Policy_Declaration.pdf" description="last activity" indicatorColor="bg-emerald-500" />
                <StatisticsCard title="Total Disk Usage" value="4.8 MB" change="Secure storage utilized" description="safe storage consumed" indicatorColor="bg-purple-500" />
                <StatisticsCard title="Pending Approvals" value="0 Pending" change="All assets validated" description="document audit queue" indicatorColor="bg-green-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Folder Index */}
                <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h3 className="text-[15px] font-bold text-[#111827] mb-4">Consolidated Folder Index</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 border border-[#E5E7EB] rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                            <div>
                                <h4 className="text-[13px] font-bold text-[#111827]">📁 Policy Declarations</h4>
                                <span className="text-[11px] text-gray-400">Contracts and limits breakdown</span>
                            </div>
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">3 items</span>
                        </div>
                        <div className="p-4 border border-[#E5E7EB] rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                            <div>
                                <h4 className="text-[13px] font-bold text-[#111827]">📁 Damage Claims Records</h4>
                                <span className="text-[11px] text-gray-400">Incident reports and estimates</span>
                            </div>
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">5 items</span>
                        </div>
                        <div className="p-4 border border-[#E5E7EB] rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                            <div>
                                <h4 className="text-[13px] font-bold text-[#111827]">📁 Payment Invoices</h4>
                                <span className="text-[11px] text-gray-400">Monthly receipt statement logs</span>
                            </div>
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">3 items</span>
                        </div>
                        <div className="p-4 border border-[#E5E7EB] rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
                            <div>
                                <h4 className="text-[13px] font-bold text-[#111827]">📁 Verification ID Cards</h4>
                                <span className="text-[11px] text-gray-400">Policyholder identity proof cards</span>
                            </div>
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">1 item</span>
                        </div>
                    </div>
                </div>

                {/* Cloud security */}
                <div>
                    <Card className="p-5 bg-white border border-[#E5E7EB] space-y-4">
                        <div className="flex items-center gap-2 border-b border-[#f1f5f9] pb-3">
                            <span className="text-xl">🛡️</span>
                            <h3 className="text-[14px] font-bold text-[#111827]">Safe Cloud Verification</h3>
                        </div>
                        <p className="text-[12px] text-[#6B7280] leading-relaxed">
                            All uploaded client files undergo automated malware scanning and sha256 checksum integrity verification. Secured with AES-256 state-of-the-art encryption at rest.
                        </p>
                        <div className="text-[10px] text-gray-400 space-y-1">
                            <div>• Encryption Standard: AES-256-GCM</div>
                            <div>• Checksum: Enforced SHA256</div>
                            <div>• Expiration Check: 100% compliant</div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Document Index table */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-[15px] font-bold text-[#111827] mb-4">File System Log Records</h3>
                <DataTable headers={["Document Name", "Folder Type", "Upload Date", "File Size", "Action"]}>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827] flex items-center gap-2">
                            <FaFilePdf className="text-rose-500" /> Tesla_Policy_Declaration.pdf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Policy Declarations</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Sep 25, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">1.2 MB</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                            <button onClick={() => alert("Downloading file...")} className="text-blue-600 hover:underline font-bold cursor-pointer">Download</button>
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827] flex items-center gap-2">
                            <FaFilePdf className="text-rose-500" /> Townhouse_Coverage_Contract.pdf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Policy Declarations</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Sep 20, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">2.4 MB</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                            <button onClick={() => alert("Downloading file...")} className="text-blue-600 hover:underline font-bold cursor-pointer">Download</button>
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827] flex items-center gap-2">
                            🖼️ Kitchen_Pipe_Burst_Photo_01.jpg
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Damage Claims Records</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Sep 15, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">820 KB</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                            <button onClick={() => alert("Downloading file...")} className="text-blue-600 hover:underline font-bold cursor-pointer">Download</button>
                        </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-bold text-[#111827] flex items-center gap-2">
                            <FaFilePdf className="text-rose-500" /> Auto_Bumper_Invoice_Receipt.pdf
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Payment Invoices</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">Sep 15, 2024</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#111827] font-medium">450 KB</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                            <button onClick={() => alert("Downloading file...")} className="text-blue-600 hover:underline font-bold cursor-pointer">Download</button>
                        </td>
                    </tr>
                </DataTable>
            </div>
        </div>
    );

    return (
        <MainLayout>
            {role === "admin" || role === "agent" ? (
                <div className="space-y-6">
                    {/* Upper Header Control Row */}
                    <PageHeader 
                        title="Document Center"
                        breadcrumb="Upload, preview, and download system identification audit sheets."
                    />

                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                        <h2 className="text-[16px] font-medium text-[#111827] tracking-tight mb-4">Underwritten Documents</h2>
                        {documents.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                No documents uploaded yet.
                            </div>
                        ) : (
                            <DataTable headers={["Document ID", "User ID", "Document Scope Title", "Uploaded At", "Action"]}>
                                {documents.map((d) => (
                                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-mono text-[#111827]">DOC-00{d.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#6B7280]">Customer #{d.customer_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] font-medium text-[#111827] flex items-center gap-2">
                                            <FaFilePdf className="text-rose-500" /> {d.file_name || d.document_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-400">
                                            {d.uploaded_at ? d.uploaded_at.split("T")[0] : "Recently"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-[14px]">
                                            <a 
                                                href={`http://localhost:5000/api/documents/download/${d.id}`}
                                                download
                                                className="text-blue-600 hover:underline font-semibold flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <FaDownload className="text-xs" /> Download
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </DataTable>
                        )}
                    </div>
                </div>
            ) : role === "customer" ? (
                renderCustomerDocuments()
            ) : (
                <div className="p-6 text-center text-[#6B7280]">Access Denied.</div>
            )}
        </MainLayout>
    );
}

export default Documents;
