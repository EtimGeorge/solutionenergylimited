import os
import glob
from bs4 import BeautifulSoup
import html2text
import re
import json # For manifest

# --- Configuration ---
FRONTEND_DIR = 'C:/Users/user/Desktop/solutionenergylimited/frontend'
OUTPUT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/knowledge-base-documents'
MAX_CHARS_PER_FILE = 8000

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# List of HTML files to process (based on primary navigation and recursive services)
# This list is derived from the glob output and user's instructions
HTML_FILES_TO_PROCESS = [
    os.path.join(FRONTEND_DIR, 'index.html'),
    os.path.join(FRONTEND_DIR, 'about.html'),
    os.path.join(FRONTEND_DIR, 'process.html'),
    os.path.join(FRONTEND_DIR, 'blog/index.html'),
    os.path.join(FRONTEND_DIR, 'contact.html'),
    # Services
    os.path.join(FRONTEND_DIR, 'services/asset-management.html'),
    os.path.join(FRONTEND_DIR, 'services/civil-construction.html'),
    os.path.join(FRONTEND_DIR, 'services/engineering.html'),
    os.path.join(FRONTEND_DIR, 'services/gas-conversion.html'),
    os.path.join(FRONTEND_DIR, 'services/procurement.html'),
    os.path.join(FRONTEND_DIR, 'services/renewable-energy.html'),
    os.path.join(FRONTEND_DIR, 'services/tank-cleaning.html'),
    # ISO Certification sub-pages
    os.path.join(FRONTEND_DIR, 'services/iso-certification/audit.html'),
    os.path.join(FRONTEND_DIR, 'services/iso-certification/certification.html'),
    os.path.join(FRONTEND_DIR, 'services/iso-certification/index.html'),
    os.path.join(FRONTEND_DIR, 'services/iso-certification/training.html'),
]

# --- Helper Functions ---

def sanitize_filename_segment(segment):
    """Sanitizes a string for use as a filename segment, truncating if necessary."""
    segment = re.sub(r'[^a-z0-9-]', '', segment.lower().replace(' ', '-'))
    return segment[:25] # Truncate to 25 characters

def get_filename_from_path(file_path):
    """Generates a structured filename based on the file's path relative to FRONTEND_DIR."""
    relative_path = os.path.relpath(file_path, FRONTEND_DIR)
    parts = relative_path.split(os.sep)

    if relative_path == 'index.html':
        return 'home.md'
    elif relative_path == 'about.html':
        return 'about.md'
    elif relative_path == 'process.html':
        return 'process.md'
    elif relative_path == 'contact.html':
        return 'contact.md'
    elif relative_path == 'blog/index.html':
        return 'blog_index.md'
    
    # Handle services and iso-certification
    if parts[0] == 'services':
        if len(parts) == 2: # e.g., services/asset-management.html
            main_section = sanitize_filename_segment(parts[0])
            sub_section = sanitize_filename_segment(os.path.splitext(parts[1])[0])
            return f"{main_section}_{sub_section}.md"
        elif len(parts) == 3 and parts[1] == 'iso-certification': # e.g., services/iso-certification/audit.html
            main_section = sanitize_filename_segment(parts[0])
            sub_section_1 = sanitize_filename_segment(parts[1])
            sub_section_2 = sanitize_filename_segment(os.path.splitext(parts[2])[0])
            return f"{main_section}_{sub_section_1}_{sub_section_2}.md"
    
    # Fallback for any unhandled cases (shouldn't happen with the above list)
    return sanitize_filename_segment(os.path.splitext(relative_path)[0]) + '.md'


