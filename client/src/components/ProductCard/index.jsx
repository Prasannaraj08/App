import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, user } = useStore();
  const availableSize = product.sizes?.find((size) => size.stock > 0)?.size || '';
  const hasStock = Boolean(availableSize);

  const handleAddToCart = async () => {
    if (!hasStock) return;

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, availableSize, 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article className="product-card">
      <img src={product.images?.[0]} alt={product.name} className="product-image" />
      <div className="product-details">
        <div className="product-meta-row">
          <span className="product-category">{product.category}</span>
          <span className="rating">★ {product.averageRating || 0}</span>
        </div>

        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="product-footer">
          <strong>₹{product.price}</strong>
          <span>{product.reviewCount || 0} reviews</span>
        </div>

        <div className="product-actions">
          <Link to={`/products/${product.id}`} className="btn btn-secondary">View</Link>
          <button type="button" className="btn btn-primary" disabled={!hasStock} onClick={handleAddToCart}>
            {hasStock ? 'Add to cart' : 'Out of stock'}
          </button>
        </div>
      </div>
    </article>
  );
}
