package IT342_G6_Dioquino_Lab1.DugoSugbo.Service;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.HospitalDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.ENUM.StockStatus;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.HospitalEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.StockDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Repository.HospitalRepository;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.BloodStockEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public List<HospitalDTO> getAllHospitals() {

        List<HospitalEntity> hospitals = hospitalRepository.findAll();

        return hospitals.stream().map(h -> {

            HospitalDTO dto = new HospitalDTO();

            dto.setId(h.getId());
            dto.setName(h.getName());
            dto.setAddress(h.getAddress());
            dto.setVerified(h.isVerified());

            // fake distance for now (you can integrate Google Maps later)
            dto.setDistance("2.3 km");

            dto.setPostedAt(
                    h.getCreatedAt() != null ? h.getCreatedAt().toLocalDate().toString() : ""
            );

            // map stock
            List<StockDTO> stocks = h.getStock().stream().map(s -> {
                StockDTO sd = new StockDTO();
                sd.setType(s.getBloodType());
                sd.setUnits(s.getUnits());
                sd.setStatus(s.getStatus().name().toLowerCase());
                return sd;
            }).toList();

            dto.setStock(stocks);

            // urgent logic: LOW or NONE stocks
            List<String> urgent = h.getStock().stream()
                    .filter(s -> s.getStatus() == StockStatus.LOW || s.getStatus() == StockStatus.NONE)
                    .map(BloodStockEntity::getBloodType)
                    .toList();

            dto.setUrgent(urgent);

            return dto;

        }).toList();
    }
}
