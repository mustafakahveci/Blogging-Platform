package com.mustafakahveci.blogging_platform_api.repository;

import com.mustafakahveci.blogging_platform_api.model.Category;
import com.mustafakahveci.blogging_platform_api.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post,Long> {

    List<Post> findByAuthorId(Long authorId);

    Page<Post> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String title,
            String content,
            Pageable pageable
    );

    Page<Post> findByCategory(Category category, Pageable pageable);

    Page<Post> findByCategoryAndTitleContainingIgnoreCaseOrCategoryAndContentContainingIgnoreCase(
            Category category1,
            String title,
            Category category2,
            String content,
            Pageable pageable
    );
}
