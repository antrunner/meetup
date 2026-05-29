// Prompt used:
// CONTEXT: LoginForm component - src/LoginForm.jsx - Ionic 7 - viewport 375px
// TASK: Vitest + RTL tests.
// COVER: renders fields, empty submit shows error, valid submit fires onLogin.
// MOBILE: fireEvent.touchEnd not click.
// FORMAT: Vitest + @testing-library/react, one describe block.

import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../../src/LoginForm';

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm onLogin={vi.fn()} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('shows "Email required" when submitted empty', () => {
    render(<LoginForm onLogin={vi.fn()} />);
    // mobile: touchEnd not click
    fireEvent.touchEnd(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Email required');
  });

  it('shows "Invalid email" for bad email format', () => {
    render(<LoginForm onLogin={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'notanemail' } });
    fireEvent.touchEnd(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email address');
  });

  it('calls onLogin with email and password on valid submit', async () => {
    const onLogin = vi.fn().mockResolvedValue({});
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText('Email'),    { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.touchEnd(screen.getByRole('button', { name: /sign in/i }));
    expect(onLogin).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
  });

  it('disables button and sets aria-busy while loading', async () => {
    const onLogin = vi.fn(() => new Promise(() => {})); // never resolves
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText('Email'),    { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.touchEnd(screen.getByRole('button', { name: /sign in/i }));
    const btn = screen.getByRole('button', { name: /signing in/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('shows server error message on failed login', async () => {
    const onLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText('Email'),    { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    fireEvent.touchEnd(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });
});
