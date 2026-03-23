import { createAnalyticsController } from "../controllers/analyticsController.js";

const registerAnalyticsRoutes = (app, deps) => {
  const controller = createAnalyticsController(deps);

  return app
    .get("/analytics/admin-stats", controller.getAdminStats)
    .get("/analytics/monthly-revenue", controller.getMonthlyRevenue)
    .get("/analytics/top-providers", controller.getTopProviders)
    .get("/analytics/provider/:id", controller.getProviderAnalytics)
    .get("/analytics/provider/:id/reviews", controller.getProviderReviews)
    .get("/analytics/provider/:id/portfolio", controller.getProviderPortfolio)
    .get("/analytics/provider/:id/availability", controller.getProviderAvailability)
    .get("/analytics/service-distribution", controller.getServiceDistribution)
    .get("/analytics/category-performance", controller.getCategoryPerformance)
    .get("/analytics/user-growth", controller.getUserGrowth);
};

export { registerAnalyticsRoutes };
