import Card from "../../../../components/Card";
import Stars from "../../../../components/Stars";

const ReviewsTab = ({ avgRating, myReviews }) => (
  <>
    <h3 className="font-bold text-lg mb-4">Ulasan Pelanggan</h3>

    <Card className="mb-6 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm">Rating Keseluruhan</p>
          <p className="text-4xl font-bold text-slate-800">{avgRating}</p>
          <Stars rating={parseFloat(avgRating)} />
          <p className="text-xs text-gray-400 mt-1">{myReviews.length} ulasan</p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = myReviews.filter((r) => r.rating === rating).length;
            const percentage = myReviews.length > 0 ? (count / myReviews.length) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500 w-4">{rating}*</span>
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-yellow-400 h-full" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>

    {myReviews.length === 0 ? (
      <Card className="p-4 text-center text-gray-500">
        <p>Belum ada review dari pelanggan.</p>
      </Card>
    ) : (
      <div className="space-y-3">
        {myReviews.slice(0, 10).map((review) => (
          <Card key={review.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <Stars rating={review.rating} />
              <p className="text-[11px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </Card>
        ))}
      </div>
    )}
  </>
);

export default ReviewsTab;
