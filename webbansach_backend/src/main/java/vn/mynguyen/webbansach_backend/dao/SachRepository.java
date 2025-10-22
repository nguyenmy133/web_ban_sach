package vn.mynguyen.webbansach_backend.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;
import vn.mynguyen.webbansach_backend.entity.Sach;

@RepositoryRestResource(path="sach")
public interface SachRepository extends JpaRepository<Sach, Integer> {

    Page<Sach> findByTenSachContaining(@RequestParam("tenSach") String tenSach, Pageable pageable);
    Page<Sach> findByDanhSachTheLoai_MaTheLoai(@RequestParam("maTheLoai") int maTheLoai,Pageable pageable);

    Page<Sach> findByTenSachContainingAndDanhSachTheLoai_MaTheLoai(@RequestParam("tenSach") String tenSach,@RequestParam("maTheLoai") int maTheLoai,Pageable pageable);


}
