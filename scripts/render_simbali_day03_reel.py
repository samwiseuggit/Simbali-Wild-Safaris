from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "automation_outputs" / "2026-07-12_day_03"
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
        "image": ROOT / "public/images/african-elephant-savanna-simbali-wild-safaris.jpg",
        "kicker": "SIMBALI WILD SAFARIS",
        "title": "5 Amazing Facts About Amboseli's Elephants",
        "body": "Home to Africa's most studied elephant herds.",
        "marker": "1 of 6",
    },
    {
        "image": ROOT / "public/images/elephant-herd-waterhole-safari-simbali-wild-safaris.jpg",
        "kicker": "FACT 1",
        "title": "Over 1,600 elephants",
        "body": "Amboseli's ecosystem supports one of Africa's largest free-roaming elephant populations.",
        "marker": "2 of 6",
    },
    {
        "image": ROOT / "public/images/african-elephant-waterhole-safari-simbali-wild-safaris_Slid_1.jpg",
        "kicker": "FACT 2",
        "title": "50+ years of research",
        "body": "The Amboseli Elephant Research Project has followed elephant families since 1972.",
        "marker": "3 of 6",
    },
    {
        "image": ROOT / "public/images/elephant-herd-waterhole-safari-simbali-wild-safaris_About.jpg",
        "kicker": "FACT 3",
        "title": "The famous red elephants",
        "body": "Iron-rich dust coats their skin as natural sunscreen and insect protection.",
        "marker": "4 of 6",
    },
    {
        "image": ROOT / "public/images/safari-road-giraffes-simbali-wild-safaris.jpg",
        "kicker": "FACT 4",
        "title": "Kilimanjaro feeds the swamps",
        "body": "Underground meltwater creates a permanent oasis in a dry savannah landscape.",
        "marker": "5 of 6",
    },
    {
        "image": ROOT / "public/images/itin-kenya-family.jpg",
        "kicker": "FACT 5",
        "title": "Some of Africa's last big tuskers",
        "body": "See Amboseli on our Kenya Family Safari at https://simbaliwildsafaris.com",
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
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 84))
    draw.rectangle((0, 0, WIDTH, 18), fill=PALETTE["gold"] + (255,))
    draw.rectangle((0, HEIGHT - 18, WIDTH, HEIGHT), fill=PALETTE["gold"] + (255,))
    for side_x in (30, WIDTH - 36):
        draw.rectangle((side_x, 90, side_x + 6, HEIGHT - 90), fill=PALETTE["gold"] + (210,))

    kicker_font = font(32, bold=True)
    marker_font = font(26, bold=True)
    title_font = font(76 if scene_index else 84, bold=True, serif=True)
    body_font = font(39)
    cta_font = font(29, bold=True)

    draw.rounded_rectangle((84, 132, 372, 206), radius=36, fill=PALETTE["forest"] + (235,))
    draw.text((118, 153), scene["marker"], fill=PALETTE["white"] + (255,), font=marker_font)
    draw_progress(draw, scene_index)

    panel_top = 982 if scene_index else 884
    draw.rounded_rectangle(
        (72, panel_top, WIDTH - 72, HEIGHT - 178),
        radius=24,
        fill=(245, 240, 232, 238),
        outline=PALETTE["gold"] + (235,),
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
        draw.rounded_rectangle((112, HEIGHT - 330, WIDTH - 112, HEIGHT - 244), radius=42, fill=PALETTE["olive"] + (255,))
        draw.text((154, HEIGHT - 303), "Love elephants? Explore Amboseli.", fill=PALETTE["white"] + (255,), font=cta_font)
    else:
        draw.text((112, HEIGHT - 292), "Rate your elephant love in Stories", fill=PALETTE["white"] + (230,), font=cta_font)
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
    cover.save(OUT / "simbali-day-03-cover.jpg", quality=94)

    mp4_path = OUT / "simbali-day-03-instagram-reel.mp4"
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
