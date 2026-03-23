import { useApp } from "../context/AppContext";

/**
 * Hook untuk mengakses info autentikasi dan aksi login/logout
 */
export const useAuth = () => {
  const { currentUser, login, logout, addUser } = useApp();

  const isAdmin = currentUser?.role === "admin";
  const isPenyedia = currentUser?.role === "penyedia";
  const isPencari = currentUser?.role === "pencari";
  const isLoggedIn = !!currentUser;

  return {
    currentUser,
    isAdmin,
    isPenyedia,
    isPencari,
    isLoggedIn,
    login,
    logout,
    addUser,
  };
};
