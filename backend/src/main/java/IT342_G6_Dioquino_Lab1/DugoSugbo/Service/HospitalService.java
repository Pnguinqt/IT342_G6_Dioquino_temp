package IT342_G6_Dioquino_Lab1.DugoSugbo.Service;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.HospitalRegisterDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.HospitalEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.UserEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    // ───────────────── REGISTER HOSPITAL ─────────────────
    public HospitalEntity registerHospital(HospitalRegisterDTO dto) {
        HospitalEntity hospital = new HospitalEntity();

        hospital.setName(HospitalRegisterDTO.getName());
        hospital.setEmail(dto.getEmail());
        hospital.setAddress(dto.getAddress());
        hospital.setPhone(dto.getPhone());
        hospital.setType(dto.getType());
        hospital.setStatus("PENDING");

        return hospitalRepository.save(hospital);
    }

    // ───────────────── GET BY ADMIN ─────────────────
    public HospitalEntity getHospitalEntityByAdmin(UserEntity admin) {
        return hospitalRepository.findByAdmin(admin)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    // ───────────────── GET ALL ─────────────────
    public List<HospitalEntity> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    // ───────────────── CURRENT HOSPITAL ─────────────────
    public HospitalEntity getCurrentHospital(UserEntity admin) {
        return hospitalRepository.findByAdmin(admin)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }
}