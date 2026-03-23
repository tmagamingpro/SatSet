const createSystemService = (deps) => {
  const { state, nowIso } = deps;

  const getHealth = () => ({
    ok: true,
    timestamp: nowIso(),
  });

  const getBootstrap = () => ({
    users: state.users,
    orders: state.orders,
    categories: state.categories,
    serviceAreas: state.serviceAreas,
    demoAccounts: state.demoAccounts,
    statusColors: state.statusColors,
    reports: state.reports,
    notifications: state.notifications,
    chats: state.chats,
  });

  return {
    getHealth,
    getBootstrap,
  };
};

export { createSystemService };
