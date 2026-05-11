import { ACTIVE_ORDER_STATUSES, CLOSED_ORDER_STATUSES } from "./config.js";
import { createId, nowIso, toRoleLabel } from "./utils/common.js";
import { createSupabaseStateStore } from "./supabaseState.js";

const createInitialState = () => ({
  users: [],
  orders: [],
  categories: [],
  serviceAreas: [],
  demoAccounts: [],
  statusColors: {},
  reports: [],
  notifications: [],
  chats: [],
  reviews: [],
  portfolioItems: [],
  availability: [],
});

const createAppDependencies = async () => {
  const initialState = createInitialState();
  const store = createSupabaseStateStore({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    initialState,
  });
  let state = { ...initialState };
  let supabaseEnabled = store.enabled;
  try {
    state = await store.loadState();
  } catch (error) {
    supabaseEnabled = false;
    console.warn(`[Supabase] ${error.message}`);
    console.warn("[Supabase] Fallback ke state kosong. Jalankan SQL backend/supabase/app_state.sql lalu restart backend.");
  }

  const persist = async (...keys) => {
    if (!supabaseEnabled) return;
    for (const key of keys) {
      await store.saveKey(key, state[key]);
    }
  };

  const createNotification = (userId, message, type = "info") => {
    const notification = {
      id: createId(),
      userId,
      message,
      type,
      read: false,
      createdAt: nowIso(),
    };
    state.notifications.push(notification);
    return notification;
  };

  const clearChatsByOrder = (orderId) => {
    for (let i = state.chats.length - 1; i >= 0; i -= 1) {
      if (state.chats[i].orderId === orderId) state.chats.splice(i, 1);
    }
  };

  const findActiveOrderForChat = ({ senderId, receiverId, orderId }) => {
    if (orderId !== undefined && orderId !== null) {
      const matched = state.orders.find(
        (order) =>
          order.id === Number(orderId) &&
          ACTIVE_ORDER_STATUSES.has(order.status) &&
          ((order.customerId === senderId && order.providerId === receiverId) ||
            (order.customerId === receiverId && order.providerId === senderId)),
      );
      return matched || null;
    }

    return (
      [...state.orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .find(
          (order) =>
            ACTIVE_ORDER_STATUSES.has(order.status) &&
            ((order.customerId === senderId && order.providerId === receiverId) ||
              (order.customerId === receiverId && order.providerId === senderId)),
        ) || null
    );
  };

  return {
    state,
    persist,
    supabaseEnabled,
    nowIso,
    createId,
    toRoleLabel,
    CLOSED_ORDER_STATUSES,
    createNotification,
    clearChatsByOrder,
    findActiveOrderForChat,
  };
};

export { createAppDependencies };
