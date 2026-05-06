package IT342_G6_Dioquino_Lab1.DugoSugbo.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "hospital_clinic")
public class HospitalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String address;
    private String contactInfo;

    private boolean verified;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne
    @JoinColumn(name = "admin_id")
    private UserEntity admin;

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL)
    private List<BloodStockEntity> stock;

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL)
    private List<BloodRequestEntity> requests;

    // getters and setters

    public HospitalEntity() {
    }

    public HospitalEntity(String name, String address, String contactInfo, boolean verified) {
        this.name = name;
        this.address = address;
        this.contactInfo = contactInfo;
        this.verified = verified;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

        public UserEntity getAdmin() {
            return admin;
        }

        public void setAdmin(UserEntity admin) {
            this.admin = admin;
        }

        public List<BloodStockEntity> getStock() {
            return stock;
        }

        public void setStock(List<BloodStockEntity> stock) {
            this.stock = stock;
        }

        public List<BloodRequestEntity> getRequests() {
            return requests;
        }

        public void setRequests(List<BloodRequestEntity> requests) {
            this.requests = requests;
        }




}
