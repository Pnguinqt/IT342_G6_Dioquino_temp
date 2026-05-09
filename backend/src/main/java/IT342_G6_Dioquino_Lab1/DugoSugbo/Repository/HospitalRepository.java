package IT342_G6_Dioquino_Lab1.DugoSugbo.Repository;

import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.HospitalEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HospitalRepository extends JpaRepository<HospitalEntity, Long> {

    Optional<HospitalEntity> findByAdmin(UserEntity admin);
}