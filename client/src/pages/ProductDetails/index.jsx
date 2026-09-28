import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, user, addToCart } = useStore();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [success, setSuccess] = useState('');

  const ratingSummary = useMemo(() => {
    if (!reviews.length) {
      return { average: 0, total: 0, distribution: [0, 0, 0, 0, 0] };
    }

    const distribution = [0, 0, 0, 0, 0];
    let total = 0;
    reviews.forEach((review) => {
      const rating = Number(review.rating || 0);
      total += rating;
      const index = Math.max(1, Math.min(5, Math.round(rating))) - 1;
      distribution[index] += 1;
    });

    return {
      average: Number((total / reviews.length).toFixed(1)),
      total: reviews.length,
      distribution,
    };
  }, [reviews]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
        const firstAvailable = response.data.product?.sizes?.find((size) => size.stock > 0)?.size || '';
        setSelectedSize(firstAvailable);
      } catch (err) {
        setError('Product not found.');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await api.get(`/products/${id}/reviews`);
        setReviews(response.data.reviews || []);
      } catch (err) {
        setReviews([]);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id, api]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size first.');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, selectedSize, quantity);
      navigate('/cart');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to add item to cart.');
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setReviewError('Please log in to write a review.');
      return;
    }

    try {
      const response = await api.post(`/products/${id}/reviews`, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      setReviews((prev) => [response.data.review, ...prev]);
      setReviewForm({ rating: 5, comment: '' });
      setReviewError('');
      setSuccess('Review submitted successfully.');
      const refreshedProduct = await api.get(`/products/${id}`);
      setProduct(refreshedProduct.data.product);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Unable to submit your review.');
      setSuccess('');
    }
  };

  if (!product) {
    return <div className="page"><p>{error || 'Loading product...'}</p></div>;
  }

  return (
    <div className="page product-page">
      <div className="product-hero">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'}
          alt={product.name || 'Product'}
          className="detail-image"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80';
          }}
        />
        <div className="product-info">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="rating-line">★ {product.averageRating || 0} · {product.reviewCount || 0} reviews</p>
          <p className="price-tag">₹{product.price}</p>
          <p>{product.description}</p>

          <div className="size-row">
            {product.sizes?.map((sizeObj) => (
              <button
                key={sizeObj.size}
                type="button"
                className={selectedSize === sizeObj.size ? 'size-btn active' : 'size-btn'}
                disabled={sizeObj.stock <= 0}
                onClick={() => setSelectedSize(sizeObj.size)}
              >
                {sizeObj.size} {sizeObj.stock <= 0 ? '(Out)' : `(${sizeObj.stock})`}
              </button>
            ))}
          </div>

          <div className="quantity-row">
            <label>
              Quantity
              <input type="number" min="1" max="10" value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 1)} />
            </label>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="button" className="btn btn-primary large" onClick={handleAddToCart}>
            Add to cart
          </button>
        </div>
      </div>

      <section className="reviews-panel">
        <div className="section-title-row">
          <h2>Customer reviews</h2>
        </div>

        <div className="review-summary">
          <div>
            <div className="rating-big">{ratingSummary.average || 0}</div>
            <p>{ratingSummary.total || 0} reviews</p>
          </div>

          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((score) => (
              <div key={score} className="distribution-row">
                <span>{score}★</span>
                <div className="distribution-bar">
                  <div style={{ width: `${ratingSummary.total ? (ratingSummary.distribution[score - 1] / ratingSummary.total) * 100 : 0}%` }} />
                </div>
                <strong>{ratingSummary.distribution[score - 1]}</strong>
              </div>
            ))}
          </div>
        </div>

        <form className="review-form" onSubmit={handleReviewSubmit}>
          <h3>Write a review</h3>
          <label>
            Rating
            <select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: Number(event.target.value) })}>
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </select>
          </label>
          <label>
            Review
            <textarea value={reviewForm.comment} onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} placeholder="Share your experience..." />
          </label>
          {reviewError && <p className="error-message">{reviewError}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="btn btn-primary">Submit review</button>
        </form>

        <div className="review-list">
          {reviews.length ? reviews.map((review) => (
            <article key={review.id} className="review-card">
              <div className="review-header">
                <strong>{review.user?.name || 'Customer'}</strong>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="review-stars">{'★'.repeat(Number(review.rating || 0))}</div>
              <p>{review.comment}</p>
            </article>
          )) : <p className="empty-state small">No reviews yet. Be the first to review this product.</p>}
        </div>
      </section>
    </div>
  );
}
