import { createAnalyticsService } from "../services/analyticsService.js";

const createAnalyticsController = (deps) => {
  const service = createAnalyticsService(deps);

  const getAdminStats = () => service.getAdminStats();
  const getMonthlyRevenue = () => service.getMonthlyRevenue();
  const getTopProviders = ({ query }) => service.getTopProviders(Number(query?.limit) || 10);
  const getProviderAnalytics = ({ params }) => service.getProviderAnalytics(params.id);
  const getProviderReviews = ({ params }) => service.getProviderReviews(params.id);
  const getProviderPortfolio = ({ params }) => service.getProviderPortfolio(params.id);
  const getProviderAvailability = ({ params }) => service.getProviderAvailability(params.id);
  const getServiceDistribution = () => service.getServiceDistribution();
  const getCategoryPerformance = () => service.getCategoryPerformance();
  const getUserGrowth = () => service.getUserGrowth();

  return {
    getAdminStats,
    getMonthlyRevenue,
    getTopProviders,
    getProviderAnalytics,
    getProviderReviews,
    getProviderPortfolio,
    getProviderAvailability,
    getServiceDistribution,
    getCategoryPerformance,
    getUserGrowth,
  };
};

export { createAnalyticsController };
