package vn.mynguyen.webbansach_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService{

    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void sendMessage(String from, String to, String subject, String text) {
        //MimeMailMessage: co dinh kem anh, media
        //SimpleMailMessage: noi dung thong thuong

       MimeMessage message=emailSender.createMimeMessage();

        try {
            MimeMessageHelper helper=new MimeMessageHelper(message,true);
            helper.setFrom(from);
            helper.setSubject(subject);
            helper.setText(text);
            helper.setTo(to);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }


        //thuc hien gui email
        emailSender.send(message);

    }
}
