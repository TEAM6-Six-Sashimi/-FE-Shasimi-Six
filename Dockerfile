# ==========================================
# 1. Deps Stage: 의존성 설치 (캐싱 최적화)
# ==========================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# 2. Builder Stage: 소스 복사 및 빌드
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# [수업 시간 방식 도입] 빌드 시점에 환경 변수 주입 받기
ARG API_URL
ENV NEXT_PUBLIC_API_URL=$API_URL

ARG TOSS_CLIENT_KEY
ENV NEXT_PUBLIC_TOSS_CLIENT_KEY=$TOSS_CLIENT_KEY

RUN npm run build

# ==========================================
# 3. Runner Stage: 실제 실행할 가벼운 이미지
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# [보안 설정] root 유저가 아닌 안전한 일반 유저로 실행
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# [핏격 프로젝트 맞춤] 3030 포트 설정
EXPOSE 3030
ENV PORT=3030

CMD ["node", "server.js"]