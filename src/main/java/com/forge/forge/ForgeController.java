package com.forge.forge;

import java.util.Random;

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

    private final CustomerService customerService;

    @Autowired
    public ForgeController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping("/home")
    public String home(HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "login";
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
        @Param("verificationCode") String verificationCode) {
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

    private void sendVerificationCode(String email, int code) {
        System.out.println("Sending verification code " + code + " to " + email);
    }

    @PostMapping("/login")
    @ResponseBody public String loginPost(
        @Param("email") String email,
        @Param("password") String password) {
        Customer customer = customerService.findCustomerByEmail(email);
        if (customer == null)
            return "EMAIL_NOT_FOUND";
        if (!Password.check(password, customer.getPassword()).withBcrypt())
            return "INVALID_PASSWORD";
        return "OK";
    }
}
