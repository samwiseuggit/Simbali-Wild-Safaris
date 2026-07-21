from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "automation_outputs" / "2026-07-21_day_12"
FRAMES = OUT / "slideshow_frames"
WIDTH, HEIGHT = 1080, 1920
FPS = 30
SECONDS_PER_SCENE = 4

PALETTE = {
    "black": (26, 26, 26),
    "olive": (122, 139, 58),
    "gold": (244, 166, 35),
    "cream": (245, 240, 232),
    "white": (255, 255, 255),
    "muted": (214, 210, 199),
}

SCENES = [
    {
        "image": ROOT / "public/images/lions-safari-vehicle-simbali-wild-safaris.jpg",
        "kicker": "SIMBALI WILD SAFARIS",
        "title": "5 Camera Settings",
        "value": "for Perfect Safari Shots",
        "body": "Pro tips from 12+ years in the bush",
        "indicator": "1/7",
    },
    {
        "image": ROOT / "public/images/safari-rally-car-simbali-wild-safaris.jpg",
        "kicker": "SETTING 1",
        "title": "Shutter Speed",
        "value": "1/1000s",
        "body": "Freeze walking wildlife. For running animals or birds, bump to 1/2000s or faster.",
        "indicator": "2/7",
    },
    {
        "image": ROOT / "public/images/lioness-service.jpg",
        "kicker": "SETTING 2",
        "title": "Aperture",
        "value": "f/5.6",
        "body": "The safari portrait sweet spot: background blur with enough depth to keep the animal sharp.",
        "indicator": "3/7",
    },
    {
        "image": ROOT / "public/images/african-elephant-savanna-simbali-wild-safaris.jpg",
        "kicker": "SETTING 3",
        "title": "ISO",
        "value": "400-800",
        "body": "Start here in daylight. A sharp high-ISO photo beats a clean but blurry one.",
        "indicator": "4/7",
    },
    {
        "image": ROOT / "public/images/raptor-bird-flying-clear-sky_blog.jpg",
        "kicker": "SETTING 4",
        "title": "Autofocus Mode",
        "value": "AF-C / AI Servo",
        "body": "Continuous autofocus tracks movement. Pair with zone AF or animal eye detection.",
        "indicator": "5/7",
    },
    {
        "image": ROOT / "public/images/open-jeep-game-drive-simbali-wild-safaris.jpg",
        "kicker": "SETTING 5",
        "title": "File Format",
        "value": "RAW",
        "body": "RAW gives you more room to recover shadows, highlights, and golden-hour color.",
        "indicator": "6/7",
    },
    {
        "image": ROOT / "public/images/baobab-sunset-safari-simbali-wild-safaris.jpg",
        "kicker": "QUIZ + CTA",
        "title": "Best Aperture?",
        "value": "f/5.6",
        "body": "Ready to test your skills on safari? Explore https://simbaliwildsafaris.com",
        "indicator": "7/7",
    },
]


def font(size: int, bold: bool = False, mono: bool = False) -> ImageFont.FreeTypeFont:
    candidates = []
    if mono:
        candidates += ["C:/Windows/Fonts/consolab.ttf" if bold else "C:/Windows/Fonts/consola.ttf"]
    candidates += [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/calibrib.ttf" if bold else "C:/Windows/Fonts/calibri.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size=size)
    return ImageFont.load_default()


def crop_cover(path: Path, progress: float) -> Image.Image:
    img = Image.open(path).convert("RGB")
    img = ImageEnhance.Color(img).enhance(0.9)
    scale = max(WIDTH / img.width, HEIGHT / img.height) * (1.03 + progress * 0.035)
    resized = img.resize((math.ceil(img.width * scale), math.ceil(img.height * scale)), Image.LANCZOS)
    x = int((resized.width - WIDTH) * 0.5)
    y = int((resized.height - HEIGHT) * (0.48 + (progress - 0.5) * 0.04))
    return resized.crop((x, y, x + WIDTH, y + HEIGHT)).filter(ImageFilter.GaussianBlur(0.2))


