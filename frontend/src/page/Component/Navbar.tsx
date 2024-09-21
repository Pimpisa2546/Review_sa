import "./navbar.css";
import Logo from "../../assets/logo.png";
import Chat from "../../assets/chat.png";
import list from "../../assets/list.png";
import Shopping from "../../assets/shopping-cart.png";
import Back_arrow from "../../assets/back-arrow.png";
import notifications from "../../assets/notifications-button.png";

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={Logo} className='logo' alt='Course Logo' />
      <div className='right-section'>
        <div className='links'>
          <div className="search">
            <input type="text" placeholder="search" />
          </div>
          <button className="button-seller">สร้างการขาย</button>
          <div className='imgbox'>
            <img src={Chat} alt='Chat' />
            <img src={Shopping} alt='Shop'/>
            <img src={list} alt='list'  />
            <img src={notifications} alt='notifications' />
            <img src={Back_arrow} alt='back'/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
