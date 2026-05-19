import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <AdminSidebar />

      <main className="md:ml-64 overflow-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
