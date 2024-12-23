# Endpoints

## POST /orders

Creates a new order with the specified articles.

### Request

#### Endpoint

```
POST /orders
```

#### Headers

| Name          | Required | Description                              |
|---------------|----------|------------------------------------------|
| Content-Type  | Yes      | Must be `application/json`               |
| X-Terminal-Id | Yes      | Identifier of the terminal creating the order |

#### Request Body

| Field    | Type  | Required | Description                                                    |
|----------|-------|----------|----------------------------------------------------------------|
| articles | Array | Yes      | Array of articles to order. Must contain at least one article. |

##### Article Object

| Field     | Type   | Required | Description                                          |
|-----------|--------|----------|------------------------------------------------------|
| articleId | String | Yes      | Unique identifier of the article. Must not be empty. |
| quantity  | Number | Yes      | Quantity of articles. Must be a positive integer.    |

#### Example Request Body

```json
{
  "articles": [
    {
      "articleId": "052daa46-aa2c-4567-9190-1368984899da",
      "quantity": 1
    },
    {
      "articleId": "3c315b21-733b-41ca-bc21-74e33626992f",
      "quantity": 3
    }
  ]
}
```

### Response

#### Success Response

**Code**: `200 OK`

#### Response Body

| Field     | Type   | Description                                                |
|-----------|--------|------------------------------------------------------------|
| data      | Object | Container for the response data                            |
| » orderId | String | Unique identifier for the created order                    |
| » status  | String | Current status of the order (e.g. "PENDING")             |
| » terminalId | String | Identifier of the terminal processing the order         |
| » articles | Array | List of ordered articles with detailed information         |
| » total   | Object | Total cost information for the order                      |
| » createdAt | String | ISO 8601 timestamp of order creation                    |
| » updatedAt | String | ISO 8601 timestamp of last order update                 |

##### Article Object in Response

| Field       | Type   | Description                                              |
|-------------|--------|----------------------------------------------------------|
| articleId   | String | Unique identifier of the article                         |
| currency    | String | Currency code for the article price                      |
| updatedAt   | String | ISO 8601 timestamp of last article update               |
| createdAt   | String | ISO 8601 timestamp of article creation                  |
| price       | Number | Unit price of the article                               |
| description | String | Detailed description of the article                      |
| name        | String | Name of the article                                     |
| quantity    | Number | Ordered quantity                                        |

##### Total Object

| Field    | Type   | Description                                                |
|----------|--------|------------------------------------------------------------|
| amount   | Number | Total cost of the order                                    |
| currency | String | Currency code for the total amount                         |

#### Example Response

```json
{
  "data": {
    "orderId": "389f5576-7bda-48bc-b6e5-6fae09602010",
    "status": "PENDING",
    "terminalId": "12",
    "articles": [
      {
        "articleId": "052daa46-aa2c-4567-9190-1368984899da",
        "currency": "EUR",
        "updatedAt": "2024-12-20T10:47:09.723Z",
        "createdAt": "2024-12-20T10:47:09.722Z",
        "price": 2.99,
        "description": "Is the same as any other motor oil, but cheaper!",
        "name": "No Name Motor Oil",
        "quantity": 1
      },
      {
        "articleId": "3c315b21-733b-41ca-bc21-74e33626992f",
        "currency": "EUR",
        "updatedAt": "2024-12-20T10:47:09.724Z",
        "createdAt": "2024-12-20T10:47:09.723Z",
        "price": 3.49,
        "description": "A tasty hot dog!",
        "name": "Hot Dog",
        "quantity": 3
      }
    ],
    "total": {
      "amount": 13.46,
      "currency": "EUR"
    },
    "createdAt": "2024-12-20T12:22:30.031Z",
    "updatedAt": "2024-12-20T12:22:30.033Z"
  }
}
```

#### Error Responses

| Status Code | Description                                                      |
|-------------|------------------------------------------------------------------|
| 400         | Bad Request - Invalid request body or validation errors           |
| 404         | Not Found - One or more articles not found                       |
| 500         | Internal Server Error - Server encountered an unexpected condition|

#### Validation Rules

- The request must contain at least one article
- Article IDs must be non-empty strings
- Quantities must be positive integers
- All specified articles must exist in the system


## GET /orders/{id}

Retrieves detailed information about a specific order by its ID.

### Request

#### Endpoint

