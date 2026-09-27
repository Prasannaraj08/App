import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const hasStock = product.sizes?.some((size) => size.stock > 0);

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
          <button type="button" className="btn btn-primary" disabled={!hasStock}>
            {hasStock ? 'Add to cart' : 'Out of stock'}
          </button>
        </div>
      </div>
    </article>
  );
}
