import { useState } from "react";
import { useApp } from "../../context/AppContext";
import TopBar from "../../layouts/TopBar";
import Card from "../../components/Card";
import Avatar from "../../components/Avatar";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import AppIcon from "../../components/AppIcon";
import { formatDate } from "../../utils/format";

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
        ) : filtered.map(u => (
          <Card key={u.id} className="mb-3">
            <div className="flex gap-3 items-center">
              <Avatar name={u.name} size={48} colorIndex={u.id} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{u.name}</div>
                <div className="text-xs text-gray-400">{u.email}</div>
                {u.role === "penyedia" && (
                  <div className="mt-1">
                    {u.isVerified
                      ? <Badge color="#22C55E"><span className="inline-flex items-center gap-1"><AppIcon name="badgeCheck" size={12} /> Terverifikasi</span></Badge>
                      : <Badge color="#F59E0B"><span className="inline-flex items-center gap-1"><AppIcon name="clock" size={12} /> Belum Diverifikasi</span></Badge>}
                  </div>
                )}
              </div>
              <button
                onClick={() => openDetail(u)}
                className="bg-transparent border-none text-gray-400 cursor-pointer hover:text-gray-700"
              ><AppIcon name="more" size={18} /></button>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
              {u.role === "penyedia" && !u.isVerified && (
                <Button size="sm" variant="success" onClick={() => handleVerify(u)} icon={<AppIcon name="badgeCheck" size={14} />}>Verifikasi</Button>
              )}
              {u.role === "penyedia" && u.isVerified && (
                <Button size="sm" variant="ghost" onClick={() => handleUnverify(u)}>Cabut Verifikasi</Button>
              )}
              <Button size="sm" variant="outline" onClick={() => openDetail(u)}>Detail</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(u)} icon={<AppIcon name="trash" size={14} />} />
            </div>
          </Card>
        ))}
      </div>

      <Modal open={showDetail} onClose={() => setShowDetail(false)} title="Detail Pengguna">
        {selectedUser && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedUser.name} size={56} colorIndex={selectedUser.id} />
              <div>
                <div className="font-bold text-base">{selectedUser.name}</div>
                <div className="text-sm text-gray-400">{selectedUser.email}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {[
                ["Telepon", selectedUser.phone || "-", "phone"],
                ["Alamat", selectedUser.address || "-", "mapPin"],
                ["Bergabung", formatDate(selectedUser.createdAt || Date.now()), "calendar"],
                ["Role", selectedUser.role, "user"],
              ].map(([k, v, icon]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-sm font-semibold text-gray-400 min-w-[90px] inline-flex items-center gap-1"><AppIcon name={icon} size={12} /> {k}</span>
                  <span className="text-sm capitalize">{v}</span>
                </div>
              ))}
            </div>
            {selectedUser.role === "penyedia" && (
              <div>
                <div className="text-sm font-semibold text-gray-400 mb-2 inline-flex items-center gap-1"><AppIcon name="wrench" size={13} /> Keahlian</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.skills?.map(s => <Badge key={s} color="#0284C7">{s}</Badge>)}
                </div>
              </div>
            )}
            {selectedUser.role === "penyedia" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="font-bold text-xl text-yellow-500 inline-flex items-center gap-1"><AppIcon name="star" size={16} /> {selectedUser.rating}</div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="font-bold text-xl text-blue-500">{selectedUser.totalJobs}</div>
                  <div className="text-xs text-gray-400">Total Pekerjaan</div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Hapus Pengguna">
        <p className="text-gray-400 mb-5">Apakah Anda yakin ingin menghapus akun <strong>{selectedUser?.name}</strong>? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-2.5">
          <Button fullWidth variant="danger" onClick={confirmDelete}>Ya, Hapus</Button>
          <Button fullWidth variant="outline" onClick={() => setShowDeleteConfirm(false)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
