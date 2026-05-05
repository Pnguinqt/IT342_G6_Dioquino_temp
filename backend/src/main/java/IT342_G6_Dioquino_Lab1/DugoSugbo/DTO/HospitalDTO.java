package IT342_G6_Dioquino_Lab1.DugoSugbo.DTO;

import java.util.List;

public class HospitalDTO {

    private int id;
    private String name;
    private String address;
    private String distance;
    private boolean verified;
    private String postedAt;

    private List<StockDTO> stock;
    private List<String> urgent;

    // getters and setters

    public HospitalDTO() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getPostedAt() {
        return postedAt;
    }

    public void setPostedAt(String postedAt) {
        this.postedAt = postedAt;
    }

    public List<StockDTO> getStock() {
        return stock;
    }

    public void setStock(List<StockDTO> stock) {
        this.stock = stock;
    }

    public List<String> getUrgent() {
        return urgent;
    }

    public void setUrgent(List<String> urgent) {
        this.urgent = urgent;
    }



}