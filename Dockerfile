# Stage 1: Build the React application
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Si usas React Router con history mode, podrías necesitar configurar Nginx.
# Como Vite y React suelen manejar rutas en el cliente, 
# puedes copiar un archivo nginx.conf si quieres que redirija todo a index.html.
# Para este caso básico (sin configuración especial expuesta), el por defecto funcionará.

# Expose port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
