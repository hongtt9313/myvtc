/* Mobile App JS: lấy nghiệp vụ đăng nhập, đăng ký từ bản Web. Giữ UI mobile. */
var isLoggedIn = false;
var loggedInAccountName = "Hong Tran";
var currentMobileUser = loadMobileCurrentUser();

function loadMobileCurrentUser() {
    var defaults = {
        name: "Nguyễn Văn A",
        nickname: "hongtran",
        id: "31735b35ecba3981",
        rank: "Hạng Đồng",
        balance: 1000,
        avatar: null,
        username: "0389954275",
        phone: "0389954275",
        email: "thuyhong.vnt@gmail.com",
        cccd: "012930857834",
        address: "23 Lạc Trung",
        gender: "Nữ",
        birthday: "1990-10-30"
    };
    var saved = localStorage.getItem("myvtc_current_user_mobile");
    if (!saved) return defaults;
    try {
        return Object.assign(defaults, JSON.parse(saved));
    } catch (error) {
        return defaults;
    }
}

function saveMobileCurrentUser() {
    localStorage.setItem("myvtc_current_user_mobile", JSON.stringify(currentMobileUser));
}

var demoOtpCode = "123456";
var authMobileState = {
    loginIdentifier: "",
    loginOtpMethod: "",
    registerType: "phone",
    registerIdentifier: "",
    registerPassword: "",
    registerOtpMethod: "sms",
    resetOtpMethod: "",
    otpRequestsCount: 0,
    otpWrongCount: 0,
    socialProvider: ""
};

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

var mockRecoveryAccounts = [
    { id: "acc_001", name: "Hong TT", username: "hongtt@vtc.vn", phone: "0391234123", email: "hongtt@vtc.vn", icon: "fa-user" },
    { id: "acc_002", name: "Nguyễn Văn A", username: "0389954275", phone: "0389954275", email: "thuyhong.vnt@gmail.com", icon: "fa-envelope" }
];

var registerTypeConfig = {
    phone: { title: "Đăng ký bằng Số điện thoại", label: "Số điện thoại", placeholder: "Nhập số điện thoại" },
    email: { title: "Đăng ký bằng Email", label: "Email", placeholder: "Nhập địa chỉ email" },
    username: { title: "Đăng ký bằng Tên tài khoản", label: "Tên tài khoản", placeholder: "Nhập tên tài khoản 4-32 ký tự" }
};

var otpChannelLabels = {
    sms: "SMS",
    voice: "cuộc gọi thoại Voice",
    email: "Email",
    SMS: "SMS",
    Voice: "cuộc gọi thoại Voice",
    Email: "Email",
    "OTP App": "OTP App"
};

function showMobileScreen(screenName) {
    document.querySelectorAll("[data-screen]").forEach(function (screen) {
        screen.classList.toggle("active", screen.dataset.screen === screenName);
    });
    if (screenName === "account") {
        renderMobileAccount();
        showMobileAccountMenu();
    }
    if (screenName === "home-auth") {
        renderMobileAccount();
    }
    if (screenName === "service-auth") {
        renderMobileLoyaltyOverview();
        showMobileLoyaltyMenu();
    }
    if (screenName === "shop" || screenName === "shop-auth") {
        renderMobileShop();
    }
    if (screenName === "shop-detail") {
        renderMobileRechargeDetail();
    }
}

function resolveTargetScreen(target) {
    if (!target) return "home-guest";
    if (target === "service-auth") return isLoggedIn ? "service-auth" : "login-select";
    if (target === "shop-auth") return isLoggedIn ? "shop-auth" : "login-select";
    if (target === "account") return isLoggedIn ? "account" : "login-select";
    return target;
}

function getSavedLoginAccounts() {
    var saved = localStorage.getItem("myvtc_saved_login_accounts_mobile");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            return mockSavedLoginAccounts;
        }
    }
    localStorage.setItem("myvtc_saved_login_accounts_mobile", JSON.stringify(mockSavedLoginAccounts));
    return mockSavedLoginAccounts;
}

function saveLoginAccount(account) {
    var saved = getSavedLoginAccounts();
    var exists = saved.some(function (item) {
        return item.username === account.username;
    });
    if (!exists) {
        saved.unshift(account);
        localStorage.setItem("myvtc_saved_login_accounts_mobile", JSON.stringify(saved.slice(0, 4)));
    }
    renderSavedAccounts();
}

function renderSavedAccounts() {
    var list = document.getElementById("savedAccountList");
    if (!list) return;

    var accounts = getSavedLoginAccounts();
    if (!accounts.length) {
        list.innerHTML = '<div class="empty-account">Không còn tài khoản đã lưu trên thiết bị này.</div>';
        return;
    }

    list.innerHTML = accounts.map(function (account) {
        var avatar = (account.name || account.username || "M").trim().charAt(0).toUpperCase();
        return [
            '<button class="saved-account" type="button" data-login-account="' + account.id + '">',
            '<span class="account-avatar">' + avatar + '</span>',
            '<span><strong>' + escapeHtml(account.name || account.username) + '</strong><small>' + escapeHtml(account.username || account.rank || "Tài khoản MyVTC") + '</small></span>',
            '<i class="fa fa-chevron-right"></i>',
            '</button>'
        ].join("");
    }).join("");
}

function clearSavedAccounts() {
    localStorage.setItem("myvtc_saved_login_accounts_mobile", JSON.stringify([]));
    renderSavedAccounts();
    showMobileToast("Đã đăng xuất tất cả tài khoản đã lưu.", "info");
}

function setLoggedInName(name, username) {
    loggedInAccountName = name || "Tài khoản MyVTC";
    isLoggedIn = true;
    currentMobileUser.name = loggedInAccountName;
    currentMobileUser.username = username || currentMobileUser.username;
    if (validateVietnamesePhone(currentMobileUser.username)) currentMobileUser.phone = currentMobileUser.username;
    if (validateEmailFormat(currentMobileUser.username)) currentMobileUser.email = currentMobileUser.username;
    saveMobileCurrentUser();
    renderMobileAccount();

    var nameNode = document.getElementById("loggedInName");
    if (nameNode) nameNode.textContent = loggedInAccountName;

    var profileNode = document.getElementById("accountProfileName");
    if (profileNode) profileNode.textContent = loggedInAccountName;

    saveLoginAccount({
        id: "saved_" + Date.now(),
        name: loggedInAccountName,
        username: username || authMobileState.loginIdentifier || authMobileState.registerIdentifier || "myvtc_user",
        icon: "fa-user",
        rank: "Hạng Đồng"
    });
}

function performLogin(name, username) {
    setLoggedInName(name || getDisplayName(username || authMobileState.loginIdentifier), username || authMobileState.loginIdentifier);
    authMobileState.otpWrongCount = 0;
    authMobileState.otpRequestsCount = 0;
    clearAuthErrors();
    showMobileScreen("home-auth");
    showMobileToast("Đăng nhập thành công.", "success");
}

function performRegisterLogin(nickname) {
    setLoggedInName(nickname || authMobileState.registerIdentifier || "Tài khoản MyVTC", authMobileState.registerIdentifier);
    showMobileScreen("home-auth");
    showMobileToast("Đăng ký thành công.", "success");
}

function getDisplayName(identifier) {
    if (!identifier) return "Tài khoản MyVTC";
    var saved = getSavedLoginAccounts().find(function (item) {
        return item.username === identifier || item.id === identifier;
    });
    if (saved) return saved.name;
    if (identifier.indexOf("@") > -1) return identifier.split("@")[0];
    return identifier;
}

function validateVietnamesePhone(value) {
    return /^0\d{9}$/.test(value);
}

function validateEmailFormat(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateUsernameFormat(value) {
    return /^[A-Za-z0-9._]{4,32}$/.test(value);
}

function validatePasswordFormat(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{6,32}$/.test(value);
}

function validateNicknameFormat(value) {
    return /^[A-Za-z0-9]{4,50}$/.test(value);
}

function validateFullnameFormat(value) {
    return /^[A-Za-zÀ-ỹ\s]+$/.test(value.trim());
}

function calculateAge(dateString) {
    var dob = new Date(dateString);
    if (Number.isNaN(dob.getTime())) return 0;
    var today = new Date();
    var age = today.getFullYear() - dob.getFullYear();
    var m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
}

function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, function (char) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char];
    });
}

function setVisible(id, visible) {
    var node = document.getElementById(id);
    if (node) node.classList.toggle("visible", !!visible);
}

function clearAuthErrors() {
    document.querySelectorAll(".form-error-text.visible").forEach(function (node) {
        node.classList.remove("visible");
    });
    document.querySelectorAll(".password-field.has-error").forEach(function (node) {
        node.classList.remove("has-error");
    });
}

function resetOtpInputs() {
    ["otpCode", "loginOtpCode", "resetOtpCode"].forEach(function (id) {
        var input = document.getElementById(id);
        if (input) input.value = "";
    });
}

function initRegisterForm(type) {
    authMobileState.registerType = type;
    authMobileState.otpWrongCount = 0;
    authMobileState.otpRequestsCount = 0;

    var config = registerTypeConfig[type];
    if (!config) return;

    var titleNode = document.getElementById("registerFormTitle");
    var labelNode = document.getElementById("registerIdentifierLabel");
    var identifierInput = document.getElementById("registerIdentifier");

    if (titleNode) titleNode.textContent = config.title;
    if (labelNode) labelNode.textContent = config.label;
    if (identifierInput) {
        identifierInput.placeholder = config.placeholder;
        identifierInput.value = "";
    }

    ["registerPassword", "registerPasswordConfirm"].forEach(function (id) {
        var node = document.getElementById(id);
        if (node) node.value = "";
    });

    clearAuthErrors();
    showMobileScreen("register-form");
}

function validateRegisterIdentifier(type, value) {
    if (type === "phone") return validateVietnamesePhone(value);
    if (type === "email") return validateEmailFormat(value);
    return validateUsernameFormat(value);
}

function handleRegisterStep1() {
    var identifier = (document.getElementById("registerIdentifier") || {}).value || "";
    var password = (document.getElementById("registerPassword") || {}).value || "";
    var passwordConfirm = (document.getElementById("registerPasswordConfirm") || {}).value || "";
    identifier = identifier.trim();

    var identifierValid = validateRegisterIdentifier(authMobileState.registerType, identifier);
    var isDuplicated = mockExistingUsers.indexOf(identifier.toLowerCase()) !== -1;
    var passwordValid = validatePasswordFormat(password);
    var passwordConfirmValid = passwordConfirm !== "" && passwordConfirm === password;

    setVisible("registerIdentifierError", !identifierValid || isDuplicated);
    setVisible("registerPasswordError", !passwordValid);
    setVisible("registerPasswordConfirmError", !passwordConfirmValid);

    if (!identifierValid || isDuplicated || !passwordValid || !passwordConfirmValid) return;

    authMobileState.registerIdentifier = identifier;
    authMobileState.registerPassword = password;
    clearAuthErrors();
    resetOtpInputs();

    if (authMobileState.registerType === "phone") {
        showMobileScreen("otp-select");
        return;
    }

    if (authMobileState.registerType === "email") {
        authMobileState.registerOtpMethod = "email";
        setRegisterOtpLabel("Email");
        var actionBtn = document.getElementById("changeOtpMethodBtn");
        if (actionBtn) actionBtn.textContent = "Nhận lại";
        showMobileScreen("otp-verify");
        return;
    }

    showMobileScreen("ekyc-info");
}

function setRegisterOtpLabel(method) {
    var labelNode = document.getElementById("otpChannelLabel");
    if (labelNode) labelNode.textContent = "Nhập mã xác thực đã gửi qua " + (otpChannelLabels[method] || method) + ".";
}

function handleRegisterOtpMethod(method) {
    if (authMobileState.otpRequestsCount >= 3) {
        showMobileToast("Quá số lần yêu cầu OTP.", "info");
        return;
    }
    authMobileState.otpRequestsCount++;
    authMobileState.registerOtpMethod = method;
    setRegisterOtpLabel(method);
    var actionBtn = document.getElementById("changeOtpMethodBtn");
    if (actionBtn) actionBtn.textContent = "Đổi phương thức";
    resetOtpInputs();
    clearAuthErrors();
    showMobileScreen("otp-verify");
}

function verifyRegisterOtp() {
    var otpValue = (document.getElementById("otpCode") || {}).value || "";
    otpValue = otpValue.trim();

    if (authMobileState.otpWrongCount >= 2) {
        setVisible("otpError", true);
        showMobileToast("Sai OTP quá nhiều. Khóa 15 phút.", "info");
        return;
    }

    if (otpValue !== demoOtpCode) {
        authMobileState.otpWrongCount++;
        setVisible("otpError", true);
        return;
    }

    clearAuthErrors();
    showMobileScreen("ekyc-info");
}

function handleEkycSubmit() {
    var nickname = ((document.getElementById("ekycNickname") || {}).value || "").trim();
    var fullName = ((document.getElementById("ekycFullName") || {}).value || "").trim();
    var dob = (document.getElementById("ekycDob") || {}).value || "";
    var gender = (document.getElementById("ekycGender") || {}).value || "";
    var idNumber = ((document.getElementById("ekycIdNumber") || {}).value || "").trim();
    var policyChecked = !!((document.getElementById("ekycPolicyAgree") || {}).checked);

    var nicknameValid = validateNicknameFormat(nickname);
    var fullNameValid = validateFullnameFormat(fullName);
    var dobValid = dob !== "" && calculateAge(dob) >= 14;
    var genderValid = gender !== "";
    var idNumberValid = /^\d{12}$/.test(idNumber);

    setVisible("ekycNicknameError", !nicknameValid);
    setVisible("ekycFullNameError", !fullNameValid);
    setVisible("ekycDobError", !dobValid);
    setVisible("ekycGenderError", !genderValid);
    setVisible("ekycIdNumberError", !idNumberValid);
    setVisible("ekycPolicyError", !policyChecked);

    if (!nicknameValid || !fullNameValid || !dobValid || !genderValid || !idNumberValid || !policyChecked) return;
    performRegisterLogin(nickname);
}

function handleLoginStep1() {
    var usernameInput = document.getElementById("mobileUsername");
    var usernameValue = usernameInput && usernameInput.value.trim() ? usernameInput.value.trim() : "";

    if (!usernameValue) {
        setVisible("usernameError", true);
        return;
    }

    setVisible("usernameError", false);
    authMobileState.loginIdentifier = usernameValue;

    var labelNode = document.getElementById("passwordAccountLabel");
    if (labelNode) labelNode.textContent = "Đăng nhập bằng " + usernameValue;

    var passwordInput = document.getElementById("mobilePassword");
    if (passwordInput) passwordInput.value = "";
    clearAuthErrors();
    showMobileScreen("login-password");
}

