package IT342_G6_Dioquino_Lab1.DugoSugbo.DTO;

public class StockDTO {
    private String type;
    private int units;
    private String status;

    public StockDTO() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}