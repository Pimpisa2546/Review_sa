package entity

import (
   "gorm.io/gorm"
)

type Seller struct {
	gorm.Model
	Year           uint
	InstituteOf    string
	Major          string
	PictureStudent string
	MemberID       uint   `gorm:"unique"`
	Products       []Products `gorm:"foreignKey:SellerID"`
}