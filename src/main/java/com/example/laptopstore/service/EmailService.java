package com.example.laptopstore.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Đặt lại mật khẩu - LaptopStore");
        message.setText(
                "Xin chào,\n\n" +
                        "Bạn vừa yêu cầu đặt lại mật khẩu tài khoản LaptopStore.\n" +
                        "Vui lòng bấm vào đường link sau để đặt mật khẩu mới (link có hiệu lực trong 30 phút):\n\n" +
                        resetLink + "\n\n" +
                        "Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.\n\n" +
                        "Trân trọng,\nLaptopStore"
        );

        mailSender.send(message);
    }
}