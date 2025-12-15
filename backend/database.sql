DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    images JSONB NOT NULL DEFAULT '[]'
);

INSERT INTO Products (name, description, price, quantity, images) VALUES
('Laptop Pro 15','Snažan laptop za profesionalnu upotrebu',1299.99,10,'["https://picsum.photos/seed/laptop1/600","https://picsum.photos/seed/laptop2/600"]'),
('Wireless Mouse','Bežični miš s ergonomskim dizajnom',24.50,150,'["https://picsum.photos/seed/mouse/600"]'),
('Mechanical Keyboard','Mehanička tipkovnica s RGB osvjetljenjem',89.90,75,'["https://picsum.photos/seed/keyboard/600"]'),
('USB-C Hub','Višenamjenski USB-C adapter',39.99,60,'[]'),
('27 inch Monitor','Veliki monitor visoke rezolucije',279.00,25,'["https://picsum.photos/seed/monitor/600"]'),
('Gaming Headset','Headset s surround zvukom',79.95,40,'["https://picsum.photos/seed/headset/600"]'),
('Webcam HD','HD web kamera za video pozive',49.99,90,'[]'),
('External SSD 1TB','Brzi vanjski SSD disk',159.49,30,'["https://picsum.photos/seed/ssd/600"]'),
('Smartphone Stand','Stalak za pametne telefone',12.99,200,'[]'),
('Bluetooth Speaker','Prijenosni bluetooth zvučnik',55.00,85,'["https://picsum.photos/seed/speaker/600"]'),
('Office Chair','Udobna uredska stolica',199.99,20,'["https://picsum.photos/seed/chair/600"]'),
('Desk Lamp','LED stolna lampa s regulacijom svjetla',34.75,110,'[]'),
('Notebook Backpack','Ruksak za laptop i dokumente',64.90,55,'["https://picsum.photos/seed/backpack/600"]'),
('Power Bank 20000mAh','Prijenosna baterija velikog kapaciteta',45.99,95,'[]'),
('Smartwatch Fit','Pametni sat za praćenje aktivnosti',119.00,45,'["https://picsum.photos/seed/watch/600"]'),
('Wireless Charger','Bežični punjač za telefone',29.99,130,'[]'),
('HDMI Cable 2m','Kvalitetni HDMI kabel duljine 2m',9.49,300,'[]'),
('Graphic Tablet','Tablet za digitalno crtanje',149.99,18,'["https://picsum.photos/seed/tablet/600"]'),
('Noise Cancelling Earbuds','Bežične slušalice s ANC-om',99.95,70,'["https://picsum.photos/seed/earbuds/600"]'),
('Desktop Microphone','USB mikrofon za streaming',89.00,35,'[]'),
('Router AX3000','WiFi 6 router velike brzine',129.49,28,'["https://picsum.photos/seed/router/600"]'),
('Smart LED Bulb','Pametna LED žarulja',14.99,180,'[]'),
('Fitness Mat','Podloga za vježbanje',22.50,140,'[]'),
('Electric Kettle','Električno kuhalo za vodu',39.90,65,'["https://picsum.photos/seed/kettle/600"]'),
('Coffee Maker','Aparat za filter kavu',79.99,42,'[]'),
('Blender Pro','Snažan blender za smoothieje',99.00,38,'["https://picsum.photos/seed/blender/600"]'),
('Air Fryer','Frizer na vrući zrak',149.90,33,'[]'),
('Toaster 2-Slice','Toster za dva kruha',34.99,58,'[]'),
('Vacuum Cleaner','Usisavač za kućanstvo',189.99,22,'["https://picsum.photos/seed/vacuum/600"]'),
('Steam Iron','Pegla na paru',49.95,47,'[]'),
('Water Bottle Steel','Čelična boca za vodu',19.99,160,'[]'),
('Running Shoes','Tenisice za trčanje',89.90,50,'["https://picsum.photos/seed/shoes/600"]'),
('Yoga Pants','Elastične hlače za jogu',39.99,120,'[]'),
('Winter Jacket','Zimska jakna s kapuljačom',149.00,26,'["https://picsum.photos/seed/jacket/600"]'),
('T-Shirt Basic','Pamučna majica kratkih rukava',14.50,300,'[]'),
('Jeans Classic','Klasične traperice',59.99,80,'[]'),
('Sunglasses UV400','Sunčane naočale s UV zaštitom',24.99,95,'[]'),
('Leather Wallet','Kožni novčanik',34.90,70,'[]'),
('Travel Suitcase','Putni kofer srednje veličine',119.99,32,'["https://picsum.photos/seed/suitcase/600"]'),
('Camping Tent','Šator za 4 osobe',199.00,15,'[]'),
('Sleeping Bag','Vreća za spavanje',69.95,40,'[]'),
('Hiking Backpack','Planinarski ruksak',89.99,35,'[]'),
('Flashlight LED','LED baterijska lampa',18.99,150,'[]'),
('Tool Kit Set','Set osnovnog alata',74.50,45,'[]'),
('Car Phone Holder','Držač mobitela za automobil',15.99,180,'[]'),
('Dash Camera','Auto kamera za snimanje vožnje',129.00,27,'["https://picsum.photos/seed/dashcam/600"]'),
('Smart Home Sensor','Senzor za pametni dom',44.99,60,'[]'),
('Garden Hose 20m','Vrtno crijevo duljine 20m',29.95,90,'[]'),
('BBQ Grill','Roštilj za dvorište',249.99,12,'["https://picsum.photos/seed/grill/600"]');

DROP TABLE IF EXISTS carts;

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

DROP TABLE IF EXISTS cart_items;

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (cart_id, product_id)
);