package com.mustafakahveci.blogging_platform_api.dto;

import com.mustafakahveci.blogging_platform_api.model.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PostRequest(

        @NotBlank(message = "Title cannot be blank")
        String title,

        @NotBlank(message = "Content cannot be blank")
        String content,

        @NotNull(message = "Category cannot be null")
        Category category,

        String imageUrl

) {
}