package vn.mynguyen.webbansach_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import vn.mynguyen.webbansach_backend.dao.NguoiDungRepository;
import vn.mynguyen.webbansach_backend.entity.NguoiDung;
import vn.mynguyen.webbansach_backend.entity.ThongBao;

import java.util.UUID;

@Service
public class TaiKhoanService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private EmailService emailService;

    public ResponseEntity<?> dangKyNguoiDung(NguoiDung nguoiDung){

        if(nguoiDungRepository.existsByTenDangNhap(nguoiDung.getTenDangNhap())){
            return ResponseEntity.badRequest().body(new ThongBao("Tên đăng nhập đã tồn tại !"));
        }
        if(nguoiDungRepository.existsByEmail(nguoiDung.getEmail())){
            return ResponseEntity.badRequest().body(new ThongBao("Email đã tồn tại !"));
        }

        // Ma hoa mat khau nguoi dung
        String encryptPassword=passwordEncoder.encode(nguoiDung.getMatKhau());
        nguoiDung.setMatKhau(encryptPassword);

        //Gan, gui thong itn kich hoat
        nguoiDung.setMaKichHoat(taoMaKichHoat());
        nguoiDung.setDaKichHoat(false);

        //Luu user vào DB
        NguoiDung nguoiDung_daDangKi=nguoiDungRepository.save(nguoiDung);

        //Gui email kich hoat tai khoan
        guiEmailKichHoat(nguoiDung.getEmail(),nguoiDung.getMaKichHoat());



        return ResponseEntity.ok("Đăng kí thành công!");

    }

    //Tao ma ngau nhien
    private String taoMaKichHoat(){
        return UUID.randomUUID().toString();
    }

    private void guiEmailKichHoat(String email, String maKichHoat){

        String subject = "Kích hoạt tài khoản của bạn tại Nook Books";
        String url = "http://localhost:3000/kich-hoat/" + email + "/" + maKichHoat;

        String text =
                "Vui lòng sử dụng mã sau để kích hoạt cho tài khoản " + email + ":\n\n"
                        + maKichHoat + "\n\n"
                        + "Click vào đường link để kích hoạt tài khoản:\n"
                        + url;

        emailService.sendMessage("mynguyen13324@gmail.com", email, subject, text);
    }

    public ResponseEntity<?> kichHoatTaiKhoan(String email,String maKichHoat){

        NguoiDung nguoiDung=nguoiDungRepository.findByEmail(email);

        if(nguoiDung ==null ){
            return  ResponseEntity.badRequest().body(new ThongBao("Người dùng không tồn tại! "));
        }
        if(nguoiDung.isDaKichHoat()){
            return ResponseEntity.badRequest().body(new ThongBao("Tài khoản đã được kích hoạt!"));
        }

        if(maKichHoat.equals(nguoiDung.getMaKichHoat())){
            nguoiDung.setDaKichHoat(true);
            nguoiDungRepository.save(nguoiDung);
            return ResponseEntity.ok("Kích hoạt tài khoản thành công!");
        }else {
            return ResponseEntity.badRequest().body(new ThongBao("Mã kích hoạt không chính xác!"));
        }

    }





}
