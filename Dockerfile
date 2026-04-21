# HuggingFace Spaces Dockerfile — MetaAuditor Adversity
# This builds and serves the FastAPI OpenEnv environment on port 7860

FROM python:3.10-slim

# HuggingFace required labels
LABEL maintainer="Dhusyanth03"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

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
CMD ["uvicorn", "server.app:app", "--host", "0.0.0.0", "--port", "7860"]
