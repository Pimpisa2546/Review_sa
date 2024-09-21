import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, Modal, Rate } from 'antd';
import { Product } from '../interface/product';
import { Review } from '../interface/review';
import { Member } from '../interface/member'; // import interface สำหรับ Member
import Navbarproducts from '../Component/navbarproducts';
import './ReviewSell.css'; // นำเข้า CSS

const ReviewSell: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [members, setMembers] = useState<Member[]>([]); // state สำหรับเก็บข้อมูลสมาชิก

  const sellerID = 1; // sellerID อันนี้ set ไว้อยู่

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>(`http://localhost:8000/products/seller/${sellerID}`);
        setProducts((response.data as any).products || response.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า');
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get<Review[]>('http://localhost:8000/review');
        setReviews(response.data);
      } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว:', err);
      }
    };

    const fetchMembers = async () => { // ฟังก์ชันสำหรับดึงข้อมูลสมาชิก
      try {
        const response = await axios.get<Member[]>('http://localhost:8000/member');
        setMembers(response.data);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchReviews();
    fetchMembers(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลสมาชิก
  }, [sellerID]);

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

  const productsWithReviews = products.filter((product) =>
    reviews.some((review) => review.ProductsID === product.ID)
  );

  return (
    <div>
      <Navbarproducts />
      <Table
        dataSource={productsWithReviews}
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
            className: 'column-picture',
          },
          {
            title: <div style={{ textAlign: 'center' }}>Title</div>,
            dataIndex: 'Title',
            key: 'Title',
            width: 800,
            className: 'column-title',
          },
          {
            title: <div style={{ textAlign: 'center' }}>Price</div>,
            dataIndex: 'Price',
            key: 'Price',
            render: (text: number) => (text !== undefined ? `฿${text.toFixed(2)}` : 'N/A'),
            align: 'center',
            width: 200,
            className: 'column-price',
          },
          {
            title: <div style={{ textAlign: 'center' }}>Review</div>,
            key: 'review',
            align: 'center',
            width: 200,
            render: (_, record) => (
              <Button onClick={() => showModal(record)} type="primary" style={{ backgroundColor: '#ff8c1a', borderColor: '#ff8c1a' }}>
                ดูรีวิว
                
              </Button>
              
            ),
            className: 'column-review',
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
        className="custom-modal"
      >
        {/* <p>{`คุณกำลังดูรีวิวสินค้า: ${selectedProduct?.Title}`}</p> */}
        {reviews.length > 0 ? (
          reviews
            .filter((review) => review.ProductsID === selectedProduct?.ID)
            .map((review, index) => {
              const member = members.find(member => member.ID === review.MemberID);
              return (
                <div key={index} style={{ marginBottom: '16px', padding: '10px', border: '1px solid #f0f0f0', borderRadius: '5px', backgroundColor: '#f4f0ec' }}>
                  <p style={{ margin: '0' }}>คะแนน: <Rate allowHalf disabled value={review.Rating || 0} /></p>
                  <p>ความคิดเห็น: {review.Comment}</p>
                  {member && <p>โดย: {member.Username}</p>}
                </div>
              );
            })
        ) : (
          <p>ยังไม่มีรีวิวสำหรับสินค้านี้</p>
        )}
      </Modal>
    </div>
  );
};

export default ReviewSell;
