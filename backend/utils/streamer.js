// backend/utils/streamer.js

async function streamText(res, fullText, delay = 25) {
  if (!res.headersSent) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
  }

  const tokens = fullText.split(" ");

  for (const token of tokens) {
    // stop if client disconnected
    if (res.writableEnded) return;

    res.write(
      JSON.stringify({
        response: token + " ",
        done: false,
      }) + "\n"
    );

    await new Promise((r) => setTimeout(r, delay));
  }

  if (!res.writableEnded) {
    res.write(
      JSON.stringify({
        response: "",
        done: true,
      }) + "\n"
    );
    res.end();
  }
}

module.exports = { streamText };