function handleLoginWithPassword() {
    var passwordInput = document.getElementById("mobilePassword");
    var passwordValue = passwordInput ? passwordInput.value : "";
    var wrap = passwordInput ? passwordInput.closest(".password-field") : null;

    if (!validatePasswordFormat(passwordValue)) {
        if (wrap) wrap.classList.add("has-error");
        setVisible("passwordError", true);
        return;
    }

    if (wrap) wrap.classList.remove("has-error");
    setVisible("passwordError", false);
    performLogin(null, authMobileState.loginIdentifier);
}

function handleLoginOtpMethod(method) {
    if (authMobileState.otpRequestsCount >= 3) {
        showMobileToast("Quá số lần yêu cầu OTP.", "info");
        return;
    }

    authMobileState.otpRequestsCount++;
    authMobileState.loginOtpMethod = method;

    var labelNode = document.getElementById("loginOtpChannelLabel");
    if (labelNode) labelNode.textContent = "Nhập mã xác thực đã gửi qua " + (otpChannelLabels[method] || method) + ".";

    resetOtpInputs();
    clearAuthErrors();
    showMobileScreen("login-otp-verify");
}

function verifyLoginOtp() {
    var code = ((document.getElementById("loginOtpCode") || {}).value || "").trim();

    if (authMobileState.otpWrongCount >= 2) {
        setVisible("loginOtpError", true);
        showMobileToast("Sai OTP quá nhiều. Khóa 15 phút.", "info");
        return;
    }

    if (code !== demoOtpCode) {
        authMobileState.otpWrongCount++;
        setVisible("loginOtpError", true);
        return;
    }

    performLogin(null, authMobileState.loginIdentifier);
}

function startSocialLogin(provider) {
    authMobileState.socialProvider = provider;
    var title = document.getElementById("socialProviderTitle");
    if (title) title.textContent = "Đăng nhập bằng " + provider;
    showMobileScreen("social-oauth");
}

function startGuestLogin() {
    var guestId = localStorage.getItem("myvtc_guest_id");
    if (!guestId) {
        guestId = "GUEST-" + Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem("myvtc_guest_id", guestId);
        localStorage.setItem("myvtc_guest_progress", JSON.stringify({ created_at: new Date().toISOString(), data: "mobile_demo_progress" }));
    }
    var label = document.getElementById("guestIdLabel");
    if (label) label.textContent = guestId;
    showMobileScreen("guest-login");
}

function findRecoveryAccounts() {
    var keyword = ((document.getElementById("forgotAccountInput") || {}).value || "").trim().toLowerCase();
    var list = document.getElementById("recoveryAccountList");
    if (!list) return;

    var accounts = mockRecoveryAccounts.filter(function (account) {
        return account.username.toLowerCase().indexOf(keyword) > -1 || account.phone.indexOf(keyword) > -1 || account.email.toLowerCase().indexOf(keyword) > -1;
    });

    if (!keyword || !accounts.length) {
        setVisible("forgotAccountError", true);
        list.innerHTML = "";
        return;
    }

    setVisible("forgotAccountError", false);
    list.innerHTML = accounts.map(function (account) {
        return [
            '<button class="saved-account" type="button" data-recovery-username="' + escapeHtml(account.username) + '">',
            '<span class="account-avatar">' + escapeHtml(account.name.charAt(0)) + '</span>',
            '<span><strong>' + escapeHtml(account.name) + '</strong><small>' + escapeHtml(account.username) + '</small></span>',
            '<i class="fa fa-chevron-right"></i>',
            '</button>'
        ].join("");
    }).join("");
}

function startResetPassword(method) {
    authMobileState.resetOtpMethod = method;
    var label = document.getElementById("resetOtpLabel");
    if (label) label.textContent = "Nhập OTP đã gửi qua " + method + " và mật khẩu mới.";
    resetOtpInputs();
    clearAuthErrors();
    showMobileScreen("reset-password");
}

function confirmResetPassword() {
    var otp = ((document.getElementById("resetOtpCode") || {}).value || "").trim();
    var password = (document.getElementById("resetNewPassword") || {}).value || "";

    var otpOk = otp === demoOtpCode;
    var passwordOk = validatePasswordFormat(password);

    setVisible("resetOtpError", !otpOk);
    setVisible("resetPasswordError", !passwordOk);

    if (!otpOk || !passwordOk) return;

    showMobileToast("Đặt lại mật khẩu thành công.", "success");
    showMobileScreen("login-password");
}

function showMobileToast(message, type) {
    var old = document.getElementById("mobile-toast");
    if (old) old.remove();

    var toast = document.createElement("div");
    toast.id = "mobile-toast";
    toast.className = "mobile-toast " + (type || "success");
    toast.innerHTML = '<i class="fa ' + (type === "info" ? "fa-circle-info" : "fa-check-circle") + '"></i><span>' + escapeHtml(message) + '</span>';
    document.body.appendChild(toast);

    window.setTimeout(function () {
        toast.classList.add("show");
    }, 30);

    window.setTimeout(function () {
        toast.classList.remove("show");
        window.setTimeout(function () {
            toast.remove();
        }, 250);
    }, 2600);
}

function initBannerSliderDrag() {
    document.querySelectorAll(".home-banner-slider").forEach(function (slider) {
        var isDragging = false;
        var startX = 0;
        var startScrollLeft = 0;

        slider.addEventListener("pointerdown", function (event) {
            isDragging = true;
            startX = event.clientX;
            startScrollLeft = slider.scrollLeft;
            slider.classList.add("dragging");
            if (slider.setPointerCapture) slider.setPointerCapture(event.pointerId);
        });

        slider.addEventListener("pointermove", function (event) {
            if (!isDragging) return;
            if (event.pointerType === "mouse") event.preventDefault();
            slider.scrollLeft = startScrollLeft - (event.clientX - startX);
        });

        ["pointerup", "pointercancel", "pointerleave"].forEach(function (eventName) {
            slider.addEventListener(eventName, function () {
                isDragging = false;
                slider.classList.remove("dragging");
            });
        });
    });
}


var mobileAccountState = {
    activePanel: "personal",
    pendingAvatar: null,
    language: localStorage.getItem("myvtc_mobile_language") || "vi"
};

var mobileAccountPanelTitles = {
    personal: "Thông tin cá nhân",
    linked: "Tài khoản liên kết",
    security: "Bảo mật tài khoản",
    payment: "Quản lý thanh toán",
    transactions: "Lịch sử giao dịch",
    bag: "Kho đồ",
    invite: "Mời bạn bè",
    notifications: "Thông báo",
    language: "Đổi ngôn ngữ",
    terms: "Điều khoản chính sách",
    privacy: "Quyền riêng tư"
};

var mobileTransactions = [
    { code: "MYVTC250625001", type: "Nạp Point", date: "2026-06-25", desc: "Nạp Point qua thẻ quốc tế Visa", amount: "+1.000 Point", status: "Thành công" },
    { code: "MYVTC250626008", type: "Thanh toán Point", date: "2026-06-26", desc: "Thanh toán gói Audition PC", amount: "-200 Point", status: "Thành công" },
    { code: "MYVTC250627012", type: "Hoàn tiền", date: "2026-06-27", desc: "Hoàn tiền giao dịch lỗi", amount: "+200 Point", status: "Đã hoàn" },
    { code: "MYVTC250629021", type: "Nạp Point", date: "2026-06-29", desc: "Nạp Point qua VTC Pay", amount: "+500 Point", status: "Thành công" },
    { code: "MYVTC250701033", type: "Thanh toán Point", date: "2026-07-01", desc: "Thanh toán gói Giang Hồ Bát Phái", amount: "-120 Point", status: "Thành công" }
];

var mockMobileNotifications = [
    { id: "noti_1", icon: "fa-shield-alt", title: "Bật bảo mật 2 bước", body: "Tài khoản của bạn chưa bật đủ 2FA. Bật 2FA để bảo vệ giao dịch và thông tin đăng nhập.", time: "Hôm nay", read: false },
    { id: "noti_2", icon: "fa-coins", title: "Nạp Point thành công", body: "Bạn đã nạp 1.000 Point vào số dư MyVTC.", time: "Hôm qua", read: false },
    { id: "noti_3", icon: "fa-gift", title: "Voucher mới trong Kho đồ", body: "Bạn nhận được voucher giảm 10% khi nạp dịch vụ trong Shop.", time: "2 ngày trước", read: true },
    { id: "noti_4", icon: "fa-crown", title: "Cập nhật hạng thành viên", body: "Bạn cần thêm 480 EXP để đạt hạng Bạc trong chu kỳ hiện tại.", time: "3 ngày trước", read: true },
    { id: "noti_5", icon: "fa-list-check", title: "Nhiệm vụ mới", body: "Nhiệm vụ Liên kết Google đang có thể nhận +20 EXP.", time: "4 ngày trước", read: true }
];

function formatMobilePoints(value) {
    return Number(value || 0).toLocaleString("vi-VN") + " Points";
}

function setTextContent(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value || "--";
}

function renderMobileAccount() {
    saveMobileCurrentUser();
    var username = currentMobileUser.username || currentMobileUser.phone || currentMobileUser.email || "--";
    var balance = formatMobilePoints(currentMobileUser.balance);

    setTextContent("loggedInName", currentMobileUser.name);
    setTextContent("homeQuickUsername", username);
    setTextContent("homeQuickRank", currentMobileUser.rank);
    setTextContent("homeQuickBalance", balance);
    setTextContent("homeBalanceValue", balance);

    setTextContent("accountProfileName", currentMobileUser.name);
    setTextContent("accountProfileEmail", currentMobileUser.email || currentMobileUser.phone || username);
    setTextContent("accountQuickUsername", username);
    setTextContent("accountQuickRank", currentMobileUser.rank);
    setTextContent("accountQuickBalance", balance);
    setTextContent("mobileAccountUsername", username);
    setTextContent("mobileAccountNickname", currentMobileUser.nickname);
    setTextContent("mobileAccountFullname", currentMobileUser.name);
    setTextContent("mobileAccountId", currentMobileUser.id);
    setTextContent("mobileAccountCccd", currentMobileUser.cccd);
    setTextContent("mobileAccountAddress", currentMobileUser.address);
    setTextContent("mobileAccountGender", currentMobileUser.gender);
    setTextContent("mobileAccountBirthday", currentMobileUser.birthday);
    setTextContent("mobileAccountPhone", currentMobileUser.phone);
    setTextContent("mobileAccountEmail", currentMobileUser.email);

    var initial = (currentMobileUser.name || username || "A").trim().charAt(0).toUpperCase();
    setTextContent("accountAvatarInitial", initial);
    var avatarBtn = document.querySelector(".mobile-avatar-btn");
    var avatarImg = document.getElementById("mobileAccountAvatar");
    if (avatarImg && avatarBtn) {
        if (currentMobileUser.avatar) {
            avatarImg.src = currentMobileUser.avatar;
            avatarBtn.classList.add("has-image");
        } else {
            avatarImg.removeAttribute("src");
            avatarBtn.classList.remove("has-image");
        }
    }

    renderMobileTransactions();
    renderMobileAccountBag();
    renderMobileAccountInvite();
    renderMobileNotifications();
    renderMobileLanguage();
}

function showMobileAccountMenu() {
    var menu = document.getElementById("mobileAccountMenuView");
    var detail = document.getElementById("mobileAccountDetailView");
    if (menu) menu.classList.remove("hidden");
    if (detail) detail.classList.add("hidden");
    document.querySelectorAll("[data-account-panel]").forEach(function (button) {
        button.classList.remove("active");
    });
    var content = document.querySelector('[data-screen="account"] .app-content');
    if (content) content.scrollTop = 0;
}

function showMobileAccountPanel(panel, skipRender) {
    mobileAccountState.activePanel = panel || "personal";
    var menu = document.getElementById("mobileAccountMenuView");
    var detail = document.getElementById("mobileAccountDetailView");
    var title = document.getElementById("mobileAccountDetailTitle");
    if (menu) menu.classList.add("hidden");
    if (detail) detail.classList.remove("hidden");
    if (title) title.textContent = mobileAccountPanelTitles[mobileAccountState.activePanel] || "Tài khoản";
    document.querySelectorAll("[data-account-panel]").forEach(function (button) {
        button.classList.toggle("active", button.dataset.accountPanel === mobileAccountState.activePanel);
    });
    document.querySelectorAll("[data-account-panel-content]").forEach(function (section) {
        section.classList.toggle("active", section.dataset.accountPanelContent === mobileAccountState.activePanel);
    });
    if (!skipRender && mobileAccountState.activePanel === "transactions") renderMobileTransactions();
    if (!skipRender && mobileAccountState.activePanel === "bag") renderMobileAccountBag();
    if (!skipRender && mobileAccountState.activePanel === "invite") renderMobileAccountInvite();
    if (!skipRender && mobileAccountState.activePanel === "notifications") renderMobileNotifications();
    if (!skipRender && mobileAccountState.activePanel === "language") renderMobileLanguage();
    var content = document.querySelector('[data-screen="account"] .app-content');
    if (content) content.scrollTop = 0;
}

