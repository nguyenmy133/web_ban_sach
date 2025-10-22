import React, { useEffect ,useState} from "react";
import { SachModel } from "../../models/SachModel";
import SachProps from "./components/SachProps";
import { layToanBoSach, timKiemSach } from "../../api/SachAPI";
import { PhanTrang } from "../utils/PhanTrang";



interface DanhSachSanPhamProps {
    tuKhoaTimKiem: string;
    maTheLoai: number;
}


function DanhSachSanPham ({tuKhoaTimKiem,maTheLoai}: DanhSachSanPhamProps) {
    const [danhSachQuyenSach, setDanhSachQuyenSach] = useState<SachModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [tongSoTrang, setTongSoTrang] = useState(0);
    const [tongSoSach, setSoSach] = useState(0);


    useEffect(() => {
        if(tuKhoaTimKiem === '' && maTheLoai==0){ 
        layToanBoSach(trangHienTai-1).then(
            kq => {
                setDanhSachQuyenSach(kq.ketQua);
                setTongSoTrang(kq.tongSoTrang);
                setLoading(false);
                
            }
        ).catch(
            err => {
                setError(err.message);
                 setLoading(false);
            }

        );
    }else{
        timKiemSach(tuKhoaTimKiem,maTheLoai).then(
            kq => {
                setDanhSachQuyenSach(kq.ketQua);
                setTongSoTrang(kq.tongSoTrang);
                setLoading(false);

    }).catch(
        err => {
            setError(err.message);
             setLoading(false);
        }
    );
    }

},[trangHienTai, tuKhoaTimKiem,maTheLoai]);

    const phanTrang = (trang: number) => {
        setTrangHienTai(trang);
    };


     if(loading) {
            return <p>Đang tải dữ liệu...</p>;
        }

    if(error) { 
        return <p>Lỗi: {error}</p>;
    }
    if(danhSachQuyenSach.length===0){
        return (
            <div className="container">
                <div className="d-flex align-items-center justify-content-center">
                    <h1>Hiện không tìm thấy sách theo yêu cầu!</h1>
                </div>
            </div>
        );
    }

    return(
       
        <div className="container ">
        <div className="row mt-4">
        {
            danhSachQuyenSach.map((sach) => (
                <SachProps key={sach.maSach} sach={sach} />
            )
        )
        }
        
        </div>
        <PhanTrang trangHienTai={trangHienTai} tongSoTrang={tongSoTrang} phanTrang={phanTrang}/>
    </div>
    );
}
export default DanhSachSanPham;