import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../layouts/TopBar";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import AppIcon from "../components/AppIcon";
import { formatDate } from "../utils/format";

const Profile = () => {
  const { currentUser, updateUser, logout, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: currentUser?.name, phone: currentUser?.phone, address: currentUser?.address });
  const [newSkill, setNewSkill] = useState("");
  const [skills, setSkills] = useState(currentUser?.skills || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => { updateUser(currentUser.id, form); showToast("Profil berhasil diperbarui!", "success"); setEditing(false); };
  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill)) { showToast("Keahlian sudah ada!", "error"); return; }
    const updated = [...skills, newSkill];
    setSkills(updated); updateUser(currentUser.id, { skills: updated }); setNewSkill(""); showToast("Keahlian ditambahkan!", "success");
  };
  const removeSkill = (s) => { const updated = skills.filter(sk => sk !== s); setSkills(updated); updateUser(currentUser.id, { skills: updated }); };

  const roleColor = currentUser?.role === "admin" ? "#9C27B0" : currentUser?.role === "penyedia" ? "#22C55E" : "#3B82F6";
  const roleLabel = currentUser?.role === "admin" ? "Admin" : currentUser?.role === "penyedia" ? "Penyedia Jasa" : "Pencari Jasa";
  const roleIcon = currentUser?.role === "admin" ? "shield" : currentUser?.role === "penyedia" ? "hardHat" : "search";

  return (
    <div className="pb-20">
      <TopBar title="Profil Saya" actions={
        <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>{editing ? "Batal" : "Edit"}</Button>
      } />

      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-10 text-center">
        <div className="flex justify-center mb-3">
          <Avatar name={currentUser?.name} size={80} />
        </div>
        <h2 className="text-xl font-extrabold text-white mt-3">{currentUser?.name}</h2>
        <div className="mt-2 flex justify-center">
          <Badge color={roleColor}><span className="inline-flex items-center gap-1"><AppIcon name={roleIcon} size={13} /> {roleLabel}</span></Badge>
        </div>
      </div>

      <div className="px-5 -mt-5 flex flex-col gap-4">
        <Card>
          <h3 className="font-bold mb-4">Informasi Pribadi</h3>
          {editing ? (
            <div className="flex flex-col gap-3">
              <Input label="Nama Lengkap" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} icon={<AppIcon name="user" size={16} />} />
              <Input label="No. Telepon" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} icon={<AppIcon name="phone" size={16} />} />
              <Input label="Alamat" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} icon={<AppIcon name="mapPin" size={16} />} />
              <Button onClick={handleSave}>Simpan Perubahan</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {[
                ["Nama", currentUser?.name, "user"],
                ["Email", currentUser?.email, "mail"],
                ["Telepon", currentUser?.phone || "-", "phone"],
                ["Alamat", currentUser?.address || "-", "mapPin"],
              ].map(([k, v, icon]) => (
                <div key={k} className="flex gap-2">
                  <span className="text-sm font-semibold text-gray-400 min-w-[90px] inline-flex items-center gap-1">
                    <AppIcon name={icon} size={13} /> {k}
                  </span>
                  <span className="text-sm">{v}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {currentUser?.role === "penyedia" && (
          <Card>
            <h3 className="font-bold mb-3">Keahlian & Layanan</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map(s => (
                <div key={s} className="flex items-center gap-1 bg-sky-50 rounded-full px-2.5 py-1">
                  <span className="text-sm font-semibold text-sky-600">{s}</span>
                  <button onClick={() => removeSkill(s)} className="bg-transparent border-none text-sky-600 cursor-pointer text-sm leading-none">x</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input value={newSkill} onChange={setNewSkill} placeholder="Tambah keahlian baru..." />
              </div>
              <Button onClick={addSkill} icon={<AppIcon name="plus" size={15} />} size="sm">Tambah</Button>
            </div>
          </Card>
        )}

        <Card>
          <h3 className="font-bold mb-2">Bergabung sejak</h3>
          <p className="text-gray-400 text-sm inline-flex items-center gap-1"><AppIcon name="calendar" size={14} /> {formatDate(currentUser?.createdAt || Date.now())}</p>
        </Card>

        <Button fullWidth variant="danger" onClick={logout} icon={<AppIcon name="logout" size={16} />}>Logout</Button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full py-2.5 bg-transparent border-2 border-dashed border-red-400 rounded-lg text-red-500 cursor-pointer text-sm font-semibold inline-flex items-center justify-center gap-1"
        >
          <AppIcon name="trash" size={14} /> Hapus Akun
        </button>
      </div>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Hapus Akun">
        <p className="text-gray-400 mb-5">Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-2.5">
          <Button fullWidth variant="danger" onClick={() => { showToast("Akun berhasil dihapus", "success"); logout(); }}>Ya, Hapus</Button>
          <Button fullWidth variant="outline" onClick={() => setShowDeleteConfirm(false)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
