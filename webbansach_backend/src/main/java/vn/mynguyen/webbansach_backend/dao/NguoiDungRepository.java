package vn.mynguyen.webbansach_backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import vn.mynguyen.webbansach_backend.entity.NguoiDung;

@RepositoryRestResource(path = "nguoi-dung")
public interface NguoiDungRepository extends JpaRepository<NguoiDung,Integer> {
    boolean existsByTenDangNhap(String tenDangNhap);

    boolean existsByEmail(String email);

    public NguoiDung findByTenDangNhap(String tenDangNhap);

    public NguoiDung findByEmail(String email);



}
