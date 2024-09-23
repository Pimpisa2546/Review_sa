import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, Modal, Rate } from 'antd';
import { Product } from '../interface/product';
import Navbar from "../Component/Navbar";
import Re_bar from "../Component/re_bar";

interface Review {
  Rating: number;
  Comment: string;
  MemberID: number;
  ProductsID: number; // เพิ่ม ProductsID ในรีวิว
  ImageURL?: string; // เพิ่มฟิลด์สำหรับเก็บ URL ของภาพ
}

const ReviewPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('http://localhost:8000/products');
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching product data');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>('http://localhost:8000/review'); // ดึงรีวิวทั้งหมด
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchReviews();
  }, []);

  const showModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  if (loading) return <Spin tip="Loading products..." />;
  if (error) return <Alert message={error} type="error" />;

  // กรองผลิตภัณฑ์ที่มีรีวิว
  const productsWithReviews = products.filter((product) =>
    reviews.some((review) => review.ProductsID === product.ID)
  );

  return (
    <div>
      <Navbar />
      <Re_bar />
      <Table
        dataSource={productsWithReviews} // ใช้ผลิตภัณฑ์ที่มีรีวิว
        columns={[
          {
            title: <div style={{ textAlign: 'center' }}>Picture</div>,
            dataIndex: 'Picture_product',
            key: 'Picture_product',
            align: 'center',
            width: 200,
            render: (text: string) => (
              <img
                src={text}
                alt="product"
                style={{ width: 100, height: 100, objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                }}
              />
            ),
          },
          {
            title: <div style={{ textAlign: 'center' }}>Title</div>,
            dataIndex: 'Title',
            key: 'Title',
            width: 800,
          },
          {
            title: <div style={{ textAlign: 'center' }}>Price</div>,
            dataIndex: 'Price',
            key: 'Price',
            render: (text: number) => (text !== undefined ? `฿${text.toFixed(2)}` : 'N/A'),
            align: 'center',
            width: 200,
          },
          {
            title: <div style={{ textAlign: 'center' }}>Review</div>,
            key: 'review',
            align: 'center',
            width: 200,
            render: (record) => (
              <Button onClick={() => showModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}>
                ดูรีวิว
              </Button>
            ),
          },
        ]}
        rowKey="ID"
        pagination={false}
      />

      <Modal
        title={`คุณกำลังดูรีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {reviews.length > 0 ? (
          reviews
            .filter((review) => review.ProductsID === selectedProduct?.ID) // กรองรีวิวที่ตรงกับผลิตภัณฑ์ที่เลือก
            .map((review, index) => (
              <div key={index} style={{ marginBottom: '16px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px', backgroundColor: '#f4f0ec' }}>
                <p>คะแนน: <Rate allowHalf disabled value={review.Rating || 0} /></p>
                <p>ความคิดเห็น: {review.Comment}</p>
                {review.ImageURL && (
                  <img
                    src={review.ImageURL}
                    alt="review"
                    style={{ width: 100, height: 100, objectFit: 'cover', marginTop: '8px' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                    }}
                  />
                )}
              </div>
            ))
        ) : (
          <p>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
        )}
      </Modal>
    </div>
  );
};

export default ReviewPage;
