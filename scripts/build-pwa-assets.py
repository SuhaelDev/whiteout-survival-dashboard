#!/usr/bin/env python3
"""Generate the PWA icon set and iOS launch images.

Everything here is derived from the existing brand marks so the installed app
matches the sidebar: the amber "W" (assets/favicon.svg) on the sidebar navy
(#17202a), over the app background (#0b111e).

Run from the repo root:  python3 scripts/build-pwa-assets.py
"""

from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

FONT_BOLD = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
FONT_MEDIUM = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"


def _font(path: str, size: float) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, int(size))
    except OSError:
        return ImageFont.load_default()


def _centre_text(draw, cx, top, text, font, fill) -> None:
    left, upper, right, _ = draw.textbbox((0, 0), text, font=font)
    draw.text((cx - (right - left) / 2 - left, top - upper), text, font=font, fill=fill)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ICON_DIR = os.path.join(ROOT, "assets", "icons")
SPLASH_DIR = os.path.join(ROOT, "assets", "splash")

NAVY = (23, 32, 42)          # #17202a - sidebar
BG = (11, 17, 30)            # #0b111e - app background
AMBER = (242, 178, 92)       # #f2b25c - brand mark
BLUE = (56, 189, 248)        # #38bdf8 - accent

# The "W" path from assets/favicon.svg, in its native 64x64 viewBox.
W_PATH = [
    (14, 18), (21, 18), (26, 41), (32, 18), (39, 18),
    (45, 41), (50, 18), (57, 18), (45, 50), (38, 50),
    (32, 28), (26, 50), (19, 50),
]

SS = 4  # supersample factor for smooth edges


def _frost_backdrop(size: int) -> Image.Image:
    """Vertical navy gradient with a soft cyan glow, like the dashboard hero."""
    img = Image.new("RGB", (size, size), NAVY)
    draw = ImageDraw.Draw(img)
    top = (26, 37, 50)
    bottom = (14, 20, 28)
    for y in range(size):
        t = y / max(1, size - 1)
        draw.line(
            [(0, y), (size, y)],
            fill=tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)),
        )

    # Soft cyan bloom in the upper left, blurred so it reads as light not a shape.
    glow = Image.new("L", (size, size), 0)
    ImageDraw.Draw(glow).ellipse(
        [-size * 0.35, -size * 0.45, size * 0.75, size * 0.55], fill=90
    )
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.18))
    img = Image.composite(Image.new("RGB", (size, size), BLUE), img, glow)
    return img


def _draw_w(img: Image.Image, box: tuple[float, float, float, float]) -> None:
    """Draw the brand W scaled into box = (x, y, w, h), supersampled."""
    x, y, w, h = box
    layer = Image.new("RGBA", (int(w * SS), int(h * SS)), (0, 0, 0, 0))
    pts = [(px / 64 * w * SS, py / 64 * h * SS) for px, py in W_PATH]
    ImageDraw.Draw(layer).polygon(pts, fill=AMBER + (255,))
    layer = layer.resize((int(w), int(h)), Image.LANCZOS)
    img.paste(layer, (int(x), int(y)), layer)


def make_icon(size: int, maskable: bool = False) -> Image.Image:
    """Square app icon. Maskable keeps the mark inside the 80% safe zone."""
    big = size * SS
    img = _frost_backdrop(big)

    if not maskable:
        # Rounded-square plate for contexts that don't mask (Android legacy, favicons).
        mask = Image.new("L", (big, big), 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            [0, 0, big - 1, big - 1], radius=int(big * 0.22), fill=255
        )
        plate = Image.new("RGB", (big, big), BG)
        img = Image.composite(img, plate, mask)

    # Safe zone: maskable icons may be cropped to a circle of 80% diameter.
    scale = 0.52 if maskable else 0.66
    w = big * scale
    h = w
    _draw_w(img, ((big - w) / 2, (big - h) / 2 * 1.02, w, h))

    if not maskable:
        # Hairline rim so the icon has an edge on light home screens.
        rim = Image.new("RGBA", (big, big), (0, 0, 0, 0))
        ImageDraw.Draw(rim).rounded_rectangle(
            [1, 1, big - 2, big - 2],
            radius=int(big * 0.22),
            outline=(255, 255, 255, 26),
            width=max(2, int(big * 0.006)),
        )
        img = Image.alpha_composite(img.convert("RGBA"), rim).convert("RGB")

    return img.resize((size, size), Image.LANCZOS)


def make_apple_touch(size: int = 180) -> Image.Image:
    """iOS masks and adds its own gloss, so: full bleed, no transparency, no rounding."""
    big = size * SS
    img = _frost_backdrop(big)
    w = big * 0.58
    _draw_w(img, ((big - w) / 2, (big - w) / 2 * 1.02, w, w))
    return img.resize((size, size), Image.LANCZOS)


