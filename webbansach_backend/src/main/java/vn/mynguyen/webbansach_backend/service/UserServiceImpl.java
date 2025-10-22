package vn.mynguyen.webbansach_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import vn.mynguyen.webbansach_backend.dao.NguoiDungRepository;
import vn.mynguyen.webbansach_backend.dao.QuyenRepository;
import vn.mynguyen.webbansach_backend.entity.NguoiDung;
import vn.mynguyen.webbansach_backend.entity.Quyen;

import java.util.Collection;
import java.util.stream.Collectors;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private QuyenRepository quyenRepository;

    @Autowired
    private  NguoiDungRepository nguoiDungRepository;

    @Override
    public NguoiDung findByUsername(String tenDangNhap) {
        return nguoiDungRepository.findByTenDangNhap(tenDangNhap);
    }
    @Autowired
    public UserServiceImpl(NguoiDungRepository nguoiDungRepository,QuyenRepository quyenRepository){
        this.nguoiDungRepository=nguoiDungRepository;
        this.quyenRepository=quyenRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        NguoiDung nguoiDung = nguoiDungRepository.findByTenDangNhap(username);
        if (nguoiDung == null) {
            throw new UsernameNotFoundException("Tài khoản không tồn tại! ");
        }

        User user = new User(nguoiDung.getTenDangNhap(), nguoiDung.getMatKhau(), rolesToAuthorities(nguoiDung.getDanhSachQuyen()) );
        return user;

    }
    private Collection<? extends GrantedAuthority> rolesToAuthorities(Collection<Quyen> quyens){
        return quyens.stream().map(quyen->new SimpleGrantedAuthority(quyen.getTenQuyen())).collect(Collectors.toList());
    }

}
