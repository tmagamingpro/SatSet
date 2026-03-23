import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../layouts/TopBar";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Stars from "../components/Stars";
import Input from "../components/Input";
import AppIcon from "../components/AppIcon";
import { geocodeAddress } from "../services/geocoding";

const haversineMeters = (origin, destination) => {
  const earthRadius = 6371000;
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const latDelta = toRadians(destination.lat - origin.lat);
  const lngDelta = toRadians(destination.lng - origin.lng);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(destination.lat);
  const angle =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDelta / 2) ** 2;
  return earthRadius * (2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle)));
};

const formatDistance = (meters) => (meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`);

const Search = () => {
  const { users, categories, setScreen, setSelectedProvider, currentUser } = useApp();
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [sortBy, setSortBy] = useState("distance");
  const [workAddress, setWorkAddress] = useState(currentUser?.address || "");
  const [workPoint, setWorkPoint] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [radiusValue, setRadiusValue] = useState(3);
  const [radiusUnit, setRadiusUnit] = useState("km");

  const providers = users.filter((u) => u.role === "penyedia" && u.isVerified && u.isActive);
  const radiusMeters = radiusUnit === "km" ? radiusValue * 1000 : radiusValue;

  const filtered = providers
    .map((provider) => {
      const hasCoordinate = typeof provider.lat === "number" && typeof provider.lng === "number";
      const distanceMeters =
        workPoint && hasCoordinate
          ? haversineMeters(workPoint, { lat: provider.lat, lng: provider.lng })
          : null;
      return { ...provider, distanceMeters };
    })
    .filter((provider) => {
      const matchQuery =
        !query ||
        provider.name.toLowerCase().includes(query.toLowerCase()) ||
        provider.skills?.some((skill) => skill.toLowerCase().includes(query.toLowerCase()));
      const matchCat = !selectedCat || provider.skills?.some((skill) => skill.toLowerCase().includes(selectedCat.toLowerCase()));
      const matchRadius =
        !workPoint || (typeof provider.distanceMeters === "number" && provider.distanceMeters <= radiusMeters);
      return matchQuery && matchCat && matchRadius;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "jobs") return b.totalJobs - a.totalJobs;
      return (a.distanceMeters ?? Number.MAX_SAFE_INTEGER) - (b.distanceMeters ?? Number.MAX_SAFE_INTEGER);
    });

  const handleDetectWorkLocation = async () => {
    if (!workAddress.trim()) {
      setLocationError("Isi alamat lokasi kerja terlebih dahulu.");
      return;
    }

    setIsDetectingLocation(true);
    setLocationError("");
    try {
      const geocoded = await geocodeAddress(workAddress);
      if (!geocoded) {
        setLocationError("Alamat tidak ditemukan. Coba tambah detail jalan/kecamatan.");
        setWorkPoint(null);
        setIsDetectingLocation(false);
        return;
      }
      setWorkPoint(geocoded);
      setWorkAddress(geocoded.formatted || workAddress);
    } catch (error) {
      setLocationError(error.message || "Gagal mendeteksi lokasi kerja.");
      setWorkPoint(null);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  return (
    <div className="pb-20">
      <TopBar title="Cari Layanan" subtitle={`${filtered.length} penyedia ditemukan`} />
      <div className="px-5 pt-4">
        <Input value={query} onChange={setQuery} placeholder="Cari nama / layanan..." icon={<AppIcon name="search" size={16} />} />

        <Card className="mt-3 p-4">
          <p className="text-sm font-bold text-slate-700 mb-2">Lokasi Kerja & Radius</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
            <Input
              label="Alamat lokasi kerja"
              value={workAddress}
              onChange={(value) => {
                setWorkAddress(value);
                setWorkPoint(null);
                setLocationError("");
              }}
              placeholder="Contoh: Jl Sudirman No 12, Ilir Barat I"
              icon={<AppIcon name="mapPin" size={16} />}
            />
            <button
              type="button"
              onClick={handleDetectWorkLocation}
              className="h-10 sm:self-end rounded-lg bg-sky-600 text-white text-sm font-semibold border-none px-3.5 cursor-pointer"
            >
              {isDetectingLocation ? "Mendeteksi..." : "Deteksi Lokasi"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Radius</p>
              <input
                type="number"
                min={1}
                value={radiusValue}
                onChange={(event) => setRadiusValue(Number(event.target.value) || 1)}
                className="w-full h-10 rounded-lg border-2 border-gray-200 px-3 text-sm outline-none"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Satuan</p>
              <select
                value={radiusUnit}
                onChange={(event) => setRadiusUnit(event.target.value)}
                className="w-full h-10 rounded-lg border-2 border-gray-200 px-3 text-sm outline-none"
              >
                <option value="km">Kilometer (km)</option>
                <option value="m">Meter (m)</option>
              </select>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-2">
            Menampilkan penyedia aktif dalam radius {radiusValue} {radiusUnit}.
          </p>
          {locationError && <p className="text-[11px] text-rose-600 mt-1">{locationError}</p>}
          <p className="text-[11px] text-sky-700 mt-1">
            {workPoint
              ? `Lokasi terdeteksi: ${workPoint.formatted}`
              : "Klik Deteksi Lokasi agar jarak dan radius bisa dihitung akurat."}
          </p>
        </Card>

        <Card className="mt-3 p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-sm font-bold text-slate-700">Kategori & Urutan</p>
            <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {[
                { v: "distance", l: "Terdekat", icon: "mapPin" },
                { v: "rating", l: "Rating", icon: "star" },
                { v: "jobs", l: "Pekerjaan", icon: "briefcase" },
              ].map((s) => (
                <button
                  key={s.v}
                  onClick={() => setSortBy(s.v)}
                  className={`px-3 py-1.5 rounded-full cursor-pointer text-xs font-semibold border-2 transition-all inline-flex items-center gap-1 whitespace-nowrap
                    ${sortBy === s.v ? "border-sky-600 bg-sky-50 text-sky-600" : "border-gray-200 bg-transparent text-gray-400"}`}
                >
                  <AppIcon name={s.icon} size={13} /> {s.l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pt-1" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setSelectedCat(null)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full cursor-pointer border-2 text-sm font-semibold transition-all
              ${!selectedCat ? "border-sky-600 bg-sky-50 text-sky-600" : "border-gray-200 bg-transparent text-gray-400"}`}
          >Semua</button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.name)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full cursor-pointer border-2 text-sm font-semibold transition-all inline-flex items-center gap-1.5
                ${selectedCat === c.name ? "border-sky-600 bg-sky-50 text-sky-600" : "border-gray-200 bg-transparent text-gray-400"}`}
            >
              <AppIcon name={c.icon} size={14} /> {c.name}
            </button>
          ))}
        </div>
        </Card>

        <div className="flex flex-col gap-3 mt-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="mb-3 flex justify-center"><AppIcon name="search" size={34} /></div>
              <p>Tidak ada penyedia ditemukan</p>
            </div>
          ) : filtered.map(p => (
            <Card key={p.id} onClick={() => { setSelectedProvider(p); setScreen("provider-detail"); }}>
              <div className="flex gap-3.5 items-start">
                <Avatar name={p.name} size={52} colorIndex={p.id} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold">{p.name}</span>
                      {p.isVerified && <AppIcon name="badgeCheck" size={16} className="text-emerald-500" />}
                    </div>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {p.skills?.map(s => <Badge key={s} color="#3B82F6">{s}</Badge>)}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Stars rating={p.rating} />
                    <span className="text-xs text-gray-400 inline-flex items-center gap-1"><AppIcon name="package" size={12} /> {p.totalJobs} pekerjaan</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 inline-flex items-center gap-1">
                    <AppIcon name="mapPin" size={12} /> Kantor: {p.officeLocation || p.address}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1 inline-flex items-center gap-1">
                    <AppIcon name="zap" size={12} /> Aktif sekarang
                  </div>
                  <div className="text-xs text-sky-700 mt-1 inline-flex items-center gap-1">
                    <AppIcon name="arrowRight" size={12} />
                    {p.distanceMeters == null ? "Deteksi lokasi kerja untuk hitung jarak" : `${formatDistance(p.distanceMeters)} dari lokasi kerja`}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
