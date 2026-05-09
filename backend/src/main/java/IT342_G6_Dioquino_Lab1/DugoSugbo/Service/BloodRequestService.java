package IT342_G6_Dioquino_Lab1.DugoSugbo.Service;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.BloodRequestDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.*;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Repository.BloodRequestRepository;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodRequestService {

    @Autowired
    private BloodRequestRepository requestRepo;

    @Autowired
    private HospitalRepository hospitalRepo;

    // CREATE REQUEST
    public BloodRequestDTO createRequest(BloodRequestDTO dto, HospitalEntity hospital, UserEntity user) {

        BloodRequestEntity req = new BloodRequestEntity();

        req.setBloodType(dto.getBloodType());
        req.setUnitsNeeded(dto.getUnitsNeeded());
        req.setReason(dto.getReason());
        req.setUrgencyLevel(dto.getUrgencyLevel());

        req.setHospital(hospital);
        req.setRequestedBy(user);

        requestRepo.save(req);

        return convert(req);
    }

    // GET BY HOSPITAL
    public List<BloodRequestDTO> getByHospital(HospitalEntity hospital) {
        return requestRepo.findByHospital(hospital)
                .stream()
                .map(this::convert)
                .toList();
    }

    // CONVERT
    private BloodRequestDTO convert(BloodRequestEntity r) {

        BloodRequestDTO dto = new BloodRequestDTO();

        dto.setId(r.getId());
        dto.setBloodType(r.getBloodType());
        dto.setUnitsNeeded(r.getUnitsNeeded());
        dto.setReason(r.getReason());
        dto.setUrgencyLevel(r.getUrgencyLevel());
        dto.setStatus(r.getStatus());
        dto.setRequestedAt(r.getRequestedAt());

        dto.setHospitalId(r.getHospital().getId());
        dto.setHospitalName(r.getHospital().getName());

        dto.setRequesterName(r.getRequestedBy().getFirstName());

        return dto;
    }
}