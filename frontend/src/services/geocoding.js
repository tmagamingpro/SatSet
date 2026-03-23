const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v1/geocode/search";

export const geocodeAddress = async (addressText) => {
  const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;
  if (!apiKey) {
    throw new Error("Geoapify API key belum ditemukan. Isi VITE_GEOAPIFY_KEY di .env.");
  }

  if (!addressText?.trim()) {
    throw new Error("Alamat masih kosong.");
  }

  const params = new URLSearchParams({
    text: addressText.trim(),
    format: "json",
    limit: "1",
    filter: "countrycode:id",
    apiKey,
  });

  const response = await fetch(`${GEOAPIFY_BASE_URL}?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Gagal memproses alamat. Coba lagi beberapa saat.");
  }

  const data = await response.json();
  const result = data?.results?.[0];
  if (!result) return null;

  return {
    lat: result.lat,
    lng: result.lon,
    formatted: result.formatted || addressText,
    province: result.state || "",
    city: result.city || result.county || result.state_district || "",
    district: result.suburb || result.district || "",
  };
};

