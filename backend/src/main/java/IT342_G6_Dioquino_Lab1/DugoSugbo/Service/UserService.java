package IT342_G6_Dioquino_Lab1.DugoSugbo.Service;

import IT342_G6_Dioquino_Lab1.DugoSugbo.Entity.UserEntity;
import IT342_G6_Dioquino_Lab1.DugoSugbo.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register user with email check
    public UserEntity register(UserEntity user) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        return userRepository.save(user);
    }

    public UserEntity getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }



    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }



    public UserEntity updateUser(Long id, UserEntity updatedUser) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setContactNumber(updatedUser.getContactNumber());
        user.setAddress(updatedUser.getAddress());
        user.setBirthdate(updatedUser.getBirthdate());

        return userRepository.save(user);
    }

    public UserEntity login(String email, String password){

         UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}


