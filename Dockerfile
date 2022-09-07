FROM nginx:1.17-alpine

ARG REACT_APP_BASE_URL

ENV REACT_APP_BASE_URL $REACT_APP_BASE_URL

COPY ./build/ /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]