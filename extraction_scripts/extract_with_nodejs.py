import os
import re
import json
import subprocess

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

def extract_blog_posts_with_nodejs(js_file_path):
    """
    Extracts blog post data from a JavaScript file using a Node.js subprocess.
    """
    # Create a temporary Node.js script to extract and stringify the array
    nodejs_script_content = f'''
const fs = require('fs');
const path = require('path');

const jsFilePath = '{js_file_path.replace('\\', '/') \
}';
const jsCode = fs.readFileSync(jsFilePath, 'utf8');

const arrayStart = jsCode.indexOf('const blogPostsToSeed = [');
const arrayEnd = jsCode.lastIndexOf('];');

if (arrayStart === -1 || arrayEnd === -1) {
    console.error('Could not find blogPostsToSeed array in the JavaScript file.');
    process.exit(1);
}

const arrayContent = jsCode.substring(arrayStart + 'const blogPostsToSeed = '.length, arrayEnd + 1);

// Temporarily define the array to be able to stringify it
let blogPostsToSeed;
try {
    eval(arrayContent);
    console.log(JSON.stringify(blogPostsToSeed));
} catch (e) {
    console.error('Error evaluating JavaScript array:', e);
    process.exit(1);
}
'''.format(js_file_path=js_file_path)

    temp_nodejs_script_path = os.path.join(os.path.dirname(js_file_path), 'temp_extract.js')
    with open(temp_nodejs_script_path, 'w', encoding='utf-8') as f:
        f.write(nodejs_script_content)

    try:
        # Execute the Node.js script
        result = subprocess.run(['node', temp_nodejs_script_path], capture_output=True, text=True, check=True)
        json_output = result.stdout.strip()

        if not json_output:
            raise ValueError("Node.js script returned empty output.")

        blog_posts_data = json.loads(json_output)
        return blog_posts_data

    except subprocess.CalledProcessError as e:
        print(f"Node.js script failed with error: {e.stderr}")
        raise
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from Node.js output: {e}")
        print(f"Problematic JSON output (first 500 chars): {json_output[:500]}")
        raise
    finally:
        # Clean up the temporary Node.js script
        if os.path.exists(temp_nodejs_script_path):
            os.remove(temp_nodejs_script_path)


# --- Main Execution ---
if __name__ == "__main__":
    print(f"--- Starting Blog Post Extraction from {JS_SEED_FILE} ---")

    try:
        blog_posts = extract_blog_posts_with_nodejs(JS_SEED_FILE)

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
