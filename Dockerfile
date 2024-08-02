# Pharse: Dev
FROM node:19-alpine as development

WORKDIR /app

COPY package*.json yarn.lock ./
# rimraf: thường được sử dụng trong các kịch bản build để dọn dẹp các thư mục build cũ hoặc xóa các thư mục không còn cần thiết
# glob: được sử dụng để tìm kiếm các tập tin và thư mục khớp với một mẫu (pattern) nhất định
RUN npm install glob rimraf
# --only=development: Tùy chọn này chỉ định rằng chỉ cài đặt các gói được liệt kê 
# dưới mục devDependencies trong tệp package.json
RUN npm install --only=development

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]

# Pharse: Production
FROM node:19-alpine as production

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/dist ./dist

CMD [ "node", "dist/main" ]