function openMobileAccountModal(type) {
    closeMobileAccountModal();
    var modal = document.createElement("div");
    modal.className = "mobile-account-modal";
    modal.id = "mobileAccountModal";

    if (type === "avatar") {
        modal.innerHTML = [
            '<div class="mobile-account-modal-card">',
            '<div class="mobile-account-modal-head"><div><h3>Thay đổi ảnh đại diện</h3><p>Ảnh hồ sơ giúp nhận biết tài khoản đang đăng nhập.</p></div><button class="mobile-account-modal-close" type="button" data-close-mobile-modal>×</button></div>',
            '<img class="mobile-account-avatar-preview" id="mobileAvatarPreview" src="' + escapeHtml(currentMobileUser.avatar || '') + '" alt="Avatar" onerror="this.style.display=\'none\'">',
            '<input type="file" id="mobileAvatarFile" accept="image/*">',
            '<div class="mobile-account-modal-actions"><button class="secondary" type="button" data-close-mobile-modal>Hủy</button><button type="button" id="saveMobileAvatar">Cập nhật</button></div>',
            '</div>'
        ].join('');
    }

    if (type === "nickname") {
        modal.innerHTML = [
            '<div class="mobile-account-modal-card">',
            '<div class="mobile-account-modal-head"><div><h3>Cập nhật Nickname</h3><p>Nickname 4 đến 50 ký tự, không nhập ký tự đặc biệt.</p></div><button class="mobile-account-modal-close" type="button" data-close-mobile-modal>×</button></div>',
            '<label>Nickname</label><input type="text" id="mobileEditNickname" maxlength="50" value="' + escapeHtml(currentMobileUser.nickname || '') + '">',
            '<div class="mobile-account-modal-actions"><button class="secondary" type="button" data-close-mobile-modal>Hủy</button><button type="button" id="saveMobileNickname">Cập nhật</button></div>',
            '</div>'
        ].join('');
    }

    if (type === "basic") {
        modal.innerHTML = [
            '<div class="mobile-account-modal-card">',
            '<div class="mobile-account-modal-head"><div><h3>Thay đổi thông tin cá nhân</h3><p>' + escapeHtml(currentMobileUser.phone || currentMobileUser.username || '') + '</p></div><button class="mobile-account-modal-close" type="button" data-close-mobile-modal>×</button></div>',
            '<label>Họ và tên</label><input type="text" id="mobileEditFullname" value="' + escapeHtml(currentMobileUser.name || '') + '">',
            '<label>Giới tính</label><select id="mobileEditGender"><option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option></select>',
            '<label>Ngày sinh</label><input type="date" id="mobileEditBirthday" value="' + escapeHtml(currentMobileUser.birthday || '') + '">',
            '<label>Địa chỉ</label><input type="text" id="mobileEditAddress" value="' + escapeHtml(currentMobileUser.address || '') + '">',
            '<label>Số CCCD</label><input type="text" id="mobileEditCccd" maxlength="12" value="' + escapeHtml(currentMobileUser.cccd || '') + '">',
            '<div class="mobile-account-modal-actions"><button class="secondary" type="button" data-close-mobile-modal>Hủy</button><button type="button" id="saveMobileBasicInfo">Cập nhật</button></div>',
            '</div>'
        ].join('');
    }

    document.body.appendChild(modal);
    var gender = document.getElementById("mobileEditGender");
    if (gender) gender.value = currentMobileUser.gender || "Nữ";
}

function closeMobileAccountModal() {
    var modal = document.getElementById("mobileAccountModal");
    if (modal) modal.remove();
    mobileAccountState.pendingAvatar = null;
}

function saveMobileNickname() {
    var input = document.getElementById("mobileEditNickname");
    var value = input ? input.value.trim() : "";
    if (!/^[a-zA-Z0-9À-ỹ\s]{4,50}$/.test(value)) {
        showMobileToast("Nickname 4 đến 50 ký tự, không nhập ký tự đặc biệt.", "info");
        return;
    }
    currentMobileUser.nickname = value;
    saveMobileCurrentUser();
    closeMobileAccountModal();
    renderMobileAccount();
    showMobileToast("Cập nhật Nickname thành công.", "success");
}

function saveMobileBasicInfo() {
    var name = (document.getElementById("mobileEditFullname") || {}).value || "";
    var gender = (document.getElementById("mobileEditGender") || {}).value || "";
    var birthday = (document.getElementById("mobileEditBirthday") || {}).value || "";
    var address = (document.getElementById("mobileEditAddress") || {}).value || "";
    var cccd = (document.getElementById("mobileEditCccd") || {}).value || "";
    name = name.trim();
    address = address.trim();
    cccd = cccd.trim();

    if (!/^[A-Za-zÀ-ỹ\s]{2,80}$/.test(name)) {
        showMobileToast("Họ và tên chưa hợp lệ.", "info");
        return;
    }
    if (!birthday) {
        showMobileToast("Vui lòng chọn ngày sinh.", "info");
        return;
    }
    if (!/^\d{12}$/.test(cccd)) {
        showMobileToast("CCCD phải đủ 12 số.", "info");
        return;
    }

    currentMobileUser.name = name;
    currentMobileUser.gender = gender;
    currentMobileUser.birthday = birthday;
    currentMobileUser.address = address;
    currentMobileUser.cccd = cccd;
    saveMobileCurrentUser();
    closeMobileAccountModal();
    renderMobileAccount();
    showMobileToast("Cập nhật thông tin cá nhân thành công.", "success");
}

function saveMobileAvatar() {
    if (!mobileAccountState.pendingAvatar) {
        showMobileToast("Vui lòng chọn ảnh trước khi cập nhật.", "info");
        return;
    }
    currentMobileUser.avatar = mobileAccountState.pendingAvatar;
    saveMobileCurrentUser();
    closeMobileAccountModal();
    renderMobileAccount();
    showMobileToast("Cập nhật ảnh đại diện thành công.", "success");
}

function openMobilePaymentModal(type) {
    closeMobileAccountModal();
    var modal = document.createElement("div");
    modal.className = "mobile-account-modal";
    modal.id = "mobileAccountModal";
    if (type === "billing-address") {
        modal.innerHTML = [
            '<div class="mobile-account-modal-card">',
            '<div class="mobile-account-modal-head"><div><h3>Thêm địa chỉ thanh toán</h3><p>Dùng cho hóa đơn và đối soát giao dịch.</p></div><button class="mobile-account-modal-close" type="button" data-close-mobile-modal>×</button></div>',
            '<label>Họ tên</label><input type="text" id="mobileBillingName" value="' + escapeHtml(currentMobileUser.name || '') + '">',
            '<label>Địa chỉ</label><textarea id="mobileBillingInput">' + escapeHtml(currentMobileUser.address || '') + '</textarea>',
            '<div class="mobile-account-modal-actions"><button class="secondary" type="button" data-close-mobile-modal>Hủy</button><button type="button" id="saveMobileBillingAddress">Lưu</button></div>',
            '</div>'
        ].join('');
    } else {
        modal.innerHTML = [
            '<div class="mobile-account-modal-card">',
            '<div class="mobile-account-modal-head"><div><h3>Thêm phương thức thanh toán</h3><p>Chọn thẻ ATM nội địa hoặc thẻ quốc tế.</p></div><button class="mobile-account-modal-close" type="button" data-close-mobile-modal>×</button></div>',
            '<label>Loại thẻ</label><select id="mobilePaymentType"><option value="international">Thẻ quốc tế</option><option value="atm">ATM nội địa</option></select>',
            '<label>Nhà cung cấp</label><select id="mobilePaymentProvider"><option>Visa</option><option>Master</option><option>JCB</option><option>VietcomBank</option><option>Techcombank</option><option>BIDV</option></select>',
            '<label>Số thẻ</label><input type="text" id="mobilePaymentNumber" maxlength="19" placeholder="Nhập số thẻ">',
            '<label>Ngày hiệu lực hoặc hết hạn</label><input type="month" id="mobilePaymentDate">',
            '<div class="mobile-account-modal-actions"><button class="secondary" type="button" data-close-mobile-modal>Hủy</button><button type="button" id="saveMobilePaymentMethod">Lưu</button></div>',
            '</div>'
        ].join('');
    }
    document.body.appendChild(modal);
}

function saveMobilePaymentMethod() {
    var type = (document.getElementById("mobilePaymentType") || {}).value || "international";
    var provider = (document.getElementById("mobilePaymentProvider") || {}).value || "Visa";
    var cardNumber = ((document.getElementById("mobilePaymentNumber") || {}).value || "").trim();
    var cardDate = (document.getElementById("mobilePaymentDate") || {}).value || "";
    if (cardNumber.length < 12) {
        showMobileToast("Vui lòng nhập số thẻ hợp lệ.", "info");
        return;
    }
    if (!cardDate) {
        showMobileToast("Vui lòng chọn ngày hiệu lực hoặc ngày hết hạn.", "info");
        return;
    }
    setTextContent("mobileSavedPaymentName", provider);
    setTextContent("mobileSavedPaymentDetail", (type === "international" ? "Thẻ quốc tế đã lưu" : "Thẻ ATM đã lưu") + " • ***" + cardNumber.slice(-4));
    closeMobileAccountModal();
    showMobileToast("Đã lưu phương thức thanh toán.", "success");
}

function saveMobileBillingAddress() {
    var address = ((document.getElementById("mobileBillingInput") || {}).value || "").trim();
    if (address.length < 5) {
        showMobileToast("Vui lòng nhập địa chỉ thanh toán.", "info");
        return;
    }
    currentMobileUser.address = address;
    saveMobileCurrentUser();
    setTextContent("mobileBillingAddress", address);
    closeMobileAccountModal();
    renderMobileAccount();
    showMobileToast("Đã lưu địa chỉ thanh toán.", "success");
}

function parseMobileTransactionDate(value) {
    if (!value) return null;
    var date = new Date(value + "T00:00:00");
    return isNaN(date.getTime()) ? null : date;
}

function renderMobileTransactions() {
    var list = document.getElementById("mobileTransactionList");
    if (!list) return;
    var type = (document.getElementById("mobileTransactionType") || {}).value || "";
    var startValue = (document.getElementById("mobileTransactionStart") || {}).value || "";
    var endValue = (document.getElementById("mobileTransactionEnd") || {}).value || "";
    var search = (((document.getElementById("mobileTransactionSearch") || {}).value || "").trim()).toLowerCase();
    var start = parseMobileTransactionDate(startValue);
    var end = parseMobileTransactionDate(endValue);

    if (start && end) {
        var dayDiff = Math.round((end - start) / (1000 * 60 * 60 * 24));
        if (dayDiff < 0) {
            showMobileToast("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.", "info");
            return;
        }
        if (dayDiff > 90) {
            showMobileToast("Khoảng thời gian tra cứu không quá 90 ngày.", "info");
            return;
        }
    }

    var rows = mobileTransactions.filter(function (item) {
        var itemDate = parseMobileTransactionDate(item.date);
        var haystack = (item.code + " " + item.desc + " " + item.type + " " + item.status).toLowerCase();
        if (type && item.type !== type) return false;
        if (start && itemDate && itemDate < start) return false;
        if (end && itemDate && itemDate > end) return false;
        if (search && haystack.indexOf(search) === -1) return false;
        return true;
    });

    list.innerHTML = rows.map(function (item) {
        var amountClass = item.amount.charAt(0) === "+" ? "plus" : "minus";
        return '<article class="mobile-transaction-item"><strong>' + escapeHtml(item.type) + '</strong><p>' + escapeHtml(item.desc) + '</p><div class="mobile-transaction-meta"><span>' + escapeHtml(item.date) + ' • ' + escapeHtml(item.code) + '</span><span class="mobile-transaction-amount ' + amountClass + '">' + escapeHtml(item.amount) + '</span></div><p>' + escapeHtml(item.status) + '</p></article>';
    }).join('');

    var empty = document.getElementById("mobileTransactionEmpty");
    if (empty) empty.classList.toggle("hidden", rows.length > 0);
}

function resetMobileTransactionFilters() {
    ["mobileTransactionType", "mobileTransactionStart", "mobileTransactionEnd", "mobileTransactionSearch"].forEach(function (id) {
        var input = document.getElementById(id);
        if (input) input.value = "";
    });
    renderMobileTransactions();
}

function getMobileNotifications() {
    var saved = localStorage.getItem("myvtc_account_notifications_mobile");
    if (saved) {
        try { return JSON.parse(saved); } catch (error) {}
    }
    localStorage.setItem("myvtc_account_notifications_mobile", JSON.stringify(mockMobileNotifications));
    return mockMobileNotifications;
}

function saveMobileNotifications(items) {
    localStorage.setItem("myvtc_account_notifications_mobile", JSON.stringify(items));
}

function renderMobileNotifications() {
    var list = document.getElementById("mobileNotificationList");
    if (!list) return;
    var items = getMobileNotifications();
    if (!items.length) {
        list.innerHTML = '<div class="mobile-notification-empty">Không có thông báo mới.</div>';
        return;
    }
    list.innerHTML = items.map(function (item) {
        return '<article class="mobile-notification-item ' + (item.read ? '' : 'unread') + '"><i class="fas ' + escapeHtml(item.icon) + '"></i><div><h4>' + escapeHtml(item.title) + '</h4><p>' + escapeHtml(item.body) + '</p></div><time>' + escapeHtml(item.time) + '</time></article>';
    }).join('');
}

function markMobileNotificationsRead() {
    var items = getMobileNotifications().map(function (item) { return Object.assign({}, item, { read: true }); });
    saveMobileNotifications(items);
    renderMobileNotifications();
    showMobileToast("Đã đánh dấu tất cả thông báo là đã đọc.", "success");
}

function clearMobileReadNotifications() {
    var items = getMobileNotifications().filter(function (item) { return !item.read; });
    saveMobileNotifications(items);
    renderMobileNotifications();
    showMobileToast("Đã ẩn thông báo đã đọc.", "success");
}

function renderMobileLanguage() {
    document.querySelectorAll("[data-language]").forEach(function (button) {
        button.classList.toggle("active", button.dataset.language === mobileAccountState.language);
    });
}

function changeMobileLanguage(language) {
    mobileAccountState.language = language;
    localStorage.setItem("myvtc_mobile_language", language);
    renderMobileLanguage();
    showMobileToast(language === "vi" ? "Đã chuyển sang Tiếng Việt." : "Language changed to English.", "success");
}

function handleMobileLinkedProvider(provider) {
    var labelId = provider === "Google" ? "mobileGoogleName" : provider === "Facebook" ? "mobileFacebookName" : "mobileAppleName";
    var label = document.getElementById(labelId);
    if (!label) return;
    var isConnected = label.textContent.trim() !== "Chưa kết nối";
    label.textContent = isConnected ? "Chưa kết nối" : currentMobileUser.name;
    showMobileToast((isConnected ? "Đã ngắt kết nối " : "Đã kết nối ") + provider + ".", "success");
}

var mobileLoyaltyState = {
    activePanel: "rank",
    selectedRank: "dong",
    checkedInToday: localStorage.getItem("myvtc_mobile_loyalty_checked_in") === "1"
};

