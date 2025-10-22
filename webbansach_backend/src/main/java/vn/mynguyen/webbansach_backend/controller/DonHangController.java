package vn.mynguyen.webbansach_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import vn.mynguyen.webbansach_backend.dto.YeuCauTaoDonHang;
import vn.mynguyen.webbansach_backend.dto.PhanHoiTaoDonHang;
import vn.mynguyen.webbansach_backend.service.DonHangService;

@RestController
@RequestMapping("/don-hang")
public class DonHangController {

    private final DonHangService donHangService;

    public DonHangController(DonHangService donHangService) {
        this.donHangService = donHangService;
    }

    @PostMapping
    public ResponseEntity<PhanHoiTaoDonHang> taoDonHang(
            @RequestBody YeuCauTaoDonHang yeuCau,
            Authentication xacThuc) {

        String tenDangNhap = xacThuc != null ? xacThuc.getName() : null;
        return ResponseEntity.ok(donHangService.taoDonHang(yeuCau, tenDangNhap));
    }

    @GetMapping("/{maDonHang}")
    public ResponseEntity<PhanHoiTaoDonHang> layDonHang(@PathVariable Integer maDonHang) {
        return ResponseEntity.ok(donHangService.layDonHang(maDonHang));
    }
}
