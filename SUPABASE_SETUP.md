# Supabase Database Setup Guide

## Why Supabase?

**추천 이유**:
- ✅ PostgreSQL 기반 (복잡한 SQL 쿼리 가능)
- ✅ Row Level Security (개인정보 보호 강화)
- ✅ 무료 플랜 50,000 MAU
- ✅ Vercel 완벽 호환
- ✅ 실시간 구독 기능

**vs Firebase**:
- Firestore는 NoSQL → 랭킹/집계 쿼리 어려움
- Supabase는 SQL 직접 사용 → 분석 쉬움

---

## ⚠️ Security Update (Recommended)

이 프로젝트는 Threads OAuth 토큰(=민감정보)을 다룹니다.

- **권장 스키마(v2)**: 공개 프로필(`creators`)과 토큰 저장소(`creators_private`)를 분리하세요.
- **권장 키 사용**:
  - 브라우저(선택): `VITE_SUPABASE_ANON_KEY` + RLS
  - 서버(필수): `SUPABASE_SERVICE_ROLE_KEY` (Cron / 내부 API)

v2 스키마는 이 파일을 그대로 복사해 실행하는 것보다,
`supabase/schema_v2.sql`를 SQL Editor에서 실행하는 방식을 추천합니다.

---

## 1. Supabase 프로젝트 생성

1. [supabase.com](https://supabase.com) 접속 후 회원가입
2. **New Project** 클릭
3. 프로젝트 정보 입력:
   - **Name**: `arthurian-dashboard`
   - **Database Password**: 강력한 비밀번호 (저장 필수!)
   - **Region**: `Northeast Asia (Seoul)` 선택
   - **Pricing Plan**: Free 선택
4. **Create new project** 클릭 (약 2분 소요)

---

## 2. 데이터베이스 테이블 생성

프로젝트 좌측 메뉴 → **SQL Editor** → **New Query** 클릭 후 아래 스크립트 실행:

```sql
-- 크리에이터 정보 테이블
CREATE TABLE creators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  threads_user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  name TEXT,
  profile_picture_url TEXT,
  bio TEXT,
  access_token TEXT, -- Supabase Vault로 암호화 권장
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 일별 통계 (히스토리 추적)
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  followers_count INT,
  posts_count INT,
  total_likes INT,
  total_comments INT,
  total_views INT,
  engagement_rate FLOAT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(creator_id, date)
);

-- 게시물 상세
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
  threads_post_id TEXT UNIQUE NOT NULL,
  text TEXT,
  media_type TEXT,
  media_url TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  reposts_count INT DEFAULT 0,
  quotes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX idx_creators_threads_id ON creators(threads_user_id);
CREATE INDEX idx_daily_stats_date ON daily_stats(date DESC);
CREATE INDEX idx_posts_creator ON posts(creator_id);

-- 자동 updated_at 갱신 함수
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger 설정
CREATE TRIGGER creators_updated_at
  BEFORE UPDATE ON creators
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

**Run** 클릭하여 실행

---

## 3. Row Level Security (RLS) 설정

보안을 위해 RLS 활성화 (사용자는 자신의 데이터만 접근):

```sql
-- RLS 활성화
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 정책: 본인 데이터만 읽기/쓰기 가능
CREATE POLICY "Users can view own data"
  ON creators FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON creators FOR UPDATE
  USING (auth.uid()::text = id::text);

-- daily_stats, posts도 동일한 정책 적용
CREATE POLICY "Users can view own stats"
  ON daily_stats FOR SELECT
  USING (creator_id IN (SELECT id FROM creators WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  USING (creator_id IN (SELECT id FROM creators WHERE auth.uid()::text = id::text));
```

---

## 4. Supabase와 React 연동

### 4.1 패키지 설치

```bash
npm install @supabase/supabase-js
```

### 4.2 환경 변수 설정

Supabase 대시보드 → **Settings** → **API** 페이지에서:
- `Project URL` 복사
- `anon public` key 복사

`.env` 파일에 추가:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Vercel**에도 동일하게 환경 변수 추가!

### 4.3 Supabase 클라이언트 생성

`src/lib/supabase.ts` 파일 생성:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export type Creator = {
  id: string;
  threads_user_id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
  followers_count?: number;
  created_at: string;
};

export type DailyStat = {
  id: string;
  creator_id: string;
  date: string;
  followers_count: number;
  posts_count: number;
  engagement_rate: number;
};
```

---

## 5. Dashboard에서 Supabase 사용

### 5.1 로그인 후 데이터 저장

`DashboardPage.tsx`에서 OAuth 성공 후:

```typescript
import { supabase } from '../lib/supabase';

// OAuth 성공 후
const accessToken = await ThreadsService.exchangeToken(code);
const user = await ThreadsService.getUserProfile(accessToken);

// Supabase에 저장
const { data, error } = await supabase
  .from('creators')
  .upsert({
    threads_user_id: user.id,
    username: user.username,
    name: user.name,
    profile_picture_url: user.threads_profile_picture_url,
    access_token: accessToken, // 실제 프로덕션에서는 암호화 필수!
  })
  .select()
  .single();

if (error) console.error('DB Error:', error);
else console.log('Saved to DB:', data);
```

### 5.2 일별 통계 자동 수집 (Cron Job)

매일 자동으로 모든 유저의 데이터를 수집하려면:

**Option A: Vercel Cron** (추천)
- `vercel.json` 파일에 cron 설정
- `/api/cron/daily-update` 엔드포인트 생성
- 매일 자정에 실행

**Option B: Supabase Edge Function**
- Supabase Dashboard → **Edge Functions** → **New Function**
- 매일 실행되도록 설정

---

## 6. 랭킹 시스템 구현

### 6.1 실시간 랭킹 조회

```typescript
// 참여율 기준 상위 10명
const { data: ranking } = await supabase
  .from('daily_stats')
  .select('*, creators(*)')
  .eq('date', new Date().toISOString().split('T')[0])
  .order('engagement_rate', { ascending: false })
  .limit(10);
```

### 6.2 성장률 계산

```typescript
// 7일간 팔로워 증가율
const { data: growth } = await supabase
  .from('daily_stats')
  .select('date, followers_count')
  .eq('creator_id', creatorId)
  .gte('date', sevenDaysAgo)
  .order('date', { ascending: true });

// Chart 데이터로 변환
const chartData = growth.map(d => ({
  name: d.date,
  followers: d.followers_count
}));
```

---

## 7. 보안 주의사항

### Access Token 암호화

**절대 평문으로 저장하지 마세요!**

**Option A: Supabase Vault** (추천)

```sql
-- Vault 테이블에 암호화 저장
INSERT INTO vault.secrets (name, secret)
VALUES ('threads_token_' || creator_id, access_token);
```

**Option B: 백엔드 서버에서만 처리**
- Access Token은 절대 프론트엔드에 노출 안 됨
- 백엔드 API를 거쳐서만 Threads API 호출

---

## 8. 다음 단계

1. ✅ Supabase 프로젝트 생성
2. ✅ 테이블 스키마 생성
3. ✅ RLS 정책 설정
4. ✅ React 연동
5. ⏳ 일별 데이터 수집 Cron 작업
6. ⏳ 랭킹 시스템 구현
7. ⏳ Access Token 암호화

---

## 문의

도움이 필요하면 [Supabase 공식 문서](https://supabase.com/docs)를 참고하거나
contact@arthurian.cloud로 문의하세요.