var mobileLoyaltyRankData = {
    dong: {
        label: "Hạng hiện tại",
        name: "Đồng",
        nextRank: "Bạc",
        exp: 20,
        cycleExp: 20,
        progress: "20 / 500 EXP",
        percent: 4,
        desc: "Điểm hiện tại của bạn là 20 / 500 EXP để xét hạng Bạc.",
        deadline: "Trước ngày 31/12/2026",
        missionDesc: "Để mở khóa quyền lợi hạng Bạc, người dùng cần hoàn thành 2 điều kiện:",
        missions: [
            { title: "Nạp 500 Points", desc: "Hoàn thành giao dịch nạp Points trong thời gian xét hạng.", action: "Nạp ngay" },
            { title: "Xác thực SĐT cho tài khoản MyVTC", desc: "Bổ sung và xác minh số điện thoại để bảo vệ tài khoản.", action: "Xác minh" }
        ],
        alert: "Thăng hạng Bạc để mở khóa các phần quà ưu đãi bên dưới.",
        benefits: [
            { icon: "fa-ticket-alt", title: "Voucher Nạp Points giảm giá 10%", desc: "Dành cho người dùng đạt hạng Bạc." },
            { icon: "fa-coins", title: "Thẻ Vcoin 10K", desc: "Quà tặng khi thăng hạng thành công." }
        ]
    },
    bac: {
        label: "Bạn chưa đạt hạng",
        name: "Bạc",
        nextRank: "Vàng",
        exp: 20,
        cycleExp: 20,
        progress: "20 / 2.000 EXP",
        percent: 1,
        desc: "Bạn cần đạt 500 / 2.000 EXP để xét hạng Vàng.",
        deadline: "",
        missionDesc: "Để mở khóa quyền lợi hạng Vàng, người dùng cần hoàn thành điều kiện thăng hạng:",
        missions: [
            { title: "Thăng hạng: Tích lũy 2.000 EXP", desc: "EXP được cộng từ giao dịch, nhiệm vụ và hoạt động hợp lệ.", action: "Xem nhiệm vụ" },
            { title: "Thăng hạng: Nạp 2.000 Points", desc: "Tổng nạp Points đạt ngưỡng trong chu kỳ xét hạng.", action: "Nạp ngay" },
            { title: "Thăng hạng: Hoàn thành 5 ngày điểm danh", desc: "Điểm danh đủ 5 ngày trong chu kỳ hiện tại.", action: "Điểm danh" },
            { title: "Duy trì hạng Bạc: Đạt 500 Cycle EXP", desc: "Nếu kết thúc chu kỳ mà không đạt 500 Cycle EXP, hệ thống giáng xuống hạng Đồng.", action: "Xem điều kiện" },
            { title: "Duy trì hạng Bạc: Có ít nhất 1 giao dịch hợp lệ", desc: "Giao dịch nạp hoặc thanh toán Points phát sinh trong chu kỳ duy trì.", action: "Xem lịch sử" }
        ],
        alert: "Đạt hạng Vàng để nhận thêm voucher và EXP thưởng.",
        benefits: [
            { icon: "fa-ticket-alt", title: "Voucher giảm 15%", desc: "Áp dụng cho giao dịch nạp Points hợp lệ." },
            { icon: "fa-star", title: "Thưởng 100 EXP", desc: "Trao khi nâng hạng Vàng thành công." }
        ]
    },
    vang: {
        label: "Bạn chưa đạt hạng",
        name: "Vàng",
        nextRank: "Bạch Kim",
        exp: 20,
        cycleExp: 20,
        progress: "20 / 5.000 EXP",
        percent: 1,
        desc: "Bạn cần đạt 2.000 / 5.000 EXP để xét hạng Bạch Kim.",
        deadline: "",
        missionDesc: "Để mở khóa quyền lợi hạng Bạch Kim, người dùng cần hoàn thành điều kiện thăng hạng:",
        missions: [
            { title: "Thăng hạng: Tích lũy 5.000 EXP", desc: "EXP được tính trong chu kỳ xét hạng hiện tại.", action: "Xem tiến độ" },
            { title: "Thăng hạng: Nạp 5.000 Points", desc: "Tổng nạp Points đạt ngưỡng yêu cầu.", action: "Nạp ngay" },
            { title: "Thăng hạng: Mời 3 bạn mới", desc: "Bạn mới đăng ký và phát sinh hoạt động hợp lệ.", action: "Mời ngay" },
            { title: "Duy trì hạng Vàng: Đạt 2.000 Cycle EXP", desc: "Nếu kết thúc chu kỳ mà không đạt 2.000 Cycle EXP, hệ thống giáng xuống hạng Bạc.", action: "Xem điều kiện" },
            { title: "Duy trì hạng Vàng: Có hoạt động trong 30 ngày gần nhất", desc: "Hoạt động hợp lệ gồm đăng nhập, nạp Points, thanh toán Points hoặc nhận nhiệm vụ.", action: "Xem hoạt động" }
        ],
        alert: "Đạt hạng Bạch Kim để mở nhóm ưu đãi giá trị cao hơn.",
        benefits: [
            { icon: "fa-gift", title: "Voucher giảm 20%", desc: "Áp dụng theo cấu hình chương trình." },
            { icon: "fa-coins", title: "Thưởng 300 EXP", desc: "Trao khi nâng hạng Bạch Kim thành công." }
        ]
    },
    bachkim: {
        label: "Bạn chưa đạt hạng",
        name: "Bạch Kim",
        nextRank: "Kim Cương",
        exp: 20,
        cycleExp: 20,
        progress: "20 / 10.000 EXP",
        percent: 1,
        desc: "Bạn cần đạt 5.000 / 10.000 EXP để xét hạng Kim Cương.",
        deadline: "",
        missionDesc: "Để mở khóa quyền lợi hạng Kim Cương, người dùng cần hoàn thành điều kiện thăng hạng:",
        missions: [
            { title: "Thăng hạng: Tích lũy 10.000 EXP", desc: "EXP hợp lệ được cộng từ giao dịch và nhiệm vụ.", action: "Xem tiến độ" },
            { title: "Thăng hạng: Nạp 10.000 Points", desc: "Tổng nạp Points đạt ngưỡng trong chu kỳ.", action: "Nạp ngay" },
            { title: "Thăng hạng: Duy trì hoạt động 30 ngày", desc: "Có hoạt động hợp lệ trong 30 ngày gần nhất.", action: "Xem nhiệm vụ" },
            { title: "Duy trì hạng Bạch Kim: Đạt 5.000 Cycle EXP", desc: "Nếu kết thúc chu kỳ mà không đạt 5.000 Cycle EXP, hệ thống giáng xuống hạng Vàng.", action: "Xem điều kiện" },
            { title: "Duy trì hạng Bạch Kim: Có ít nhất 3 giao dịch hợp lệ", desc: "Giao dịch nạp hoặc thanh toán Points phát sinh trong chu kỳ duy trì.", action: "Xem lịch sử" }
        ],
        alert: "Đạt hạng Kim Cương để nhận quyền lợi cao nhất.",
        benefits: [
            { icon: "fa-crown", title: "Voucher đặc quyền 30%", desc: "Dành cho người dùng đạt hạng Kim Cương." },
            { icon: "fa-gem", title: "Quà nâng hạng cao nhất", desc: "Trao khi nâng hạng Kim Cương thành công." }
        ]
    },
    kimcuong: {
        label: "Bạn chưa đạt hạng",
        name: "Kim Cương",
        nextRank: "Cao nhất",
        exp: 20,
        cycleExp: 20,
        progress: "20 / 10.000 EXP",
        percent: 1,
        desc: "Hạng Kim Cương là hạng cao nhất của chương trình thành viên.",
        deadline: "Hạng duy trì vĩnh viễn",
        missionDesc: "Khi đạt hạng Kim Cương, người dùng được giữ hạng theo chính sách duy trì vĩnh viễn.",
        missions: [
            { title: "Duy trì thông tin tài khoản hợp lệ", desc: "SĐT, Email và thông tin định danh cần ở trạng thái hợp lệ.", action: "Kiểm tra" },
            { title: "Tiếp tục tham gia chương trình MyVTC", desc: "Tiếp tục nhận ưu đãi, voucher và quà tặng theo từng sự kiện.", action: "Xem ưu đãi" }
        ],
        alert: "Hạng Kim Cương có nhóm quyền lợi cao nhất trong chương trình.",
        benefits: [
            { icon: "fa-gem", title: "Đặc quyền Kim Cương", desc: "Nhận voucher và quà theo sự kiện riêng." },
            { icon: "fa-headset", title: "Ưu tiên hỗ trợ", desc: "Ưu tiên tiếp nhận yêu cầu hỗ trợ tài khoản." }
        ]
    }
};

var mobileLoyaltyPanelTitles = {
    rank: "Hạng thành viên",
    history: "Lịch sử EXP",
    missions: "Nhiệm vụ",
    checkin: "Điểm danh",
    voucher: "Voucher",
    events: "Sự kiện ưu đãi"
};

var mobileLoyaltyHistory = [
    { title: "Nhận thưởng từ Nhiệm vụ điểm danh", time: "25/06/2026 08:11", type: "EXP", value: "+10", note: "Hoàn thành chuỗi điểm danh." },
    { title: "Thu hồi 5 EXP từ Admin", time: "24/06/2026 10:30", type: "EXP", value: "-5", note: "Điều chỉnh demo." },
    { title: "Nhận thưởng từ Mời bạn mới", time: "21/06/2026 20:34", type: "EXP", value: "+10", note: "Bạn mới đủ điều kiện." },
    { title: "Nhận Voucher Nạp Points giảm giá 10%", time: "20/06/2026 09:00", type: "Voucher", value: "+1", note: "Trao theo chương trình ưu đãi." }
];

var mobileLoyaltyMissions = [
    { id: "login", title: "Đăng nhập hằng ngày", desc: "Đăng nhập MyVTC mỗi ngày.", reward: "+20 EXP", status: "Đã hoàn thành" },
    { id: "google", title: "Liên kết Google", desc: "Liên kết Google lần đầu.", reward: "+20 EXP", status: "Có thể nhận" },
    { id: "invite", title: "Mời bạn mới", desc: "Bạn mới đăng ký và đủ điều kiện.", reward: "+10 EXP", status: "Có thể nhận" },
    { id: "checkin", title: "Điểm danh hôm nay", desc: "Vào Loyalty và điểm danh.", reward: "+1 Point", status: "Có thể làm" },
    { id: "ekyc", title: "Xác minh eKYC", desc: "Hoàn thành định danh điện tử.", reward: "+60 EXP", status: "Đã hoàn thành" },
    { id: "bank", title: "Liên kết tài khoản ngân hàng", desc: "Liên kết thành công tài khoản ngân hàng hoặc thẻ.", reward: "+100 EXP", status: "Chưa làm" }
];

var mobileLoyaltyVouchers = [
    { title: "Voucher Nạp Points giảm giá 10%", code: "VTC10", expire: "31/12/2026", status: "Khả dụng", desc: "Áp dụng cho giao dịch nạp Points hợp lệ." },
    { title: "Voucher giảm 15% gói Audition", code: "AUD15", expire: "30/09/2026", status: "Chưa mở khóa", desc: "Mở khi đạt hạng Vàng." },
    { title: "Voucher đặc quyền 30%", code: "VIP30", expire: "31/12/2026", status: "Chưa mở khóa", desc: "Mở khi đạt hạng Kim Cương." }
];

var mobileLoyaltyBag = [
    { icon: "fa-ticket-alt", title: "Voucher Nạp Points giảm giá 10%", desc: "Còn hạn đến 31/12/2026.", status: "Chưa dùng" },
    { icon: "fa-coins", title: "Thẻ Vcoin 10K", desc: "Quà tặng khi thăng hạng.", status: "Đã nhận" },
    { icon: "fa-star", title: "EXP checkin hằng ngày", desc: "EXP cộng theo nhiệm vụ điểm danh.", status: "Khả dụng" }
];

var mobileLoyaltyEvents = [
    { title: "Nhân đôi EXP cuối tuần", desc: "Nạp Points và làm nhiệm vụ trong cuối tuần nhận x2 EXP.", time: "01/07/2026 đến 31/07/2026", status: "Đang diễn ra" },
    { title: "Ưu đãi sinh nhật", desc: "Nhận voucher theo tháng sinh nhật.", time: "Theo hồ sơ tài khoản", status: "Đang hoạt động" },
    { title: "Chào thành viên mới", desc: "Hoàn thành eKYC và liên kết tài khoản để nhận thưởng.", time: "Không giới hạn", status: "Đang hoạt động" }
];

var mobileLoyaltyInviteData = {
    code: "MYVTC-HONG-2026",
    link: "https://myvtc.vn/register?ref=MYVTC-HONG-2026",
    totalRewarded: 2,
    totalPending: 1,
    friends: [
        { name: "ng***01", status: "Đã nhận thưởng", reward: "+10 EXP", time: "25/06/2026 09:12" },
        { name: "mi***88", status: "Đã nhận thưởng", reward: "+10 EXP", time: "21/06/2026 20:34" },
        { name: "an***23", status: "Chờ đủ điều kiện", reward: "Chưa nhận", time: "18/06/2026 11:05" }
    ]
};

var mobileLoyaltyNotifications = [
    { icon: "fa-crown", title: "Cập nhật hạng thành viên", body: "Bạn cần thêm 480 EXP để đạt hạng Bạc trong chu kỳ hiện tại.", time: "3 ngày trước", read: true },
    { icon: "fa-gift", title: "Voucher mới trong Kho đồ", body: "Bạn nhận được voucher giảm 10% khi nạp dịch vụ trong Shop.", time: "2 ngày trước", read: true },
    { icon: "fa-calendar-check", title: "Nhắc điểm danh", body: "Bạn còn lượt điểm danh hôm nay để nhận +1 Point.", time: "Hôm nay", read: false }
];

function renderMobileLoyaltyOverview() {
    var data = mobileLoyaltyRankData.dong;
    if (!data) return;
    setTextContent("mobileLoyaltyRankName", "Hạng " + data.name);
    setTextContent("mobileLoyaltyRankDesc", "");
    setTextContent("mobileLoyaltyExp", String(data.exp));
    setTextContent("mobileLoyaltyCycleExp", String(data.cycleExp));
    setTextContent("mobileLoyaltyNextRank", data.nextRank);
    setTextContent("mobileLoyaltyProgressText", data.progress);
    setTextContent("mobileLoyaltyDeadline", data.deadline || "Trước ngày 31/12/2026");
    var fill = document.getElementById("mobileLoyaltyProgressFill");
    if (fill) fill.style.width = data.percent + "%";
}

function showMobileLoyaltyMenu() {
    var menu = document.getElementById("mobileLoyaltyMenuView");
    var detail = document.getElementById("mobileLoyaltyDetailView");
    if (menu) menu.classList.remove("hidden");
    if (detail) detail.classList.add("hidden");
    renderMobileLoyaltyOverview();
    var content = document.querySelector('[data-screen="service-auth"] .app-content');
    if (content) content.scrollTop = 0;
}

function showMobileLoyaltyPanel(panel) {
    mobileLoyaltyState.activePanel = panel || "rank";
    var menu = document.getElementById("mobileLoyaltyMenuView");
    var detail = document.getElementById("mobileLoyaltyDetailView");
    var title = document.getElementById("mobileLoyaltyDetailTitle");
    if (menu) menu.classList.add("hidden");
    if (detail) detail.classList.remove("hidden");
    if (title) title.textContent = mobileLoyaltyPanelTitles[mobileLoyaltyState.activePanel] || "Loyalty";
    renderMobileLoyaltyPanel();
    var content = document.querySelector('[data-screen="service-auth"] .app-content');
    if (content) content.scrollTop = 0;
}

