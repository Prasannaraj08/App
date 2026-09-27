export default class Order {
  constructor({ id, userId, items = [], shippingAddress, totalAmount, paymentMethod, paymentStatus, orderStatus, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.shippingAddress = shippingAddress;
    this.totalAmount = totalAmount;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus || 'Paid';
    this.orderStatus = orderStatus || 'Processing';
    this.createdAt = createdAt || new Date().toISOString();
  }
}
