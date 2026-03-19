/**
 * Format angka ke format Rupiah Indonesia
 */
export const formatRupiah = (amount) =>
  `Rp ${Number(amount).toLocaleString("id-ID")}`;

/**
 * Format tanggal ke locale Indonesia
 */
export const formatDate = (dateStr, options = {}) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });

/**
 * Format waktu ke HH:MM
 */
export const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

/**
 * Ambil inisial dari nama (maks 2 huruf)
 */
export const getInitials = (name = "") =>
  name.slice(0, 2).toUpperCase();

/**
 * Capitalize huruf pertama
 */
export const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Truncate teks panjang
 */
export const truncate = (str = "", maxLen = 50) =>
  str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
