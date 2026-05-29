import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // Happy path
  http.post('/api/login', async ({ request }) => {
    const { email, password } = await request.json();
    if (email === 'user@example.com' && password === 'password123') {
      return HttpResponse.json({ token: 'tok_abc123', userId: 'u1' });
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  // Slow 3G variant - import and use in specific tests via server.use()
  http.post('/api/login/slow', async ({ request }) => {
    await delay(2000);
    return HttpResponse.json({ token: 'tok_abc123', userId: 'u1' });
  }),
];
