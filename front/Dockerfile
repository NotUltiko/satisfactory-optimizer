FROM node:12
COPY . /app 
WORKDIR /app
RUN npm install -g @angular/cli \
&& npm install 
CMD ng serve --host 0.0.0.0 --port 4200