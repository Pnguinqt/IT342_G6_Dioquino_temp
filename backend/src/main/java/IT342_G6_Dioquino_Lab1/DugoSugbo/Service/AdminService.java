package IT342_G6_Dioquino_Lab1.DugoSugbo.Service;


import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.AdminEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(AdminRepository adminRepository,
                        PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ❌ No createAdmin endpoint exposed in controller
    // ✔️ Only internal/manual creation allowed

    public List<AdminEntity> getAllAdmins() {
        return adminRepository.findAll();
    }

    public AdminEntity getByUsername(String username) {
        return adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    // 🧠 Utility for manual seeding or internal use only
    public AdminEntity createAdminManually(String username, String rawPassword) {
        AdminEntity admin = new AdminEntity();
        admin.setUsername(username);

        // 🔐 BCrypt hashing
        admin.setPassword(passwordEncoder.encode(rawPassword));

        admin.setRole("ADMIN");
        return adminRepository.save(admin);
    }
}
