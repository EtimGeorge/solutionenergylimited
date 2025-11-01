import os
import re
import json
import js2py

# --- Configuration ---
JS_SEED_FILE = 'C:/Users/user/Desktop/solutionenergylimited/backend/scripts/seedBlogPosts.js'
OUTPUT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/knowledge-base-documents'

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def sanitize_filename(title):
    """Sanitizes a title to create a valid filename."""
    filename = title.lower()
    filename = re.sub(r'[^a-z0-9\s-]', '', filename) # Remove non-alphanumeric
    filename = re.sub(r'\s+', '-', filename) # Replace spaces with hyphens
    filename = filename.strip('-') # Remove leading/trailing hyphens
    return filename + '.json'

def extract_blog_posts_with_js2py(js_file_path):
    """
    Extracts blog post data from a JavaScript file using js2py.
    """
    with open(js_file_path, 'r', encoding='utf-8') as f:
        js_code = f.read()

    # Find the start of the blogPostsToSeed array
    start_index = js_code.find('const blogPostsToSeed = [')
    if start_index == -1:
        raise ValueError("Could not find 'const blogPostsToSeed = [' in the JavaScript file.")

    # Find the end of the array
    end_index = js_code.rfind('];')
    if end_index == -1:
        raise ValueError("Could not find the end of the 'blogPostsToSeed' array.")

    # Extract the array as a string
    array_string = js_code[start_index + len('const blogPostsToSeed = '):end_index + 1]

    # Use js2py to evaluate the JavaScript array
    blog_posts_js = js2py.eval_js('var posts = ' + array_string + '; posts')

    # Convert the js2py object to a Python list
    blog_posts_data = blog_posts_js.to_list()

    return blog_posts_data


# --- Main Execution ---
if __name__ == "__main__":
    print(f"--- Starting Blog Post Extraction from {JS_SEED_FILE} ---")

    try:
        blog_posts = extract_blog_posts_with_js2py(JS_SEED_FILE)

        if not blog_posts:
            print("[WARNING] No blog posts found in the JavaScript seed file.")
        else:
            for post in blog_posts:
                title = post['title']

                filename = sanitize_filename(title)
                output_path = os.path.join(OUTPUT_DIR, filename)

                with open(output_path, 'w', encoding='utf-8') as json_file:
                    json.dump(post, json_file, indent=2)

                print(f"  Extracted and saved: {output_path}")

            print("--- Blog Post Extraction Finished. ---")

    except Exception as e:
        print(f"[FATAL] An error occurred during blog post extraction: {e}")
