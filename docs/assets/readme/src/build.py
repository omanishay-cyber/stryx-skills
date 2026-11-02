"""Build art.html: the template plus the tree SVG copied from docs/index.html (one source for the tree)."""
import pathlib, re

here = pathlib.Path(__file__).resolve().parent
index = (here.parents[2] / "index.html").read_text(encoding="utf-8")
m = re.search(r'<svg class="tree".*?</svg>', index, re.S)
if not m:
    raise SystemExit("tree svg not found in docs/index.html")
tree = m.group(0).replace('id="tree" ', '').replace('role="img" aria-labelledby="tree-title tree-desc" ', 'aria-hidden="true" ')
tpl = (here / "art.template.html").read_text(encoding="utf-8")
(here / "art.html").write_text(tpl.replace("<!--TREE-->", tree), encoding="utf-8")
print("art.html written,", len(tree), "chars of tree")
