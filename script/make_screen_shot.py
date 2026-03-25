import time
from pathlib import Path

from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def make_screen_shot() -> None:
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--force-device-scale-factor=3")

    driver = webdriver.Chrome(options=options)  # type: ignore

    try:
        driver.set_window_size(1300, 700)
        driver.get("https://hirokihamaguchi.github.io/latexlint/")
        driver.execute_script("""
            const style = document.createElement('style');
            style.innerHTML = `
                ::-webkit-scrollbar { display: none; }
                body { overflow: hidden !important; }
                html { overflow: hidden !important; }
            `;
            document.head.appendChild(style);
        """)
        time.sleep(5)
        output_path = (
            Path(__file__).resolve().parents[1] / "images" / "abstract_web.png"
        )
        driver.save_screenshot(str(output_path))
    finally:
        driver.quit()


if __name__ == "__main__":
    make_screen_shot()
