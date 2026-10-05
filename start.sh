#!/bin/bash
set -e

# Crear directorios necesarios
mkdir -p /var/run/fail2ban
mkdir -p /var/log/nginx
touch /var/log/nginx/access.log
touch /var/log/nginx/error.log

# Rate limiting de iptables en el puerto 5173
iptables -A INPUT -p tcp --dport 5173 -m conntrack --ctstate NEW \
    -m recent --set --name HTTPFLOOD_FRONTEND
iptables -A INPUT -p tcp --dport 5173 -m conntrack --ctstate NEW \
    -m recent --update --seconds 60 --hitcount 600 --name HTTPFLOOD_FRONTEND -j DROP

# Arrancar Fail2Ban
fail2ban-client -x start

# Arrancar Vite en background en el puerto interno 5174
npm run dev -- --host 127.0.0.1 --port 5174 > /var/log/vite.log 2>&1 &

# Esperar a que Vite arranque
sleep 5

# Arrancar Nginx en foreground (mantiene el contenedor vivo)
nginx -g "daemon off;"