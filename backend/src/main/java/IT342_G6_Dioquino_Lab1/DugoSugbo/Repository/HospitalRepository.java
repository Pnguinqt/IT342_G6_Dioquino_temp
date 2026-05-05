package IT342_G6_Dioquino_Lab1.DugoSugbo.Repository;


import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.HospitalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<HospitalEntity, Long> {
}
