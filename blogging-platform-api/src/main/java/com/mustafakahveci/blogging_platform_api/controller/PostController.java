package com.mustafakahveci.blogging_platform_api.controller;

import com.mustafakahveci.blogging_platform_api.dto.PostPageResponse;
import com.mustafakahveci.blogging_platform_api.dto.PostRequest;
import com.mustafakahveci.blogging_platform_api.dto.PostResponse;
import com.mustafakahveci.blogging_platform_api.model.Category;
import com.mustafakahveci.blogging_platform_api.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse createPost(@Valid @RequestBody PostRequest request) {
        return postService.createPost(request);
    }

    @GetMapping
    public PostPageResponse getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Category category
    ) {
        return postService.getPosts(page, size, sortBy, direction, keyword, category);
    }

    @GetMapping("/{id}")
    public PostResponse getPostById(@PathVariable Long id) {
        return postService.getPostById(id);
    }

    @PutMapping("/{id}")
    public PostResponse updatePost(@PathVariable Long id,
                                   @Valid @RequestBody PostRequest request) {
        return postService.updatePost(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }

    @GetMapping("/author/{authorId}")
    public List<PostResponse> getPostsByAuthorId(@PathVariable Long authorId) {
        return postService.getPostsByAuthorId(authorId);
    }
}