function decodeToken(token) {
  if (!token) return null; // handle undefined token

  try {
    const base64Url = token.split('.')[1]; // get payload
    if (!base64Url) return null;

    // Convert from URL-safe Base64 to standard Base64
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Pad with '=' if necessary
    while (base64.length % 4) {
      base64 += '=';
    }

    // Decode Base64 using atob polyfill
    const decodedPayload = decodeBase64(base64);

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Invalid Token', error);
    return null;
  }
}

// Pure JS Base64 decoder
function decodeBase64(base64) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let str = '';
  let buffer = 0;
  let bitsCollected = 0;

  for (let i = 0; i < base64.length; i++) {
    const c = base64[i];
    if (c === '=') break;

    const charIndex = chars.indexOf(c);
    if (charIndex === -1) continue;

    buffer = (buffer << 6) | charIndex;
    bitsCollected += 6;

    if (bitsCollected >= 8) {
      bitsCollected -= 8;
      str += String.fromCharCode((buffer >> bitsCollected) & 0xff);
    }
  }

  return decodeURIComponent(
    str
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

export default decodeToken;
