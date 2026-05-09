package IT342_G6_Dioquino_Lab1.DugoSugbo.features.users;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.ChangePasswordDTO;
import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.LoginRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ───────────────────────── REGISTER ─────────────────────────

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserEntity user) {
        System.out.println("PASSWORD RECEIVED: " + user.getPassword());
        UserEntity savedUser = userService.register(user);
        return ResponseEntity.ok(mapToResponse(savedUser));
    }

    // ───────────────────────── LOGIN ─────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request,
                                   HttpServletRequest httpRequest) {

        UserEntity user = userService.login(request.getEmail(), request.getPassword());

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", user.getId());

        return ResponseEntity.ok(mapToResponse(user));
    }

    // ───────────────────────── GET CURRENT USER ─────────────────────────
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("No active session");
        }

        long userId = ((Number) session.getAttribute("userId")).longValue();

        UserEntity user = userService.getUserById(userId);

        return ResponseEntity.ok(mapToResponse(user));
    }

    // ───────────────────────── UPDATE PROFILE ─────────────────────────
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody UserEntity updatedData,
                                           HttpServletRequest request) {

        HttpSession session = request.getSession(false);

        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("No active session");
        }

        long userId = ((Number) session.getAttribute("userId")).longValue();

        UserEntity updatedUser = userService.updateUserProfile(userId, updatedData);

        return ResponseEntity.ok(mapToResponse(updatedUser));
    }

    // ───────────────────────── CHANGE PASSWORD ─────────────────────────
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO request,
                                            HttpServletRequest httpRequest) {

        HttpSession session = httpRequest.getSession(false);

        if (session == null || session.getAttribute("userId") == null) {
            return ResponseEntity.status(401).body("No active session");
        }

        long userId = ((Number) session.getAttribute("userId")).longValue();

        boolean success = userService.changePassword(
                userId,
                request.getCurrentPassword(),
                request.getNewPassword()
        );

        if (!success) {
            return ResponseEntity.status(400).body("Current password is incorrect");
        }

        return ResponseEntity.ok("Password updated successfully");
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

    // ───────────────────────── CRUD (OPTIONAL ADMIN USE) ─────────────────────────

    @GetMapping
    public List<UserEntity> getAll() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserEntity getOne(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
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