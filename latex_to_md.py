"""LaTeX → Markdown 论文转换脚本"""
import re

with open("D:/2026年7月/小论文1/Paper1_IJER_elsarticle_edited.tex", "r", encoding="utf-8") as f:
    tex = f.read()

# ===== 移除 preamble 和 documentclass/packages =====
# Extract content between \begin{document} and \end{document}
m = re.search(r'\\begin\{document\}(.*?)\\end\{document\}', tex, re.DOTALL)
if not m:
    print("ERROR: cannot find \\begin{document}")
    exit(1)
body = m.group(1)

# ===== 提取标题 =====
title_m = re.search(r'\\title\{(.*?)\}', tex, re.DOTALL)
title = title_m.group(1).replace('\\\\\n', ' ').strip() if title_m else ""

# ===== 提取摘要 =====
abs_m = re.search(r'\\begin\{abstract\}(.*?)\\end\{abstract\}', body, re.DOTALL)
abstract = abs_m.group(1).strip() if abs_m else ""

# ===== 提取关键词 =====
kw_m = re.search(r'\\begin\{keyword\}(.*?)\\end\{keyword\}', body, re.DOTALL)
keywords = kw_m.group(1).replace('\\sep', ';').strip() if kw_m else ""

# ===== 提取正文（从 \section 开始到 \section*{Declarations} 之前）=====
sec_start = body.find(r'\section{')
decl_start = body.find(r'\section*{Declarations}')
if decl_start < 0:
    decl_start = body.find(r'\section*{References}')
main_body = body[sec_start:decl_start] if sec_start >= 0 and decl_start >= 0 else body

