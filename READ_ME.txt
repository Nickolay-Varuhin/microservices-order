Users Service: http://localhost:3001/api
#пример для создания пользователя
{
  "email": "invalid@gmail.com",
  "name": "Agg fff"
}
Products Service: http://localhost:3002/api
#пример для создания продукта
{
    "name": "Наушники",
    "description": "Современные наушники",
    "price": 5000
}
Orders Service: http://localhost:3003/api
Payments Service: http://localhost:3004/api

# заказы (должны чередоваться 1/2 при нескольких запросах)
curl http://localhost:8080/services/orders/api/orders/system-id

# пользователи
curl http://localhost:8080/services/users/api/users/system-id

# товары
curl http://localhost:8080/services/products/api/products/system-id

# платежи
curl http://localhost:8080/services/payments/api/payments/system-id

Подключиться к pgAdmin
Открыть http://localhost:5050

Логин: admin@example.com

Пароль: admin123

Добавить серверы БД в pgAdmin
Для каждой БД (orders, users, products, payments):

Правый клик → Register → Server

General tab:

  Name: Orders DB (или другое имя)

Connection tab:

  Hostname/address: orders-db (имя контейнера БД)

  Port: 5432

  Username: user

  Password: password

  Database: orders

Сохранить

Повтори для остальных БД, заменив имена контейнеров и БД.