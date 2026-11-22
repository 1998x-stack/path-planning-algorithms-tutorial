#!/usr/bin/env python3
"""Execute the first twenty-five curated Python examples in isolated processes.

The snippets are small pedagogical tests, not benchmark measurements.
"""
from html import unescape
from pathlib import Path
import re
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
def main():
    failed=[]
    for num in range(1,26):
        path=ROOT/"docs"/"chapters"/f"{num:02}.html"
        content=path.read_text(encoding="utf-8")
        blocks=re.findall(r"<pre><code>(.*?)</code></pre>",content,re.S)
        if len(blocks)!=1:
            failed.append(f"{path}: expected one example, found {len(blocks)}")
            continue
        script=unescape(blocks[0])
        try:
            proc=subprocess.run([sys.executable,"-c",script],capture_output=True,text=True,timeout=10,check=True)
            print(f"{num:02} PASS: {proc.stdout.strip()}")
        except (subprocess.CalledProcessError,subprocess.TimeoutExpired) as exc:
            failed.append(f"{path}: {exc}")
    if failed:
        print("\n".join(failed),file=sys.stderr)
        return 1
    print("All twenty-five curated Python snippets passed")
    return 0
if __name__=="__main__":sys.exit(main())
