import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { admin } from '$lib/server/firebase';
import { ERRORS } from '$lib/message';

export const GET: RequestHandler = async ({ url }) => {
  const slug = url.searchParams.get('query');
  if (!slug) {
    throw error(400, ERRORS.MISSING_QUERY)
  }
  const doc = await admin
    .firestore()
    .collection('links')
    .doc(`pcshsbrpagelink-${slug}`)
    .get();
  if (!doc.exists)
    throw error(404, ERRORS.NOT_FOUND)
  const data = doc.data();
  if (!data) {
    throw error(500, ERRORS.INTERNAL_SERVER_ERROR)
  }
  throw redirect(302, data.longLink);
}