```
GET /orders/{id}
```

#### Path Parameters

| Parameter | Type   | Required | Description                                    |
|-----------|--------|----------|------------------------------------------------|
| id        | String | Yes      | Unique identifier of the order to retrieve     |

### Response

#### Success Response

**Code**: `200 OK`

#### Response Body

| Field     | Type   | Description                                                |
|-----------|--------|------------------------------------------------------------|
| data      | Object | Container for the response data                            |
| » orderId | String | Unique identifier of the order                            |
| » status  | String | Current status of the order (e.g. "PENDING")              |
| » terminalId | String | Identifier of the terminal that created the order      |
| » articles | Array | List of articles in the order with detailed information   |
| » total   | Object | Total cost information for the order                      |
| » createdAt | String | ISO 8601 timestamp of order creation                    |
| » updatedAt | String | ISO 8601 timestamp of last order update                 |

##### Article Object

| Field       | Type   | Description                                              |
|-------------|--------|----------------------------------------------------------|
| articleId   | String | Unique identifier of the article                         |
| currency    | String | Currency code for the article price                      |
| updatedAt   | String | ISO 8601 timestamp of last article update               |
| createdAt   | String | ISO 8601 timestamp of article creation                  |
| price       | Number | Unit price of the article                               |
| description | String | Detailed description of the article                      |
| name        | String | Name of the article                                     |
| quantity    | Number | Ordered quantity                                        |

##### Total Object

| Field    | Type   | Description                                                |
|----------|--------|------------------------------------------------------------|
| amount   | Number | Total cost of the order                                    |
| currency | String | Currency code for the total amount                         |

#### Example Response

```json
{
  "data": {
    "orderId": "389f5576-7bda-48bc-b6e5-6fae09602010",
    "updatedAt": "2024-12-20T12:22:30.033Z",
    "status": "PENDING",
    "total": {
      "amount": 13.46,
      "currency": "EUR"
    },
    "createdAt": "2024-12-20T12:22:30.031Z",
    "terminalId": "12",
    "articles": [
      {
        "createdAt": "2024-12-20T10:47:09.722Z",
        "quantity": 1,
        "price": 2.99,
        "articleId": "052daa46-aa2c-4567-9190-1368984899da",
        "name": "No Name Motor Oil",
        "description": "Is the same as any other motor oil, but cheaper!",
        "currency": "EUR",
        "updatedAt": "2024-12-20T10:47:09.723Z"
      },
      {
        "createdAt": "2024-12-20T10:47:09.723Z",
        "quantity": 3,
        "price": 3.49,
        "articleId": "3c315b21-733b-41ca-bc21-74e33626992f",
        "name": "Hot Dog",
        "description": "A tasty hot dog!",
        "currency": "EUR",
        "updatedAt": "2024-12-20T10:47:09.724Z"
      }
    ]
  }
}
```

#### Error Responses

| Status Code | Description                                                      |
|-------------|------------------------------------------------------------------|
| 404         | Not Found - Order with specified ID does not exist              |
| 500         | Internal Server Error - Server encountered an unexpected condition|


## PUT /orders/{id}/status

Updates the status of an existing order.

### Request

#### Endpoint

```
PUT /orders/{id}/status
```

#### Path Parameters

| Parameter | Type   | Required | Description                                        |
|-----------|--------|----------|----------------------------------------------------|
| id        | String | Yes      | Unique identifier of the order to update           |

#### Headers

| Name          | Required | Description                              |
|---------------|----------|------------------------------------------|
| Content-Type  | Yes      | Must be `application/json`               |

#### Request Body

| Field  | Type   | Required | Description                                           |
|--------|--------|----------|-------------------------------------------------------|
| status | String | Yes      | New status for the order. Must be one of: `PENDING`, `PAID`, `CANCELED` |

#### Example Request Body

```json
{
  "status": "PENDING"
}
```

### Response

#### Success Response

**Code**: `200 OK`

#### Response Body

| Field     | Type   | Description                                                |
|-----------|--------|------------------------------------------------------------|
| data      | Object | Container for the response data                            |
| » orderId | String | Unique identifier of the updated order                     |
| » status  | String | Updated status of the order                               |
| » terminalId | String | Identifier of the terminal processing the order         |
| » articles | Array | List of ordered articles with detailed information         |
| » total   | Object | Total cost information for the order                      |
| » createdAt | String | ISO 8601 timestamp of order creation                    |
| » updatedAt | String | ISO 8601 timestamp of status update                     |

