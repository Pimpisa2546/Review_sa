import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopRating from '../ReviewSeller/ShopRating'; // Import the ShopRating component
import "./navbarproducts.css";
import Logo from "../../../src/assets/logo.png";
import Chat from "../../../src/assets/chat.png";
import list from "../../../src/assets/list.png";
import market from "../../../src/assets/shopping-cart.png";
import bell from "../../../src/assets/notifications-button.png";
import backarrow from "../../../src/assets/back-arrow.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isShopRatingVisible, setIsShopRatingVisible] = useState(false); // State for showing/hiding the modal

  const handleReviewSell = () => {
    navigate('/reviewseller');
  };

  const handleShopRating = () => {
    setIsShopRatingVisible(true); // Open the modal
  };

  const closeShopRating = () => {
    setIsShopRatingVisible(false); // Close the modal
  };

  return (
    <div className='navbar'>
      <img
        src={Logo}
        alt="Course Logo"
        style={{
          width: "200px",
          marginRight: "30px",
          marginTop: "0"
        }}
      />
      <div className='right-section'>
        <div className='links'>
          <button className="button-createproduct" onClick={handleReviewSell}>
            รีวิว
          </button>
          <button className="button-createproduct" onClick={handleShopRating}>
            คะแนนร้านค้า
          </button>
          <button className="button-createproduct">
            เพิ่มสินค้า
          </button>

          <div className='imgbox'>
            <img src={Chat} alt="Chat" />
            <img src={market} alt="market" />
            <img src={list} alt="list" />
            <img src={bell} alt="bell" />
            <img src={backarrow} alt="back" />
          </div>
        </div>
      </div>

      {/* ShopRating Modal */}
      <ShopRating
        sellerID={1} // You can replace this with the actual seller ID
        visible={isShopRatingVisible}
        onClose={closeShopRating}
      />
    </div>
  );
};

export default Navbar;
