package com.mustafakahveci.blogging_platform_api.controller;

import com.mustafakahveci.blogging_platform_api.dto.PostResponse;
import com.mustafakahveci.blogging_platform_api.dto.UpdateProfileRequest;
import com.mustafakahveci.blogging_platform_api.dto.UserPublicProfileResponse;
import com.mustafakahveci.blogging_platform_api.dto.UserResponse;
import com.mustafakahveci.blogging_platform_api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser() {
        return userService.getCurrentUser();
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/username/{username}")
    public UserResponse getUserByUsername(@PathVariable String username) {
        return userService.getUserByUsername(username);
    }

    @GetMapping("/{username}/posts")
    public List<PostResponse> getPostsByUsername(@PathVariable String username) {
        return userService.getPostsByUsername(username);
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUserProfile(
            @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateCurrentUserProfile(request);
    }

    @GetMapping("/public/{username}")
    public ResponseEntity<UserPublicProfileResponse> getPublicProfileByUsername(
            @PathVariable String username
    ) {
        return ResponseEntity.ok(userService.getPublicProfileByUsername(username));
    }

}