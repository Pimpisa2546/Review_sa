package entity

import (
	"gorm.io/gorm"
)

type Products struct {
	gorm.Model
	Title           string
	Description     string
	Price           float32
	Category        string
	Picture_product string `gorm:"type:longtext"`
	Condition       string
	Weight          float32
	Status          string
	Review          []Review `gorm:"foreignKey:products_id"`
	SellerID        *uint
	Seller          Seller           `gorm:"foreignKey:SellerID"`
	Product_Orders  []Products_order `gorm:"foreignKey:ProductID"`
}
