import { useState } from "react";
import { useApp } from "../../../context/AppContext";
import TopBar from "../../../layouts/TopBar";
import Input from "../../../components/Input";
import AppIcon from "../../../components/AppIcon";
import { geocodeAddress } from "../../../services/geocoding";
import LocationFilterCard from "./components/LocationFilterCard";
import SortAndCategoryCard from "./components/SortAndCategoryCard";
import SearchResultList from "./components/SearchResultList";

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
      <div className="px-5 pt-4 space-y-3">
        <section className="space-y-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-3.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
            <Input
              label="Cari penyedia"
              value={query}
              onChange={setQuery}
              placeholder="Cari nama penyedia atau jenis layanan..."
              icon={<AppIcon name="search" size={16} />}
            />
          </div>

          <LocationFilterCard
            workAddress={workAddress}
            setWorkAddress={setWorkAddress}
            setWorkPoint={setWorkPoint}
            setLocationError={setLocationError}
            handleDetectWorkLocation={handleDetectWorkLocation}
            isDetectingLocation={isDetectingLocation}
            radiusValue={radiusValue}
            setRadiusValue={setRadiusValue}
            radiusUnit={radiusUnit}
            setRadiusUnit={setRadiusUnit}
            locationError={locationError}
            workPoint={workPoint}
          />

          <SortAndCategoryCard
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
            categories={categories}
          />
        </section>

        <section>
          <SearchResultList
            providers={filtered}
            formatDistance={formatDistance}
            onSelectProvider={(provider) => {
              setSelectedProvider(provider);
              setScreen("provider-detail");
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default Search;
