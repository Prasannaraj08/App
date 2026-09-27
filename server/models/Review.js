export default class Review {
  constructor({ id, productId, userId, rating, comment, createdAt }) {
    this.id = id;
    this.productId = productId;
    this.userId = userId;
    this.rating = rating;
    this.comment = comment || '';
    this.createdAt = createdAt || new Date().toISOString();
  }
}
