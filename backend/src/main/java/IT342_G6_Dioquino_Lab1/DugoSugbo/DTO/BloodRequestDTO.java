package IT342_G6_Dioquino_Lab1.DugoSugbo.DTO;

import IT342_G6_Dioquino_Lab1.DugoSugbo.ENUM.UrgencyLevel;
import org.springframework.web.multipart.MultipartFile;


public class BloodRequestDTO {

    public Long userId;
    public Long hospitalId;

    public String bloodType;
    public int units;
    public String purpose;
    public UrgencyLevel urgency;

    public String fullName;
    public String birthdate; // keep string for frontend simplicity
    public String address;
    public String notes;
}