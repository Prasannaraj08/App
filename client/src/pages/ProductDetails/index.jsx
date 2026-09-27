import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, user, addToCart } = useStore();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

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

    fetchProduct();
  }, [id]);

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

  if (!product) {
    return <div className="page"><p>{error || 'Loading product...'}</p></div>;
  }

  return (
    <div className="page product-page">
      <div className="product-hero">
        <img src={product.images?.[0]} alt={product.name} className="detail-image" />
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
    </div>
  );
}
