import os
import glob
from bs4 import BeautifulSoup
import faiss
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv
import time
import PyPDF2 # For PDF processing
from docx import Document # For Word document processing
import pandas as pd # For CSV processing
import xml.etree.ElementTree as ET # For XML processing
import json


# Load environment variables from .env file in the backend directory
load_dotenv(dotenv_path='C:/Users/user/Desktop/solutionenergylimited/backend/.env')

# --- Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Directories for different content types
HTML_CONTENT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/frontend'
MARKDOWN_CONTENT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/second-kb'
PDF_CONTENT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/docs/pdfs' # Example
DOCX_CONTENT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/docs/docx' # Example
CSV_CONTENT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/docs/csv' # Example
JSON_CONTENT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/third-kb' # Example
XML_CONTENT_DIR = 'C:/Users/user/Desktop/solutionenergylimited/docs/xml' # Example

# Patterns for files to scrape for the knowledge base
FILE_PATTERNS = {
    'html': ['index.html', 'about.html', 'process.html', 'blog/index.html', 'contact.html', 'services/*.html', 'services/iso-certification/*.html'],
    'md': ['*.md'],
    'pdf': ['*.pdf'],
    'docx': ['*.docx'],
    'csv': ['*.csv'],
    'json': ['*.json'],
    'xml': ['*.xml']
}

# FAISS index file
INDEX_FILE = "faiss_index.bin"
METADATA_FILE = "faiss_metadata.json"

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# --- Text Processing Functions ---

def scrape_html_content(file_path):
    """Scrapes readable text from a single HTML file."""
    text = ""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
            # Remove script and style elements
            for script_or_style in soup(["script", "style"]):
                script_or_style.decompose()
            # Get text and clean it up
            text = soup.get_text(separator=' ', strip=True)
    except Exception as e:
        print(f"[ERROR] Could not read or parse HTML {file_path}: {e}")
    return text

def scrape_markdown_content(file_path):
    """Reads text from a single Markdown file."""
    text = ""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
    except Exception as e:
        print(f"[ERROR] Could not read Markdown {file_path}: {e}")
    return text

def scrape_pdf_content(file_path):
    """Extracts text from a PDF file."""
    text = ""
    try:
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page_num in range(len(reader.pages)):
                text += reader.pages[page_num].extract_text() + "\n"
    except Exception as e:
        print(f"[ERROR] Could not read or parse PDF {file_path}: {e}")
    return text

def scrape_docx_content(file_path):
    """Extracts text from a DOCX file."""
    text = ""
    try:
        document = Document(file_path)
        for para in document.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"[ERROR] Could not read or parse DOCX {file_path}: {e}")
    return text

def scrape_csv_content(file_path):
    """Extracts text from a CSV file."""
    text = ""
    try:
        df = pd.read_csv(file_path)
        text = df.to_string(index=False) # Convert DataFrame to string representation
    except Exception as e:
        print(f"[ERROR] Could not read or parse CSV {file_path}: {e}")
    return text

def scrape_json_content(file_path):
    """Extracts text from a JSON file."""
    text = ""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            text = json.dumps(data, indent=2) # Pretty print JSON for readability
    except Exception as e:
        print(f"[ERROR] Could not read or parse JSON {file_path}: {e}")
    return text

def scrape_xml_content(file_path):
    """Extracts text from an XML file."""
    text = ""
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        text = ET.tostring(root, encoding='unicode', method='text') # Extract all text content
    except Exception as e:
        print(f"[ERROR] Could not read or parse XML {file_path}: {e}")
    return text

def dispatch_scrape_content(file_path):
    """Dispatches to the correct scraping function based on file extension."""
    file_extension = os.path.splitext(file_path)[1].lower()
    
    if file_extension == '.html':
        return scrape_html_content(file_path)
    elif file_extension == '.md':
        return scrape_markdown_content(file_path)
    elif file_extension == '.pdf':
        return scrape_pdf_content(file_path)
    elif file_extension == '.docx':
        return scrape_docx_content(file_path)
    elif file_extension == '.csv':
        return scrape_csv_content(file_path)
    elif file_extension == '.json':
        return scrape_json_content(file_path)
    elif file_extension == '.xml':
        return scrape_xml_content(file_path)
    else:
        print(f"[WARNING] Unsupported file type for {file_path}. Skipping.")
        return ""

