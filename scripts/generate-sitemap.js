
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.arthrian.cloud';
const PUBLIC_DIR = path.join(__dirname, '../public');
const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/blog', priority: '0.9', changefreq: 'weekly' },
    { path: '/blog/why-korean-resume-format-matters', priority: '0.8', changefreq: 'monthly' }
];

function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated successfully!');
}

generateSitemap();
