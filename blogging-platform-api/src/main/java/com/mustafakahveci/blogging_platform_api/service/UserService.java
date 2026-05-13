package com.mustafakahveci.blogging_platform_api.service;

import com.mustafakahveci.blogging_platform_api.dto.PostResponse;
import com.mustafakahveci.blogging_platform_api.dto.UserResponse;
import com.mustafakahveci.blogging_platform_api.exception.ResourceNotFoundException;
import com.mustafakahveci.blogging_platform_api.model.Post;
import com.mustafakahveci.blogging_platform_api.model.User;
import com.mustafakahveci.blogging_platform_api.repository.PostRepository;
import com.mustafakahveci.blogging_platform_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.mustafakahveci.blogging_platform_api.dto.UpdateProfileRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return mapToResponse(user);
    }

    public UserResponse getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with username: " + username
                ));

        return mapToResponse(user);
    }

    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with username: " + username
                ));

        return mapToResponse(user);
    }

    public List<PostResponse> getPostsByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with username: " + username
                ));

        return postRepository.findByAuthorId(user.getId())
                .stream()
                .map(this::mapPostToResponse)
                .toList();
    }

    public UserResponse updateCurrentUserProfile(UpdateProfileRequest request) {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with username: " + username
                ));

        user.setBio(request.bio());
        user.setProfileImageUrl(request.profileImageUrl());

        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    private PostResponse mapPostToResponse(Post post) {
        return new PostResponse(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getCategory(),
                post.getAuthor().getId(),
                post.getAuthor().getUsername(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getBio(),
                user.getProfileImageUrl(),
                user.getCreatedAt()
        );
    }
}