import os
import re

def check_imports():
    src_dir = './src'
    edit3_usage = re.compile(r'<Edit3\b')
    
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.jsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if edit3_usage.search(content):
                        # Use DOTALL to match imports across multiple lines
                        import_match = re.search(r'import\s+\{[^}]*\}\s+from\s+[\'"]lucide-react[\'"]', content, re.DOTALL)
                        if import_match:
                            if 'Edit3' not in import_match.group(0):
                                print(f"FILE MISSING IMPORT: {path}")
                        else:
                            print(f"NO LUCIDE IMPORT AT ALL BUT USES EDIT3: {path}")

if __name__ == "__main__":
    check_imports()
