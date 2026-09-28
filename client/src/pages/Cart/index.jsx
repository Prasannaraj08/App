import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/currency';

export default function Cart() {
  const { cart, updateCartItem, removeCartItem, token } = useStore();
  const navigate = useNavigate();

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.product?.price || 0) * Number(item.quantity || 0)), 0),
    [cart]
  );

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) return null;

  const handleQuantityChange = (itemId, nextValue) => {
    const safeValue = Number(nextValue);
    if (!Number.isFinite(safeValue) || safeValue < 1) {
      return;
    }

    updateCartItem(itemId, safeValue);
  };

  return (
    <div className="page cart-page">
      <h1>Your cart</h1>
      {cart.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/products?category=all" className="btn btn-primary">Continue shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80'}
                  alt={item.product?.name || 'Product'}
                  className="cart-item-image"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80';
                  }}
                />
                <div className="cart-item-info">
                  <h3>{item.product?.name}</h3>
                  <p>Size: {item.size}</p>
                  <p>{formatCurrency(item.product?.price || 0)}</p>
                </div>
                <div className="cart-item-actions">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={item.quantity}
                    onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                  />
                  <button type="button" className="btn btn-secondary" onClick={() => removeCartItem(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="summary-box">
            <h3>Order summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <Link to="/checkout" className="btn btn-primary full-width">Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
