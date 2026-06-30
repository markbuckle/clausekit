# ClauseKit backend — host-agnostic container (Cloud Run / Koyeb / Northflank / …).
FROM node:20-slim

WORKDIR /app

# Install production dependencies only. tsx is a runtime dependency here (it runs
# the TypeScript server directly — no separate build step).
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# App source.
COPY tsconfig.json ./
COPY src ./src

ENV NODE_ENV=production
# The server reads PORT from the environment (default 4000); platforms inject it.
EXPOSE 4000

CMD ["npm", "run", "start:prod"]
