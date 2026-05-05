package IT342_G6_Dioquino_Lab1.DugoSugbo.DTO;


import java.time.LocalDate;

public class UserResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private LocalDate birthdate;
    private String contactNumber;
    private String address;

    // Empty constructor (required for frameworks like Spring)
    public UserResponseDTO() {
    }

    // Full constructor
    public UserResponseDTO(Long id,
                        String firstName,
                        String lastName,
                        String email,
                        LocalDate birthdate,
                        String contactNumber,
                        String address) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.birthdate = birthdate;
        this.contactNumber = contactNumber;
        this.address = address;
    }

    // ───────────────────────── GETTERS ─────────────────────────

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getAddress() {
        return address;
    }

    // ───────────────────────── SETTERS ─────────────────────────

    public void setId(Long id) {
        this.id = id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}