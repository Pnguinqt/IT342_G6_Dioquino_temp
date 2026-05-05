package IT342_G6_Dioquino_Lab1.DugoSugbo.Controller;

import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.UserEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public String register(@RequestBody UserEntity user) {
        userService.register(user);
        return "User registered successfully!";
    }

    // =========================
    // GET ALL USERS
    // =========================
    @GetMapping
    public List<UserEntity> getAll() {
        return userService.getAllUsers();
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping("/{id}")
    public UserEntity getOne(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    // =========================
    // UPDATE USER
    // =========================
    @PutMapping("/{id}")
    public UserEntity update(@PathVariable Long id, @RequestBody UserEntity user) {
        return userService.updateUser(id, user);
    }

    // =========================
    // DELETE USER
    // =========================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}