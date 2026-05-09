package IT342_G6_Dioquino_Lab1.DugoSugbo.DTO;

import java.time.LocalDateTime;

public class BloodRequestDTO {

    private Long id;

    private String bloodType;
    private int unitsNeeded;
    private String reason;

    private String urgencyLevel;
    private String status;

    private LocalDateTime requestedAt;

    private Long hospitalId;
    private String hospitalName;

    private String requesterName;

    // getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }

    public int getUnitsNeeded() { return unitsNeeded; }
    public void setUnitsNeeded(int unitsNeeded) { this.unitsNeeded = unitsNeeded; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getUrgencyLevel() { return urgencyLevel; }
    public void setUrgencyLevel(String urgencyLevel) { this.urgencyLevel = urgencyLevel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }
}