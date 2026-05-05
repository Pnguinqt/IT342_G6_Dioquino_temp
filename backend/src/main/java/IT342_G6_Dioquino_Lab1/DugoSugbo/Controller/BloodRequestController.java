package IT342_G6_Dioquino_Lab1.DugoSugbo.Controller;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.BloodRequestDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class BloodRequestController {

    @Autowired
    private BloodRequestService service;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody BloodRequestDTO dto) {
        return ResponseEntity.ok(service.createRequest(dto));
    }
}