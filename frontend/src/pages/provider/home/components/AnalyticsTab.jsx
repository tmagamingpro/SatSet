import Card from "../../../../components/Card";
import AppIcon from "../../../../components/AppIcon";
import { StatBox, BarChart, LineChart } from "../../../../components/Charts";

const AnalyticsTab = ({ myMetrics, myJobs, myReviews, serviceBreakdown, income }) => (
  <>
    <h3 className="font-bold text-lg mb-4">Analisis Performa</h3>

    <div className="grid grid-cols-2 gap-3 mb-6">
      <StatBox
        label="Rating Rata-rata"
        value={Number(myMetrics.averageRating || 0).toFixed(1)}
        color="#FBBF24"
        icon={<AppIcon name="star" size={20} />}
      />
      <StatBox
        label="Total Pekerjaan"
        value={myJobs.length}
        color="#0284C7"
        icon={<AppIcon name="briefcase" size={20} />}
      />
      <StatBox
        label="Tingkat Penyelesaian"
        value={`${myMetrics.completionRate || 0}%`}
        color="#22C55E"
        icon={<AppIcon name="badgeCheck" size={20} />}
      />
      <StatBox
        label="Total Review"
        value={myMetrics.totalReviews || myReviews.length}
        color="#0284C7"
        icon={<AppIcon name="messageSquare" size={20} />}
      />
    </div>

    {Object.keys(serviceBreakdown).length > 0 && (
      <Card className="mb-6 p-4">
        <h3 className="font-bold mb-4">Pemecahan Layanan</h3>
        <BarChart data={serviceBreakdown} label="Jumlah pekerjaan per layanan" color="#0284C7" height={180} />
      </Card>
    )}

    <Card className="mb-6 p-4">
      <h3 className="font-bold mb-4">Tren Pemasukan</h3>
      <LineChart
        data={{
          Jan: 1200000,
          Feb: 1500000,
          Mar: income.month,
        }}
        label="Pemasukan per bulan (Rp)"
        color="#0EA5E9"
        height={150}
      />
    </Card>

    <Card className="p-4">
      <h3 className="font-bold mb-4">Detail Metrik</h3>
      <div className="space-y-3">
        {[
          { label: "Tingkat Order Aktif", value: `${myMetrics.activeRate || 0}%` },
          { label: "Tingkat Pembatalan", value: `${myMetrics.cancellationRate || 0}%` },
          { label: "Acceptance Rate", value: `${myMetrics.acceptanceRate || 0}%` },
          { label: "Completion Rate", value: `${myMetrics.completionRate || 0}%` },
          { label: "Profil Completion", value: `${myMetrics.profileCompletion || 0}%` },
          { label: "Total Reviews", value: myMetrics.totalReviews || myReviews.length },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="font-bold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  </>
);

export default AnalyticsTab;
