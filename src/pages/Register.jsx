import { useState } from "react";
import { useApp } from "../context/AppContext";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import AppIcon from "../components/AppIcon";
import { geocodeAddress } from "../services/geocoding";

const Register = ({ onBack }) => {
  const { addUser, showToast } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "pencari",
    officeLocation: "",
    experience: "",
    lat: null,
    lng: null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      setError("Semua field wajib diisi."); return;
    }
    if (form.role === "penyedia" && !form.officeLocation) {
      setError("Penyedia jasa wajib mengisi alamat/lokasi kantor."); return;
    }

    setError("");
    setIsSubmitting(true);

    let payload = { ...form };
    if (form.role === "penyedia") {
      try {
        const geocoded = await geocodeAddress(form.officeLocation);
        if (!geocoded) {
          setError("Alamat kantor tidak ditemukan. Mohon perjelas alamat.");
          setIsSubmitting(false);
          return;
        }
        payload = {
          ...payload,
          officeLocation: geocoded.formatted,
          address: geocoded.formatted,
          lat: geocoded.lat,
          lng: geocoded.lng,
        };
      } catch (geoError) {
        setError(geoError.message || "Gagal memproses alamat kantor.");
        setIsSubmitting(false);
        return;
      }
    }

    const success = addUser(payload);
    setIsSubmitting(false);
    if (!success) { setError("Email sudah terdaftar."); return; }
    showToast("Akun berhasil dibuat! Silakan login.", "success");
    onBack();
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
      officeLocation: role === "penyedia" ? prev.officeLocation : "",
      experience: role === "penyedia" ? prev.experience : "",
      lat: role === "penyedia" ? prev.lat : null,
      lng: role === "penyedia" ? prev.lng : null,
    }));
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-1">Daftar Akun</h2>
      <p className="text-gray-400 text-sm mb-6">Bergabung dengan SatSet sekarang</p>
      <div className="flex flex-col gap-3.5">
        <div className="flex gap-2">
          {[
            { key: "pencari", label: "Pencari Jasa", icon: "search" },
            { key: "penyedia", label: "Penyedia Jasa", icon: "hardHat" },
          ].map(r => (
            <button
              type="button"
              key={r.key}
              onClick={() => handleRoleChange(r.key)}
              className={`flex-1 py-2.5 rounded-lg cursor-pointer border-2 font-semibold text-sm transition-all inline-flex items-center justify-center gap-1.5
                ${form.role === r.key
                  ? "border-sky-600 bg-sky-50 text-sky-600"
                  : "border-gray-200 bg-transparent text-gray-400"}`}
            >
              <AppIcon name={r.icon} size={14} /> {r.label}
            </button>
          ))}
        </div>
        <Input label="Nama Lengkap" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Nama lengkap Anda" icon={<AppIcon name="user" size={16} />} required />
        <Input label="Email" type="email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="nama@email.com" icon={<AppIcon name="mail" size={16} />} required />
        <Input label="Password" type="password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="Min. 6 karakter" icon={<AppIcon name="lock" size={16} />} required />
        <Input label="No. Telepon" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="08xxxxxxxxxx" icon={<AppIcon name="phone" size={16} />} required />
        {form.role === "penyedia" && (
          <>
            <Input
              label="Alamat Kantor"
              value={form.officeLocation}
              onChange={(value) => setForm((prev) => ({ ...prev, officeLocation: value }))}
              placeholder="Contoh: Jl Sudirman No 12, Ilir Barat I, Palembang"
              icon={<AppIcon name="mapPin" size={16} />}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500">Pengalaman Kerja</label>
              <textarea
                value={form.experience}
                onChange={(event) => setForm((prev) => ({ ...prev, experience: event.target.value }))}
                placeholder="Contoh: 5 tahun menangani instalasi listrik rumah dan kantor"
                rows={3}
                className="w-full rounded-lg border-2 border-gray-200 px-3.5 py-2.5 text-sm bg-white text-gray-800 outline-none transition-colors duration-200 focus:border-sky-600"
              />
              <p className="text-[11px] text-gray-400">Tuliskan ringkas pengalaman agar pencari jasa lebih yakin.</p>
            </div>
          </>
        )}
        {error && (
          <div className="bg-red-50 border border-red-400 rounded-lg px-3.5 py-2.5 text-red-500 text-sm">{error}</div>
        )}
        <Button fullWidth onClick={handleRegister} size="lg">{isSubmitting ? "Memproses..." : "Daftar Sekarang"}</Button>
        <button type="button" onClick={onBack} className="bg-transparent border-none text-gray-400 cursor-pointer text-sm">Kembali ke Login</button>
      </div>
    </Card>
  );
};

export default Register;
