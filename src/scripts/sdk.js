/* SDK Demo JS: Splash, Đăng nhập, Đăng ký. Luồng bám theo Mobile App. */
(function () {
    var demoOtpCode = "123456";
    var currentScreen = "login-select";
    var screenHistory = [];
    var toastTimer = null;

    var sdkState = {
        layout: localStorage.getItem("myvtc_sdk_layout") || "portrait",
        loginIdentifier: "",
        loginOtpMethod: "sms",
        registerType: "phone",
        registerIdentifier: "",
        registerPassword: "",
        registerOtpMethod: "sms",
        otpRequestsCount: 0,
        otpWrongCount: 0,
        message: null,
        fieldErrors: {},
        recoveryAccount: null,
        recoveryOtpMethod: "sms",
        successMessage: "Đăng nhập thành công",
        isGuest: false
    };

    var currentUser = loadCurrentUser();

    var mockSavedLoginAccounts = [
        { id: "saved_acc_001", name: "Nguyễn Văn A", username: "0901231234", type: "phone", icon: "fa-user" },
        { id: "saved_acc_002", name: "Nguyễn Thu Trang", username: "trangt@vtc.vn", type: "email", icon: "fa-envelope" }
    ];

    var mockExistingUsers = [
        "0912345678", "0988888888", "0389954275", "vtc_test", "test@gmail.com",
        "hongtt@vtc.vn", "hon123", "embehp", "contact@gmail.com", "hong.tran",
        "0901234567", "0901231234", "trangt@vtc.vn", "vantuan"
    ];

    var mockDemoUsers = [
        { username: "0389954275", password: "Demo@123", name: "Nguyễn Văn A", phone: "0389954275", email: "thuyhong.vnt@gmail.com", rank: "Hạng Đồng" },
        { username: "0901234567", password: "Demo@123", name: "Trần Minh Anh", phone: "0901234567", email: "minhanh@vtc.vn", rank: "Hạng Bạc" },
        { username: "hong.tran", password: "Demo@123", name: "Hong Tran", phone: "0391234123", email: "hongtt@vtc.vn", rank: "Hạng Vàng" },
        { username: "hongtt@vtc.vn", password: "Demo@123", name: "Hong TT", phone: "0391234123", email: "hongtt@vtc.vn", rank: "Hạng Bạc" },
        { username: "0901231234", password: "Demo@123", name: "Nguyễn Văn A", phone: "0901231234", email: "vana@vtc.vn", rank: "Hạng Đồng" },
        { username: "trangt@vtc.vn", password: "Demo@123", name: "Nguyễn Thu Trang", phone: "0988888888", email: "trangt@vtc.vn", rank: "Hạng Bạc" }
    ];

    var socialLoginUsers = {
        myvtc: { username: "myvtc_link", name: "Tài khoản MyVTC", provider: "MyVTC", rank: "Hạng Đồng" },
        facebook: { username: "facebook_user", name: "Facebook User", email: "facebook.user@vtc.vn", provider: "Facebook", rank: "Hạng Đồng" },
        apple: { username: "apple_user", name: "Apple User", email: "apple.user@vtc.vn", provider: "Apple", rank: "Hạng Đồng" },
        google: { username: "google_user", name: "Google User", email: "google.user@vtc.vn", provider: "Google", rank: "Hạng Đồng" },
        quick: { username: "quick_login", name: "Nguyễn Văn A", phone: "0389954275", provider: "Đăng nhập nhanh", rank: "Hạng Đồng" }
    };

    var registerTypeConfig = {
        phone: { title: "Đăng ký bằng Số điện thoại", label: "Số điện thoại", inputMode: "tel", placeholder: "Nhập số điện thoại" },
        email: { title: "Đăng ký bằng Email", label: "Email", inputMode: "email", placeholder: "Nhập địa chỉ email" },
        username: { title: "Đăng ký bằng Tên tài khoản", label: "Tên tài khoản", inputMode: "text", placeholder: "Nhập tên tài khoản" }
    };

    var otpChannelLabels = {
        sms: "SMS",
        voice: "Voice",
        email: "Email",
        app: "OTP App"
    };

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        bindLayoutSwitch();
        applyLayout(sdkState.layout);
        showNativeScreen("splash");
        window.setTimeout(function () {
            showNativeScreen("auth");
            goTo("login-select", true);
        }, 750);
    }

    function bindLayoutSwitch() {
        document.querySelectorAll("[data-layout-btn]").forEach(function (button) {
            button.addEventListener("click", function () { applyLayout(button.dataset.layoutBtn); });
        });
    }

    function applyLayout(layout) {
        sdkState.layout = layout === "landscape" ? "landscape" : "portrait";
        localStorage.setItem("myvtc_sdk_layout", sdkState.layout);
        var frame = document.getElementById("sdkFrame");
        if (frame) {
            frame.classList.toggle("portrait", sdkState.layout === "portrait");
            frame.classList.toggle("landscape", sdkState.layout === "landscape");
            frame.dataset.layout = sdkState.layout;
        }
        document.querySelectorAll("[data-layout-btn]").forEach(function (button) {
            button.classList.toggle("active", button.dataset.layoutBtn === sdkState.layout);
        });
    }

    function showNativeScreen(screenName) {
        document.querySelectorAll(".sdk-screen").forEach(function (screen) {
            screen.classList.toggle("active", screen.dataset.nativeScreen === screenName);
        });
    }

    function goTo(screenName, resetHistory) {
        if (!resetHistory) screenHistory.push(currentScreen);
        if (resetHistory) screenHistory = [];
        currentScreen = screenName;
        clearErrors();
        render();
    }

    function goBack() {
        var previous = screenHistory.pop();
        if (previous) {
            currentScreen = previous;
            clearErrors();
            render();
            return;
        }
        goTo("login-select", true);
    }

    function render() {
        renderHeader();
        renderContent();
        bindDynamicEvents();
    }

    function renderHeader() {
        var header = document.getElementById("sdkHeader");
        if (!header) return;
        var meta = getScreenMeta(currentScreen);
        header.innerHTML = [
            '<div class="sdk-top-row">',
            '<button class="sdk-back-btn" type="button" data-action="back" ' + (meta.canBack ? "" : "disabled") + ' aria-label="Quay lại"><i class="fa fa-arrow-left"></i></button>',
            '<div class="sdk-title-group"><img class="sdk-title-logo" src="icon/logo.png" alt="MyVTC"><h2>' + escapeHtml(meta.title) + '</h2></div>',
            '<button class="sdk-icon-btn" type="button" data-action="close" aria-label="Đóng"><i class="fa fa-xmark"></i></button>',
            '</div>'
        ].join("");
    }

    function getScreenMeta(screenName) {
        var titles = {
            "login-select": "Chọn tài khoản",
            "login-identifier": "Đăng nhập",
            "login-password": "Nhập mật khẩu",
            "login-otp-method": "Đăng nhập",
            "login-otp": "Đăng nhập",
            "register-select": "Đăng ký",
            "register-form": "Đăng ký",
            "register-otp-method": "Đăng ký",
            "register-otp": "Đăng ký",
            "register-profile": "Đăng ký",
            "forgot-lookup": "Khôi phục tài khoản",
            "forgot-account-select": "Chọn tài khoản",
            "forgot-otp-method": "Chọn OTP",
            "forgot-otp": "Nhập OTP",
            "forgot-new-password": "Mật khẩu mới",
            "account-management": "Quản lý tài khoản",
            "success": "Hoàn tất"
        };
        return { title: titles[screenName] || "MyVTC SDK", canBack: screenName !== "login-select" };
    }

    function renderContent() {
        var content = document.getElementById("sdkContent");
        if (!content) return;
        var html = "";
        if (currentScreen === "login-select") html = renderLoginSelect();
        if (currentScreen === "login-identifier") html = renderLoginIdentifier();
        if (currentScreen === "login-password") html = renderLoginPassword();
        if (currentScreen === "login-otp-method") html = renderLoginOtpMethod();
        if (currentScreen === "login-otp") html = renderLoginOtp();
        if (currentScreen === "register-select") html = renderRegisterSelect();
        if (currentScreen === "register-form") html = renderRegisterForm();
        if (currentScreen === "register-otp-method") html = renderRegisterOtpMethod();
        if (currentScreen === "register-otp") html = renderRegisterOtp();
        if (currentScreen === "register-profile") html = renderRegisterProfile();
        if (currentScreen === "forgot-lookup") html = renderForgotLookup();
        if (currentScreen === "forgot-account-select") html = renderForgotAccountSelect();
        if (currentScreen === "forgot-otp-method") html = renderForgotOtpMethod();
        if (currentScreen === "forgot-otp") html = renderForgotOtp();
        if (currentScreen === "forgot-new-password") html = renderForgotNewPassword();
        if (currentScreen === "account-management") html = renderAccountManagement();
        if (currentScreen === "success") html = renderSuccess();
        content.innerHTML = html + renderMessage();
    }

    function renderMessage() {
        if (!sdkState.message) return "";
        return '<div class="sdk-message show ' + sdkState.message.type + '">' + escapeHtml(sdkState.message.text) + '</div>';
    }

    function renderLoginSelect() {
        var savedAccounts = getSavedLoginAccounts();
        return [
            '<div class="sdk-stack">',
            logoHtml(),
            '<p class="sdk-note">Chọn tài khoản đã lưu hoặc đăng nhập bằng tài khoản khác.</p>',
            savedAccounts.slice(0, 2).map(function (account) {
                return cardHtml({ action: "login-saved", value: account.id, icon: account.icon || "fa-user", title: account.name || account.username, desc: account.username });
            }).join(""),
            cardHtml({ action: "login-other", icon: "fa-right-to-bracket", title: "Sử dụng một tài khoản khác", desc: "SĐT, Email hoặc tên đăng nhập" }),
            '</div>'
        ].join("");
    }

    function renderLoginIdentifier() {
        return [
            '<form class="sdk-form" data-form="login-identifier">',
            fieldHtml({ id: "loginIdentifier", label: "Tài khoản", value: sdkState.loginIdentifier, placeholder: "SĐT, Email hoặc tên đăng nhập", autocomplete: "username" }),
            '<div class="sdk-form-note-row"><span></span><button class="sdk-inline-link" type="button" data-action="forgot-account">Quên tài khoản?</button></div>',
            '<button class="sdk-primary-btn" type="submit">Tiếp tục</button>',
            '</form>',
            renderLoginOptions()
        ].join("");
    }

    function renderLoginPassword() {
        return [
            '<form class="sdk-form" data-form="login-password">',
            '<p class="sdk-note">Đăng nhập bằng ' + escapeHtml(sdkState.loginIdentifier || "tài khoản đã nhập") + '</p>',
            passwordFieldHtml({ id: "loginPassword", label: "Mật khẩu", placeholder: "Nhập mật khẩu", autocomplete: "current-password" }),
            '<div class="sdk-form-note-row"><span></span><button class="sdk-inline-link" type="button" data-action="forgot-password">Quên mật khẩu?</button></div>',
            '<button class="sdk-primary-btn" type="submit">Đăng nhập</button>',
            '</form>',
            '<div class="sdk-login-actions"><div class="sdk-divider">Hoặc</div>',
            '<button class="sdk-secondary-btn" type="button" data-action="login-otp-method"><i class="fa fa-shield-halved"></i> Đăng nhập bằng OTP</button></div>'
        ].join("");
    }

    function renderLoginOptions() {
        return [
            '<div class="sdk-login-actions">',
            '<div class="sdk-divider">Hoặc</div>',
            '<div class="sdk-social-grid" aria-label="Đăng nhập mạng xã hội và đăng nhập nhanh">',
            socialButtonHtml("apple", "fa-brands fa-apple", "Đăng nhập với Apple"),
            socialButtonHtml("google", "sdk-google-mark", "Đăng nhập với Google", "G"),
            socialButtonHtml("facebook", "fa-brands fa-facebook-f", "Đăng nhập với Facebook"),
            socialButtonHtml("quick", "fa fa-bolt", "Đăng nhập nhanh"),
            '</div>',
            '<p class="sdk-signup-copy">Bạn chưa có tài khoản? <button class="sdk-inline-link" type="button" data-action="register">Đăng ký</button></p>',
            '</div>'
        ].join("");
    }

    function renderLoginOtpMethod() {
        return [
            '<div class="sdk-stack">',
            '<p class="sdk-note">Chọn kênh nhận mã xác thực cho tài khoản đã nhập.</p>',
            '<div class="sdk-channel-grid">',
            cardHtml({ action: "select-login-otp", value: "sms", icon: "fa-comment-sms", title: "SMS", desc: "Nhận mã qua tin nhắn SMS." }),
            cardHtml({ action: "select-login-otp", value: "voice", icon: "fa-phone-volume", title: "Voice", desc: "Nhận mã qua cuộc gọi thoại." }),
            cardHtml({ action: "select-login-otp", value: "email", icon: "fa-envelope", title: "Email", desc: "Nhận mã qua email đã xác thực." }),
            cardHtml({ action: "select-login-otp", value: "app", icon: "fa-mobile-screen-button", title: "OTP App", desc: "Lấy mã trong ứng dụng xác thực." }),
            '</div></div>'
        ].join("");
    }

    function renderLoginOtp() {
        return renderOtpForm({ form: "login-otp", label: "Mã OTP", note: "Nhập mã xác thực đã gửi qua " + otpChannelLabels[sdkState.loginOtpMethod] + ".", submit: "Xác nhận", resendAction: "resend-login-otp", backText: "Đổi phương thức" });
    }

    function renderRegisterSelect() {
        return [
            '<div class="sdk-stack">',
            logoHtml(),
            '<p class="sdk-note">Chọn phương thức phù hợp với tài khoản của bạn.</p>',
            '<div class="sdk-register-grid">',
            cardHtml({ action: "register-type", value: "phone", icon: "fa-mobile-screen-button", title: "Số điện thoại" }),
            cardHtml({ action: "register-type", value: "email", icon: "fa-envelope", title: "Email" }),
            cardHtml({ action: "register-type", value: "username", icon: "fa-user", title: "Tên tài khoản" }),
            '</div></div>'
        ].join("");
    }

    function renderRegisterForm() {
        var config = registerTypeConfig[sdkState.registerType];
        return [
            '<form class="sdk-form" data-form="register-form">',
            '<p class="sdk-note">' + escapeHtml(config.title) + '</p>',
            fieldHtml({ id: "registerIdentifier", label: config.label, value: sdkState.registerIdentifier, inputMode: config.inputMode, placeholder: config.placeholder }),
            passwordFieldHtml({ id: "registerPassword", label: "Mật khẩu", placeholder: "Nhập mật khẩu" }),
            passwordFieldHtml({ id: "registerPasswordConfirm", label: "Nhập lại mật khẩu", placeholder: "Nhập lại mật khẩu" }),
            '<label class="sdk-policy-line sdk-policy-inline" data-field="registerPolicy"><input id="registerPolicy" type="checkbox"><span>Tôi đồng ý với Điều khoản sử dụng và Chính sách quyền riêng tư</span></label>' + fieldErrorHtml("registerPolicy"),
            '<button class="sdk-primary-btn" type="submit">' + (sdkState.registerType === "username" ? "Đăng ký" : "Tiếp tục") + '</button>',
            '</form>'
        ].join("");
    }

    function renderRegisterOtpMethod() {
        return [
            '<div class="sdk-stack">',
            '<p class="sdk-note">Chọn phương thức nhận mã cho số điện thoại đã đăng ký.</p>',
            '<div class="sdk-channel-grid">',
            cardHtml({ action: "select-register-otp", value: "sms", icon: "fa-comment-sms", title: "SMS", desc: "Nhận mã xác thực qua tin nhắn SMS." }),
            cardHtml({ action: "select-register-otp", value: "voice", icon: "fa-phone-volume", title: "Voice", desc: "Nhận mã xác thực qua cuộc gọi thoại." }),
            '</div></div>'
        ].join("");
    }

    function renderRegisterOtp() {
        return renderOtpForm({ form: "register-otp", label: "Mã OTP", note: "Nhập mã xác thực đã gửi qua " + otpChannelLabels[sdkState.registerOtpMethod] + ".", submit: "Xác nhận", resendAction: "resend-register-otp", backText: "Đổi phương thức", hideBack: sdkState.registerType === "username" });
    }

    function renderRegisterProfile() {
        return [
            '<form class="sdk-form" data-form="register-profile">',
            '<p class="sdk-note">Bổ sung thông tin tài khoản.</p>',
            '<div class="sdk-profile-grid">',
            fieldHtml({ id: "registerNickname", label: "Nickname", placeholder: "Nickname 4-50 ký tự" }),
            fieldHtml({ id: "registerFullname", label: "Họ và tên", placeholder: "Nhập họ và tên" }),
            fieldHtml({ id: "registerDob", label: "Ngày sinh", type: "date" }),
            '<div class="sdk-field" data-field="registerGender"><label>Giới tính</label><select class="sdk-select" id="registerGender"><option value="">Chọn giới tính</option><option>Nam</option><option>Nữ</option><option>Khác</option></select>' + fieldErrorHtml("registerGender") + '</div>',
            fieldHtml({ id: "registerIdNumber", label: "Số CCCD/Hộ chiếu", inputMode: "numeric", maxlength: "12", placeholder: "Nhập 12 chữ số" }),
            '<label class="sdk-card sdk-policy-card" data-field="registerPolicy"><span class="sdk-card-icon"><i class="fa fa-check"></i></span><span class="sdk-card-main"><strong>Tôi đồng ý với Chính sách và Quyền riêng tư</strong>' + fieldErrorHtml("registerPolicy") + '</span><input id="registerPolicy" type="checkbox"></label>',
            '</div>',
            '<button class="sdk-primary-btn" type="submit">Hoàn tất</button>',
            '</form>'
        ].join("");
    }

    function renderOtpForm(options) {
        return [
            '<form class="sdk-form" data-form="' + options.form + '">',
            '<p class="sdk-note">' + escapeHtml(options.note) + ' Mã demo: 123456.</p>',
            fieldHtml({ id: "otpCode", label: options.label, inputClass: "otp", maxlength: "6", inputMode: "numeric", placeholder: "Nhập mã OTP" }),
            '<button class="sdk-primary-btn" type="submit">' + escapeHtml(options.submit) + '</button>',
            '<button class="sdk-inline-link" type="button" data-action="' + options.resendAction + '">Nhận lại OTP</button>',
            (options.hideBack ? '' : '<button class="sdk-inline-link" type="button" data-action="back">' + escapeHtml(options.backText || "Đổi phương thức") + '</button>'),
            '</form>'
        ].join("");
    }

    function renderAccountManagement() {
        var accountLabel = getAccountDisplayLabel();
        var linkedAccounts = getLinkedAccounts();
        return [
            '<div class="sdk-management">',
            '<section class="sdk-account-summary"><span class="sdk-account-avatar"><i class="fa fa-user"></i></span><div><strong>' + escapeHtml(accountLabel) + '</strong></div></section>',
            '<section class="sdk-management-section sdk-linked-section"><h3>Tài khoản liên kết</h3><p>Liên kết đăng nhập Google, Facebook, Apple.</p><div class="sdk-linked-list">',
            linkedAccountHtml("google", "Google", "G", linkedAccounts.google),
            linkedAccountHtml("facebook", "Facebook", '<i class="fa-brands fa-facebook-f"></i>', linkedAccounts.facebook),
            linkedAccountHtml("apple", "Apple", '<i class="fa-brands fa-apple"></i>', linkedAccounts.apple),
            '</div></section>',
            '<section class="sdk-management-section"><h3>Test Cộng EXP</h3><label class="sdk-field"><span>Hành vi</span><select class="sdk-select" id="guestExpAction"><option value="5">Đăng nhập hàng ngày</option><option value="20">Hoàn thành nhiệm vụ trong game</option><option value="10">Tương tác với nội dung</option><option value="30">Tham gia sự kiện</option><option value="50">Đạt mốc thành tích</option><option value="15">Tham gia khảo sát</option></select></label><div class="sdk-exp-preview"><span>Số EXP được cộng</span><strong id="guestExpValue">5 EXP</strong></div><button class="sdk-primary-btn" type="button" data-action="check-exp">Check</button></section>',
            '<button class="sdk-inline-link" type="button" data-action="logout">Đăng xuất</button>',
            '</div>'
        ].join("");
    }

    function getAccountDisplayLabel() {
        if (currentUser.accountType === "guest" || currentUser.isGuest) return currentUser.username || createGuestUsername();
        if (validatePhoneFormat(currentUser.username || "")) return currentUser.phone || currentUser.username;
        if (validateEmailFormat(currentUser.username || "")) return currentUser.email || currentUser.username;
        return currentUser.username || currentUser.phone || currentUser.email || "Tài khoản MyVTC";
    }

    function createGuestUsername() {
        var username = "GUEST" + String(Date.now()).slice(-8);
        currentUser.username = username;
        currentUser.accountType = "guest";
        currentUser.isGuest = true;
        saveCurrentUser();
        return username;
    }

    function getLinkedAccounts() {
        var defaults = {
            google: { linked: true, name: "Trần Thúy Hồng" },
            facebook: { linked: true, name: "Thúy Hồng Trần" },
            apple: { linked: false, name: "Chưa kết nối" }
        };
        var saved = localStorage.getItem("myvtc_sdk_linked_accounts");
        if (!saved) return defaults;
        try { return Object.assign(defaults, JSON.parse(saved)); } catch (error) { return defaults; }
    }

    function saveLinkedAccounts(accounts) {
        localStorage.setItem("myvtc_sdk_linked_accounts", JSON.stringify(accounts));
    }

    function linkedAccountHtml(provider, title, icon, account) {
        var linked = !!account.linked;
        return '<div class="sdk-linked-item">' +
            '<span class="sdk-linked-icon sdk-linked-icon-' + provider + '">' + icon + '</span>' +
            '<span class="sdk-linked-info"><strong>' + escapeHtml(title) + '</strong><small>' + escapeHtml(linked ? account.name : "Chưa kết nối") + '</small></span>' +
            '<button class="sdk-link-action ' + (linked ? "is-disconnect" : "is-connect") + '" type="button" data-action="toggle-linked-account" data-value="' + provider + '">' + (linked ? "Ngắt kết nối" : "Kết nối") + '</button>' +
            '</div>';
    }

    function toggleLinkedAccount(provider) {
        var accounts = getLinkedAccounts();
        if (!accounts[provider]) return;
        if (accounts[provider].linked) {
            accounts[provider].linked = false;
            accounts[provider].name = "Chưa kết nối";
            saveLinkedAccounts(accounts);
            showToast("Đã ngắt kết nối " + providerLabel(provider), "info");
            return render();
        }
        accounts[provider].linked = true;
        accounts[provider].name = provider === "google" ? "Trần Thúy Hồng" : provider === "facebook" ? "Thúy Hồng Trần" : "Apple ID";
        saveLinkedAccounts(accounts);
        showToast("Kết nối " + providerLabel(provider) + " thành công", "success");
        render();
    }

    function providerLabel(provider) {
        return provider === "google" ? "Google" : provider === "facebook" ? "Facebook" : "Apple";
    }

    function renderSuccess() {
        return [
            '<div class="sdk-success-box">',
            '<div class="sdk-success-icon"><i class="fa fa-check"></i></div>',
            '<h3>' + escapeHtml(sdkState.successMessage || "Đăng nhập thành công") + '</h3>',
            '<p>Tài khoản ' + escapeHtml(currentUser.name || currentUser.username || "MyVTC") + ' đã xác thực trong SDK.</p>',
            '<button class="sdk-secondary-btn" type="button" data-action="open-notifications"><i class="fa fa-bell"></i> Thông báo</button>',
            '<div class="sdk-divider">Tài khoản khách</div>',
            '<div class="sdk-social-grid">' + socialButtonHtml("myvtc", "fa fa-user", "Liên kết MyVTC") + socialButtonHtml("facebook", "fa-brands fa-facebook-f", "Liên kết Facebook") + socialButtonHtml("google", "sdk-google-mark", "Liên kết Google", "G") + socialButtonHtml("apple", "fa-brands fa-apple", "Liên kết Apple") + '</div>',
            '<label class="sdk-field"><span>Test cộng EXP</span><select class="sdk-select" id="guestExpAction"><option value="5">Đăng nhập hàng ngày, 5 EXP</option><option value="20">Hoàn thành nhiệm vụ trong game, 20 EXP</option><option value="10">Tương tác với nội dung, 10 EXP</option><option value="30">Tham gia sự kiện, 30 EXP</option><option value="50">Đạt mốc thành tích, 50 EXP</option><option value="15">Tham gia khảo sát, 15 EXP</option></select></label>',
            '<button class="sdk-secondary-btn" type="button" data-action="check-exp">Check</button>',
            '<button class="sdk-primary-btn" type="button" data-action="close">Về màn chọn tài khoản</button>',
            '</div>'
        ].join("");
    }

    function finishSdkRegistration() {
        currentUser = Object.assign(currentUser, { name: sdkState.registerIdentifier, username: sdkState.registerIdentifier, phone: sdkState.registerType === "phone" ? sdkState.registerIdentifier : currentUser.phone, email: sdkState.registerType === "email" ? sdkState.registerIdentifier : currentUser.email, rank: "Hạng Đồng", accountType: "myvtc", isGuest: false });
        saveCurrentUser(); addSavedAccount(currentUser); sdkState.successMessage = "Đăng ký thành công và đã tự động đăng nhập"; showToast(sdkState.successMessage, "success"); goToSuccess();
    }

    function renderForgotLookup() { return '<form class="sdk-form" data-form="forgot-lookup">' + fieldHtml({id:"forgotIdentifier",label:"Tài khoản",placeholder:"SĐT, Email hoặc tên đăng nhập"}) + '<button class="sdk-primary-btn" type="submit">Tiếp tục</button></form>'; }
    function renderForgotAccountSelect() { var items=getSavedLoginAccounts(); return '<div class="sdk-stack">'+items.map(function(a){return cardHtml({action:"forgot-select-account",value:a.id,icon:a.icon||"fa-user",title:a.name,desc:a.username});}).join("")+'</div>'; }
    function renderForgotOtpMethod() { return '<div class="sdk-stack">'+["sms","voice","email","app"].map(function(m){return cardHtml({action:"forgot-select-otp",value:m,icon:m==="voice"?"fa-phone-volume":m==="email"?"fa-envelope":m==="app"?"fa-mobile-screen-button":"fa-comment-sms",title:otpChannelLabels[m]});}).join("")+'</div>'; }
    function renderForgotOtp() { return renderOtpForm({form:"forgot-otp",label:"Mã OTP",note:"Nhập mã OTP qua "+otpChannelLabels[sdkState.recoveryOtpMethod]+".",submit:"Xác nhận",resendAction:"resend-login-otp",backText:"Đổi phương thức"}); }
    function renderForgotNewPassword() { return '<form class="sdk-form" data-form="forgot-new-password">'+passwordFieldHtml({id:"forgotNewPassword",label:"Mật khẩu mới",placeholder:"Nhập mật khẩu mới"})+passwordFieldHtml({id:"forgotNewPasswordConfirm",label:"Nhập lại mật khẩu",placeholder:"Nhập lại mật khẩu"})+'<button class="sdk-primary-btn" type="submit">Cập nhật mật khẩu</button></form>'; }
    function submitForgotLookup(){ var v=getValue("forgotIdentifier").trim(); if(!v)return showFieldError("forgotIdentifier","Vui lòng nhập tài khoản."); sdkState.loginIdentifier=v; goTo("forgot-account-select"); }
    function submitForgotOtp(){ if(!checkOtp(getValue("otpCode").trim()))return; goTo("forgot-new-password"); }
    function submitForgotNewPassword(){ var p=getValue("forgotNewPassword"),c=getValue("forgotNewPasswordConfirm"); if(!validatePasswordFormat(p))return showFieldError("forgotNewPassword","Mật khẩu chưa đúng định dạng."); if(p!==c)return showFieldError("forgotNewPasswordConfirm","Mật khẩu nhập lại không khớp."); showToast("Cập nhật mật khẩu thành công","success"); goTo("login-select", true); }
    function updateGuestExpPreview(){ var select=document.getElementById("guestExpAction"); var value=document.getElementById("guestExpValue"); if(value) value.textContent=(select?select.value:"0")+" EXP"; }
    function checkGuestExp(){ var select=document.getElementById("guestExpAction"); var exp=select?select.value:"0"; showToast("Bạn được thưởng "+exp+" EXP cho tài khoản MyVTC","success"); }

    function cardHtml(options) {
        return [
            '<button class="sdk-card" type="button" data-action="' + escapeAttr(options.action) + '" data-value="' + escapeAttr(options.value || "") + '">',
            '<span class="sdk-card-icon"><i class="fa ' + escapeAttr(options.icon) + '"></i></span>',
            '<span class="sdk-card-main"><strong>' + escapeHtml(options.title) + '</strong>' + (options.desc ? '<small>' + escapeHtml(options.desc) + '</small>' : '') + '</span>',
            '<i class="fa fa-chevron-right"></i>',
            '</button>'
        ].join("");
    }

    function socialButtonHtml(provider, icon, label, customText) {
        var iconHtml = customText ? '<strong class="' + escapeAttr(icon) + '">' + escapeHtml(customText) + '</strong>' : '<i class="' + escapeAttr(icon) + '"></i>';
        return '<button class="sdk-social-btn" type="button" data-action="login-social" data-value="' + escapeAttr(provider) + '" aria-label="' + escapeAttr(label) + '" title="' + escapeAttr(label) + '">' + iconHtml + '</button>';
    }

    function fieldHtml(options) {
        options = options || {};
        var id = options.id || "";
        var attrs = [
            'class="sdk-input ' + escapeAttr(options.inputClass || "") + '"',
            'id="' + escapeAttr(id) + '"',
            'type="' + escapeAttr(options.type || "text") + '"'
        ];
        if (options.value) attrs.push('value="' + escapeAttr(options.value) + '"');
        if (options.placeholder) attrs.push('placeholder="' + escapeAttr(options.placeholder) + '"');
        if (options.autocomplete) attrs.push('autocomplete="' + escapeAttr(options.autocomplete) + '"');
        if (options.inputMode) attrs.push('inputmode="' + escapeAttr(options.inputMode) + '"');
        if (options.maxlength) attrs.push('maxlength="' + escapeAttr(options.maxlength) + '"');
        if (options.readonly) attrs.push('readonly');
        return '<div class="sdk-field" data-field="' + escapeAttr(id) + '"><label>' + escapeHtml(options.label || "") + '</label><input ' + attrs.join(" ") + '>' + fieldErrorHtml(id) + '</div>';
    }

    function passwordFieldHtml(options) {
        options = options || {};
        var id = options.id || "";
        var attrs = [
            'class="sdk-input"',
            'id="' + escapeAttr(id) + '"',
            'type="password"'
        ];
        if (options.placeholder) attrs.push('placeholder="' + escapeAttr(options.placeholder) + '"');
        if (options.autocomplete) attrs.push('autocomplete="' + escapeAttr(options.autocomplete) + '"');
        return [
            '<div class="sdk-field" data-field="' + escapeAttr(id) + '">',
            '<label>' + escapeHtml(options.label || "") + '</label>',
            '<div class="sdk-password-wrap"><input ' + attrs.join(" ") + '>',
            '<button class="sdk-password-toggle" type="button" data-action="toggle-password" data-value="' + escapeAttr(id) + '" aria-label="Hiện mật khẩu"><i class="fa fa-eye-slash"></i></button></div>',
            fieldErrorHtml(id),
            '</div>'
        ].join("");
    }

    function fieldErrorHtml(fieldName) {
        var text = sdkState.fieldErrors && sdkState.fieldErrors[fieldName];
        return '<small class="sdk-field-error" data-error-for="' + escapeAttr(fieldName) + '">' + escapeHtml(text || "") + '</small>';
    }

    function logoHtml() {
        return '<div class="sdk-auth-logo"><img class="sdk-logo-img" src="icon/logo.png" alt="MyVTC"></div>';
    }

    function bindDynamicEvents() {
        document.querySelectorAll("[data-action]").forEach(function (element) { element.addEventListener("click", handleAction); });
        document.querySelectorAll("form[data-form]").forEach(function (form) { form.addEventListener("submit", handleSubmit); });
        document.querySelectorAll("input, select").forEach(function (input) {
            input.addEventListener("input", clearFieldErrorOnEdit);
            input.addEventListener("change", clearFieldErrorOnEdit);
            if (input.id === "guestExpAction") input.addEventListener("change", updateGuestExpPreview);
        });
        document.querySelectorAll("input[inputmode='numeric'], .sdk-input.otp").forEach(function (input) { input.addEventListener("keydown", allowOnlyNumbers); });
    }

    function handleAction(event) {
        var button = event.currentTarget;
        var action = button.dataset.action;
        var value = button.dataset.value || "";
        if (action === "back") return goBack();
        if (action === "close") return goTo("login-select", true);
        if (action === "login-saved") return loginWithSavedAccount(value);
        if (action === "login-other") return goTo("login-identifier");
        if (action === "login-otp-method") return startLoginOtpMethod();
        if (action === "login-social") return loginWithSocial(value);
        if (action === "select-login-otp") return selectLoginOtp(value);
        if (action === "resend-login-otp") return resendOtp();
        if (action === "register") return goTo("register-select");
        if (action === "register-type") return selectRegisterType(value);
        if (action === "select-register-otp") return selectRegisterOtp(value);
        if (action === "resend-register-otp") return resendOtp();
        if (action === "toggle-password") return togglePassword(value, button);
        if (action === "forgot-account" || action === "forgot-password") return goTo("forgot-lookup");
        if (action === "forgot-select-account") { sdkState.recoveryAccount = value; return goTo("forgot-otp-method"); }
        if (action === "forgot-select-otp") { sdkState.recoveryOtpMethod = value; return goTo("forgot-otp"); }
        if (action === "open-notifications") return showToast("Bạn có 3 thông báo mới", "info");
        if (action === "guest-link") return value === "myvtc" ? goTo("login-identifier") : loginWithSocial(value);
        if (action === "toggle-linked-account") return toggleLinkedAccount(value);
        if (action === "check-exp") return checkGuestExp();
        if (action === "logout") { showToast("Đã đăng xuất", "info"); return goTo("login-select", true); }
    }

    function handleSubmit(event) {
        event.preventDefault();
        var formName = event.currentTarget.dataset.form;
        if (formName === "login-identifier") return submitLoginIdentifier();
        if (formName === "login-password") return submitLoginPassword();
        if (formName === "login-otp") return submitLoginOtp();
        if (formName === "register-form") return submitRegisterForm();
        if (formName === "register-otp") return submitRegisterOtp();
        if (formName === "register-profile") return submitRegisterProfile();
        if (formName === "forgot-lookup") return submitForgotLookup();
        if (formName === "forgot-otp") return submitForgotOtp();
        if (formName === "forgot-new-password") return submitForgotNewPassword();
    }

    function loginWithSavedAccount(accountId) {
        var account = getSavedLoginAccounts().find(function (item) { return item.id === accountId; });
        if (!account) return showSystemError("Không tìm thấy phiên đăng nhập.");
        var user = findDemoUser(account.username) || account;
        currentUser = Object.assign(currentUser, user, { name: account.name || user.name, username: account.username || user.username, accountType: "myvtc", isGuest: false });
        saveCurrentUser();
        showToast("Đăng nhập thành công", "success");
        goToSuccess();
    }

    function submitLoginIdentifier() {
        var identifier = getValue("loginIdentifier").trim();
        if (!identifier) return showFieldError("loginIdentifier", "Vui lòng nhập SĐT, Email hoặc tên đăng nhập.");
        if (!identifierExists(identifier)) return showFieldError("loginIdentifier", "Tài khoản chưa tồn tại.");
        sdkState.loginIdentifier = identifier;
        goTo("login-password");
    }

    function submitLoginPassword() {
        var identifier = sdkState.loginIdentifier;
        var password = getValue("loginPassword");
        if (!identifier) return goTo("login-identifier");
        if (!password) return showFieldError("loginPassword", "Vui lòng nhập mật khẩu.");
        var user = findDemoUser(identifier);
        if (!user || user.password !== password) return showFieldError("loginPassword", "Mật khẩu không đúng. Dùng Demo@123 cho tài khoản demo.");
        currentUser = Object.assign(currentUser, user, { accountType: "myvtc", isGuest: false });
        saveCurrentUser();
        addSavedAccount(currentUser);
        showToast("Đăng nhập thành công", "success");
        goToSuccess();
    }

    function startLoginOtpMethod() {
        var identifierInput = getValue("loginIdentifier").trim();
        var identifier = identifierInput || sdkState.loginIdentifier;
        if (!identifier) return showFieldError("loginIdentifier", "Vui lòng nhập tài khoản trước khi nhận OTP.");
        if (!identifierExists(identifier)) return showFieldError("loginIdentifier", "Không tìm thấy tài khoản.");
        sdkState.loginIdentifier = identifier;
        goTo("login-otp-method");
    }

    function loginWithSocial(provider) {
        var socialUser = socialLoginUsers[provider];
        if (!socialUser) return showSystemError("Phương thức đăng nhập không hợp lệ.");
        currentUser = Object.assign(currentUser, socialUser, { username: "GUEST" + String(Date.now()).slice(-8), accountType: "guest", isGuest: true });
        saveCurrentUser();
        addSavedAccount(currentUser);
        showToast("Đăng nhập bằng " + socialUser.provider + " thành công", "success");
        goToSuccess();
    }

    function selectLoginOtp(method) {
        sdkState.loginOtpMethod = method;
        sdkState.otpRequestsCount = 1;
        sdkState.otpWrongCount = 0;
        showToast(method === "app" ? "Mở ứng dụng xác thực OTP" : "Đã gửi OTP qua " + otpChannelLabels[method], "info");
        goTo("login-otp");
    }

    function submitLoginOtp() {
        var code = getValue("otpCode").trim();
        if (!checkOtp(code)) return;
        var user = findDemoUser(sdkState.loginIdentifier) || currentUser;
        currentUser = Object.assign(currentUser, user, { username: sdkState.loginIdentifier || user.username, accountType: "myvtc", isGuest: false });
        saveCurrentUser();
        addSavedAccount(currentUser);
        showToast("Đăng nhập bằng OTP thành công", "success");
        goToSuccess();
    }

    function selectRegisterType(type) {
        sdkState.registerType = registerTypeConfig[type] ? type : "phone";
        sdkState.registerIdentifier = "";
        sdkState.registerPassword = "";
        goTo("register-form");
    }

    function submitRegisterForm() {
        var identifier = getValue("registerIdentifier").trim();
        var password = getValue("registerPassword");
        var passwordConfirm = getValue("registerPasswordConfirm");
        if (!validateRegisterIdentifier(sdkState.registerType, identifier)) return showFieldError("registerIdentifier", "Thông tin đăng ký không đúng định dạng.");
        if (mockExistingUsers.indexOf(identifier.toLowerCase()) !== -1) return showFieldError("registerIdentifier", "Tài khoản đã tồn tại.");
        if (!validatePasswordFormat(password)) return showFieldError("registerPassword", "Mật khẩu cần 6 đến 32 ký tự, gồm chữ hoa, chữ thường và số.");
        if (password !== passwordConfirm) return showFieldError("registerPasswordConfirm", "Mật khẩu nhập lại không khớp.");
        var policy = document.getElementById("registerPolicy");
        if (!policy || !policy.checked) return showFieldError("registerPolicy", "Vui lòng đồng ý với điều khoản.");
        sdkState.registerIdentifier = identifier;
        sdkState.registerPassword = password;
        sdkState.otpRequestsCount = 0;
        sdkState.otpWrongCount = 0;
        if (sdkState.registerType === "phone") return goTo("register-otp-method");
        if (sdkState.registerType === "email") {
            sdkState.registerOtpMethod = "email";
            sdkState.otpRequestsCount = 1;
            showToast("Đã gửi OTP qua Email", "info");
            return goTo("register-otp");
        }
        finishSdkRegistration();
    }

    function selectRegisterOtp(method) {
        sdkState.registerOtpMethod = method;
        sdkState.otpRequestsCount = 1;
        sdkState.otpWrongCount = 0;
        showToast("Đã gửi OTP qua " + otpChannelLabels[method], "info");
        goTo("register-otp");
    }

    function submitRegisterOtp() {
        var code = getValue("otpCode").trim();
        if (!checkOtp(code)) return;
        finishSdkRegistration();
    }

    function submitRegisterProfile() {
        var nickname = getValue("registerNickname").trim();
        var fullname = getValue("registerFullname").trim();
        var dob = getValue("registerDob");
        var gender = getValue("registerGender");
        var idNumber = getValue("registerIdNumber").trim();
        var policy = document.getElementById("registerPolicy");
        if (!validateNicknameFormat(nickname)) return showFieldError("registerNickname", "Nickname cần từ 4 đến 50 ký tự.");
        if (!validateFullnameFormat(fullname)) return showFieldError("registerFullname", "Họ tên cần từ 4 đến 100 ký tự.");
        if (!dob) return showFieldError("registerDob", "Vui lòng nhập ngày sinh.");
        if (!gender) return showFieldError("registerGender", "Vui lòng chọn giới tính.");
        if (!/^\d{12}$/.test(idNumber)) return showFieldError("registerIdNumber", "CCCD phải đủ 12 chữ số.");
        if (!policy || !policy.checked) return showFieldError("registerPolicy", "Vui lòng đồng ý Chính sách và Quyền riêng tư.");
        currentUser = Object.assign(currentUser, {
            name: fullname,
            nickname: nickname,
            username: sdkState.registerIdentifier,
            phone: sdkState.registerType === "phone" ? sdkState.registerIdentifier : currentUser.phone,
            email: sdkState.registerType === "email" ? sdkState.registerIdentifier : currentUser.email,
            gender: gender,
            birthday: dob,
            idNumber: idNumber,
            rank: "Hạng Đồng"
        });
        saveCurrentUser();
        addSavedAccount(currentUser);
        showToast("Đăng ký và đăng nhập thành công", "success");
        goToSuccess();
    }

    function resendOtp() {
        if (sdkState.otpRequestsCount >= 3) return showSystemError("Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau.");
        sdkState.otpRequestsCount++;
        sdkState.otpWrongCount = 0;
        showToast("Đã gửi lại OTP", "info");
        render();
    }

    function checkOtp(code) {
        if (sdkState.otpWrongCount >= 2) {
            showFieldError("otpCode", "Sai OTP quá nhiều. Tài khoản bị khóa 15 phút.");
            return false;
        }
        if (code !== demoOtpCode) {
            sdkState.otpWrongCount++;
            showFieldError("otpCode", "OTP không đúng hoặc đã hết hạn.");
            return false;
        }
        sdkState.otpWrongCount = 0;
        return true;
    }

    function togglePassword(id, button) {
        var input = document.getElementById(id);
        if (!input) return;
        var show = input.type === "password";
        input.type = show ? "text" : "password";
        var icon = button.querySelector("i");
        if (icon) icon.className = show ? "fa fa-eye" : "fa fa-eye-slash";
    }

    function goToSuccess() {
        currentScreen = "account-management";
        screenHistory = [];
        clearErrors();
        render();
    }

    function clearErrors() {
        sdkState.message = null;
        sdkState.fieldErrors = {};
    }

    function showFieldError(fieldName, text) {
        sdkState.message = null;
        sdkState.fieldErrors = {};
        sdkState.fieldErrors[fieldName] = text;
        render();
        var field = document.querySelector('[data-field="' + fieldName + '"]');
        if (field) field.classList.add("has-error");
    }

    function clearFieldErrorOnEdit(event) {
        var id = event.currentTarget.id;
        if (!id || !sdkState.fieldErrors || !sdkState.fieldErrors[id]) return;
        delete sdkState.fieldErrors[id];
        sdkState.message = null;
        var field = document.querySelector('[data-field="' + id + '"]');
        var error = document.querySelector('[data-error-for="' + id + '"]');
        if (field) field.classList.remove("has-error");
        if (error) error.textContent = "";
    }

    function showSystemError(text) {
        sdkState.message = null;
        sdkState.fieldErrors = {};
        showToast(text, "error");
    }

    function showToast(message, type) {
        var toast = document.getElementById("sdkToast");
        if (!toast) return;
        window.clearTimeout(toastTimer);
        toast.className = "sdk-toast show " + (type || "info");
        toast.innerHTML = '<i class="fa ' + (type === "success" ? "fa-check-circle" : type === "error" ? "fa-circle-exclamation" : "fa-circle-info") + '"></i><span>' + escapeHtml(message) + '</span>';
        toastTimer = window.setTimeout(function () {
            toast.className = "sdk-toast";
            toast.innerHTML = "";
        }, 2200);
    }

    function loadCurrentUser() {
        var defaults = { name: "Nguyễn Văn A", nickname: "hongtran", id: "31735b35ecba3981", rank: "Hạng Đồng", balance: 1000, username: "0389954275", phone: "0389954275", email: "thuyhong.vnt@gmail.com", gender: "Nữ", birthday: "1990-10-30" };
        var saved = localStorage.getItem("myvtc_sdk_current_user");
        if (!saved) return defaults;
        try { return Object.assign(defaults, JSON.parse(saved)); } catch (error) { return defaults; }
    }

    function saveCurrentUser() {
        localStorage.setItem("myvtc_sdk_current_user", JSON.stringify(currentUser));
    }

    function getSavedLoginAccounts() {
        var saved = localStorage.getItem("myvtc_sdk_saved_login_accounts");
        if (!saved) {
            localStorage.setItem("myvtc_sdk_saved_login_accounts", JSON.stringify(mockSavedLoginAccounts));
            return mockSavedLoginAccounts;
        }
        try { return JSON.parse(saved); } catch (error) { return mockSavedLoginAccounts; }
    }

    function addSavedAccount(user) {
        var accounts = getSavedLoginAccounts();
        if (accounts.some(function (account) { return account.username === user.username; })) return;
        accounts.unshift({ id: "saved_" + Date.now(), name: user.name, username: user.username, type: validateEmailFormat(user.username) ? "email" : "phone", icon: "fa-user" });
        localStorage.setItem("myvtc_sdk_saved_login_accounts", JSON.stringify(accounts.slice(0, 4)));
    }

    function findDemoUser(identifier) {
        var value = String(identifier || "").toLowerCase();
        return mockDemoUsers.find(function (user) { return user.username.toLowerCase() === value || user.phone === value || user.email.toLowerCase() === value; });
    }

    function identifierExists(identifier) {
        var value = String(identifier || "").toLowerCase();
        return mockExistingUsers.indexOf(value) !== -1 || !!findDemoUser(value);
    }

    function validateRegisterIdentifier(type, value) {
        if (type === "phone") return validateVietnamesePhone(value);
        if (type === "email") return validateEmailFormat(value);
        return /^[a-zA-Z0-9_.]{4,32}$/.test(value);
    }

    function validateVietnamesePhone(value) { return /^(03|05|07|08|09|01[2689])[0-9]{8}$/.test(value); }
    function validateEmailFormat(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
    function validatePasswordFormat(value) { return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/.test(value); }
    function validateNicknameFormat(value) { return /^[a-zA-Z0-9À-ỹ\s_.]{4,50}$/.test(value); }
    function validateFullnameFormat(value) { return /^[a-zA-ZÀ-ỹ\s]{4,100}$/.test(value); }

    function getValue(id) {
        var input = document.getElementById(id);
        return input ? input.value : "";
    }

    function allowOnlyNumbers(event) {
        if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].indexOf(event.key) > -1) return;
        if (!/[0-9]/.test(event.key)) event.preventDefault();
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeAttr(value) { return escapeHtml(value); }
})();
