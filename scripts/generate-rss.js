
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://www.arthrian.cloud';
const PUBLIC_DIR = path.join(__dirname, '../public');

// Blog posts data (sync with blog-utils.ts)
const blogPosts = [
  {
    slug: 'hu100-marketing-case',
    title: '아서리안과 함께한 후백(Hu100)의 스레드 마케팅 후기',
    description: '100세까지 건강하게, Hu100. 화려한 영상 광고 대신 진정성 있는 텍스트 마케팅으로 찐팬을 모은 실제 사례를 공개합니다.',
    date: '2026-02-02',
    category: 'client-success'
  },
  {
    slug: 'why-we-pivoted-to-threads',
    title: '아서리안이 스레드(Threads) 전문 에이전시가 된 이유',
    description: '모두가 숏폼 중독을 외칠 때, 우리는 왜 텍스트로 돌아갔을까요? 도파민의 시대, 진정성 있는 텍스트가 가진 힘에 대해 이야기합니다.',
    date: '2026-02-02',
    category: 'agency-insight'
  }
];

function generateRSS() {
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Arthurian Studio Blog</title>
    <link>${BASE_URL}</link>
    <description>Arthurian Studio helps creators grow beyond platforms.</description>
    <language>ko</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${blogPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid>${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'rss.xml'), rss);
  console.log('✅ RSS Feed generated successfully!');
}

generateRSS();
