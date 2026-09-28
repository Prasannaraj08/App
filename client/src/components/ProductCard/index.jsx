import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80';

export default function ProductCard({ product = {} }) {
  const navigate = useNavigate();
  const { addToCart, user } = useStore();
  const [imageError, setImageError] = useState(false);

  const availableSize = product.sizes?.find((size) => size.stock > 0)?.size || '';
  const hasStock = Boolean(availableSize);
  const imageUrl = (!imageError && product.images?.[0]) || DEFAULT_FALLBACK_IMAGE;

  const handleAddToCart = async () => {
    if (!hasStock || !product.id) return;

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, availableSize, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <article className="product-card">
      <img
        src={imageUrl}
        alt={product.name || 'Product'}
        className="product-image"
        loading="lazy"
        onError={() => setImageError(true)}
      />
      <div className="product-details">
        <div className="product-meta-row">
          <span className="product-category">{product.category || 'Apparel'}</span>
          <span className="rating">★ {product.averageRating || 0}</span>
        </div>

        <h3>{product.name || 'Untitled item'}</h3>
        <p>{product.description || ''}</p>

        <div className="product-footer">
          <strong>₹{product.price ?? 0}</strong>
          <span>{product.reviewCount || 0} reviews</span>
        </div>

        <div className="product-actions">
          {product.id && <Link to={`/products/${product.id}`} className="btn btn-secondary">View</Link>}
          <button type="button" className="btn btn-primary" disabled={!hasStock} onClick={handleAddToCart}>
            {hasStock ? 'Add to cart' : 'Out of stock'}
          </button>
        </div>
      </div>
    </article>
  );
}
