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

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public UserEntity getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public UserEntity update(Long id, UserEntity user) {
        UserEntity existingUser = getById(id);
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setContactNumber(user.getContactNumber());
        existingUser.setPassword(user.getPassword());
        return userRepository.save(existingUser);
    }

    public void delete(Long id) {
        userRepository.deleteById(id);
    }
}