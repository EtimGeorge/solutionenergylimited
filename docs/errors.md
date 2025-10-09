PS C:\Users\user\Desktop\solutionenergylimited> cd backend
PS C:\Users\user\Desktop\solutionenergylimited\backend> node temp_add_blog_post.js
Error adding blog post: Error: HTTP error! status: 500, {"message":"Error creating blog post"}      
    at addBlogPost (C:\Users\user\Desktop\solutionenergylimited\backend\temp_add_blog_post.js:79:19)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
PS C:\Users\user\Desktop\solutionenergylimited\backend> 




PS C:\Users\user\Desktop\solutionenergylimited> cd backend
PS C:\Users\user\Desktop\solutionenergylimited\backend> node server.js
info: Backend server listening on port 3000 {"service":"seesl-backend","timestamp":"2025-10-08 21:41:00"}
error: duplicate key value violates unique constraint "blog_posts_slug_key" {"service":"blog-service","stack":"error: duplicate key value violates unique constraint \"blog_posts_slug_key\"\n    at C:\\Users\\user\\Desktop\\solutionenergylimited\\backend\\node_modules\\pg-pool\\index.js:45:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\n    at async C:\\Users\\user\\Desktop\\solutionenergylimited\\backend\\routes\\blog\\blogRoutes.js:94:24","timestamp":"2025-10-08 21:41:58"}



