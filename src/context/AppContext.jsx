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

  const login = (user) => { setCurrentUser(user); setScreen("home"); setHideNavbar(false); };
  const logout = () => { setCurrentUser(null); setScreen("login"); setHideNavbar(false); };
  const showToast = (message, type = "success") => setToast({ message, type });

  const addUser = (data) => {
    if (users.find(u => u.email === data.email)) return false;
    const isProvider = data.role === "penyedia";
    const newUser = {
      id: Date.now(), ...data,
      avatar: data.name.slice(0, 2).toUpperCase(),
      isVerified: data.role === "pencari",
      isActive: isProvider,
      officeLocation: isProvider ? data.officeLocation : "",
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
    setNotifications(n => [...n, { id: Date.now(), userId: data.providerId, message: "Ada permintaan jasa baru!", read: false }]);
  };

  const updateOrder = (id, data) => setOrders(p => p.map(o => o.id === id ? { ...o, ...data } : o));

  const addChat = (data) => setChats(p => [...p, { id: Date.now(), ...data, createdAt: new Date().toISOString() }]);

  const ctx = {
    users, orders, chats, notifications, currentUser,
    screen, setScreen, selectedProvider, setSelectedProvider,
    hideNavbar, setHideNavbar,
    toast, setToast,
    login, logout, showToast,
    addUser, updateUser, deleteUser,
    addOrder, updateOrder, addChat,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};
