const Input = ({ label, type = "text", value, onChange, placeholder, icon, required, error }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-gray-500">
        {label}{required && <span className="text-sky-600"> *</span>}
      </label>
    )}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg text-sm bg-white text-gray-800 outline-none transition-colors duration-200
          border-2 focus:border-sky-600
          ${icon ? "pl-10 pr-3.5 py-2.5" : "px-3.5 py-2.5"}
          ${error ? "border-red-500" : "border-gray-200"}`}
      />
    </div>
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default Input;

