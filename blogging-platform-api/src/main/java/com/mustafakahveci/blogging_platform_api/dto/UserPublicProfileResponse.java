package com.mustafakahveci.blogging_platform_api.dto;

import java.time.LocalDateTime;
import java.util.List;

public record UserPublicProfileResponse(
        Long id,
        String username,
        String bio,
        String profileImageUrl,
        LocalDateTime createdAt,
        List<PostResponse> posts
) {
}