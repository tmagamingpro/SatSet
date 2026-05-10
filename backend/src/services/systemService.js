import { BaseService } from "./baseService.js";

class SystemService extends BaseService {
  getHealth() {
    return {
      ok: true,
      timestamp: this.nowIso(),
    };
  }

  getBootstrap() {
    return {
      users: this.state.users,
      orders: this.state.orders,
      categories: this.state.categories,
      serviceAreas: this.state.serviceAreas,
      demoAccounts: this.state.demoAccounts,
      statusColors: this.state.statusColors,
      reports: this.state.reports,
      notifications: this.state.notifications,
      chats: this.state.chats,
      reviews: this.state.reviews,
      portfolioItems: this.state.portfolioItems,
      availability: this.state.availability,
    };
  }
}

const createSystemService = (deps) => new SystemService(deps);

export { createSystemService };
