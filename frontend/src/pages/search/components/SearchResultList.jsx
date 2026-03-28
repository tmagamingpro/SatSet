import Card from "../../../components/Card";
import Avatar from "../../../components/Avatar";
import Badge from "../../../components/Badge";
import Stars from "../../../components/Stars";
import AppIcon from "../../../components/AppIcon";

const ProviderCard = ({ provider, formatDistance, onSelectProvider }) => (
  <Card onClick={() => onSelectProvider(provider)} className="p-4">
    <div className="flex gap-3.5 items-start">
      <Avatar name={provider.name} size={52} colorIndex={provider.id} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800 truncate">{provider.name}</span>
              {provider.isVerified && <AppIcon name="badgeCheck" size={16} className="text-emerald-500" />}
            </div>

            <div className="mt-1.5 flex flex-wrap gap-1">
              {provider.skills?.map((skill) => (
                <Badge key={skill} color="#3B82F6">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <Stars rating={provider.rating} />
          <span className="text-xs text-slate-500 inline-flex items-center gap-1">
            <AppIcon name="package" size={12} />
            {provider.totalJobs} pekerjaan
          </span>
          <span className="text-xs text-emerald-600 inline-flex items-center gap-1">
            <AppIcon name="zap" size={12} />
            Aktif sekarang
          </span>
        </div>

        <p className="text-xs text-slate-500 mt-1.5 inline-flex items-center gap-1 max-w-full">
          <AppIcon name="mapPin" size={12} />
          <span className="truncate">Kantor: {provider.officeLocation || provider.address}</span>
        </p>

        <div className="mt-2 rounded-lg bg-sky-50 text-sky-700 px-2.5 py-1.5 inline-flex items-center gap-1 text-xs font-medium">
          <AppIcon name="arrowRight" size={12} />
          {provider.distanceMeters == null
            ? "Deteksi lokasi kerja untuk hitung jarak"
            : `${formatDistance(provider.distanceMeters)} dari lokasi kerja`}
        </div>
      </div>
    </div>
  </Card>
);

const SearchResultList = ({ providers, formatDistance, onSelectProvider }) => {
  if (providers.length === 0) {
    return (
      <Card className="py-10 text-center">
        <div className="mb-3 flex justify-center text-slate-300">
          <AppIcon name="search" size={34} />
        </div>
        <p className="text-sm font-semibold text-slate-600">Tidak ada penyedia ditemukan</p>
        <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci, kategori, atau radius pencarian.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          formatDistance={formatDistance}
          onSelectProvider={onSelectProvider}
        />
      ))}
    </div>
  );
};

export default SearchResultList;
