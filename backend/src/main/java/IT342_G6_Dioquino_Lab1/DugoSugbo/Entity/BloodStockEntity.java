package IT342_G6_Dioquino_Lab1.DugoSugbo.Entity;

import IT342_G6_Dioquino_Lab1.DugoSugbo.ENUM.StockStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "blood_stock")
public class BloodStockEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodType; // A+, B-, etc.
    private int units;

    @Enumerated(EnumType.STRING)
    private StockStatus status; // HIGH, MEDIUM, LOW, NONE

    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private HospitalEntity hospital;

    public BloodStockEntity() {
    }

    public BloodStockEntity(String bloodType, int units, StockStatus status) {
        this.bloodType = bloodType;
        this.units = units;
        this.status = status;
    }

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

    public StockStatus getStatus() {
        return status;
    }

    public void setStatus(StockStatus status) {
        this.status = status;
    }

    public HospitalEntity getHospital() {
        return hospital;
    }

    public void setHospital(HospitalEntity hospital) {
        this.hospital = hospital;
    }


}