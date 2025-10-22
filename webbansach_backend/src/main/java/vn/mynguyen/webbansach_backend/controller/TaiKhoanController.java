package vn.mynguyen.webbansach_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import vn.mynguyen.webbansach_backend.entity.NguoiDung;
import vn.mynguyen.webbansach_backend.security.JwtResponse;
import vn.mynguyen.webbansach_backend.security.LoginRequest;
import vn.mynguyen.webbansach_backend.service.JwtService;
import vn.mynguyen.webbansach_backend.service.TaiKhoanService;
import vn.mynguyen.webbansach_backend.service.UserService;


@RestController
@RequestMapping("/tai-khoan")
@CrossOrigin(origins = "*")
public class TaiKhoanController {
    @Autowired
    private TaiKhoanService taiKhoanService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/dang-ky")
    public ResponseEntity<?> dangKyNguoiDung(@Validated @RequestBody NguoiDung nguoiDung){
        return taiKhoanService.dangKyNguoiDung(nguoiDung);
    }

    @GetMapping("/kich-hoat")
    public ResponseEntity<?> kichHoatTaiKhoan(@RequestParam String email, @RequestParam String maKichHoat){
        return taiKhoanService.kichHoatTaiKhoan(email, maKichHoat);
    }

    @PostMapping("/dang-nhap")
    public ResponseEntity<?> dangNhap(@RequestBody LoginRequest loginRequest) {
        //Xac thuc nguoi dung bang ten dang nhap va mat khau
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            //Neu xac thuc thanh cong thi tao token JWT
            if(authentication.isAuthenticated()){
                final String jwt=jwtService.generateToken(loginRequest.getUsername());
                return ResponseEntity.ok(new JwtResponse(jwt));
            }

        }catch(AuthenticationException e) {
            //Xac thuc khong thanh cong tra ve loi hoac thong bao
            return ResponseEntity.badRequest().body("Tên đăng nhập hoặc mật khẩu không chính xác!");

        }
        return ResponseEntity.badRequest().body("Xác thực không thành công!");
    }


}
