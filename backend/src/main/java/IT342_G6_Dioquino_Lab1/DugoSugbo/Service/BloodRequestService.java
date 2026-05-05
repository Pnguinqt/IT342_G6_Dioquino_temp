package IT342_G6_Dioquino_Lab1.DugoSugbo.Service;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.BloodRequestDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.BloodRequestEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Repository.BloodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    public BloodRequestEntity createRequest(BloodRequestDTO dto) {

        BloodRequestEntity request = new BloodRequestEntity();

        request.setBloodType(dto.bloodType);
        request.setUnits(dto.units);
        request.setPurpose(dto.purpose);
        request.setUrgency(dto.urgency);
        request.setFullName(dto.fullName);
        request.setAddress(dto.address);

        request.setBirthdate(LocalDate.parse(dto.birthdate));
        request.setCreatedAt(LocalDateTime.now());

        // TODO: attach user + hospital later
        // request.setUser(...)
        // request.setHospital(...)

        return bloodRequestRepository.save(request);
    }
}