def wrap(draw: ImageDraw.ImageDraw, text: str, font_obj: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for word in text.split():
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


def draw_viewfinder(draw: ImageDraw.ImageDraw) -> None:
    line = PALETTE["white"] + (38,)
    for x in (WIDTH // 3, 2 * WIDTH // 3):
        draw.line((x, 220, x, HEIGHT - 220), fill=line, width=2)
    for y in (HEIGHT // 3, 2 * HEIGHT // 3):
        draw.line((90, y, WIDTH - 90, y), fill=line, width=2)
    corner = PALETTE["gold"] + (210,)
    for x1, y1, sx, sy in ((90, 190, 1, 1), (990, 190, -1, 1), (90, 1730, 1, -1), (990, 1730, -1, -1)):
        draw.line((x1, y1, x1 + sx * 110, y1), fill=corner, width=5)
        draw.line((x1, y1, x1, y1 + sy * 110), fill=corner, width=5)


def draw_scene(base: Image.Image, scene: dict[str, str], index: int) -> Image.Image:
    draw = ImageDraw.Draw(base, "RGBA")
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 128 if index else 118))
    draw_viewfinder(draw)

    safe_left, safe_right = 96, WIDTH - 96
    draw.text((safe_left, 112), scene["kicker"], fill=PALETTE["olive"] + (255,), font=font(34, True))
    draw.text((safe_right - 64, 112), scene["indicator"], fill=PALETTE["muted"] + (240,), font=font(28, True), anchor="ra")

    title_font = font(76 if index else 86, True)
    value_font = font(84 if len(scene["value"]) < 12 else 58, True, mono=True)
    body_font = font(36)

    y = 520 if index else 610
    for line in wrap(draw, scene["title"].upper(), title_font, WIDTH - 192):
        draw.text((safe_left, y), line, fill=PALETTE["white"] + (255,), font=title_font)
        y += 92

    y += 28
    value_box = (safe_left, y, safe_right, y + 126)
    draw.rounded_rectangle(value_box, radius=20, fill=(26, 26, 26, 210), outline=PALETTE["gold"] + (255,), width=4)
    draw.text((WIDTH // 2, y + 64), scene["value"], fill=PALETTE["gold"] + (255,), font=value_font, anchor="mm")

    y += 174
    for line in wrap(draw, scene["body"], body_font, WIDTH - 192):
        draw.text((safe_left, y), line, fill=PALETTE["cream"] + (245,), font=body_font)
        y += 50

    if index == len(SCENES) - 1:
        quiz_top = 1330
        draw.rounded_rectangle((safe_left, quiz_top, safe_right, quiz_top + 286), radius=24, fill=(245, 240, 232, 232))
        draw.text((safe_left + 38, quiz_top + 34), "Quiz: best aperture for a single wildlife portrait?", fill=PALETTE["black"] + (255,), font=font(31, True))
        options = [("A", "f/2.8"), ("B", "f/5.6"), ("C", "f/11")]
        for n, (letter, text) in enumerate(options):
            top = quiz_top + 92 + n * 58
            color = PALETTE["olive"] if letter == "B" else PALETTE["black"]
            draw.text((safe_left + 48, top), f"{letter}. {text}", fill=color + (255,), font=font(34, True))

    draw.text((safe_left, HEIGHT - 118), "SIMBALI WILD SAFARIS", fill=PALETTE["muted"] + (230,), font=font(26, True))
    return base


def render_scene(scene: dict[str, str], index: int, progress: float = 0.0) -> Image.Image:
    return draw_scene(crop_cover(Path(scene["image"]), progress), scene, index)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    FRAMES.mkdir(parents=True, exist_ok=True)

    frame_paths = []
    for i, scene in enumerate(SCENES):
        frame = render_scene(scene, i, 0.25)
        path = FRAMES / f"scene_{i + 1:02d}.jpg"
        frame.save(path, quality=93)
        frame_paths.append(path)

    Image.open(frame_paths[0]).convert("RGB").save(OUT / "simbali-day-12-cover.jpg", quality=94)

    mp4_path = OUT / "simbali-day-12-instagram-reel.mp4"
    frames_per_scene = FPS * SECONDS_PER_SCENE
    with imageio.get_writer(
        mp4_path,
        fps=FPS,
        codec="libx264",
        quality=8,
        macro_block_size=1,
        output_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    ) as writer:
        for frame_path in frame_paths:
            still = np.asarray(Image.open(frame_path).convert("RGB"))
            for _ in range(frames_per_scene):
                writer.append_data(still)

    print(mp4_path)


if __name__ == "__main__":
    main()
