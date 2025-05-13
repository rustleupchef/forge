package com.forge.forge;

import java.util.Properties;
import java.util.Random;
import java.util.Scanner;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.password4j.Password;

import jakarta.servlet.http.HttpSession;

@Controller
public class ForgeController {

    private final String sEmail = "code.forge.site@gmail.com";

    private final CustomerService customerService;
    private final ReposService reposService;

    @Autowired
    public ForgeController(CustomerService customerService, ReposService reposService) {
        this.reposService = reposService;
        this.customerService = customerService;
    }

    @GetMapping("/home")
    public String home(HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        return "home";
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }

    @GetMapping("/signup")
    public String signup(HttpSession session) {
        if (session.getAttribute("user") != null) {
            return "redirect:/home";
        }
        return "signup";
    }

    @GetMapping("/login")
    public String login(HttpSession session) {
        if (session.getAttribute("user") != null) {
            return "redirect:/home";
        }
        return "login";
    }

    @GetMapping("/about")
    public String about() {
        return "redirect:/home";
    }

    @PostMapping("/signup")
    @ResponseBody public String signupPost(
        @Param("email") String email,
        @Param("username") String username,
        @Param("password") String password,
        @Param("verificationCode") String verificationCode) throws IOException, MessagingException {
        if (customerService.findCustomerByEmail(email) != null) {
            return "EMAIL_EXISTS";
        }

        if (verificationCode.equals("null") || verificationCode.isEmpty()) {
            int num = new Random().nextInt(1000000);
            sendVerificationCode(email, num);
            return String.valueOf(num);
        }

        customerService.saveCustomer(new Customer(username, email, Password.hash(password).withBcrypt().getResult()));
        return "OK";
    }

    private void sendVerificationCode(String email, int code) throws IOException, MessagingException {
        String subject = "Verification Code";
        String body = "Your verification code is: " + code;
        sendEmail(email, subject, body);
    }

    private void sendEmail(String email, String subject, String body) throws IOException, MessagingException {
        Scanner smtpScanner = new Scanner(new File("smtp"));
        String password = smtpScanner.nextLine();
        smtpScanner.close();

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(sEmail, password);
            }
        });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(sEmail));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
        message.setSubject(subject);
        message.setText(body);
        try {
            Transport.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/login")
    @ResponseBody public String loginPost(
        @Param("email") String email,
        @Param("password") String password,
        HttpSession session) {
        Customer customer = customerService.findCustomerByEmail(email);
        if (customer == null)
            return "EMAIL_NOT_FOUND";
        if (!Password.check(password, customer.getPassword()).withBcrypt())
            return "INVALID_PASSWORD";
        session.setAttribute("user", customer);
        return "OK";
    }
}
