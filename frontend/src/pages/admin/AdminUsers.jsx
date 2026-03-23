import { useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../layouts/TopBar";
import Input from "../../components/Input";
import AppIcon from "../../components/AppIcon";
import AdminUserCard from "./components/AdminUserCard";
import AdminUserDetailModal from "./components/AdminUserDetailModal";
import AdminUserDeleteModal from "./components/AdminUserDeleteModal";

const AdminUsers = () => {
  const { users, updateUser, deleteUser, showToast } = useApp();
  const [filter, setFilter] = useState("penyedia");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filtered = users
    .filter(u => u.role === filter && u.role !== "admin")
    .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleVerify = (user) => {
    updateUser(user.id, { isVerified: true });
    showToast(`${user.name} berhasil diverifikasi!`, "success");
  };

  const handleUnverify = (user) => {
    updateUser(user.id, { isVerified: false });
    showToast(`Verifikasi ${user.name} dicabut.`, "warning");
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteUser(selectedUser.id);
    showToast(`Akun ${selectedUser.name} dihapus.`, "success");
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const openDetail = (user) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  return (
    <div className="pb-20">
      <TopBar title="Kelola Pengguna" subtitle={`${filtered.length} pengguna`} />

      <div className="px-5 pt-4 pb-2 bg-white border-b border-gray-100">
        <Input value={search} onChange={setSearch} placeholder="Cari nama atau email..." icon={<AppIcon name="search" size={16} />} />
      </div>

      <div className="flex border-b border-gray-100 bg-white">
        {[
          { id: "pencari", label: "Pencari Jasa", icon: "search" },
          { id: "penyedia", label: "Penyedia Jasa", icon: "hardHat" },
        ].map(r => (
          <button
            key={r.id}
            onClick={() => setFilter(r.id)}
            className={`flex-1 py-3 bg-transparent border-none cursor-pointer text-sm capitalize transition-all border-b-[3px] inline-flex items-center justify-center gap-1.5
              ${filter === r.id ? "font-bold text-sky-600 border-sky-600" : "font-normal text-gray-400 border-transparent"}`}
          >
            <AppIcon name={r.icon} size={14} /> {r.label}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="mb-3 flex justify-center"><AppIcon name="user" size={34} /></div>
            <p>Tidak ada pengguna ditemukan</p>
          </div>
        ) : filtered.map((user) => (
          <AdminUserCard
            key={user.id}
            user={user}
            onOpenDetail={openDetail}
            onVerify={handleVerify}
            onUnverify={handleUnverify}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <AdminUserDetailModal open={showDetail} onClose={() => setShowDetail(false)} selectedUser={selectedUser} />
      <AdminUserDeleteModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        selectedUser={selectedUser}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default AdminUsers;
