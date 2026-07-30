import Sidebar from "../dashboard/Sidebar";

function MainLayout({ children }) {
    return (
        <div className="flex bg-[#F8FAFC] min-h-screen w-full font-sans antialiased">
            <Sidebar />
            <div className="ml-64 flex-1 min-w-0 flex flex-col">
                <div className="p-6 bg-[#F8FAFC] flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;