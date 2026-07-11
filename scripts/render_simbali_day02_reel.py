from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "automation_outputs" / "2026-07-11_day_02"
FRAMES = OUT / "slideshow_frames"
WIDTH, HEIGHT = 1080, 1920
FPS = 30
SECONDS_PER_SCENE = 4

PALETTE = {
    "cream": (245, 240, 232),
    "olive": (61, 74, 44),
    "forest": (44, 62, 30),
    "gold": (201, 162, 39),
    "terracotta": (196, 122, 90),
    "charcoal": (45, 45, 45),
    "white": (255, 255, 255),
}

SCENES = [
    {
        "image": ROOT / "public/images/giraffes-savanna-safari-simbali-wild-safaris.jpg",
        "kicker": "SIMBALI WILD SAFARIS",
        "title": "Meet the Special Five of Samburu",
        "body": "Northern Kenya's rare dry-country wildlife, one unforgettable safari.",
        "marker": "1 of 6",
    },
    {
        "image": ROOT / "public/images/zebras-savanna-safari-simbali-wild-safaris.jpg",
        "kicker": "GREVY'S ZEBRA",
        "title": "The largest wild equid",
        "body": "Narrow stripes, large rounded ears, and only about 2,500 left in the wild.",
        "marker": "2 of 6",
    },
    {
        "image": ROOT / "public/images/giraffes-savanna-safari-simbali-wild-safaris.jpg",
        "kicker": "RETICULATED GIRAFFE",
        "title": "Living stained glass",
        "body": "A chestnut-and-cream mosaic pattern makes this northern giraffe unmistakable.",
        "marker": "3 of 6",
    },
    {
        "image": ROOT / "public/images/impala-antelope-safari-simbali-wild-safaris.jpg",
        "kicker": "GERENUK",
        "title": "The giraffe gazelle",
        "body": "This long-necked antelope stands on its hind legs to reach higher branches.",
        "marker": "4 of 6",
    },
    {
        "image": ROOT / "public/images/baobab-sunset-safari-simbali-wild-safaris.jpg",
        "kicker": "SOMALI OSTRICH + BEISA ORYX",
        "title": "Built for heat and distance",
        "body": "Blue-necked ostriches and desert-adapted oryx complete Samburu's Special Five.",
        "marker": "5 of 6",
    },
    {
        "image": ROOT / "public/images/itin-kenya-honeymoon.jpg",
        "kicker": "READY TO SPOT THEM?",
        "title": "See Samburu with Simbali",
        "body": "Plan your Kenya safari at https://simbaliwildsafaris.com",
        "marker": "6 of 6",
    },
]


def font(size: int, bold: bool = False, serif: bool = False) -> ImageFont.FreeTypeFont:
    candidates = []
    if serif:
        candidates += [
            "C:/Windows/Fonts/georgiab.ttf" if bold else "C:/Windows/Fonts/georgia.ttf",
            "C:/Windows/Fonts/timesbd.ttf" if bold else "C:/Windows/Fonts/times.ttf",
        ]
    candidates += [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def cover_image(path: Path, progress: float) -> Image.Image:
    img = Image.open(path).convert("RGB")
    scale = max(WIDTH / img.width, HEIGHT / img.height) * (1.05 + progress * 0.035)
    resized = img.resize((math.ceil(img.width * scale), math.ceil(img.height * scale)), Image.LANCZOS)
    x = int((resized.width - WIDTH) * (0.5 + (progress - 0.5) * 0.08))
    y = int((resized.height - HEIGHT) * 0.48)
    return resized.crop((x, y, x + WIDTH, y + HEIGHT)).filter(ImageFilter.GaussianBlur(0.12))


def wrap(draw: ImageDraw.ImageDraw, text: str, font_obj: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textbbox((0, 0), trial, font=font_obj)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_progress(draw: ImageDraw.ImageDraw, active: int) -> None:
    x0 = 112
    y = 252
    for i in range(len(SCENES)):
        fill = PALETTE["gold"] + (255,) if i == active else PALETTE["white"] + (160,)
        outline = PALETTE["gold"] + (255,)
        x = x0 + i * 42
        draw.ellipse((x, y, x + 18, y + 18), fill=fill, outline=outline, width=2)


def draw_text_block(base: Image.Image, scene: dict[str, str], scene_index: int) -> Image.Image:
    draw = ImageDraw.Draw(base, "RGBA")
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 78))
    for side_x in (24, WIDTH - 30):
        draw.rectangle((side_x, 80, side_x + 6, HEIGHT - 80), fill=PALETTE["gold"] + (220,))

    kicker_font = font(32, bold=True)
    marker_font = font(26, bold=True)
    title_font = font(78 if scene_index else 86, bold=True, serif=True)
    body_font = font(40)
    cta_font = font(30, bold=True)

    draw.rounded_rectangle((84, 130, 372, 204), radius=36, fill=PALETTE["forest"] + (235,))
    draw.text((118, 151), scene["marker"], fill=PALETTE["white"] + (255,), font=marker_font)
    draw_progress(draw, scene_index)

    panel_top = 1010 if scene_index else 930
    draw.rounded_rectangle(
        (72, panel_top, WIDTH - 72, HEIGHT - 180),
        radius=24,
        fill=(245, 240, 232, 236),
        outline=PALETTE["gold"] + (230,),
        width=3,
    )

    y = panel_top + 58
    draw.text((112, y), scene["kicker"], fill=PALETTE["terracotta"] + (255,), font=kicker_font)
    y += 58
    draw.line((112, y, 326, y), fill=PALETTE["gold"] + (255,), width=5)
    y += 40

    for line in wrap(draw, scene["title"], title_font, WIDTH - 224):
        draw.text((112, y), line, fill=PALETTE["charcoal"] + (255,), font=title_font)
        y += 90
    y += 22
    for line in wrap(draw, scene["body"], body_font, WIDTH - 224):
        draw.text((112, y), line, fill=PALETTE["charcoal"] + (238,), font=body_font)
        y += 54

    if scene_index == len(SCENES) - 1:
        draw.rounded_rectangle((112, HEIGHT - 326, WIDTH - 112, HEIGHT - 242), radius=42, fill=PALETTE["olive"] + (255,))
        draw.text((154, HEIGHT - 300), "Link in bio | Kenya Honeymoon Safari", fill=PALETTE["white"] + (255,), font=cta_font)
    else:
        draw.text((112, HEIGHT - 286), "Swipe for the next Samburu icon", fill=PALETTE["white"] + (230,), font=cta_font)
    return base


def render_scene(scene: dict[str, str], index: int, progress: float = 0.0) -> Image.Image:
    return draw_text_block(cover_image(Path(scene["image"]), progress), scene, index)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    FRAMES.mkdir(parents=True, exist_ok=True)

    scene_frames = []
    for i, scene in enumerate(SCENES):
        frame = render_scene(scene, i, 0.25)
        frame_path = FRAMES / f"scene_{i + 1:02d}.jpg"
        frame.save(frame_path, quality=92)
        scene_frames.append(frame_path)

    cover = Image.open(scene_frames[0]).convert("RGB")
    cover.save(OUT / "simbali-day-02-cover.jpg", quality=94)

    mp4_path = OUT / "simbali-day-02-instagram-reel.mp4"
    frames_per_scene = FPS * SECONDS_PER_SCENE
    with imageio.get_writer(
        mp4_path,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=1,
        output_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    ) as writer:
        for frame_path in scene_frames:
            frame = np.asarray(Image.open(frame_path).convert("RGB"))
            for _ in range(frames_per_scene):
                writer.append_data(frame)

    print(mp4_path)


if __name__ == "__main__":
    main()
