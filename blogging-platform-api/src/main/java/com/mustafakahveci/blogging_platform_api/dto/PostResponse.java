package com.mustafakahveci.blogging_platform_api.dto;

import com.mustafakahveci.blogging_platform_api.model.Category;

import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        String title,
        String content,
        Category category,
        Long authorId,
        String authorUsername,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}