import os
import re
import json

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

    # Find the start and end of the blogPostsToSeed array
    start_match = re.search(r'const blogPostsToSeed = \[', js_code)
    if not start_match:
        raise ValueError("Could not find 'const blogPostsToSeed = [' in the JavaScript file.")
    start_index = start_match.end()

    end_match = re.search(r'\];', js_code[start_index:])
    if not end_match:
        raise ValueError("Could not find the end of the 'blogPostsToSeed' array.")
    end_index = start_index + end_match.start()

    array_content = js_code[start_index:end_index]

    # Add quotes to keys in array_content before finding individual objects
    array_content = re.sub(r'^\s*(\w+):', r'"\1":', array_content, flags=re.MULTILINE)
    array_content = re.sub(r',\s*(\w+):', r',"\1":', array_content)

    blog_posts_data = []
    # Use regex to find each object within the array content
    # This regex looks for content between { and }, handling nested structures
    # This is a simplified approach and might not handle all edge cases of nested objects/arrays
    object_matches = re.finditer(r'\{\s*"title":[\s\S]*?\}', array_content)

    for match in object_matches:
        obj_str = match.group(0)

        # Clean up the extracted object string to make it valid JSON
        # Replace JavaScript template literals backticks with double quotes for JSON
        obj_str = re.sub(r'`([\s\S]*?)`', r'"\1"', obj_str)
        # Replace JavaScript string escapes like \' with '
        obj_str = obj_str.replace("\\'", "'")
        # Replace JavaScript object keys without quotes with quoted keys
        obj_str = re.sub(r'(\w+):', r'"\1":', obj_str)
        # Escape newlines within string values
        obj_str = re.sub(r'"([\s\S]*?)"', lambda m: '"' + m.group(1).replace('\n', '\\n') + '"' if m.group(1) else m.group(0), obj_str)


        try:
            blog_posts_data.append(json.loads(obj_str))
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON for object: {e}")
            print(f"Problematic object string: {obj_str[:500]}")
            raise

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
