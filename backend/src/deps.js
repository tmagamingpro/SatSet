import {
  categories,
  chats,
  demoAccounts,
  notifications,
  orders,
  reports,
  serviceAreas,
  statusColors,
  users,
  reviews,
  portfolioItems,
  availability,
} from "./data.js";
import { ACTIVE_ORDER_STATUSES, CLOSED_ORDER_STATUSES } from "./config.js";
import { createId, nowIso, toRoleLabel } from "./utils/common.js";

const createAppDependencies = () => {
  const state = {
    users,
    orders,
    categories,
    serviceAreas,
    demoAccounts,
    statusColors,
    reports,
    notifications,
    chats,
    reviews,
    portfolioItems,
    availability,
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
