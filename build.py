from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
DIST = ROOT / "dist"

components = {
    "{{HEADER}}": SRC / "components" / "header.html",
    "{{HERO}}": SRC / "components" / "hero.html",
    "{{SERVICES}}": SRC / "components" / "services.html",
    "{{FEATURES}}": SRC / "components" / "features.html",
    "{{FAQ}}": SRC / "components" / "faq.html",
    "{{FOOTER}}": SRC / "components" / "footer.html",
    "{{AUTH_MODAL}}": SRC / "components" / "auth-modal.html",
}

html = (SRC / "index.template.html").read_text(encoding="utf-8")
for placeholder, path in components.items():
    html = html.replace(placeholder, path.read_text(encoding="utf-8"))

account_html = (SRC / "myaccount.template.html").read_text(encoding="utf-8")
for placeholder, path in components.items():
    if placeholder in account_html:
        account_html = account_html.replace(placeholder, path.read_text(encoding="utf-8"))

loyalty_html = (SRC / "loyalty.template.html").read_text(encoding="utf-8")
for placeholder, path in components.items():
    if placeholder in loyalty_html:
        loyalty_html = loyalty_html.replace(placeholder, path.read_text(encoding="utf-8"))
service_html = (SRC / "service.template.html").read_text(encoding="utf-8")
for placeholder, path in components.items():
    if placeholder in service_html:
        service_html = service_html.replace(placeholder, path.read_text(encoding="utf-8"))

shop_html = (SRC / "shop.template.html").read_text(encoding="utf-8")
for placeholder, path in components.items():
    if placeholder in shop_html:
        shop_html = shop_html.replace(placeholder, path.read_text(encoding="utf-8"))

recharge_html = (SRC / "recharge-detail.template.html").read_text(encoding="utf-8")
for placeholder, path in components.items():
    if placeholder in recharge_html:
        recharge_html = recharge_html.replace(placeholder, path.read_text(encoding="utf-8"))

support_html = (SRC / "support.template.html").read_text(encoding="utf-8")
for placeholder, path in components.items():
    if placeholder in support_html:
        support_html = support_html.replace(placeholder, path.read_text(encoding="utf-8"))

cms_html = (SRC / "cms.template.html").read_text(encoding="utf-8")
for placeholder, path in components.items():
    if placeholder in cms_html:
        cms_html = cms_html.replace(placeholder, path.read_text(encoding="utf-8"))
        
DIST.mkdir(exist_ok=True)
(DIST / "styles").mkdir(exist_ok=True)
(DIST / "scripts").mkdir(exist_ok=True)

for asset_dir in ["icon", "thumbnail"]:
    src_asset = SRC / asset_dir
    dist_asset = DIST / asset_dir
    if src_asset.exists():
        if dist_asset.exists():
            shutil.rmtree(dist_asset)
        shutil.copytree(src_asset, dist_asset)

shutil.copy2(SRC / "styles" / "main.css", DIST / "styles" / "main.css")
shutil.copy2(SRC / "scripts" / "app.js", DIST / "scripts" / "app.js")
(DIST / "MyVTC_Home.html").write_text(html, encoding="utf-8")
(DIST / "MyAccount.html").write_text(account_html, encoding="utf-8")
(DIST / "Loyalty.html").write_text(loyalty_html, encoding="utf-8")
(DIST / "Service.html").write_text(service_html, encoding="utf-8")
(DIST / "Shop.html").write_text(shop_html, encoding="utf-8")
(DIST / "RechargeDetail.html").write_text(recharge_html, encoding="utf-8")
(DIST / "Support.html").write_text(support_html, encoding="utf-8")
(DIST / "CMS.html").write_text(cms_html, encoding="utf-8")

print("Đã build xong: dist/MyVTC_Home.html")
print("Đã build xong: dist/MyAccount.html")
print("Đã build xong: dist/Loyalty.html")
print("Đã build xong: dist/Service.html")
print("Đã build xong: dist/Shop.html")
print("Đã build xong: dist/RechargeDetail.html")
print("Đã build xong: dist/Support.html")
print("Đã build xong: dist/CMS.html")
