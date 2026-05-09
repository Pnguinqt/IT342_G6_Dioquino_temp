package IT342_G6_Dioquino_Lab1.DugoSugbo.Repository;



import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
    Optional<AdminEntity> findByUsername(String username);
}
