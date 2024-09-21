package config

import (
	"fmt"

	"github.com/Review_sa/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// ฟังก์ชันคืนค่า instance ของฐานข้อมูล
func DB() *gorm.DB {
	return db
}

// ฟังก์ชันเชื่อมต่อฐานข้อมูล SQLite
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("entityPJ.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	fmt.Println("connected database")
	db = database
}

// ฟังก์ชันตั้งค่าฐานข้อมูลและทำการ migrate ตาราง
func SetupDatabase() {
	// ทำการ migrate ตารางในฐานข้อมูล
	db.AutoMigrate(
		&entity.Member{},
		&entity.Products{},
		&entity.Review{},
		&entity.Seller{},
		&entity.Order{},
		&entity.Products_order{},
	)

	// สร้างผู้ใช้ตัวอย่าง
	// hashedPassword, _ := HashPassword("123456")
	// Member := &entity.Member{
	// 	Username:     "Pimpisa123",
	// 	Password:     hashedPassword,
	// 	Email:        "Aum123@gmail.com",
	// 	First_name:   "Pimpisa",
	// 	Last_name:    "Pungpat",
	// 	Phone_number: "0123456789",
	// 	Address:      "SUT M.8",
	// }

	// // สร้างสินค้าตัวอย่าง
	// Products := &entity.Products{
	// 	Title:       "กระโปรง",
	// 	Description: "กระโปรงสีตก",
	// 	Price:       35.50,
	// 	Category:    "เสื้อผ้า",
	// 	Condition:   "มือสอง",
	// 	Weight:      3.00,
	// }
	// db.FirstOrCreate(Products)

	// // สร้างรีวิวตัวอย่าง
	// Review := &entity.Review{
	// 	Rating:     4,
	// 	Comment:    "สินค้ามีตำหนินิดหน่อย",
	// 	Member_id:  Member.ID,
	// 	ProductsID: Products.ID,
	// }
	// db.FirstOrCreate(Review)
}
