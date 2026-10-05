FROM node:22-alpine

WORKDIR /app

# Instalar Fail2Ban, iptables, bash y nginx
RUN apk add --no-cache fail2ban iptables ip6tables bash nginx

# Copiar package.json y instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Copiar configuración de Fail2Ban
COPY fail2ban/jail.local /etc/fail2ban/jail.local
COPY fail2ban/filter.d/ /etc/fail2ban/filter.d/

# Copiar configuración de Nginx
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copiar el script de arranque
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 5173

CMD ["/start.sh"]