def make_splash(w: int, h: int) -> Image.Image:
    """Launch image: app background, centred mark, quiet wordmark underneath."""
    img = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(img)

    short = min(w, h)
    # Radial vignette toward the app blue, echoing the hero band.
    glow = Image.new("L", (w, h), 0)
    r = short * 0.75
    ImageDraw.Draw(glow).ellipse(
        [w / 2 - r, h / 2 - r * 0.9, w / 2 + r, h / 2 + r * 0.9], fill=42
    )
    glow = glow.filter(ImageFilter.GaussianBlur(short * 0.16))
    img = Image.composite(Image.new("RGB", (w, h), (16, 42, 66)), img, glow)

    # Rounded plate + mark, sized off the short edge so landscape matches portrait.
    plate = int(short * 0.24)
    px, py = (w - plate) / 2, (h - plate) / 2 - short * 0.045
    plate_img = Image.new("RGBA", (plate * SS, plate * SS), (0, 0, 0, 0))
    ImageDraw.Draw(plate_img).rounded_rectangle(
        [0, 0, plate * SS - 1, plate * SS - 1],
        radius=int(plate * SS * 0.24),
        fill=NAVY + (255,),
        outline=(255, 255, 255, 20),
        width=max(2, int(plate * SS * 0.008)),
    )
    plate_img = plate_img.resize((plate, plate), Image.LANCZOS)
    img.paste(plate_img, (int(px), int(py)), plate_img)
    mark = plate * 0.62
    _draw_w(img, (px + (plate - mark) / 2, py + (plate - mark) / 2 * 1.02, mark, mark))

    draw = ImageDraw.Draw(img)
    title_y = py + plate + short * 0.055
    title = _font(FONT_BOLD, short * 0.062)
    sub = _font(FONT_MEDIUM, short * 0.030)
    _centre_text(draw, w / 2, title_y, "Whiteout Tracker", title, (226, 236, 246))
    _centre_text(
        draw,
        w / 2,
        title_y + short * 0.088,
        "Plan your next upgrade",
        sub,
        (118, 138, 162),
    )
    return img


# Portrait CSS points + device-pixel-ratio for every iOS device we ship a launch
# image for. Landscape files are generated by swapping the dimensions, because
# Safari picks a startup image by exact media query and falls back to a blank
# screen when nothing matches.
DEVICES = [
    (320, 568, 2, "iPhone SE 1 / 5s"),
    (375, 667, 2, "iPhone 6-8 / SE 2-3"),
    (414, 736, 3, "iPhone 6-8 Plus"),
    (375, 812, 3, "iPhone X / XS / 11 Pro"),
    (360, 780, 3, "iPhone 12-13 mini"),
    (414, 896, 2, "iPhone XR / 11"),
    (414, 896, 3, "iPhone XS Max / 11 Pro Max"),
    (390, 844, 3, "iPhone 12 / 13 / 14"),
    (393, 852, 3, "iPhone 14 Pro / 15 / 16"),
    (402, 874, 3, "iPhone 16 Pro"),
    (428, 926, 3, "iPhone 12-13 Pro Max / 14 Plus"),
    (430, 932, 3, "iPhone 14 Pro Max / 15 Plus / 16 Plus"),
    (440, 956, 3, "iPhone 16 Pro Max"),
    (768, 1024, 2, "iPad 9.7 / mini"),
    (810, 1080, 2, 'iPad 10.2"'),
    (820, 1180, 2, 'iPad Air 10.9"'),
    (834, 1112, 2, 'iPad Pro 10.5"'),
    (834, 1194, 2, 'iPad Pro 11"'),
    (1024, 1366, 2, 'iPad Pro 12.9"'),
]


def splash_link_tags() -> str:
    """Emit the <link rel="apple-touch-startup-image"> block for index.html."""
    lines = []
    for pw, ph, dpr, label in DEVICES:
        for orientation, (w, h) in (
            ("portrait", (pw * dpr, ph * dpr)),
            ("landscape", (ph * dpr, pw * dpr)),
        ):
            media = (
                f"(device-width: {pw}px) and (device-height: {ph}px) "
                f"and (-webkit-device-pixel-ratio: {dpr}) "
                f"and (orientation: {orientation})"
            )
            lines.append(
                f'    <link rel="apple-touch-startup-image" '
                f'media="{media}" href="/assets/splash/splash-{w}x{h}.png" />'
            )
        lines[-2] = lines[-2].replace("<link", f"<!-- {label} -->\n    <link", 1)
    return "\n".join(lines)


def main() -> None:
    os.makedirs(ICON_DIR, exist_ok=True)
    os.makedirs(SPLASH_DIR, exist_ok=True)

    for size in (192, 256, 384, 512):
        make_icon(size).save(os.path.join(ICON_DIR, f"icon-{size}.png"), optimize=True)
    for size in (192, 512):
        make_icon(size, maskable=True).save(
            os.path.join(ICON_DIR, f"maskable-{size}.png"), optimize=True
        )
    make_apple_touch(180).save(
        os.path.join(ICON_DIR, "apple-touch-icon.png"), optimize=True
    )
    make_icon(96).save(os.path.join(ICON_DIR, "shortcut-96.png"), optimize=True)

    for pw, ph, dpr, _label in DEVICES:
        w, h = pw * dpr, ph * dpr
        make_splash(w, h).save(
            os.path.join(SPLASH_DIR, f"splash-{w}x{h}.png"), optimize=True
        )
        make_splash(h, w).save(
            os.path.join(SPLASH_DIR, f"splash-{h}x{w}.png"), optimize=True
        )

    with open(os.path.join(ROOT, "scripts", "splash-links.html"), "w") as fh:
        fh.write(splash_link_tags() + "\n")

    total = sum(
        os.path.getsize(os.path.join(d, f))
        for d in (ICON_DIR, SPLASH_DIR)
        for f in os.listdir(d)
    )
    print(f"wrote {len(os.listdir(ICON_DIR))} icons, {len(os.listdir(SPLASH_DIR))} splash images")
    print(f"total {total / 1024:.0f} KB")


if __name__ == "__main__":
    main()
