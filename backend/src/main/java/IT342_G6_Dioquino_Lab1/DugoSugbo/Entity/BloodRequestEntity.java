package IT342_G6_Dioquino_Lab1.DugoSugbo.Entity;

import IT342_G6_Dioquino_Lab1.DugoSugbo.ENUM.RequestStatus;
import IT342_G6_Dioquino_Lab1.DugoSugbo.ENUM.UrgencyLevel;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
public class BloodRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodType;
    private int units;
    private String purpose;

    @Enumerated(EnumType.STRING)
    private UrgencyLevel urgency;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private LocalDateTime createdAt;

    private String fullName;
    private LocalDate birthdate;
    private String address;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private HospitalEntity hospital;

    @OneToOne(mappedBy = "request", cascade = CascadeType.ALL)
    private RequestDocumentEntity document;

    // ✅ AUTO SET CREATED AT
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // GETTERS & SETTERS (important for Spring)
    // generate them or use Lombok @Getter @Setter

    public Long getId() {
        return id;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public UrgencyLevel getUrgency() {
        return urgency;
    }

    public void setUrgency(UrgencyLevel urgency) {
        this.urgency = urgency;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public HospitalEntity getHospital() {
        return hospital;
    }

    public void setHospital(HospitalEntity hospital) {
        this.hospital = hospital;
    }

    public RequestDocumentEntity getDocument() {
        return document;
    }

    public void setDocument(RequestDocumentEntity document) {
        this.document = document;
    }


}