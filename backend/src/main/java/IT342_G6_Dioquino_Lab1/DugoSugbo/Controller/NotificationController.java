package IT342_G6_Dioquino_Lab1.DugoSugbo.Controller;

import IT342_G6_Dioquino_Lab1.DugoSugbo.DTO.NotificationDTO;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationController {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // 🔔 call this when booking happens
    public void sendBookingNotification(Long bookingId) {
        messagingTemplate.convertAndSend(
                "/topic/notifications",
                new NotificationDTO("BOOKING", "New booking received", bookingId)
        );
    }

    // 🔔 call this when hospital registers
    public void sendHospitalNotification(Long hospitalId) {
        messagingTemplate.convertAndSend(
                "/topic/notifications",
                new NotificationDTO("HOSPITAL", "New hospital registered", hospitalId)
        );
    }

    // 🔔 call this when status changes
    public void sendStatusUpdate(String msg, Long id) {
        messagingTemplate.convertAndSend(
                "/topic/notifications",
                new NotificationDTO("STATUS", msg, id)
        );
    }
}
