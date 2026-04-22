const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        // Exclude node_modules and .next etc just in case
        if (stat && stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
            results = results.concat(walkDir(filePath));
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walkDir('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // We specifically replace uppercase, tracking variants, and tiny font sizes ON buttons
    content = content.replace(/<(Button|button)\b([^>]*)>/g, (match, tag, attrs) => {
        let updatedAttrs = attrs.replace(/\buppercase\b/g, 'capitalize');
        updatedAttrs = updatedAttrs.replace(/\btracking-wide(?:st|r)?\b/g, ''); // Tracking usually looks weird with titlecase
        updatedAttrs = updatedAttrs.replace(/\btext-\[9px\]\b/g, 'text-[12px]');
        updatedAttrs = updatedAttrs.replace(/\btext-\[10px\]\b/g, 'text-[13px]');
        updatedAttrs = updatedAttrs.replace(/\btext-\[11px\]\b/g, 'text-[13px]'); // Keep it balanced
        return `<${tag}${updatedAttrs}>`;
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated: ${file}`);
    }
});
