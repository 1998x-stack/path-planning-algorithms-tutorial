#!/usr/bin/env python3
"""Offline structural checks. Does not claim to replace browser QA."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys
import xml.etree.ElementTree as ET
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
class Tags(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links, self.ids, self.h1, self.figure, self.figcaption, self.svg, self.errors = [], set(), 0, 0, 0, 0, []
        self._fig_stack = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if "id" in d:
            if d["id"] in self.ids: self.errors.append("duplicate id "+d["id"])
            self.ids.add(d["id"])
        if tag == "h1": self.h1 += 1
        if tag == "figure": self.figure += 1; self._fig_stack.append(False)
        if tag == "figcaption" and self._fig_stack: self._fig_stack[-1] = True; self.figcaption += 1
        if tag == "svg": self.svg += 1
        for key in ("href","src"):
            if key in d: self.links.append((tag,d[key]))
    def handle_endtag(self, tag):
        if tag == "figure" and self._fig_stack:
            if not self._fig_stack.pop(): self.errors.append("figure has no figcaption")
def check():
    errors=[]
    chapters=json.loads((DOCS/"data/chapters.json").read_text(encoding="utf-8"))
    assert len(chapters)==28
    for c in chapters:
        if not (DOCS / c["href"]).is_file(): errors.append("missing chapter "+c["href"])
    for file in sorted(DOCS.rglob("*.html")):
        p=Tags()
        try: p.feed(file.read_text(encoding="utf-8"))
        except Exception as e: errors.append(f"{file}: parse {e}"); continue
        if file == DOCS / "index.html" or (file.parent.name=="chapters" and file.stem in [f"{i:02}" for i in range(1,6)]):
            if p.h1!=1: errors.append(f"{file}: expected one h1, got {p.h1}")
            if file.parent.name=="chapters" and p.figure<2: errors.append(f"{file}: expected >=2 figures, got {p.figure}")
        errors.extend(f"{file}: {e}" for e in p.errors)
        for tag,link in p.links:
            if link.startswith(("http:","https:","mailto:","javascript:","data:","#","//")): continue
            u=urlsplit(link)
            if not u.path: continue
            dest=(file.parent/unquote(u.path)).resolve()
            if not dest.is_relative_to(DOCS.resolve()) or not dest.is_file():
                errors.append(f"{file}: missing asset {link}")
            elif u.fragment and dest.suffix==".html" and dest==file.resolve() and u.fragment not in p.ids:
                errors.append(f"{file}: unknown anchor {link}")
    for file in DOCS.rglob("*.svg"):
        try:
            xml=ET.parse(file).getroot()
            if not xml.tag.endswith("svg") or "viewBox" not in xml.attrib: raise ValueError("missing svg/viewBox")
            if not any(x.tag.endswith("title") for x in xml.iter()): raise ValueError("missing title")
            if not any(x.tag.endswith("desc") for x in xml.iter()): raise ValueError("missing desc")
        except Exception as e: errors.append(f"{file}: {e}")
    if errors:
        print("FAILED — "+str(len(errors))+" problems\n" + "\n".join(errors[:120]),file=sys.stderr)
        return 1
    print("OK — 28 chapters, links, SVG XML and article structure (static checks only)")
    return 0
if __name__=="__main__": sys.exit(check())
