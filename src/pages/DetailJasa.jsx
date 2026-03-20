import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../layouts/TopBar";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Input from "../components/Input";
import AppIcon from "../components/AppIcon";

const DetailJasa = () => {
  const { selectedProvider, setScreen, currentUser, addOrder, showToast } = useApp();
  const [showOrder, setShowOrder] = useState(false);
  const [form, setForm] = useState({ service: "", description: "", location: currentUser?.address || "", price: "" });
  const p = selectedProvider;
  if (!p) return null;

  const handleOrder = () => {
    if (!form.service || !form.description || !form.location) { showToast("Isi semua field!", "error"); return; }
    addOrder({ customerId: currentUser.id, providerId: p.id, ...form, price: parseInt(form.price, 10) || 0 });
    showToast("Permintaan berhasil dikirim!", "success");
    setShowOrder(false);
    setScreen("orders");
  };

  return (
    <div className="pb-24">
      <TopBar title="Detail Penyedia" back="search" />

      <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-9 text-center">
        <div className="flex justify-center mb-3">
          <Avatar name={p.name} size={80} colorIndex={p.id} />
        </div>
        <h2 className="text-xl font-extrabold text-white mt-3">{p.name}</h2>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          {p.isVerified && <Badge color="#22C55E"><span className="inline-flex items-center gap-1"><AppIcon name="badgeCheck" size={12} /> Terverifikasi</span></Badge>}
        </div>
        <div className="flex justify-center gap-6 mt-5">
          {[
            { label: "Rating", value: p.rating?.toFixed(1), icon: "star" },
            { label: "Pekerjaan", value: p.totalJobs, icon: "briefcase" },
            { label: "Bergabung", value: "2025", icon: "calendar" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-extrabold text-xl text-white inline-flex items-center gap-1"><AppIcon name={s.icon} size={16} /> {s.value}</div>
              <div className="text-[11px] text-white/60 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-3">Keahlian & Layanan</h3>
          <div className="flex flex-wrap gap-2">
            {p.skills?.map(s => <Badge key={s} color="#0284C7">{s}</Badge>)}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold mb-3">Informasi</h3>
          {[
            ["Lokasi Kantor", p.officeLocation || p.address, "mapPin"],
            ["Telepon", p.phone, "phone"],
          ].map(([k, v, icon]) => (
            <div key={k} className="flex gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-400 min-w-[80px] inline-flex items-center gap-1"><AppIcon name={icon} size={12} /> {k}</span>
              <span className="text-sm">{v}</span>
            </div>
          ))}
        </div>

        <Button fullWidth size="lg" onClick={() => setShowOrder(true)} icon={<AppIcon name="send" size={16} />}>Pesan Sekarang</Button>
      </div>

      <Modal open={showOrder} onClose={() => setShowOrder(false)} title="Buat Permintaan Layanan">
        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-1.5">Jenis Layanan *</label>
            <select
              value={form.service}
              onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
              className="w-full px-3.5 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white"
            >
              <option value="">Pilih layanan...</option>
              {p.skills?.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Input label="Deskripsi Pekerjaan" value={form.description} onChange={v => setForm(f => ({ ...f, description: v }))} placeholder="Jelaskan pekerjaan yang dibutuhkan" required />
          <Input label="Lokasi" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} placeholder="Alamat lengkap" icon={<AppIcon name="mapPin" size={16} />} required />
          <Input label="Estimasi Harga (Rp)" type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} placeholder="0" icon={<AppIcon name="wallet" size={16} />} />
          <Button fullWidth onClick={handleOrder} size="lg">Kirim Permintaan</Button>
        </div>
      </Modal>
    </div>
  );
};

export default DetailJasa;
