export default class Product {
  constructor({
    id,
    name,
    description,
    category,
    price,
    images = [],
    sizes = [],
    averageRating = 0,
    reviewCount = 0,
    createdAt,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.price = price;
    this.images = images;
    this.sizes = sizes;
    this.averageRating = averageRating;
    this.reviewCount = reviewCount;
    this.createdAt = createdAt || new Date().toISOString();
  }
}
