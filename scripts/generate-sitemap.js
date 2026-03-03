
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.arthrian.cloud';
const PUBLIC_DIR = path.join(__dirname, '../public');
const POSTS_DIR = path.join(PUBLIC_DIR, 'blog/posts');

// Static routes
const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/studio', priority: '0.8', changefreq: 'weekly' },
    { path: '/brand', priority: '0.8', changefreq: 'weekly' },
    { path: '/benefit', priority: '0.5', changefreq: 'weekly' },
    { path: '/creator-case', priority: '0.8', changefreq: 'daily' },
    { path: '/blog', priority: '0.9', changefreq: 'daily' }
];

// Blog posts (hardcoded for now, but in future can read files)
// For now, we manually add the known posts since we don't have the markdown files in the file system yet 
// (we used hardcoded content in blog-utils.ts for the "why so slow" speedup)
const blogPosts = [
    'hu100-marketing-case',
    'why-we-pivoted-to-threads'
];

function generateSitemap() {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
${blogPosts.map(slug => `  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated successfully!');
}

generateSitemap();
