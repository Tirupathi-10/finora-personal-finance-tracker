
package com.tiru.PersonalFinanceTracker.Controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.tiru.PersonalFinanceTracker.Entity.User;
import com.tiru.PersonalFinanceTracker.Repository.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/auth")
public class AuthController {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public AuthController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {

		if (user.getName() == null || user.getName().isBlank() || user.getEmail() == null || user.getEmail().isBlank()
				|| user.getPassword() == null || user.getPassword().length() < 8) {

			return ResponseEntity.badRequest()
					.body(Map.of("message", "Name, email and password (minimum 8 characters) are required."));
		}

		if (userRepository.existsByEmail(user.getEmail().trim())) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already registered."));
		}

		user.setName(user.getName().trim());
		user.setEmail(user.getEmail().trim().toLowerCase());
		user.setPassword(passwordEncoder.encode(user.getPassword()));

		User savedUser = userRepository.save(user);

		return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("id", savedUser.getId(), "name",
				savedUser.getName(), "email", savedUser.getEmail(), "message", "Registration successful"));
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User user) {

		if (user.getEmail() == null || user.getPassword() == null) {
			return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
		}

		User existingUser = userRepository.findByEmail(user.getEmail().trim().toLowerCase()).orElse(null);

		if (existingUser == null || !passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid email or password"));
		}

		return ResponseEntity.ok(Map.of("id", existingUser.getId(), "name", existingUser.getName(), "email",
				existingUser.getEmail(), "message", "Login successful"));
	}

}
