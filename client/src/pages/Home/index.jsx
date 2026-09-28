import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const categoryBanner = {
  men: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  women: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
  children: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
};

export default function Home() {
  const { fetchProducts } = useStore();
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    fetchProducts('all', 'rating_high').then((data) => setFeatured(data.slice(0, 3)));
    fetchProducts('all', 'newest').then((data) => setNewArrivals(data.slice(0, 3)));
  }, [fetchProducts]);

  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">New Season Collection</p>
          <h1>Discover your style</h1>
          <p>Curated essentials for everyday comfort, elevated layers, and standout statement pieces.</p>
          <div className="hero-actions">
            <Link to="/products?category=all" className="btn btn-primary">Shop now</Link>
            <Link to="/products?category=women" className="btn btn-secondary">Women</Link>
          </div>
        </div>
      </section>

      <section className="category-grid section-block">
        {Object.entries(categoryBanner).map(([category, image]) => (
          <Link key={category} className={`category-card ${category}`} to={`/products?category=${category}`} style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.5)), url(${image})` }}>
            <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
          </Link>
        ))}
      </section>

      <section className="featured section-block">
        <div className="section-title-row">
          <h2>Featured picks</h2>
          <Link to="/products?category=all" className="inline-link">View all</Link>
        </div>
        <div className="products-grid">
          {featured.map((product) => (
            <article key={product.id} className="product-card compact-card">
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80';
                }}
              />
              <div className="product-details">
                <div className="product-meta-row">
                  <span className="product-category">{product.category}</span>
                  <span className="rating">★ {product.averageRating || 0}</span>
                </div>
                <h3>{product.name}</h3>
                <div className="product-footer">
                  <strong>₹{product.price}</strong>
                  <span>{product.reviewCount || 0} reviews</span>
                </div>
                <Link to={`/products/${product.id}`} className="btn btn-primary full-width">View item</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="featured section-block">
        <div className="section-title-row">
          <h2>New arrivals</h2>
        </div>
        <div className="products-grid">
          {newArrivals.map((product) => (
            <article key={product.id} className="product-card compact-card">
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'}
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80';
                }}
              />
              <div className="product-details">
                <h3>{product.name}</h3>
                <div className="product-footer">
                  <strong>₹{product.price}</strong>
                  <span>{product.reviewCount || 0} reviews</span>
                </div>
                <Link to={`/products/${product.id}`} className="btn btn-secondary full-width">Shop now</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="benefits section-block">
        <div className="benefit-item">
          <strong>Secure checkout</strong>
          <span>Protected payment flow for every order.</span>
        </div>
        <div className="benefit-item">
          <strong>Easy returns</strong>
          <span>Simple exchanges within the return window.</span>
        </div>
        <div className="benefit-item">
          <strong>Fast delivery</strong>
          <span>Quick shipping across major cities.</span>
        </div>
      </section>
    </div>
  );
}
