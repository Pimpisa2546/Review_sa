package main

import (
	"net/http"

	"github.com/Review_sa/controller"
	"github.com/gin-gonic/gin"

	"github.com/Review_sa/config"
	//"gorm.io/driver/sqlite"
)

func main() {

	const PORT = "8000" // กำหนดหมายเลขพอร์ต
	// open connection database
	config.ConnectionDB()

	// Generate databases
	config.SetupDatabase()

	r := gin.Default()

	r.Use(CORSMiddleware())

	router := r.Group("")
	{
		router.POST("/member", controller.CreateMember)
		router.GET("/member/:id", controller.GetMember)
		router.GET("/member", controller.GetAllmember)

		router.POST("/sellers", controller.CreateSeller)
		router.GET("/sellers/:id", controller.GetSeller)

		router.POST("/orders", controller.CreateOrder)
		router.GET("/orders/:id", controller.GetOrder)

		router.PATCH("/orders/:id", controller.UpdateOrder)
		router.DELETE("/orders/:id", controller.DeleteOrder)
		router.GET("/orders/member/:memberId", controller.GetOrdersByMemberID)
		router.GET("/orders/member/:memberId/product/:productId", controller.GetOrdersByProductIDAndMemberID)
		router.GET("/orders/seller/:sellerId/product/:productId", controller.GetOrdersByProductIDAndSellerID)

		// User Routes
		router.POST("/review", controller.CreateReview)
		router.PUT("/review/:id", controller.UpdateReview)
		router.DELETE("/review/:id", controller.DeleteReview)
		router.GET("/review", controller.GetAllReview)
		router.GET("/review/seller/:seller_id", controller.GetReviewsBySellerID)//เพิ่มใหม่

		router.POST("/products", controller.CreateProducts)
		router.GET("/products", controller.GetProducts)
		router.GET("/products/:id", controller.GetProductsBYID)
		router.PUT("/products/:id", controller.UpdateProducts)
		router.DELETE("/products/:id", controller.DeleteProducts)
		router.GET("/products_by_member/:member_id", controller.GetProductsByMemberID)
		router.GET("/products/seller/:seller_id", controller.GetProductsBySellerID)

		router.POST("/products_orders", controller.CreateProductsOrder)
		router.GET("/products_orders", controller.ListProductsOrders)
		router.DELETE("/products_orders/:id", controller.DeleteProductsOrder)
		router.GET("/products_orders/:order_id", controller.GetProductsOrdersByOrderID)

		r.GET("/", func(c *gin.Context) {
			c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
		})

	}
	r.Run("localhost:" + PORT) // Run the server
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
