import os
import json
import re
import html2text

directory = 'C:/Users/user/Desktop/solutionenergylimited/third-kb'

for filename in os.listdir(directory):
    if filename.endswith('.json'):
        file_path = os.path.join(directory, filename)

        with open(file_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                print(f"Skipping {filename} due to JSON decode error.")
                continue

        # Check if the data is a dictionary
        if not isinstance(data, dict):
            print(f"Skipping {filename} because it does not contain a JSON object.")
            continue

        # Create slug from title
        if 'title' in data:
            title = data['title']
            slug = title.lower()
            slug = re.sub(r'[^a-z0-9\s-]', '', slug)
            slug = re.sub(r'\s+', '-', slug)
            slug = slug.strip('-')
            data['slug'] = slug

        # Convert content to Markdown
        if 'content' in data:
            h = html2text.HTML2Text()
            h.ignore_links = False
            h.ignore_images = False
            h.body_width = 0
            data['content'] = h.handle(data['content'])

        # Remove URL field
        if 'URL' in data:
            del data['URL']

        # Standardize author name
        if 'author_name' in data and data['author_name'] == 'George Samuel E.':
            data['author_name'] = 'George Samuel Etim'

        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)