import { useEffect, useState } from "react";
import api from "../../services/api";
import MainLayout from "../Layout/Mainlayout";
import { FaFilePdf, FaUpload, FaDownload } from "react-icons/fa";

function Documents() {
    const [documents, setDocuments] = useState([]);
    const [role, setRole] = useState("customer");
    const [fileInput, setFileInput] = useState("");

    useEffect(() => {
        setRole(sessionStorage.getItem("role") || "customer");
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await api.get("/documents");
            if (sessionStorage.getItem("role") === "customer") {
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

    return (
        <MainLayout>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Document Center</h1>
                    <p className="text-sm text-gray-500 mt-1">Upload and download policy and identification documents</p>
                </div>
            </div>

            {role === "customer" && (
                <div className="bg-white/80 backdrop-blur-md shadow-lg border border-slate-100 rounded-2xl p-6 mb-8">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Upload New Document</h2>
                    <form onSubmit={handleUpload} className="flex gap-4 max-w-md">
                        <input
                            required
                            type="text"
                            placeholder="e.g. pan_card.pdf, medical_invoice.pdf"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={fileInput}
                            onChange={(e) => setFileInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl flex items-center gap-2 transition-colors"
                        >
                            <FaUpload /> Upload
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white/80 backdrop-blur-md shadow-lg border border-slate-100 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Uploaded PDF Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="text-red-500 text-3xl mt-1">
                                    <FaFilePdf />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-bold text-slate-800 text-sm truncate max-w-[180px]" title={doc.file_name}>
                                        {doc.file_name}
                                    </h4>
                                    <p className="text-xs text-slate-400">Uploaded: {doc.uploaded_at}</p>
                                    <p className="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded-full w-fit">
                                        Client: C00{doc.customer_id}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 border-t border-slate-200/50 pt-4 flex justify-end">
                                <a
                                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(`Document Mock Content for ${doc.file_name}`)}`}
                                    download={doc.file_name}
                                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1.5 text-xs font-semibold bg-blue-50 px-3 py-1.5 rounded-lg"
                                >
                                    <FaDownload /> Download
                                </a>
                            </div>
                        </div>
                    ))}
                    {documents.length === 0 && (
                        <p className="text-slate-400 text-sm italic col-span-3 text-center py-6">No documents uploaded yet.</p>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

export default Documents;
