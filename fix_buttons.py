import os
import re

def walk_dir(directory):
    results = []
    for root, dirs, files in os.walk(directory):
        if 'node_modules' in root or '.next' in root:
            continue
        for file in files:
            if file.endswith('.tsx') or file.endswith('.jsx'):
                results.append(os.path.join(root, file))
    return results

files = walk_dir('./src')

button_regex = re.compile(r'<(Button|button)\b([^>]*)>')

def replace_attrs(match):
    tag = match.group(1)
    attrs = match.group(2)
    
    updated_attrs = re.sub(r'\buppercase\b', 'capitalize', attrs)
    updated_attrs = re.sub(r'\btracking-wide(?:st|r)?\b', '', updated_attrs)
    updated_attrs = re.sub(r'\btext-\[9px\]\b', 'text-[12px]', updated_attrs)
    updated_attrs = re.sub(r'\btext-\[10px\]\b', 'text-[13px]', updated_attrs)
    updated_attrs = re.sub(r'\btext-\[11px\]\b', 'text-[13px]', updated_attrs)
    
    return f'<{tag}{updated_attrs}>'

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    content = button_regex.sub(replace_attrs, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated: {filepath}')
