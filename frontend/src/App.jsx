import { AppProvider, useApp } from "./context/AppContext";
import MainLayout from "./layouts/MainLayout";

// Pages
import Login from "./pages/auth/Login";
import Home from "./pages/customer/Home";
import ProviderHome from "./pages/provider/home/ProviderHome";
import Search from "./pages/customer/search/Search";
import DetailJasa from "./pages/customer/DetailJasa";
import Orders from "./pages/shared/Orders";
import Jobs from "./pages/provider/Jobs";
import Chat from "./pages/shared/Chat";
import Profile from "./pages/shared/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";

// Global styles
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: radial-gradient(circle at top, #e0f2fe 0%, #f8fafc 38%, #f1f5f9 100%); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  h1,h2,h3,h4,h5 { font-family: 'Syne', sans-serif; }
`;

const Router = () => {
  const { currentUser, screen } = useApp();

  if (!currentUser) return <Login />;

  const role = currentUser.role;

  const screenMap = {
    home: role === "admin"
      ? <AdminDashboard />
      : role === "penyedia"
      ? <ProviderHome />
      : <Home />,
    search: <Search />,
    "provider-detail": <DetailJasa />,
    orders: <Orders />,
    jobs: <Jobs />,
    chat: <Chat />,
    profile: <Profile />,
    // Admin routes
    "admin-users": <AdminUsers />,
    "admin-orders": <AdminOrders />,
    "admin-reports": <AdminReports />,
  };

  return screenMap[screen] || <Home />;
};

const AppContent = () => {
  const { isBootstrapping, isBackendReady, backendError, retryBootstrap } = useApp();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <p className="text-sm text-slate-500">Menghubungkan ke backend...</p>
        </div>
      </div>
    );
  }

  if (!isBackendReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold text-slate-800">Backend Tidak Aktif</h1>
          <p className="text-sm text-slate-500 mt-2">
            Data tidak bisa diakses karena server backend belum berjalan.
            {backendError ? ` (${backendError})` : ""}
          </p>
          <button
            type="button"
            onClick={retryBootstrap}
            className="mt-4 h-10 px-4 rounded-lg bg-sky-600 text-white border-none cursor-pointer text-sm font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <Router />
    </MainLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <style>{globalStyles}</style>
      <AppContent />
    </AppProvider>
  );
}
