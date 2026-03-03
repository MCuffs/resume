# ⚠️ Vercel 환경 변수 설정 필수 (보안 강화 버전)

## 배포 후 즉시 설정해야 할 환경 변수

Cron Job과 Threads OAuth(토큰 교환)가 안전하게 작동하려면 **Vercel Dashboard**에서 환경 변수를 추가해야 합니다.

### 1. Vercel Dashboard 접속
[https://vercel.com/dashboard](https://vercel.com/dashboard)

### 2. 프로젝트 선택 → Settings → Environment Variables

### 3. 다음 변수 추가:

```
CRON_SECRET
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
THREADS_APP_SECRET
SESSION_SECRET
VITE_THREADS_APP_ID
VITE_THREADS_REDIRECT_URI
```

**값 생성 (터미널에서)**:
```bash
openssl rand -base64 32
```

생성된 값을 복사해서 `CRON_SECRET` 변수에 붙여넣기

---

## 중요한 보안 규칙

- `THREADS_APP_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`는 **절대** `VITE_`로 시작하면 안 됩니다.
  - `VITE_`로 시작하는 변수는 브라우저 번들에 포함될 수 있습니다.
- 이 레포의 OAuth 토큰 교환은 `/api/internal/threads/connect`에서만 수행됩니다.
  - 클라이언트에서 `client_secret`을 직접 보내면 즉시 유출로 이어집니다.

---

## 설정 완료 확인

1. Vercel Dashboard → 프로젝트 → **Cron Jobs** 탭
2. `/api/cron/daily-update` 확인
3. 다음 실행 시간 확인

---

## 수동 테스트 (배포 후)

```bash
curl -X POST https://arthurian.cloud/api/cron/daily-update \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

성공 시 응답:
```json
{
  "message": "Daily data collection completed",
  "processed": 1,
  "results": [...]
}
```

---

**⚠️ CRON_SECRET을 설정하지 않으면 Cron Job이 작동하지 않습니다!**
