package vn.mynguyen.webbansach_backend.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import vn.mynguyen.webbansach_backend.entity.NguoiDung;
import vn.mynguyen.webbansach_backend.entity.TheLoai;

@Configuration
public class MethodRestConfig implements RepositoryRestConfigurer {
    private String url = "http://localhost:3000";
    @Autowired
    private EntityManager entityManager;
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        // expose ids
        // Cho phép trả về id
        config.exposeIdsFor(entityManager.getMetamodel().getEntities().stream().map(Type::getJavaType).toArray(Class[]::new));
        // config.exposeIdsFor(TheLoai.class);


        //CORS configuration(Cho phép private url fontend connect với BE)
        cors.addMapping("/**")
                .allowedOrigins(url)
                .allowedMethods("GET","POST","DELETE","PUT");


        // Chặn các methods
        HttpMethod[] chanCacPhuongThuc ={
                HttpMethod.POST,
                HttpMethod.PUT,
                HttpMethod.PATCH,
                HttpMethod.DELETE,
        };
        disableHttpMethods(TheLoai.class, config, chanCacPhuongThuc);

        // Chặn các method DELETE
        HttpMethod[] phuongThucDelete = {
                HttpMethod.DELETE
        };
        disableHttpMethods(NguoiDung.class, config,phuongThucDelete );


    }

    private void disableHttpMethods(Class c,
                                    RepositoryRestConfiguration config,
                                    HttpMethod[] methods){
        config.getExposureConfiguration()
                .forDomainType(c)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(methods))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(methods));
    }
}