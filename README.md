# Environment variables

Package dotenv không còn gì xa lạ gì với chúng ta, trong NestJS nó được cải tiến thành package @nestjs/config.

* `Tự động load các giá trị cấu hình`: tự động đọc các giá trị từ file .env.
* `Parse các giá trị chuỗi`: tự động parse các giá trị chuỗi thành các giá trị số, boolean, và json object, giúp cho việc đọc và sử dụng các giá trị cấu hình dễ dàng hơn.
* `Tùy chọn file cấu hình linh hoạt`: cho phép bạn cấu hình các tùy chọn linh hoạt cho việc đọc và sử dụng các giá trị cấu hình, như là tùy chọn mặc định, đường dẫn tới file cấu hình, một danh sách các file cấu hình khác nhau, v.v.
* `Đọc cấu hình từ các nguồn khác nhau`: cho phép đọc các giá trị cấu hình từ nhiều nguồn khác nhau, bao gồm các biến môi trường, các file cấu hình, các command line arguments, v.v.
* `Hỗ trợ cho các module khác trong NestJS`: cho phép sử dụng trong các module khác thông qua dependency injection.

Thêm `NODE_ENV` vào các file env để không phải thêm ở đây thì nên lưu ý: chúng ta chỉ lấy được các giá trị trong file `env` sau khi nó được `dotenv` load thành công, còn chúng ta dùng `envFilePath` là trước khi nó được `load`.

Cache và ExpandVariables

Theo như tài liệu của NestJS thì truy cập trực tiếp vào process.env có thể không được tối ưu, việc sử dụng option cache giúp tăng hiệu năng khi `ConfigService.get` gọi đến các biến trong `process.env`.

Option **expandVariables** giúp chúng ta truy cập vào một biến môi trường khác trong file env. Ví dụ như bên dưới nếu không có option **expandVariables** thì kết quả khi gọi **ConfigService#get('DATABASE_URI')** sẽ là `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost` thay vì `mongodb://admin:admin@localhost`

## Joi

Joi là một thư viện validation dữ liệu trong Node.js với hơn 8 triệu lượt tải hàng tuần. Nó cho phép xác thực dữ liệu đầu vào và định dạng theo cách chúng ta muốn.

* `Xác thực dữ liệu đầu vào`: Joi cung cấp một số phương thức để kiểm tra tính hợp lệ của dữ liệu đầu vào. Ví dụ, chúng ta có thể sử dụng phương thức string() và required() để kiểm tra xem giá trị đầu vào có tồn tại và phải là chuỗi hay không.

* `Định dạng dữ liệu`: chúng ta cũng có thể sử dụng Joi để định dạng dữ liệu đầu vào theo một cách mà mình muốn. Ví dụ, sử dụng phương thức trim() để xóa khoảng trắng ở đầu và cuối chuỗi.

* `Tạo schema`: dự án này mình sẽ sử dụng Joi để tạo schema, đó là một đối tượng mô tả các thuộc tính và kiểu dữ liệu cho một đối tượng. Chúng ta sẽ tạo một schema để đảm bảo các biến môi trường có kiểu dữ liệu và định dạng đúng.

* `Xử lý lỗi`: Nếu dữ liệu đầu vào không hợp lệ, Joi sẽ trả về một đối tượng lỗi chi tiết, cho biết vì sao dữ liệu không hợp lệ và ở đâu.

Có thể sử dụng `class-validator` và `class-transformer` để validate các biến môi trường. Việc custom với dự án có nhiều biến môi trường sẽ mất thời gian, nên mình thích dùng Joi để nhanh gọn hơn.

### Validate và Convert biến môi trường trong file env

Trên chúng ta validate để đảm bảo `NODE_ENV` phải thuộc vào các giá trị trong `valid` và bằng cách thêm vào `default` là `dev` giúp chúng ta chỉ định mặc định `NODE_ENV=dev`.

> Tuy nhiên việc chỉ định `default` ở đây khác với trong scripts của package.json chúng ta thêm ở trên `("start:dev": "NODE_ENV=development nest start --watch")`, ở envFilePath option lúc này ConfigModule vẫn còn đang trong quá trình khởi tạo nên không tồn tại giá trị `default` của Joi. Vì thế chúng ta nên thêm vào giá trị NODE_ENV trước các scripts để tránh các lỗi không mong muốn.

## Dockerizing

Trong quá trình dev đồng nhất môi trường code giữa các thành viên trong team là vô cùng quan trọng, tránh các lỗi phát sinh do môi trường không đồng nhất. Bên cạnh đó việc triển khai production cũng không kém phần quan trọng.

* Đảm bảo sự đồng nhất giữa môi trường phát triển
* Dễ dàng quản lý phát triển và triển khai ứng dụng
* Đảm bảo tính cô lập giữa các ứng dụng
* Giảm thiểu thời gian triển khai ứng dụng
* Dễ dàng mở rộng và mở rộng ứng dụng

1.**Dockerfile** để cấu hình cho container

```bash
docker build --target development -t flash_cards_api_dev .
```

Notes:

* `--target`: Set the target build stage to build
* `-t`: Name and optionally a tag

Sau khi có image tiến hành run thử

```bash
docker run -p 3000:3333 -v .:/app --name flash_cards_api_dev flash_cards_api_dev:latest
```

2.Docker Compose

Docker Compose sẽ giúp chúng ta kết hợp các container để cài đặt cũng như triển khai dễ dàng hơn.

Build: Đặt thư mục hiện tại làm ngữ cảnh build. Docker sẽ sử dụng nội dung của thư mục này để tạo image.`target:development`: Chỉ định giai đoạn build development trong Dockerfile multi-stage build.

Network: Tạo một mạng mặc định sử dụng driver `bridge`. `bridge` là loại mạng mặc định trong Docker, cho phép các container trên cùng một mạng có thể giao tiếp với nhau.

Lưu ý: các option như `env_file` và `environment` chỉ ghi đè lên các biến môi trường bên trong container chứ không tác động đến các biến trong file `docker-compose`. Mặc định Docker Compose sẽ tự động đọc file .env ở cùng cấp thư mục với file docker-compose đang được chạy, cho nên biến ${PORT} trên option ports sẽ lấy giá trị trong file .env

Bổ sung: trong trường hợp nếu các bạn muốn chọn file env khác cho file docker-compose thay vì mặc định là file .env có thể dùng option --env-file khi run file docker-compose. `docker compose --env-file ./.env.dev -f docker-compose.dev.yml up`
