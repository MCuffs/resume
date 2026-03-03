# 매일 자동 데이터 수집 가이드 (Vercel Cron)

## 개요

**목적**: 모든 가입 크리에이터의 Threads 데이터를 **매일 자정** 자동으로 수집하여 `daily_stats` 테이블에 저장

**작동 방식**:
1. Vercel Cron이 매일 자정(또는 원하는 시간)에 API 엔드포인트 호출
2. Supabase `creators` 테이블에서 모든 유저의 `access_token` 조회
3. 각 유저의 Threads API 호출 → 최신 데이터 수집
4. `daily_stats` 테이블에 저장

---

## 1. API 엔드포인트 생성

### (이 레포 기준) `api/cron/daily-update.ts`

이 프로젝트는 Next.js가 아니라 Vite SPA이지만, Vercel은 루트의 `api/` 폴더를 Serverless Function으로 배포할 수 있습니다.
따라서 Cron 엔드포인트는 `api/cron/daily-update.ts`로 구성합니다.

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Vercel Cron 인증 (보안)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 1. 모든 크리에이터 조회
    const { data: creators, error } = await supabase
      .from('creators')
      .select('id, threads_user_id, access_token, username');

    if (error) throw error;
    if (!creators || creators.length === 0) {
      return res.json({ message: 'No creators found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const results = [];

    // 2. 각 크리에이터 데이터 수집
    for (const creator of creators) {
      try {
        // Threads API 호출
        const profileRes = await fetch(
          `https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url,followers_count&access_token=${creator.access_token}`
        );
        const profile = await profileRes.json();

        const mediaRes = await fetch(
          `https://graph.threads.net/v1.0/me/threads?fields=id,text,timestamp&access_token=${creator.access_token}`
        );
        const mediaData = await mediaRes.json();

        // 3. daily_stats에 저장
        const { error: statsError } = await supabase
          .from('daily_stats')
          .upsert({
            creator_id: creator.id,
            date: today,
            followers_count: profile.followers_count || 0,
            posts_count: mediaData.data?.length || 0,
            total_likes: 0,
            total_comments: 0,
            total_views: 0,
            engagement_rate: 0,
          }, { onConflict: 'creator_id,date' });

        if (statsError) {
          console.error(`Stats error for ${creator.username}:`, statsError);
        } else {
          results.push({ username: creator.username, status: 'success' });
        }
      } catch (err) {
        console.error(`Error for ${creator.username}:`, err);
        results.push({ username: creator.username, status: 'failed', error: err });
      }
    }

    return res.json({
      message: 'Daily update completed',
      processed: creators.length,
      results,
    });
  } catch (error) {
    console.error('Cron error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## 2. Vercel Cron 설정

### `vercel.json` 파일 생성 (프로젝트 루트):

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-update",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**스케줄 설명**:
- `0 0 * * *` → 매일 자정 (UTC 기준)
- `0 15 * * *` → 매일 오후 3시 (한국 시간 자정)
- `0 */6 * * *` → 6시간마다

---

## 3. 환경 변수 추가

Vercel Dashboard → Settings → Environment Variables에 추가:

```env
CRON_SECRET=your_random_secret_here_min_32_chars
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...  # recommended
THREADS_APP_SECRET=...
```

**CRON_SECRET 생성 (터미널)**:
```bash
openssl rand -base64 32
```

---

## 4. 배포 및 테스트

### 배포
```bash
git add vercel.json src/pages/api/cron/
git commit -m "Add daily data collection cron"
git push origin main
```

### 수동 테스트 (Vercel 배포 후)
```bash
curl -X POST https://arthurian.cloud/api/cron/daily-update \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

성공 시 응답:
```json
{
  "message": "Daily update completed",
  "processed": 5,
  "results": [
    { "username": "arthurian_studio", "status": "success" },
    ...
  ]
}
```

---

## 5. Vercel Dashboard에서 확인

배포 후:
1. Vercel Dashboard → 프로젝트 → **Cron Jobs** 탭
2. 다음 실행 시간 확인
3. 실행 로그 확인 가능

---

## 대안: Supabase Edge Functions

Vercel Cron 대신 Supabase의 Cron 기능 사용 가능:

1. Supabase Dashboard → **Database** → **Cron Jobs**
2. **Create a new cron job** 클릭
3. SQL 함수 작성:

```sql
CREATE OR REPLACE FUNCTION daily_data_sync()
RETURNS void AS $$
BEGIN
  -- Supabase에서 직접 Threads API 호출 불가
  -- Edge Function 호출로 대체
  PERFORM net.http_post(
    url := 'https://yxcpnkktikrmrrxufvvl.supabase.co/functions/v1/daily-sync',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  );
END;
$$ LANGUAGE plpgsql;
```

4. 스케줄 설정: `0 0 * * *`

---

## 문의

Cron 설정 중 문제가 생기면 contact@arthurian.cloud로 연락주세요.
