import { CIBSDK } from './CIBSDK';

type FetchResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
  text: () => Promise<string>;
};

/**
 * Build the encrypted/enveloped request using the native SDK and POST it to the given endpoint.
 * Returns the Fetch Response object.
 */
export async function postBuiltRequest(endpoint: string, metadataJson = '{}', requestJson = '{}') {
  try {
    // Build payload via native SDK
    const payload = await CIBSDK.buildRequest(metadataJson, requestJson);

    // Ensure payload is a string (native module may return JSON string)
    const body = typeof payload === 'string' ? payload : JSON.stringify(payload);

    const res: FetchResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    }) as any;

    return res;
  } catch (e) {
    throw e;
  }
}

export default { postBuiltRequest };
