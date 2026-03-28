import Card from "../../../components/Card";
import AppIcon from "../../../components/AppIcon";

const sortOptions = [
  { value: "distance", label: "Terdekat", icon: "mapPin" },
  { value: "rating", label: "Rating", icon: "star" },
  { value: "jobs", label: "Pekerjaan", icon: "briefcase" },
];

const chipBaseClass =
  "px-3.5 py-1.5 rounded-full cursor-pointer border-2 text-sm font-semibold transition-all inline-flex items-center gap-1.5 whitespace-nowrap";

const SortAndCategoryCard = ({ sortBy, setSortBy, selectedCat, setSelectedCat, categories }) => (
  <Card className="p-4 sm:p-5">
    <div className="mb-3.5">
      <p className="text-sm font-bold text-slate-800">Filter Hasil</p>
      <p className="text-xs text-slate-500 mt-0.5">Atur urutan dan kategori layanan agar hasil lebih relevan.</p>
    </div>

    <div>
      <p className="text-xs font-semibold text-slate-500 mb-2">Urutkan berdasarkan</p>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSortBy(option.value)}
            className={`${chipBaseClass} ${
              sortBy === option.value ? "border-sky-600 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            <AppIcon name={option.icon} size={13} />
            {option.label}
          </button>
        ))}
      </div>
    </div>

    <div className="mt-3.5">
      <p className="text-xs font-semibold text-slate-500 mb-2">Kategori layanan</p>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        <button
          type="button"
          onClick={() => setSelectedCat(null)}
          className={`flex-shrink-0 ${chipBaseClass} ${
            !selectedCat ? "border-sky-600 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-500"
          }`}
        >
          Semua
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCat(category.name)}
            className={`flex-shrink-0 ${chipBaseClass} ${
              selectedCat === category.name ? "border-sky-600 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            <AppIcon name={category.icon} size={14} />
            {category.name}
          </button>
        ))}
      </div>
    </div>
  </Card>
);

export default SortAndCategoryCard;
