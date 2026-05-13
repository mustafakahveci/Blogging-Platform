package com.mustafakahveci.blogging_platform_api.dto;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        String bio,
        String profileImageUrl,
        LocalDateTime createdAt
) {
}