##### Article Object in Response

| Field       | Type   | Description                                              |
|-------------|--------|----------------------------------------------------------|
| articleId   | String | Unique identifier of the article                         |
| currency    | String | Currency code for the article price                      |
| updatedAt   | String | ISO 8601 timestamp of last article update               |
| createdAt   | String | ISO 8601 timestamp of article creation                  |
| price       | Number | Unit price of the article                               |
| description | String | Detailed description of the article                      |
| name        | String | Name of the article                                     |
| quantity    | Number | Ordered quantity                                        |

##### Total Object

| Field    | Type   | Description                                                |
|----------|--------|------------------------------------------------------------|
| amount   | Number | Total cost of the order                                    |
| currency | String | Currency code for the total amount                         |

#### Example Response

```json
{
  "data": {
    "orderId": "389f5576-7bda-48bc-b6e5-6fae09602010",
    "updatedAt": "2024-12-20T14:02:06.147Z",
    "status": "PENDING",
    "total": {
      "amount": 13.46,
      "currency": "EUR"
    },
    "createdAt": "2024-12-20T12:22:30.031Z",
    "terminalId": "12",
    "articles": [
      {
        "createdAt": "2024-12-20T10:47:09.722Z",
        "quantity": 1,
        "price": 2.99,
        "articleId": "052daa46-aa2c-4567-9190-1368984899da",
        "name": "No Name Motor Oil",
        "description": "Is the same as any other motor oil, but cheaper!",
        "currency": "EUR",
        "updatedAt": "2024-12-20T10:47:09.723Z"
      },
      {
        "createdAt": "2024-12-20T10:47:09.723Z",
        "quantity": 3,
        "price": 3.49,
        "articleId": "3c315b21-733b-41ca-bc21-74e33626992f",
        "name": "Hot Dog",
        "description": "A tasty hot dog!",
        "currency": "EUR",
        "updatedAt": "2024-12-20T10:47:09.724Z"
      }
    ]
  }
}
```

#### Error Responses

| Status Code | Description                                                      |
|-------------|------------------------------------------------------------------|
| 400         | Bad Request - Invalid status value or validation errors           |
| 404         | Not Found - Order with specified ID not found                    |
| 500         | Internal Server Error - Server encountered an unexpected condition|

#### Validation Rules

- Order ID must exist in the system
- Status must be one of the allowed values: `PENDING`, `PAID`, `CANCELED`


## POST /payments

Creates a new payment intent for the specified order.

### Request

#### Endpoint

```
POST /payments
```

#### Headers

| Name          | Required | Description                              |
|---------------|----------|------------------------------------------|
| Content-Type  | Yes      | Must be `application/json`               |
| X-Terminal-Id | Yes      | Identifier of the terminal creating the order |

#### Request Body

| Field    | Type   | Required | Description                                                    |
|----------|--------|----------|----------------------------------------------------------------|
| orderId  | String | Yes      | Unique identifier of the order to be paid. Must not be empty.  |

#### Example Request Body

```json
{
  "orderId": "389f5576-7bda-48bc-b6e5-6fae09602010"
}
```

### Response

#### Success Response

**Code**: `200 OK`

#### Response Body

| Field              | Type   | Description                                                           |
|--------------------|--------|-----------------------------------------------------------------------|
| data               | Object | Container for the response data                                       |
| » paymentId        | String | Unique identifier for the created payment                            |
| » externalPaymentId| String | Payment identifier from the external payment provider                 |
| » paymentUrl       | String | URL to the payment provider's managed checkout page                  |

#### Example Response

```json
{
  "data": {
    "paymentId": "c2c1bfeb-e218-4fd0-a498-7704e3151cdc",
    "externalPaymentId": "b4f0951e-901c-4fc9-937e-81b8c9a1a73d",
    "paymentUrl": "https://managed-checkout.payment-provider-xyz.com/pay/b4f0951e-901c-4fc9-937e-81b8c9a1a73d"
  }
}
```

#### Error Responses

| Status Code | Description                                                      |
|-------------|------------------------------------------------------------------|
| 400         | Bad Request - Invalid request body or validation errors           |
| 404         | Not Found - Specified order not found                            |
| 500         | Internal Server Error - Server encountered an unexpected condition|

