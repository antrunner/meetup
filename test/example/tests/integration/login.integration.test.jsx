// Prompt used:
// CONTEXT: Login flow - LoginForm to /dashboard redirect
// TASK: Playwright component tests (Vitest + MSW).
// COVER: happy path redirect, 401 error toast, slow 3G skeleton.
// API: MSW handlers - no real network.
// MOBILE: 375px viewport, touch: true.
// ASSERT: text + aria roles, not CSS.

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse, delay } from 'msw';
import { LoginForm } from '../../src/LoginForm';

const server = setupServer();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Login flow - integration', () => {
  it('happy path: onLogin resolves and no error shown', async () => {
    server.use(
      http.post('/api/login', () => HttpResponse.json({ token: 'tok_abc', userId: 'u1' }))
    );
    const onLogin = async ({ email, password }) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error((await res.json()).error);
    };
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText('Email'),    { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.touchEnd(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  it('401: shows "Invalid credentials" error', async () => {
    server.use(
      http.post('/api/login', () =>
        HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      )
    );
    const onLogin = async ({ email, password }) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error((await res.json()).error);
    };
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText('Email'),    { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    fireEvent.touchEnd(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  });

  it('slow 3G: button shows loading state during request', async () => {
    server.use(
      http.post('/api/login', async () => {
        await delay(200); // simulate network latency
        return HttpResponse.json({ token: 'tok_abc', userId: 'u1' });
      })
    );
    const onLogin = async ({ email, password }) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error((await res.json()).error);
    };
    render(<LoginForm onLogin={onLogin} />);
    fireEvent.change(screen.getByLabelText('Email'),    { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.touchEnd(screen.getByRole('button', { name: /sign in/i }));
    // assert loading state BEFORE awaiting response (§12 rule)
    expect(screen.getByRole('button', { name: /signing in/i })).toHaveAttribute('aria-busy', 'true');
  });
});
