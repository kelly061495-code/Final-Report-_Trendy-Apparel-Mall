"""
generate_screenshots.py — 自動截取操作手冊所需的 17 張截圖

使用方式 (請先確保前端服務已啟動):
    pip install playwright
    playwright install chromium
    python docs/generate_screenshots.py

    或指定不同的網址:
    python docs/generate_screenshots.py --url http://localhost:3000
"""

import argparse
import asyncio
import os
import sys
from pathlib import Path

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("ERROR: 需要安裝 playwright,請執行:")
    print("  pip install playwright && playwright install chromium")
    sys.exit(1)

OUT_DIR = Path(__file__).parent / "screenshots"


async def run(base_url: str):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await ctx.new_page()

        # 01 Home Hero
        await page.goto(base_url, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(2500)
        await page.screenshot(path=str(OUT_DIR / "01_home_hero.png"))
        print("✓ 01_home_hero.png")

        # 02 Hot Products
        await page.evaluate("document.querySelector('[data-testid=\"hot-section\"]').scrollIntoView({block:'start'})")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=str(OUT_DIR / "02_hot_products.png"))
        print("✓ 02_hot_products.png")

        # 03 Preorder Section
        await page.evaluate("document.querySelector('[data-testid=\"preorder-section\"]').scrollIntoView({block:'start'})")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=str(OUT_DIR / "03_preorder_section.png"))
        print("✓ 03_preorder_section.png")

        # 04 Shop All
        await page.evaluate("window.navigateTo('shop','all')")
        await page.wait_for_timeout(1500)
        await page.screenshot(path=str(OUT_DIR / "04_shop_all.png"))
        print("✓ 04_shop_all.png")

        # 05 Shop Jewelry
        await page.evaluate("window.navigateTo('shop','jewelry')")
        await page.wait_for_timeout(1500)
        await page.screenshot(path=str(OUT_DIR / "05_shop_jewelry.png"))
        print("✓ 05_shop_jewelry.png")

        # 06 Product Modal (cap)
        await page.evaluate("window.openProductModal('prod_003')")
        await page.wait_for_timeout(1500)
        await page.screenshot(path=str(OUT_DIR / "06_product_modal_cap.png"))
        print("✓ 06_product_modal_cap.png")
        await page.evaluate("window.closeProductModal()")
        await page.wait_for_timeout(400)

        # 07 Preorder Page
        await page.evaluate("window.navigateTo('preorder')")
        await page.wait_for_timeout(1500)
        await page.screenshot(path=str(OUT_DIR / "07_preorder_page.png"))
        print("✓ 07_preorder_page.png")

        # 08 Recommend Form
        await page.evaluate("window.openRecommendModal()")
        await page.wait_for_timeout(800)
        await page.fill('[data-testid="rec-height"]', '170')
        await page.fill('[data-testid="rec-weight"]', '65')
        await page.fill('[data-testid="rec-budget"]', '5000')
        await page.click('[data-testid="style-Techwear"]')
        await page.click('[data-testid="style-Street"]')
        await page.wait_for_timeout(500)
        await page.screenshot(path=str(OUT_DIR / "08_recommend_form.png"))
        print("✓ 08_recommend_form.png")

        # 09 Recommend Results
        await page.click('[data-testid="generate-recommendations"]')
        await page.wait_for_timeout(3000)
        await page.screenshot(path=str(OUT_DIR / "09_recommend_results.png"))
        print("✓ 09_recommend_results.png")
        await page.evaluate("window.closeRecommendModal()")
        await page.wait_for_timeout(400)

        # 加兩件商品到購物車
        await page.evaluate("window.openProductModal('prod_001')")
        await page.wait_for_timeout(800)
        await page.click('[data-testid="size-M"]')
        await page.click('[data-testid="add-to-cart-modal"]')
        await page.wait_for_timeout(600)
        await page.evaluate("window.openProductModal('prod_008')")
        await page.wait_for_timeout(800)
        await page.click('[data-testid="size-L"]')
        await page.click('[data-testid="add-to-cart-modal"]')
        await page.wait_for_timeout(600)

        # 10 Cart Drawer
        await page.click('[data-testid="cart-btn"]')
        await page.wait_for_timeout(1200)
        await page.screenshot(path=str(OUT_DIR / "10_cart_drawer.png"))
        print("✓ 10_cart_drawer.png")
        await page.click('[data-testid="close-cart"]')
        await page.wait_for_timeout(400)

        # 11 Register
        await page.click('[data-testid="auth-btn"]')
        await page.wait_for_timeout(500)
        await page.evaluate("window.switchToRegister()")
        await page.wait_for_timeout(400)
        await page.fill('[data-testid="register-name"]', '王小明')
        await page.fill('[data-testid="register-email"]', 'demo@trendy.com')
        await page.fill('[data-testid="register-password"]', 'pass123')
        await page.screenshot(path=str(OUT_DIR / "11_auth_register.png"))
        print("✓ 11_auth_register.png")
        await page.click('[data-testid="register-submit"]')
        await page.wait_for_timeout(1500)

        # 12 Checkout
        await page.click('[data-testid="cart-btn"]')
        await page.wait_for_timeout(800)
        await page.click('[data-testid="checkout-btn"]')
        await page.wait_for_timeout(1500)
        await page.screenshot(path=str(OUT_DIR / "12_checkout.png"))
        print("✓ 12_checkout.png")

        # 13 Discount applied
        await page.fill('[data-testid="discount-code"]', 'WELCOME10')
        await page.click('[data-testid="apply-discount"]')
        await page.wait_for_timeout(1200)
        await page.screenshot(path=str(OUT_DIR / "13_checkout_discount.png"))
        print("✓ 13_checkout_discount.png")

        # 14 Order Confirmed
        await page.fill('[data-testid="checkout-name"]', '王小明')
        await page.fill('[data-testid="checkout-phone"]', '0912345678')
        await page.fill('[data-testid="checkout-address"]', '台北市信義區松仁路 100 號')
        await page.fill('[data-testid="checkout-city"]', '台北市')
        await page.fill('[data-testid="checkout-postal"]', '11070')
        await page.click('[data-testid="submit-order"]')
        await page.wait_for_timeout(2000)
        await page.screenshot(path=str(OUT_DIR / "14_order_confirmed.png"))
        print("✓ 14_order_confirmed.png")

        # 15 Order History
        await page.evaluate("window.navigateTo('account')")
        await page.wait_for_timeout(1000)
        await page.click('[data-testid="tab-orders"]')
        await page.wait_for_timeout(1000)
        await page.screenshot(path=str(OUT_DIR / "15_order_history.png"))
        print("✓ 15_order_history.png")

        # 16 Footer FAQ Modal
        await page.evaluate("window.navigateTo('home')")
        await page.wait_for_timeout(1000)
        await page.evaluate("window.openInfoModal('faq')")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=str(OUT_DIR / "16_footer_faq.png"))
        print("✓ 16_footer_faq.png")

        # 17 Footer
        await page.evaluate("window.closeInfoModal(); window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path=str(OUT_DIR / "17_footer.png"))
        print("✓ 17_footer.png")

        await browser.close()
    print(f"\n全部 17 張截圖已存於 {OUT_DIR}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", default=os.environ.get("APP_URL", "http://localhost:3000"),
                        help="前端網址 (預設 http://localhost:3000)")
    args = parser.parse_args()
    asyncio.run(run(args.url))


if __name__ == "__main__":
    main()
