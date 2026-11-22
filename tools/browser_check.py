#!/usr/bin/env python3
"""Chromium smoke checks for the canonical tutorial pages.

Produces viewport screenshots and a JSON report. This is visual/interaction QA,
not a robot motion-planning benchmark.
"""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
import json
import sys
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
OUTPUT = ROOT / "reports" / "browser"
PAGES = ["index.html"] + [f"chapters/{n:02}.html" for n in range(1, 21)]
VIEWS = [("desktop", 1440, 900), ("tablet", 768, 1024),
         ("mobile390", 390, 844), ("mobile360", 360, 800)]

class Handler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), partial(Handler, directory=str(DOCS)))
    Thread(target=httpd.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{httpd.server_address[1]}/"
    failures, results = [], []
    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            for path in PAGES:
                for key, width, height in VIEWS:
                    page = browser.new_page(viewport={"width": width, "height": height},
                                            device_scale_factor=1, reduced_motion="reduce")
                    errors = []
                    page.on("pageerror", lambda error: errors.append(str(error)))
                    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
                    try:
                        response = page.goto(base + path, wait_until="load", timeout=30000)
                        page.wait_for_timeout(150)  # allow initial DOMReady enhancements
                        # Lazy images below the first viewport have not loaded yet.
                        # Force them to load and decode before declaring image failure.
                        page.evaluate("""async () => {
                            await Promise.all([...document.images].map(async image => {
                                image.loading = 'eager';
                                try { await image.decode(); } catch (_) { /* verified below */ }
                            }));
                        }""")
                        stats = page.evaluate("""() => ({
                            scroll: document.documentElement.scrollWidth,
                            viewport: window.innerWidth,
                            broken: [...document.images].filter(x => !x.complete || !x.naturalWidth).map(x => x.getAttribute('src')),
                            missingAlt: [...document.images].filter(x => !x.getAttribute('alt')).length,
                            figures: document.querySelectorAll('figure').length,
                            emptyCaptions: [...document.querySelectorAll('figure')].filter(x => !x.querySelector('figcaption')?.textContent.trim()).length,
                            badMath: [...document.querySelectorAll('math')].filter(x => x.getBoundingClientRect().width < 1 || x.getBoundingClientRect().height < 1).length,
                            remoteAssets: [...document.querySelectorAll('script[src],link[rel="stylesheet"],img[src]')]
                              .map(x => x.getAttribute('src') || x.getAttribute('href'))
                              .filter(x => x && new URL(x, location.href).origin !== location.origin)
                        })""")
                        if not response or response.status != 200:
                            failures.append(f"{path} {key}: HTTP {response.status if response else 'no response'}")
                        if stats["scroll"] > stats["viewport"] + 1:
                            failures.append(f"{path} {key}: document horizontal overflow {stats['scroll']} > {stats['viewport']}")
                        if stats["broken"]:
                            failures.append(f"{path} {key}: broken images {stats['broken']}")
                        if stats["missingAlt"] or stats["emptyCaptions"] or stats["badMath"]:
                            failures.append(f"{path} {key}: alt/caption/MathML issue {stats}")
                        if stats["remoteAssets"]:
                            failures.append(f"{path} {key}: external runtime assets {stats['remoteAssets']}")
                        if errors: failures.append(f"{path} {key}: JS/console errors {errors}")
                        if key == "desktop" and path.startswith("chapters/"):
                            page.emulate_media(media="print")
                            print_visible = page.locator(".article-main figure").first.is_visible()
                            sidebar_hidden = page.locator(".article-sidebar").evaluate("(x) => getComputedStyle(x).display === 'none'")
                            if not print_visible or not sidebar_hidden:
                                failures.append(f"{path}: print stylesheet hides article content or leaves sidebar visible")
                            page.emulate_media(media="screen")
                        if key == "desktop" and path == "index.html":
                            page.locator("#chapter-search").fill("RRT")
                            count = page.locator(".chapter-card:visible").count()
                            if not (1 <= count < 28):
                                failures.append("index: search filter did not change chapter card visibility")
                            page.locator("#chapter-search").fill("")
                            page.keyboard.press("Tab")
                        if key == "desktop" and path.endswith("/03.html"):
                            before = page.locator(".demo-status").inner_text()
                            page.get_by_role("button", name="下一次展开").click()
                            after = page.locator(".demo-status").inner_text()
                            if before == after or page.locator(".demo-cell.frontier").count() == 0:
                                failures.append("03: BFS next step produced no meaningful state change")
                        if key == "desktop" and path.endswith("/08.html"):
                            status = page.locator("[data-weighted-demo] .demo-status")
                            before = status.inner_text()
                            page.locator("[data-weight='3']").click()
                            after = status.inner_text()
                            if (before == after or "S→B→G" not in after):
                                failures.append("08: weighted A* epsilon change did not update computed path")
                        if key == "desktop" and path.endswith("/16.html"):
                            status = page.locator("[data-dwa-demo] .demo-status")
                            before = status.inner_text()
                            page.locator("[data-dwa-mode='progress']").click()
                            after = status.inner_text()
                            if before == after or "0.6" not in after:
                                failures.append("16: DWA scoring preference did not change selected control")
                        if key == "desktop" and path.endswith("/20.html"):
                            status = page.locator("[data-pareto-demo] .demo-status")
                            before = status.inner_text()
                            page.locator("[data-pareto-mode='risk']").click()
                            after = status.inner_text()
                            if before == after or "C-safe" not in after:
                                failures.append("20: Pareto weight preference did not change selected route")
                        if key == "desktop" and path.endswith("/14.html"):
                            status = page.locator("[data-sampling-choice] .demo-status")
                            original = status.inner_text()
                            page.locator("[data-choice='multi']").click()
                            updated = status.inner_text()
                            if original == updated or "PRM" not in updated:
                                failures.append("14: sampling method decision did not change")
                        if key == "desktop" and path.endswith("/15.html"):
                            demo = page.locator("[data-shortcut-demo]")
                            original = demo.locator("[data-shortcut-polyline]").get_attribute("points")
                            demo.locator("[data-path-mode='safe']").click()
                            changed = demo.locator("[data-shortcut-polyline]").get_attribute("points")
                            if original == changed or "捷径" not in demo.locator(".demo-status").inner_text():
                                failures.append("15: collision-checked shortcut demo did not update")
                        name=path.replace("/", "-").replace(".html", "")
                        page.screenshot(path=str(OUTPUT / f"{name}-{key}.png"), full_page=True)
                        results.append({"page": path, "viewport": key, "http": response.status if response else None,
                                        **stats, "consoleErrors": errors})
                    except Exception as exc:
                        failures.append(f"{path} {key}: browser failure {exc}")
                    finally:
                        page.close()
            browser.close()
    finally:
        httpd.shutdown()
    report = {"pages": len(PAGES), "viewports": len(VIEWS), "cases": len(results),
              "failures": failures, "results": results}
    (OUTPUT / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Browser QA: {len(results)} cases, {len(failures)} failures")
    for issue in failures: print("FAIL", issue, file=sys.stderr)
    return int(bool(failures))

if __name__ == "__main__":
    sys.exit(main())
