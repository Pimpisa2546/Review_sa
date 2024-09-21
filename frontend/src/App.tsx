import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDisplay from "./page/ReviewUI/product";
import ReviewPage from "./page/ReviewUI/ReviewPage";
import ReviewSell from "./page/ReviewSeller/ReviewSell";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<ProductDisplay />} /> เส้นทางหลัก
          <Route path="/not-review" element={<ProductDisplay />} /> {/* เส้นทางตัวอย่างเพิ่มเติม */}
          <Route path="/review" element={<ReviewPage />} /> {/* เส้นทางหน้าบทวิจารณ์ */}
          <Route path="/reviewseller" element={<ReviewSell />} /> {/* เส้นทางหน้าบทวิจารณ์สำหรับผู้ขาย */}
        </Routes>
      </Router>  
    </div>
  );
}

export default App;