function renderMobileLoyaltyPanel() {
    var wrap = document.getElementById("mobileLoyaltyDetailContent");
    if (!wrap) return;
    var panel = mobileLoyaltyState.activePanel;
    if (panel === "rank") wrap.innerHTML = getMobileLoyaltyRankHtml();
    if (panel === "history") wrap.innerHTML = getMobileLoyaltyHistoryHtml();
    if (panel === "missions") wrap.innerHTML = getMobileLoyaltyMissionsHtml();
    if (panel === "checkin") wrap.innerHTML = getMobileLoyaltyCheckinHtml();
    if (panel === "voucher") wrap.innerHTML = getMobileLoyaltyVoucherHtml();
    if (panel === "bag") wrap.innerHTML = getMobileLoyaltyBagHtml();
    if (panel === "events") wrap.innerHTML = getMobileLoyaltyEventsHtml();
    if (panel === "invite") wrap.innerHTML = getMobileLoyaltyInviteHtml();
    if (panel === "notifications") wrap.innerHTML = getMobileLoyaltyNotificationsHtml();
}

function getMobileLoyaltyRankHtml() {
    var data = mobileLoyaltyRankData[mobileLoyaltyState.selectedRank] || mobileLoyaltyRankData.dong;
    var buttons = Object.keys(mobileLoyaltyRankData).map(function (key) {
        var item = mobileLoyaltyRankData[key];
        return '<button type="button" class="' + (key === mobileLoyaltyState.selectedRank ? 'active' : '') + '" data-loyalty-rank="' + key + '">' + escapeHtml(item.name) + '</button>';
    }).join('');
    var upgrade = data.missions.filter(function (item) { return item.title.indexOf("Duy trì") !== 0; });
    var maintain = data.missions.filter(function (item) { return item.title.indexOf("Duy trì") === 0; });
    return [
        '<div class="mobile-loyalty-rank-switch">' + buttons + '</div>',
        '<section class="mobile-loyalty-card">',
        '<p class="eyebrow">' + escapeHtml(data.label) + '</p>',
        '<h2>Hạng ' + escapeHtml(data.name) + '</h2>',
        '<div class="mobile-loyalty-progress-head"><span>Tích lũy EXP</span><strong>' + escapeHtml(data.progress) + '</strong></div>',
        '<div class="mobile-loyalty-progress"><span style="width:' + data.percent + '%"></span></div>',
        data.deadline ? '<small class="mobile-loyalty-deadline">' + escapeHtml(data.deadline) + '</small>' : '',
        '</section>',
        '<section class="mobile-loyalty-card"><h3>Nhiệm vụ thăng hạng</h3>' + renderMobileLoyaltyTaskList(upgrade, "mission") + '</section>',
        maintain.length ? '<section class="mobile-loyalty-card"><h3>Duy trì hạng</h3>' + renderMobileLoyaltyTaskList(maintain, "mission") + '</section>' : '',
        '<section class="mobile-loyalty-card"><h3>Quyền lợi theo hạng</h3><div class="mobile-loyalty-benefit-list">' + data.benefits.map(function (item, index) { return '<article class="clickable" data-loyalty-info="benefit" data-loyalty-info-index="' + index + '" data-loyalty-info-title="' + escapeHtml(item.title) + '" data-loyalty-info-desc="' + escapeHtml(item.desc || "") + '" data-loyalty-info-action="Nhận"><i class="fa ' + escapeHtml(item.icon) + '"></i><div><strong>' + escapeHtml(item.title) + '</strong></div><button type="button" data-loyalty-info="benefit" data-loyalty-info-index="' + index + '" aria-label="Xem quyền lợi"><i class="fa fa-chevron-right"></i></button></article>'; }).join('') + '</div></section>'
    ].join('');
}

function renderMobileLoyaltyTaskList(items) {
    return '<div class="mobile-loyalty-task-list">' + items.map(function (item, index) {
        return '<article class="clickable" data-loyalty-info="mission" data-loyalty-info-index="' + index + '" data-loyalty-info-title="' + escapeHtml(item.title) + '" data-loyalty-info-desc="' + escapeHtml(item.desc || "") + '" data-loyalty-info-action="' + escapeHtml(item.action || "Chi tiết") + '"><div><strong>' + escapeHtml(item.title) + '</strong></div><button type="button" data-loyalty-info="mission" data-loyalty-info-index="' + index + '" aria-label="Xem nhiệm vụ"><i class="fa fa-chevron-right"></i></button></article>';
    }).join('') + '</div>';
}

function getMobileLoyaltyHistoryHtml() {
    return '<div class="mobile-loyalty-list">' + mobileLoyaltyHistory.map(function (item, index) {
        var positive = item.value.charAt(0) !== '-';
        return '<article class="mobile-loyalty-row"><span class="mobile-loyalty-index">#' + (index + 1) + '</span><div><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.time) + ' • ' + escapeHtml(item.type) + '</small><p>' + escapeHtml(item.note) + '</p></div><b class="' + (positive ? 'plus' : 'minus') + '">' + escapeHtml(item.value) + '</b></article>';
    }).join('') + '</div>';
}

function getMobileLoyaltyMissionsHtml() {
    return '<div class="mobile-loyalty-list">' + mobileLoyaltyMissions.map(function (item) {
        return '<article class="mobile-loyalty-row"><i class="fa fa-list-check"></i><div><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.desc) + '</small><p>' + escapeHtml(item.status) + '</p></div><button type="button" data-loyalty-mission="' + escapeHtml(item.id) + '">' + escapeHtml(item.reward) + '</button></article>';
    }).join('') + '</div>';
}

function getMobileLoyaltyCheckinHtml() {
    var done = mobileLoyaltyState.checkedInToday;
    return [
        '<section class="mobile-loyalty-card checkin">',
        '<div class="mobile-loyalty-checkin-head"><i class="fa fa-trophy"></i><div><h3>Nhiệm vụ điểm danh</h3><p>Vào mỗi ngày để giữ chuỗi và nhận Point.</p></div></div>',
        '<div class="mobile-loyalty-stats"><div><span>Chuỗi hiện tại</span><strong>' + (done ? '4/7' : '3/7') + '</strong></div><div><span>Thưởng hôm nay</span><strong>+1 Point</strong></div><div><span>Mốc 7 ngày</span><strong>+10 Point</strong></div></div>',
        '<div class="mobile-loyalty-checkin-grid"><span class="done">T2</span><span class="done">T3</span><span class="done">T4</span><span class="' + (done ? 'done' : 'today') + '">T5</span><span>T6</span><span>T7</span><span>CN</span></div>',
        '<button class="primary-btn wide" type="button" data-loyalty-action="checkin">' + (done ? 'Đã điểm danh hôm nay' : 'Điểm danh hôm nay') + '</button>',
        '</section>'
    ].join('');
}

function getMobileLoyaltyVoucherHtml() {
    return '<div class="mobile-loyalty-list">' + mobileLoyaltyVouchers.map(function (item) {
        return '<article class="mobile-loyalty-row"><i class="fa fa-ticket"></i><div><strong>' + escapeHtml(item.title) + '</strong><small>Mã ' + escapeHtml(item.code) + ' • HSD ' + escapeHtml(item.expire) + '</small><p>' + escapeHtml(item.desc) + '</p></div><button type="button" data-loyalty-voucher="' + escapeHtml(item.code) + '">' + escapeHtml(item.status) + '</button></article>';
    }).join('') + '</div>';
}

function getMobileLoyaltyBagHtml() {
    return '<div class="mobile-loyalty-list">' + mobileLoyaltyBag.map(function (item) {
        return '<article class="mobile-loyalty-row"><i class="fa ' + escapeHtml(item.icon) + '"></i><div><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.desc) + '</small></div><button type="button" data-loyalty-action="bag-item">' + escapeHtml(item.status) + '</button></article>';
    }).join('') + '</div>';
}

function getMobileLoyaltyEventsHtml() {
    return '<div class="mobile-loyalty-list">' + mobileLoyaltyEvents.map(function (item) {
        return '<article class="mobile-loyalty-row"><i class="fa fa-gift"></i><div><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.time) + '</small><p>' + escapeHtml(item.desc) + '</p></div><button type="button" data-loyalty-action="event">' + escapeHtml(item.status) + '</button></article>';
    }).join('') + '</div>';
}

function getMobileLoyaltyInviteHtml() {
    return [
        '<section class="mobile-loyalty-card">',
        '<h3>Mời bạn bè</h3><p>Gửi mã hoặc link cho bạn bè. Bạn mới nhập mã và hoàn thành điều kiện thì hai bên nhận thưởng.</p>',
        '<div class="mobile-loyalty-copy-box"><span>Mã mời của bạn</span><strong id="mobileLoyaltyInviteCode">' + escapeHtml(mobileLoyaltyInviteData.code) + '</strong><button type="button" data-loyalty-copy="code">Copy mã</button></div>',
        '<div class="mobile-loyalty-copy-box"><span>Link chia sẻ</span><strong id="mobileLoyaltyInviteLink">' + escapeHtml(mobileLoyaltyInviteData.link) + '</strong><button type="button" data-loyalty-copy="link">Copy link</button></div>',
        '<label class="mobile-loyalty-ref-label">Nhập mã mời của người khác</label><div class="mobile-loyalty-ref-row"><input id="mobileLoyaltyRefCode" type="text" placeholder="Nhập mã mời"><button type="button" data-loyalty-action="referral">Nhận thưởng</button></div>',
        '</section>',
        '<section class="mobile-loyalty-card"><h3>Lịch sử mời bạn bè</h3><div class="mobile-loyalty-stats"><div><span>Đã thưởng</span><strong>' + mobileLoyaltyInviteData.totalRewarded + '</strong></div><div><span>Đang chờ</span><strong>' + mobileLoyaltyInviteData.totalPending + '</strong></div></div><div class="mobile-loyalty-list compact">' + mobileLoyaltyInviteData.friends.map(function (item) { return '<article class="mobile-loyalty-row"><i class="fa fa-user"></i><div><strong>' + escapeHtml(item.name) + '</strong><small>' + escapeHtml(item.time) + '</small></div><b>' + escapeHtml(item.status) + '</b></article>'; }).join('') + '</div></section>'
    ].join('');
}

function renderMobileAccountBag() {
    var wrap = document.getElementById("mobileAccountBagContent");
    if (wrap) wrap.innerHTML = getMobileLoyaltyBagHtml();
}

function renderMobileAccountInvite() {
    var wrap = document.getElementById("mobileAccountInviteContent");
    if (wrap) wrap.innerHTML = getMobileLoyaltyInviteHtml();
}

function getMobileLoyaltyNotificationsHtml() {
    return '<div class="mobile-loyalty-list">' + mobileLoyaltyNotifications.map(function (item) {
        return '<article class="mobile-loyalty-row ' + (item.read ? '' : 'unread') + '"><i class="fa ' + escapeHtml(item.icon) + '"></i><div><strong>' + escapeHtml(item.title) + '</strong><small>' + escapeHtml(item.time) + '</small><p>' + escapeHtml(item.body) + '</p></div></article>';
    }).join('') + '</div><button class="primary-btn wide" type="button" data-loyalty-action="mark-notify-read">Đánh dấu đã đọc</button>';
}

function selectMobileLoyaltyRank(rankKey) {
    if (!mobileLoyaltyRankData[rankKey]) return;
    mobileLoyaltyState.selectedRank = rankKey;
    renderMobileLoyaltyPanel();
}

function copyMobileLoyaltyText(text, successMessage) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
            showMobileToast(successMessage, "success");
        }).catch(function () {
            fallbackMobileLoyaltyCopy(text, successMessage);
        });
        return;
    }
    fallbackMobileLoyaltyCopy(text, successMessage);
}

function fallbackMobileLoyaltyCopy(text, successMessage) {
    var input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    showMobileToast(successMessage, "success");
}

function handleMobileLoyaltyAction(action) {
    if (action === "notify") {
        showMobileScreen("account");
        showMobileAccountPanel("notifications");
        return;
    }
    if (action === "checkin") {
        if (mobileLoyaltyState.checkedInToday) {
            showMobileToast("Bạn đã điểm danh hôm nay.", "info");
            return;
        }
        mobileLoyaltyState.checkedInToday = true;
        localStorage.setItem("myvtc_mobile_loyalty_checked_in", "1");
        showMobileToast("Điểm danh thành công, bạn nhận +1 Point.", "success");
        renderMobileLoyaltyPanel();
        return;
    }
    if (action === "referral") {
        var input = document.getElementById("mobileLoyaltyRefCode");
        var code = input ? input.value.trim() : "";
        if (!code) {
            showMobileToast("Vui lòng nhập mã mời.", "info");
            return;
        }
        showMobileToast("Đã ghi nhận mã mời, chờ kiểm tra điều kiện nhận thưởng.", "success");
        return;
    }
    if (action === "mark-notify-read") {
        mobileLoyaltyNotifications.forEach(function (item) { item.read = true; });
        showMobileToast("Đã đánh dấu thông báo Loyalty là đã đọc.", "success");
        renderMobileLoyaltyPanel();
        return;
    }
    if (action === "locked-reward") {
        showMobileToast("Quyền lợi mở khi bạn đạt hạng tương ứng.", "info");
        return;
    }
    showMobileToast("Đã ghi nhận thao tác Loyalty.", "success");
}

function claimMobileLoyaltyMission(missionId) {
    var mission = mobileLoyaltyMissions.find(function (item) { return item.id === missionId; });
    if (!mission) return;
    if (mission.id === "checkin") {
        handleMobileLoyaltyAction("checkin");
        return;
    }
    if (mission.status === "Chưa làm") {
        showMobileToast("Bạn chưa đủ điều kiện nhận thưởng nhiệm vụ này.", "info");
        return;
    }
    showMobileToast("Đã nhận thưởng nhiệm vụ: " + mission.title + ".", "success");
}

function handleMobileLoyaltyVoucher(code) {
    var voucher = mobileLoyaltyVouchers.find(function (item) { return item.code === code; });
    if (!voucher) return;
    if (voucher.status !== "Khả dụng") {
        showMobileToast("Voucher chưa mở khóa hoặc chưa đủ điều kiện dùng.", "info");
        return;
    }
    showMobileToast("Đã áp dụng thử voucher " + voucher.code + ".", "success");
}

