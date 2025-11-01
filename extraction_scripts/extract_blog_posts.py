import os
import re
import json
from bs4 import BeautifulSoup


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

def extract_blog_posts_from_js(js_file_path):
    """
    Extracts blog post data from a JavaScript file containing a blogPostsToSeed array
    by parsing the JS code as a string.
    """
    with open(js_file_path, 'r', encoding='utf-8') as f:
        js_code = f.read()

    # Use regex to find the blogPostsToSeed array definition
    # This regex looks for 'blogPostsToSeed = [' and captures everything until the matching '];'
    # It handles multi-line content and potential comments
    match = re.search(r'const blogPostsToSeed = \[\]', js_code)
    
    if not match:
        raise ValueError("Could not find 'blogPostsToSeed' array in the JavaScript file.")
    
    json_like_content = match.group(1)
    
    # Clean up the extracted content to make it valid JSON
    # Replace JavaScript template literals backticks with double quotes for JSON
    json_like_content = re.sub(r'`([\s\S]*?)`', r'"\1"', json_like_content)
    # Replace JavaScript string escapes like \' with '
    json_like_content = json_like_content.replace("\\'", "'")
    # Replace JavaScript object keys without quotes with quoted keys
    json_like_content = re.sub(r'(\w+):', r'"\1":', json_like_content)
    # Replace single quotes with double quotes for string values
    json_like_content = re.sub(r"'(.*?)'", r'"\1"', json_like_content)

    # Wrap the content in a JSON array to make it valid
    json_string = f"[{json_like_content}]"
    
    # Parse the JSON string
    blog_posts_data = json.loads(json_string)
    
    return blog_posts_data


# --- Main Execution ---
if __name__ == "__main__":
    print(f"--- Starting Blog Post Extraction from {JS_SEED_FILE} ---")
    
    try:
        blog_posts = extract_blog_posts_from_js(JS_SEED_FILE)
        
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