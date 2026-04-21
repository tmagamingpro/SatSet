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

const ROLE_THEME = {
  admin: {
    label: "Admin",
    icon: "shield",
    badgeColor: "#A855F7",
    heroClass: "from-violet-700 via-fuchsia-700 to-indigo-700",
    chipClass: "bg-white/16 text-violet-50 border-white/20",
  },
  penyedia: {
    label: "Penyedia Jasa",
    icon: "hardHat",
    badgeColor: "#22C55E",
    heroClass: "from-emerald-600 via-teal-600 to-cyan-700",
    chipClass: "bg-white/16 text-emerald-50 border-white/20",
  },
  pencari: {
    label: "Pencari Jasa",
    icon: "search",
    badgeColor: "#3B82F6",
    heroClass: "from-blue-700 via-sky-700 to-cyan-700",
    chipClass: "bg-white/16 text-sky-50 border-white/20",
  },
};

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

  const roleKey = currentUser?.role || "pencari";
  const roleTheme = ROLE_THEME[roleKey] || ROLE_THEME.pencari;
  const joinedDate = currentUser?.createdAt || new Date().toISOString();
  const roleHighlights = roleKey === "admin"
    ? ["Panel Pengawasan", "Kelola User", "Audit Laporan"]
    : roleKey === "penyedia"
      ? [`${skills.length} Keahlian`, `${currentUser?.totalJobs || 0} Pekerjaan`, `Rating ${Number(currentUser?.rating || 0).toFixed(1)}`]
      : [currentUser?.address ? "Alamat Tersimpan" : "Lengkapi Alamat", "Akses Penyedia Terverifikasi", "Pencarian Lebih Cepat"];

  return (
    <div className="pb-20 bg-slate-50">
      <TopBar title="Profil Saya" actions={
        <Button size="sm" variant="outline" onClick={() => setEditing(!editing)}>{editing ? "Batal" : "Edit"}</Button>
      } />

      <div className={`relative overflow-hidden bg-gradient-to-br ${roleTheme.heroClass} px-5 pt-7 pb-10`}>
        <div className="absolute -top-8 -right-10 w-36 h-36 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-white/10" />

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-3">
            <div className="ring-4 ring-white/20 rounded-full p-1.5 bg-white/10 backdrop-blur-sm">
              <Avatar name={currentUser?.name} size={84} />
            </div>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-3">{currentUser?.name}</h2>
          <p className="text-sky-100 text-sm mt-1">{currentUser?.email}</p>

          <div className="mt-2 flex justify-center">
            <Badge color={roleTheme.badgeColor}>
              <span className="inline-flex items-center gap-1">
                <AppIcon name={roleTheme.icon} size={13} /> {roleTheme.label}
              </span>
            </Badge>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {roleHighlights.map((item) => (
              <span key={item} className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${roleTheme.chipClass}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-5 flex flex-col gap-4">
        <Card className="p-4 sm:p-5">
          <h3 className="font-bold text-slate-800 mb-4">Informasi Pribadi</h3>
          {editing ? (
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3">
              <Input label="Nama Lengkap" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} icon={<AppIcon name="user" size={16} />} />
              <Input label="No. Telepon" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} icon={<AppIcon name="phone" size={16} />} />
              <Input label="Alamat" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} icon={<AppIcon name="mapPin" size={16} />} />
              <Button onClick={handleSave}>Simpan Perubahan</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                ["Nama", currentUser?.name, "user"],
                ["Email", currentUser?.email, "mail"],
                ["Telepon", currentUser?.phone || "-", "phone"],
                ["Alamat", currentUser?.address || "-", "mapPin"],
              ].map(([k, v, icon]) => (
                <div key={k} className="rounded-xl border border-slate-200/80 bg-white px-3 py-2.5">
                  <p className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1">
                    <AppIcon name={icon} size={13} />
                    {k}
                  </p>
                  <p className="text-sm text-slate-800 mt-1 break-words">{v}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {currentUser?.role === "penyedia" && (
          <Card className="p-4 sm:p-5">
            <h3 className="font-bold text-slate-800 mb-3">Keahlian & Layanan</h3>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[34px]">
              {skills.map(s => (
                <div key={s} className="flex items-center gap-1 bg-sky-50 border border-sky-100 rounded-full px-2.5 py-1">
                  <span className="text-sm font-semibold text-sky-700">{s}</span>
                  <button onClick={() => removeSkill(s)} className="bg-transparent border-none text-sky-700 cursor-pointer text-sm leading-none">x</button>
                </div>
              ))}
              {skills.length === 0 && <span className="text-xs text-slate-400">Belum ada keahlian ditambahkan.</span>}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input value={newSkill} onChange={setNewSkill} placeholder="Tambah keahlian baru..." />
              </div>
              <Button onClick={addSkill} icon={<AppIcon name="plus" size={15} />} size="sm">Tambah</Button>
            </div>
          </Card>
        )}

        <Card className="p-4 sm:p-5">
          <h3 className="font-bold text-slate-800 mb-2">Bergabung Sejak</h3>
          <p className="text-slate-500 text-sm inline-flex items-center gap-1">
            <AppIcon name="calendar" size={14} />
            {formatDate(joinedDate)}
          </p>
        </Card>

        <div className="space-y-2">
          <Button fullWidth variant="danger" onClick={logout} icon={<AppIcon name="logout" size={16} />}>Logout</Button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-2.5 bg-white border-2 border-dashed border-red-300 rounded-lg text-red-500 cursor-pointer text-sm font-semibold inline-flex items-center justify-center gap-1 hover:bg-red-50"
          >
            <AppIcon name="trash" size={14} /> Hapus Akun
          </button>
        </div>
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
