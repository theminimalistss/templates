import { renderToReadableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
export async function render(url: string) {
  const stream = await renderToReadableStream(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
  await stream.allReady;
  return new Response(stream).text();
}
