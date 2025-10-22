package vn.mynguyen.webbansach_backend.ai;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import vn.mynguyen.webbansach_backend.ai.dto.SachSearchHit;

public interface SachSearchRepository extends org.springframework.data.repository.Repository<vn.mynguyen.webbansach_backend.entity.Sach, Integer> {

    @Query(value = """
        SELECT 
          s.ma_sach        AS maSach,
          s.ten_sach       AS tenSach,
          s.ten_tac_gia    AS tenTacGia,
          s.mo_ta          AS moTa,
          MATCH(s.ten_sach, s.mo_ta) AGAINST (:q IN NATURAL LANGUAGE MODE) AS score
        FROM sach s
        WHERE MATCH(s.ten_sach, s.mo_ta) AGAINST (:q IN NATURAL LANGUAGE MODE)
        ORDER BY score DESC
        """,
            countQuery = """
        SELECT COUNT(*) 
        FROM sach s
        WHERE MATCH(s.ten_sach, s.mo_ta) AGAINST (:q IN NATURAL LANGUAGE MODE)
        """,
            nativeQuery = true)
    Page<SachSearchHit> searchFulltext(@Param("q") String q, Pageable pageable);
}
