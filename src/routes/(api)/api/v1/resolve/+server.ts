import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { admin } from '$lib/server/firebase';

export const GET: RequestHandler = async ({ url }) => {
  const slug = url.searchParams.get('query');
  if (!slug) {
    throw error(400, 'Missing query');
  }
  const doc = await admin
    .firestore()
    .collection('links')
    .doc(`pcshsbrpagelink-${slug}`)
    .get();
  if (!doc.exists)
    return new Response('not found', {
      status: 404,
      headers: {
        'content-type': 'text/plain'
      }
    });
  const data = doc.data();
  if (!data) {
    return new Response('internal server error', {
      status: 500,
      headers: {
        'content-type': 'text/plain'
      }
    })
  }
  throw redirect(302, data.url);
}