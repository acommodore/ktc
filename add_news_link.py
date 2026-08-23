import sys

files = ['gallery.html', 'volunteer.html']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Nav Links
    content = content.replace(
        '<li><a href="index.html#programs">Programs</a></li>\n        <li><a href="gallery.html">Gallery</a></li>', 
        '<li><a href="index.html#programs">Programs</a></li>\n        <li><a href="news.html">News</a></li>\n        <li><a href="gallery.html">Gallery</a></li>'
    )
    
    # Footer Links
    content = content.replace(
        '<li><a href="index.html#programs">Programs</a></li>\n            <li><a href="index.html#donate">Donate</a></li>', 
        '<li><a href="index.html#programs">Programs</a></li>\n            <li><a href="news.html">News</a></li>\n            <li><a href="index.html#donate">Donate</a></li>'
    )
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
