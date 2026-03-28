import Badge from "../../../components/Badge";
import Stars from "../../../components/Stars";
import AppIcon from "../../../components/AppIcon";

const ProviderHomeHeader = ({
  currentUser,
  isActiveNow,
  avgRating,
  myReviewsCount,
  onToggleActive,
}) => (
  <div className="bg-gradient-to-br from-[#0B1F3A] via-[#123A63] to-[#0E7490] px-5 pt-7 pb-10">
    <p className="text-white/60 text-sm">Selamat datang kembali</p>
    <h1 className="text-2xl font-extrabold text-white">{currentUser?.name?.split(" ")[0]}</h1>
    <div className="mt-2 flex items-center gap-2 flex-wrap">
      {currentUser?.isVerified ? (
        <Badge color="#22C55E">
          <span className="inline-flex items-center gap-1">
            <AppIcon name="badgeCheck" size={13} />
            Terverifikasi
          </span>
        </Badge>
      ) : (
        <Badge color="#F59E0B">
          <span className="inline-flex items-center gap-1">
            <AppIcon name="clock" size={13} />
            Menunggu Verifikasi
          </span>
        </Badge>
      )}
      {isActiveNow ? (
        <Badge color="#0EA5E9">
          <span className="inline-flex items-center gap-1">
            <AppIcon name="zap" size={13} />
            Aktif
          </span>
        </Badge>
      ) : (
        <Badge color="#64748B">
          <span className="inline-flex items-center gap-1">
            <AppIcon name="clock" size={13} />
            Offline
          </span>
        </Badge>
      )}
      <Stars rating={parseFloat(avgRating) || 0} />
      <span className="text-white/80 text-xs font-semibold">{myReviewsCount} review</span>
    </div>
    <button
      onClick={onToggleActive}
      className={`mt-3 py-2 px-3.5 rounded-lg border-none text-xs font-semibold cursor-pointer
        ${isActiveNow ? "bg-slate-800 text-white" : "bg-sky-500 text-white"}`}
    >
      {isActiveNow ? "Set Offline" : "Set Aktif"}
    </button>
  </div>
);

export default ProviderHomeHeader;
