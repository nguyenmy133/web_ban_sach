package vn.mynguyen.webbansach_backend.config;

import java.util.Objects;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.metamodel.EntityType;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

//hiển thị id ở body trên Postman

@Configuration
public class RestConfig implements RepositoryRestConfigurer {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        Class<?>[] entityClasses = entityManager.getMetamodel().getEntities().stream()
                .map(EntityType::getJavaType)
                .filter(Objects::nonNull)
                .toArray(Class<?>[]::new);

        if (entityClasses.length > 0) {
            config.exposeIdsFor(entityClasses); // <-- bật hiển thị id trong JSON
        }
    }
}
