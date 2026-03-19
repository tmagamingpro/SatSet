// ============================================================
// MOCK DATABASE / INITIAL STATE
// ============================================================
export const INITIAL_USERS = [
  { id: 1, name: "Ahmad Rizki", email: "pencari@test.com", password: "123456", role: "pencari", avatar: "AR", phone: "081234567890", address: "Jl. Merdeka No. 5, Palembang", createdAt: "2025-01-10" },
  { id: 2, name: "Budi Santoso", email: "penyedia@test.com", password: "123456", role: "penyedia", avatar: "BS", phone: "085678901234", address: "Jl. Sudirman No. 12, Palembang", skills: ["Instalasi Listrik", "Perbaikan AC"], rating: 4.8, totalJobs: 47, isVerified: true, createdAt: "2025-01-05" },
  { id: 3, name: "Admin SatSet", email: "admin@satset.com", password: "admin123", role: "admin", avatar: "AS", createdAt: "2024-12-01" },
  { id: 4, name: "Citra Dewi", email: "citra@test.com", password: "123456", role: "penyedia", avatar: "CD", phone: "087890123456", address: "Jl. Ahmad Yani No. 8, Palembang", skills: ["Kebersihan Rumah", "Setrika"], rating: 4.5, totalJobs: 32, isVerified: true, createdAt: "2025-01-12" },
  { id: 5, name: "Deni Pratama", email: "deni@test.com", password: "123456", role: "penyedia", avatar: "DP", phone: "082345678901", address: "Jl. Kertapati No. 3, Palembang", skills: ["Pindahan Rumah", "Angkut Barang"], rating: 4.2, totalJobs: 18, isVerified: false, createdAt: "2025-02-01" },
  { id: 6, name: "Eka Fitriani", email: "eka@test.com", password: "123456", role: "penyedia", avatar: "EF", phone: "083456789012", address: "Jl. Demang No. 15, Palembang", skills: ["Memasak", "Catering"], rating: 4.9, totalJobs: 63, isVerified: true, createdAt: "2024-12-20" },
];

export const INITIAL_ORDERS = [
  { id: 1, customerId: 1, providerId: 2, service: "Instalasi Listrik", description: "Pasang stopkontak 3 titik di ruang tamu", location: "Jl. Bukit Besar No. 7", status: "selesai", createdAt: "2025-02-10", completedAt: "2025-02-10", price: 150000 },
  { id: 2, customerId: 1, providerId: 4, service: "Kebersihan Rumah", description: "Bersihkan 3 kamar + ruang tamu", location: "Jl. Merdeka No. 5", status: "berlangsung", createdAt: "2025-03-01", price: 200000 },
  { id: 3, customerId: 1, providerId: 6, service: "Memasak", description: "Masak untuk acara 30 orang", location: "Jl. Merdeka No. 5", status: "menunggu", createdAt: "2025-03-15", price: 500000 },
];

export const CATEGORIES = [
  { id: 1, name: "Instalasi Listrik", icon: "zap", color: "#0284C7" },
  { id: 2, name: "Kebersihan", icon: "sparkles", color: "#14B8A6" },
  { id: 3, name: "Pindahan", icon: "package", color: "#2563EB" },
  { id: 4, name: "Perbaikan", icon: "wrench", color: "#6366F1" },
  { id: 5, name: "Memasak", icon: "chefHat", color: "#0EA5E9" },
  { id: 6, name: "Berkebun", icon: "leaf", color: "#0D9488" },
  { id: 7, name: "Pengasuhan", icon: "baby", color: "#0F766E" },
  { id: 8, name: "Keamanan", icon: "shield", color: "#475569" },
];

export const DEMO_ACCOUNTS = [
  { label: "Pencari Jasa", email: "pencari@test.com", pw: "123456" },
  { label: "Penyedia Jasa", email: "penyedia@test.com", pw: "123456" },
  { label: "Admin", email: "admin@satset.com", pw: "admin123" },
];

export const STATUS_COLORS = {
  menunggu: "#F59E0B",
  berlangsung: "#3B82F6",
  selesai: "#22C55E",
  dibatalkan: "#EF4444",
  ditolak: "#9CA3AF",
};

export const MOCK_REPORTS = [
  { id: 1, from: "Ahmad Rizki", type: "Penyedia Jasa", desc: "Penyedia tidak datang sesuai jadwal", date: "2025-03-10" },
  { id: 2, from: "Budi S.", type: "Aplikasi", desc: "Bug pada fitur notifikasi tidak muncul", date: "2025-03-12" },
  { id: 3, from: "Citra D.", type: "Pencari Jasa", desc: "Pencari membatalkan tanpa alasan berkali-kali", date: "2025-03-14" },
];


