package vn.mynguyen.webbansach_backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import vn.mynguyen.webbansach_backend.entity.HinhAnh;

@RepositoryRestResource(path="hinh-anh")
public interface HinhAnhRepository extends JpaRepository<HinhAnh,Integer> {
}