def extract_main_content_to_markdown(html_file_path):
    """
    Extracts main content from an HTML file, removes boilerplate, and converts to Markdown.
    """
    with open(html_file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')

    # Remove boilerplate elements (header, footer, nav, scripts, styles)
    for selector in ['header', 'footer', 'nav', 'script', 'style', '.mobile-menu', '.chat-fab', '.chat-widget']:
        for element in soup.select(selector):
            element.decompose()

    # Attempt to find the main content area. This might need refinement based on actual HTML structure.
    # Common main content containers: <main>, <article>, <div> with specific IDs/classes
    main_content_element = soup.find('main') or soup.find('article') or soup.find(class_=re.compile(r'content|main|body'))
    
    if main_content_element:
        html_content = str(main_content_element)
    else:
        # Fallback to body content if no specific main content element is found
        html_content = str(soup.body) if soup.body else str(soup)

    # Convert HTML to Markdown
    h = html2text.HTML2Text()
    h.ignore_links = False # Keep links
    h.ignore_images = False # Keep images (as Markdown syntax)
    h.body_width = 0 # Do not wrap lines
    markdown_content = h.handle(html_content)

    # Clean up extra newlines and spaces
    markdown_content = re.sub(r'\n\s*\n', '\n\n', markdown_content).strip()
    
    return markdown_content

def split_markdown_content(filename_base, markdown_content):
    """Splits markdown content into multiple files if it exceeds MAX_CHARS_PER_FILE."""
    parts = []
    current_content = markdown_content
    part_num = 1

    while len(current_content) > MAX_CHARS_PER_FILE and part_num <= 3:
        split_point = -1
        # Search for H2 or H3 before MAX_CHARS_PER_FILE
        search_area = current_content[:MAX_CHARS_PER_FILE]
        
        # Find last H2 or H3
        last_h3 = [m.start() for m in re.finditer(r'\n### ', search_area)]
        last_h2 = [m.start() for m in re.finditer(r'\n## ', search_area)]

        if last_h3:
            split_point = max(last_h3)
        if last_h2:
            split_point = max(split_point, max(last_h2))
        
        if split_point != -1:
            # Ensure we split after the heading, not before
            split_point = search_area.rfind('\n', 0, split_point) + 1 # Find newline before heading
            if split_point == 0: # If heading is at very start, split after it
                split_point = search_area.find('\n', max(last_h2 + last_h3)) + 1
            
            parts.append(current_content[:split_point].strip())
            current_content = current_content[split_point:].strip()
        else:
            # Fallback: if no H2/H3 found, split at nearest paragraph break
            split_point = search_area.rfind('\n\n')
            if split_point != -1:
                parts.append(current_content[:split_point].strip())
                current_content = current_content[split_point:].strip()
            else:
                # If still no good split point, just split at MAX_CHARS_PER_FILE
                parts.append(current_content[:MAX_CHARS_PER_FILE].strip())
                current_content = current_content[MAX_CHARS_PER_FILE:].strip()
        
        part_num += 1
    
    if current_content:
        parts.append(current_content.strip())
    
    return parts

# --- Main Execution ---
if __name__ == "__main__":
    manifest = []
    
    for html_file_path in HTML_FILES_TO_PROCESS:
        print(f"Processing {html_file_path}...")
        original_content_char_count = 0
        generated_filenames = []
        
        try:
            # Read original HTML content to get character count before boilerplate removal
            with open(html_file_path, 'r', encoding='utf-8') as f:
                original_html_full = f.read()
                original_content_char_count = len(original_html_full)

            markdown_content = extract_main_content_to_markdown(html_file_path)
            
            # Determine base filename
            base_filename = get_filename_from_path(html_file_path)
            base_filename_no_ext = os.path.splitext(base_filename)[0]

            if len(markdown_content) > MAX_CHARS_PER_FILE:
                content_parts = split_markdown_content(base_filename_no_ext, markdown_content)
                for i, part in enumerate(content_parts):
                    part_filename = f"{base_filename_no_ext}-part{i+1}.md"
                    output_path = os.path.join(OUTPUT_DIR, part_filename)
                    with open(output_path, 'w', encoding='utf-8') as md_file:
                        md_file.write(part)
                    generated_filenames.append(part_filename)
                    print(f"  Generated split file: {output_path}")
            else:
                output_path = os.path.join(OUTPUT_DIR, base_filename)
                with open(output_path, 'w', encoding='utf-8') as md_file:
                    md_file.write(markdown_content)
                generated_filenames.append(base_filename)
                print(f"  Generated file: {output_path}")

            # Add to manifest
            manifest.append({
                'url': os.path.relpath(html_file_path, FRONTEND_DIR), # Conceptual URL
                'generated_files': ', '.join(generated_filenames),
                'original_char_count': original_content_char_count
            })

        except Exception as e:
            print(f"[ERROR] Failed to process {html_file_path}: {e}")
            manifest.append({
                'url': os.path.relpath(html_file_path, FRONTEND_DIR),
                'generated_files': 'ERROR',
                'original_char_count': original_content_char_count,
                'error': str(e)
            })

    # Save manifest
    manifest_path = os.path.join(OUTPUT_DIR, 'knowledge_base_manifest.csv')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        f.write("URL,Generated Files,Original Character Count\n")
        for entry in manifest:
            f.write(f"\"{entry['url']}\",\"{entry['generated_files']}\",{entry['original_char_count']}\n")
    print(f"\n--- Knowledge Base Generation Finished. Manifest saved to {manifest_path} ---")
