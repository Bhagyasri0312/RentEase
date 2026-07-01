import { useState } from 'react';
import { Star, ThumbsUp, Trash2 } from 'lucide-react';
import { useReviews } from '../hooks/useReviews';
import { useNotifications } from '../hooks/useNotifications';

const ProductReviews = ({ productId }) => {
  const { reviews, addReview, deleteReview, markHelpful, getAverageRating } = useReviews();
  const { addNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    author: '',
  });

  const productReviews = reviews.filter(r => r.productId === productId);
  const averageRating = getAverageRating(productId);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.comment.trim()) {
      addNotification('Please fill in all fields', 'error');
      return;
    }

    addReview(productId, formData);
    setFormData({ rating: 5, title: '', comment: '', author: '' });
    setShowForm(false);
    addNotification('Review submitted successfully!', 'success');
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
      addNotification('Review deleted', 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Customer Reviews</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-xl font-bold text-gray-800">{averageRating}/5</span>
              <span className="text-gray-600">({productReviews.length} reviews)</span>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            {showForm ? 'Cancel' : 'Write Review'}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-lg shadow-lg space-y-4 border-l-4 border-blue-600">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: num })}
                  className="transition"
                >
                  <Star
                    size={28}
                    className={num <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Enter your name (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Review Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Great quality!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {productReviews.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          productReviews.map(review => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex gap-2 items-center">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <h4 className="font-semibold text-gray-800">{review.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    By {review.author || 'Anonymous'} • {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <p className="text-gray-700 mb-4">{review.comment}</p>

              <button
                onClick={() => markHelpful(review.id)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
              >
                <ThumbsUp size={16} />
                Helpful ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
