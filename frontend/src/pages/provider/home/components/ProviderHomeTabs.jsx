import AppIcon from "../../../../components/AppIcon";

const PROVIDER_HOME_TABS = [
  { id: "dashboard", label: "Dashboard", icon: "layoutGrid" },
  { id: "analytics", label: "Analytics", icon: "trendingUp" },
  { id: "reviews", label: "Reviews", icon: "star" },
  { id: "portfolio", label: "Portfolio", icon: "image" },
  { id: "availability", label: "Jadwal", icon: "calendar" },
];

const ProviderHomeTabs = ({ activeTab, onChangeTab }) => (
  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
    {PROVIDER_HOME_TABS.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChangeTab(tab.id)}
        className={`px-4 py-2 rounded-lg whitespace-nowrap text-xs font-semibold flex items-center gap-2 transition-all ${
          activeTab === tab.id
            ? "bg-sky-600 text-white"
            : "bg-white border border-gray-100 text-gray-700 hover:border-sky-200"
        }`}
      >
        <AppIcon name={tab.icon} size={14} />
        {tab.label}
      </button>
    ))}
  </div>
);

export default ProviderHomeTabs;
