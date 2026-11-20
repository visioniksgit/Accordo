
export async function GET() {
  const urls = [
    "https://accordo-liart.vercel.app/agents.md",
    "https://accordo-liart.vercel.app/llms.txt",
    "https://accordo-liart.vercel.app/llms-full.txt",
  ];

  const entries = urls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
