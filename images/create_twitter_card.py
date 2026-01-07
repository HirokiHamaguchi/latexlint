import os

from PIL import Image, ImageDraw, ImageFont

os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Twitter用の画像サイズ
width = 1200
height = 628

# 白背景の画像を作成
img = Image.new("RGB", (width, height), color="white")

# 既存のPNGアイコンを読み込んで左端に配置
svg_size = 400
icon = Image.open("mainIcon512.png").resize(
    (svg_size, svg_size), Image.Resampling.LANCZOS
)
# 左端に配置
icon_x = 80
icon_y = (height - svg_size) // 2
img.paste(icon, (icon_x, icon_y), icon if icon.mode == "RGBA" else None)

# テキストを描画
draw = ImageDraw.Draw(img)

font_size = 180
font = ImageFont.truetype("times.ttf", font_size)

# テキストの位置を計算
text_x = icon_x + svg_size + 100  # アイコンの右側に余白を持たせる
text_y_base = height // 2  # 2行分の高さを考慮して中央配置

# "LaTeX"を描画
text_latex = "LaTeX"
draw.text(
    (text_x, text_y_base - font_size * 1.0),
    text_latex,
    fill="#333333",
    font=font,
)

# "Lint"を描画
text_lint = "Lint"
draw.text((text_x, text_y_base - font_size * 0.1), text_lint, fill="#333333", font=font)

# 画像を保存
img.save("twitter_card.png")

print("Twitter card image created: twitter_card.png")
