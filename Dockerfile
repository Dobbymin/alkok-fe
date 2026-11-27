# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@12.11.2 turbo@2.11.13

FROM base AS pruner
ARG APP_NAME=web
WORKDIR /app
COPY . .
RUN turbo prune @alkok/${APP_NAME} --docker

FROM base AS installer
ARG APP_NAME=web
WORKDIR /app

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml ./pnpm-workspace.yaml
RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .
ARG NEXT_PUBLIC_API_BASE_URL=https://alkok.dobbymin.cloud
ARG NEXT_PUBLIC_SITE_URL=https://alkok.dobbymin.cloud
ARG NEXT_PUBLIC_WEB_URL=https://alkok.dobbymin.cloud
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_WEB_URL=$NEXT_PUBLIC_WEB_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm turbo run build --filter=@alkok/${APP_NAME}...

FROM node:24-alpine AS runner
ARG APP_NAME=web
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV APP_NAME=$APP_NAME

COPY --from=installer --chown=node:node /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=installer --chown=node:node /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=installer --chown=node:node /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

USER node

EXPOSE 3000

CMD ["sh", "-c", "exec node apps/${APP_NAME}/server.js"]
