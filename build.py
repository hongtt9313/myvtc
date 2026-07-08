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

pages = {
    "index.template.html": "MyVTC_Home.html",
    "demo-selector.template.html": "index.html",
    "myaccount.template.html": "MyAccount.html",
    "loyalty.template.html": "Loyalty.html",
    "service.template.html": "Service.html",
    "shop.template.html": "Shop.html",
    "recharge-detail.template.html": "RechargeDetail.html",
    "support.template.html": "Support.html",
    "cms.template.html": "CMS.html",
    "mobile-app.template.html": "MobileApp.html",
    "billings-report.template.html": "BillingsReport.html",
    "sdk.template.html": "SDK.html",
}


def render_template(template_path: Path) -> str:
    html = template_path.read_text(encoding="utf-8")
    for placeholder, component_path in components.items():
        if placeholder in html:
            if component_path.exists():
                html = html.replace(placeholder, component_path.read_text(encoding="utf-8"))
            else:
                html = html.replace(placeholder, "")
                print(f"Cảnh báo: thiếu component {component_path}")
    return html


def copy_folder_if_exists(folder_name: str) -> None:
    src_folder = SRC / folder_name
    dist_folder = DIST / folder_name
    if not src_folder.exists():
        print(f"Bỏ qua: không có thư mục src/{folder_name}")
        return
    if dist_folder.exists():
        shutil.rmtree(dist_folder)
    shutil.copytree(src_folder, dist_folder)


def copy_files_if_exists(folder_name: str, pattern: str) -> None:
    src_folder = SRC / folder_name
    dist_folder = DIST / folder_name
    dist_folder.mkdir(parents=True, exist_ok=True)
    if not src_folder.exists():
        print(f"Bỏ qua: không có thư mục src/{folder_name}")
        return
    for item in src_folder.glob(pattern):
        shutil.copy2(item, dist_folder / item.name)


DIST.mkdir(exist_ok=True)
(DIST / "styles").mkdir(exist_ok=True)
(DIST / "scripts").mkdir(exist_ok=True)

copy_folder_if_exists("icon")
copy_folder_if_exists("thumbnail")
copy_files_if_exists("styles", "*.css")
copy_files_if_exists("scripts", "*.js")

for template_name, output_name in pages.items():
    template_path = SRC / template_name
    if not template_path.exists():
        print(f"Bỏ qua: không có {template_path}")
        continue
    output_path = DIST / output_name
    output_path.write_text(render_template(template_path), encoding="utf-8")
    print(f"Đã build xong: dist/{output_name}")

required_pages = [
    "index.html",
    "MyVTC_Home.html",
    "MobileApp.html",
    "CMS.html",
    "MyAccount.html",
    "Loyalty.html",
    "Service.html",
    "Shop.html",
    "RechargeDetail.html",
    "Support.html",
]

missing_pages = [page for page in required_pages if not (DIST / page).exists()]
if missing_pages:
    raise FileNotFoundError("Build thiếu file bắt buộc trong dist: " + ", ".join(missing_pages))
