package IT342_G6_Dioquino_Lab1.DugoSugbo.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "request_documents")
public class RequestDocumentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // doctor signature file
    private String doctorFilePath;

    // patient face photo
    private String faceImagePath;

    private String fileType; // optional (pdf, jpg, png)
    private String comments;
    private LocalDateTime createdAt = LocalDateTime.now();


    @OneToOne
    @JoinColumn(name = "request_id")
    private BloodRequestEntity request;

    public RequestDocumentEntity() {
    }

    public RequestDocumentEntity(String doctorFilePath, String faceImagePath, String fileType, String comments, BloodRequestEntity request, LocalDateTime createdAt) {
        this.doctorFilePath = doctorFilePath;
        this.faceImagePath = faceImagePath;
        this.fileType = fileType;
        this.comments = comments;
        this.request = request;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getDoctorFilePath() {
        return doctorFilePath;
    }

    public void setDoctorFilePath(String doctorFilePath) {
        this.doctorFilePath = doctorFilePath;
    }

    public String getFaceImagePath() {
        return faceImagePath;
    }

    public void setFaceImagePath(String faceImagePath) {
        this.faceImagePath = faceImagePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

