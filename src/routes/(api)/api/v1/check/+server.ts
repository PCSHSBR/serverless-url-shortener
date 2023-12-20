import { error, json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { admin } from '$lib/server/firebase';
import { ERRORS } from '$lib/message';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const link = url.searchParams.get('query');
  if (!link) {
    throw error(400, ERRORS.MISSING_QUERY)
  }
  const targetDomain = new URL(link).hostname;
  const safetyResponse = await fetch(`https://url-safety-checker.onrender.com/api/${targetDomain}`).then(r => r.text()).catch(e => console.error(e))
  return json({
    isOk: safetyResponse.indexOf('true') > -1
  })
}