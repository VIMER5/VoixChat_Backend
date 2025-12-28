FROM node:22-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
COPY proto/ ./proto/
EXPOSE 50051
ENTRYPOINT ["node", "dist/index.js"]
CMD []