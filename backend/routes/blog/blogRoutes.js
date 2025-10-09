const express = require('express');
const { Pool } = require('pg');
const winston = require('winston');
const authenticateAdmin = require('../../middleware/blogAuth');

const router = express.Router();

// Initialize PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Initialize logger (assuming it's configured similarly to server.js)
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'blog-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

// Helper to generate a slug from a title
const generateSlug = (title) => {
    return title.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars
                .trim()
                .replace(/\s+/g, '-') // Replace spaces with - 
                .replace(/-+/g, '-'); // Replace multiple - with single -
};

// --- Blog Post Endpoints ---

// GET all published blog posts
router.get('/posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query('SELECT COUNT(*) FROM blog_posts WHERE published = TRUE');
        const totalPosts = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalPosts / limit);

        const result = await pool.query('SELECT * FROM blog_posts WHERE published = TRUE ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        res.json({
            posts: result.rows,
            currentPage: page,
            totalPages: totalPages,
            totalPosts: totalPosts
        });
    } catch (error) {
        logger.error('Error fetching paginated blog posts:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching blog posts' });
    }
});

// GET a single blog post by slug
router.get('/posts/:slug', async (req, res) => {
    const { slug } = req.params;
    try {
        const result = await pool.query('SELECT * FROM blog_posts WHERE slug = $1 AND published = TRUE', [slug]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error fetching blog post by slug:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching blog post' });
    }
});

router.post('/posts', authenticateAdmin, async (req, res) => {
    const { title, content, author_name, image_url, tags, published } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const slug = generateSlug(title);
    const tagsArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);

    try {
        const result = await pool.query(
            'INSERT INTO blog_posts(title, slug, content, author_name, image_url, tags, published) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
            [title, slug, content, author_name || 'Admin', image_url, tagsArray, published || false]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error creating blog post:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error creating blog post' });
    }
});

// PUT update an existing blog post (Admin/AI Agent only)
router.put('/posts/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, content, author_name, image_url, tags, published } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    const slug = generateSlug(title);
    const tagsArray = Array.isArray(tags) ? tags : (tags ? [tags] : []);

    try {
        const result = await pool.query(
            'UPDATE blog_posts SET title = $1, slug = $2, content = $3, author_name = $4, image_url = $5, tags = $6, published = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *;',
            [title, slug, content, author_name || 'Admin', image_url, tagsArray, published, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error updating blog post:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error updating blog post' });
    }
});

// DELETE a blog post (Admin/AI Agent only)
router.delete('/posts/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING *;', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        logger.error('Error deleting blog post:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error deleting blog post' });
    }
});

// --- Comment Endpoints ---

// GET all comments for a specific blog post
router.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC', [postId]);
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching comments:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

// POST add a new comment to a blog post
router.post('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { content, author_name } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Comment content is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO comments(post_id, content, author_name) VALUES($1, $2, $3) RETURNING *;',
            [postId, content, author_name || 'Anonymous']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error adding comment:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// --- Like Endpoints ---

// POST like a blog post
router.post('/posts/:postId/likes', async (req, res) => {
    const { postId } = req.params;
    // For anonymous likes, use IP address or a unique session ID
    const userIdentifier = req.ip; // Example: using IP address

    try {
        // Check if user already liked the post
        const existingLike = await pool.query('SELECT * FROM likes WHERE post_id = $1 AND user_identifier = $2', [postId, userIdentifier]);
        if (existingLike.rows.length > 0) {
            return res.status(409).json({ message: 'Post already liked by this user' });
        }

        // Add the like
        await pool.query('INSERT INTO likes(post_id, user_identifier) VALUES($1, $2)', [postId, userIdentifier]);
        
        // Increment likes count in blog_posts table
        const updatedPost = await pool.query('UPDATE blog_posts SET likes = likes + 1 WHERE id = $1 RETURNING likes;', [postId]);

        res.status(201).json({ message: 'Post liked successfully', likes: updatedPost.rows[0].likes });
    } catch (error) {
        logger.error('Error liking post:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error liking post' });
    }
});

// DELETE unlike a blog post
router.delete('/posts/:postId/likes', async (req, res) => {
    const { postId } = req.params;
    const userIdentifier = req.ip; // Example: using IP address

    try {
        // Remove the like
        const deleteResult = await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_identifier = $2 RETURNING *;', [postId, userIdentifier]);
        
        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ message: 'Like not found or already removed' });
        }

        // Decrement likes count in blog_posts table
        const updatedPost = await pool.query('UPDATE blog_posts SET likes = GREATEST(0, likes - 1) WHERE id = $1 RETURNING likes;', [postId]);

        res.status(200).json({ message: 'Post unliked successfully', likes: updatedPost.rows[0].likes });
    } catch (error) {
        logger.error('Error unliking post:', { message: error.message, stack: error.stack });
        res.status(500).json({ message: 'Error unliking post' });
    }
});

module.exports = router;
