import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const navLinkClass = ({ isActive }) =>
  `nav-link ${isActive ? 'active' : ''}`;

export default function Navbar() {
  const { user, cart, logout } = useStore();

  return (
    <header className="navbar">
      <div className="nav-brand-wrap">
        <Link to="/" className="brand">StyleCart</Link>
      </div>

      <nav className="nav-links">
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
        <NavLink to="/products?category=men" className={navLinkClass}>Men</NavLink>
        <NavLink to="/products?category=women" className={navLinkClass}>Women</NavLink>
        <NavLink to="/products?category=children" className={navLinkClass}>Children</NavLink>
        <NavLink to="/cart" className={navLinkClass}>Cart ({cart.length})</NavLink>
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-badge">Hi, {user.name}</span>
            <button type="button" className="btn btn-secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
