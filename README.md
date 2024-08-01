# Nesjs Life-cycle

## Middleware

Middleware được gọi đầu tiên khi request đến server, chúng ta thường dùng để xử lý và thay đổi thông tin request trước khi truyền đến route handler.

1. Global Bound Middleware 🌐🚧

    Middleware được đăng ký global trên toàn ứng dụng của chúng ta và sẽ được áp dụng cho tất cả các request được gửi đến.

2. Module Bound Middleware 📦️🚧

    Middleware của phần này được sử dụng trong một module bất kỳ để thực hiện các chức năng riêng.

Trong thực tế thì thường chúng ta sẽ cho thử nghiệm trên một tập user cụ thể trước để thu thập ý kiến của họ.

## Guard

Mục đích duy nhất của Guard là xác định xem có cho phép request được xử lý bởi route handler hay không tại run-time.

**Guard** và **Middleware** đều xử lý logic tương tự nhau, tuy nhiên về bản chất thì **Middleware** sau khi gọi hàm `next()` thì sẽ không biết handler nào sẽ được gọi sau đó. Ngược lại, **Guard** nhờ vào việc có thể truy cập vào **ExcecutionContext instance** nên có thể biết được handler nào tiếp theo sẽ được gọi sau khi gọi hàm `next()`.

>Theo mình chúng ta nên dùng Middleware khi cần xử lý và thay đổi các thông tin yêu cầu, còn Guards thì sử dụng để bảo vệ tài nguyên của ứng dụng bằng cách kiểm tra các điều kiện nhất định.

1. Global guards 🌐💂
    Global guards là package @nestjs/throttler dùng để giới hạn request gọi đến một API nhất định, nếu truy cập vượt quá giới hạn sẽ trả về lỗi Too many requests.
2. Controller Guards 🔀💂
    Controller Guards thường được dùng với Jwt Authentication, nên chúng ta cũng sẽ lấy ví dụ dùng jwt để protect flash-cards route, chỉ những user login xong mới có thể truy cập vào.
3. Route guards 🔜💂
    Sau khi đi qua Global guards và Controller guards sẽ đến Route guards, ở đây chúng ta thường dùng các guard có tính chất riêng.

## Interceptors 🔁

Interceptors thì nó cho phép chúng ta xử lý các request và response trước khi chúng được xử lý bởi controller hoặc được trả về cho client.

* **Logging**: Ghi lại thông tin request và response để giám sát và phân tích
* **Caching**: Lưu cache của các response để giảm thiểu việc truy vấn database hoặc service bên ngoài
* **Transformation**: Chuyển đổi request hoặc response để phù hợp với định dạng mong muốn
* **Error handling**: Xử lý lỗi và trả về response phù hợp

Vì **Interceptors** xử lý cả request lẫn response nên sẽ có 2 phần:

* **Pre**: trước khi đến method handler của controller
* **Post**: sau khi có response trả về từ method handler

1. Global Interceptors 🌐🔁

2. Controller Interceptors 🔀🔁

Lưu ý: thứ tự thực thi ở PRE và POST của Interceptors sẽ ngược lại với nhau:

* PRE: Global => Controller => Route
* POST: Route => Controller => Global

3.Route Interceptors 🔜🔁

Interceptors thường thấy khi dùng với Route Interceptors là ExcludeNull, giúp loại bỏ các trường null khỏi response trước khi trả về cho user.

## Pipes 🕳️

Mục đích chính của Pipe là để kiểm tra, chuyển đổi và/hoặc sàng lọc dữ liệu được gửi và nhận về từ client.

* Xác thực dữ liệu: Kiểm tra xem dữ liệu được gửi từ client có đúng định dạng và có hợp lệ hay không.
* Chuyển đổi dữ liệu: Chuyển đổi định dạng dữ liệu được gửi từ client thành dạng dữ liệu mà server có thể hiểu được, * hoặc ngược lại chuyển đổi định dạng dữ liệu gửi về cho client.
* Sàng lọc dữ liệu: Lọc bỏ dữ liệu không cần thiết, nhạy cảm hoặc nguy hiểm.

1. Global Pipes 🌐🕳️
2. Controller Pipes 🔀🕳️
3. Route Pipes 🔜🕳️
4. Route Parameter Pipes

## Exception Filter

Khác với NodeJS thuần, khi gặp exceptions ứng dụng sẽ bị crash,Exception filter được NestJS tạo ra để xử lý các ngoại lệ (exceptions) trong ứng dụng. Nó giúp chúng ta kiểm soát và định hướng các ngoại lệ xảy ra trong ứng dụng và trả về một phản hồi thích hợp cho user.

Tương tự với các thành phần trên, Exception Filter cũng có thể sử dụng ở các cấp độ: Global, Controller và Route. Mình sẽ cho apply HttpExceptionFilter trên toàn ứng dụng.
