package vn.mynguyen.webbansach_backend.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.mynguyen.webbansach_backend.dao.ChiTietDonHangRepository;
import vn.mynguyen.webbansach_backend.dao.ChiTietDonHangRepository;

@RestController
public class TestController {
    private ChiTietDonHangRepository repository;

    @Autowired
    public TestController(ChiTietDonHangRepository repository){
        this.repository=repository;

    }


}
