import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function Home() {
  const { fetchProducts } = useStore();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchProducts('all', 'rating').then((data) => setFeatured(data.slice(0, 3)));
  }, []);

  return (
    <div className="page home-page">
      <section className="hero">
        <div>
          <p className="eyebrow">New Season Collection</p>
          <h1>Style that speaks for you</h1>
          <p>Discover curated looks for men, women, and kids with premium essentials.</p>
          <div className="hero-actions">
            <Link to="/products?category=all" className="btn btn-primary">Shop now</Link>
            <Link to="/products?category=women" className="btn btn-secondary">Women</Link>
          </div>
        </div>
      </section>

      <section className="featured section-block">
        <div className="section-title-row">
          <h2>Featured picks</h2>
        </div>
        <div className="products-grid">
          {featured.map((product) => (
            <article key={product.id} className="product-card compact-card">
              <img src={product.images?.[0]} alt={product.name} className="product-image" />
              <div className="product-details">
                <h3>{product.name}</h3>
                <div className="product-footer">
                  <strong>₹{product.price}</strong>
                  <span>★ {product.averageRating || 0}</span>
                </div>
                <Link to={`/products/${product.id}`} className="btn btn-primary full-width">View item</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="category-grid section-block">
        <Link className="category-card men" to="/products?category=men">
          <span>Men</span>
        </Link>
        <Link className="category-card women" to="/products?category=women">
          <span>Women</span>
        </Link>
        <Link className="category-card children" to="/products?category=children">
          <span>Children</span>
        </Link>
      </section>
    </div>
  );
}
