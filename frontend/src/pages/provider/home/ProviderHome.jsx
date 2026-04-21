import { useState } from "react";
import { useApp } from "../../../context/AppContext";
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
  const { currentUser, orders, reviews, portfolioItems, availability, updateUser, showToast, setScreen, addPortfolioItem } = useApp();

  const myJobs = orders.filter((o) => o.providerId === currentUser?.id);
  const myReviews = reviews.filter((r) => r.providerId === currentUser?.id);
  const myPortfolio = portfolioItems
    .filter((p) => p.providerId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
  const myJobsCount = myJobs.length;
  const acceptedCount = myJobs.filter((o) => o.status !== "ditolak").length;
  const averageRatingRaw =
    myReviews.length > 0
      ? myReviews.reduce((sum, review) => sum + review.rating, 0) / myReviews.length
      : Number(currentUser?.rating || 0);
  const profileFields = [
    currentUser?.name,
    currentUser?.email,
    currentUser?.phone,
    currentUser?.address,
    currentUser?.officeLocation,
    currentUser?.experience,
    (currentUser?.skills || []).length > 0,
    myPortfolio.length > 0,
    Boolean(myAvailability?.schedule),
  ];
  const profileCompletion = Math.round(
    (profileFields.filter((value) => (typeof value === "boolean" ? value : Boolean(value))).length / profileFields.length) *
      100,
  );
  const myMetrics = {
    acceptanceRate: myJobsCount > 0 ? Math.round((acceptedCount / myJobsCount) * 100) : 0,
    completionRate: myJobsCount > 0 ? Math.round((stats.done / myJobsCount) * 100) : 0,
    activeRate: myJobsCount > 0 ? Math.round((stats.active / myJobsCount) * 100) : 0,
    cancellationRate: myJobsCount > 0 ? Math.round((stats.cancelled / myJobsCount) * 100) : 0,
    averageRating: averageRatingRaw,
    profileCompletion,
    totalReviews: myReviews.length,
  };

  const income = {
    total: myJobs.filter((o) => o.status === "selesai").reduce((sum, order) => sum + (order.price || 0), 0),
    month: myJobs
      .filter((o) => o.status === "selesai" && new Date(o.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, order) => sum + (order.price || 0), 0),
    avgPerJob: myJobs.length > 0 ? myJobs.reduce((sum, order) => sum + (order.price || 0), 0) / myJobs.length : 0,
  };

  const isActiveNow = currentUser?.isActive !== false;
  const avgRating = averageRatingRaw.toFixed(1);

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
            myJobsCount={myJobsCount}
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
          <PortfolioTab
            myPortfolio={myPortfolio}
            currentUserId={currentUser?.id}
            onAddPortfolio={addPortfolioItem}
            showToast={showToast}
          />
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
