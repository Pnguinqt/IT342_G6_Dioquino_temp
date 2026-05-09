package IT342_G6_Dioquino_Lab1.DugoSugbo.Admin;

import IT342_G6_Dioquino_Lab1.DugoSugbo.Service.AdminService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AdminSeeder {

    @Bean
    CommandLineRunner seedAdmin(AdminService adminService) {
        return args -> {

            // check if admin already exists (simple safety)
            if (adminService.getAllAdmins().isEmpty()) {

                adminService.createAdminManually(
                        "admin@gmail.com",
                        "admin123"
                );

                System.out.println("✅ Default admin created");
            }
        };
    }
}