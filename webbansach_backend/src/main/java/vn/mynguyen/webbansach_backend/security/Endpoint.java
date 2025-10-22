package vn.mynguyen.webbansach_backend.security;

public class Endpoint {

    public static final String font_end_host = "http://localhost:3000";

    public static final String[] PUBLIC_GET_ENDPOINT = {
            "/sach",
            "/sach/**",
            "/hinh-anh",
            "/hinh-anh/**",
            "/nguoi-dung/search/existsByTenDangNhap",
            "/nguoi-dung/search/existsByEmail",
            "/tai-khoan/kich-hoat",
    };

    public static final String[] PUBLIC_POST_ENDPOINT = {

            "/tai-khoan/dang-ky",
            "/tai-khoan/dang-nhap",
            "/don-hang"
    };

    public static final String[] ADMIN_GET_ENDPOINT = {
            "/nguoi-dung",
            "/nguoi-dung/**",
    };

    public static final String[] ADMIN_POST_ENDPOINT = {
            "/sach/**",
            "/sach",
    };
}
