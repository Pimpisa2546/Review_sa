import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, Modal, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import StarRating from '../star/starrating';
import { Product } from '../interface/product';
import { Review } from '../interface/review';
import Navbar from "../Component/Navbar";
import Re_bar from "../Component/re_bar";

const ProductDisplay: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviewText, setReviewText] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const navigate = useNavigate();

  // กำหนด MemberID เป็น 4
  const getMemberByID = () => {
    return 4; // ตั้งค่า MemberID เป็น 4
  };

  useEffect(() => {
    const fetchProductsAndReviews = async () => {
      try {
        const productsResponse = await axios.get<Product[]>('http://localhost:8000/products');
        const reviewsResponse = await axios.get<Review[]>('http://localhost:8000/review');

        const reviewedProductIds = new Set(reviewsResponse.data.map(review => review.ProductsID));
        const filteredProducts = productsResponse.data.filter(product => !reviewedProductIds.has(product.ID!));

        setProducts(filteredProducts);
      } catch (err) {
        setError('Error fetching product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndReviews();
  }, []);

  const showModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    const memberID = getMemberByID(); // ดึง MemberID ที่นี่
    if (selectedProduct) {
      try {
        await axios.post('http://localhost:8000/review', {
          Rating: rating,
          Comment: reviewText,
          ProductsID: selectedProduct.ID,
          MemberID: memberID, // ส่ง MemberID
        });

        navigate('/review', { state: selectedProduct });

        setIsModalVisible(false);
        setReviewText('');
        setRating(5);
      } catch (err) {
        console.error('Error submitting review:', err);
      }
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (loading) return <Spin tip="Loading products..." />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      <Navbar />
      <Re_bar />
      <Table
        dataSource={products}
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
            align: 'center',
            width: 200,
            render: (text: number) => (text !== undefined ? `฿${text.toFixed(2)}` : 'N/A'),
          },
          {
            title: <div style={{ textAlign: 'center' }}>Review</div>,
            key: 'review',
            align: 'center',
            width: 200,
            render: (_, record) => (
              <Button onClick={() => showModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}>
                รีวิวสินค้า
              </Button>
            ),
          },
        ]}
        rowKey="ID"
        pagination={false}
      />

      <Modal
        title={`รีวิวสินค้า: ${selectedProduct?.Title}`}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="ส่งรีวิว"
        cancelText="ยกเลิก"
      >
        <StarRating totalStars={5} onSelect={setRating} />
        <Input.TextArea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          placeholder="เขียนรีวิวของคุณที่นี่..."
        />
      </Modal>
    </div>
  );
};

export default ProductDisplay;
