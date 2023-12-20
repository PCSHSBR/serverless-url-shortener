import { app } from './firebase';
import { getAuth, type Auth } from 'firebase/auth';
import { Firestore, addDoc, collection, doc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { z } from 'zod';
import { PUBLIC_DENGEROUS_FIREBASE_WEB_API_KEY } from '$env/static/public';
import { getSlugFromURL } from '$lib/utils';
import { writable } from 'svelte/store';
import { onMount } from 'svelte';

export const availableDomain = ['pcshsbr.page.link', 'sym2023.page.link'];
export const DEFAULT_DOMAIN = availableDomain[0]; // pcshsbr.page.link

const auth: Auth = getAuth(app);
const db = getFirestore(app);

interface DynamicLinkParameters {
  dynamicLinkInfo?: {
    domainUriPrefix?: string
    link?: string
    androidInfo?: {
      androidPackageName?: string
      androidFallbackLink?: string
      androidMinPackageVersionCode?: string
    }
    iosInfo?: {
      iosBundleId?: string
      iosFallbackLink?: string
      iosCustomScheme?: string
      iosIpadFallbackLink?: string
      iosIpadBundleId?: string
      iosAppStoreId?: string
    }
    navigationInfo?: {
      enableForcedRedirect?: boolean
    }
    analyticsInfo?: {
      googlePlayAnalytics?: {
        utmSource?: string
        utmMedium?: string
        utmCampaign?: string
        utmTerm?: string
        utmContent?: string
      },
      itunesConnectAnalytics?: {
        at?: string
        ct?: string
        mt?: string
        pt?: string
      }
    }
    socialMetaTagInfo?: {
      socialTitle?: string
      socialDescription?: string
      socialImageLink?: string
    }
  }
  suffix?: {
    option?: "SHORT" | "UNGUESSABLE"
  }
}

const createLinkSchema = z.object({
  link: z.string({
    invalid_type_error: 'ลิงก์ต้องเป็น URL ที่ถูกต้อง',
    required_error: 'กรุณากรอกลิงก์'
  }).url({
    message: 'ลิงก์ต้องเป็น URL ที่ถูกต้อง'
  }),
  domain: z
    .string({
      invalid_type_error: 'โดเมนต้องเป็น URL ที่ถูกต้อง',
      required_error: 'กรุณากรอกโดเมน'
    })
    .default(DEFAULT_DOMAIN)
    .refine((value) => {
      if (value) {
        return availableDomain.includes(value);
      }
      return true;
    }, 'โดเมนไม่ถูกต้อง'),
  customSlug: z.string().or(z.null()).or(z.null()).optional(),
  unguessable: z.boolean().optional(),
  auth: z.unknown().optional().default(auth) as z.ZodType<Auth | undefined>,
});

export type CreateLinkSchema = z.infer<typeof createLinkSchema>;

/**
 * Create a new dynamic link
 * @param options Options for creating a dynamic link
 */
export async function createLink(options: CreateLinkSchema) {
  const result = createLinkSchema.safeParse(options);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  const {
    link,
    auth: userAuth,
    domain = DEFAULT_DOMAIN,
    customSlug = null,
    unguessable = false,
  } = result.data;
  if (!userAuth) throw new Error('กรุณาเข้าสู่ระบบก่อนสร้างลิงก์');
  const safetyResponse = await fetch(`/api/v1/check?query=${link}`).then(r => r.json()).catch(e => console.error(e));
  const linkDomain = new URL(link).hostname;
  if (safetyResponse.isOk !== true) return { success: false, error: { message: `${linkDomain} is not allowed to be created.` } }
  const response = await sendRequest('POST', {
    dynamicLinkInfo: {
      domainUriPrefix: `https://${domain}`,
      link,
      ...(customSlug ? { navigationInfo: { enableForcedRedirect: true } } : {}),
    },
    suffix: {
      option: unguessable ? 'UNGUESSABLE' : 'SHORT'
    }
  })
  if ('error' in response) {
    return { success: false, error: response.error }
  }
  const { shortLink } = response;
  const docRef = await setDoc(doc(db, `links/${getSlugFromURL(shortLink)}`), {
    domain,
    longLink: link,
    shortLink,
    shortSlug: getSlugFromURL(shortLink),
    createAt: serverTimestamp(),
    createBy: userAuth.currentUser?.uid
  })
  return { success: true, shortLink, docRef, longLink: link };
}

async function sendRequest(method: 'POST', body: DynamicLinkParameters): Promise<GetLinkResult> {
  const url = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${PUBLIC_DENGEROUS_FIREBASE_WEB_API_KEY}`
  const response = await fetch(url, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.ok) {
    return response.json() as Promise<GetLinkResult>
  }
  return response.json() as Promise<ErrorResponse>
}

export interface Link {
  domain: string;
  longLink: string;
  shortLink: string;
  createAt: Date;
  createBy: string;
}

interface ErrorResponse {
  error: {
    message: string;
    code: number;
    status: string;
  };
}

interface GetLinkResponse {
  shortLink: string;
  previewLink: string;
}

type GetLinkResult = GetLinkResponse | ErrorResponse;