import { createContext, useContext, useState } from "react";
import { INITIAL_USERS, INITIAL_ORDERS } from "../utils/constants";

export const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState("login");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [toast, setToast] = useState(null);
  const [hideNavbar, setHideNavbar] = useState(false);

  const login = (user) => {
    if (user?.role === "penyedia") {
      const existingStatuses = new Set(
        orders.filter((order) => order.providerId === user.id).map((order) => order.status),
      );
      const requiredStatuses = ["menunggu", "berlangsung", "selesai"];
      const missingStatuses = requiredStatuses.filter((status) => !existingStatuses.has(status));

      if (missingStatuses.length > 0) {
        const fallbackCustomerId = users.find((u) => u.role === "pencari")?.id || 1;
        const now = Date.now();
        const sampleMap = {
          menunggu: {
            service: user.skills?.[0] || "Layanan Umum",
            description: "Contoh order baru yang menunggu respons penyedia jasa.",
            location: "Jl. Contoh No. 10",
            price: 180000,
            createdAt: "2026-03-20",
          },
          berlangsung: {
            service: user.skills?.[1] || user.skills?.[0] || "Layanan Harian",
            description: "Contoh order yang sedang dikerjakan penyedia jasa.",
            location: "Jl. Anggrek No. 22",
            price: 260000,
            createdAt: "2026-03-18",
          },
          selesai: {
            service: user.skills?.[0] || "Layanan Prioritas",
            description: "Contoh order yang sudah selesai dan siap masuk riwayat.",
            location: "Jl. Rajawali No. 8",
            price: 320000,
            createdAt: "2026-03-14",
            completedAt: "2026-03-15",
          },
        };

        const injectedOrders = missingStatuses.map((status, index) => ({
          id: now + index + 1,
          customerId: fallbackCustomerId,
          providerId: user.id,
          status,
          ...sampleMap[status],
        }));
        setOrders((prev) => [...prev, ...injectedOrders]);
      }
    }

    setCurrentUser(user);
    setScreen("home");
    setHideNavbar(false);
  };
  const logout = () => { setCurrentUser(null); setScreen("login"); setHideNavbar(false); };
  const showToast = (message, type = "success") => setToast({ message, type });
  const addNotification = (userId, message, type = "info") => {
    setNotifications((prev) => [...prev, { id: Date.now() + Math.random(), userId, message, type, read: false }]);
  };
  const markNotificationsAsRead = (userId) => {
    setNotifications((prev) => prev.map((n) => (n.userId === userId ? { ...n, read: true } : n)));
  };

  const addUser = (data) => {
    if (users.find(u => u.email === data.email)) return false;
    const isProvider = data.role === "penyedia";
    const newUser = {
      id: Date.now(), ...data,
      avatar: data.name.slice(0, 2).toUpperCase(),
      isVerified: data.role === "pencari",
      isActive: isProvider,
      officeLocation: isProvider ? data.officeLocation : "",
      experience: isProvider ? data.experience || "" : "",
      lat: isProvider ? data.lat : null,
      lng: isProvider ? data.lng : null,
      skills: [], rating: 0, totalJobs: 0,
      createdAt: new Date().toISOString(),
    };
    setUsers(p => [...p, newUser]);
    return true;
  };

  const updateUser = (id, data) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser?.id === id) setCurrentUser(u => ({ ...u, ...data }));
  };

  const deleteUser = (id) => {
    setUsers(p => p.filter(u => u.id !== id));
  };

  const addOrder = (data) => {
    const order = { id: Date.now(), ...data, status: "menunggu", createdAt: new Date().toISOString() };
    setOrders(p => [...p, order]);
    addNotification(data.providerId, "Ada permintaan jasa baru!", "new_request");
  };

  const updateOrder = (id, data) => {
    const previousOrder = orders.find((o) => o.id === id);
    if (!previousOrder) return;

    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...data } : o)));

    const isNowCompleted = data.status === "selesai" && previousOrder.status !== "selesai";
    if (isNowCompleted && data.completedBy === "provider") {
      addNotification(
        previousOrder.customerId,
        `Pekerjaan "${previousOrder.service}" dinyatakan selesai oleh penyedia jasa.`,
        "job_completed",
      );
      return;
    }

    if (isNowCompleted && data.completedBy === "customer") {
      addNotification(
        previousOrder.providerId,
        `Pekerjaan "${previousOrder.service}" telah dikonfirmasi selesai oleh pencari jasa.`,
        "job_completed",
      );
      return;
    }

    const isRejectedByProvider =
      (data.status === "ditolak" || data.status === "dibatalkan") &&
      previousOrder.status !== data.status &&
      data.cancelledBy === "provider";
    if (isRejectedByProvider) {
      const reasonText = data.cancellationReason ? ` Alasan: ${data.cancellationReason}` : "";
      addNotification(
        previousOrder.customerId,
        `Pesanan "${previousOrder.service}" dibatalkan oleh penyedia jasa.${reasonText}`,
        "job_cancelled",
      );
      return;
    }

    const isCancelledByCustomer =
      data.status === "dibatalkan" &&
      previousOrder.status !== "dibatalkan" &&
      data.cancelledBy === "customer";
    if (isCancelledByCustomer) {
      const reasonText = data.cancellationReason ? ` Alasan: ${data.cancellationReason}` : "";
      addNotification(
        previousOrder.providerId,
        `Pesanan "${previousOrder.service}" dibatalkan oleh pencari jasa.${reasonText}`,
        "job_cancelled",
      );
    }
  };

  const addChat = (data) => setChats(p => [...p, { id: Date.now(), ...data, createdAt: new Date().toISOString() }]);

  const ctx = {
    users, orders, chats, notifications, currentUser,
    screen, setScreen, selectedProvider, setSelectedProvider,
    hideNavbar, setHideNavbar,
    toast, setToast,
    login, logout, showToast,
    addNotification, markNotificationsAsRead,
    addUser, updateUser, deleteUser,
    addOrder, updateOrder, addChat,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};
