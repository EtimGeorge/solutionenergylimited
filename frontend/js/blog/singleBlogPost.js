document.addEventListener('DOMContentLoaded', function() {
    const blogPostContent = document.getElementById('blog-post-content');
    const blogPostTitleHero = document.getElementById('blog-post-title-hero');
    const blogPostMetaHero = document.getElementById('blog-post-meta-hero');
    const likeButton = document.getElementById('like-button');
    const likeCountSpan = document.getElementById('like-count');
    const commentForm = document.getElementById('comment-form');
    const commentsList = document.getElementById('comments-list');
    const commentCountSpan = document.getElementById('comment-count');

    // Social Share Buttons
    const shareFacebook = document.getElementById('share-facebook');
    const shareTwitter = document.getElementById('share-twitter');
    const shareLinkedin = document.getElementById('share-linkedin');
    const shareWhatsapp = document.getElementById('share-whatsapp');

    let currentPostId = null;
    let currentPostSlug = null;

    // Function to update meta tags for SEO and social sharing
    function updateMetaTags(post) {
        document.title = `${post.title} | Blog | SEESL`;
        document.querySelector('meta[name="description"]').setAttribute('content', post.content.substring(0, 160) + '...');
        document.querySelector('meta[name="keywords"]').setAttribute('content', (post.tags ? post.tags.join(', ') + ', ' : '') + post.title.toLowerCase().split(' ').join(', '));

        document.querySelector('meta[property="og:title"]').setAttribute('content', post.title);
        document.querySelector('meta[property="og:description"]').setAttribute('content', post.content.substring(0, 160) + '...');
        if (post.image_url) {
            // Ensure the image URL is absolute for Open Graph tags
            const ogImageUrl = post.image_url.startsWith('http') || post.image_url.startsWith('//') 
                               ? post.image_url 
                               : window.location.origin + post.image_url;
            document.querySelector('meta[property="og:image"]').setAttribute('content', ogImageUrl);
        }
        document.querySelector('meta[property="og:url"]').setAttribute('content', window.location.href);
    }

    // Function to set up social share links
    function setupSocialShare(post) {
        const postUrl = encodeURIComponent(window.location.href);
        const postTitle = encodeURIComponent(post.title);
        const postDescription = encodeURIComponent(post.content.substring(0, 160) + '...');

        shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`;
        shareTwitter.href = `https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`;
        shareLinkedin.href = `https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}&title=${postTitle}&summary=${postDescription}`;
        shareWhatsapp.href = `https://api.whatsapp.com/send?text=${postTitle}%20${postUrl}`;
    }

    async function fetchBlogPost() {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        currentPostSlug = slug;

        if (!slug) {
            blogPostContent.innerHTML = '<p>Blog post not found. Invalid URL.</p>';
            return;
        }

        try {
            const response = await fetch(`${window.FRONTEND_CONFIG.BACKEND_URL}/api/blog/posts/${slug}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const post = await response.json();

            currentPostId = post.id;

            blogPostTitleHero.textContent = post.title;
            blogPostMetaHero.textContent = `By ${post.author_name || 'Admin'} on ${new Date(post.created_at).toLocaleDateString()}`;

            blogPostContent.innerHTML = `
                ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" class="blog-post-image">` : ''}
                <div class="blog-post-body">
                    ${post.content}
                </div>
                <div class="blog-post-meta">
                    <span>Author: ${post.author_name || 'Admin'}</span>
                    <span>Published: ${new Date(post.created_at).toLocaleDateString()}</span>
                    ${post.tags && post.tags.length > 0 ? `<span>Tags: ${post.tags.join(', ')}</span>` : ''}
                </div>
            `;
            likeCountSpan.textContent = post.likes;

            updateMetaTags(post);
            setupSocialShare(post);
            fetchComments(currentPostId);

        } catch (error) {
            console.error('Error fetching blog post:', error);
            blogPostContent.innerHTML = '<p>Failed to load blog post. Please try again later.</p>';
        }
    }

    async function fetchComments(postId) {
        try {
            const response = await fetch(`${window.FRONTEND_CONFIG.BACKEND_URL}/api/blog/posts/${postId}/comments`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const comments = await response.json();

            commentCountSpan.textContent = comments.length;
            commentsList.innerHTML = ''; // Clear existing comments

            if (comments.length === 0) {
                commentsList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
                return;
            }

            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');
                commentDiv.innerHTML = `
                    <p class="comment-author"><strong>${comment.author_name || 'Anonymous'}</strong> on ${new Date(comment.created_at).toLocaleDateString()}</p>
                    <p class="comment-content">${comment.content}</p>
                `;
                commentsList.appendChild(commentDiv);
            });
        } catch (error) {
            console.error('Error fetching comments:', error);
            commentsList.innerHTML = '<p>Failed to load comments.</p>';
        }
    }

    commentForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const author = document.getElementById('comment-author').value;
        const content = document.getElementById('comment-content').value;

        if (!author || !content) {
            alert('Please enter your name and comment.');
            return;
        }

        try {
            const response = await fetch(`${window.FRONTEND_CONFIG.BACKEND_URL}/api/blog/posts/${currentPostId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ author_name: author, content: content })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            document.getElementById('comment-author').value = '';
            document.getElementById('comment-content').value = '';
            fetchComments(currentPostId); // Refresh comments
            alert('Comment added successfully!');

        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        }
    });

    likeButton.addEventListener('click', async function() {
        if (!currentPostId) return;

        try {
            const response = await fetch(`${window.FRONTEND_CONFIG.BACKEND_URL}/api/blog/posts/${currentPostId}/likes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 409) { // Already liked
                alert('You have already liked this post.');
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            likeCountSpan.textContent = data.likes;
            alert('Post liked!');

        } catch (error) {
            console.error('Error liking post:', error);
            alert('Failed to like post. Please try again.');
        }
    });

    fetchBlogPost();
});
