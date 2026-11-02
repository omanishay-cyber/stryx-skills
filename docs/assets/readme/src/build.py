"""Build art.html from art.template.html (kept as a step so the template can gain injected parts again).
The backgrounds in paint/ were painted on the local GPU (brain make art, qwen-image-2.1 q8, seed 418, 1024x1024),
upscaled x4 (brain make upscale, realesrgan-x4plus) and cropped: hero.jpg, lake.jpg, closing.jpg."""
import pathlib
here = pathlib.Path(__file__).resolve().parent
(here / "art.html").write_text((here / "art.template.html").read_text(encoding="utf-8"), encoding="utf-8")
print("art.html written")
