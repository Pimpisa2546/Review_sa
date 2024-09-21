package controller

import (
	"net/http"

	"github.com/Review_sa/config"
	"github.com/Review_sa/entity"
	"github.com/gin-gonic/gin"
)

// CreateMember สร้างข้อมูลสมาชิกใหม่
func CreateMember(c *gin.Context) {
	var member entity.Member

	if err := c.ShouldBindJSON(&member); err != nil { // ตรวจสอบการเชื่อมโยง JSON payload กับ struct Member
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) // ส่งกลับข้อผิดพลาดหากการเชื่อมโยงไม่สำเร็จ
		return
	}

	db := config.DB() // เชื่อมต่อกับฐานข้อมูล

	hashedPassword, err := config.HashPassword(member.Password) // เข้ารหัสรหัสผ่าน
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"}) // ส่งกลับข้อผิดพลาดหากการเข้ารหัสไม่สำเร็จ
		return
	}

	// สร้าง object ของ Member ใหม่ที่มีรหัสผ่านที่ถูกเข้ารหัส
	m := entity.Member{
		Username:    member.Username,
		Password:    hashedPassword,
		Email:       member.Email,
		FirstName:   member.FirstName,
		LastName:    member.LastName,
		PhoneNumber: member.PhoneNumber,
		Address:     member.Address,
		ProfilePic:  member.ProfilePic,
	}

	if err := db.Create(&m).Error; err != nil { // บันทึกข้อมูลสมาชิกลงในฐานข้อมูล
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": m}) // ส่งกลับข้อความว่าสร้างสมาชิกสำเร็จพร้อมข้อมูลที่สร้าง
}

// GetMember ดึงข้อมูลสมาชิกตาม ID
func GetMember(c *gin.Context) {
	ID := c.Param("id") // รับค่า ID จากพารามิเตอร์ของ URL
	var member entity.Member

	db := config.DB()

	result := db.Preload("Orders").Preload("Sellers").First(&member, ID) // ค้นหาข้อมูลสมาชิกพร้อม preload ข้อมูล Orders และ Sellers ที่เกี่ยวข้อง
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, member)
}

func GetAllmember(c *gin.Context) { // เข้าถึงข้อมูลMemberทั้งหมด
	var member []entity.Member

	db := config.DB()
	result := db.Preload("Sellers").Find(&member)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, member)
}
