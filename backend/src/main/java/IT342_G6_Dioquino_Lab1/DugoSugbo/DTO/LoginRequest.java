package IT342_G6_Dioquino_Lab1.DugoSugbo.DTO;

public class LoginRequest {
    public String email;
    public String password;

    public LoginRequest() {}

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
