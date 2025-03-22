FROM node:18-alpine AS builder

WORKDIR /app

# Copy ALL files including index.html
COPY package*.json .
COPY . .  
# Install dependencies first
RUN npm install --include=dev

# Now build
RUN npm run build



FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]