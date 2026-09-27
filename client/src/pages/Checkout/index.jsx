import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/currency';

export default function Checkout() {
  const { cart, checkout, token } = useStore();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [error, setError] = useState('');

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.product?.price || 0) * Number(item.quantity || 0)), 0),
    [cart]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate('/login');
      return;
    }

    if (!cart.length) {
      setError('Your cart is empty.');
      return;
    }

    try {
      await checkout({ ...shippingAddress }, paymentMethod, total);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed.');
    }
  };

  return (
    <div className="page checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input value={shippingAddress.name} onChange={(event) => setShippingAddress({ ...shippingAddress, name: event.target.value })} />
          </label>
          <label>
            Address
            <textarea value={shippingAddress.address} onChange={(event) => setShippingAddress({ ...shippingAddress, address: event.target.value })} />
          </label>
          <label>
            City
            <input value={shippingAddress.city} onChange={(event) => setShippingAddress({ ...shippingAddress, city: event.target.value })} />
          </label>
          <label>
            State
            <input value={shippingAddress.state} onChange={(event) => setShippingAddress({ ...shippingAddress, state: event.target.value })} />
          </label>
          <label>
            ZIP code
            <input value={shippingAddress.zipCode} onChange={(event) => setShippingAddress({ ...shippingAddress, zipCode: event.target.value })} />
          </label>

          <label>
            Payment method
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </label>

          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn btn-primary full-width" disabled={!cart.length}>Confirm order</button>
        </form>

        <aside className="summary-box">
          <h3>Payment summary</h3>
          {cart.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.product?.name} x {item.quantity}</span>
              <strong>{formatCurrency((Number(item.product?.price || 0) * Number(item.quantity || 0)))}</strong>
            </div>
          ))}
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
