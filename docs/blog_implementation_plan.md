# Blog Page Implementation Plan

## Objective
To transform the static `frontend/blog.html` into a fully functional, dynamic, professional, and responsive blog page. The blog will feature a public comment section, like functionality, and social media sharing options, all accessible without user authentication to maximize traffic. The backend will be designed to accommodate future integration with AI agents for automated blog post creation, with administrative actions secured by an internal API key.

## Phase 1: Backend Development (API for Blog Posts)

### 1.1 Database Schema Definition (SQL)
- **Define `BlogPost` Table**:
    - `id`: Unique identifier (UUID, primary key)
    - `title`: Blog post title (VARCHAR)
    - `slug`: URL-friendly version of the title (VARCHAR, unique)
    - `content`: Full content of the blog post (TEXT)
    - `author_name`: Name of the author (VARCHAR) - *No direct link to a User model for public posts.*
    - `created_at`: Timestamp of creation
    - `updated_at`: Timestamp of last update
    - `published`: Boolean, whether the post is public (default: false)
    - `image_url`: Optional, URL for a featured image (VARCHAR)
    - `tags`: Optional, array of strings for categorization (TEXT[])
    - `likes`: Integer, count of likes (default: 0)
- **Define `Comment` Table**:
    - `id`: Unique identifier (UUID, primary key)
    - `post_id`: ID of the blog post the comment belongs to (UUID, foreign key to `blog_posts`)
    - `author_name`: Name of the commenter (VARCHAR) - *No direct link to a User model.*
    - `content`: Comment text (TEXT)
    - `created_at`: Timestamp of creation
- **Define `Like` Table**:
    - `id`: Unique identifier (UUID, primary key)
    - `post_id`: ID of the blog post that was liked (UUID, foreign key to `blog_posts`)
    - `user_identifier`: Identifier for the user who liked (e.g., IP address) (VARCHAR) - *Ensures a user/identifier can only like a post once.*
    - `created_at`: Timestamp of like

### 1.2 API Endpoint Implementation (Node.js/Express)
- **Authorization**: Implement a simple API key middleware to protect administrative routes (e.g., only authorized admin/AI agents can create/update/delete posts).
- **Blog Post Endpoints (`/api/blog/posts`)**:
    - `GET /`: Retrieve all published blog posts (with pagination, filtering, sorting).
    - `GET /:slug`: Retrieve a single blog post by slug.
    - `POST /`: Create a new blog post (Admin/AI Agent only, requires API Key).
    - `PUT /:id`: Update an existing blog post (Admin/AI Agent only, requires API Key).
    - `DELETE /:id`: Delete a blog post (Admin/AI Agent only, requires API Key).
- **Comment Endpoints (`/api/blog/posts/:postId/comments`)**:
    - `GET /`: Retrieve all comments for a specific blog post.
    - `POST /`: Add a new comment to a blog post (Publicly accessible, requires author name and content).
- **Like Endpoints (`/api/blog/posts/:postId/likes`)**:
    - `POST /`: Like a blog post (Publicly accessible, tracks by IP address to prevent multiple likes).
    - `DELETE /`: Unlike a blog post (Publicly accessible, tracks by IP address).

## Phase 2: Frontend Development (Blog Page)

### 2.1 Blog Listing Page (`frontend/blog.html` conversion)
- **Dynamic Content Fetching**: Use JavaScript (e.g., `fetch` API) to retrieve blog posts from `/api/blog/posts`.
- **Layout**: Display blog posts in a grid or list format, showing title, author, date, a short excerpt, and a featured image.
- **Pagination/Load More**: Implement pagination or an "infinite scroll" mechanism.
- **Search/Filter (Optional for initial build)**: Add basic search or category filtering.
- **Responsive Design**: Ensure the layout adapts well to different screen sizes.

### 2.2 Single Blog Post View Page
- **Dynamic Content Fetching**: Fetch a single blog post by its slug from `/api/blog/posts/:slug`.
- **Display**: Show full blog content, title, author, date, featured image.
- **Comment Section**:
    - Display existing comments.
    - Form for submitting new comments (publicly accessible).
- **Like Button**:
    - Display current like count.
    - Button to like/unlike the post (publicly accessible).
- **Social Share Buttons**:
    - Integrate buttons for Facebook, Twitter (X), LinkedIn, WhatsApp, etc., to share the blog post URL.

### 2.3 UI/UX Enhancements
- **Loading States**: Implement loading spinners or skeletons for content fetching.
- **Error Handling**: Display user-friendly messages for API errors.
- **Professional Styling**: Adhere to existing website styles (`frontend/css/styles.css`) and ensure a clean, readable layout for blog content.

