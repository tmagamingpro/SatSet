import Navbar from "./Navbar";
import Toast from "../components/Toast";
import { useApp } from "../context/AppContext";

const MainLayout = ({ children }) => {
  const { currentUser, hideNavbar, toast, setToast } = useApp();
  const showNavbar = currentUser && !hideNavbar;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#e0f2fe_0%,#f8fafc_38%,#f1f5f9_100%)]">
      <div className="w-full max-w-[430px] md:max-w-none mx-auto min-h-screen bg-transparent relative overflow-hidden">
        {children}
        {showNavbar && <Navbar />}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MainLayout;
