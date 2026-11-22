#!/usr/bin/env python3
"""Build the Pages artifact by copying the canonical docs/ source."""
from pathlib import Path
from shutil import copytree, rmtree
import subprocess
import sys
repo=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(repo/"tools/validate_site.py")],check=True)
out=repo/"_site"
if out.exists(): rmtree(out)
copytree(repo/"docs",out)
(out/".nojekyll").write_text("",encoding="utf-8")
print("Built:",out)
