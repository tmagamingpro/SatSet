import { useState } from "react";
import { useApp } from "../../context/AppContext";
import ProviderHomeHeader from "./components/ProviderHomeHeader";
import ProviderHomeTabs from "./components/ProviderHomeTabs";
import DashboardTab from "./components/DashboardTab";
import AnalyticsTab from "./components/AnalyticsTab";
import ReviewsTab from "./components/ReviewsTab";
import PortfolioTab from "./components/PortfolioTab";
import AvailabilityTab from "./components/AvailabilityTab";

const ProviderHome = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editScheduleMode, setEditScheduleMode] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState(null);
  const { currentUser, orders, reviews, userMetrics, portfolioItems, availability, updateUser, showToast, setScreen } = useApp();

  const myJobs = orders.filter((o) => o.providerId === currentUser?.id);
  const myReviews = reviews.filter((r) => r.providerId === currentUser?.id);
  const myMetrics = userMetrics.find((m) => m.providerId === currentUser?.id) || {};
  const myPortfolio = portfolioItems.filter((p) => p.providerId === currentUser?.id);
  const myAvailability = availability.find((a) => a.providerId === currentUser?.id);

  const recentRequests = [...myJobs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const stats = {
    pending: myJobs.filter((o) => o.status === "menunggu").length,
    active: myJobs.filter((o) => o.status === "berlangsung").length,
    done: myJobs.filter((o) => o.status === "selesai").length,
    cancelled: myJobs.filter((o) => o.status === "dibatalkan" || o.status === "ditolak").length,
  };

  const income = {
    total: myJobs.filter((o) => o.status === "selesai").reduce((sum, order) => sum + (order.price || 0), 0),
    month: myJobs
      .filter((o) => o.status === "selesai" && new Date(o.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, order) => sum + (order.price || 0), 0),
    avgPerJob: myJobs.length > 0 ? myJobs.reduce((sum, order) => sum + (order.price || 0), 0) / myJobs.length : 0,
  };

  const isActiveNow = currentUser?.isActive !== false;
  const avgRating =
    myReviews.length > 0
      ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
      : currentUser?.rating || 0;

  const serviceBreakdown = {};
  myJobs.forEach((job) => {
    serviceBreakdown[job.service] = (serviceBreakdown[job.service] || 0) + 1;
  });

  return (
    <div className="pb-20">
      <ProviderHomeHeader
        currentUser={currentUser}
        isActiveNow={isActiveNow}
        avgRating={avgRating}
        myReviewsCount={myReviews.length}
        onToggleActive={() => {
          updateUser(currentUser.id, { isActive: !isActiveNow });
          showToast(!isActiveNow ? "Status diubah ke aktif." : "Status diubah ke offline.", "success");
        }}
      />

      <div className="px-5 -mt-5">
        <ProviderHomeTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {activeTab === "dashboard" && (
          <DashboardTab
            income={income}
            stats={stats}
            myJobsCount={myJobs.length}
            myMetrics={myMetrics}
            currentUser={currentUser}
            recentRequests={recentRequests}
            onGoToScreen={setScreen}
          />
        )}

        {activeTab === "analytics" && (
          <AnalyticsTab
            myMetrics={myMetrics}
            myJobs={myJobs}
            myReviews={myReviews}
            serviceBreakdown={serviceBreakdown}
            income={income}
          />
        )}

        {activeTab === "reviews" && <ReviewsTab avgRating={avgRating} myReviews={myReviews} />}

        {activeTab === "portfolio" && (
          <PortfolioTab myPortfolio={myPortfolio} onGoToProfile={() => setScreen("profile")} />
        )}

        {activeTab === "availability" && (
          <AvailabilityTab
            myAvailability={myAvailability}
            editScheduleMode={editScheduleMode}
            editedSchedule={editedSchedule}
            setEditedSchedule={setEditedSchedule}
            setEditScheduleMode={setEditScheduleMode}
            onSaveSchedule={() => {
              updateUser(currentUser.id, { schedule: editedSchedule });
              setEditScheduleMode(false);
              showToast("Jadwal berhasil diperbarui", "success");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderHome;
