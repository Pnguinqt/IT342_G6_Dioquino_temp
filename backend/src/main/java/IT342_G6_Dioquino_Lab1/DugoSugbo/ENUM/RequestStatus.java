package IT342_G6_Dioquino_Lab1.DugoSugbo.ENUM;



public enum RequestStatus {
    PENDING,      // newly submitted request, waiting for hospital review
    UNDER_REVIEW, // hospital is currently checking documents/info
    APPROVED,     // hospital accepted the request
    REJECTED,     // hospital denied the request
    COMPLETED,    // blood request successfully fulfilled
    CANCELLED     // user or hospital cancelled the request
}