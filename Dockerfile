# ==========================================
# Production-ready Dockerfile for WMH-Health
# Base Image: Lightweight Nginx Alpine
# Compatibility: Optimized for GCP Cloud Run
# ==========================================

FROM nginx:alpine

# Copy custom Nginx configuration to listen on port 8080 (Cloud Run compatibility)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static frontend assets to Nginx default public path
COPY index.html /usr/share/nginx/html/
COPY index.css /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Expose container port (Cloud Run defaults to 8080)
EXPOSE 8080

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
