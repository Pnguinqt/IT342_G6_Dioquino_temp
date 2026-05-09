package IT342_G6_Dioquino_Lab1.DugoSugbo.DTO;

public class NotificationDTO {
    private String type;   // BOOKING, HOSPITAL, STATUS
    private String message;
    private Long id;

    public NotificationDTO(String type, String message, Long id) {
        this.type = type;
        this.message = message;
        this.id = id;
    }

    // getters/setters

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

}