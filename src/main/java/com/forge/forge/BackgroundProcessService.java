package com.forge.forge;

import java.io.IOException;
import java.io.InputStreamReader;

import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;

@EnableAsync
@Service
public class BackgroundProcessService {

    @Async
    public void pingProcessAsync(HttpSession session) throws IOException {
        Process process = (Process) session.getAttribute("process");
        if (process == null || !process.isAlive()) {
            return;
        }

        InputStreamReader reader = new InputStreamReader(process.getInputStream());
        while (process.isAlive()) {
            if (reader.ready() == false) {
                continue;
            }
            int token;
            token = reader.read();
            if (token == -1) continue;
    
            String existingOutput = (String) session.getAttribute("processOutput");
            if (existingOutput == null) {
                existingOutput = "";
            }
            existingOutput += (char) token;
            session.setAttribute("processOutput", existingOutput);
        }
        reader.close();
    }
}
