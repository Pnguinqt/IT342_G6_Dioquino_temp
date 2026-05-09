package IT342_G6_Dioquino_Lab1.DugoSugbo.features.users;


import jakarta.persistence.*;
import java.time.LocalDate;
import IT342_G6_Dioquino_Lab1.DugoSugbo.ENUM.Role;
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ─── BASIC INFO ─────────────────────────────
    private String firstName;
    private String lastName;

    private LocalDate birthdate;

    // ─── CONTACT INFO ───────────────────────────
    @Column(unique = true, nullable = false)
    private String email;

    private String contactNumber;
    private String address;

    // ─── AUTH ───────────────────────────────────
    @Column(nullable = false)
    private String password;

    // ─── ROLE (NEW) ─────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; // default role

    // ─── CONSTRUCTORS ───────────────────────────
    public UserEntity() {}

    public UserEntity(String firstName, String lastName, LocalDate birthdate,
                      String email, String contactNumber, String address,
                      String password, Role role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
        this.email = email;
        this.contactNumber = contactNumber;
        this.address = address;
        this.password = password;
        this.role = role;
    }

    // ─── GETTERS & SETTERS ──────────────────────
    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }
    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactNumber() {
        return contactNumber;
    }
    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    // ─── ROLE GETTER/SETTER ─────────────────────
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}