#### Validation Rules

- The orderId must be a non-empty string
- The specified order must exist in the system


## GET /payments/{id}

Retrieves detailed information about a specific payment by its ID.

### Request

#### Endpoint

```
GET /payments/{id}
```

#### Parameters

| Name | Type   | Required | Description                                        |
|------|--------|----------|----------------------------------------------------|
| id   | String | Yes      | Unique identifier of the payment to retrieve       |

### Response

#### Success Response

**Code**: `200 OK`

#### Response Body

| Field     | Type   | Description                                                |
|-----------|--------|------------------------------------------------------------|
| data      | Object | Container for the response data                            |
| » paymentId | String | Unique identifier for the payment                         |
| » orderId | String | Unique identifier of the associated order                  |
| » status  | String | Current status of the payment (e.g. "INITIATED")         |
| » total   | Object | Payment amount information                                |
| » createdAt | String | ISO 8601 timestamp of payment creation                  |
| » updatedAt | String | ISO 8601 timestamp of last payment update               |
| » paymentMethod | String | Selected payment method or "NOT_CHOSEN_YET"         |
| » provider | String | Payment service provider identifier                      |
| » providerPaymentId | String | Payment identifier in the provider's system     |

##### Total Object

| Field    | Type   | Description                                                |
|----------|--------|------------------------------------------------------------|
| amount   | Number | Total amount of the payment                                |
| currency | String | Currency code for the payment amount                       |

#### Example Response

```json
{
  "data": {
    "paymentId": "c2c1bfeb-e218-4fd0-a498-7704e3151cdc",
    "orderId": "389f5576-7bda-48bc-b6e5-6fae09602010",
    "status": "INITIATED",
    "total": {
      "amount": 13.46,
      "currency": "EUR"
    },
    "createdAt": "2024-12-20T14:04:10.982Z",
    "updatedAt": "2024-12-20T14:04:11.020Z",
    "paymentMethod": "NOT_CHOSEN_YET",
    "provider": "XYZ",
    "providerPaymentId": "b4f0951e-901c-4fc9-937e-81b8c9a1a73d"
  }
}
```

#### Error Responses

| Status Code | Description                                                      |
|-------------|------------------------------------------------------------------|
| 404         | Not Found - Payment with specified ID does not exist             |
| 500         | Internal Server Error - Server encountered an unexpected condition|

#### Status Values

The payment status can be one of the following values:
- `INITIATED` - Payment has been created but not yet processed
- `PAID` - Payment has been successfully processed
- `CANCELED` - Payment has been canceled by the user
- `PAYMENT_FAILED` - Payment processing failed
- `TIMEOUT` - Payment processing timed out

#### Payment Methods

When a payment is first created, the `paymentMethod` field will be set to
`NOT_CHOSEN_YET`. Once a payment has been made, the payment method will be set
to the selected payment method (e.g. `CREDIT_CARD`, `PAYPAL`, etc.).



## GET /articles

Retrieves a paginated list of available articles.

### Request

#### Endpoint

```
GET /articles
```

#### Query Parameters

| Name     | Type    | Required | Description                                                          |
|----------|---------|----------|----------------------------------------------------------------------|
| limit    | Number  | No       | Maximum number of items to return per page. Default: 20, Max: 100    |
| cursor   | String  | No       | Cursor for pagination. Use the cursor from the previous response     |

### Response

#### Success Response

**Code**: `200 OK`

#### Response Body

| Field       | Type   | Description                                                    |
|-------------|--------|----------------------------------------------------------------|
| data        | Object | Container for the response data                                |
| » items     | Array  | Array of article objects                                       |
| » cursor    | String | Pagination cursor for the next page. Null if no more items     |

##### Article Object

| Field       | Type   | Description                                              |
|-------------|--------|----------------------------------------------------------|
| articleId   | String | Unique identifier of the article                         |
| currency    | String | Currency code for the article price (e.g., "EUR")       |
| updatedAt   | String | ISO 8601 timestamp of last article update               |
| createdAt   | String | ISO 8601 timestamp of article creation                  |
| price       | Number | Price of the article                                    |
| description | String | Detailed description of the article                      |
| name        | String | Name of the article                                     |

#### Example Response

