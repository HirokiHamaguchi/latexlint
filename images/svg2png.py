import os

import cairosvg

os.chdir(os.path.dirname(os.path.abspath(__file__)))
cairosvg.svg2png(
    url="lintIconLight.svg",
    write_to="mainIcon512.png",
    output_width=512,
    output_height=512,
    background_color="white",
)
