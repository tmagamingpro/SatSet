const createAnalyticsService = (deps) => {
  const { state } = deps;

  // Get dashboard statistics for admin
  const getAdminStats = () => {
    const stats = {
      totalUsers: state.users.length - 1, // exclude admin
      totalProviders: state.users.filter(u => u.role === "penyedia").length,
      verifiedProviders: state.users.filter(u => u.role === "penyedia" && u.isVerified).length,
      totalCustomers: state.users.filter(u => u.role === "pencari").length,
      totalOrders: state.orders.length,
      completedOrders: state.orders.filter(o => o.status === "selesai").length,
      activeOrders: state.orders.filter(o => o.status === "berlangsung").length,
      pendingOrders: state.orders.filter(o => o.status === "menunggu").length,
      cancelledOrders: state.orders.filter(o => o.status === "dibatalkan" || o.status === "ditolak").length,
      totalRevenue: state.orders.filter(o => o.status === "selesai").reduce((sum, o) => sum + (o.price || 0), 0),
      averageOrderValue: state.orders.length > 0 ? state.orders.reduce((sum, o) => sum + (o.price || 0), 0) / state.orders.length : 0,
    };

    return { status: 200, body: stats };
  };

  // Get monthly revenue data for charts
  const getMonthlyRevenue = () => {
    const monthlyData = {};
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    // Initialize all months
    months.forEach(month => {
      monthlyData[month] = 0;
    });

    // Aggregate revenue by month
    state.orders
      .filter(o => o.status === "selesai" && o.completedAt)
      .forEach(order => {
        const date = new Date(order.completedAt);
        const monthName = months[date.getMonth()];
        monthlyData[monthName] += order.price || 0;
      });

    return { status: 200, body: monthlyData };
  };

  // Get provider performance ranking
  const getTopProviders = (limit = 10) => {
    const providers = state.users
      .filter(u => u.role === "penyedia")
      .map(provider => {
        const metrics = state.userMetrics.find(m => m.providerId === provider.id) || {};
        return {
          ...provider,
          ...metrics,
        };
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);

    return { status: 200, body: providers };
  };

  // Get provider by ID with full analytics
  const getProviderAnalytics = (providerId) => {
    const id = Number(providerId);
    const provider = state.users.find(u => u.id === id && u.role === "penyedia");

    if (!provider) {
      return { status: 404, body: { message: "Penyedia tidak ditemukan." } };
    }

    const metrics = state.userMetrics.find(m => m.providerId === id) || {
      providerId: id,
      responseTime: 0,
      acceptanceRate: 0,
      completionRate: 0,
      totalReviews: 0,
      profileCompletion: 0,
      certifications: [],
    };

    const providerOrders = state.orders.filter(o => o.providerId === id);
    const completedOrders = providerOrders.filter(o => o.status === "selesai");
    const providerReviews = state.reviews.filter(r => r.providerId === id);

    const analytics = {
      provider,
      metrics,
      stats: {
        totalOrders: providerOrders.length,
        completedOrders: completedOrders.length,
        activeOrders: providerOrders.filter(o => o.status === "berlangsung").length,
        pendingOrders: providerOrders.filter(o => o.status === "menunggu").length,
        cancelledOrders: providerOrders.filter(o => o.status === "dibatalkan" || o.status === "ditolak").length,
        totalEarnings: completedOrders.reduce((sum, o) => sum + (o.price || 0), 0),
        averageOrderValue: providerOrders.length > 0 ? providerOrders.reduce((sum, o) => sum + (o.price || 0), 0) / providerOrders.length : 0,
        totalReviews: providerReviews.length,
        averageRating: providerReviews.length > 0 ? (providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length).toFixed(1) : 0,
      },
      recentOrders: providerOrders.slice(-5).reverse(),
      reviews: providerReviews.slice(-10).reverse(),
    };

    return { status: 200, body: analytics };
  };

  // Get reviews for a provider
  const getProviderReviews = (providerId) => {
    const id = Number(providerId);
    const reviews = state.reviews
      .filter(r => r.providerId === id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { status: 200, body: reviews };
  };

  // Get portfolio items for a provider
  const getProviderPortfolio = (providerId) => {
    const id = Number(providerId);
    const portfolio = state.portfolioItems
      .filter(p => p.providerId === id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { status: 200, body: portfolio };
  };

  // Get availability for a provider
  const getProviderAvailability = (providerId) => {
    const id = Number(providerId);
    const availability = state.availability.find(a => a.providerId === id);

    if (!availability) {
      return { status: 404, body: { message: "Jadwal tidak ditemukan." } };
    }

    return { status: 200, body: availability };
  };

  // Get geographic data for heat map
  const getServiceDistribution = () => {
    const distribution = {};

    state.orders.forEach(order => {
      const provider = state.users.find(u => u.id === order.providerId);
      if (provider && provider.lat && provider.lng) {
        const key = `${provider.lat},${provider.lng}`;
        distribution[key] = (distribution[key] || 0) + 1;
      }
    });

    const points = Object.entries(distribution).map(([coords, count]) => {
      const [lat, lng] = coords.split(',');
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        count,
      };
    });

    return { status: 200, body: points };
  };

  // Get category performance
  const getCategoryPerformance = () => {
    const categoryStats = {};

    state.categories.forEach(category => {
      categoryStats[category.name] = {
        ...category,
        orders: 0,
        revenue: 0,
        completed: 0,
      };
    });

    state.orders.forEach(order => {
      if (categoryStats[order.service]) {
        categoryStats[order.service].orders += 1;
        if (order.status === "selesai") {
          categoryStats[order.service].completed += 1;
          categoryStats[order.service].revenue += order.price || 0;
        }
      }
    });

    return { status: 200, body: Object.values(categoryStats) };
  };

  // Get user growth over time
  const getUserGrowth = () => {
    const growth = {};

    state.users.forEach(user => {
      if (user.role === "admin") return;

      const date = user.createdAt.split('T')[0];
      if (!growth[date]) {
        growth[date] = { pencari: 0, penyedia: 0 };
      }
      growth[date][user.role] += 1;
    });

    return { status: 200, body: Object.entries(growth).map(([date, counts]) => ({ date, ...counts })) };
  };

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

export { createAnalyticsService };
