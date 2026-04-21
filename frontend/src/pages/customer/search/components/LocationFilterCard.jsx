import Card from "../../../../components/Card";
import Input from "../../../../components/Input";
import AppIcon from "../../../../components/AppIcon";

const LocationFilterCard = ({
  workAddress,
  setWorkAddress,
  setWorkPoint,
  setLocationError,
  handleDetectWorkLocation,
  isDetectingLocation,
  radiusValue,
  setRadiusValue,
  radiusUnit,
  setRadiusUnit,
  locationError,
  workPoint,
}) => (
  <Card className="p-4 sm:p-5">
    <div className="mb-3.5">
      <p className="text-sm font-bold text-slate-800">Lokasi Kerja & Radius</p>
      <p className="text-xs text-slate-500 mt-0.5">Gunakan titik lokasi agar urutan terdekat dan radius lebih akurat.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2.5">
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
        disabled={isDetectingLocation}
        className="h-10 sm:self-end rounded-xl bg-sky-600 text-white text-sm font-semibold border-none px-4 cursor-pointer transition-colors hover:bg-sky-700 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isDetectingLocation ? "Mendeteksi..." : "Deteksi Lokasi"}
      </button>
    </div>

    <div className="grid grid-cols-2 gap-2.5 mt-3">
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1.5">Radius</p>
        <input
          type="number"
          min={1}
          value={radiusValue}
          onChange={(event) => setRadiusValue(Math.max(1, Number(event.target.value) || 1))}
          className="w-full h-10 rounded-xl border-2 border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-sky-600"
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1.5">Satuan</p>
        <select
          value={radiusUnit}
          onChange={(event) => setRadiusUnit(event.target.value)}
          className="w-full h-10 rounded-xl border-2 border-slate-200 px-3 text-sm text-slate-700 outline-none focus:border-sky-600"
        >
          <option value="km">Kilometer (km)</option>
          <option value="m">Meter (m)</option>
        </select>
      </div>
    </div>

    <div className="mt-3 rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2">
      <p className="text-[11px] text-slate-500">Menampilkan penyedia aktif dalam radius {radiusValue} {radiusUnit}.</p>
      {locationError && <p className="text-[11px] text-rose-600 mt-1">{locationError}</p>}
      <p className={`text-[11px] mt-1 ${workPoint ? "text-sky-700" : "text-slate-500"}`}>
        {workPoint
          ? `Lokasi terdeteksi: ${workPoint.formatted}`
          : "Klik Deteksi Lokasi agar jarak dan radius bisa dihitung akurat."}
      </p>
    </div>
  </Card>
);

export default LocationFilterCard;
