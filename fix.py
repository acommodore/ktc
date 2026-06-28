import re

with open('volunteer.html', 'r', encoding='utf-8') as f:
    content = f.read()

iframe_html = '<iframe src="https://docs.google.com/forms/d/1PIioDwoUuWG1mf8EQ8BelKhk-lSYAbjfKkyRyLo8Ij4/viewform?embedded=true" width="100%" height="1500" frameborder="0" marginheight="0" marginwidth="0" style="border-radius: 8px; background: transparent;">Loading...</iframe>'

content = re.sub(r'(?s)<form class="volunteer-form">.*?</form>', iframe_html, content)

with open('volunteer.html', 'w', encoding='utf-8') as f:
    f.write(content)
