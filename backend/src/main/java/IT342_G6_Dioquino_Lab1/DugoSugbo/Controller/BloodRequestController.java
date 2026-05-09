package IT342_G6_Dioquino_Lab1.DugoSugbo.Controller;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.BloodRequestDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.UserEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.BloodRequestService;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.HospitalService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class BloodRequestController {

    @Autowired
    private BloodRequestService requestService;

    @Autowired
    private HospitalService hospitalService;

    // CREATE REQUEST (SESSION USER)
    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody BloodRequestDTO dto,
            HttpSession session
    ) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(401).body("No session");
        }

        var hospital = hospitalService.getHospitalEntityByAdmin(user);

        return ResponseEntity.ok(
                requestService.createRequest(dto, hospital, user)
        );
    }

    // GET REQUESTS OF LOGGED HOSPITAL
    @GetMapping("/hospital")
    public ResponseEntity<?> getHospitalRequests(HttpSession session) {

        UserEntity user = (UserEntity) session.getAttribute("user");

        if (user == null) {
            return ResponseEntity.status(401).body("No session");
        }

        var hospital = hospitalService.getHospitalEntityByAdmin(user);

        List<BloodRequestDTO> requests =
                requestService.getByHospital(hospital);

        return ResponseEntity.ok(requests);
    }
}