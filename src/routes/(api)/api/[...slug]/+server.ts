import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  throw error(404, 'not found')
}

export const POST: RequestHandler = () => {
  throw new Response('not found', {
    status: 404,
    headers: {
      'content-type': 'text/plain'
    }
  })
}