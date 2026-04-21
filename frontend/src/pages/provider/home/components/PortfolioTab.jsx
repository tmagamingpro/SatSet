import { useState } from "react";
import Card from "../../../../components/Card";
import Badge from "../../../../components/Badge";
import Button from "../../../../components/Button";
import AppIcon from "../../../../components/AppIcon";
import Modal from "../../../../components/Modal";
import Input from "../../../../components/Input";

const DEFAULT_FORM = {
  title: "",
  description: "",
  imageUrl: "",
  imageData: "",
  beforeAfter: false,
};

const PortfolioTab = ({ myPortfolio, currentUserId, onAddPortfolio, showToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  const handleReadImage = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("File harus berupa gambar.", "error");
      return;
    }

    try {
      const dataUrl = await handleReadImage(file);
      setForm((prev) => ({ ...prev, imageData: dataUrl, imageUrl: "" }));
    } catch {
      showToast("Gagal membaca file gambar.", "error");
    }
  };

  const handleSubmit = async () => {
    const image = form.imageData || form.imageUrl.trim();
    if (!currentUserId || !form.title.trim() || !form.description.trim() || !image) {
      showToast("Judul, deskripsi, dan gambar wajib diisi.", "error");
      return;
    }

    setIsSubmitting(true);
    const created = await onAddPortfolio({
      providerId: currentUserId,
      title: form.title.trim(),
      description: form.description.trim(),
      image,
      beforeAfter: form.beforeAfter,
    });
    setIsSubmitting(false);

    if (!created) return;
    showToast("Portofolio berhasil ditambahkan.", "success");
    setForm(DEFAULT_FORM);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Portfolio Saya</h3>
        <Button size="sm" onClick={() => setIsModalOpen(true)} icon={<AppIcon name="plus" size={14} />}>
          Tambah
        </Button>
      </div>

      {myPortfolio.length === 0 ? (
        <Card className="p-6 text-center">
          <AppIcon name="image" size={32} className="mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500 mb-3">Belum ada portfolio</p>
          <Button onClick={() => setIsModalOpen(true)}>Tambah Portfolio</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {myPortfolio.map((item) => (
            <Card key={item.id} className="overflow-hidden p-0">
              <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-800 line-clamp-2">{item.title}</p>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                {item.beforeAfter && (
                  <div className="mt-2">
                    <Badge color="#0284C7">Before-After</Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Portfolio">
        <div className="flex flex-col gap-3">
          <Input
            label="Judul Karya"
            value={form.title}
            onChange={(value) => setForm((prev) => ({ ...prev, title: value }))}
            placeholder="Contoh: Instalasi Lampu Taman"
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">
              Deskripsi<span className="text-sky-600"> *</span>
            </label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Jelaskan pekerjaan yang sudah dikerjakan"
              className="w-full rounded-lg text-sm bg-white text-gray-800 outline-none transition-colors duration-200 border-2 border-gray-200 focus:border-sky-600 px-3.5 py-2.5 min-h-[92px] resize-none"
            />
          </div>
          <Input
            label="URL Gambar (opsional jika upload file)"
            value={form.imageUrl}
            onChange={(value) => setForm((prev) => ({ ...prev, imageUrl: value, imageData: "" }))}
            placeholder="https://..."
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Upload Gambar</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-slate-700" />
          </div>
          {(form.imageData || form.imageUrl) && (
            <img
              src={form.imageData || form.imageUrl}
              alt="Preview portofolio"
              className="w-full h-36 object-cover rounded-lg border border-gray-200"
            />
          )}
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.beforeAfter}
              onChange={(event) => setForm((prev) => ({ ...prev, beforeAfter: event.target.checked }))}
            />
            Tampilkan sebagai Before-After
          </label>
          <Button onClick={handleSubmit} disabled={isSubmitting} fullWidth>
            {isSubmitting ? "Menyimpan..." : "Simpan Portfolio"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PortfolioTab;
