package IT342_G6_Dioquino_Lab1.DugoSugbo.Repository;

import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.BloodRequestEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.HospitalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequestEntity, Long> {

    List<BloodRequestEntity> findByHospital(HospitalEntity hospital);
}