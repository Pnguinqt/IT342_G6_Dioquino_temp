package IT342_G6_Dioquino_Lab1.DugoSugbo.Controller;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.LoginRequest;
import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.UserResponseDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.UserService;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.UserEntity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserService userService;

    // ───────────────────────── LOGIN ─────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletRequest httpRequest) {

        UserEntity user = userService.login(request.getEmail(), request.getPassword());

        if (user == null) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        // IMPORTANT: always explicitly create session ON LOGIN ONLY
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", user.getId());

        System.out.println("LOGIN SESSION ID: " + session.getId());
        System.out.println("USER ID SET: " + user.getId());

        return ResponseEntity.ok(mapToResponse(user));
    }

    // ───────────────────────── GET CURRENT USER ─────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        // ❗ CRITICAL FIX: DO NOT create session here
        HttpSession session = request.getSession(false);

        if (session == null) {
            return ResponseEntity.status(401).body("No active session");
        }

        Object userIdObj = session.getAttribute("userId");

        if (userIdObj == null) {
            return ResponseEntity.status(401).body("Session expired or invalid");
        }

        long userId = ((Number) userIdObj).longValue();

        UserEntity user;
        try {
            user = userService.getUserById(userId);
        } catch (RuntimeException e) {
            session.invalidate();
            return ResponseEntity.status(401).body("Invalid session user");
        }

        System.out.println("ME SESSION ID: " + session.getId());
        System.out.println("USER ID IN SESSION: " + userId);

        return ResponseEntity.ok(mapToResponse(user));
    }

    // ───────────────────────── LOGOUT ─────────────────────────
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok("Logged out successfully");
    }

    // ───────────────────────── MAPPER ─────────────────────────
    private UserResponseDTO mapToResponse(UserEntity user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getBirthdate(),
                user.getContactNumber(),
                user.getAddress()
        );
    }
}