import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './re_bar.css';

const Navbar = () => {
  const [active, setActive] = useState('not-review');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ตั้งค่า active ตาม URL
    const path = location.pathname.split('/')[1]; // แยก path และเลือกส่วนแรก
    if (path === 'review') {
      setActive('review');
    } else {
      setActive('not-review');
    }
  }, [location]);

  const handleClick = (page: string) => {
    setActive(page);
    navigate(`/${page}`);
  };

  return (
    <div className="nav">
      <div className="text">
        <p
          onClick={() => handleClick('not-review')}
          className={active === 'not-review' ? 'active' : ''}
        >
          ยังไม่ได้รีวิว
        </p>
        <div className="divider"></div>
        <p
          onClick={() => handleClick('review')}
          className={active === 'review' ? 'active' : ''}
        >
          รีวิวแล้ว
        </p>
      </div>
    </div>
  );
};

export default Navbar;
