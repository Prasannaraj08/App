import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStore();
  const [form, setForm] = useState({ email: 'demo@store.com', password: 'demo123' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="page auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-primary full-width">Login</button>
        <p className="auth-footer">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
