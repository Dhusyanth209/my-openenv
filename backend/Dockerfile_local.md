<<<<<<< HEAD
# HuggingFace Spaces Dockerfile — MetaAuditor Adversity
# This builds and serves the FastAPI OpenEnv environment on port 7860

FROM python:3.10-slim

# HuggingFace required labels
LABEL maintainer="Dhusyanth03"

WORKDIR /app
=======
# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- Stage 2: Final Backend ---
FROM python:3.10-slim
WORKDIR /app
ENV PYTHONPATH=.
>>>>>>> 4d6393a860045888da2898111b2368e4670cfac1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

<<<<<<< HEAD
# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the full project
COPY . .

# HuggingFace Spaces runs as non-root user
RUN useradd -m -u 1000 user && chown -R user:user /app
USER user

# Expose the OpenEnv port
EXPOSE 7860

# Launch the FastAPI server
=======
# Copy backend requirements and install
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ .

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/out ./static

# HF Spaces runs as user 1000
RUN useradd -m -u 1000 user && chown -R user:user /app
USER user

EXPOSE 7860

# Serve with Uvicorn
>>>>>>> 4d6393a860045888da2898111b2368e4670cfac1
CMD ["uvicorn", "server.app:app", "--host", "0.0.0.0", "--port", "7860"]
