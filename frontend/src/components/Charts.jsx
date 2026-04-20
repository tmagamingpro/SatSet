// Simple Line Chart Component
export const LineChart = ({ data, label, color = "#0284C7", height = 150 }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-400">Tidak ada data</div>;
  }

  const values = Object.values(data);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  // Create SVG points for line chart
  const width = 300;
  const points = values
    .map((val, idx) => {
      const x = (idx / (values.length - 1 || 1)) * width;
      const y = height - ((val - minValue) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full">
      <div className="mb-2">
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <svg width={width} height={height} className="w-full border border-gray-100 rounded">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line
            key={i}
            x1="0"
            y1={height * (1 - pct)}
            x2={width}
            y2={height * (1 - pct)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        {/* Line */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
        {/* Points */}
        {values.map((_, idx) => {
          const x = (idx / (values.length - 1 || 1)) * width;
          const y = height - ((values[idx] - minValue) / range) * height;
          return <circle key={idx} cx={x} cy={y} r="3" fill={color} />;
        })}
      </svg>
    </div>
  );
};

// Simple Bar Chart
export const BarChart = ({ data, label, color = "#0284C7", height = 200 }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-400">Tidak ada data</div>;
  }

  const maxValue = Math.max(...Object.values(data));
  const barWidth = 100 / Object.keys(data).length;

  return (
    <div className="w-full">
      <div className="mb-2">
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <div className="flex items-end justify-around gap-1" style={{ height: `${height}px` }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center flex-1 gap-1">
            <div
              className="w-full rounded-t"
              style={{
                height: `${(value / maxValue) * height}px`,
                backgroundColor: color,
              }}
              title={`${key}: ${value}`}
            />
            <p className="text-[10px] text-gray-500 text-center truncate w-full">{key}</p>
            <p className="text-[11px] font-bold text-gray-700">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut/Pie Chart
export const DonutChart = ({ data, label, colors, height = 200 }) => {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center py-8 text-gray-400">Tidak ada data</div>;
  }

  const total = Object.values(data).reduce((sum, v) => sum + v, 0);
  const entries = Object.entries(data);
  let currentAngle = 0;

  const slices = entries.map(([name, value], idx) => {
    const sliceAngle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathData = `
      M 50 50
      L ${x1} ${y1}
      A 40 40 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;

    currentAngle = endAngle;

    return (
      <path
        key={name}
        d={pathData}
        fill={colors?.[idx] || `hsl(${(idx * 360) / entries.length}, 70%, 60%)`}
      />
    );
  });

  return (
    <div className="w-full">
      <div className="mb-2">
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <div className="flex gap-4 items-center">
        <svg width={height} height={height} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="50" fill="#f9fafb" />
          {slices}
          <circle cx="50" cy="50" r="25" fill="white" />
        </svg>
        <div className="flex flex-col gap-2 flex-1">
          {entries.map(([name, value], idx) => (
            <div key={name} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: colors?.[idx] || `hsl(${(idx * 360) / entries.length}, 70%, 60%)`,
                }}
              />
              <span className="text-gray-600">{name}</span>
              <span className="font-bold text-gray-800 ml-auto">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Progress Ring
export const ProgressRing = ({ value, max = 100, size = 120, label, color = "#0284C7" }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;
  const percentage = ((value / max) * 100).toFixed(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.35s" }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="text-lg font-bold" style={{ color }}>
            {percentage}%
          </span>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 text-center">{label}</p>
    </div>
  );
};

// Simple Stat Box
export const StatBox = ({ label, value, color = "#0284C7", icon, trend }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs period lalu
            </p>
          )}
        </div>
        {icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
