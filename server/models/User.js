export default class User {
  constructor({ id, name, email, passwordHash, role, createdAt }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role || 'customer';
    this.createdAt = createdAt || new Date().toISOString();
  }
}