function openMobileLoyaltyInfoPopup(kind, index, titleFromNode, descFromNode, actionFromNode) {
    var data = mobileLoyaltyRankData[mobileLoyaltyState.selectedRank] || mobileLoyaltyRankData.dong;
    var item;
    var title = kind === "benefit" ? "Thông tin quyền lợi" : "Thông tin nhiệm vụ";
    if (kind === "benefit") {
        item = (data.benefits || [])[Number(index || 0)];
    } else {
        var upgrade = (data.missions || []).filter(function (task) { return task.title.indexOf("Duy trì") !== 0; });
        item = upgrade[Number(index || 0)] || (data.missions || [])[Number(index || 0)];
    }
    if (titleFromNode) {
        item = { title: titleFromNode, desc: descFromNode || "", action: actionFromNode || (kind === "benefit" ? "Nhận" : "Chi tiết") };
    }
    if (!item) return;
    var modal = document.createElement("div");
    modal.className = "mobile-account-modal";
    modal.id = "mobileAccountModal";
    modal.innerHTML = [
        '<div class="mobile-account-modal-card">',
        '<div class="mobile-account-modal-head"><div><h3>' + title + '</h3><p>' + escapeHtml(item.title) + '</p></div><button class="mobile-account-modal-close" type="button" data-close-mobile-modal>×</button></div>',
        '<div class="mobile-loyalty-popup-body"><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.desc || "") + '</p></div>',
        '<div class="mobile-account-modal-actions"><button class="secondary" type="button" data-close-mobile-modal>Đóng</button><button type="button" data-loyalty-task-action="' + escapeHtml(item.action || "Chi tiết") + '">' + escapeHtml(item.action || "Chi tiết") + '</button></div>',
        '</div>'
    ].join("");
    document.body.appendChild(modal);
}


// ================================================================
//  MOBILE SHOP
// ================================================================
var mobileShopServices = [
    { slug: "nap-so-du-myvtc", name: "Nạp số dư MyVTC", icon: "P", iconImg: "icon/icon_001.jpg", thumb: "thumbnail/thumb_001.png", type: "balance", typeLabel: "Số dư", linkedAccount: "hongtran", allowGuestTopup: true, isBalanceTopup: true, desc: "Nạp Points vào tài khoản chung." },
    { slug: "audition-pc", name: "Audition PC", icon: "AU", iconImg: "icon/icon_002.jpg", thumb: "thumbnail/thumb_002.png", type: "pc", typeLabel: "PC", linkedAccount: "hongtran_AU", allowGuestTopup: true, desc: "Gói dịch vụ và vật phẩm PC.", packageFilters: [
        { id: "diamond", name: "Nạp Kim Cương" },
        { id: "golden", name: "Gói ưu đãi" },
        { id: "star", name: "Gói Đại lộ ngôi sao" },
        { id: "month", name: "Gói Thẻ tháng" }
    ] },
    { slug: "dot-kich", aliases: ["dot-kich-crossfire"], name: "Đột Kích", icon: "CF", iconImg: "icon/icon_003.jpg", thumb: "thumbnail/thumb_003.png", type: "pc", typeLabel: "PC", linkedAccount: "CF_HongTran", allowGuestTopup: false, desc: "Gói nạp và vật phẩm game." },
    { slug: "truy-kich-pc", name: "Truy Kích PC", icon: "TK", iconImg: "icon/icon_004.jpg", thumb: "thumbnail/thumb_004.png", type: "pc", typeLabel: "PC", linkedAccount: "", allowGuestTopup: true, desc: "Nạp nhanh tài khoản game PC." },
    { slug: "phi-doi", name: "Phi Đội", icon: "AO", iconImg: "icon/icon_005.jpg", thumb: "thumbnail/thumb_005.png", type: "pc", typeLabel: "PC", linkedAccount: "", allowGuestTopup: false, desc: "Dịch vụ PC cần liên kết tài khoản." },
    { slug: "silkroad-origin-vtc", name: "Silkroad Origin VTC", icon: "SR", iconImg: "icon/icon_006.jpg", thumb: "thumbnail/thumb_006.png", type: "pc", typeLabel: "PC", linkedAccount: "SilkHong90", allowGuestTopup: true, desc: "Gói nạp Silkroad Origin VTC." },
    { slug: "giang-ho-bat-phai", name: "Giang Hồ Bát Phái", icon: "GH", iconImg: "icon/icon_007.jpg", thumb: "thumbnail/thumb_007.png", type: "mobile", typeLabel: "Mobile", linkedAccount: "", allowGuestTopup: true, desc: "Gói mobile nổi bật." },
    { slug: "be-a-pro-football", name: "Be A Pro Football", icon: "BP", iconImg: "icon/icon_008.jpg", thumb: "thumbnail/thumb_008.png", type: "mobile", typeLabel: "Mobile", linkedAccount: "BAP_HongTran", allowGuestTopup: true, desc: "Gói nạp bóng đá mobile." },
    { slug: "football-pro-vtc", name: "Football Pro VTC", icon: "FP", iconImg: "icon/icon_009.jpg", thumb: "thumbnail/thumb_009.png", type: "mobile", typeLabel: "Mobile", linkedAccount: "", allowGuestTopup: true, desc: "Gói nạp Football Pro VTC." },
    { slug: "dai-chien-tam-quoc", name: "Đại Chiến Tam Quốc", icon: "TQ", iconImg: "icon/icon_010.jpg", thumb: "thumbnail/thumb_010.png", type: "mobile", typeLabel: "Mobile", linkedAccount: "", allowGuestTopup: false, desc: "Dịch vụ mobile cần liên kết tài khoản." },
    { slug: "ngoi-nha-trong-mo", name: "Ngôi Nhà Trong Mơ", icon: "NM", iconImg: "icon/icon_011.jpg", thumb: "thumbnail/thumb_011.png", type: "mobile", typeLabel: "Mobile", linkedAccount: "DreamHome88", allowGuestTopup: true, desc: "Combo quà tặng, Point và voucher." }
];

var mobileShopState = {
    filter: "all",
    slide: 0,
    backScreen: "shop-auth",
    service: mobileShopServices[1],
    selectedPackage: null,
    quantity: 1,
    payment: "Số dư MyVTC",
    discount: 0,
    packageFilter: "all",
    paymentOptionsVisible: false
};
var mobileShopTimer = null;

function mobileShopSlugify(name) {
    return String(name || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getMobileShopServiceByName(name) {
    var slug = mobileShopSlugify(name);
    return mobileShopServices.find(function (service) {
        return service.slug === slug || (service.aliases || []).indexOf(slug) > -1 || service.name === name;
    }) || mobileShopServices[1];
}

function renderMobileShop() {
    renderMobileShopSlides();
    renderMobileShopRecommend();
    renderMobileShopList();
    startMobileShopSlider();
}

function renderMobileShopSlides() {
    document.querySelectorAll("[data-mobile-shop-slider]").forEach(function (slider) {
        var slides = slider.querySelectorAll(".mobile-shop-slide");
        slides.forEach(function (slide, index) {
            slide.classList.toggle("active", index === mobileShopState.slide);
        });
        var dots = slider.querySelector("[data-mobile-shop-dots]");
        if (dots) {
            dots.innerHTML = Array.prototype.map.call(slides, function (_, index) {
                return '<button type="button" class="' + (index === mobileShopState.slide ? "active" : "") + '" data-mobile-shop-slide="' + index + '"></button>';
            }).join("");
        }
    });
}

function startMobileShopSlider() {
    if (mobileShopTimer) return;
    mobileShopTimer = window.setInterval(function () {
        mobileShopState.slide = (mobileShopState.slide + 1) % 3;
        renderMobileShopSlides();
    }, 4500);
}

function renderMobileShopRecommend() {
    var names = ["Audition PC", "Đột Kích", "Giang Hồ Bát Phái", "Be A Pro Football", "Silkroad Origin VTC", "Ngôi Nhà Trong Mơ"];
    var html = names.map(function (name) {
        var service = getMobileShopServiceByName(name);
        return [
            '<button type="button" data-mobile-shop-service="' + escapeHtml(service.name) + '">',
            '<img src="' + service.iconImg + '" alt="' + escapeHtml(service.name) + '" onerror="this.style.display=\'none\'">',
            '<span>' + escapeHtml(service.name) + '</span>',
            '</button>'
        ].join("");
    }).join("");
    document.querySelectorAll("[data-mobile-shop-recommend]").forEach(function (holder) {
        holder.innerHTML = html;
    });
}

function renderMobileShopList() {
    document.querySelectorAll("[data-mobile-shop-filter]").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.mobileShopFilter === mobileShopState.filter);
    });

    var services = mobileShopServices.filter(function (service) {
        if (service.type === "balance") return false;
        return mobileShopState.filter === "all" || service.type === mobileShopState.filter;
    });

    var html = services.map(function (service) {
        return [
            '<button type="button" data-mobile-shop-service="' + escapeHtml(service.name) + '">',
            '<img src="' + service.iconImg + '" alt="' + escapeHtml(service.name) + '" onerror="this.style.display=\'none\'">',
            '<span><strong>' + escapeHtml(service.name) + '</strong><small>' + escapeHtml(service.desc || "Dịch vụ VTC") + '</small></span>',
            '</button>'
        ].join("");
    }).join("");

    document.querySelectorAll("[data-mobile-shop-list]").forEach(function (holder) {
        holder.innerHTML = html;
    });
    document.querySelectorAll("[data-mobile-shop-empty]").forEach(function (empty) {
        empty.classList.toggle("hidden", services.length > 0);
    });
}

function openMobileRecharge(serviceName) {
    if (!isLoggedIn) {
        showMobileScreen("login-select");
        showMobileToast("Bạn cần đăng nhập để nạp dịch vụ.", "info");
        return;
    }
    var activeScreen = document.querySelector(".app-screen.active");
    mobileShopState.backScreen = activeScreen && activeScreen.dataset.screen === "shop" ? "shop" : "shop-auth";
    var service = getMobileShopServiceByName(serviceName);
    mobileShopState.service = service;
    mobileShopState.selectedPackage = getMobileRechargePackages(service)[0];
    mobileShopState.quantity = 1;
    mobileShopState.payment = service.isBalanceTopup ? "Thẻ Vcoin" : "Số dư MyVTC";
    mobileShopState.discount = 0;
    mobileShopState.packageFilter = "all";
    mobileShopState.paymentOptionsVisible = false;
    showMobileScreen("shop-detail");
}

function renderMobileRechargeDetail() {
    var service = mobileShopState.service || mobileShopServices[1];
    var icon = document.getElementById("mobileRechargeIcon");
    var name = document.getElementById("mobileRechargeServiceName");
    if (icon) icon.innerHTML = '<img src="' + service.iconImg + '" alt="' + escapeHtml(service.name) + '">';
    if (name) name.textContent = service.name;
    renderMobileRechargeAccountBox();
    renderMobileRechargePaymentMethods();
    renderMobileRechargePackages();
    updateMobileRechargeOrder();
}

function renderMobileRechargeAccountBox() {
    var box = document.getElementById("mobileRechargeAccountBox");
    var service = mobileShopState.service;
    if (!box || !service) return;

    if (!isLoggedIn) {
        box.innerHTML = [
            '<div class="mobile-recharge-login-box">',
            '<strong>Bạn cần đăng nhập để nạp dịch vụ</strong>',
            '<span>Đăng nhập MyVTC để kiểm tra tài khoản sử dụng dịch vụ và thanh toán.</span>',
            '<button type="button" data-screen-target="login-select">Đăng nhập</button>',
            '</div>'
        ].join("");
        return;
    }

    if (service.linkedAccount) {
        box.innerHTML = '<div class="mobile-recharge-account-found"><strong>' + escapeHtml(service.linkedAccount) + '</strong></div>';
        return;
    }

    if (service.allowGuestTopup) {
        box.innerHTML = [
            '<div class="mobile-recharge-search">',
            '<strong>Nhập tên tài khoản sử dụng dịch vụ</strong>',
            '<div><input id="mobileRechargePlayerName" placeholder="Nhập tên tài khoản"><button type="button" data-mobile-search-player>Tìm</button></div>',
            '</div>'
        ].join("");
        return;
    }

    box.innerHTML = '<div class="mobile-recharge-missing"><strong>Bạn không có tài khoản của dịch vụ này</strong><span>Vui lòng đăng nhập tài khoản khác có dùng dịch vụ này hoặc lựa chọn dịch vụ khác.</span></div>';
}

function getMobileRechargePackages(service) {
    if (service && service.isBalanceTopup) {
        return [
            { id: "point_100", name: "Nạp 100 Point", price: 100000, point: 100, thumb: "thumbnail/thumb_001.png" },
            { id: "point_300", name: "Nạp 300 Point", price: 300000, point: 300, thumb: "thumbnail/thumb_002.png" },
            { id: "point_500", name: "Nạp 500 Point", price: 500000, point: 500, thumb: "thumbnail/thumb_003.png" },
            { id: "point_1000", name: "Nạp 1.000 Point", price: 1000000, point: 1000, thumb: "thumbnail/thumb_004.png" },
            { id: "point_2000", name: "Nạp 2.000 Point", price: 2000000, point: 2000, thumb: "thumbnail/thumb_005.png" },
            { id: "point_5000", name: "Nạp 5.000 Point", price: 5000000, point: 5000, thumb: "thumbnail/thumb_006.png" }
        ];
    }
    if (service && service.packageFilters && service.packageFilters.length) {
        return [
            { id: "diamond_1", filter: "diamond", name: "Nạp Kim Cương 100", price: 100000, point: 100, thumb: "thumbnail/thumb_002.png" },
            { id: "diamond_2", filter: "diamond", name: "Nạp Kim Cương 300", price: 300000, point: 300, thumb: "thumbnail/thumb_003.png" },
            { id: "diamond_3", filter: "diamond", name: "Nạp Kim Cương 500", price: 500000, point: 500, thumb: "thumbnail/thumb_004.png" },
            { id: "golden_1", filter: "golden", name: "Gói ưu đãi Golden 1", price: 150000, point: 160, thumb: "thumbnail/thumb_005.png" },
            { id: "golden_2", filter: "golden", name: "Gói ưu đãi Golden 2", price: 300000, point: 330, thumb: "thumbnail/thumb_006.png" },
            { id: "star_1", filter: "star", name: "Gói ưu đãi VIP 1", price: 500000, point: 560, thumb: "thumbnail/thumb_007.png" },
            { id: "star_2", filter: "star", name: "Gói ưu đãi VIP 2", price: 1000000, point: 1150, thumb: "thumbnail/thumb_008.png" },
            { id: "month_1", filter: "month", name: "Thẻ thủy tinh 1", price: 99000, point: 100, thumb: "thumbnail/thumb_009.png" },
            { id: "month_2", filter: "month", name: "Thẻ thủy tinh 2", price: 199000, point: 220, thumb: "thumbnail/thumb_010.png" }
        ];
    }
    return [
        { id: "pkg_1", name: service.name + " - Gói 100 Point", price: 100000, point: 100, thumb: "thumbnail/thumb_012.png" },
        { id: "pkg_2", name: service.name + " - Gói 300 Point", price: 300000, point: 300, thumb: "thumbnail/thumb_013.png" },
        { id: "pkg_3", name: service.name + " - Gói 500 Point", price: 500000, point: 500, thumb: "thumbnail/thumb_014.png" },
        { id: "pkg_4", name: service.name + " - Gói 1.000 Point", price: 1000000, point: 1000, thumb: "thumbnail/thumb_015.png" },
        { id: "pkg_5", name: service.name + " - Gói ưu đãi", price: 150000, point: 160, thumb: "thumbnail/thumb_016.png" },
        { id: "pkg_6", name: service.name + " - Gói cao cấp", price: 2000000, point: 2200, thumb: "thumbnail/thumb_017.png" }
    ];
}

