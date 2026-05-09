package IT342_G6_Dioquino_Lab1.DugoSugbo.Controller;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.HospitalRegisterDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.HospitalEntity;

import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.HospitalService;

import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private UserService userService;

    // ─── REGISTER HOSPITAL (PUBLIC ENDPOINT) ───
    @PostMapping("/register")
    public ResponseEntity<?> registerHospital(@RequestBody HospitalRegisterDTO dto) {

        HospitalEntity hospital = hospitalService.registerHospital(dto);

        return ResponseEntity.ok(hospital);
    }

    // ─── GET ALL HOSPITALS ───
    @GetMapping
    public ResponseEntity<?> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    // ─── GET HOSPITAL BY ID (optional useful endpoint) ───
    @GetMapping("/{id}")
    public ResponseEntity<?> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }
}


}