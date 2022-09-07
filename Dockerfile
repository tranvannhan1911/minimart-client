FROM nginx:1.17-alpine
COPY ./build/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]