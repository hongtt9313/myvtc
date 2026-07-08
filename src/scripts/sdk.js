/* SDK Demo JS: chỉ phục vụ dist/SDK.html. Luồng còn lại: Splash, Đăng nhập, Đăng ký. */
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
        message: null
    };

    var currentUser = loadCurrentUser();

    var mockSavedLoginAccounts = [
        { id: "saved_acc_001", name: "Nguyễn Văn A", username: "0901231234", type: "phone", icon: "fa-user", rank: "Hạng Đồng" },
        { id: "saved_acc_002", name: "Nguyễn Thu Trang", username: "trangt@vtc.vn", type: "email", icon: "fa-envelope", rank: "Hạng Bạc" }
    ];

    var mockExistingUsers = [
        "0912345678",
        "0988888888",
        "0389954275",
        "vtc_test",
        "test@gmail.com",
        "hongtt@vtc.vn",
        "hon123",
        "embehp",
        "contact@gmail.com",
        "hong.tran",
        "0901234567",
        "vantuan"
    ];

    var mockDemoUsers = [
        { username: "0389954275", password: "Demo@123", name: "Nguyễn Văn A", phone: "0389954275", email: "thuyhong.vnt@gmail.com", rank: "Hạng Đồng" },
        { username: "0901234567", password: "Demo@123", name: "Trần Minh Anh", phone: "0901234567", email: "minhanh@vtc.vn", rank: "Hạng Bạc" },
        { username: "hong.tran", password: "Demo@123", name: "Hong Tran", phone: "0391234123", email: "hongtt@vtc.vn", rank: "Hạng Vàng" },
        { username: "hongtt@vtc.vn", password: "Demo@123", name: "Hong TT", phone: "0391234123", email: "hongtt@vtc.vn", rank: "Hạng Bạc" }
    ];

    var registerTypeConfig = {
        phone: { title: "Đăng ký bằng SĐT", label: "Số điện thoại", inputMode: "tel", placeholder: "Nhập số điện thoại" },
        email: { title: "Đăng ký bằng Email", label: "Email", inputMode: "email", placeholder: "Nhập địa chỉ email" },
        username: { title: "Đăng ký bằng Username", label: "Username", inputMode: "text", placeholder: "Nhập username 4-32 ký tự" }
    };

    var otpChannelLabels = {
        sms: "SMS",
        voice: "Voice",
        email: "Email"
    };

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        bindLayoutSwitch();
        applyLayout(sdkState.layout);
        showNativeScreen("splash");
        window.setTimeout(function () {
            showNativeScreen("auth");
            goTo("login-select", true);
        }, 900);
    }

    function bindLayoutSwitch() {
        document.querySelectorAll("[data-layout-btn]").forEach(function (button) {
            button.addEventListener("click", function () {
                applyLayout(button.dataset.layoutBtn);
            });
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
        sdkState.message = null;
        render();
    }

    function goBack() {
        var previous = screenHistory.pop();
        if (previous) {
            currentScreen = previous;
            sdkState.message = null;
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
            '<div class="sdk-title-group"><small>MyVTC</small><h2>' + escapeHtml(meta.title) + '</h2></div>',
            '<button class="sdk-icon-btn" type="button" data-action="home" aria-label="Về đăng nhập"><i class="fa fa-house"></i></button>',
            '</div>'
        ].join("");
    }

    function getScreenMeta(screenName) {
        var titles = {
            "login-select": "Đăng nhập",
            "login-password": "Nhập mật khẩu",
            "login-otp-method": "Chọn nhận OTP",
            "login-otp": "Nhập OTP",
            "register-select": "Đăng ký",
            "register-form": registerTypeConfig[sdkState.registerType].title,
            "register-otp-method": "Chọn nhận OTP",
            "register-otp": "Xác thực OTP",
            "register-profile": "Hoàn tất đăng ký",
            "success": "Hoàn tất"
        };
        return { title: titles[screenName] || "MyVTC SDK", canBack: screenName !== "login-select" };
    }

    function renderContent() {
        var content = document.getElementById("sdkContent");
        if (!content) return;
        var html = "";
        if (currentScreen === "login-select") html = renderLoginSelect();
        if (currentScreen === "login-password") html = renderLoginPassword();
        if (currentScreen === "login-otp-method") html = renderLoginOtpMethod();
        if (currentScreen === "login-otp") html = renderLoginOtp();
        if (currentScreen === "register-select") html = renderRegisterSelect();
        if (currentScreen === "register-form") html = renderRegisterForm();
        if (currentScreen === "register-otp-method") html = renderRegisterOtpMethod();
        if (currentScreen === "register-otp") html = renderRegisterOtp();
        if (currentScreen === "register-profile") html = renderRegisterProfile();
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
            savedAccounts.slice(0, 2).map(function (account) {
                return cardHtml({ action: "login-saved", value: account.id, icon: account.icon || "fa-user", title: account.name || account.username, desc: account.username + " · " + account.rank });
            }).join(""),
            cardHtml({ action: "login-other", icon: "fa-right-to-bracket", title: "Đăng nhập tài khoản khác", desc: "SĐT, Email hoặc Username" }),
            '<div class="sdk-help-row">',
            '<button type="button" data-action="register">Đăng ký</button>',
            '<button type="button" data-action="clear-session">Xóa phiên</button>',
            '</div>',
            '</div>'
        ].join("");
    }

    function renderLoginPassword() {
        return [
            '<form class="sdk-form" data-form="login-password">',
            '<div class="sdk-field"><label>Tài khoản</label><input class="sdk-input" id="loginIdentifier" value="' + escapeAttr(sdkState.loginIdentifier) + '" placeholder="SĐT, Email hoặc Username" autocomplete="username"></div>',
            '<div class="sdk-field"><label>Mật khẩu</label><input class="sdk-input" id="loginPassword" type="password" placeholder="Nhập mật khẩu" autocomplete="current-password"></div>',
            '<button class="sdk-primary-btn" type="submit">Đăng nhập</button>',
            '<button class="sdk-secondary-btn" type="button" data-action="login-otp-method">Đăng nhập bằng OTP</button>',
            '</form>'
        ].join("");
    }

    function renderLoginOtpMethod() {
        return [
            '<div class="sdk-stack">',
            '<p class="sdk-note">Chọn kênh nhận OTP cho tài khoản ' + escapeHtml(sdkState.loginIdentifier || "đã nhập") + '.</p>',
            cardHtml({ action: "select-login-otp", value: "sms", icon: "fa-comment-sms", title: "SMS", desc: "Gửi mã tới SĐT đã liên kết" }),
            cardHtml({ action: "select-login-otp", value: "voice", icon: "fa-phone-volume", title: "Voice", desc: "Cuộc gọi đọc mã OTP" }),
            cardHtml({ action: "select-login-otp", value: "email", icon: "fa-envelope", title: "Email", desc: "Gửi mã tới Email đã liên kết" }),
            '</div>'
        ].join("");
    }

    function renderLoginOtp() {
        return renderOtpForm({
            form: "login-otp",
            label: "OTP đăng nhập",
            note: "Nhập OTP đã gửi qua " + otpChannelLabels[sdkState.loginOtpMethod] + ".",
            submit: "Xác nhận đăng nhập",
            resendAction: "resend-login-otp"
        });
    }

    function renderRegisterSelect() {
        return [
            '<div class="sdk-stack">',
            cardHtml({ action: "register-type", value: "phone", icon: "fa-mobile-screen-button", title: "Đăng ký bằng SĐT", desc: "Nhận OTP qua SMS hoặc Voice" }),
            cardHtml({ action: "register-type", value: "email", icon: "fa-envelope", title: "Đăng ký bằng Email", desc: "Nhận OTP qua Email" }),
            cardHtml({ action: "register-type", value: "username", icon: "fa-user", title: "Đăng ký bằng Username", desc: "Tạo tài khoản bằng username" }),
            '</div>'
        ].join("");
    }

    function renderRegisterForm() {
        var config = registerTypeConfig[sdkState.registerType];
        return [
            '<form class="sdk-form" data-form="register-form">',
            '<div class="sdk-field"><label>' + escapeHtml(config.label) + '</label><input class="sdk-input" id="registerIdentifier" value="' + escapeAttr(sdkState.registerIdentifier) + '" inputmode="' + config.inputMode + '" placeholder="' + escapeAttr(config.placeholder) + '"></div>',
            '<div class="sdk-field"><label>Mật khẩu</label><input class="sdk-input" id="registerPassword" type="password" placeholder="6 đến 32 ký tự, gồm hoa, thường, số"></div>',
            '<div class="sdk-field"><label>Nhập lại mật khẩu</label><input class="sdk-input" id="registerPasswordConfirm" type="password" placeholder="Nhập lại mật khẩu"></div>',
            '<button class="sdk-primary-btn" type="submit">Tiếp tục</button>',
            '</form>'
        ].join("");
    }

    function renderRegisterOtpMethod() {
        return [
            '<div class="sdk-stack">',
            '<p class="sdk-note">Chọn cách nhận OTP cho ' + escapeHtml(sdkState.registerIdentifier) + '.</p>',
            cardHtml({ action: "select-register-otp", value: "sms", icon: "fa-comment-sms", title: "SMS", desc: "Gửi OTP qua tin nhắn" }),
            cardHtml({ action: "select-register-otp", value: "voice", icon: "fa-phone-volume", title: "Voice", desc: "Nhận OTP qua cuộc gọi" }),
            '</div>'
        ].join("");
    }

    function renderRegisterOtp() {
        return renderOtpForm({
            form: "register-otp",
            label: "OTP đăng ký",
            note: "Nhập OTP đã gửi qua " + otpChannelLabels[sdkState.registerOtpMethod] + ".",
            submit: "Xác thực",
            resendAction: "resend-register-otp"
        });
    }

    function renderRegisterProfile() {
        return [
            '<form class="sdk-form" data-form="register-profile">',
            '<div class="sdk-field"><label>Nickname</label><input class="sdk-input" id="registerNickname" placeholder="Nhập nickname"></div>',
            '<div class="sdk-field"><label>Họ và tên</label><input class="sdk-input" id="registerFullname" placeholder="Nhập họ và tên"></div>',
            '<div class="sdk-field"><label>Giới tính</label><select class="sdk-select" id="registerGender"><option value="">Chọn giới tính</option><option>Nam</option><option>Nữ</option><option>Khác</option></select></div>',
            '<label class="sdk-card"><span class="sdk-card-icon"><i class="fa fa-check"></i></span><span class="sdk-card-main"><strong>Đồng ý điều khoản MyVTC</strong><small>Tiếp tục tạo tài khoản</small></span><input id="registerPolicy" type="checkbox"></label>',
            '<button class="sdk-primary-btn" type="submit">Hoàn tất đăng ký</button>',
            '</form>'
        ].join("");
    }

    function renderSuccess() {
        return [
            '<div class="sdk-success-box">',
            '<div class="sdk-success-icon"><i class="fa fa-check"></i></div>',
            '<h3>Đăng nhập thành công</h3>',
            '<p>' + escapeHtml(currentUser.name || currentUser.username || "Tài khoản MyVTC") + ' đã xác thực trong SDK.</p>',
            '<button class="sdk-primary-btn" type="button" data-action="home">Về đăng nhập</button>',
            '</div>'
        ].join("");
    }

    function renderOtpForm(options) {
        return [
            '<form class="sdk-form" data-form="' + options.form + '">',
            '<p class="sdk-note">' + escapeHtml(options.note) + ' Mã demo: 123456.</p>',
            '<div class="sdk-field"><label>' + escapeHtml(options.label) + '</label><input class="sdk-input otp" id="otpCode" maxlength="6" inputmode="numeric" placeholder="••••••"></div>',
            '<button class="sdk-primary-btn" type="submit">' + escapeHtml(options.submit) + '</button>',
            '<button class="sdk-secondary-btn" type="button" data-action="' + options.resendAction + '">Nhận lại OTP</button>',
            '</form>'
        ].join("");
    }

    function cardHtml(options) {
        return [
            '<button class="sdk-card" type="button" data-action="' + escapeAttr(options.action) + '" data-value="' + escapeAttr(options.value || "") + '">',
            '<span class="sdk-card-icon"><i class="fa ' + escapeAttr(options.icon) + '"></i></span>',
            '<span class="sdk-card-main"><strong>' + escapeHtml(options.title) + '</strong><small>' + escapeHtml(options.desc || "") + '</small></span>',
            '<i class="fa fa-chevron-right"></i>',
            '</button>'
        ].join("");
    }

    function bindDynamicEvents() {
        document.querySelectorAll("[data-action]").forEach(function (element) {
            element.addEventListener("click", handleAction);
        });
        document.querySelectorAll("form[data-form]").forEach(function (form) {
            form.addEventListener("submit", handleSubmit);
        });
        document.querySelectorAll("input[inputmode='numeric'], .sdk-input.otp").forEach(function (input) {
            input.addEventListener("keydown", allowOnlyNumbers);
        });
    }

    function handleAction(event) {
        var button = event.currentTarget;
        var action = button.dataset.action;
        var value = button.dataset.value || "";

        if (action === "back") return goBack();
        if (action === "home") return goTo("login-select", true);
        if (action === "login-saved") return loginWithSavedAccount(value);
        if (action === "login-other") return goTo("login-password");
        if (action === "login-otp-method") return startLoginOtpMethod();
        if (action === "select-login-otp") return selectLoginOtp(value);
        if (action === "resend-login-otp") return resendOtp();
        if (action === "register") return goTo("register-select");
        if (action === "register-type") return selectRegisterType(value);
        if (action === "select-register-otp") return selectRegisterOtp(value);
        if (action === "resend-register-otp") return resendOtp();
        if (action === "clear-session") return clearSession();
    }

    function handleSubmit(event) {
        event.preventDefault();
        var formName = event.currentTarget.dataset.form;
        if (formName === "login-password") return submitLoginPassword();
        if (formName === "login-otp") return submitLoginOtp();
        if (formName === "register-form") return submitRegisterForm();
        if (formName === "register-otp") return submitRegisterOtp();
        if (formName === "register-profile") return submitRegisterProfile();
    }

    function loginWithSavedAccount(accountId) {
        var account = getSavedLoginAccounts().find(function (item) { return item.id === accountId; });
        if (!account) return showInlineError("Không tìm thấy phiên đăng nhập.");
        currentUser = Object.assign(currentUser, {
            name: account.name,
            username: account.username,
            rank: account.rank || "Hạng Đồng"
        });
        saveCurrentUser();
        showToast("Đăng nhập thành công", "success");
        goToSuccess();
    }

    function submitLoginPassword() {
        var identifier = getValue("loginIdentifier").trim();
        var password = getValue("loginPassword");
        if (!identifier) return showInlineError("Vui lòng nhập tài khoản.");
        if (!password) return showInlineError("Vui lòng nhập mật khẩu.");
        var user = findDemoUser(identifier);
        if (!user || user.password !== password) return showInlineError("Tài khoản hoặc mật khẩu không đúng. Dùng Demo@123 cho tài khoản demo.");
        currentUser = Object.assign(currentUser, user);
        saveCurrentUser();
        addSavedAccount(currentUser);
        showToast("Đăng nhập thành công", "success");
        goToSuccess();
    }

    function startLoginOtpMethod() {
        var identifier = getValue("loginIdentifier").trim() || sdkState.loginIdentifier;
        if (!identifier) return showInlineError("Vui lòng nhập tài khoản trước khi nhận OTP.");
        if (!identifierExists(identifier)) return showInlineError("Không tìm thấy tài khoản.");
        sdkState.loginIdentifier = identifier;
        goTo("login-otp-method");
    }

    function selectLoginOtp(method) {
        sdkState.loginOtpMethod = method;
        sdkState.otpRequestsCount = 1;
        sdkState.otpWrongCount = 0;
        showToast("Đã gửi OTP qua " + otpChannelLabels[method], "info");
        goTo("login-otp");
    }

    function submitLoginOtp() {
        var code = getValue("otpCode").trim();
        if (!checkOtp(code)) return;
        var user = findDemoUser(sdkState.loginIdentifier) || currentUser;
        currentUser = Object.assign(currentUser, user, { username: sdkState.loginIdentifier || user.username });
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
        if (!validateRegisterIdentifier(sdkState.registerType, identifier)) return showInlineError("Thông tin đăng ký không đúng định dạng.");
        if (mockExistingUsers.indexOf(identifier.toLowerCase()) !== -1) return showInlineError("Tài khoản đã tồn tại.");
        if (!validatePasswordFormat(password)) return showInlineError("Mật khẩu cần 6 đến 32 ký tự, gồm chữ hoa, chữ thường và số.");
        if (password !== passwordConfirm) return showInlineError("Mật khẩu nhập lại không khớp.");
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
        goTo("register-profile");
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
        goTo("register-profile");
    }

    function submitRegisterProfile() {
        var nickname = getValue("registerNickname").trim();
        var fullname = getValue("registerFullname").trim();
        var gender = getValue("registerGender");
        var policy = document.getElementById("registerPolicy");
        if (!validateNicknameFormat(nickname)) return showInlineError("Nickname cần từ 4 đến 50 ký tự.");
        if (!validateFullnameFormat(fullname)) return showInlineError("Họ tên cần từ 4 đến 100 ký tự.");
        if (!gender) return showInlineError("Vui lòng chọn giới tính.");
        if (!policy || !policy.checked) return showInlineError("Vui lòng đồng ý điều khoản MyVTC.");
        currentUser = Object.assign(currentUser, {
            name: fullname,
            nickname: nickname,
            username: sdkState.registerIdentifier,
            phone: sdkState.registerType === "phone" ? sdkState.registerIdentifier : currentUser.phone,
            email: sdkState.registerType === "email" ? sdkState.registerIdentifier : currentUser.email,
            gender: gender,
            rank: "Hạng Đồng"
        });
        saveCurrentUser();
        addSavedAccount(currentUser);
        showToast("Đăng ký và đăng nhập thành công", "success");
        goToSuccess();
    }

    function resendOtp() {
        if (sdkState.otpRequestsCount >= 3) return showInlineError("Bạn đã yêu cầu OTP quá nhiều lần. Vui lòng thử lại sau.");
        sdkState.otpRequestsCount++;
        sdkState.otpWrongCount = 0;
        showToast("Đã gửi lại OTP", "info");
        render();
    }

    function checkOtp(code) {
        if (sdkState.otpWrongCount >= 2) {
            showInlineError("Sai OTP quá nhiều. Tài khoản bị khóa 15 phút.");
            return false;
        }
        if (code !== demoOtpCode) {
            sdkState.otpWrongCount++;
            showInlineError("OTP không đúng hoặc đã hết hạn.");
            return false;
        }
        sdkState.otpWrongCount = 0;
        return true;
    }

    function clearSession() {
        localStorage.removeItem("myvtc_sdk_saved_login_accounts");
        showToast("Đã xóa phiên đăng nhập demo", "success");
        goTo("login-select", true);
    }

    function goToSuccess() {
        currentScreen = "success";
        screenHistory = [];
        sdkState.message = null;
        render();
    }

    function showInlineError(text) {
        sdkState.message = { type: "error", text: text };
        render();
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
        var defaults = {
            name: "Nguyễn Văn A",
            nickname: "hongtran",
            id: "31735b35ecba3981",
            rank: "Hạng Đồng",
            balance: 1000,
            username: "0389954275",
            phone: "0389954275",
            email: "thuyhong.vnt@gmail.com",
            gender: "Nữ",
            birthday: "1990-10-30"
        };
        var saved = localStorage.getItem("myvtc_sdk_current_user");
        if (!saved) return defaults;
        try {
            return Object.assign(defaults, JSON.parse(saved));
        } catch (error) {
            return defaults;
        }
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
        try {
            return JSON.parse(saved);
        } catch (error) {
            return mockSavedLoginAccounts;
        }
    }

    function addSavedAccount(user) {
        var accounts = getSavedLoginAccounts();
        if (accounts.some(function (account) { return account.username === user.username; })) return;
        accounts.unshift({ id: "saved_" + Date.now(), name: user.name, username: user.username, type: validateEmailFormat(user.username) ? "email" : "phone", icon: "fa-user", rank: user.rank || "Hạng Đồng" });
        localStorage.setItem("myvtc_sdk_saved_login_accounts", JSON.stringify(accounts.slice(0, 4)));
    }

    function findDemoUser(identifier) {
        var value = String(identifier || "").toLowerCase();
        return mockDemoUsers.find(function (user) {
            return user.username.toLowerCase() === value || user.phone === value || user.email.toLowerCase() === value;
        });
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

    function validateVietnamesePhone(value) {
        return /^(03|05|07|08|09|01[2689])[0-9]{8}$/.test(value);
    }

    function validateEmailFormat(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validatePasswordFormat(value) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/.test(value);
    }

    function validateNicknameFormat(value) {
        return /^[a-zA-Z0-9À-ỹ\s_.]{4,50}$/.test(value);
    }

    function validateFullnameFormat(value) {
        return /^[a-zA-ZÀ-ỹ\s]{4,100}$/.test(value);
    }

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

    function escapeAttr(value) {
        return escapeHtml(value);
    }
})();
