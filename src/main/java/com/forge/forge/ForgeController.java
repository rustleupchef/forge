package com.forge.forge;

import java.util.ArrayList;
import java.util.List;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/create-project")
    public String createProject(HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        return "create-project";
    }

    @PostMapping("/create-project")
    public void createProjectPost(
        String name,
        String description,
        boolean isprivate,
        byte type,
        HttpSession session) throws IOException {
        Customer customer = (Customer) session.getAttribute("user");
        Repos repo = new Repos(name, description, customer.getEmail(), isprivate, type);
        reposService.saveRepos(repo);

        String[] types = {"java", "python", "javascript", "cpp", "csharp", "c"};
        String templatePath = "project-templates/" + types[type - 1] + "/";
        String outputPath = "projects/" + repo.getId() + "/";
        new File(outputPath).mkdirs();
        setup(templatePath, outputPath);
    }

    private void setup(String sourcePath, String outputPath) throws IOException {
        File source = new File(sourcePath);
        File[] sourceFiles = source.listFiles();

        for (File file : sourceFiles) {
            if (file.isDirectory()) {
                String nSourcePath = file.getPath();
                File f = new File(outputPath + file.getName() + "/");
                if (!f.exists()) f.mkdir();
                String nOutputPath = f.getPath() + "/";
                setup(nSourcePath, nOutputPath);
                continue;
            }
            copy(file, outputPath);
        }
    }

    private void copy (File file, String outputPath) throws IOException {
        Path sourceFile = Paths.get(file.getAbsolutePath());
        Path targetFile = Paths.get(outputPath).resolve(file.getName());
        Files.copy(sourceFile, targetFile, StandardCopyOption.REPLACE_EXISTING);
    }
        

    @PostMapping("/get-projects")
    @ResponseBody public List<Repos> getProjectsPost(HttpSession session) {
        Customer customer = (Customer) session.getAttribute("user");
        return reposService.findReposByOwner(customer.getEmail());
    }

    @PostMapping("/signup")
    @ResponseBody public String signupPost(
        String email,
        String username,
        String password,
        String verificationCode) throws IOException, MessagingException {
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
        String email,
        String password,
        HttpSession session) {
        Customer customer = customerService.findCustomerByEmail(email);
        if (customer == null)
            return "EMAIL_NOT_FOUND";
        if (!Password.check(password, customer.getPassword()).withBcrypt())
            return "INVALID_PASSWORD";
        session.setAttribute("user", customer);
        return "OK";
    }

    @GetMapping("/project")
    public String getProject(Long id, HttpSession session) {
        if (session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        
        Repos repo = reposService.findReposById(id);
        if (repo == null) {
            return "redirect:/home";
        }

        Customer customer = (Customer) session.getAttribute("user");
        if (repo.isPrivate() && !repo.getOwner().equals(customer.getEmail())) {
            return "redirect:/home";
        }

        return "project";
    }

    @PostMapping("/project")
    @ResponseBody public List<ForgeFile> getProjectPost(Long id, HttpSession session) {
        List<ForgeFile> forgeFiles = new ArrayList<ForgeFile>();
        forgeFiles = getFilesFromDirectory(new File("projects/" + id + "/"), forgeFiles);
        return forgeFiles;
    }

    private List<ForgeFile> getFilesFromDirectory(File directory, List<ForgeFile> forgeFiles) {
        File[] files = directory.listFiles();
        if (files == null) return forgeFiles;

        for (File file : files) {
            if (file.isDirectory()) {
                ForgeFile forgeFile = new ForgeFile();
                forgeFile.setName(file.getName());
                forgeFile.setPath(file.getPath());
                forgeFile.setType("directory");
                forgeFile.setContent("");
                forgeFiles.add(forgeFile);
                forgeFiles = getFilesFromDirectory(file, forgeFiles);
            } else {
                if (file.getName().startsWith(".") 
                || file.getName().equals("Dockerfile"))
                    continue;
                ForgeFile forgeFile = new ForgeFile();
                forgeFile.setName(file.getName());
                forgeFile.setPath(file.getPath());
                forgeFile.setType(file.getName().substring(file.getName().lastIndexOf('.') + 1));
                try {
                    forgeFile.setContent(Files.readString(file.toPath()));
                } catch (IOException e) {
                    e.printStackTrace();
                    forgeFile.setContent("An error occured with this file");
                }
                forgeFiles.add(forgeFile);
            }
        }
        return forgeFiles;
    }

    @PostMapping("/run")
    @ResponseBody public String run(Long id) {
        
        return "";
    }
}