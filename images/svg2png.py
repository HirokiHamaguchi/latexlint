import os

import cairosvg
from PIL import Image

os.chdir(os.path.dirname(os.path.abspath(__file__)))
cairosvg.svg2png(
    url="lintIconLight.svg",
    write_to="mainIcon512.png",
    output_width=512,
    output_height=512,
    background_color="white",
)

img = Image.open("mainIcon512.png")
img.thumbnail((128, 128))
img.save("mainIcon128.png")
