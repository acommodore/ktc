import sys

def inject_scripts(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    script_tags = """
  <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>
  <script src="./main.js" defer></script>
  <script src="./data.js" defer></script>
</body>"""
    
    content = content.replace('  <script src="./main.js" defer></script>\n</body>', script_tags)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

inject_scripts('news.html')
inject_scripts('gallery.html')
