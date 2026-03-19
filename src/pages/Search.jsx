import { useState } from "react";
import { useApp } from "../context/AppContext";
import TopBar from "../layouts/TopBar";
import Card from "../components/Card";
import Avatar from "../components/Avatar";
import Badge from "../components/Badge";
import Stars from "../components/Stars";
import Input from "../components/Input";
import AppIcon from "../components/AppIcon";
import { CATEGORIES } from "../utils/constants";

const Search = () => {
  const { users, setScreen, setSelectedProvider } = useApp();
  const [query, setQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState(null);
  const [sortBy, setSortBy] = useState("rating");

  const providers = users.filter(u => u.role === "penyedia" && u.isVerified);
  const filtered = providers.filter(p => {
    const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.skills?.some(s => s.toLowerCase().includes(query.toLowerCase()));
    const matchCat = !selectedCat || p.skills?.some(s => s.toLowerCase().includes(selectedCat.toLowerCase()));
    return matchQuery && matchCat;
  }).sort((a, b) => sortBy === "rating" ? b.rating - a.rating : b.totalJobs - a.totalJobs);

  return (
    <div className="pb-20">
      <TopBar title="Cari Layanan" subtitle={`${filtered.length} penyedia ditemukan`} />
      <div className="px-5 pt-4">
        <Input value={query} onChange={setQuery} placeholder="Cari nama / layanan..." icon={<AppIcon name="search" size={16} />} />

        <div className="flex gap-2 overflow-x-auto py-3.5" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setSelectedCat(null)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full cursor-pointer border-2 text-sm font-semibold transition-all
              ${!selectedCat ? "border-sky-600 bg-sky-50 text-sky-600" : "border-gray-200 bg-transparent text-gray-400"}`}
          >Semua</button>
          {CATEGORIES.map(c => (
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

        <div className="flex gap-2 mb-4">
          {[
            { v: "rating", l: "Rating Tertinggi", icon: "star" },
            { v: "jobs", l: "Terbanyak Dikerjakan", icon: "briefcase" },
          ].map(s => (
            <button
              key={s.v}
              onClick={() => setSortBy(s.v)}
              className={`px-3.5 py-1.5 rounded-full cursor-pointer text-xs font-semibold border-2 transition-all inline-flex items-center gap-1
                ${sortBy === s.v ? "border-sky-600 bg-sky-50 text-sky-600" : "border-gray-200 bg-transparent text-gray-400"}`}
            ><AppIcon name={s.icon} size={13} /> {s.l}</button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
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
                    <AppIcon name="mapPin" size={12} /> {p.address}
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
