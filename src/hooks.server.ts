import { dev } from '$app/environment';
import { connectKV } from 'wrangler-proxy';
const hostname = 'http://127.0.0.1:8787';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  if (dev) {
    event.locals.ELEVATOR = connectKV('ELEVATOR', { hostname });
  }

  if (event?.platform?.env) {
    event.locals.ELEVATOR = event.platform.env.ELEVATOR;
  }

  const response = await resolve(event);
  return response;
}
