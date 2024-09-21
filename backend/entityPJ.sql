BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "members" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"username"	text,
	"password"	text,
	"email"	text,
	"first_name"	text,
	"last_name"	text,
	"phone_number"	text,
	"address"	text,
	"profile_pic"	text,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "sellers" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"year"	integer,
	"institute_of"	text,
	"major"	text,
	"picture_student"	text,
	"member_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_members_sellers" FOREIGN KEY("member_id") REFERENCES "members"("id"),
	CONSTRAINT "uni_sellers_member_id" UNIQUE("member_id")
);
CREATE TABLE IF NOT EXISTS "products" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"title"	text,
	"description"	text,
	"price"	real,
	"category"	text,
	"picture_product"	longtext,
	"condition"	text,
	"weight"	real,
	"status"	text,
	"seller_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_sellers_products" FOREIGN KEY("seller_id") REFERENCES "sellers"("id")
);
CREATE TABLE IF NOT EXISTS "reviews" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"rating"	integer,
	"comment"	text,
	"member_id"	integer,
	"products_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_products_review" FOREIGN KEY("products_id") REFERENCES "products"("id"),
	CONSTRAINT "fk_reviews_member" FOREIGN KEY("member_id") REFERENCES "members"("id")
);
CREATE TABLE IF NOT EXISTS "orders" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"quantity"	integer,
	"total_price"	real,
	"member_id"	integer,
	"seller_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_orders_seller" FOREIGN KEY("seller_id") REFERENCES "sellers"("id"),
	CONSTRAINT "fk_members_orders" FOREIGN KEY("member_id") REFERENCES "members"("id")
);
CREATE TABLE IF NOT EXISTS "products_orders" (
	"id"	integer,
	"created_at"	datetime,
	"updated_at"	datetime,
	"deleted_at"	datetime,
	"product_id"	integer,
	"order_id"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "fk_products_product_orders" FOREIGN KEY("product_id") REFERENCES "products"("id"),
	CONSTRAINT "fk_orders_product_orders" FOREIGN KEY("order_id") REFERENCES "orders"("id")
);
CREATE INDEX IF NOT EXISTS "idx_members_deleted_at" ON "members" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_sellers_deleted_at" ON "sellers" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_products_deleted_at" ON "products" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_reviews_deleted_at" ON "reviews" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_orders_deleted_at" ON "orders" (
	"deleted_at"
);
CREATE INDEX IF NOT EXISTS "idx_products_orders_deleted_at" ON "products_orders" (
	"deleted_at"
);
COMMIT;
