package IT342_G6_Dioquino_Lab1.DugoSugbo.Controller;


import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.AdminEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public List<AdminEntity> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/{username}")
    public AdminEntity getAdmin(@PathVariable String username) {
        return adminService.getByUsername(username);
    }
}
