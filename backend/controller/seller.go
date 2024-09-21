package controller

import (
	"net/http"

	"github.com/Review_sa/config"
	"github.com/Review_sa/entity"
	"github.com/gin-gonic/gin"
)

func CreateSeller(c *gin.Context) { // สร้างข้อมูลผู้ขาย
	var seller entity.Seller

	// bind เข้าตัวแปร seller
	if err := c.ShouldBindJSON(&seller); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	var member entity.Member
	db.First(&member, seller.MemberID)
	if member.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "member not found"})
		return
	}

	// สร้าง Seller
	s := entity.Seller{
		Year:           seller.Year,
		InstituteOf:    seller.InstituteOf,
		Major:          seller.Major,
		PictureStudent: seller.PictureStudent,
		MemberID:       seller.MemberID,
	}

	// บันทึก
	if err := db.Create(&s).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": s})
}

// GET /sellers/:id
func GetSeller(c *gin.Context) { //เข้าถึงข้อมูลผู้ขายตาม id
	ID := c.Param("id")
	var seller entity.Seller

	db := config.DB()
	result := db.Preload("Products").First(&seller, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, seller)
}
