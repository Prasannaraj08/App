import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function Cart() {
  const { cart, updateCartItem, removeCartItem, token } = useStore();
  const navigate = useNavigate();

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  if (!token) return null;

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
                <img src={item.product?.images?.[0]} alt={item.product?.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <h3>{item.product?.name}</h3>
                  <p>Size: {item.size}</p>
                  <p>₹{item.product?.price}</p>
                </div>
                <div className="cart-item-actions">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => updateCartItem(item.id, Number(event.target.value) || 1)}
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
              <strong>₹{total}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>
            <Link to="/checkout" className="btn btn-primary full-width">Proceed to checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
