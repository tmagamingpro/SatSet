import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiService } from "../services/api";

export const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [statusColors, setStatusColors] = useState({});
  const [reports, setReports] = useState([]);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState("login");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [toast, setToast] = useState(null);
  const [hideNavbar, setHideNavbar] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [backendError, setBackendError] = useState("");

  const applyBootstrapData = useCallback((data) => {
    setUsers(Array.isArray(data?.users) ? data.users : []);
    setOrders(Array.isArray(data?.orders) ? data.orders : []);
    setCategories(Array.isArray(data?.categories) ? data.categories : []);
    setServiceAreas(Array.isArray(data?.serviceAreas) ? data.serviceAreas : []);
    setDemoAccounts(Array.isArray(data?.demoAccounts) ? data.demoAccounts : []);
    setStatusColors(data?.statusColors && typeof data.statusColors === "object" ? data.statusColors : {});
    setReports(Array.isArray(data?.reports) ? data.reports : []);
    setChats(Array.isArray(data?.chats) ? data.chats : []);
    setNotifications(Array.isArray(data?.notifications) ? data.notifications : []);
  }, []);

  const bootstrap = useCallback(async () => {
    setIsBootstrapping(true);
    setBackendError("");

    try {
      const data = await apiService.getBootstrap();
      applyBootstrapData(data);
      setIsBackendReady(true);
    } catch (error) {
      applyBootstrapData({});
      setCurrentUser(null);
      setIsBackendReady(false);
      setBackendError(error?.message || "Backend tidak tersedia.");
    } finally {
      setIsBootstrapping(false);
    }
  }, [applyBootstrapData]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const refreshData = useCallback(async () => {
    const data = await apiService.getBootstrap();
    applyBootstrapData(data);
  }, [applyBootstrapData]);

  const login = async ({ email, password }) => {
    if (!isBackendReady) throw new Error("Backend tidak aktif.");
    const response = await apiService.login(email, password);
    const user = response?.user;
    if (!user) throw new Error("Data user tidak valid.");
    setCurrentUser(user);
    setScreen("home");
    setHideNavbar(false);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    setScreen("login");
    setHideNavbar(false);
  };

  const showToast = (message, type = "success") => setToast({ message, type });

  const addNotification = async (userId, message, type = "info") => {
    if (!isBackendReady) return;
    try {
      await apiService.addNotification({ userId, message, type });
      await refreshData();
    } catch (error) {
      showToast(error?.message || "Gagal menambah notifikasi.", "error");
    }
  };

  const markNotificationsAsRead = async (userId) => {
    if (!isBackendReady) return;
    try {
      await apiService.markNotificationsRead(userId);
      setNotifications((prev) => prev.map((item) => (item.userId === userId ? { ...item, read: true } : item)));
    } catch (error) {
      showToast(error?.message || "Gagal menandai notifikasi terbaca.", "error");
    }
  };

  const addUser = async (data) => {
    if (!isBackendReady) return false;
    try {
      const response = await apiService.registerUser(data);
      const createdUser = response?.user;
      if (!createdUser) return false;
      setUsers((prev) => [...prev, createdUser]);
      return true;
    } catch (error) {
      if ((error?.message || "").toLowerCase().includes("email")) return false;
      showToast(error?.message || "Gagal membuat akun.", "error");
      return false;
    }
  };

  const updateUser = async (id, data) => {
    if (!isBackendReady) return;
    try {
      const response = await apiService.updateUser(id, data);
      const updatedUser = response?.user;
      if (!updatedUser) return;
      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
      if (currentUser?.id === id) setCurrentUser(updatedUser);
    } catch (error) {
      showToast(error?.message || "Gagal memperbarui user.", "error");
    }
  };

  const deleteUser = async (id) => {
    if (!isBackendReady) return;
    try {
      await apiService.deleteUser(id);
      await refreshData();
      if (currentUser?.id === id) logout();
    } catch (error) {
      showToast(error?.message || "Gagal menghapus user.", "error");
    }
  };

  const addOrder = async (data) => {
    if (!isBackendReady) return;
    try {
      const response = await apiService.addOrder(data);
      const createdOrder = response?.order;
      if (!createdOrder) return;
      setOrders((prev) => [...prev, createdOrder]);
      await refreshData();
    } catch (error) {
      showToast(error?.message || "Gagal mengirim order ke server.", "error");
    }
  };

  const updateOrder = async (id, data) => {
    if (!isBackendReady) return;
    try {
      const response = await apiService.updateOrder(id, data);
      const updatedOrder = response?.order;
      if (!updatedOrder) return;
      setOrders((prev) => prev.map((order) => (order.id === id ? updatedOrder : order)));
      await refreshData();
    } catch (error) {
      showToast(error?.message || "Gagal sinkronisasi status order ke server.", "error");
    }
  };

  const addChat = async (data) => {
    if (!isBackendReady) return false;
    try {
      const response = await apiService.addChat(data);
      const chat = response?.chat;
      if (!chat) return false;
      setChats((prev) => [...prev, chat]);
      return true;
    } catch (error) {
      showToast(error?.message || "Gagal mengirim chat.", "error");
      return false;
    }
  };

  const addReport = async (payload) => {
    if (!isBackendReady) return false;
    try {
      const response = await apiService.addReport(payload);
      const report = response?.report;
      if (!report) return false;
      setReports((prev) => [report, ...prev]);
      return true;
    } catch (error) {
      showToast(error?.message || "Gagal mengirim laporan.", "error");
      return false;
    }
  };

  const updateReport = async (id, payload) => {
    if (!isBackendReady) return false;
    try {
      const response = await apiService.updateReport(id, payload);
      const updatedReport = response?.report;
      if (!updatedReport) return false;
      setReports((prev) => prev.map((report) => (report.id === id ? updatedReport : report)));
      return true;
    } catch (error) {
      showToast(error?.message || "Gagal memperbarui laporan.", "error");
      return false;
    }
  };

  const ctx = {
    users,
    orders,
    categories,
    serviceAreas,
    demoAccounts,
    statusColors,
    reports,
    chats,
    notifications,
    currentUser,
    screen,
    setScreen,
    selectedProvider,
    setSelectedProvider,
    hideNavbar,
    setHideNavbar,
    toast,
    setToast,
    isBootstrapping,
    isBackendReady,
    backendError,
    retryBootstrap: bootstrap,
    login,
    logout,
    showToast,
    addNotification,
    markNotificationsAsRead,
    addUser,
    updateUser,
    deleteUser,
    addOrder,
    updateOrder,
    addChat,
    addReport,
    updateReport,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};
