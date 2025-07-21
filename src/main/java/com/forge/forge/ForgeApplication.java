package com.forge.forge;

import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ForgeApplication {

	public static void main(String[] args) throws IOException, InterruptedException {
		getSudoAccess();
		SpringApplication.run(ForgeApplication.class, args);
	}

	private static void getSudoAccess() throws IOException, InterruptedException {
		ProcessBuilder builder = new ProcessBuilder();
		builder.command("sudo", "echo");
		Process process = builder.start();
		process.waitFor();
		process.destroy();
	}
}
