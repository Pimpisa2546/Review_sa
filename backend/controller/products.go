package controller

import (
	"github.com/Review_sa/config"
	"github.com/Review_sa/entity"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GET /products
func GetProducts(c *gin.Context) { // เข้าถึงข้อมูลสินค้าทั้งหมด
	var products []entity.Products

	db := config.DB()
	result := db.Preload("Seller").Find(&products)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}



func CreateProducts(c *gin.Context) { // สร้างข้อมูลสินค้า
	var product entity.Products

	// bind เข้าตัวแปร product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := config.DB()

	// สร้าง Product
	p := entity.Products{
		Title:           product.Title,
		Description:     product.Description,
		Price:           product.Price,
		Category:        product.Category,
		Picture_product: product.Picture_product,
		Condition:       product.Condition,
		Weight:          product.Weight,
		Status:          product.Status,
		SellerID:        product.SellerID,
	}

	// บันทึก
	if err := db.Create(&p).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created success", "data": p})
}


// GET /products/:id
func GetProductsBYID(c *gin.Context) {
	ID := c.Param("id")
	var product entity.Products

	db := config.DB()

	// ใช้ Preload เพื่อนำข้อมูล Seller มาใน Product ด้วย
	result := db.Preload("Seller").First(&product, ID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, product)
}

// PATCH /products/:id
func UpdateProducts(c *gin.Context) { //อัพเดตข้อมูลตาม id
	var product entity.Products

	ProductID := c.Param("id")

	db := config.DB()
	result := db.First(&product, ProductID)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "id not found"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request, unable to map payload"})
		return
	}

	result = db.Save(&product)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successful"})
}

// DELETE /products/:id
func DeleteProducts(c *gin.Context) { //ลบข้อมูลตาม id
	id := c.Param("id")
	db := config.DB()
	if tx := db.Exec("DELETE FROM products WHERE id = ?", id); tx.RowsAffected == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successful"})
}




func GetProductsByMemberID(c *gin.Context) {
    memberID := c.Param("member_id")
    var products []entity.Products

    db := config.DB()

    // ตรวจสอบว่าการเชื่อมโยงตารางและเงื่อนไขถูกต้อง
    result := db.
        Joins("JOIN products_orders ON products_orders.product_id = products.id").
        Joins("JOIN orders ON orders.id = products_orders.order_id").
        Where("orders.member_id = ?", memberID).
        Preload("Seller").
        Find(&products)

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"products": products})
}

// func GetProductsBySellerID(c *gin.Context) {
//     sellerID := c.Param("seller_id")
//     var products []entity.Products

//     db := config.DB() // เชื่อมต่อฐานข้อมูล
	
// 	// result := db.Preload("Products").First(&seller, ID)

//     result := db.
//         Joins("JOIN products_orders ON products_orders.product_id = products.id").
//         Joins("JOIN orders ON orders.id = products_orders.order_id").
//         Where("orders.seller_id = ?", sellerID).  // กรองตาม seller_id
//         Preload("Seller").                         // ดึงข้อมูลผู้ขายที่เกี่ยวข้อง
//         Find(&products)

//     // ตรวจสอบหากมีข้อผิดพลาด
//     if result.Error != nil {
//         c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
//         return
//     }

//     // ส่งผลลัพธ์กลับในรูปแบบ JSON
//     c.JSON(http.StatusOK, gin.H{"products": products})
// }

func GetProductsBySellerID(c *gin.Context) {
    sellerID := c.Param("seller_id") // ดึง seller_id จาก URL
    var products []entity.Products   // สร้างตัวแปรเก็บผลลัพธ์ของสินค้า

    db := config.DB() // เรียกฐานข้อมูล
    result := db.
        Where("seller_id = ?", sellerID). // กรองสินค้าเฉพาะ seller_id ที่ต้องการ
        Preload("Seller"). // โหลดข้อมูลของผู้ขายด้วย (Preload)
        Find(&products)    // ค้นหาข้อมูลสินค้า

    if result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"products": products}) // ส่งข้อมูลสินค้าเป็น JSON
}