```json
{
  "data": {
    "items": [
      {
        "articleId": "052daa46-aa2c-4567-9190-1368984899da",
        "currency": "EUR",
        "updatedAt": "2024-12-20T10:47:09.723Z",
        "createdAt": "2024-12-20T10:47:09.722Z",
        "price": 2.99,
        "description": "Is the same as any other motor oil, but cheaper!",
        "name": "No Name Motor Oil"
      },
      {
        "articleId": "3c315b21-733b-41ca-bc21-74e33626992f",
        "currency": "EUR",
        "updatedAt": "2024-12-20T10:47:09.724Z",
        "createdAt": "2024-12-20T10:47:09.723Z",
        "price": 3.49,
        "description": "A tasty hot dog!",
        "name": "Hot Dog"
      }
    ],
    "cursor": null
  }
}
```

#### Error Responses

| Status Code | Description                                                      |
|-------------|------------------------------------------------------------------|
| 500         | Internal Server Error - Server encountered an unexpected condition|

#### Pagination

- The endpoint implements cursor-based pagination
- Use the `cursor` value from the response to fetch the next page
- When `cursor` is null, there are no more items to fetch
- The `limit` parameter controls the number of items per page
- If no `limit` is specified, the default value of 20 will be used

#### Sorting

- Articles are not sorted in any specific order
- The sorting order cannot be modified

## POST /articles

Creates a new article in the system.

### Request

#### Endpoint

```
POST /articles
```

#### Headers

| Name         | Required | Description                |
|--------------|----------|----------------------------|
| Content-Type | Yes      | Must be `application/json` |

#### Request Body

| Field       | Type   | Required | Description                                                |
|-------------|--------|----------|------------------------------------------------------------|
| name        | String | Yes      | Name of the article. Must be between 1 and 64 characters.  |
| description | String | No       | Description of the article. Maximum 512 characters.         |
| price       | Number | Yes      | Price of the article. Must be greater than 0.              |
| currency    | String | Yes      | Currency code. Currently only "EUR" is supported.          |

#### Example Request Body

```json
{
  "name": "Body Milk",
  "description": "A bottle of body milk.",
  "price": 2.99,
  "currency": "EUR"
}
```

### Response

#### Success Response

**Code**: `200 OK`

#### Response Body

| Field        | Type   | Description                                                |
|--------------|--------|------------------------------------------------------------|
| data         | Object | Container for the response data                            |
| » articleId  | String | Unique identifier for the created article                  |
| » name       | String | Name of the article                                        |
| » description| String | Description of the article                                 |
| » price      | Number | Price of the article                                       |
| » currency   | String | Currency code for the article price                        |
| » createdAt  | String | ISO 8601 timestamp of article creation                     |
| » updatedAt  | String | ISO 8601 timestamp of last article update                  |

#### Example Response

```json
{
  "data": {
    "articleId": "f3b23803-13bd-4e9a-acec-e4151fd066dc",
    "name": "Body Milk",
    "description": "A bottle of body milk.",
    "price": 2.99,
    "currency": "EUR",
    "createdAt": "2024-12-19T14:16:07.413Z",
    "updatedAt": "2024-12-19T14:16:07.416Z"
  }
}
```

#### Error Responses

| Status Code | Description                                                      |
|-------------|------------------------------------------------------------------|
| 400         | Bad Request - Invalid request body or validation errors           |
| 500         | Internal Server Error - Server encountered an unexpected condition|

#### Validation Rules

- Name must be between 1 and 64 characters
- Description, if provided, must not exceed 512 characters
- Price must be a positive number greater than 0
- Currency must be "EUR" (other currencies are not supported)


## POST /articles/insert-test-data

Inserts predefined test articles into the database. This endpoint is intended for testing and development purposes only.

### Request

#### Endpoint

```
POST /articles/insert-test-data
```


#### Request Body

This endpoint does not require a request body.

### Response

#### Success Response

**Code**: `200 OK`

The endpoint returns an empty response body upon successful insertion of test data.

#### Error Responses

| Status Code | Description                                                      |
|-------------|------------------------------------------------------------------|
| 500         | Internal Server Error - Server encountered an unexpected condition|

#### Notes

- This endpoint is intended for development and testing environments only
- Existing test data will not be overwritten, but new test data will be added
  (duplicate items are the result of multiple calls to this endpoint)
- The endpoint should be disabled or removed in production environments
