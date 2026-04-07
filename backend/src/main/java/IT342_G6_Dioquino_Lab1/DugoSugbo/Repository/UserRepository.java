package IT342_G6_Dioquino_Lab1.DugoSugbo.Repository;



import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByEmail(String email);
}