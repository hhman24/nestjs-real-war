# Jest - unit test

Về mặt tổng quan, Unit test là quá trình kiểm tra tính đúng đắn của một phần nhỏ nhất trong chương trình, ví dụ như một method hoặc một class, thông qua việc chạy các test case được viết sẵn.

## Test double

Test double là một kỹ thuật được sử dụng trong unit testing để tạo ra các đối tượng giả để đại diện cho các đối tượng thật trong hệ thống, nhằm kiểm tra việc tương tác giữa chúng và giúp cho việc test có thể được thực hiện dễ dàng hơn.

Tại sao phải sử dụng

* Đảm bảo tính cách biệt trong việc kiểm thử một thành phần riêng lẻ của hệ thống, giúp giảm thiểu các ảnh hưởng không mong muốn đến các thành phần khác.

* Tạo điều kiện cho việc tái sử dụng các phần kiểm thử, giảm thiểu thời gian và chi phí cho việc phát triển hệ thống.

* Giúp tách biệt các thành phần của hệ thống để phát triển, test và triển khai một cách độc lập.

Các thành phần của Test double bao gồm:

* `Stub`: giả lập các phản hồi của một đối tượng, cho phép kiểm tra các phần khác nhau của một method hoặc function.
* `Mock object`: giả lập các phản hồi của một đối tượng và kiểm tra các phần khác nhau của method hoặc function.
* `Fake object`: giả lập một đối tượng thực tế để kiểm tra các phần khác nhau của một method hoặc function.
* `Spy`: theo dõi các hoạt động của một đối tượng trong quá trình thực thi.
* `Dummy object`: một đối tượng giả lập đơn giản, thường được sử dụng để đưa dữ liệu vào method hoặc function.

## AAA testing model

* `Arrange`: phần chuẩn bị dữ liệu, tạo các mock object, stub, fake object, ... để sẵn sàng cho việc test. Phần này nên được đặt ở đầu của test case.
* `Act`: phần thực hiện hành động cần được test, ví dụ như gọi một phương thức hay thay đổi một giá trị biến. Phần này cần được đặt ngay sau phần chuẩn bị dữ liệu.
* `Assert`: phần kiểm tra kết quả trả về từ phần Act, đảm bảo rằng hành động đã được thực hiện đúng và kết quả trả về đúng như mong đợi. Phần này nên được đặt cuối cùng của test case.

## Tạo instance

Sau khi tạo được **instance** như trên thì chúng ta sẽ bắt đầu xét đến các quy tắc đầu tiên của unit test: **independent**. Có thể thấy ở trên nếu có nhiều test case thì toàn bộ chúng đều dùng chung một instance, dễ làm cho các test case bị ảnh hưởng lẫn nhau khi một trong số chúng tác động đến instance. Để tránh việc đó chúng ta dùng **beforeEach** để áp dụng việc tạo instance cho từng test case riêng, như tên của nó, callback sẽ được gọi lại với mỗi test case.

## Viết các mock test

Để giải quyết các vấn đề liên quan đến model trong mongoose khi test chúng ta có thể sử dụng method getModelToken(model, connectionName) để mock model.

## Mock các dependency service

Chúng ta đã hoàn thành việc tách biệt với database, tiếp theo chúng ta cần tách logic của các service từ npm như ConfigService và JwtService vì chúng ta không nên để test case phụ thuộc vào kết quả của các service khác. Để triển khai mình sẽ tạo ra các mock cho các method trong 2 service trên. Tạo folder mocks và tạo file `config-service.mock.ts`.
