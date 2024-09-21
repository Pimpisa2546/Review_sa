package entity

import (
	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	Username    string
	Password    string
	Email       string
	FirstName   string
	LastName    string
	PhoneNumber string
	Address     string
	ProfilePic  string
	Orders      []Order `gorm:"foreignKey:MemberID"`
	Sellers     Seller  `gorm:"foreignKey:MemberID"`
	Reviews  []Review  `gorm:"foreignKey:MemberID"`
}