# ===== 替换 LaTeX 命令 =====
def latex_to_md(text):
    # Remove \begin{frontmatter}...\end{frontmatter}
    text = re.sub(r'\\begin\{frontmatter\}.*?\\end\{frontmatter\}', '', text, flags=re.DOTALL)
    # Remove \begin{highlights}...\end{highlights}
    text = re.sub(r'\\begin\{highlights\}.*?\\end\{highlights\}', '', text, flags=re.DOTALL)
    # Remove \begin{keyword}...\end{keyword}
    text = re.sub(r'\\begin\{keyword\}.*?\\end\{keyword\}', '', text, flags=re.DOTALL)
    # Remove \begin{abstract}...\end{abstract}
    text = re.sub(r'\\begin\{abstract\}.*?\\end\{abstract\}', '', text, flags=re.DOTALL)

    # Section headings
    text = re.sub(r'\\section\{([^}]+)\}', r'## \1', text)
    text = re.sub(r'\\subsection\{([^}]+)\}', r'### \1', text)
    text = re.sub(r'\\section\*\{([^}]+)\}', r'## \1', text)
    text = re.sub(r'\\subsection\*\{([^}]+)\}', r'### \1', text)

    # Label
    text = re.sub(r'\\label\{[^}]+\}', '', text)

    # Citations
    text = re.sub(r'\\cite\{([^}]+)\}', r'[\1]', text)
    text = re.sub(r'\\citep\{([^}]+)\}', r'[\1]', text)
    text = re.sub(r'\\citet\{([^}]+)\}', r'\1', text)

    # Inline formatting
    text = re.sub(r'\\textbf\{([^}]+)\}', r'**\1**', text)
    text = re.sub(r'\\textit\{([^}]+)\}', r'*\1*', text)
    text = re.sub(r'\\emph\{([^}]+)\}', r'*\1*', text)
    text = re.sub(r'\\texttt\{([^}]+)\}', r'`\1`', text)

    # Small caps
    text = re.sub(r'\\textsc\{([^}]+)\}', r'\1', text)

    # URL
    text = re.sub(r'\\url\{([^}]+)\}', r'\1', text)

    # DOI
    text = re.sub(r'\\doi\{([^}]+)\}', r'https://doi.org/\1', text)

    # Quotes
    text = text.replace('``', '"').replace("''", '"')

    # Special chars
    text = text.replace('\\&', '&').replace('\\%', '%').replace('\\$', '$')
    text = text.replace('\\#', '#').replace('\\_', '_').replace('\\{', '{').replace('\\}', '}')
    text = text.replace('~', ' ')

    # Dots
    text = text.replace('\\dots', '...').replace('\\ldots', '...')

    # Tilde for non-breaking space
    text = text.replace('ten~Berge', 'ten Berge')

    # Newlines
    text = text.replace('\\\\[3pt]', '').replace('\\\\', '')

    # Math mode - inline
    text = re.sub(r'\$([^$]+?)\$', r'`\1`', text)

    # Horizontal spaces
    text = text.replace('\\hspace{...}', '')

    # Remove \TODO{}
    text = re.sub(r'\\TODO\{[^}]*\}', '<!-- TODO -->', text)

    # Remove \noalign{}, \midrule, \toprule, \bottomrule
    text = re.sub(r'\\(?:noalign|midrule|toprule|bottomrule|endhead|endlastfoot|endfirsthead)\{[^}]*\}', '', text)
    text = re.sub(r'\\(?:midrule|toprule|bottomrule)', '', text)

    # Longtable conversion: simplify to basic tables
    # Remove \begin{longtable}...\end{longtable} with placeholder
    text = re.sub(
        r'\\begin\{longtable\}.*?\\end\{longtable\}',
        '\n*[Table content - see original LaTeX]*\n',
        text, flags=re.DOTALL
    )

    # \begin{minipage}...\end{minipage}
    text = re.sub(r'\\begin\{minipage\}\[.*?\]\{[^}]*\}', '', text)
    text = re.sub(r'\\end\{minipage\}', '', text)

    # Remove remaining \centering \raggedright \raggedleft
    text = re.sub(r'\\(?:centering|raggedright|raggedleft|arraybackslash)', '', text)

    # Remove raw column specs
    text = re.sub(r'>\{[^}]*\}p\{[^}]*\}', '', text)

    # Clean up multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Subscript/superscript
    text = re.sub(r'\_\{([^}]+)\}', r'_\1', text)
    text = re.sub(r'\^\{([^}]+)\}', r'^\1', text)

    # Horizontal rule
    text = text.replace('\\hline', '---')

    return text

# Process
title_md = latex_to_md(title)
abstract_md = latex_to_md(abstract)
keywords_md = latex_to_md(keywords)
body_md = latex_to_md(main_body)

# ===== 生成引用部分 =====
ref_start = body.find(r'\section*{References}')
ref_end = body.find(r'\end{thebibliography}')
references = ""
if ref_start >= 0 and ref_end >= 0:
    ref_section = body[ref_start:ref_end]
    # Extract individual \bibitem entries
    bibitems = re.findall(r'\\bibitem\[([^\]]*)\]\{([^}]+)\}(.*?)(?=\\bibitem|\\end\{thebibliography\})', ref_section, re.DOTALL)
    if bibitems:
        references = "\n## References\n\n"
        for citation, key, content in bibitems:
            # Clean LaTeX from reference content
            ref_text = latex_to_md(content.strip())
            # Remove leading/trailing braces
            ref_text = ref_text.strip()
            references += f"- {ref_text}\n"

# ===== 组装 Markdown =====
md = f"""# {title_md}

---

## Abstract

{abstract_md}

**Keywords:** {keywords_md}

---

{body_md}

{references}
"""

# Clean up
md = re.sub(r'\n{3,}', '\n\n', md)
md = re.sub(r'\\hfill', '', md)

# Write
with open("D:/2026年7月/小论文1/Paper1_IJER_elsarticle_edited.md", "w", encoding="utf-8") as f:
    f.write(md)

print(f"Converted: {len(md)} chars written to Paper1_IJER_elsarticle_edited.md")
