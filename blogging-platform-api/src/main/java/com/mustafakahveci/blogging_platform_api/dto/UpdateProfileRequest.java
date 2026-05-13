package com.mustafakahveci.blogging_platform_api.dto;

public record UpdateProfileRequest(
        String bio,
        String profileImageUrl
) {
}