import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../context/StoreContext';

export default function Products() {
  const { fetchProducts, products, loading } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('newest');

  const category = searchParams.get('category') || 'all';

  useEffect(() => {
    fetchProducts(category, sort);
  }, [category, sort]);

  const filteredProducts = useMemo(() => products, [products]);

  return (
    <div className="page products-page">
      <div className="section-title-row products-toolbar">
        <h2>{category === 'all' ? 'All products' : `${category.charAt(0).toUpperCase() + category.slice(1)} collection`}</h2>
        <div className="toolbar-controls">
          <label>
            Sort by
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="newest">Newest</option>
              <option value="rating">Rating</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="category-links">
        <Link to="/products?category=all" className={category === 'all' ? 'category-link active' : 'category-link'}>All</Link>
        <Link to="/products?category=men" className={category === 'men' ? 'category-link active' : 'category-link'}>Men</Link>
        <Link to="/products?category=women" className={category === 'women' ? 'category-link active' : 'category-link'}>Women</Link>
        <Link to="/products?category=children" className={category === 'children' ? 'category-link active' : 'category-link'}>Children</Link>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.length ? filteredProducts.map((product) => <ProductCard key={product.id} product={product} />) : <p>No products available.</p>}
        </div>
      )}
    </div>
  );
}
