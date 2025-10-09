document.addEventListener('DOMContentLoaded', function() {
    const blogPostsContainer = document.getElementById('blog-posts-container');
    let currentPage = 1;
    const postsPerPage = 6; // Number of posts to load per page
    let totalPages = 1;
    let blogGrid = null; // To hold the grid element once created

    // Create or get the Load More button
    let loadMoreButton = document.getElementById('load-more-posts');
    if (!loadMoreButton) {
        loadMoreButton = document.createElement('button');
        loadMoreButton.id = 'load-more-posts';
        loadMoreButton.classList.add('btn', 'btn-primary', 'load-more-button');
        loadMoreButton.textContent = 'Load More Posts';
        blogPostsContainer.insertAdjacentElement('afterend', loadMoreButton);
    }

    async function fetchBlogPosts(page) {
        try {
            const response = await fetch(`${window.FRONTEND_CONFIG.BACKEND_URL}/api/blog/posts?page=${page}&limit=${postsPerPage}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const posts = data.posts;
            totalPages = data.totalPages;

            if (page === 1) {
                blogPostsContainer.innerHTML = ''; // Clear loading message only on first load
                blogGrid = document.createElement('div');
                blogGrid.classList.add('blog-grid');
                blogPostsContainer.appendChild(blogGrid);
            }

            if (posts.length === 0 && page === 1) {
                blogPostsContainer.innerHTML = '<p>No blog posts available yet.</p>';
                loadMoreButton.style.display = 'none';
                return;
            } else if (posts.length === 0) {
                // No more posts to load, hide button
                loadMoreButton.style.display = 'none';
                return;
            }

            posts.forEach((post, index) => {
                const postCard = document.createElement('div');
                postCard.classList.add('blog-card'); // Match new CSS
                postCard.setAttribute('data-scroll-reveal', '');
                // Stagger the animation delay
                postCard.setAttribute('data-scroll-reveal-delay', `${(index % 3) * 100}`);

                // Sanitize content for the excerpt
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = post.content;
                const excerpt = tempDiv.textContent || tempDiv.innerText || "";

                postCard.innerHTML = `
                    <a href="./post.html?slug=${post.slug}" class="blog-card-image-container">
                        ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}">` : '<img src="../images/SEES_new_logo.jpg" alt="SEESL Logo">'}
                    </a>
                    <div class="blog-card-content">
                        <h3>
                            <a href="./post.html?slug=${post.slug}">${post.title}</a>
                        </h3>
                        <p>${excerpt.substring(0, 120)}...</p>
                        <div class="blog-card-footer">
                            <span class="card-date">${new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <a href="./post.html?slug=${post.slug}" class="read-more">Read More</a>
                        </div>
                    </div>
                `;
                blogGrid.appendChild(postCard);
            });

            // Re-initialize scroll reveal for newly added elements
            if (typeof initScrollReveal === 'function') {
                initScrollReveal();
            }

            // Update Load More button visibility
            if (currentPage < totalPages) {
                loadMoreButton.style.display = 'block';
            } else {
                loadMoreButton.style.display = 'none';
            }

        } catch (error) {
            console.error('Error fetching blog posts:', error);
            if (page === 1) {
                blogPostsContainer.innerHTML = '<p>Failed to load blog posts. Please try again later.</p>';
            }
            loadMoreButton.style.display = 'none';
        }
    }

    // Initial load
    fetchBlogPosts(currentPage);

    // Load More button event listener
    loadMoreButton.addEventListener('click', function() {
        currentPage++;
        fetchBlogPosts(currentPage);
    });
});
