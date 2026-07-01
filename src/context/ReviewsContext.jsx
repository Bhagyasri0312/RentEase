import { createContext, useState, useCallback } from 'react';

export const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('rentease_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Error loading reviews:', err);
      return [];
    }
  });

  // Add review
  const addReview = useCallback((productId, review) => {
    const newReview = {
      id: Date.now(),
      productId,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      author: review.author || 'Anonymous',
      createdAt: new Date().toISOString(),
      helpful: 0,
      verified: review.verified || false,
    };

    setReviews(prev => {
      const updated = [...prev, newReview];
      localStorage.setItem('rentease_reviews', JSON.stringify(updated));
      return updated;
    });

    return newReview;
  }, []);

  // Get reviews for product
  const getProductReviews = useCallback((productId) => {
    return reviews.filter(r => r.productId === productId).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [reviews]);

  // Get average rating
  const getAverageRating = useCallback((productId) => {
    const productReviews = getProductReviews(productId);
    if (productReviews.length === 0) return 0;
    const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / productReviews.length).toFixed(1);
  }, [getProductReviews]);

  // Mark as helpful
  const markHelpful = useCallback((reviewId) => {
    setReviews(prev => {
      const updated = prev.map(r =>
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      );
      localStorage.setItem('rentease_reviews', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Delete review
  const deleteReview = useCallback((reviewId) => {
    setReviews(prev => {
      const updated = prev.filter(r => r.id !== reviewId);
      localStorage.setItem('rentease_reviews', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    reviews,
    addReview,
    getProductReviews,
    getAverageRating,
    markHelpful,
    deleteReview,
  };

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
};
