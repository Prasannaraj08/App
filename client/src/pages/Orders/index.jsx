import { useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/currency';

export default function Orders() {
  const { fetchOrders, orders } = useStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="page">
      <h1>My orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-header">
                <strong>{order.id}</strong>
                <span>{order.orderStatus}</span>
              </div>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              <ul>
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.productId}-${item.size}`}>
                    {item.productName} · {item.size} · Qty {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="price-tag">Total: {formatCurrency(order.totalAmount)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