## Phase 3: Integration & Testing

### 3.1 Connect Frontend to Backend
- Update JavaScript in `frontend/js/` to make API calls.
- Handle responses and update the DOM accordingly.

### 3.2 Testing
- **Unit Tests**: (If applicable for complex frontend logic)
- **Integration Tests**: Verify frontend-backend communication.
- **Manual Testing**:
    - Create, read, update, delete blog posts (via API or a temporary admin interface).
    - Add/view comments.
    - Like/unlike posts.
    - Test social sharing.
    - Test responsiveness across devices.

## Phase 4: Content Population (Initial Build)

### 4.1 Content Sourcing
- Use the browser tool to find relevant blog post content (e.g., articles on engineering, renewable energy, ISO certification).
- Extract title, content, and a suitable image URL.

### 4.2 Database Seeding
- Create a script or use a tool to insert the sourced content into the `BlogPost` table in the database.

## Future Enhancements (AI Agent Integration)
- The `POST /api/blog/posts` endpoint will be designed to accept data from AI agents.
- Consider adding an API key or token-based authentication specifically for AI agents to post content.
- Implement validation and sanitization for AI-generated content.

## Deliverables
- `docs/blog_implementation_plan.md` (this document)
- New backend API routes and controllers (`backend/routes/blog/blogRoutes.js`)
- New backend middleware for admin authorization (`backend/middleware/blogAuth.js`)
- Modified `frontend/blog/index.html` (dynamic template with pagination)
- Modified `frontend/blog/post.html` (dynamic template with enhanced styling)
- New/modified JavaScript files for frontend logic (`frontend/js/blog/blogList.js`, `frontend/js/blog/singleBlogPost.js`)
- Initial set of blog posts in the database (via `backend/scripts/seedBlogPosts.js`)

## Current Milestone
- **Backend Blog API:** Fully functional with pagination, public comments/likes, and API key authorization for administrative actions.
- **Frontend Blog Pages:** Dynamic loading of posts, pagination with 'Load More', enhanced styling for single blog posts (readable font, quote styling with icons), and correct linking/script loading after file restructuring.
- **Content Management:** Transitioning from `temp_add_blog_post.js` to a more structured seeding script and API-based content addition.

## New Plan for Content Management

### 1. Create `backend/scripts/seedBlogPosts.js`
- This script will contain an array of pre-defined blog post objects (title, HTML content, image_url, tags, published status).
- It will use the `/api/blog/posts` endpoint with the `BLOG_ADMIN_API_KEY` to insert multiple posts into the database.
- This script will replace the ad-hoc usage of `temp_add_blog_post.js` for initial content population.

### 2. Generate 5 New Blog Posts
- Based on company services, current industry trends, and government policies (as researched).
- Each post will have an engaging title, well-structured HTML content, a relevant image URL, and appropriate tags.

### 3. Instructions for Future Content Addition (API-based)
- Provide a clear guide on how to add new blog posts directly via the API using tools like Postman or Insomnia.
- Detail the required JSON structure for a blog post, including `title`, `content` (as HTML), `author_name`, `image_url`, `tags`, and `published` status.
- Emphasize the use of the `x-api-key` header for authorization.

## Future Enhancements (AI Agent Integration)
- The `POST /api/blog/posts` endpoint will be designed to accept data from AI agents.
- Consider adding an API key or token-based authentication specifically for AI agents to post content.
- Implement validation and sanitization for AI-generated content.


 ## Here's how to generate `your_strong_blog_admin_api_key_here`:

   1. Open your terminal or Command Prompt:
       * Windows: Search "cmd" or "Command Prompt" in your Start Menu.
       * macOS/Linux: Open your Terminal application.

   2. Verify Node.js installation:
       * In the terminal, type node -v and press Enter.
       * If you see a version number (e.g., v18.17.1), Node.js is installed.
       * If you get a "command not found" error, you must install Node.js first. Download the LTS version from
         https://nodejs.org/en/download (https://nodejs.org/en/download).

   3. Generate the API Key:
       * In the same terminal window, type this exact command and press Enter:

   1         node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
       * The terminal will output a long string of characters (e.g.,
         a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2). This is your API key.

   4. Copy the generated key:
       * Select and copy the entire outputted string.

   5. Update your `backend/.env` file:
       * Open the backend/.env file in your project with a text editor.
       * Find the line: BLOG_ADMIN_API_KEY="your_strong_blog_admin_api_key_here"
       * Replace "your_strong_blog_admin_api_key_here" (including the quotes) with the key you copied. It should look like:
          BLOG_ADMIN_API_KEY="a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"

   6. Save `backend/.env`.

  This completes the API key setup. Does this guide clarify the process?