function renderMobileRechargePaymentMethods() {
    var holder = document.getElementById("mobileRechargePaymentMethods");
    var service = mobileShopState.service;
    if (!holder || !service) return;
    var methods = service.isBalanceTopup ? ["Thẻ Vcoin", "Chuyển khoản", "VTC Pay", "Ngân hàng nội địa", "Thẻ quốc tế"] : ["Số dư MyVTC", "Chuyển khoản", "VTC Pay", "Ngân hàng nội địa", "Thẻ quốc tế"];
    if (methods.indexOf(mobileShopState.payment) < 0) mobileShopState.payment = methods[0];
    setMobileText("mobilePaymentCurrent", mobileShopState.payment);
    holder.classList.toggle("hidden", !mobileShopState.paymentOptionsVisible);
    holder.innerHTML = methods.map(function (method) {
        return '<button type="button" class="' + (method === mobileShopState.payment ? "active" : "") + '" data-mobile-payment="' + method + '">' + method + '</button>';
    }).join("");
}

function isMobileBalancePayment() {
    return mobileShopState.payment === "Số dư MyVTC";
}

function getMobilePackagePayAmount(pkg) {
    if (!pkg) return 0;
    return isMobileBalancePayment() ? pkg.point : pkg.price;
}

function formatMobileRechargeAmount(value) {
    var amount = Number(value || 0).toLocaleString("vi-VN");
    return isMobileBalancePayment() ? amount + " Points" : amount + " VNĐ";
}

function getVisibleMobilePackages() {
    var packages = getMobileRechargePackages(mobileShopState.service);
    if (mobileShopState.packageFilter === "all") return packages;
    return packages.filter(function (pkg) { return pkg.filter === mobileShopState.packageFilter; });
}

function renderMobileRechargePackageFilters() {
    var holder = document.getElementById("mobileRechargePackageFilters");
    var service = mobileShopState.service;
    if (!holder || !service) return;
    var filters = service.packageFilters || [];
    if (!filters.length) {
        holder.innerHTML = "";
        holder.classList.add("hidden");
        mobileShopState.packageFilter = "all";
        return;
    }
    holder.classList.remove("hidden");
    holder.innerHTML = [{ id: "all", name: "Tất cả" }].concat(filters).map(function (filter) {
        return '<button type="button" class="' + (filter.id === mobileShopState.packageFilter ? "active" : "") + '" data-mobile-package-filter="' + filter.id + '">' + filter.name + '</button>';
    }).join("");
}

function renderMobileRechargePackages() {
    var list = document.getElementById("mobileRechargePackageList");
    var service = mobileShopState.service;
    if (!list || !service) return;
    if (service.isBalanceTopup && mobileShopState.payment === "Thẻ Vcoin") {
        var filters = document.getElementById("mobileRechargePackageFilters");
        if (filters) filters.classList.add("hidden");
        list.innerHTML = [
            '<div class="mobile-vcoin-form">',
            '<label>Serial<input id="mobileVcoinSerial" placeholder="Nhập số serial"></label>',
            '<label>Mã thẻ<input id="mobileVcoinCode" placeholder="Nhập mã thẻ Vcoin"></label>',
            '<label>Mã captcha<div><input id="mobileVcoinCaptcha" placeholder="Nhập captcha"><strong>8P4K</strong></div></label>',
            '</div>'
        ].join("");
        updateMobileRechargeOrder();
        return;
    }
    renderMobileRechargePackageFilters();
    list.innerHTML = getVisibleMobilePackages().map(function (pkg) {
        return [
            '<button type="button" class="mobile-recharge-package ' + (mobileShopState.selectedPackage && pkg.id === mobileShopState.selectedPackage.id ? "active" : "") + '" data-mobile-package="' + pkg.id + '">',
            '<img src="' + (pkg.thumb || service.thumb) + '" alt="' + escapeHtml(pkg.name) + '" onerror="this.style.display=\'none\'">',
            '<span><strong>' + escapeHtml(pkg.name) + '</strong><small>' + formatMobileRechargeAmount(getMobilePackagePayAmount(pkg)) + '</small></span>',
            '</button>'
        ].join("");
    }).join("");
}

function selectMobileRechargePackage(packageId) {
    mobileShopState.selectedPackage = getMobileRechargePackages(mobileShopState.service).find(function (pkg) { return pkg.id === packageId; }) || mobileShopState.selectedPackage;
    mobileShopState.discount = 0;
    mobileShopState.paymentOptionsVisible = false;
    renderMobileRechargePackages();
    renderMobileRechargePaymentMethods();
    updateMobileRechargeOrder();
    showMobileScreen("shop-order");
}

function selectMobileRechargePayment(payment) {
    mobileShopState.payment = payment;
    mobileShopState.packageFilter = "all";
    var packages = getMobileRechargePackages(mobileShopState.service);
    if (!mobileShopState.selectedPackage || !packages.some(function (pkg) { return pkg.id === mobileShopState.selectedPackage.id; })) {
        mobileShopState.selectedPackage = packages[0];
    }
    mobileShopState.discount = 0;
    mobileShopState.paymentOptionsVisible = false;
    renderMobileRechargePaymentMethods();
    renderMobileRechargePackages();
    updateMobileRechargeOrder();
}

function updateMobileRechargeOrder() {
    var service = mobileShopState.service;
    var pkg = mobileShopState.selectedPackage;
    if (service && service.isBalanceTopup && mobileShopState.payment === "Thẻ Vcoin") {
        setMobileText("mobileOrderProductName", "Nạp số dư bằng Thẻ Vcoin");
        setMobileText("mobileOrderQuantity", "1");
        setMobileText("mobileOrderSubtotal", "Theo mệnh giá thẻ");
        setMobileText("mobileOrderDiscount", "0đ");
        setMobileText("mobileOrderTotal", "Theo mệnh giá thẻ");
        return;
    }
    if (!pkg) return;
    var subtotal = getMobilePackagePayAmount(pkg) * mobileShopState.quantity;
    var total = Math.max(0, subtotal - mobileShopState.discount);
    setMobileText("mobileOrderProductName", pkg.name);
    setMobileText("mobileOrderQuantity", mobileShopState.quantity);
    setMobileText("mobileOrderSubtotal", formatMobileRechargeAmount(subtotal));
    setMobileText("mobileOrderDiscount", formatMobileRechargeAmount(mobileShopState.discount));
    setMobileText("mobileOrderTotal", formatMobileRechargeAmount(total));
}

function setMobileText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
}

function applyMobileRechargeVoucher() {
    var input = document.getElementById("mobileRechargeVoucher");
    var select = document.getElementById("mobileRechargeVoucherSelect");
    var message = document.getElementById("mobileVoucherMessage");
    var code = String((input && input.value) || (select && select.value) || "").trim().toUpperCase();
    if (mobileShopState.service && mobileShopState.service.isBalanceTopup && mobileShopState.payment === "Thẻ Vcoin") {
        mobileShopState.discount = 0;
        if (message) message.textContent = "Thẻ Vcoin không áp dụng voucher";
        updateMobileRechargeOrder();
        return;
    }
    var subtotal = getMobilePackagePayAmount(mobileShopState.selectedPackage) * mobileShopState.quantity;
    if (code === "MYVTC10") {
        mobileShopState.discount = Math.min(isMobileBalancePayment() ? 50 : 50000, Math.round(subtotal * 0.1));
        if (message) message.textContent = "Áp dụng voucher thành công, giảm " + formatMobileRechargeAmount(mobileShopState.discount);
    } else if (code === "VTCPAY20") {
        mobileShopState.discount = isMobileBalancePayment() ? 20 : 20000;
        if (message) message.textContent = "Áp dụng voucher thành công, giảm " + formatMobileRechargeAmount(mobileShopState.discount);
    } else if (code === "NEWUSER") {
        mobileShopState.discount = isMobileBalancePayment() ? 30 : 30000;
        if (message) message.textContent = "Áp dụng voucher thành công, giảm " + formatMobileRechargeAmount(mobileShopState.discount);
    } else {
        mobileShopState.discount = 0;
        if (message) message.textContent = "Mã hợp lệ để test: MYVTC10, VTCPAY20, NEWUSER";
    }
    updateMobileRechargeOrder();
}

function submitMobileRechargeOrder() {
    if (!isLoggedIn) {
        showMobileScreen("login-select");
        showMobileToast("Bạn cần đăng nhập để thanh toán.", "info");
        return;
    }
    if (mobileShopState.service && mobileShopState.service.isBalanceTopup && mobileShopState.payment === "Thẻ Vcoin") {
        var serial = document.getElementById("mobileVcoinSerial")?.value.trim();
        var code = document.getElementById("mobileVcoinCode")?.value.trim();
        var captcha = document.getElementById("mobileVcoinCaptcha")?.value.trim();
        if (!serial || !code || !captcha) {
            showMobileToast("Vui lòng nhập đủ Serial, Mã thẻ và Captcha.", "info");
            return;
        }
    }
    showMobileToast("Đã tạo đơn thanh toán demo.", "success");
}

function handleMobileSecurityAction(action) {
    var messages = {
        password: "Mở luồng đổi mật khẩu giống Website.",
        "2fa": "Mở luồng quản lý OTP và xác minh 2 bước.",
        sessions: "Đã kiểm tra 2 phiên đăng nhập đang hoạt động.",
        ekyc: "CCCD đã xác thực qua eKYC."
    };
    showMobileToast(messages[action] || "Đã ghi nhận thao tác.", "info");
}

document.addEventListener("DOMContentLoaded", function () {
    initBannerSliderDrag();
    renderSavedAccounts();
    renderMobileAccount();
    renderMobileLoyaltyOverview();
    renderMobileShop();

    window.setTimeout(function () {
        showMobileScreen("home-guest");
    }, 1100);
});

