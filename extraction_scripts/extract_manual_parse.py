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

def extract_blog_posts_manual(js_file_path):
    """
    Extracts blog post data from a JavaScript file by manually parsing the array.
    """
    with open(js_file_path, 'r', encoding='utf-8') as f:
        js_code = f.read()

    # Isolate the array content
    start_index = js_code.find('const blogPostsToSeed = [')
    if start_index == -1:
        raise ValueError("Could not find 'const blogPostsToSeed = [' in the JavaScript file.")
    start_index += len('const blogPostsToSeed = [')

    end_index = js_code.rfind('];')
    if end_index == -1:
        raise ValueError("Could not find the end of the 'blogPostsToSeed' array.")

    array_content = js_code[start_index:end_index]

    # Replace escaped single quotes
    array_content = array_content.replace("\\'", "'")

    # Add quotes to keys
    array_content = re.sub(r'^\s*(\w+):', r'"\1":', array_content, flags=re.MULTILINE)

    # Handle template literals (content field)
    def replace_template_literals(match):
        content = match.group(1)
        # Escape double quotes within the content
        content = content.replace('"', '\"')
        # Escape newlines
        content = content.replace('\n', '\\n')
        return '"' + content + '"'

    array_content = re.sub(r'`([\s\S]*?)`', replace_template_literals, array_content)

    # Escape double quotes within all string values
    def escape_double_quotes_in_strings(match):
        # The full string value, including the delimiters
        full_string = match.group(0)
        # The content of the string, without the delimiters
        string_content = match.group(1)
        # Escape the double quotes within the content
        escaped_content = string_content.replace('"', '\"')
        # Reconstruct the string with the escaped content
        return '"' + escaped_content + '"'

    array_content = re.sub(r'"((?:[^"\\]|\\.)*)"', escape_double_quotes_in_strings, array_content)


    # Remove trailing commas
    array_content = re.sub(r',\s*(\}|\])', r'\1', array_content)

    # Wrap in brackets to make it a valid JSON array
    json_string = f'[{array_content}]'

    try:
        blog_posts_data = json.loads(json_string)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        # Write the problematic string to a file for debugging
        with open('debug_json.txt', 'w', encoding='utf-8') as f:
            f.write(json_string)
        raise

    return blog_posts_data


# --- Main Execution ---
if __name__ == "__main__":
    print(f"--- Starting Blog Post Extraction from {JS_SEED_FILE} ---")

    try:
        blog_posts = extract_blog_posts_manual(JS_SEED_FILE)

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
