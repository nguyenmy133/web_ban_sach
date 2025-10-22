package vn.mynguyen.webbansach_backend.service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;
import vn.mynguyen.webbansach_backend.entity.NguoiDung;
import vn.mynguyen.webbansach_backend.entity.Quyen;

import java.security.Key;
import java.security.Signature;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {
    public static final String SECRET="nsRgLStiROkffc74okTjzwDkO50bgupXW8T4xB9dj9Q=";

    @Autowired
    private UserService userService;

    //Tao JWT dua tren ten dang nhap
    public String generateToken(String tenDangNhap){
        Map<String,Object> claims=new HashMap<>();
        NguoiDung nguoiDung=userService.findByUsername(tenDangNhap);

        boolean isAdmin=false;
        boolean isStaff=false;
        boolean isUser=false;
        if(nguoiDung != null && nguoiDung.getDanhSachQuyen().size()>0) {
            List<Quyen> list = nguoiDung.getDanhSachQuyen();
            for (Quyen q : list) {
                if (q.getTenQuyen().equals("ADMIN")) {
                    isAdmin=true;
                }
                if (q.getTenQuyen().equals("STAFF")) {
                       isStaff=true;
                }
                if (q.getTenQuyen().equals("USER")) {
                    isUser=true;
                }
            }
        }
        claims.put("isAdmin", isAdmin);
        claims.put("isStaff", isStaff);
        claims.put("isUser", isUser);
        return createToken(claims,tenDangNhap);
    }

    //Tao JWT voi cac claim da chon
    public String createToken(Map<String, Object> claims,String tenDangNhap){
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(tenDangNhap)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+24*60*60*1000))
                .signWith(SignatureAlgorithm.HS256,getSignKey())
                .compact();

    }
    //LAY SECRET KEY
    private Key getSignKey(){
        byte[] keyBytes= Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    //Trich xuat thong tin
    private Claims extractAllClaims(String token){
        return Jwts.parser().setSigningKey(getSignKey()).parseClaimsJws(token).getBody();
    }

    //Trich xuat thong tin cho 1 claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsTFunction){
        final Claims claims=extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }
    //Kiem tra thoi gian het han tu JWT
    public Date extractExpiration(String token){
        return extractClaim(token,Claims::getExpiration);
    }

    public String extractUsername(String token){
        return extractClaim(token,Claims::getSubject);
    }

    //Kiem tra JWT da het han
    private Boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    //Kiem tra tinh hop le
    public Boolean validateToken(String token, UserDetails userDetails){
        final String tenDangNhap=extractUsername(token);
        return (tenDangNhap.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

}
















