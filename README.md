## Setup

Clone repository

```bash
git clone https://github.com/karlozrilic/abysalto_zadatak.git
cd abysalto_zadatak
```

To start run:

```bash
docker-compose up
```

or

```bash
docker-compose up --build
```

Database should import automaticly when building containers for the first time

if not run this in project root using CMD or PoweShell:

> \[!CAUTION\]
>
> DO NOT USE Git Bash IT WON'T WORK

```bash
docker cp backend/init.sql db:/init.sql
docker exec -it db psql -U myuser -d mydb -f /init.sql
```

## API Routes

#### Products
|Method|Endpoint|Description|Request Params|
|-|-|-|-|
|```GET```|```/api/products```|Get all products (supports single sorting)|```"page": 1```<br>```"pageSize"": 10```<br> ```"sortField": "id"```<br>```"sortOrder": 1```|
|```GET```|```/api/products/:id```|Get single product with ```id```|None|

#### Cart
|Method|Endpoint|Description|Request body|
|-|-|-|-|
|```GET```|```/api/cart```|Get all information about cart including products in cart|None|
|```POST```|```/api/cart/add```|Add product in cart or increment ```quantity``` if it already exists in cart|<pre><code>{ "productId": 123 }</code></pre>|
|```POST```|```/api/cart/remove```|Decrement ```quantity``` by 1 if ```quantity > 1``` or remove product in cart if ```quantity``` would become 0|<pre><code>{ "productId": 123 }</code></pre>|

## System design document

[System design link](https://docs.google.com/document/d/1KMym27QR-A3uz-7sJAvoiWA9NjnlntxmTffK-ctmveQ/edit?usp=sharing)