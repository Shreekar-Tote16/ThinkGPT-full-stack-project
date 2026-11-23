
export async function onRequest(context) {
  const { request, env } = context;

  if (!env.BACKEND_ORIGIN) {
    return new Response(
      "BACKEND_ORIGIN environment variable is not configured.",
      { status: 500 }
    );
  }

  try {
    const incomingUrl = new URL(request.url);
    const backendUrl = new URL(env.BACKEND_ORIGIN);

    // Preserve the complete API path and query parameters.
    // Change only the destination host to the Render backend.
    incomingUrl.protocol = backendUrl.protocol;
    incomingUrl.host = backendUrl.host;

    // Forward method, headers, cookies and request body.
    // The returned response is passed through without buffering,
    // preserving streaming responses and Set-Cookie headers.
    const proxyRequest = new Request(
      incomingUrl.toString(),
      request
    );

    return await fetch(proxyRequest);
  } catch (error) {
    console.error("API proxy error:", error);

    return new Response(
      "Unable to connect to the ThinkGPT backend.",
      { status: 502 }
    );
  }
}
