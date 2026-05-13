package com.mustafakahveci.blogging_platform_api.service;

import com.mustafakahveci.blogging_platform_api.dto.PostPageResponse;
import com.mustafakahveci.blogging_platform_api.dto.PostRequest;
import com.mustafakahveci.blogging_platform_api.dto.PostResponse;
import com.mustafakahveci.blogging_platform_api.exception.ResourceNotFoundException;
import com.mustafakahveci.blogging_platform_api.exception.UnauthorizedActionException;
import com.mustafakahveci.blogging_platform_api.model.Category;
import com.mustafakahveci.blogging_platform_api.model.Post;
import com.mustafakahveci.blogging_platform_api.model.Role;
import com.mustafakahveci.blogging_platform_api.model.User;
import com.mustafakahveci.blogging_platform_api.repository.PostRepository;
import com.mustafakahveci.blogging_platform_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostResponse createPost(PostRequest request) {

        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with username: " + username
                ));

        Post post = Post.builder()
                .title(request.title())
                .content(request.content())
                .category(request.category())
                .author(author)
                .build();

        Post savedPost = postRepository.save(post);

        return mapToResponse(savedPost);
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        return mapToResponse(post);
    }

    public PostResponse updatePost(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        checkPostAccess(post);

        post.setTitle(request.title());
        post.setContent(request.content());
        post.setCategory(request.category());

        Post updatedPost = postRepository.save(post);

        return mapToResponse(updatedPost);
    }

    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        checkPostAccess(post);

        postRepository.delete(post);
    }

    public List<PostResponse> getPostsByAuthorId(Long authorId) {
        return postRepository.findByAuthorId(authorId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private PostResponse mapToResponse(Post post) {
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

    private void checkPostAccess(Post post) {
        String username = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with username: " + username
                ));

        boolean isOwner = post.getAuthor().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException(
                    "You are not authorized to modify this post"
            );
        }
    }

    public PostPageResponse getPosts(
            int page,
            int size,
            String sortBy,
            String direction,
            String keyword,
            Category category
    ) {
        Sort sort = direction.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Post> postPage;

        if (keyword != null && !keyword.isBlank() && category != null) {
            postPage = postRepository
                    .findByCategoryAndTitleContainingIgnoreCaseOrCategoryAndContentContainingIgnoreCase(
                            category,
                            keyword,
                            category,
                            keyword,
                            pageable
                    );
        } else if (keyword != null && !keyword.isBlank()) {
            postPage = postRepository
                    .findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                            keyword,
                            keyword,
                            pageable
                    );
        } else if (category != null) {
            postPage = postRepository.findByCategory(category, pageable);
        } else {
            postPage = postRepository.findAll(pageable);
        }

        return new PostPageResponse(
                postPage.getContent()
                        .stream()
                        .map(this::mapToResponse)
                        .toList(),
                postPage.getNumber(),
                postPage.getSize(),
                postPage.getTotalElements(),
                postPage.getTotalPages(),
                postPage.isLast()
        );
    }
}