import Vapi from "@vapi-ai/web";

// The Web SDK expects a PUBLIC key. Prefer NEXT_PUBLIC_VAPI_PUBLIC_KEY,
// fallback to legacy NEXT_PUBLIC_VAPI_API_KEY if present.
const publicKey =
	process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPI_API_KEY;

if (!publicKey) {
	throw new Error(
		"Missing Vapi public key. Set NEXT_PUBLIC_VAPI_PUBLIC_KEY in your .env.local"
	);
}

export const vapi = new Vapi(publicKey);
