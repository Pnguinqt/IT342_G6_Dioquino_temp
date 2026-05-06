package IT342_G6_Dioquino_Lab1.DugoSugbo.Repository;


import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.BloodRequestEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.ENUM.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequestEntity, Long> {

    // Get all requests of a specific user
    List<BloodRequestEntity> findByUserId(Long userId);

    // Get all requests per hospital (for hospital dashboard)
    List<BloodRequestEntity> findByHospitalId(Long hospitalId);

    // Filter by status (PENDING, APPROVED, REJECTED, COMPLETED)
    List<BloodRequestEntity> findByStatus(RequestStatus status);

    // Optional: hospital + status filter (very useful for admin panel)
    List<BloodRequestEntity> findByHospitalIdAndStatus(Long hospitalId, RequestStatus status);
}