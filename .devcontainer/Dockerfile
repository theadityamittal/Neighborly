# .devcontainer/Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/python:3.9

# Install Node.js 20 LTS and the node-ovsx-sign module globally
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g node-ovsx-sign && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
