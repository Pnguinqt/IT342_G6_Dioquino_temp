package IT342_G6_Dioquino_Lab1.DugoSugbo.DTO;

public class HospitalRegisterDTO {

    private String name;
    private String address;
    private String city;
    private String province;

    private String contactNumber;
    private String email;
    private String website;

    private String hospitalType;
    private String classification;

    private String licenseNumber;
    private String accreditationBody;

    private String operatingHours;

    private boolean emergencyServices;
    private boolean bloodBankAvailable;

    // optional login link (if needed)
    private String password;

    // GETTERS & SETTERS

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

    public String getHospitalType() { return hospitalType; }
    public void setHospitalType(String hospitalType) { this.hospitalType = hospitalType; }

    public String getClassification() { return classification; }
    public void setClassification(String classification) { this.classification = classification; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public String getAccreditationBody() { return accreditationBody; }
    public void setAccreditationBody(String accreditationBody) { this.accreditationBody = accreditationBody; }

    public String getOperatingHours() { return operatingHours; }
    public void setOperatingHours(String operatingHours) { this.operatingHours = operatingHours; }

    public boolean isEmergencyServices() { return emergencyServices; }
    public void setEmergencyServices(boolean emergencyServices) { this.emergencyServices = emergencyServices; }

    public boolean isBloodBankAvailable() { return bloodBankAvailable; }
    public void setBloodBankAvailable(boolean bloodBankAvailable) { this.bloodBankAvailable = bloodBankAvailable; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}