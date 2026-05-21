import os

def concatenate_codebase(source_dir, output_filename):
    # Directories and files to ignore to keep the file size manageable
    ignore_dirs = {'.git', 'node_modules', 'dist', 'build', '.idea', '.vscode', 'uploads'}
    ignore_files = {'package-lock.json', '.DS_Store'}
    allowed_extensions = {'.js', '.ts', '.json', '.env.example'}

    with open(output_filename, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk(source_dir):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in ignore_dirs]

            for file in files:
                # Check if file is allowed and not explicitly ignored
                if file not in ignore_files and any(file.endswith(ext) for ext in allowed_extensions):
                    filepath = os.path.join(root, file)
                    
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            
                            # Add clear boundaries and file paths for the LLM to read
                            outfile.write(f"\n\n{'='*60}\n")
                            outfile.write(f"File: {os.path.relpath(filepath, source_dir)}\n")
                            outfile.write(f"{'='*60}\n\n")
                            outfile.write(content)
                            
                    except Exception as e:
                        print(f"Skipping {filepath}: Could not read file ({e})")

    print(f"Successfully compressed codebase into {output_filename}")

# Run the script on the current directory
if __name__ == "__main__":
    concatenate_codebase('.', 'backend_codebase.txt')