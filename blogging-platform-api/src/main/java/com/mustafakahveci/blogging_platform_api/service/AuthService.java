package com.mustafakahveci.blogging_platform_api.service;

import com.mustafakahveci.blogging_platform_api.dto.AuthResponse;
import com.mustafakahveci.blogging_platform_api.dto.LoginRequest;
import com.mustafakahveci.blogging_platform_api.dto.RegisterRequest;
import com.mustafakahveci.blogging_platform_api.exception.ResourceNotFoundException;
import com.mustafakahveci.blogging_platform_api.model.Role;
import com.mustafakahveci.blogging_platform_api.model.User;
import com.mustafakahveci.blogging_platform_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mustafakahveci.blogging_platform_api.exception.DuplicateResourceException;
import com.mustafakahveci.blogging_platform_api.exception.InvalidCredentialsException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username already exists");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already exists");
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .bio(request.bio())
                .profileImageUrl(request.profileImageUrl())
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser.getUsername());

        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getUsername());

        return new AuthResponse(token);
    }
}