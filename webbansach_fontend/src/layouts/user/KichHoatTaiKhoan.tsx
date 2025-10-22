
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


function KichHoatTaiKhoan(){

    const { email } = useParams();
    const { maKichHoat } = useParams();
    const [daKichHoat, setDaKichHoat] = useState(false);
    const [thongBao, setThongBao] = useState("");

    useEffect(()=>{
      
        console.log("Email:", email);
        console.log("MaKichHoat:", maKichHoat);
        if(email && maKichHoat){
            thucHienKichHoat();
        }
    }, []);

    const thucHienKichHoat = async() =>{
        console.log("Email:", email);
        console.log("MaKichHoat:", maKichHoat);
        try {
            const url:string = `http://localhost:8080/tai-khoan/kich-hoat?email=${email}&maKichHoat=${maKichHoat}`;
            const response = await fetch(url,  {method: "GET"} );

            if(response.ok){
                setDaKichHoat(true);
            }else{
                setThongBao(response.text + "");
            }
        } catch (error) {
            console.log("Lỗi khi kích hoạt: " , error);
        }
    }
    return (
  <div className="container py-5 min-vh-100 d-flex align-items-center">
    <div className="row w-100 justify-content-center">
      <div className="col-sm-10 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-header bg-primary text-white rounded-top-4">
            <h5 className="mb-0">Kích hoạt tài khoản</h5>
          </div>

          <div className="card-body">
            {/* Thông tin tham chiếu */}
            <div className="mb-4 small text-muted">
              <div><strong>Email:</strong> {email || "—"}</div>
              <div><strong>Mã kích hoạt:</strong> {maKichHoat || "—"}</div>
            </div>

            {/* Thông báo */}
            {daKichHoat ? (
              <div className="alert alert-success d-flex align-items-center" role="alert">
                <span className="me-2">✅</span>
                <span>Tài khoản đã kích hoạt thành công, bạn hãy đăng nhập để tiếp tục sử dụng dịch vụ!</span>
              </div>
            ) : (
              <div className="alert alert-danger" role="alert">
                {thongBao}
              </div>
            )}

            {/* Hành động tiếp theo */}
            <div className="d-grid">
              <a
                href="/dang-nhap"
                className={`btn btn-primary btn-lg ${daKichHoat ? "" : "disabled"}`}
                aria-disabled={!daKichHoat}
              >
                Đến trang đăng nhập
              </a>
            </div>
          </div>

          <div className="card-footer bg-light text-center small rounded-bottom-4">
            Nếu có vấn đề khi kích hoạt, vui lòng thử lại từ email hoặc liên hệ hỗ trợ.
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default KichHoatTaiKhoan;
