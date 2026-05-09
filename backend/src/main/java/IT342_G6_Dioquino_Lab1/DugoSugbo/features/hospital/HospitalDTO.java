package IT342_G6_Dioquino_Lab1.DugoSugbo.features.hospital;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.StockDTO;

import java.util.List;

public class HospitalDTO {

    private Long id;

    private String name;
    private String address;
    private String city;
    private String province;

    private String contactNumber;
    private String email;
    private String website;

    private boolean verified;
    private String verificationStatus;

    private String hospitalType;
    private String classification;

    private List<StockDTO> stock;
    private List<String> urgent;

    // ─── GETTERS & SETTERS ─────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getProvince() { return province; }
    public void setProvince(String province) { this.province = province; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getHospitalType() { return hospitalType; }
    public void setHospitalType(String hospitalType) { this.hospitalType = hospitalType; }

    public String getClassification() { return classification; }
    public void setClassification(String classification) { this.classification = classification; }

    public List<StockDTO> getStock() { return stock; }
    public void setStock(List<StockDTO> stock) { this.stock = stock; }

    public List<String> getUrgent() { return urgent; }
    public void setUrgent(List<String> urgent) { this.urgent = urgent; }
}