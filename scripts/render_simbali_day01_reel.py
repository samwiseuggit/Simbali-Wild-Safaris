from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "automation_outputs" / "2026-07-10_day_01"
FRAMES = OUT / "slideshow_frames"
WIDTH, HEIGHT = 1080, 1920
FPS = 30
SECONDS_PER_SCENE = 4

PALETTE = {
    "cream": (245, 240, 232),
    "olive": (61, 74, 44),
    "gold": (201, 162, 39),
    "charcoal": (44, 44, 44),
    "white": (255, 255, 255),
}

SCENES = [
    {
        "image": ROOT / "public/images/open-jeep-game-drive-simbali-wild-safaris.jpg",
        "kicker": "SIMBALI WILD SAFARIS",
        "title": "5 Signs You're Ready for an African Safari",
        "body": "How many can you check off?",
    },
    {
        "image": ROOT / "public/images/lions-safari-vehicle-simbali-wild-safaris.jpg",
        "kicker": "SIGN 1",
        "title": "Your camera roll is full of wildlife documentaries",
        "body": "You can name every Big Five animal and their habits.",
    },
    {
        "image": ROOT / "public/images/safari-road-giraffes-simbali-wild-safaris.jpg",
        "kicker": "SIGN 2",
        "title": "Your feed is basically a virtual safari",
        "body": "Safari accounts, lodge views, golden plains. Research mode is on.",
    },
    {
        "image": ROOT / "public/images/baobab-sunset-safari-simbali-wild-safaris.jpg",
        "kicker": "SIGNS 3 + 4",
        "title": "You've Googled the Serengeti and started a safari fund",
        "body": "Curiosity plus commitment is a powerful planning signal.",
    },
    {
        "image": ROOT / "public/images/wildebeest-river-crossing-simbali-wild-safaris.jpg",
        "kicker": "SIGN 5",
        "title": "The words Great Migration give you chills",
        "body": "If the Mara River makes your heart race, you are ready.",
    },
    {
        "image": ROOT / "public/images/african-elephant-savanna-simbali-wild-safaris.jpg",
        "kicker": "IF YOU CHECKED 3 OR MORE",
        "title": "It's time to start planning",
        "body": "Explore tailor-made safaris at https://simbaliwildsafaris.com",
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
    scale = max(WIDTH / img.width, HEIGHT / img.height) * (1.04 + progress * 0.04)
    resized = img.resize((math.ceil(img.width * scale), math.ceil(img.height * scale)), Image.LANCZOS)
    x = int((resized.width - WIDTH) * (0.5 + (progress - 0.5) * 0.08))
    y = int((resized.height - HEIGHT) * 0.5)
    return resized.crop((x, y, x + WIDTH, y + HEIGHT)).filter(ImageFilter.GaussianBlur(0.15))


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


def draw_text_block(base: Image.Image, scene: dict[str, str], scene_index: int) -> Image.Image:
    draw = ImageDraw.Draw(base, "RGBA")
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 88))
    draw.rectangle((0, 0, WIDTH, 16), fill=PALETTE["gold"] + (255,))
    draw.rectangle((0, HEIGHT - 16, WIDTH, HEIGHT), fill=PALETTE["gold"] + (255,))

    card_top = 980 if scene_index else 890
    draw.rounded_rectangle(
        (72, card_top, WIDTH - 72, HEIGHT - 170),
        radius=28,
        fill=(245, 240, 232, 232),
        outline=PALETTE["gold"] + (210,),
        width=3,
    )

    kicker_font = font(34, bold=True)
    title_font = font(72 if scene_index else 80, bold=True, serif=True)
    body_font = font(38)
    small_font = font(28, bold=True)

    y = card_top + 62
    draw.text((112, y), scene["kicker"], fill=PALETTE["olive"] + (255,), font=kicker_font)
    y += 58
    draw.line((112, y, 300, y), fill=PALETTE["gold"] + (255,), width=5)
    y += 42

    for line in wrap(draw, scene["title"], title_font, WIDTH - 224):
        draw.text((112, y), line, fill=PALETTE["charcoal"] + (255,), font=title_font)
        y += 86
    y += 20
    for line in wrap(draw, scene["body"], body_font, WIDTH - 224):
        draw.text((112, y), line, fill=PALETTE["charcoal"] + (235,), font=body_font)
        y += 52

    if scene_index == len(SCENES) - 1:
        draw.rounded_rectangle((112, HEIGHT - 310, WIDTH - 112, HEIGHT - 230), radius=40, fill=PALETTE["olive"] + (255,))
        draw.text((156, HEIGHT - 288), "DM \"SAFARI\" for a free consultation", fill=PALETTE["white"] + (255,), font=small_font)
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
    cover.save(OUT / "simbali-day-01-cover.jpg", quality=94)

    mp4_path = OUT / "simbali-day-01-instagram-reel.mp4"
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