def chunk_text(documents, chunk_size=500, overlap=50):
    """Splits text into smaller, overlapping chunks."""
    chunks = []
    for doc in documents:
        content = doc['content']
        for i in range(0, len(content), chunk_size - overlap):
            chunk = content[i:i + chunk_size]
            chunks.append({'source': doc['source'], 'text': chunk})
    return chunks

# --- Embedding and Indexing Functions ---

def embed_chunks(chunks):
    """Embeds a list of text chunks using the Gemini API."""
    print(f"Embedding {len(chunks)} chunks...")
    embeddings = []
    # The embedding API has a rate limit, so we process in batches
    batch_size = 90 # The API limit is 100, we use a slightly smaller batch size for safety
    for i in range(0, len(chunks), batch_size):
        batch_chunks = [chunk['text'] for chunk in chunks[i:i + batch_size]]
        try:
            # Use the new embed_content method for batching
            result = genai.embed_content(model='models/text-embedding-004', content=batch_chunks, task_type="RETRIEVAL_DOCUMENT")
            embeddings.extend(result['embedding'])
            print(f"  ...embedded batch {i//batch_size + 1}/{(len(chunks)-1)//batch_size + 1}")
        except Exception as e:
            print(f"[ERROR] Embedding failed for batch starting at index {i}: {e}")
            # If a batch fails, we fill with None to maintain index alignment
            embeddings.extend([None] * len(batch_chunks))
        
        # Respect rate limits
        time.sleep(1) # Simple delay to help with rate limiting

    return embeddings

def build_and_save_index(embeddings, chunks):
    """Builds a FAISS index and saves it along with metadata."""
    # Filter out failed embeddings
    valid_embeddings = []
    valid_metadata = []
    for i, emb in enumerate(embeddings):
        if emb is not None:
            valid_embeddings.append(emb)
            valid_metadata.append(chunks[i])

    if not valid_embeddings:
        print("[FATAL] No valid embeddings were created. Cannot build index.")
        return

    print(f"Building FAISS index with {len(valid_embeddings)} vectors...")
    dimension = len(valid_embeddings[0])
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(valid_embeddings).astype('float32'))

    # Save the index
    faiss.write_index(index, INDEX_FILE)
    print(f"FAISS index saved to {INDEX_FILE}")

    # Save the metadata
    import json
    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(valid_metadata, f, indent=4)
    print(f"Metadata saved to {METADATA_FILE}")

# --- Main Execution ---

if __name__ == "__main__":
    print("--- Starting Knowledge Base Builder ---")
    
    if not GEMINI_API_KEY:
        print("[FATAL] GEMINI_API_KEY environment variable not set.")
    else:
        all_files_to_process = []

        # Collect files based on their types and directories
        for file_type, patterns in FILE_PATTERNS.items():
            base_dir = ''
            if file_type == 'html':
                base_dir = HTML_CONTENT_DIR
            elif file_type == 'md':
                base_dir = MARKDOWN_CONTENT_DIR
            elif file_type == 'pdf':
                base_dir = PDF_CONTENT_DIR
            elif file_type == 'docx':
                base_dir = DOCX_CONTENT_DIR
            elif file_type == 'csv':
                base_dir = CSV_CONTENT_DIR
            elif file_type == 'json':
                base_dir = JSON_CONTENT_DIR
            elif file_type == 'xml':
                base_dir = XML_CONTENT_DIR
            
            if base_dir: # Only process if a base directory is defined
                for pattern in patterns:
                    full_pattern = os.path.join(base_dir, pattern)
                    all_files_to_process.extend(glob.glob(full_pattern, recursive=True))
        
        if not all_files_to_process:
            print("[FATAL] No files found to scrape. Check `FILE_PATTERNS` and content directories configuration.")
        else:
            documents = []
            for file_path in all_files_to_process:
                print(f"Processing {file_path}...")
                content = dispatch_scrape_content(file_path)
                if content:
                    documents.append({'source': os.path.basename(file_path), 'content': content})
            
            if not documents:
                print("[FATAL] No content extracted from files after scraping.")
            else:
                chunks = chunk_text(documents)
                embeddings = embed_chunks(chunks)
                build_and_save_index(embeddings, chunks)
            
            print("--- Knowledge Base build process finished. ---")