document.addEventListener("click", function (event) {
    var passwordToggle = event.target.closest("[data-toggle-password]");
    if (passwordToggle) {
        event.preventDefault();
        var input = document.getElementById(passwordToggle.dataset.togglePassword);
        var icon = passwordToggle.querySelector("i");
        if (input) {
            input.type = input.type === "password" ? "text" : "password";
            if (icon) icon.className = input.type === "password" ? "fa fa-eye-slash" : "fa fa-eye";
        }
        return;
    }

    var menuToggle = event.target.closest("[data-service-menu-toggle]");
    if (menuToggle) {
        event.preventDefault();
        var menuWrap = menuToggle.closest(".service-menu-wrap");
        if (menuWrap) menuWrap.classList.toggle("open");
        return;
    }

    var filterBtn = event.target.closest("[data-service-filter]");
    if (filterBtn) {
        event.preventDefault();
        var activeScreen = filterBtn.closest(".app-screen");
        if (!activeScreen) return;

        var filter = filterBtn.dataset.serviceFilter;
        activeScreen.querySelectorAll("[data-service-filter]").forEach(function (btn) {
            btn.classList.toggle("active", btn === filterBtn);
        });

        var filterWrap = filterBtn.closest(".service-menu-wrap");
        if (filterWrap) filterWrap.classList.remove("open");

        activeScreen.querySelectorAll(".service-grid-card").forEach(function (card) {
            var type = card.dataset.serviceType;
            var shouldShow = filter === "all" || type === filter || type === "all";
            card.classList.toggle("is-hidden", !shouldShow);
        });
        return;
    }

    var accountBtn = event.target.closest("[data-login-account]");
    if (accountBtn) {
        event.preventDefault();
        var selected = getSavedLoginAccounts().find(function (account) {
            return account.id === accountBtn.dataset.loginAccount;
        });
        performLogin(selected ? selected.name : null, selected ? selected.username : accountBtn.dataset.loginAccount);
        return;
    }

    if (event.target.closest("#useAnotherLoginAccount")) {
        event.preventDefault();
        clearAuthErrors();
        showMobileScreen("login-username");
        return;
    }

    if (event.target.closest("#continueToPassword")) {
        event.preventDefault();
        handleLoginStep1();
        return;
    }

    if (event.target.closest("#loginByPassword")) {
        event.preventDefault();
        handleLoginWithPassword();
        return;
    }

    if (event.target.closest("#loginWithOtpBtn")) {
        event.preventDefault();
        authMobileState.otpWrongCount = 0;
        showMobileScreen("login-otp-select");
        return;
    }

    var loginOtpBtn = event.target.closest("[data-login-otp-channel]");
    if (loginOtpBtn) {
        event.preventDefault();
        handleLoginOtpMethod(loginOtpBtn.dataset.loginOtpChannel);
        return;
    }

    if (event.target.closest("#verifyLoginOtpBtn")) {
        event.preventDefault();
        verifyLoginOtp();
        return;
    }

    var socialBtn = event.target.closest("[data-social-provider]");
    if (socialBtn) {
        event.preventDefault();
        startSocialLogin(socialBtn.dataset.socialProvider);
        return;
    }

    if (event.target.closest("#confirmSocialLoginBtn")) {
        event.preventDefault();
        performLogin(authMobileState.socialProvider + " User", authMobileState.socialProvider);
        return;
    }

    if (event.target.closest("#quickLoginBtn")) {
        event.preventDefault();
        startGuestLogin();
        return;
    }

    if (event.target.closest("#confirmGuestLoginBtn")) {
        event.preventDefault();
        var guestId = localStorage.getItem("myvtc_guest_id") || "GUEST";
        performLogin("Guest MyVTC", guestId);
        return;
    }

    if (event.target.closest("#logoutAllAccounts")) {
        event.preventDefault();
        clearSavedAccounts();
        return;
    }

    if (event.target.closest("#findAccountBtn")) {
        event.preventDefault();
        findRecoveryAccounts();
        return;
    }

    var recoveryBtn = event.target.closest("[data-recovery-username]");
    if (recoveryBtn) {
        event.preventDefault();
        var input = document.getElementById("mobileUsername");
        if (input) input.value = recoveryBtn.dataset.recoveryUsername;
        authMobileState.loginIdentifier = recoveryBtn.dataset.recoveryUsername;
        showMobileScreen("login-username");
        showMobileToast("Đã chọn tài khoản khôi phục.", "success");
        return;
    }

    var resetOtpBtn = event.target.closest("[data-reset-otp-channel]");
    if (resetOtpBtn) {
        event.preventDefault();
        startResetPassword(resetOtpBtn.dataset.resetOtpChannel);
        return;
    }

    if (event.target.closest("#confirmResetPasswordBtn")) {
        event.preventDefault();
        confirmResetPassword();
        return;
    }

    var registerTypeBtn = event.target.closest("[data-register-type]");
    if (registerTypeBtn) {
        event.preventDefault();
        initRegisterForm(registerTypeBtn.dataset.registerType);
        return;
    }

    if (event.target.closest("#registerContinueBtn")) {
        event.preventDefault();
        handleRegisterStep1();
        return;
    }

    var otpChannelBtn = event.target.closest("[data-otp-channel]");
    if (otpChannelBtn) {
        event.preventDefault();
        handleRegisterOtpMethod(otpChannelBtn.dataset.otpChannel);
        return;
    }

    if (event.target.closest("#verifyOtpBtn")) {
        event.preventDefault();
        verifyRegisterOtp();
        return;
    }

    if (event.target.closest("#registerOtpBackBtn")) {
        event.preventDefault();
        if (authMobileState.registerType === "phone") showMobileScreen("otp-select");
        else showMobileScreen("register-form");
        return;
    }

    if (event.target.closest("#changeOtpMethodBtn")) {
        event.preventDefault();
        if (authMobileState.registerType === "email") {
            resetOtpInputs();
            clearAuthErrors();
            showMobileToast("Đã gửi lại OTP qua Email.", "info");
            return;
        }
        showMobileScreen("otp-select");
        return;
    }

    if (event.target.closest("#ekycBackBtn")) {
        event.preventDefault();
        if (authMobileState.registerType === "username") showMobileScreen("register-form");
        else showMobileScreen("otp-verify");
        return;
    }

    if (event.target.closest("#ekycSubmitBtn")) {
        event.preventDefault();
        handleEkycSubmit();
        return;
    }


    if (event.target.closest("[data-loyalty-back]")) {
        event.preventDefault();
        showMobileLoyaltyMenu();
        return;
    }

    var loyaltyPanelBtn = event.target.closest("[data-loyalty-panel]");
    if (loyaltyPanelBtn) {
        event.preventDefault();
        showMobileLoyaltyPanel(loyaltyPanelBtn.dataset.loyaltyPanel);
        return;
    }

    var loyaltyRankBtn = event.target.closest("[data-loyalty-rank]");
    if (loyaltyRankBtn) {
        event.preventDefault();
        selectMobileLoyaltyRank(loyaltyRankBtn.dataset.loyaltyRank);
        return;
    }

    var loyaltyActionBtn = event.target.closest("[data-loyalty-action]");
    if (loyaltyActionBtn) {
        event.preventDefault();
        handleMobileLoyaltyAction(loyaltyActionBtn.dataset.loyaltyAction);
        return;
    }

    var loyaltyTaskBtn = event.target.closest("[data-loyalty-mission]");
    if (loyaltyTaskBtn) {
        event.preventDefault();
        claimMobileLoyaltyMission(loyaltyTaskBtn.dataset.loyaltyMission);
        return;
    }

    var loyaltyInfoBtn = event.target.closest("[data-loyalty-info]");
    if (loyaltyInfoBtn) {
        event.preventDefault();
        var infoSource = loyaltyInfoBtn.closest("[data-loyalty-info-title]") || loyaltyInfoBtn;
        openMobileLoyaltyInfoPopup(loyaltyInfoBtn.dataset.loyaltyInfo, loyaltyInfoBtn.dataset.loyaltyInfoIndex, infoSource.dataset.loyaltyInfoTitle, infoSource.dataset.loyaltyInfoDesc, infoSource.dataset.loyaltyInfoAction);
        return;
    }

    var loyaltyTaskActionBtn = event.target.closest("[data-loyalty-task-action]");
    if (loyaltyTaskActionBtn) {
        event.preventDefault();
        showMobileToast("Đã mở thao tác: " + loyaltyTaskActionBtn.dataset.loyaltyTaskAction + ".", "info");
        return;
    }

    var loyaltyVoucherBtn = event.target.closest("[data-loyalty-voucher]");
    if (loyaltyVoucherBtn) {
        event.preventDefault();
        handleMobileLoyaltyVoucher(loyaltyVoucherBtn.dataset.loyaltyVoucher);
        return;
    }

    var loyaltyCopyBtn = event.target.closest("[data-loyalty-copy]");
    if (loyaltyCopyBtn) {
        event.preventDefault();
        if (loyaltyCopyBtn.dataset.loyaltyCopy === "code") {
            copyMobileLoyaltyText(mobileLoyaltyInviteData.code, "Đã copy mã mời.");
        } else {
            copyMobileLoyaltyText(mobileLoyaltyInviteData.link, "Đã copy link chia sẻ.");
        }
        return;
    }

    if (event.target.closest("[data-account-back]")) {
        event.preventDefault();
        showMobileAccountMenu();
        return;
    }

    var accountPanelBtn = event.target.closest("[data-account-panel]");
    if (accountPanelBtn) {
        event.preventDefault();
        showMobileAccountPanel(accountPanelBtn.dataset.accountPanel);
        return;
    }

    var accountEditBtn = event.target.closest("[data-account-edit]");
    if (accountEditBtn) {
        event.preventDefault();
        openMobileAccountModal(accountEditBtn.dataset.accountEdit);
        return;
    }

    if (event.target.closest("[data-close-mobile-modal]")) {
        event.preventDefault();
        closeMobileAccountModal();
        return;
    }

    if (event.target.closest("#saveMobileNickname")) {
        event.preventDefault();
        saveMobileNickname();
        return;
    }

    if (event.target.closest("#saveMobileBasicInfo")) {
        event.preventDefault();
        saveMobileBasicInfo();
        return;
    }

    if (event.target.closest("#saveMobileAvatar")) {
        event.preventDefault();
        saveMobileAvatar();
        return;
    }

    var linkedProviderBtn = event.target.closest("[data-linked-provider]");
    if (linkedProviderBtn) {
        event.preventDefault();
        handleMobileLinkedProvider(linkedProviderBtn.dataset.linkedProvider);
        return;
    }

    var securityBtn = event.target.closest("[data-security-action]");
    if (securityBtn) {
        event.preventDefault();
        handleMobileSecurityAction(securityBtn.dataset.securityAction);
        return;
    }

    var paymentActionBtn = event.target.closest("[data-payment-action]");
    if (paymentActionBtn) {
        event.preventDefault();
        openMobilePaymentModal(paymentActionBtn.dataset.paymentAction);
        return;
    }

    if (event.target.closest("#saveMobilePaymentMethod")) {
        event.preventDefault();
        saveMobilePaymentMethod();
        return;
    }

    if (event.target.closest("#saveMobileBillingAddress")) {
        event.preventDefault();
        saveMobileBillingAddress();
        return;
    }

    if (event.target.closest("#mobileTransactionReset")) {
        event.preventDefault();
        resetMobileTransactionFilters();
        return;
    }

    if (event.target.closest("#mobileMarkAllRead")) {
        event.preventDefault();
        markMobileNotificationsRead();
        return;
    }

    if (event.target.closest("#mobileClearRead")) {
        event.preventDefault();
        clearMobileReadNotifications();
        return;
    }

    var languageBtn = event.target.closest("[data-language]");
    if (languageBtn) {
        event.preventDefault();
        changeMobileLanguage(languageBtn.dataset.language);
        return;
    }

    if (event.target.closest("#logoutAccountBtn")) {
        event.preventDefault();
        isLoggedIn = false;
        showMobileScreen("home-guest");
        showMobileToast("Đã đăng xuất.", "info");
        return;
    }


    var shopSlideDot = event.target.closest("[data-mobile-shop-slide]");
    if (shopSlideDot) {
        event.preventDefault();
        mobileShopState.slide = Number(shopSlideDot.dataset.mobileShopSlide || 0);
        renderMobileShopSlides();
        return;
    }

    var shopFeatureBtn = event.target.closest("[data-mobile-shop-feature]");
    if (shopFeatureBtn) {
        event.preventDefault();
        openMobileRecharge(shopFeatureBtn.dataset.mobileShopFeature);
        return;
    }

    var shopServiceBtn = event.target.closest("[data-mobile-shop-service]");
    if (shopServiceBtn) {
        event.preventDefault();
        openMobileRecharge(shopServiceBtn.dataset.mobileShopService);
        return;
    }

    var shopFilterBtn = event.target.closest("[data-mobile-shop-filter]");
    if (shopFilterBtn) {
        event.preventDefault();
        mobileShopState.filter = shopFilterBtn.dataset.mobileShopFilter || "all";
        var shopMenuWrap = shopFilterBtn.closest(".service-menu-wrap");
        if (shopMenuWrap) shopMenuWrap.classList.remove("open");
        renderMobileShopList();
        return;
    }

    if (event.target.closest("[data-mobile-shop-back]")) {
        event.preventDefault();
        showMobileScreen(mobileShopState.backScreen || (isLoggedIn ? "shop-auth" : "shop"));
        return;
    }

    if (event.target.closest("[data-mobile-shop-order-back]")) {
        event.preventDefault();
        showMobileScreen("shop-detail");
        return;
    }

    if (event.target.closest("[data-mobile-shop-reset]")) {
        event.preventDefault();
        openMobileRecharge(mobileShopState.service ? mobileShopState.service.name : "Audition PC");
        return;
    }

    if (event.target.closest("[data-mobile-change-payment]")) {
        event.preventDefault();
        mobileShopState.paymentOptionsVisible = !mobileShopState.paymentOptionsVisible;
        renderMobileRechargePaymentMethods();
        return;
    }

    var paymentBtn = event.target.closest("[data-mobile-payment]");
    if (paymentBtn) {
        event.preventDefault();
        selectMobileRechargePayment(paymentBtn.dataset.mobilePayment);
        return;
    }

    var packageFilterBtn = event.target.closest("[data-mobile-package-filter]");
    if (packageFilterBtn) {
        event.preventDefault();
        mobileShopState.packageFilter = packageFilterBtn.dataset.mobilePackageFilter || "all";
        mobileShopState.selectedPackage = getVisibleMobilePackages()[0] || getMobileRechargePackages(mobileShopState.service)[0];
        mobileShopState.discount = 0;
        renderMobileRechargePackageFilters();
        renderMobileRechargePackages();
        updateMobileRechargeOrder();
        return;
    }

    var packageBtn = event.target.closest("[data-mobile-package]");
    if (packageBtn) {
        event.preventDefault();
        selectMobileRechargePackage(packageBtn.dataset.mobilePackage);
        return;
    }

    var qtyBtn = event.target.closest("[data-mobile-qty]");
    if (qtyBtn) {
        event.preventDefault();
        mobileShopState.quantity = Math.max(1, mobileShopState.quantity + Number(qtyBtn.dataset.mobileQty || 0));
        updateMobileRechargeOrder();
        return;
    }

    if (event.target.closest("[data-mobile-apply-voucher]")) {
        event.preventDefault();
        applyMobileRechargeVoucher();
        return;
    }

    if (event.target.closest("[data-mobile-search-player]")) {
        event.preventDefault();
        var playerInput = document.getElementById("mobileRechargePlayerName");
        var playerName = playerInput && playerInput.value.trim();
        if (!playerName) {
            showMobileToast("Vui lòng nhập tên tài khoản sử dụng dịch vụ.", "info");
            return;
        }
        mobileShopState.service.linkedAccount = playerName;
        renderMobileRechargeAccountBox();
        showMobileToast("Đã tìm thấy tài khoản sử dụng dịch vụ.", "success");
        return;
    }

    if (event.target.closest("[data-mobile-submit-recharge]")) {
        event.preventDefault();
        submitMobileRechargeOrder();
        return;
    }

    var screenBtn = event.target.closest("[data-screen-target]");
    if (screenBtn) {
        event.preventDefault();
        clearAuthErrors();
        showMobileScreen(resolveTargetScreen(screenBtn.dataset.screenTarget));
    }
});


document.addEventListener("input", function (event) {
    if (event.target && event.target.id === "mobileAvatarFile") {
        var file = event.target.files && event.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            mobileAccountState.pendingAvatar = readerEvent.target.result;
            var preview = document.getElementById("mobileAvatarPreview");
            if (preview) {
                preview.src = mobileAccountState.pendingAvatar;
                preview.style.display = "block";
            }
        };
        reader.readAsDataURL(file);
        return;
    }

    if (["mobileTransactionSearch"].indexOf(event.target.id) > -1) {
        renderMobileTransactions();
    }
});

document.addEventListener("change", function (event) {
    if (event.target && event.target.id === "mobileRechargeVoucherSelect") {
        var voucherInput = document.getElementById("mobileRechargeVoucher");
        if (voucherInput) voucherInput.value = event.target.value;
        return;
    }

    if (["mobileTransactionType", "mobileTransactionStart", "mobileTransactionEnd"].indexOf(event.target.id) > -1) {
        renderMobileTransactions();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;

    var activeScreen = document.querySelector(".app-screen.active");
    if (!activeScreen) return;

    if (activeScreen.dataset.screen === "login-username") {
        handleLoginStep1();
        return;
    }

    if (activeScreen.dataset.screen === "login-password") {
        handleLoginWithPassword();
        return;
    }

    if (activeScreen.dataset.screen === "login-otp-verify") {
        verifyLoginOtp();
        return;
    }

    if (activeScreen.dataset.screen === "register-form") {
        handleRegisterStep1();
        return;
    }

    if (activeScreen.dataset.screen === "otp-verify") {
        verifyRegisterOtp();
    }
});

document.addEventListener("click", function (event) {
    if (event.target.closest(".service-menu-wrap")) return;
    document.querySelectorAll(".service-menu-wrap.open").forEach(function (menu) {
        menu.classList.remove("open");
    });
});
