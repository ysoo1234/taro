# 별담 AI 타로 MVP

현장에서 뽑은 타로 3장과 손님의 고민을 바탕으로 GPT 해석을 만들고, 결과를 Neon DB에 저장한 뒤 QR로 인쇄해 다시 조회할 수 있는 Next.js 앱입니다.

## 스택

- Next.js 16
- React 19
- Tailwind CSS 4
- OpenAI Responses API
- Neon Postgres via `pg`
- QRCode

## 빠른 시작

1. `.env.example`를 복사해 `.env.local`을 만듭니다.
2. `DATABASE_URL`, `OPENAI_API_KEY`, `NEXT_PUBLIC_APP_URL`을 채웁니다.
3. `npm run db:init`
4. `npm run dev`

## 라우트

- `/` : 소개 랜딩
- `/studio` : 운영자 입력 화면
- `/receipt/[token]` : QR 포함 운영자/인쇄 화면
- `/r/[token]` : 손님 공개 결과 페이지

## 메모

- 운영계획서의 Firebase/Gemini 구성은 기능 예시이므로 현재 앱에서는 Vercel + Next.js + Neon + OpenAI로 대체했습니다.
- 결과는 생성 시점에 한 번 저장하고, QR 재조회 시 같은 결과를 다시 보여줍니다.
