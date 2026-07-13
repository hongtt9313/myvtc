// ================================================================
        //  GLOBAL STATE
        // ================================================================
        let isLoggedIn = false;
        let currentUser = {
    name: 'Nguyễn Văn A',
    nickname: 'hongtran',
    id: '31735b35ecba3981',
    rank: 'Hạng Đồng',
    balance: 1000,
    avatar: null,
    username: '0389954275',
    phone: '0389954275',
    email: 'thuyhong.vnt@gmail.com',
    cccd: '012930857834',
    address: '23 Lạc Trung',
    gender: 'Nữ',
    birthday: '1990-10-30'
};

        let authState = {
mode: 'login',
subType: 'phone',
step: 0,
tempData: {},
otpRequestsCount: 0,
otpWrongCount: 0,
otpMethod: 'sms'
};

const mockSavedLoginAccounts = [
{
id: 'saved_acc_001',
name: 'Nguyễn Văn A',
username: '0901231234',
type: 'phone',
icon: 'fa-user',
rank: 'Hạng Đồng'
},
{
id: 'saved_acc_002',
name: 'Nguyễn Thu Trang',
username: 'trangt@vtc.vn',
type: 'email',
icon: 'fa-envelope',
rank: 'Hạng Bạc'
}
];

function getSavedLoginAccounts() {
const saved = localStorage.getItem('myvtc_saved_login_accounts');

if (saved) {
    try {
        return JSON.parse(saved);
    } catch (e) {
        return mockSavedLoginAccounts;
    }
}

localStorage.setItem('myvtc_saved_login_accounts', JSON.stringify(mockSavedLoginAccounts));
return mockSavedLoginAccounts;

}

const mockExistingUsers = ['0912345678', '0988888888', '0389954275', 'vtc_test', 'test@gmail.com', 'hongtt@vtc.vn', 'hon123', 'embehp'];
let guestLinkState = {
    active: false,
    action: null,
    guestId: null
};

function getOrCreateGuestLinkId() {
    let localGuestId = localStorage.getItem('myvtc_guest_id');

    if (!localGuestId) {
        localGuestId = 'GUEST-' + Math.floor(100000 + Math.random() * 900000);
        localStorage.setItem('myvtc_guest_id', localGuestId);
        localStorage.setItem('myvtc_guest_progress', JSON.stringify({
            created_at: new Date(),
            data: 'guest_service_progress'
        }));
    }

    return localGuestId;
}

function resetGuestLinkState() {
    guestLinkState = {
        active: false,
        action: null,
        guestId: null
    };
}
const mockRecoveryAccounts = [
    {
        id: 'acc_001',
        displayName: 'hongtt@vtc.vn',
        username: 'hongtt@vtc.vn',
        rawUsername: 'hongtt',
        phone: '0390909123',
        rawPhone: '0399999123',
        email: 'hongtt@vtc.vn',
        icon: 'fa-user'
    },
    {
        id: 'acc_002',
        displayName: 'hongtt@vtc.vn',
        username: '0391234123',
        rawUsername: '0399999123',
        phone: '0391234123',
        rawPhone: '0399999123',
        email: 'hongtt@vtc.vn',
        icon: 'fa-envelope'
    },
    {
        id: 'acc_003',
        displayName: 'hongtt@vtc.vn',
        username: 'embehanhphuc123',
        rawUsername: 'embehp',
        phone: '0981231888',
        rawPhone: '0988888888',
        email: 'hongtt@vtc.vn',
        icon: 'fa-user'
    }
];

function findRecoveryAccounts(keyword) {
    const value = keyword.trim().toLowerCase();

    return mockRecoveryAccounts.filter(acc =>
        acc.rawUsername.toLowerCase() === value ||
        acc.rawPhone === value ||
        acc.email.toLowerCase() === value
    );
}

        // ================================================================
        //  HEADER RENDER
        // ================================================================
        function renderHeader() {
    const navRight = document.getElementById('nav-right');
    const navLinks = document.getElementById('main-nav-links');

    if (!navRight) return;

    const currentPage = window.location.pathname.split('/').pop() || 'MyVTC_Home.html';

            if (navLinks) {
        navLinks.innerHTML = `
            <a class="nav-link ${currentPage === 'MyVTC_Home.html' ? 'active' : ''}" href="MyVTC_Home.html">Trang chủ</a>
            <a class="nav-link ${currentPage === 'Service.html' ? 'active' : ''}" href="Service.html">Dịch vụ</a>
            <a class="nav-link ${currentPage === 'Shop.html' || currentPage === 'RechargeDetail.html' ? 'active' : ''}" href="Shop.html">Cửa hàng</a>
            <a class="nav-link ${currentPage === 'Loyalty.html' ? 'active' : ''}" href="Loyalty.html">Hạng thành viên</a>
            <a class="nav-link ${currentPage === 'Support.html' ? 'active' : ''}" href="Support.html">Hỗ trợ</a>
        `;

        const mobileNavBtn = document.getElementById('mobile-nav-menu-btn');
        if (mobileNavBtn) {
            mobileNavBtn.classList.toggle('hidden', navLinks.children.length === 0);
        }
    }

    if (!isLoggedIn) {
    navRight.innerHTML = `
        <button onclick="openAuthModal('login')" class="header-login-btn" aria-label="Đăng nhập">
            <i class="fas fa-user"></i>
            <span>Đăng nhập</span>
        </button>
    `;
    return;
}

    const displayUsername = currentUser.username || currentUser.phone || currentUser.email || currentUser.name || 'Tài khoản';
    const displayUserId = currentUser.id || 'N/A';
    const displayRank = currentUser.rank || 'Hạng Đồng';
    const displayBalance = Number(currentUser.balance || 1000).toLocaleString('vi-VN');
    const avatarHtml = currentUser.avatar
        ? `<img src="${currentUser.avatar}" alt="Avatar">`
        : `<i class="fas fa-user"></i>`;

    navRight.innerHTML = `
        <div class="relative" id="avatar-dropdown-container">
            <button onclick="toggleAvatarDropdown()" class="avatar-btn">
                <div class="avatar-icon">${avatarHtml}</div>
                <i class="fas fa-chevron-down text-xs text-gray-400 transition-transform duration-200" id="avatar-arrow"></i>
            </button>

            <div class="avatar-dropdown" id="avatar-dropdown">
                <div class="user-info">
                    <div class="user-label">Username</div>
                    <div class="name">${displayUsername}</div>

                    <div class="id-row">
                        <span>UserID: ${displayUserId}</span>
                        <button onclick="copyUserId(event)" class="copy-btn" title="Sao chép UserID">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>

                    <div class="rank-row">
                        <i class="fas fa-crown"></i>
                        <span>${displayRank}</span>
                    </div>

                    <div class="balance-row">
                        <span>Số dư</span>
                        <strong>${displayBalance}</strong>
                        <span class="point-coin">P</span>
                    </div>
                </div>

                <div class="dropdown-divider"></div>

                <button class="dropdown-item" onclick="handleAccount()">
                    <i class="fas fa-user-circle w-5 text-center"></i>
                    Tài khoản
                </button>

                <button class="dropdown-item" onclick="handleBag()">
                    <i class="fas fa-shopping-bag w-5 text-center"></i>
                    Túi đồ
                </button>

                <button class="dropdown-item" onclick="handleTransactions()">
                    <i class="fas fa-receipt w-5 text-center"></i>
                    Lịch sử giao dịch
                </button>

                <div class="dropdown-divider"></div>

                <button class="dropdown-item text-red-600 hover:bg-red-50" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt w-5 text-center"></i>
                    Đăng xuất
                </button>
            </div>
        </div>
    `;
}

        // ================================================================
        //  AVATAR DROPDOWN
        // ================================================================
        function toggleAvatarDropdown() {
            const dropdown = document.getElementById('avatar-dropdown');
            const arrow = document.getElementById('avatar-arrow');
            if (!dropdown) return;
            dropdown.classList.toggle('open');
            if (arrow) {
                arrow.style.transform = dropdown.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }

        document.addEventListener('click', function(e) {
            const container = document.getElementById('avatar-dropdown-container');
            if (container && !container.contains(e.target)) {
                const dropdown = document.getElementById('avatar-dropdown');
                const arrow = document.getElementById('avatar-arrow');
                if (dropdown) dropdown.classList.remove('open');
                if (arrow) arrow.style.transform = 'rotate(0deg)';
            }
        });

        // ================================================================
        //  COPY USER ID
        // ================================================================
        function copyUserId(e) {
            e.stopPropagation();
            const id = currentUser.id;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(id).then(() => {
                    showToast('Đã sao chép ID: ' + id, 'success');
                }).catch(() => fallbackCopy(id));
            } else {
                fallbackCopy(id);
            }
        }

        function fallbackCopy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                showToast('Đã sao chép ID: ' + text, 'success');
            } catch (e) {
                showToast('Không thể sao chép, vui lòng thử lại', 'info');
            }
            document.body.removeChild(ta);
        }

        // ================================================================
        //  DROPDOWN ACTIONS
        // ================================================================
        function handleAccount() {
    window.location.href = 'MyAccount.html';
}

function handleMember() {
    window.location.href = 'Loyalty.html';
}

function handleBag() {
    window.location.href = 'Loyalty.html?tab=bag';
}

function handleTransactions() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'MyAccount.html' && document.getElementById('my-account-page')) {
        showAccountTab('transactions');
        const dropdown = document.getElementById('avatar-dropdown');
        if (dropdown) dropdown.classList.remove('open');
        return;
    }

    window.location.href = 'MyAccount.html?tab=transactions';
}

function handleLogout() {
            isLoggedIn = false;
            localStorage.removeItem('myvtc_logged_in');
            renderHeader();
            showToast('Đã đăng xuất', 'info');
            const dropdown = document.getElementById('avatar-dropdown');
            if (dropdown) dropdown.classList.remove('open');
            const arrow = document.getElementById('avatar-arrow');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
        }

        // ================================================================
        //  LOGIN / LOGOUT
        // ================================================================
                function performLogin(account = null) {
isLoggedIn = true;
localStorage.setItem('myvtc_logged_in', 'true');

if (account) {
    currentUser.name = account.name;
    currentUser.rank = account.rank || 'Hạng Đồng';
    currentUser.id = account.id || currentUser.id;
    currentUser.username = account.username || currentUser.username;
    currentUser.phone = account.type === 'phone' ? account.username : currentUser.phone;
    currentUser.email = account.type === 'email' ? account.username : currentUser.email;
}

if (guestLinkState.active && guestLinkState.action === 'register') {
    finishGuestRegisterLink();
    return;
}

localStorage.setItem('myvtc_current_user', JSON.stringify(currentUser));
renderHeader();

if (guestLinkState.active && guestLinkState.action === 'login') {
    authState.mode = 'login';
    authState.step = 63;
    authState.tempData.guestId = guestLinkState.guestId;
    authState.tempData.guestIdentifier = currentUser.username || currentUser.phone || currentUser.email || 'Tài khoản đã đăng nhập';
    authState.tempData.guestIdentifierExists = true;

    hideFeedback();
    renderStep();
    showFeedback('Đăng nhập thành công. Vui lòng chọn tài khoản để ghi đè dữ liệu.', true);
    return;
}

closeAuthModal();
showToast('Đăng nhập thành công!', 'success');

}

function loginWithSavedAccount(accountId) {
const accounts = getSavedLoginAccounts();
const account = accounts.find(item => item.id === accountId);

if (!account) {
    showFeedback('Không tìm thấy tài khoản đã lưu.');
    return;
}

performLogin(account);

}

function useAnotherLoginAccount() {
authState.step = 1;
hideFeedback();
renderStep();
}

function clearAllSavedLoginAccounts() {
localStorage.removeItem('myvtc_saved_login_accounts');
authState.step = 1;
hideFeedback();
renderStep();
showToast('Đã đăng xuất khỏi tất cả tài khoản trên thiết bị', 'info');
}

        // ================================================================
        //  AUTH MODAL
        // ================================================================
        function openAuthModal(initialMode = 'login') {
            const modal = document.getElementById('auth-modal');
            document.body.classList.add('overflow-hidden');
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.classList.add('show');
            switchMode(initialMode);
        }

        function closeAuthModal() {
            const modal = document.getElementById('auth-modal');
            modal.classList.remove('show');
            document.body.classList.remove('overflow-hidden');
            setTimeout(() => {
                modal.style.display = 'none';
                hideFeedback();
                document.getElementById('auth-lang-dropdown')?.classList.add('hidden');
            }, 300);
        }

        // ================================================================
        //  AUTH LOGIC
        // ================================================================
        function switchMode(mode) {
authState.mode = mode;

if (mode === 'login') {
    authState.step = 0;
} else if (mode === 'register') {
    authState.step = 0;
} else if (mode === 'forgot_account') {
    authState.step = 1;
}

authState.tempData = {};
authState.otpMethod = 'sms';
authState.otpRequestsCount = 0;
authState.otpWrongCount = 0;

const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');

if (mode === 'login') {
    tabLogin.className = "auth-tab active";
    tabRegister.className = "auth-tab";
    tabLogin.style.display = '';
    tabRegister.style.display = '';
} else if (mode === 'register') {
    tabRegister.className = "auth-tab active";
    tabLogin.className = "auth-tab";
    tabLogin.style.display = '';
    tabRegister.style.display = '';
    authState.subType = 'phone';
} else if (mode === 'forgot_account') {
    tabLogin.className = "auth-tab";
    tabRegister.className = "auth-tab";
    tabLogin.style.display = 'none';
    tabRegister.style.display = 'none';
}

hideFeedback();
renderStep();

}

        function selectRegisterMethod(type) {
            authState.subType = type;
            authState.step = 1;
            hideFeedback();
            renderStep();
        }

        function goBackRegister() {
            if (authState.step > 1) {
                authState.step--;
                hideFeedback();
                renderStep();
            }
        }

        function selectOTPMethod(method) {
            authState.otpMethod = method;
            authState.step = 3;
            hideFeedback();
            renderStep();
        }

        function showFeedback(msg, isSuccess = false) {
            const f = document.getElementById('modal-feedback');
            f.classList.remove('hidden', 'bg-red-50', 'text-red-600', 'bg-emerald-50', 'text-emerald-600');
            f.innerText = msg;
            if (isSuccess) {
                f.classList.add('bg-emerald-50', 'text-emerald-600');
            } else {
                f.classList.add('bg-red-50', 'text-red-600');
            }
        }

        function hideFeedback() {
            document.getElementById('modal-feedback').classList.add('hidden');
        }

        function allowOnlyNumbers(event) {
            if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) return true;
            if (!/[0-9]/.test(event.key)) { event.preventDefault(); return false; }
        }

        function validateVietnamesePhone(p) { return /^(03|05|07|08|09|01[2689])+([0-9]{8})$/.test(p) && p.length === 10; }

        function validateEmailFormat(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

        function validatePasswordFormat(p) { return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,32}$/.test(p); }

        function validateNicknameFormat(n) { return /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấẩẫậắằẳẵặẹẻẽềềểỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỶỸỸửữựỳýỷỹỹ\s]{4,50}$/
                .test(n); }

        function validateFullnameFormat(n) { return /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấẩẫậắằẳẵặẹẻẽềềểỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỶỸỸửữựỳýỷỹỹ\s]{4,100}$/
                .test(n); }

        function validateDateFormat(d) { return d && d.split("-").length === 3; }

        function calculateAge(d) {
            const b = new Date(d),
                t = new Date();
            let a = t.getFullYear() - b.getFullYear();
            const m = t.getMonth() - b.getMonth();
            if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
            return a;
        }

        function renderStep() {
    const container = document.getElementById('dynamic-modal-content');
    container.innerHTML = '';

    if (authState.mode === 'login') {
        renderLoginFlow(container);
    } else if (authState.mode === 'register') {
        renderRegisterFlow(container);
    } else if (authState.mode === 'forgot_account') {
        renderForgotAccountFlow(container);
    }
}

        // ================================================================
        //  SOCIAL LOGIN
        // ================================================================
        function initSocialLogin(provider) {
            authState.tempData.socialProvider = provider;
            authState.mode = 'social_oauth';
            hideFeedback();
            const container = document.getElementById('dynamic-modal-content');
            container.innerHTML = `
                <div class="space-y-5 w-full pt-2 slide-up">
                    <div class="text-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div class="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 bg-white shadow-sm">
                            ${provider === 'Google' ? '<i class="fab fa-google text-2xl text-red-500"></i>' : ''}
                            ${provider === 'Apple ID' ? '<i class="fab fa-apple text-2xl text-black"></i>' : ''}
                            ${provider === 'Facebook' ? '<i class="fab fa-facebook-f text-2xl text-blue-600"></i>' : ''}
                        </div>
                        <h3 class="text-lg font-bold text-gray-900">Đồng bộ dữ liệu</h3>
                        <p class="text-xs text-gray-500 mt-1.5 leading-relaxed">Liên kết tài khoản với hệ thống định danh <span class="font-semibold text-blue-600">MyVTC</span>.</p>
                    </div>
                    <div class="space-y-2">
                        <h4 class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Thông tin chia sẻ:</h4>
                        <div class="space-y-1.5">
                            <div class="flex items-center space-x-3 text-sm text-gray-700 bg-slate-50/50 p-3 rounded-xl border border-gray-100/70">
                                <i class="fas fa-check-circle text-emerald-500 text-base"></i><span>Họ tên & ID hồ sơ</span>
                            </div>
                            <div class="flex items-center space-x-3 text-sm text-gray-700 bg-slate-50/50 p-3 rounded-xl border border-gray-100/70">
                                <i class="fas fa-check-circle text-emerald-500 text-base"></i><span>Địa chỉ Email</span>
                            </div>
                        </div>
                    </div>
                    <div class="pt-1 space-y-2">
                        <button onclick="confirmSocialLogin()" class="auth-btn-primary">Xác thực & Cho phép</button>
                        <button onclick="switchMode('login')" class="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 font-semibold">Hủy bỏ</button>
                    </div>
                </div>`;
        }

        function confirmSocialLogin() {
    performLogin();
}

function startGuestLinkFlow(type) {
    const guestId = getOrCreateGuestLinkId();

    guestLinkState = {
        active: true,
        action: type,
        guestId: guestId
    };

    if (type === 'register') {
        openAuthModal('register');
        authState.tempData.guestId = guestId;
        renderStep();
        return;
    }

    if (type === 'login') {
        openAuthModal('login');
        authState.step = 1;
        authState.tempData.guestId = guestId;
        renderStep();
        return;
    }
}
function finishGuestRegisterLink() {
    const linkedUsername = authState.tempData.phone || authState.tempData.email || authState.tempData.username || currentUser.username;

    currentUser = {
        ...currentUser,
        username: linkedUsername,
        phone: validateVietnamesePhone(linkedUsername) ? linkedUsername : currentUser.phone,
        email: validateEmailFormat(linkedUsername) ? linkedUsername : currentUser.email
    };

    localStorage.setItem('myvtc_logged_in', 'true');
    localStorage.setItem('myvtc_current_user', JSON.stringify(currentUser));

    renderHeader();
    closeAuthModal();

    showToast('Đã tự động liên kết tài khoản mới đăng ký với dữ liệu của tài khoản khách', 'success');

    resetGuestLinkState();

    if (document.getElementById('my-account-page')) {
        initMyAccountPage();
        showAccountTab('linked');
    }
}
function goGuestIdentifierLink() {
    authState.step = 61;
    hideFeedback();
    renderStep();
}

function goGuestFacebookLink() {
    authState.step = 64;
    hideFeedback();
    renderStep();
}

function checkGuestIdentifierLink() {
    const value = document.getElementById('guest-link-identifier').value.trim();

    if (!value) {
        showFeedback('Vui lòng nhập Email hoặc SĐT');
        return;
    }

    const isPhone = validateVietnamesePhone(value);
    const isEmail = validateEmailFormat(value);

    if (!isPhone && !isEmail) {
        showFeedback('Email hoặc SĐT không hợp lệ');
        return;
    }

    authState.tempData.guestIdentifier = value;
    authState.tempData.guestIdentifierExists = mockExistingUsers.includes(value);
    authState.step = 62;
    hideFeedback();
    renderStep();
}

function verifyGuestIdentifierOtp() {
    const code = document.getElementById('guest-link-otp').value.trim();

    if (!code) {
        showFeedback('Vui lòng nhập mã OTP');
        return;
    }

    if (code !== '123456') {
        showFeedback('Mã OTP không đúng');
        return;
    }

    authState.step = 63;
    hideFeedback();
    renderStep();
}

function verifyGuestFacebookLogin() {
    authState.tempData.socialProvider = 'Facebook';
    authState.step = 63;
    hideFeedback();
    renderStep();
}

function finishGuestMerge(source) {
    const linkedValue = authState.tempData.guestIdentifier || authState.tempData.socialProvider || 'Facebook';
    const isNew = authState.tempData.guestIdentifierExists === false;

    currentUser = {
        ...currentUser,
        name: source === 'guest' ? 'Tài khoản khách' : currentUser.name,
        username: linkedValue,
        phone: validateVietnamesePhone(linkedValue) ? linkedValue : currentUser.phone,
        email: validateEmailFormat(linkedValue) ? linkedValue : currentUser.email
    };

    isLoggedIn = true;
    localStorage.setItem('myvtc_logged_in', 'true');
    localStorage.setItem('myvtc_current_user', JSON.stringify(currentUser));

    renderHeader();
    closeAuthModal();

    if (isNew) {
        showToast('Đăng ký và liên kết tài khoản khách thành công', 'success');
    } else {
        showToast('Đăng nhập và liên kết tài khoản khách thành công', 'success');
    }

        resetGuestLinkState();

    if (document.getElementById('my-account-page')) {
        initMyAccountPage();
        showAccountTab('linked');
    }
}

        // ================================================================
        //  LOGIN FLOW (CẢI TIẾN GIAO DIỆN)
        // ================================================================
        function renderLoginFlow(container) {
if (authState.step === 0) {
const savedAccounts = getSavedLoginAccounts();

            if (!savedAccounts.length) {
                authState.step = 1;
                renderStep();
                return;
            }

            container.innerHTML = `
                <div class="saved-account-box slide-up">
                    <h3 class="saved-account-title">Chọn tài khoản của bạn</h3>

                    <div class="saved-account-list">
                        ${savedAccounts.map(account => `
                            <button class="saved-account-item" onclick="loginWithSavedAccount('${account.id}')">
                                <div class="saved-account-icon">
                                    <i class="fas ${account.icon || 'fa-user'}"></i>
                                </div>

                                <div class="saved-account-info">
                                    <div>${account.name}</div>
                                    <span>${account.username}</span>
                                </div>

                                <i class="fas fa-chevron-right saved-account-arrow"></i>
                            </button>
                        `).join('')}

                        <button class="saved-account-item" onclick="useAnotherLoginAccount()">
                            <div class="saved-account-icon">
                                <i class="fas fa-user"></i>
                            </div>

                            <div class="saved-account-info saved-account-other">
                                <div>Sử dụng một tài khoản khác</div>
                            </div>

                            <i class="fas fa-chevron-right saved-account-arrow"></i>
                        </button>
                    </div>

                    <button class="saved-account-clear" onclick="clearAllSavedLoginAccounts()">
                        <i class="fas fa-arrow-left"></i>
                        Đăng xuất khỏi tất cả các tài khoản
                    </button>
                </div>
            `;
        } else if (authState.step === 1) {
                container.innerHTML = `
    <div class="auth-login-box slide-up">
        <div>
    <label class="auth-field-label">Tài khoản</label>
    <div class="auth-input-wrap">
        <i class="fas fa-user auth-input-icon"></i>
        <input type="text" id="login-username" placeholder="SĐT, Email hoặc tên đăng nhập" class="auth-input">
    </div>

    <div class="flex justify-end mt-3">
        <button onclick="switchMode('forgot_account')" class="link-text">Quên tài khoản?</button>
    </div>
</div>

        <button onclick="handleLoginStep1()" class="auth-btn-primary">Tiếp tục</button>

        <div class="auth-divider">Hoặc</div>

        <div class="social-row">
            <button onclick="initSocialLogin('Google')" class="social-btn">
                <i class="fab fa-google text-red-500"></i>
            </button>
            <button onclick="initSocialLogin('Apple ID')" class="social-btn">
                <i class="fab fa-apple text-black"></i>
            </button>
            <button onclick="initSocialLogin('Facebook')" class="social-btn">
                <i class="fab fa-facebook-f text-blue-600"></i>
            </button>
        </div>

        <div class="quick-login">
            <button onclick="handleGuestLogin()">
                <i class="fas fa-user-secret"></i>
                <span>Đăng nhập nhanh</span>
            </button>
        </div>
    </div>
`;
            } else if (authState.step === 2) {
                container.innerHTML = `
                    <div class="space-y-4 w-full pt-1 slide-up">
                        <div class="bg-blue-50/70 px-4 py-2.5 rounded-xl border border-blue-100 text-xs text-blue-800 flex items-center justify-between">
                            <span>Tài khoản: <span class="font-bold">${authState.tempData.username}</span></span>
                            <button onclick="authState.step = 1; renderStep();" class="text-blue-600 hover:text-blue-800 font-semibold text-xs">Đổi</button>
                        </div>
                        <div>
                            <label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                            <input type="password" id="login-password" maxlength="32" placeholder="••••••••" class="auth-input">
                        </div>
                        <button onclick="handleLoginWithPassword()" class="auth-btn-primary section-gap">Đăng nhập</button>

                        <div class="flex justify-center gap-4 text-xs text-gray-400 pt-1">
                            <button onclick="authState.step = 3; renderStep();" class="link-text"><i class="fas fa-shield-alt mr-1"></i>Đăng nhập bằng OTP</button>
                            <button onclick="authState.step = 1; renderStep();" class="link-text">Quay lại</button>
                        </div>
                    </div>
                `;
            } else if (authState.step === 3) {
                container.innerHTML = `
                    <div class="space-y-4 w-full pt-1 slide-up">
                        <div class="text-center mb-1">
                            <h3 class="text-base font-bold text-gray-800">Nhận mã OTP</h3>
                            <p class="text-xs text-gray-400 mt-1">Chọn kênh nhận mã xác thực</p>
                        </div>
                        <div class="space-y-2.5">
                            ${['SMS','Voice','Email','OTP App'].map(m => `
                                <button onclick="selectLoginOTPMethod('${m}')" class="w-full p-3.5 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 flex items-center justify-between transition-all group shadow-sm">
                                    <div class="flex items-center space-x-3.5">
                                        <div class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <i class="fas ${m==='SMS'?'fa-comment-alt':m==='Voice'?'fa-phone-volume':m==='Email'?'fa-envelope':'fa-mobile-alt'} text-lg"></i>
                                        </div>
                                        <div class="text-left"><p class="text-sm font-bold text-gray-800">${m}</p></div>
                                    </div>
                                    <i class="fas fa-chevron-right text-xs text-gray-400 group-hover:text-blue-500 transition-colors"></i>
                                </button>
                            `).join('')}
                        </div>
                        <button onclick="authState.step = 2; renderStep();" class="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-1 font-semibold">Quay lại</button>
                    </div>
                `;
            } else if (authState.step === 4) {
                container.innerHTML = `
                    <div class="space-y-4 w-full pt-1 slide-up">
                        <div class="text-center">
                            <h3 class="text-base font-bold text-gray-800">Nhập mã OTP</h3>
                            <p class="text-xs text-gray-400 mt-1.5">Mã đã gửi qua <span class="font-bold text-blue-600">${authState.tempData.otpMethod || ''}</span></p>
                            <input type="text" id="login-otp-code" placeholder="6 số OTP" class="auth-input text-center font-bold text-xl tracking-widest mt-3">
                        </div>
                        <button onclick="verifyLoginOTP()" class="auth-btn-primary">Xác minh & Đăng nhập</button>
                        <div class="flex justify-center gap-4 text-xs text-gray-400 pt-1">
                            <button onclick="authState.step = 3; renderStep();" class="link-text">Đổi phương thức</button>
                        </div>
                    </div>
                `;
            } else if (authState.step === 60) {
    container.innerHTML = `
        <div class="space-y-4 w-full text-center pt-2 slide-up">
            <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600"><i class="fas fa-user-check text-xl"></i></div>
            <h3 class="text-lg font-bold text-gray-900">Đăng nhập tài khoản khách</h3>
            <p class="text-sm font-bold text-gray-500">Mã tạm: <span class="text-blue-600">${authState.tempData.guestId}</span></p>
            <p class="text-xs text-gray-500 bg-slate-50 p-4 rounded-xl border border-gray-200 leading-relaxed">Chọn cách liên kết để giữ dữ liệu tài khoản khách.</p>

            <button onclick="goGuestIdentifierLink()" class="auth-btn-primary">Liên kết bằng Email hoặc SĐT</button>

            <button onclick="goGuestFacebookLink()" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md">
                <i class="fab fa-facebook-f mr-2"></i> Kết nối Facebook
            </button>

            <button onclick="closeAuthModal(); showToast('Đăng nhập khách thành công')" class="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md">Vào trang chủ</button>
        </div>
    `;
} else if (authState.step === 61) {
    container.innerHTML = `
        <div class="space-y-5 w-full pt-1 slide-up">
            <div>
                <h2 class="text-xl font-bold text-blue-700">Liên kết tài khoản khách</h2>
                <p class="text-sm text-gray-600 mt-2">Nhập Email hoặc SĐT để kiểm tra tài khoản.</p>
            </div>

            <div>
                <label class="auth-field-label">Email hoặc SĐT</label>
                <div class="auth-input-wrap">
                    <i class="fas fa-user auth-input-icon"></i>
                    <input type="text" id="guest-link-identifier" placeholder="Email hoặc SĐT" class="auth-input">
                </div>
            </div>

            <button onclick="checkGuestIdentifierLink()" class="auth-btn-primary">Kiểm tra</button>
            <button onclick="authState.step = 60; renderStep();" class="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-1 font-semibold">Quay lại</button>
        </div>
    `;
} else if (authState.step === 62) {
    const exists = authState.tempData.guestIdentifierExists;
    container.innerHTML = `
        <div class="space-y-5 w-full pt-1 slide-up">
            <div class="text-center">
                <h3 class="text-lg font-bold text-gray-900">${exists ? 'Xác thực OTP đăng nhập' : 'Xác thực OTP đăng ký mới'}</h3>
                <p class="text-sm text-gray-600 mt-2">${authState.tempData.guestIdentifier}</p>
                <p class="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-xl p-3 mt-3">
                    ${exists ? 'Email hoặc SĐT đã tồn tại ở Username. Hệ thống mở luồng OTP đăng nhập.' : 'Email hoặc SĐT chưa tồn tại ở Username. Hệ thống mở luồng OTP đăng ký mới.'}
                </p>
            </div>

            <input type="text" id="guest-link-otp" placeholder="Nhập mã OTP 123456" maxlength="6" onkeydown="allowOnlyNumbers(event)" class="auth-input text-center font-bold text-xl tracking-widest">

            <button onclick="verifyGuestIdentifierOtp()" class="auth-btn-primary">Xác minh</button>
            <button onclick="authState.step = 61; renderStep();" class="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-1 font-semibold">Quay lại</button>
        </div>
    `;
} else if (authState.step === 63) {
    const label = authState.tempData.guestIdentifier || 'Facebook';
    container.innerHTML = `
        <div class="space-y-5 w-full pt-1 slide-up">
            <div class="text-center">
                <div class="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-2 text-emerald-600"><i class="fas fa-check text-xl"></i></div>
                <h3 class="text-lg font-bold text-gray-900">Chọn dữ liệu giữ lại</h3>
                <p class="text-sm text-gray-600 mt-2">Tài khoản liên kết: <span class="font-bold text-blue-700">${label}</span></p>
            </div>

            <button onclick="finishGuestMerge('guest')" class="w-full p-4 border border-blue-300 rounded-xl hover:bg-blue-50 text-left">
                <strong class="block text-gray-900">Giữ dữ liệu tài khoản khách</strong>
                <span class="text-sm text-gray-600">Dữ liệu Email, SĐT hoặc Facebook bị ghi đè theo tài khoản khách.</span>
            </button>

            <button onclick="finishGuestMerge('linked')" class="w-full p-4 border border-blue-300 rounded-xl hover:bg-blue-50 text-left">
                <strong class="block text-gray-900">Giữ dữ liệu tài khoản liên kết</strong>
                <span class="text-sm text-gray-600">Dữ liệu tài khoản khách bị ghi đè theo Email, SĐT hoặc Facebook.</span>
            </button>
        </div>
    `;
} else if (authState.step === 64) {
    container.innerHTML = `
        <div class="space-y-5 w-full pt-2 slide-up">
            <div class="text-center bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div class="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 bg-white shadow-sm text-blue-600">
                    <i class="fab fa-facebook-f text-2xl"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900">Đăng nhập bằng Facebook</h3>
                <p class="text-sm text-gray-600 mt-2">Giả lập xác thực Facebook để liên kết với tài khoản khách.</p>
            </div>

            <button onclick="verifyGuestFacebookLogin()" class="auth-btn-primary">Xác thực Facebook</button>
            <button onclick="authState.step = 60; renderStep();" class="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-1 font-semibold">Quay lại</button>
        </div>
    `;
}
        }

        function handleLoginStep1() {
            const u = document.getElementById('login-username').value.trim();
            if (!u) { showFeedback('Vui lòng nhập tài khoản'); return; }
            authState.tempData.username = u;
            authState.step = 2;
            hideFeedback();
            renderStep();
        }

        function handleLoginWithPassword() {
            const p = document.getElementById('login-password').value;
            if (!p) { showFeedback('Vui lòng nhập mật khẩu'); return; }
            if (!validatePasswordFormat(p)) {
                showFeedback('Mật khẩu 6-32 ký tự, gồm hoa, thường, số.');
                return;
            }
            performLogin();
        }

        function goToOTPMethodScreen() { authState.step = 3;
            hideFeedback();
            renderStep(); }

        function selectLoginOTPMethod(method) {
            if (authState.otpRequestsCount >= 3) { showFeedback('Quá số lần yêu cầu OTP.'); return; }
            authState.otpRequestsCount++;
            authState.tempData.otpMethod = method;
            authState.step = 4;
            hideFeedback();
            renderStep();
        }

        function verifyLoginOTP() {
            const code = document.getElementById('login-otp-code').value.trim();
            if (!code) { showFeedback('Vui lòng nhập mã OTP'); return; }
            if (authState.otpWrongCount >= 2) { showFeedback('Sai OTP quá nhiều. Khóa 15 phút.'); return; }
            if (code !== '123456') { authState.otpWrongCount++;
                showFeedback('Mã OTP không đúng.'); return; }
            performLogin();
        }

        function handleGuestLogin() {
            let localGuestId = localStorage.getItem('myvtc_guest_id');
            if (!localGuestId) {
                localGuestId = 'GUEST-' + Math.floor(100000 + Math.random() * 900000);
                localStorage.setItem('myvtc_guest_id', localGuestId);
                localStorage.setItem('myvtc_guest_progress', JSON.stringify({ created_at: new Date(), data: 'default_init_metrics' }));
                showToast('Tạo Guest ID mới.', 'info');
            } else {
                showToast('Đã tải dữ liệu cục bộ.', 'success');
            }
            authState.tempData.guestId = localGuestId;
            authState.step = 60;
            hideFeedback();
            renderStep();
        }
// ================================================================
//  FORGOT ACCOUNT / RESET PASSWORD FLOW
// ================================================================
function renderForgotAccountFlow(container) {
    if (authState.step === 1) {
        container.innerHTML = `
            <div class="space-y-6 w-full pt-1 slide-up">
                <div>
                    <h2 class="text-xl font-bold text-blue-600">Lấy lại tài khoản</h2>
                    <div class="w-16 h-0.5 bg-blue-600 mt-3 rounded-full"></div>
                </div>

                <div class="pt-5">
                    <label class="auth-field-label">Tài khoản</label>
                    <div class="auth-input-wrap">
                        <i class="fas fa-user auth-input-icon"></i>
                        <input type="text" id="forgot-keyword" placeholder="SĐT, Email hoặc tên đăng nhập" class="auth-input">
                    </div>
                </div>

                <button onclick="handleForgotLookup()" class="auth-btn-primary">Tiếp tục</button>

                <button onclick="switchMode('login')" class="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-1 font-semibold">Quay lại</button>
            </div>
        `;
    } else if (authState.step === 2) {
        const accounts = authState.tempData.recoveryAccounts || [];

        container.innerHTML = `
            <div class="space-y-5 w-full pt-1 slide-up">
                <div>
                    <h2 class="text-xl font-bold text-blue-600">Lấy lại tài khoản</h2>
                    <div class="w-16 h-0.5 bg-blue-600 mt-3 rounded-full"></div>
                </div>

                <div class="text-center pt-3">
                    <h3 class="text-base font-bold text-gray-900">Chọn tài khoản của bạn</h3>
                </div>

                <div class="space-y-3">
                    ${accounts.map(acc => `
                        <button onclick="selectRecoveryAccount('${acc.id}')" class="w-full p-4 border border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 flex items-center justify-between transition-all shadow-sm group">
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <i class="fas ${acc.icon}"></i>
                                </div>
                                <div class="text-left">
                                    <p class="text-sm font-bold text-gray-900">${acc.displayName}</p>
                                    <p class="text-xs font-semibold text-gray-700 mt-1">Username: ${acc.username}</p>
                                </div>
                            </div>
                            <i class="fas fa-chevron-right text-gray-300 group-hover:text-blue-500"></i>
                        </button>
                    `).join('')}
                </div>

                <button onclick="authState.step = 1; renderStep();" class="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-1 font-semibold">Quay lại</button>
            </div>
        `;
    } else if (authState.step === 3) {
        container.innerHTML = `
            <div class="space-y-5 w-full pt-1 slide-up">
                <div>
                    <h2 class="text-xl font-bold text-blue-600">Lấy lại tài khoản</h2>
                    <div class="w-16 h-0.5 bg-blue-600 mt-3 rounded-full"></div>
                </div>

                <div class="text-center pt-3">
                    <h3 class="text-base font-bold text-gray-900">Nhận mã OTP</h3>
                    <p class="text-xs text-gray-400 mt-1">Chọn kênh nhận mã xác thực</p>
                </div>

                <div class="space-y-3">
                    ${['SMS','Voice','Email','OTP App'].map(m => `
                        <button onclick="selectRecoveryOTPMethod('${m}')" class="w-full p-4 border border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50/30 flex items-center justify-between transition-all shadow-sm group">
                            <div class="flex items-center space-x-4">
                                <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <i class="fas ${m==='SMS'?'fa-comment-alt':m==='Voice'?'fa-phone-volume':m==='Email'?'fa-envelope':'fa-mobile-alt'}"></i>
                                </div>
                                <p class="text-sm font-bold text-gray-800">${m}</p>
                            </div>
                            <i class="fas fa-chevron-right text-gray-300 group-hover:text-blue-500"></i>
                        </button>
                    `).join('')}
                </div>

                <button onclick="authState.step = 2; renderStep();" class="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-1 font-semibold">Quay lại</button>
            </div>
        `;
    } else if (authState.step === 4) {
        container.innerHTML = `
            <div class="space-y-5 w-full pt-1 slide-up">
                <div>
                    <h2 class="text-xl font-bold text-blue-600">Lấy lại tài khoản</h2>
                    <div class="w-16 h-0.5 bg-blue-600 mt-3 rounded-full"></div>
                </div>

                <div class="text-center pt-3">
                    <h3 class="text-base font-bold text-gray-900">Nhập mã OTP</h3>
                    <p class="text-xs text-gray-400 mt-1.5">Mã đã gửi qua <span class="font-bold text-blue-600">${authState.tempData.otpMethod || ''}</span></p>
                </div>

                <input type="text" id="forgot-otp-code" placeholder="6 số OTP" maxlength="6" onkeydown="allowOnlyNumbers(event)" class="auth-input text-center font-bold text-xl tracking-widest">

                <button onclick="verifyRecoveryOTP()" class="auth-btn-primary">Xác minh</button>

                <button onclick="authState.step = 3; renderStep();" class="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-1 font-semibold">Đổi phương thức</button>
            </div>
        `;
    } else if (authState.step === 5) {
        container.innerHTML = `
            <div class="space-y-5 w-full pt-1 slide-up">
                <div>
                    <h2 class="text-xl font-bold text-blue-600">Lấy lại tài khoản</h2>
                    <div class="w-16 h-0.5 bg-blue-600 mt-3 rounded-full"></div>
                </div>

                <div class="text-center pt-3">
                    <h3 class="text-base font-bold text-gray-900">Tạo mật khẩu mới</h3>
                </div>

                <div class="space-y-3">
                    <div>
                        <label class="auth-field-label">Mật khẩu</label>
                        <input type="password" id="forgot-new-password" maxlength="32" placeholder="6-32 ký tự, gồm hoa, thường, số" class="auth-input">
                    </div>

                    <div>
                        <label class="auth-field-label">Xác nhận</label>
                        <input type="password" id="forgot-new-password-confirm" maxlength="32" placeholder="Nhập lại mật khẩu" class="auth-input">
                    </div>
                </div>

                <button onclick="submitRecoveryPassword()" class="auth-btn-primary">Hoàn thành</button>

                <button onclick="switchMode('login')" class="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-1 font-semibold">Quay lại</button>
            </div>
        `;
    }
}

function handleForgotLookup() {
    const keyword = document.getElementById('forgot-keyword').value.trim();

    if (!keyword) {
        showFeedback('Vui lòng nhập SĐT, Email hoặc tên tài khoản');
        return;
    }

    const accounts = findRecoveryAccounts(keyword);

    if (!accounts.length) {
        showFeedback('Thông tin tài khoản không tồn tại');
        return;
    }

    authState.tempData.recoveryKeyword = keyword;
    authState.tempData.recoveryAccounts = accounts;
    authState.step = 2;
    hideFeedback();
    renderStep();
}

function selectRecoveryAccount(accountId) {
    const accounts = authState.tempData.recoveryAccounts || [];
    const account = accounts.find(acc => acc.id === accountId);

    if (!account) {
        showFeedback('Không tìm thấy tài khoản đã chọn');
        return;
    }

    authState.tempData.selectedRecoveryAccount = account;
    authState.step = 3;
    hideFeedback();
    renderStep();
}

function selectRecoveryOTPMethod(method) {
    if (authState.otpRequestsCount >= 3) {
        showFeedback('Quá số lần yêu cầu OTP.');
        return;
    }

    authState.otpRequestsCount++;
    authState.tempData.otpMethod = method;
    authState.step = 4;
    hideFeedback();
    renderStep();
}

function verifyRecoveryOTP() {
    const code = document.getElementById('forgot-otp-code').value.trim();

    if (!code) {
        showFeedback('Vui lòng nhập mã OTP');
        return;
    }

    if (authState.otpWrongCount >= 2) {
        showFeedback('Sai OTP quá nhiều. Khóa 15 phút.');
        return;
    }

    if (code !== '123456') {
        authState.otpWrongCount++;
        showFeedback('Mã OTP không đúng.');
        return;
    }

    authState.step = 5;
    hideFeedback();
    renderStep();
}

function submitRecoveryPassword() {
    const password = document.getElementById('forgot-new-password').value;
    const passwordConfirm = document.getElementById('forgot-new-password-confirm').value;

    if (!password) {
        showFeedback('Vui lòng nhập mật khẩu mới');
        return;
    }

    if (!validatePasswordFormat(password)) {
        showFeedback('Mật khẩu 6-32 ký tự, gồm hoa, thường, số.');
        return;
    }

    if (password !== passwordConfirm) {
        showFeedback('Mật khẩu xác nhận không khớp');
        return;
    }

    authState.tempData.newPassword = password;
    performLogin();
}
        // ================================================================
        //  REGISTER FLOW (CẢI TIẾN GIAO DIỆN)
        // ================================================================
        function renderRegisterFlow(container) {
            if (authState.step === 0) {
                container.innerHTML = `
                    <div class="space-y-4 w-full pt-1 slide-up">
                        <div class="text-center mb-2">
                            <h3 class="text-lg font-bold text-gray-900">Chọn cách tạo tài khoản</h3>
                        </div>
                        <div class="space-y-2.5">
                            <div onclick="selectRegisterMethod('phone')" class="method-card flex items-center gap-4">
                                <div class="icon-wrap"><i class="fas fa-phone-alt"></i></div>
                                <div class="flex-1"><div class="title">Số điện thoại</div></div>
                                <i class="fas fa-chevron-right text-gray-300 text-sm"></i>
                            </div>
                            <div onclick="selectRegisterMethod('email')" class="method-card flex items-center gap-4">
                                <div class="icon-wrap"><i class="fas fa-envelope"></i></div>
                                <div class="flex-1"><div class="title">Email</div></div>
                                <i class="fas fa-chevron-right text-gray-300 text-sm"></i>
                            </div>
                            <div onclick="selectRegisterMethod('username')" class="method-card flex items-center gap-4">
                                <div class="icon-wrap"><i class="fas fa-user"></i></div>
                                <div class="flex-1"><div class="title">Tên tài khoản</div></div>
                                <i class="fas fa-chevron-right text-gray-300 text-sm"></i>
                            </div>
                        </div>
                        <div class="divider-text">Hoặc</div>
                        <div class="flex gap-3">
                            <button onclick="initSocialLogin('Google')" class="social-btn"><i class="fab fa-google text-xl text-red-500"></i></button>
                            <button onclick="initSocialLogin('Facebook')" class="social-btn"><i class="fab fa-facebook-f text-xl text-blue-600"></i></button>
                            <button onclick="initSocialLogin('Apple ID')" class="social-btn"><i class="fab fa-apple text-2xl text-black"></i></button>
                        </div>
                        <button onclick="switchMode('login')" class="w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 font-semibold mt-2">
                            <i class="fas fa-arrow-left mr-1"></i> Quay lại đăng nhập
                        </button>
                    </div>
                `;
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.className = "space-y-4 w-full slide-up";

            let title = '';
            let buttonText = 'Tiếp tục';
            let showBack = true;

            if (authState.subType === 'phone') {
                if (authState.step === 1) {
                    title = 'Đăng ký qua SĐT';
                    wrapper.innerHTML = `
                        <div class="space-y-3.5">
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                                <input type="tel" id="reg-phone" placeholder="10 số, VD: 0912345678" onkeydown="allowOnlyNumbers(event)" class="auth-input">
                            </div>
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                                <input type="password" id="reg-pass" maxlength="32" placeholder="6-32 ký tự, gồm hoa, thường, số" class="auth-input">
                            </div>
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Xác nhận</label>
                                <input type="password" id="reg-pass-confirm" maxlength="32" placeholder="Nhập lại mật khẩu" class="auth-input">
                            </div>
                        </div>
                    `;
                    buttonText = 'Tiếp tục';
                } else if (authState.step === 2) {
                    title = 'Nhận mã';
                    wrapper.innerHTML = `
                        <div class="space-y-3">
                            <button onclick="selectOTPMethod('sms')" class="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 flex items-center justify-between transition-all group shadow-sm">
                                <div class="flex items-center space-x-3"><i class="fas fa-comment-dots text-xl text-gray-400 group-hover:text-blue-600"></i><div class="text-left"><p class="text-sm font-bold text-gray-800">SMS</p></div></div>
                                <i class="fas fa-chevron-right text-xs text-gray-400"></i>
                            </button>
                            <button onclick="selectOTPMethod('voice')" class="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 flex items-center justify-between transition-all group shadow-sm">
                                <div class="flex items-center space-x-3"><i class="fas fa-phone-volume text-xl text-gray-400 group-hover:text-blue-600"></i><div class="text-left"><p class="text-sm font-bold text-gray-800">Voice</p></div></div>
                                <i class="fas fa-chevron-right text-xs text-gray-400"></i>
                            </button>
                        </div>
                    `;
                    buttonText = 'Tiếp tục';
                } else if (authState.step === 3) {
                    title = 'Xác thực';
                    const placeholder = authState.otpMethod === 'sms' ? 'Nhập mã SMS' : 'Nhập mã Voice';
                    wrapper.innerHTML = `
                        <div class="space-y-4 w-full">
                            <p class="text-sm text-gray-500 text-center">Mã đã gửi đến SĐT của bạn</p>
                            <input type="text" id="reg-otp-code" placeholder="${placeholder}" class="auth-input text-center font-bold text-lg mt-1">
                        </div>
                    `;
                    buttonText = 'Tiếp tục';
                } else if (authState.step === 4) {
                    title = 'Thông tin eKYC';
                    renderIdentityForm(wrapper);
                    buttonText = 'Hoàn tất';
                }
            } else if (authState.subType === 'email') {
                if (authState.step === 1) {
                    title = 'Đăng ký qua Email';
                    wrapper.innerHTML = `
                        <div class="space-y-3.5">
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                                <input type="email" id="reg-email" placeholder="name@example.com" class="auth-input">
                            </div>
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                                <input type="password" id="reg-pass" maxlength="32" placeholder="6-32 ký tự, gồm hoa, thường, số" class="auth-input">
                            </div>
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Xác nhận</label>
                                <input type="password" id="reg-pass-confirm" maxlength="32" placeholder="Nhập lại mật khẩu" class="auth-input">
                            </div>
                        </div>
                    `;
                    buttonText = 'Tiếp tục';
                } else if (authState.step === 2) {
                    title = 'Xác thực Email';
                    wrapper.innerHTML = `
                        <div class="space-y-4 w-full">
                            <p class="text-sm text-gray-500 text-center">Mã xác thực đã gửi đến Email của bạn</p>
                            <input type="text" id="reg-otp-code" placeholder="Nhập mã OTP" class="auth-input text-center font-bold text-lg mt-1">
                        </div>
                    `;
                    buttonText = 'Tiếp tục';
                } else if (authState.step === 3) {
                    title = 'Thông tin eKYC';
                    renderIdentityForm(wrapper);
                    buttonText = 'Hoàn tất';
                }
            } else if (authState.subType === 'username') {
                if (authState.step === 1) {
                    title = 'Đăng ký tên tài khoản';
                    wrapper.innerHTML = `
                        <div class="space-y-3.5">
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tên tài khoản</label>
                                <input type="text" id="reg-username" placeholder="4-32 ký tự, chữ hoặc số" class="auth-input">
                            </div>
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                                <input type="password" id="reg-pass" maxlength="32" placeholder="6-32 ký tự, gồm hoa, thường, số" class="auth-input">
                            </div>
                            <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Xác nhận</label>
                                <input type="password" id="reg-pass-confirm" maxlength="32" placeholder="Nhập lại mật khẩu" class="auth-input">
                            </div>
                        </div>
                    `;
                    buttonText = 'Tiếp tục';
                } else if (authState.step === 2) {
                    title = 'Thông tin eKYC';
                    renderIdentityForm(wrapper);
                    buttonText = 'Hoàn tất';
                }
            }

            const headerDiv = document.createElement('div');
            headerDiv.className = "text-center mb-2";
            headerDiv.innerHTML = `<h3 class="text-lg font-bold text-gray-900">${title}</h3>`;
            wrapper.prepend(headerDiv);

            const actionBtn = document.createElement('button');
            actionBtn.className = "auth-btn-primary mt-2";
            actionBtn.textContent = buttonText;
            actionBtn.onclick = function() {
                if (authState.subType === 'phone') {
                    if (authState.step === 1) handlePhoneRegStep1();
                    else if (authState.step === 2) {} // chọn OTP đã có handler
                    else if (authState.step === 3) handlePhoneRegStep3();
                    else if (authState.step === 4) submitRegistrationFinal();
                } else if (authState.subType === 'email') {
                    if (authState.step === 1) handleEmailRegStep1();
                    else if (authState.step === 2) handleEmailOTP();
                    else if (authState.step === 3) submitRegistrationFinal();
                } else if (authState.subType === 'username') {
                    if (authState.step === 1) handleUsernameRegStep1();
                    else if (authState.step === 2) submitRegistrationFinal();
                }
            };
            wrapper.appendChild(actionBtn);

            if (showBack && authState.step > 1) {
                const backBtn = document.createElement('button');
                backBtn.className = "w-full text-center text-sm text-gray-400 hover:text-gray-600 py-2 font-semibold mt-1";
                backBtn.innerHTML = '<i class="fas fa-arrow-left mr-1"></i> Quay lại';
                backBtn.onclick = goBackRegister;
                wrapper.appendChild(backBtn);
            }

            container.appendChild(wrapper);
        }

        function renderIdentityForm(wrapper) {
            const div = document.createElement('div');
            div.className = "space-y-3 pt-1";
            div.innerHTML = `
                <div class="grid grid-cols-2 gap-3">
                    <div class="col-span-2"><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nickname</label>
                        <input type="text" id="info-nickname" placeholder="4-50 ký tự, chữ hoặc số" class="auth-input">
                    </div>
                    <div class="col-span-2"><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Họ và tên</label>
                        <input type="text" id="info-fullname" placeholder="Họ và tên" class="auth-input">
                    </div>
                    <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Ngày sinh</label>
                        <input type="date" id="info-dob" class="auth-input">
                    </div>
                    <div><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Giới tính</label>
                        <select id="info-gender" class="auth-input"><option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Khác">Khác</option></select>
                    </div>
                    <div class="col-span-2"><label class="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">CCCD / Hộ chiếu</label>
                        <input type="text" id="info-cccd" placeholder="12 chữ số" onkeydown="allowOnlyNumbers(event)" maxlength="12" class="auth-input">
                    </div>
                </div>
                <div class="mt-1 flex items-start space-x-2">
                    <input type="checkbox" id="info-policy" class="mt-1 rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-gray-300">
                    <label for="info-policy" class="text-[11px] text-gray-400 leading-normal">Tôi đồng ý với bảo mật và điều khoản.</label>
                </div>
            `;
            wrapper.appendChild(div);
        }

        // ===== Xử lý step đăng ký (giữ nguyên logic) =====
        function handlePhoneRegStep1() {
            const p = document.getElementById('reg-phone').value.trim(),
                pwd = document.getElementById('reg-pass').value,
                pwdC = document.getElementById('reg-pass-confirm').value;
            if (!p) { showFeedback('Vui lòng nhập SĐT'); return; }
            if (!validateVietnamesePhone(p)) { showFeedback('SĐT không đúng định dạng'); return; }
            if (mockExistingUsers.includes(p)) { showFeedback('SĐT đã được đăng ký.'); return; }
            if (!validatePasswordFormat(pwd)) { showFeedback('Mật khẩu 6-32 ký tự, gồm hoa, thường, số.'); return; }
            if (pwd !== pwdC) { showFeedback('Mật khẩu xác nhận không khớp'); return; }
            authState.tempData.phone = p;
            authState.tempData.password = pwd;
            authState.step = 2;
            hideFeedback();
            renderStep();
        }

        function handlePhoneRegStep3() {
            const otp = document.getElementById('reg-otp-code').value.trim();
            if (!otp) { showFeedback('Vui lòng nhập mã OTP'); return; }
            if (authState.otpWrongCount >= 2) { showFeedback('Sai OTP quá nhiều. Khóa 15 phút.'); return; }
            if (otp !== '123456') { authState.otpWrongCount++;
                showFeedback('Mã OTP không đúng.'); return; }
            authState.step = 4;
            hideFeedback();
            renderStep();
        }

        function handleEmailRegStep1() {
            const e = document.getElementById('reg-email').value.trim(),
                pwd = document.getElementById('reg-pass').value,
                pwdC = document.getElementById('reg-pass-confirm').value;
            if (!e) { showFeedback('Vui lòng nhập Email'); return; }
            if (!validateEmailFormat(e)) { showFeedback('Email không hợp lệ'); return; }
            if (mockExistingUsers.includes(e)) { showFeedback('Email đã được sử dụng.'); return; }
            if (!validatePasswordFormat(pwd)) { showFeedback('Mật khẩu 6-32 ký tự, gồm hoa, thường, số.'); return; }
            if (pwd !== pwdC) { showFeedback('Mật khẩu xác nhận không khớp'); return; }
            authState.tempData.email = e;
            authState.tempData.password = pwd;
            authState.step = 2;
            hideFeedback();
            renderStep();
        }

        function handleEmailOTP() {
            const otp = document.getElementById('reg-otp-code').value.trim();
            if (!otp) { showFeedback('Vui lòng nhập mã OTP'); return; }
            if (authState.otpWrongCount >= 2) { showFeedback('Sai OTP quá nhiều. Khóa 15 phút.'); return; }
            if (otp !== '123456') { authState.otpWrongCount++;
                showFeedback('Mã OTP không đúng.'); return; }
            authState.step = 3;
            hideFeedback();
            renderStep();
        }

        function handleUsernameRegStep1() {
            const u = document.getElementById('reg-username').value.trim(),
                pwd = document.getElementById('reg-pass').value,
                pwdC = document.getElementById('reg-pass-confirm').value;
            if (!u) { showFeedback('Vui lòng nhập tên tài khoản'); return; }
            if (u.length < 4 || u.length > 32) { showFeedback('Tên tài khoản 4-32 ký tự.'); return; }
            if (mockExistingUsers.includes(u)) { showFeedback('Tên tài khoản đã tồn tại.'); return; }
            if (!validatePasswordFormat(pwd)) { showFeedback('Mật khẩu 6-32 ký tự, gồm hoa, thường, số.'); return; }
            if (pwd !== pwdC) { showFeedback('Mật khẩu xác nhận không khớp'); return; }
            authState.tempData.username = u;
            authState.tempData.password = pwd;
            authState.step = 2;
            hideFeedback();
            renderStep();
        }

        function submitRegistrationFinal() {
            const nick = document.getElementById('info-nickname').value.trim(),
                name = document.getElementById('info-fullname').value.trim(),
                dob = document.getElementById('info-dob').value,
                gender = document.getElementById('info-gender').value,
                cccd = document.getElementById('info-cccd').value.trim(),
                policy = document.getElementById('info-policy').checked;
            if (!nick) { showFeedback('Vui lòng nhập Nickname'); return; }
            if (!validateNicknameFormat(nick)) { showFeedback('Nickname 4-50 ký tự, không ký tự đặc biệt'); return; }
            if (!name) { showFeedback('Vui lòng nhập họ tên'); return; }
            if (!validateFullnameFormat(name)) { showFeedback('Họ tên chỉ gồm chữ cái và khoảng trắng'); return; }
            if (!validateDateFormat(dob)) { showFeedback('Vui lòng nhập ngày sinh'); return; }
            if (calculateAge(dob) < 14) { showFeedback('Phải đủ 14 tuổi trở lên'); return; }
            if (!cccd || cccd.length !== 12) { showFeedback('CCCD phải đủ 12 chữ số'); return; }
            if (!policy) { showFeedback('Bạn phải đồng ý với điều khoản'); return; }
            performLogin();
        }

        // ================================================================
        //  TOAST
        // ================================================================
        function showToast(message, type = 'success') {
            const old = document.getElementById('custom-toast');
            if (old) old.remove();
            const toast = document.createElement('div');
            toast.id = 'custom-toast';
            toast.className =
                `fixed bottom-5 right-5 z-50 transform translate-y-10 opacity-0 transition-all duration-300 px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 text-white max-w-sm`;
            if (type === 'success') {
                toast.classList.add('bg-emerald-600');
                toast.innerHTML = `<i class="fas fa-check-circle text-base"></i> <span class="text-sm font-semibold">${message}</span>`;
            } else {
                toast.classList.add('bg-blue-600');
                toast.innerHTML = `<i class="fas fa-info-circle text-base"></i> <span class="text-sm font-semibold">${message}</span>`;
            }
            document.body.appendChild(toast);
            setTimeout(() => { toast.classList.remove('translate-y-10', 'opacity-0');
                toast.classList.add('translate-y-0', 'opacity-100'); }, 50);
            setTimeout(() => {
                toast.classList.remove('translate-y-0', 'opacity-100');
                toast.classList.add('translate-y-10', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        }

        // ================================================================
        //  FAQ
        // ================================================================
        function toggleFAQ(btn) {
            const item = btn.parentElement;
            item.classList.toggle('active');
            const icon = btn.querySelector('i');
            icon.style.transform = item.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        // ================================================================
        //  FOOTER LANGUAGE
        // ================================================================
        function toggleFooterLangDropdown() {
            const d = document.getElementById('footer-lang-dropdown');
            const arrow = document.getElementById('footer-lang-arrow');
            if (!d) return;
            d.classList.toggle('hidden');
            if (arrow) {
                arrow.style.transform = d.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        }

        function changeFooterLanguage(lang) {
            const flag = document.getElementById('footer-lang-flag');
            const txt = document.getElementById('footer-lang-text');
            if (lang === 'vi') { flag.innerText = '🇻🇳'; if (txt) txt.innerText = 'Tiếng Việt'; } else { flag.innerText =
                    '🇺🇸'; if (txt) txt.innerText = 'English'; }
            document.getElementById('footer-lang-dropdown').classList.add('hidden');
            const arrow = document.getElementById('footer-lang-arrow');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
            showToast('Chuyển đổi ngôn ngữ thành công', 'info');
        }



        // ================================================================
        //  MY ACCOUNT PAGE
        // ================================================================
                function initMyAccountPage(defaultTab = null) {
    const page = document.getElementById('my-account-page');
    if (!page) return;

    const urlTab = new URLSearchParams(window.location.search).get('tab');
    let targetTab = defaultTab || urlTab || 'personal';
    if (targetTab === 'payment') targetTab = 'personal';

            if (!isLoggedIn) {
                window.location.href = 'MyVTC_Home.html';
                return;
            }

            const setText = (id, value) => {
                const el = document.getElementById(id);
                if (el) el.textContent = value || '--';
            };

            setText('account-fullname', currentUser.name);
            setText('account-nickname', currentUser.nickname);
            setText('account-username', currentUser.username || currentUser.phone || currentUser.email);
            setText('account-phone', currentUser.phone);
            setText('account-email', currentUser.email);
            setText('security-phone-sms', currentUser.phone);
            setText('security-phone-voice', currentUser.phone);
            setText('security-phone-zalo', currentUser.phone);
            setText('security-email-otp', currentUser.email);
            setText('account-id', currentUser.id);
            setText('account-cccd', currentUser.cccd);
            setText('account-address', currentUser.address);
            setText('account-gender', currentUser.gender);
            setText('account-birthday', currentUser.birthday);

            const avatar = document.getElementById('account-avatar');
            if (avatar) {
                avatar.src = currentUser.avatar || 'https://i.pravatar.cc/120?img=12';
            }

            showAccountTab(targetTab);
        }
function saveCurrentUserAndRefresh() {
    const activeTab = document.querySelector('.account-tab-btn.active')?.dataset.tab || 'personal';

    localStorage.setItem('myvtc_current_user', JSON.stringify(currentUser));
    renderHeader();
    initMyAccountPage(activeTab);
}

function openAccountEditModal(type) {
    const old = document.getElementById('account-edit-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'account-edit-modal';
    modal.className = 'account-edit-modal';

    if (type === 'avatar') {
        modal.innerHTML = `
            <div class="account-edit-card">
                <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
                <h2>Thay đổi ảnh đại diện</h2>
                <p>Ảnh hồ sơ giúp người khác nhận ra bạn và giúp bạn nhận biết mình đã đăng nhập vào tài khoản.</p>

                <div class="avatar-preview-wrap">
                    <img id="avatar-preview" src="${currentUser.avatar || 'https://i.pravatar.cc/220?img=12'}" alt="Avatar">
                </div>

                <input type="file" id="avatar-file-input" accept="image/*" class="hidden" onchange="previewAccountAvatar(event)">
                <button class="account-secondary-btn" onclick="document.getElementById('avatar-file-input').click()">Chọn ảnh</button>
                <button class="account-primary-btn" onclick="saveAccountAvatar()">Cập nhật</button>
            </div>
        `;
    }

    if (type === 'nickname') {
        modal.innerHTML = `
            <div class="account-edit-card small">
                <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
                <h2>Cập nhật Nickname</h2>

                <label>Nickname</label>
                <input type="text" id="edit-nickname" value="${currentUser.nickname || ''}" maxlength="50">

                <button class="account-primary-btn" onclick="saveAccountNickname()">Cập nhật</button>
            </div>
        `;
    }

    if (type === 'basic') {
        modal.innerHTML = `
            <div class="account-edit-card">
                <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
                <h2>Thay đổi thông tin cá nhân</h2>
                <p class="account-edit-phone">${currentUser.phone || currentUser.username || ''}</p>

                <label>Họ và tên</label>
                <input type="text" id="edit-fullname" value="${currentUser.name || ''}">

                <label>Giới tính</label>
                <select id="edit-gender">
                    <option value="Nam" ${currentUser.gender === 'Nam' ? 'selected' : ''}>Nam</option>
                    <option value="Nữ" ${currentUser.gender === 'Nữ' ? 'selected' : ''}>Nữ</option>
                    <option value="Khác" ${currentUser.gender === 'Khác' ? 'selected' : ''}>Khác</option>
                </select>

                <label>Ngày sinh</label>
                <input type="date" id="edit-birthday" value="${currentUser.birthday || ''}">

                <label>Địa chỉ</label>
                <input type="text" id="edit-address" value="${currentUser.address || ''}">

                <label>Số CCCD</label>
                <input type="text" id="edit-cccd" value="${currentUser.cccd || ''}" maxlength="12" onkeydown="allowOnlyNumbers(event)">

                <button class="account-primary-btn" onclick="saveAccountBasicInfo()">Cập nhật</button>
            </div>
        `;
    }

    document.body.appendChild(modal);
}

function closeAccountEditModal() {
    document.getElementById('account-edit-modal')?.remove();
}

const accountSecurityState = {
    twoStep: false,
    otpSms: true,
    voiceOtp: true,
    zaloOtp: true,
    emailOtp: true,
    appOtp: true
};

const securityMethodMap = {
    'otp-sms': { stateKey: 'otpSms', label: 'OTP SMS', target: 'tin nhắn SMS', icon: 'fa-comment-sms' },
    'voice-otp': { stateKey: 'voiceOtp', label: 'Voice OTP', target: 'cuộc gọi thoại', icon: 'fa-phone' },
    'zalo-otp': { stateKey: 'zaloOtp', label: 'Zalo OTP', target: 'Zalo', icon: 'fa-comment' },
    'email-otp': { stateKey: 'emailOtp', label: 'OTP Email', target: 'email', icon: 'fa-envelope' },
    'app-otp': { stateKey: 'appOtp', label: 'OTP App', target: 'App Authenticator', icon: 'fa-shield-halved' }
};

function refreshAccountSecurityStatus() {
    const setStatus = (id, enabled) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.textContent = enabled ? 'Đang bật' : 'Đang tắt';
        el.classList.toggle('off', !enabled);
    };
    const twoStep = document.getElementById('security-2fa-status');
    if (twoStep) {
        twoStep.textContent = accountSecurityState.twoStep ? 'Đang bật' : 'Chưa thiết lập';
        twoStep.classList.toggle('off', !accountSecurityState.twoStep);
    }
    setStatus('security-otp-sms-status', accountSecurityState.otpSms);
    setStatus('security-voice-otp-status', accountSecurityState.voiceOtp);
    setStatus('security-zalo-otp-status', accountSecurityState.zaloOtp);
    setStatus('security-email-otp-status', accountSecurityState.emailOtp);
    setStatus('security-app-otp-status', accountSecurityState.appOtp);
}

function openSecurityModal(type) {
    const old = document.getElementById('account-edit-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'account-edit-modal';
    modal.className = 'account-edit-modal';

    if (type === 'two-step') {
        modal.innerHTML = `
            <div class="account-edit-card small">
                <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
                <h2>${accountSecurityState.twoStep ? 'Tắt xác minh 2 bước' : 'Thiết lập xác minh 2 bước'}</h2>
                <p>Để tiếp tục, xác thực tài khoản của bạn.</p>
                <label>Mật khẩu</label>
                <input type="password" id="security-password-check" value="12345678" placeholder="Nhập mật khẩu">
                <div class="security-toggle-actions">
                    <button class="account-primary-btn" type="button" onclick="openSecurityMethodPicker('two-step')">Tiếp theo</button>
                </div>
            </div>`;
    }

    if (type === 'password') {
        modal.innerHTML = `
            <div class="account-edit-card small">
                <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
                <h2>Tạo mật khẩu mới</h2>
                <p>Tạo một mật khẩu mạnh có kết hợp chữ cái, số và ký hiệu.</p>
                <label>Mật khẩu hiện tại</label>
                <input type="password" id="security-current-password" placeholder="Nhập mật khẩu">
                <label>Mật khẩu mới</label>
                <input type="password" id="security-new-password" placeholder="Nhập mật khẩu">
                <label>Nhập lại mật khẩu mới</label>
                <input type="password" id="security-confirm-password" placeholder="Nhập mật khẩu">
                <div class="security-toggle-actions">
                    <button class="account-primary-btn" type="button" onclick="openPasswordOtpStep()">Tiếp theo</button>
                </div>
            </div>`;
    }

    if (securityMethodMap[type]) {
        openOtpMethodModal(type);
        return;
    }

    if (type === 'devices') {
        modal.innerHTML = `
            <div class="account-edit-card">
                <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
                <h2>Thiết bị đăng nhập</h2>
                <p>Danh sách phiên đăng nhập gần nhất trên tài khoản.</p>
                <div class="security-device-row">
                    <div class="security-device-icon"><i class="fas fa-desktop"></i></div>
                    <div class="security-device-main"><strong>Windows-10</strong><span>Ha Noi</span><span class="security-device-current"><i class="fas fa-circle-check"></i> Phiên hiện tại</span></div>
                    <div class="security-device-actions"><button class="danger" type="button" onclick="revokeTrustedDevice()">Xóa tin cậy</button></div>
                </div>
                <div class="security-device-row">
                    <div class="security-device-icon"><i class="fas fa-mobile-screen"></i></div>
                    <div class="security-device-main"><strong>iPhone 15</strong><span>Ha Noi, 08/07/2026</span></div>
                    <div class="security-device-actions"><button type="button" onclick="logoutOtherDevice()">Đăng xuất</button></div>
                </div>
            </div>`;
    }

    document.body.appendChild(modal);
}

function openSecurityMethodPicker(nextAction) {
    const modal = document.getElementById('account-edit-modal') || document.createElement('div');
    modal.id = 'account-edit-modal';
    modal.className = 'account-edit-modal';
    modal.innerHTML = `
        <div class="account-edit-card small">
            <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
            <h2>Chọn phương thức xác thực</h2>
            <div class="security-method-list">
                <button class="security-method-item" type="button" onclick="openSecurityOtpVerify('${nextAction}', 'OTP SMS')"><i class="fas fa-comment-sms"></i><span>Nhận tin nhắn (OTP SMS)</span></button>
                <button class="security-method-item" type="button" onclick="openSecurityOtpVerify('${nextAction}', 'OTP Email')"><i class="fas fa-envelope"></i><span>Nhận email (OTP Email)</span></button>
                <button class="security-method-item" type="button" onclick="openSecurityOtpVerify('${nextAction}', 'OTP App')"><i class="fas fa-shield-halved"></i><span>Mã xác thực trên App Authenticator</span></button>
            </div>
            <button class="account-secondary-btn" type="button" onclick="openSecurityModal('two-step')">Quay lại</button>
        </div>`;
    if (!modal.parentNode) document.body.appendChild(modal);
}

function openSecurityOtpVerify(nextAction, methodName) {
    const modal = document.getElementById('account-edit-modal');
    if (!modal) return;
    const title = nextAction === 'password' ? 'Xác thực đổi mật khẩu' : 'Thiết lập xác minh 2 bước';
    modal.innerHTML = `
        <div class="account-edit-card small">
            <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
            <h2>${title}</h2>
            <p>Mã xác thực đã gửi qua ${methodName}. Dùng mã giả lập 123456.</p>
            <label>Nhập mã xác thực</label>
            <input type="text" id="security-otp-code" maxlength="6" inputmode="numeric" placeholder="Nhập mã xác thực" onkeydown="allowOnlyNumbers(event)">
            <div class="security-toggle-actions">
                <button class="account-primary-btn" type="button" onclick="completeSecurityOtp('${nextAction}')">Xác thực</button>
            </div>
        </div>`;
}

function openPasswordOtpStep() {
    const current = document.getElementById('security-current-password')?.value.trim();
    const pass = document.getElementById('security-new-password')?.value.trim();
    const confirm = document.getElementById('security-confirm-password')?.value.trim();
    if (!current || !pass || !confirm) {
        showToast('Vui lòng nhập đủ thông tin mật khẩu', 'info');
        return;
    }
    if (pass.length < 8) {
        showToast('Mật khẩu mới cần tối thiểu 8 ký tự', 'info');
        return;
    }
    if (pass !== confirm) {
        showToast('Mật khẩu nhập lại chưa khớp', 'info');
        return;
    }
    openSecurityMethodPicker('password');
}

function completeSecurityOtp(nextAction) {
    const code = document.getElementById('security-otp-code')?.value.trim();
    if (code !== '123456') {
        showToast('Mã xác thực không hợp lệ', 'info');
        return;
    }
    if (nextAction === 'two-step') {
        accountSecurityState.twoStep = !accountSecurityState.twoStep;
        refreshAccountSecurityStatus();
        closeAccountEditModal();
        showToast(accountSecurityState.twoStep ? 'Đã bật xác minh 2 bước' : 'Đã tắt xác minh 2 bước', 'success');
        return;
    }
    closeAccountEditModal();
    showToast('Đổi mật khẩu thành công', 'success');
}

function openOtpMethodModal(type) {
    const method = securityMethodMap[type];
    const enabled = accountSecurityState[method.stateKey];
    const modal = document.getElementById('account-edit-modal') || document.createElement('div');
    modal.id = 'account-edit-modal';
    modal.className = 'account-edit-modal';
    modal.innerHTML = `
        <div class="account-edit-card small">
            <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
            <h2>Thiết lập ${method.label}</h2>
            <div class="security-otp-note">Hệ thống gửi mã xác thực qua ${method.target} khi khách hàng đăng nhập trên thiết bị lạ, quên mật khẩu hoặc thiết lập bảo mật.</div>
            <div class="security-toggle-actions">
                <button class="account-primary-btn" type="button" onclick="toggleSecurityMethod('${type}')">${enabled ? 'Tắt tính năng' : 'Bật tính năng'}</button>
            </div>
        </div>`;
    if (!modal.parentNode) document.body.appendChild(modal);
}

function toggleSecurityMethod(type) {
    const method = securityMethodMap[type];
    if (!method) return;
    accountSecurityState[method.stateKey] = !accountSecurityState[method.stateKey];
    refreshAccountSecurityStatus();
    closeAccountEditModal();
    showToast(`${accountSecurityState[method.stateKey] ? 'Đã bật' : 'Đã tắt'} ${method.label}`, 'success');
}

function revokeTrustedDevice() {
    showToast('Đã xóa trạng thái tin cậy của thiết bị', 'success');
}

function logoutCurrentDevice() {
    showToast('Đã gửi yêu cầu đăng xuất phiên hiện tại', 'info');
}

function logoutOtherDevice() {
    showToast('Đã đăng xuất thiết bị đã chọn', 'success');
}


function previewAccountAvatar(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('avatar-preview');
        if (preview) preview.src = e.target.result;
        authState.tempData.pendingAvatar = e.target.result;
    };
    reader.readAsDataURL(file);
}

function saveAccountAvatar() {
    if (!authState.tempData.pendingAvatar) {
        showToast('Vui lòng chọn ảnh trước khi cập nhật', 'info');
        return;
    }

    currentUser.avatar = authState.tempData.pendingAvatar;
    authState.tempData.pendingAvatar = null;
    saveCurrentUserAndRefresh();
    closeAccountEditModal();
    showToast('Cập nhật ảnh đại diện thành công', 'success');
}

function saveAccountNickname() {
    const value = document.getElementById('edit-nickname').value.trim();

    if (!validateNicknameFormat(value)) {
        showToast('Nickname 4 đến 50 ký tự, không nhập ký tự đặc biệt', 'info');
        return;
    }

    currentUser.nickname = value;
    saveCurrentUserAndRefresh();
    closeAccountEditModal();
    showToast('Cập nhật Nickname thành công', 'success');
}

function saveAccountBasicInfo() {
    const name = document.getElementById('edit-fullname').value.trim();
    const gender = document.getElementById('edit-gender').value;
    const birthday = document.getElementById('edit-birthday').value;
    const address = document.getElementById('edit-address').value.trim();
    const cccd = document.getElementById('edit-cccd').value.trim();

    if (!validateFullnameFormat(name)) {
        showToast('Họ và tên chưa hợp lệ', 'info');
        return;
    }

    if (!birthday) {
        showToast('Vui lòng chọn ngày sinh', 'info');
        return;
    }

    if (cccd.length !== 12) {
        showToast('CCCD phải đủ 12 số', 'info');
        return;
    }

    currentUser.name = name;
    currentUser.gender = gender;
    currentUser.birthday = birthday;
    currentUser.address = address;
    currentUser.cccd = cccd;

    saveCurrentUserAndRefresh();
    closeAccountEditModal();
    showToast('Cập nhật thông tin cá nhân thành công', 'success');
}
const atmBanks = [
    'VietcomBank',
    'VietinBank',
    'Techcombank',
    'BIDV',
    'AgriBank',
    'Navibank',
    'Sacombank',
    'ACB',
    'MBBank',
    'TPBank',
    'Shinhan Bank',
    'VIB Bank',
    'VPBank',
    'SHB',
    'Eximbank',
    'BaoVietBank',
    'VietcapitalBank',
    'SCB',
    'VietNam - Russia Bank',
    'ABBank',
    'PVCombank',
    'MBV',
    'NamA bank',
    'HDBank'
];

const internationalCards = ['Visa', 'Master', 'JCB'];

function openPaymentMethodModal() {
    const old = document.getElementById('account-edit-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'account-edit-modal';
    modal.className = 'account-edit-modal';

    modal.innerHTML = `
        <div class="account-edit-card">
            <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
            <h2>Thêm phương thức thanh toán</h2>
            <p>Thêm thẻ để thanh toán nhanh hơn trên các dịch vụ của VTC.</p>

            <label>Chọn hình thức</label>
            <select id="payment-method-type" onchange="updatePaymentCardOptions()">
                <option value="atm">Thẻ ATM</option>
                <option value="international">Thẻ Quốc tế</option>
            </select>

            <label id="payment-provider-label">Chọn bank</label>
            <select id="payment-provider"></select>

            <label>Số thẻ</label>
            <input type="text" id="payment-card-number" maxlength="19" placeholder="Nhập số thẻ" onkeydown="allowOnlyNumbers(event)">

            <label id="payment-date-label">Ngày hiệu lực</label>
            <input type="month" id="payment-card-date">

            <label class="payment-agreement">
                <input type="checkbox" id="payment-agree">
                <span>Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ của VTC. Thông báo quyền riêng tư mô tả cách VTC xử lý dữ liệu của bạn.</span>
            </label>

            <div class="account-modal-actions">
                <button class="account-secondary-btn" type="button" onclick="closeAccountEditModal()">Hủy</button>
                <button class="account-primary-btn" type="button" onclick="savePaymentMethod()">Lưu</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    updatePaymentCardOptions();
}

function updatePaymentCardOptions() {
    const type = document.getElementById('payment-method-type')?.value;
    const provider = document.getElementById('payment-provider');
    const providerLabel = document.getElementById('payment-provider-label');
    const dateLabel = document.getElementById('payment-date-label');

    if (!provider) return;

    const options = type === 'international' ? internationalCards : atmBanks;

    provider.innerHTML = options.map(item => `<option value="${item}">${item}</option>`).join('');

    if (providerLabel) providerLabel.textContent = type === 'international' ? 'Chọn loại thẻ' : 'Chọn bank';
    if (dateLabel) dateLabel.textContent = type === 'international' ? 'Ngày hết hạn' : 'Ngày hiệu lực';
}
function parseTransactionDate(value) {
    if (!value) return null;

    const parts = value.split('-').map(Number);
    if (parts.length !== 3) return null;

    return new Date(parts[0], parts[1] - 1, parts[2]);
}

let transactionCurrentPage = 1;
let transactionTotalPages = 1;
const transactionPageSize = 4;

function getTransactionRows() {
    return Array.from(document.querySelectorAll('.transaction-row'));
}

function renderTransactionPagination(matchedRows) {
    const pagination = document.getElementById('transaction-pagination');
    const pageInfo = document.getElementById('transaction-page-info');
    const pageInput = document.getElementById('transaction-page-input');
    const buttons = pagination ? pagination.querySelectorAll('.transaction-page-btn') : [];

    if (!pagination || !pageInfo) return;

    transactionTotalPages = Math.max(1, Math.ceil(matchedRows.length / transactionPageSize));

    if (transactionCurrentPage > transactionTotalPages) {
        transactionCurrentPage = transactionTotalPages;
    }

    if (transactionCurrentPage < 1) {
        transactionCurrentPage = 1;
    }

    const startIndex = (transactionCurrentPage - 1) * transactionPageSize;
    const endIndex = startIndex + transactionPageSize;
    const rowsOnPage = matchedRows.slice(startIndex, endIndex);

    getTransactionRows().forEach(row => {
        const isMatched = matchedRows.includes(row);
        const pageMatched = rowsOnPage.includes(row);
        row.classList.toggle('hidden', !isMatched || !pageMatched);
    });

    pageInfo.textContent = `Trang ${transactionCurrentPage}/${transactionTotalPages}`;

    if (pageInput) {
        pageInput.value = transactionCurrentPage;
        pageInput.max = transactionTotalPages;
    }

    if (buttons[0]) buttons[0].disabled = transactionCurrentPage <= 1;
    if (buttons[buttons.length - 1]) buttons[buttons.length - 1].disabled = transactionCurrentPage >= transactionTotalPages;

    pagination.classList.toggle('hidden', matchedRows.length <= transactionPageSize);
}

function filterTransactions(resetPage = true) {
    const typeValue = document.getElementById('transaction-type-filter')?.value || '';
    const startValue = document.getElementById('transaction-start-date')?.value || '';
    const endValue = document.getElementById('transaction-end-date')?.value || '';
    const searchValue = (document.getElementById('transaction-search-input')?.value || '').trim().toLowerCase();

    const startDate = parseTransactionDate(startValue);
    const endDate = parseTransactionDate(endValue);

    if (startDate && endDate) {
        const dayDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

        if (dayDiff < 0) {
            showToast('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu', 'info');
            return;
        }

        if (dayDiff > 90) {
            showToast('Khoảng thời gian tra cứu không quá 90 ngày', 'info');
            return;
        }
    }

    if (resetPage) {
        transactionCurrentPage = 1;
    }

    const matchedRows = getTransactionRows().filter(row => {
        const rowType = row.dataset.type || '';
        const rowDate = parseTransactionDate(row.dataset.date || '');
        const rowCode = (row.dataset.code || '').toLowerCase();
        const rowDesc = (row.dataset.desc || '').toLowerCase();
        const rowText = (row.textContent || '').toLowerCase();

        if (typeValue && rowType !== typeValue) return false;
        if (startDate && rowDate && rowDate < startDate) return false;
        if (endDate && rowDate && rowDate > endDate) return false;

        if (
            searchValue &&
            !rowCode.includes(searchValue) &&
            !rowDesc.includes(searchValue) &&
            !rowText.includes(searchValue)
        ) {
            return false;
        }

        return true;
    });

    const emptyState = document.getElementById('transaction-empty-state');

    if (emptyState) {
        emptyState.classList.toggle('hidden', matchedRows.length > 0);
    }

    renderTransactionPagination(matchedRows);
}

function changeTransactionPage(direction) {
    transactionCurrentPage += direction;
    filterTransactions(false);
}

function goToTransactionPage() {
    const pageInput = document.getElementById('transaction-page-input');
    const nextPage = Number(pageInput?.value || 1);

    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > transactionTotalPages) {
        showToast(`Vui lòng nhập số trang từ 1 đến ${transactionTotalPages}`, 'info');
        if (pageInput) pageInput.value = transactionCurrentPage;
        return;
    }

    transactionCurrentPage = nextPage;
    filterTransactions(false);
}

function handleTransactionPageInput(event) {
    if (event.key === 'Enter') {
        goToTransactionPage();
    }
}

function goToTransactionPage() {
    const pageInput = document.getElementById('transaction-page-input');
    const nextPage = Number(pageInput?.value || 1);

    if (!Number.isInteger(nextPage) || nextPage < 1 || nextPage > transactionTotalPages) {
        showToast(`Vui lòng nhập số trang từ 1 đến ${transactionTotalPages}`, 'info');
        if (pageInput) pageInput.value = transactionCurrentPage;
        return;
    }

    transactionCurrentPage = nextPage;
    filterTransactions(false);
}

function handleTransactionPageInput(event) {
    if (event.key === 'Enter') {
        goToTransactionPage();
    }
}

function resetTransactionFilters() {
    const type = document.getElementById('transaction-type-filter');
    const start = document.getElementById('transaction-start-date');
    const end = document.getElementById('transaction-end-date');
    const search = document.getElementById('transaction-search-input');

    if (type) type.value = '';
    if (start) start.value = '';
    if (end) end.value = '';
    if (search) search.value = '';

    transactionCurrentPage = 1;
    filterTransactions();
}
function savePaymentMethod() {
    const type = document.getElementById('payment-method-type').value;
    const provider = document.getElementById('payment-provider').value;
    const cardNumber = document.getElementById('payment-card-number').value.trim();
    const cardDate = document.getElementById('payment-card-date').value;
    const agree = document.getElementById('payment-agree').checked;

    if (cardNumber.length < 12) {
        showToast('Vui lòng nhập số thẻ hợp lệ', 'info');
        return;
    }

    if (!cardDate) {
        showToast('Vui lòng chọn ngày hiệu lực hoặc ngày hết hạn', 'info');
        return;
    }

    if (!agree) {
        showToast('Vui lòng đồng ý với điều khoản dịch vụ', 'info');
        return;
    }

    const paymentName = document.getElementById('saved-payment-name');
    const paymentDetail = document.getElementById('saved-payment-detail');

    if (paymentName) paymentName.textContent = provider;
    if (paymentDetail) {
        const last4 = cardNumber.slice(-4);
        paymentDetail.textContent = `${type === 'international' ? 'Thẻ quốc tế đã lưu' : 'Thẻ ATM đã lưu'} • ***${last4}`;
    }

    closeAccountEditModal();
    showToast('Đã lưu phương thức thanh toán', 'success');
}

function openBillingAddressModal() {
    const old = document.getElementById('account-edit-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'account-edit-modal';
    modal.className = 'account-edit-modal';

    modal.innerHTML = `
        <div class="account-edit-card">
            <button class="account-edit-close" onclick="closeAccountEditModal()">×</button>
            <h2>Thêm địa chỉ thanh toán</h2>
            <p>Thông tin này dùng cho hóa đơn và chứng từ thanh toán.</p>

            <label>Họ tên</label>
            <input type="text" id="billing-name" value="${currentUser.name || ''}" placeholder="Nhập họ tên">

            <label>Địa chỉ</label>
            <input type="text" id="billing-address" placeholder="Nhập địa chỉ">

            <label>Phường/Xã</label>
            <input type="text" id="billing-ward" placeholder="Nhập phường/xã">

            <label>Tỉnh/Thành phố</label>
            <input type="text" id="billing-city" placeholder="Nhập tỉnh/thành phố">

            <label>Quốc gia</label>
            <input type="text" id="billing-country" value="Việt Nam" placeholder="Nhập quốc gia">

            <label>Mã bưu điện</label>
            <input type="text" id="billing-zip" placeholder="Nhập mã bưu điện">

            <div class="account-modal-actions">
                <button class="account-secondary-btn" type="button" onclick="closeAccountEditModal()">Hủy</button>
                <button class="account-primary-btn" type="button" onclick="saveBillingAddress()">Lưu</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function saveBillingAddress() {
    const name = document.getElementById('billing-name').value.trim();
    const address = document.getElementById('billing-address').value.trim();
    const ward = document.getElementById('billing-ward').value.trim();
    const city = document.getElementById('billing-city').value.trim();
    const country = document.getElementById('billing-country').value.trim();
    const zip = document.getElementById('billing-zip').value.trim();

    if (!name || !address || !ward || !city || !country || !zip) {
        showToast('Vui lòng nhập đầy đủ thông tin địa chỉ', 'info');
        return;
    }

    const savedName = document.getElementById('saved-billing-name');
    const savedAddress = document.getElementById('saved-billing-address');
    const savedZip = document.getElementById('saved-billing-zip');

    if (savedName) savedName.textContent = name;
    if (savedAddress) savedAddress.textContent = `${address}, ${ward}, ${city}, ${country}`;
    if (savedZip) savedZip.textContent = `Mã bưu điện ${zip}`;

    closeAccountEditModal();
    showToast('Đã lưu địa chỉ thanh toán', 'success');
}
const loyaltyRankData = {
    dong: {
        label: 'Hạng hiện tại',
        name: 'Đồng',
        desc: 'Điểm hiện tại của bạn là <strong>20 / 500 EXP</strong> để xét hạng Bạc.',
        progress: '20 / 500 EXP',
        percent: 4,
        deadline: 'Trước ngày 31/12/2026',
        missionDesc: 'Để mở khóa quyền lợi hạng Bạc, người dùng cần hoàn thành 2 điều kiện:',
        missions: [
            { title: 'Nạp 500 Points', desc: 'Hoàn thành giao dịch nạp Points trong thời gian xét hạng.', action: 'Nạp ngay' },
            { title: 'Xác thực SĐT cho tài khoản MyVTC', desc: 'Bổ sung và xác minh số điện thoại để bảo vệ tài khoản.', action: 'Xác minh' }
        ],
        alert: 'Thăng hạng Bạc để mở khóa ngay các phần quà ưu đãi bên dưới.',
        benefits: [
            { icon: 'fa-ticket-alt', title: 'Voucher Nạp Points giảm giá 10%', desc: 'Dành cho người dùng đạt hạng Bạc.' },
            { icon: 'fa-coins', title: 'Thẻ Vcoin 10K', desc: 'Quà tặng khi thăng hạng thành công.' }
        ]
    },
    bac: {
        label: 'Bạn chưa đạt hạng',
        name: 'Bạc',
        desc: 'Bạn cần đạt <strong>500 / 2.000 EXP</strong> để xét hạng Vàng.',
        progress: '20 / 2.000 EXP',
        percent: 1,
        deadline: '',
        missionDesc: 'Để mở khóa quyền lợi hạng Vàng, người dùng cần hoàn thành điều kiện thăng hạng:',
        missions: [
            { title: 'Thăng hạng: Tích lũy 2.000 EXP', desc: 'EXP được cộng từ giao dịch, nhiệm vụ và hoạt động hợp lệ.', action: 'Xem nhiệm vụ' },
            { title: 'Thăng hạng: Nạp 2.000 Points', desc: 'Tổng nạp Points đạt ngưỡng trong chu kỳ xét hạng.', action: 'Nạp ngay' },
            { title: 'Thăng hạng: Hoàn thành 5 ngày điểm danh', desc: 'Điểm danh đủ 5 ngày trong chu kỳ hiện tại.', action: 'Điểm danh' },
            { title: 'Duy trì hạng Bạc: Đạt 500 Cycle EXP', desc: 'Nếu kết thúc chu kỳ mà không đạt 500 Cycle EXP, hệ thống giáng xuống hạng Đồng.', action: 'Xem điều kiện' },
            { title: 'Duy trì hạng Bạc: Có ít nhất 1 giao dịch hợp lệ', desc: 'Giao dịch nạp hoặc thanh toán Points phát sinh trong chu kỳ duy trì.', action: 'Xem lịch sử' }
        ],
        alert: 'Đạt hạng Vàng để nhận thêm voucher và EXP thưởng.',
        benefits: [
            { icon: 'fa-ticket-alt', title: 'Voucher giảm 15%', desc: 'Áp dụng cho giao dịch nạp Points hợp lệ.' },
            { icon: 'fa-star', title: 'Thưởng 100 EXP', desc: 'Trao khi nâng hạng Vàng thành công.' }
        ]
    },
    vang: {
        label: 'Bạn chưa đạt hạng',
        name: 'Vàng',
        desc: 'Bạn cần đạt <strong>2.000 / 5.000 EXP</strong> để xét hạng Bạch Kim.',
        progress: '20 / 5.000 EXP',
        percent: 1,
        deadline: '',
        missionDesc: 'Để mở khóa quyền lợi hạng Bạch Kim, người dùng cần hoàn thành điều kiện thăng hạng:',
        missions: [
            { title: 'Thăng hạng: Tích lũy 5.000 EXP', desc: 'EXP được tính trong chu kỳ xét hạng hiện tại.', action: 'Xem tiến độ' },
            { title: 'Thăng hạng: Nạp 5.000 Points', desc: 'Tổng nạp Points đạt ngưỡng yêu cầu.', action: 'Nạp ngay' },
            { title: 'Thăng hạng: Mời 3 bạn mới', desc: 'Bạn mới đăng ký và phát sinh hoạt động hợp lệ.', action: 'Mời ngay' },
            { title: 'Duy trì hạng Vàng: Đạt 2.000 Cycle EXP', desc: 'Nếu kết thúc chu kỳ mà không đạt 2.000 Cycle EXP, hệ thống giáng xuống hạng Bạc.', action: 'Xem điều kiện' },
            { title: 'Duy trì hạng Vàng: Có hoạt động trong 30 ngày gần nhất', desc: 'Hoạt động hợp lệ gồm đăng nhập, nạp Points, thanh toán Points hoặc nhận nhiệm vụ.', action: 'Xem hoạt động' }
        ],
        alert: 'Đạt hạng Bạch Kim để mở nhóm ưu đãi giá trị cao hơn.',
        benefits: [
            { icon: 'fa-gift', title: 'Voucher giảm 20%', desc: 'Áp dụng theo cấu hình chương trình.' },
            { icon: 'fa-coins', title: 'Thưởng 300 EXP', desc: 'Trao khi nâng hạng Bạch Kim thành công.' }
        ]
    },
    bachkim: {
        label: 'Bạn chưa đạt hạng',
        name: 'Bạch Kim',
        desc: 'Bạn cần đạt <strong>5.000 / 10.000 EXP</strong> để xét hạng Kim Cương.',
        progress: '20 / 10.000 EXP',
        percent: 1,
        deadline: '',
        missionDesc: 'Để mở khóa quyền lợi hạng Kim Cương, người dùng cần hoàn thành điều kiện thăng hạng:',
        missions: [
            { title: 'Thăng hạng: Tích lũy 10.000 EXP', desc: 'EXP hợp lệ được cộng từ giao dịch và nhiệm vụ.', action: 'Xem tiến độ' },
            { title: 'Thăng hạng: Nạp 10.000 Points', desc: 'Tổng nạp Points đạt ngưỡng trong chu kỳ.', action: 'Nạp ngay' },
            { title: 'Thăng hạng: Duy trì hoạt động 30 ngày', desc: 'Có hoạt động hợp lệ trong 30 ngày gần nhất.', action: 'Xem nhiệm vụ' },
            { title: 'Duy trì hạng Bạch Kim: Đạt 5.000 Cycle EXP', desc: 'Nếu kết thúc chu kỳ mà không đạt 5.000 Cycle EXP, hệ thống giáng xuống hạng Vàng.', action: 'Xem điều kiện' },
            { title: 'Duy trì hạng Bạch Kim: Có ít nhất 3 giao dịch hợp lệ', desc: 'Giao dịch nạp hoặc thanh toán Points phát sinh trong chu kỳ duy trì.', action: 'Xem lịch sử' }
        ],
        alert: 'Đạt hạng Kim Cương để nhận quyền lợi cao nhất.',
        benefits: [
            { icon: 'fa-crown', title: 'Voucher đặc quyền 30%', desc: 'Dành cho người dùng đạt hạng Kim Cương.' },
            { icon: 'fa-gem', title: 'Quà nâng hạng cao nhất', desc: 'Trao khi nâng hạng Kim Cương thành công.' }
        ]
    },
    kimcuong: {
        label: 'Bạn chưa đạt hạng',
        name: 'Kim Cương',
        desc: 'Hạng Kim Cương là hạng cao nhất của chương trình thành viên.',
        progress: '20 / 10.000 EXP',
        percent: 1,
        deadline: 'Hạng duy trì vĩnh viễn',
        missionDesc: 'Khi đạt hạng Kim Cương, người dùng được giữ hạng theo chính sách duy trì vĩnh viễn.',
        missions: [
            { title: 'Duy trì thông tin tài khoản hợp lệ', desc: 'SĐT, Email và thông tin định danh cần ở trạng thái hợp lệ.', action: 'Kiểm tra' },
            { title: 'Tiếp tục tham gia chương trình MyVTC', desc: 'Tiếp tục nhận ưu đãi, voucher và quà tặng theo từng sự kiện.', action: 'Xem ưu đãi' }
        ],
        alert: 'Hạng Kim Cương có nhóm quyền lợi cao nhất trong chương trình.',
        benefits: [
            { icon: 'fa-gem', title: 'Đặc quyền Kim Cương', desc: 'Nhận voucher và quà theo sự kiện riêng.' },
            { icon: 'fa-headset', title: 'Ưu tiên hỗ trợ', desc: 'Ưu tiên tiếp nhận yêu cầu hỗ trợ tài khoản.' }
        ]
    }
};

function showLoyaltyTab(tabName) {
    document.querySelectorAll('[data-loyalty-tab]').forEach(btn => {
        const isActive = btn.dataset.loyaltyTab === tabName;
        btn.classList.toggle('active', isActive);

        if (isActive) {
            const label = document.getElementById('loyalty-mobile-active-label');
            if (label) {
                label.textContent = btn.textContent.trim();
            }
        }
    });

    document.querySelectorAll('[data-loyalty-panel]').forEach(panel => {
        panel.classList.toggle('hidden', panel.dataset.loyaltyPanel !== tabName);
    });

    closeLoyaltyBodyMenu();
}

function showLoyaltyRank(rankKey) {
    const data = loyaltyRankData[rankKey];
    if (!data) return;

    document.querySelectorAll('[data-rank-view]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.rankView === rankKey);
    });

    const label = document.getElementById('loyalty-rank-label');
    const name = document.getElementById('loyalty-rank-name');
    const desc = document.getElementById('loyalty-rank-desc');
    const progressValue = document.getElementById('loyalty-progress-value');
    const progressFill = document.getElementById('loyalty-progress-fill');
    const deadline = document.getElementById('loyalty-rank-deadline');
    const missionDesc = document.getElementById('loyalty-mission-desc');
    const missionList = document.getElementById('loyalty-rank-missions');
    const maintainSection = document.getElementById('loyalty-maintain-section');
    const maintainDesc = document.getElementById('loyalty-maintain-desc');
    const maintainList = document.getElementById('loyalty-maintain-missions');
    const benefitAlert = document.getElementById('loyalty-benefit-alert');
    const benefitList = document.getElementById('loyalty-benefit-list');

    if (label) label.textContent = data.label;
    if (name) name.textContent = data.name;
    if (desc) desc.innerHTML = data.desc;
    if (progressValue) progressValue.textContent = data.progress;
    if (progressFill) progressFill.style.width = `${data.percent}%`;
    if (deadline) {
        deadline.textContent = data.deadline;
        deadline.classList.toggle('empty', !data.deadline);
    }
    if (missionDesc) missionDesc.textContent = data.missionDesc;

    const upgradeMissions = (data.missions || []).filter(item => !item.title.startsWith('Duy trì'));
    const maintainMissions = (data.missions || []).filter(item => item.title.startsWith('Duy trì'));

    if (missionList) {
        missionList.innerHTML = upgradeMissions.map(item => `
            <div class="loyalty-task-item">
                <div>
                    <strong>${item.title}</strong>
                    <span>${item.desc}</span>
                </div>
                <button type="button">${item.action}</button>
            </div>
        `).join('');
    }

    if (maintainSection) {
        maintainSection.classList.toggle('hidden', maintainMissions.length === 0);
    }

    if (maintainDesc) {
        maintainDesc.textContent = maintainMissions.length
            ? `Điều kiện áp dụng để giữ ${data.name} trong chu kỳ tiếp theo.`
            : '';
    }

    if (maintainList) {
        maintainList.innerHTML = maintainMissions.map(item => `
            <div class="loyalty-task-item maintain">
                <div>
                    <strong>${item.title}</strong>
                    <span>${item.desc}</span>
                </div>
                <button type="button">${item.action}</button>
            </div>
        `).join('');
    }

    if (benefitAlert) benefitAlert.textContent = data.alert;

    if (benefitList) {
        benefitList.innerHTML = data.benefits.map(item => `
            <div class="loyalty-gift-card locked">
                <div class="loyalty-gift-icon"><i class="fas ${item.icon}"></i></div>
                <div>
                    <strong>${item.title}</strong>
                    <span>${item.desc}</span>
                </div>
                <button type="button" disabled>Nhận ngay</button>
            </div>
        `).join('');
    }
}

const loyaltyInviteData = {
    code: 'MYVTC-HONG-2026',
    link: 'https://myvtc.vn/register?ref=MYVTC-HONG-2026',
    totalRewarded: 2,
    totalPending: 1,
    friends: [
        {
            name: 'ng***01',
            status: 'Đã nhận thưởng',
            reward: '+10 EXP',
            time: '25/06/2026 09:12'
        },
        {
            name: 'mi***88',
            status: 'Đã nhận thưởng',
            reward: '+10 EXP',
            time: '21/06/2026 20:34'
        },
        {
            name: 'an***23',
            status: 'Chờ đủ điều kiện',
            reward: 'Chưa nhận',
            time: '18/06/2026 11:05'
        }
    ]
};

function openInviteFriendModal(activeTab = 'invite') {
    const rows = loyaltyInviteData.friends.map(item => `
        <tr>
            <td>${item.name}</td>
            <td><span class="loyalty-status-pill">${item.status}</span></td>
        </tr>
    `).join('');

    openLoyaltyModal(`
        <div class="loyalty-modal-icon"><i class="fas fa-user-plus"></i></div>
        <h3>Mời bạn mới</h3>
        <p>Gửi mã hoặc link cho bạn bè. Bạn mới nhập mã và hoàn thành điều kiện thì hai bên nhận thưởng.</p>

        <div class="loyalty-modal-tabs">
            <button type="button" class="${activeTab === 'invite' ? 'active' : ''}" onclick="openInviteFriendModal('invite')">Mời bạn mới</button>
            <button type="button" class="${activeTab === 'history' ? 'active' : ''}" onclick="openInviteFriendModal('history')">Lịch sử</button>
        </div>

        <div class="loyalty-invite-panel ${activeTab === 'invite' ? '' : 'hidden'}">
            <div class="loyalty-invite-box compact">
                <span>Mã mời của bạn</span>
                <div class="loyalty-copy-row">
                    <strong id="loyalty-invite-code">${loyaltyInviteData.code}</strong>
                    <button type="button" aria-label="Copy mã" onclick="copyInviteCode()">
                        <i class="far fa-copy"></i>
                    </button>
                </div>
            </div>

            <div class="loyalty-invite-box compact">
                <span>Link chia sẻ</span>
                <div class="loyalty-copy-row">
                    <strong id="loyalty-invite-link">${loyaltyInviteData.link}</strong>
                    <button type="button" aria-label="Copy link" onclick="copyInviteLink()">
                        <i class="far fa-copy"></i>
                    </button>
                </div>
            </div>

            <div class="loyalty-ref-input-box">
                <label for="loyalty-ref-code">Nhập mã mời của người khác</label>
                <div>
                    <input id="loyalty-ref-code" type="text" placeholder="Nhập mã mời nếu bạn là tài khoản mới">
                    <button type="button" onclick="submitReferralCode()">Nhận thưởng</button>
                </div>
            </div>
        </div>

        <div class="loyalty-invite-panel ${activeTab === 'history' ? '' : 'hidden'}">
            <div class="loyalty-modal-stat">
                <div>
                    <strong>${loyaltyInviteData.totalRewarded}</strong>
                    <span>Bạn bè đã nhận thưởng</span>
                </div>
                <div>
                    <strong>${loyaltyInviteData.totalPending}</strong>
                    <span>Bạn bè chờ nhận</span>
                </div>
            </div>

            <div class="loyalty-invite-history">
                <h4>Lịch sử mời bạn bè</h4>
                <div class="loyalty-invite-table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Tên người dùng</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            </div>
        </div>
    `);
}
function openCheckinMissionModal() {
    openLoyaltyModal(`
        <div class="loyalty-checkin-service">
            <div class="loyalty-checkin-hero">
                <div class="loyalty-checkin-trophy"><i class="fas fa-trophy"></i></div>
                <div>
                    <h3>Nhiệm vụ điểm danh</h3>
                    <p>Vào mỗi ngày để giữ chuỗi và nhận Point.</p>
                </div>
            </div>

            <div class="loyalty-checkin-score">
                <div>
                    <span>Chuỗi hiện tại</span>
                    <strong>3/7</strong>
                </div>
                <div>
                    <span>Thưởng hôm nay</span>
                    <strong>+1 Point</strong>
                </div>
                <div>
                    <span>Mốc 7 ngày</span>
                    <strong>+10 Point</strong>
                </div>
            </div>

            <div class="loyalty-checkin-grid service">
                <span class="done"><i class="fas fa-check"></i><b>T2</b></span>
                <span class="done"><i class="fas fa-check"></i><b>T3</b></span>
                <span class="done"><i class="fas fa-check"></i><b>T4</b></span>
                <span class="today"><i class="fas fa-gift"></i><b>T5</b></span>
                <span><i class="fas fa-lock"></i><b>T6</b></span>
                <span><i class="fas fa-lock"></i><b>T7</b></span>
                <span><i class="fas fa-crown"></i><b>CN</b></span>
            </div>

            <div class="loyalty-checkin-bonus service">
                <strong>Còn 4 ngày để nhận thưởng tuần.</strong>
                <span>Giữ chuỗi liên tục để mở phần thưởng +10 Point.</span>
            </div>

            <button type="button" class="loyalty-modal-primary service" onclick="checkinMission()">Điểm danh hôm nay</button>
        </div>
    `);
}
function openLoyaltyModal(contentHtml) {
    closeLoyaltyModal();

    const modal = document.createElement('div');
    modal.className = 'loyalty-modal-backdrop';
    modal.id = 'loyalty-modal';
    modal.innerHTML = `
        <div class="loyalty-modal-card">
            <button type="button" class="loyalty-modal-close" onclick="closeLoyaltyModal()">
                <i class="fas fa-times"></i>
            </button>
            ${contentHtml}
        </div>
    `;

    document.body.appendChild(modal);
}

function closeLoyaltyModal() {
    const modal = document.getElementById('loyalty-modal');
    if (modal) modal.remove();
}

function copyTextToClipboard(text, successMessage) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMessage, 'success');
        }).catch(() => {
            fallbackCopyText(text, successMessage);
        });
        return;
    }

    fallbackCopyText(text, successMessage);
}

function fallbackCopyText(text, successMessage) {
    const input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';

    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);

    showToast(successMessage, 'success');
}

function copyInviteCode() {
    const code = document.getElementById('loyalty-invite-code')?.textContent.trim() || loyaltyInviteData.code;
    copyTextToClipboard(code, 'Đã copy mã mời');
}

function copyInviteLink() {
    const link = document.getElementById('loyalty-invite-link')?.textContent.trim() || loyaltyInviteData.link;
    copyTextToClipboard(link, 'Đã copy link chia sẻ');
}
function submitReferralCode() {
    const input = document.getElementById('loyalty-ref-code');
    const code = input ? input.value.trim() : '';

    if (!code) {
        showToast('Vui lòng nhập mã mời', 'error');
        return;
    }

    closeLoyaltyModal();
    showToast('Đã ghi nhận mã mời, chờ kiểm tra điều kiện nhận thưởng', 'success');
}
function claimMissionReward(name) {
    closeLoyaltyModal();
    showToast(`Đã nhận thưởng nhiệm vụ: ${name}`, 'success');
}

function checkinMission() {
    closeLoyaltyModal();
    showToast('Điểm danh thành công, bạn nhận +1 Point', 'success');
}

function initLoyaltyPage() {
    if (!document.getElementById('loyalty-page')) return;

    const params = new URLSearchParams(window.location.search);
    const activeTab = params.get('tab') || 'rank';

    showLoyaltyTab(activeTab);
    showLoyaltyRank('dong');
}
        function showAccountTab(tabName) {
    document.querySelectorAll('[data-tab]').forEach(btn => {
        const isActive = btn.dataset.tab === tabName;
        btn.classList.toggle('active', isActive);

        if (isActive) {
            const label = document.getElementById('account-mobile-active-label');
            if (label) {
                label.textContent = btn.textContent.trim();
            }
        }
    });

    document.querySelectorAll('.account-tab-panel').forEach(panel => {
        panel.classList.toggle('hidden', panel.dataset.panel !== tabName);
    });

    closeAccountBodyMenu();

    if (tabName === 'transactions') {
        filterTransactions();
    }

    if (tabName === 'notifications') {
        renderAccountNotifications();
    }

    if (tabName === 'security') {
        refreshAccountSecurityStatus();
    }
}
function toggleMobileNavMenu() {
    const navLinks = document.getElementById('main-nav-links');
    if (!navLinks) return;

    navLinks.classList.toggle('open');
}

function closeMobileNavMenu() {
    const navLinks = document.getElementById('main-nav-links');
    if (!navLinks) return;

    navLinks.classList.remove('open');
}

function toggleAccountBodyMenu() {
    const menu = document.getElementById('account-body-tab-menu');
    const icon = document.getElementById('account-mobile-menu-icon');
    if (!menu) return;

    menu.classList.toggle('open');

    if (icon) {
        icon.classList.toggle('open', menu.classList.contains('open'));
    }
}

function closeAccountBodyMenu() {
    const menu = document.getElementById('account-body-tab-menu');
    const icon = document.getElementById('account-mobile-menu-icon');
    if (!menu) return;

    menu.classList.remove('open');

    if (icon) {
        icon.classList.remove('open');
    }
}

function toggleLoyaltyBodyMenu() {
    const menu = document.getElementById('loyalty-body-tab-menu');
    const icon = document.getElementById('loyalty-mobile-menu-icon');
    if (!menu) return;

    menu.classList.toggle('open');

    if (icon) {
        icon.classList.toggle('open', menu.classList.contains('open'));
    }
}

function closeLoyaltyBodyMenu() {
    const menu = document.getElementById('loyalty-body-tab-menu');
    const icon = document.getElementById('loyalty-mobile-menu-icon');
    if (!menu) return;

    menu.classList.remove('open');

    if (icon) {
        icon.classList.remove('open');
    }
}

document.addEventListener('click', function (event) {
    const navLinks = document.getElementById('main-nav-links');
    const navBtn = document.getElementById('mobile-nav-menu-btn');

    if (navLinks && navBtn && !navLinks.contains(event.target) && !navBtn.contains(event.target)) {
        closeMobileNavMenu();
    }
});

        // ================================================================
        //  AUTH MODAL LANGUAGE
        // ================================================================
        function toggleAuthLangDropdown() {
            const d = document.getElementById('auth-lang-dropdown');
            const arrow = document.getElementById('auth-lang-arrow');
            if (!d) return;
            d.classList.toggle('hidden');
            if (arrow) {
                arrow.style.transform = d.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        }

        function changeAuthLanguage(lang) {
            const flag = document.getElementById('auth-lang-flag');
            const txt = document.getElementById('auth-lang-text');
            if (lang === 'vi') { flag.innerText = '🇻🇳'; if (txt) txt.innerText = 'Tiếng Việt'; } else { flag.innerText =
                    '🇺🇸'; if (txt) txt.innerText = 'English'; }
            document.getElementById('auth-lang-dropdown').classList.add('hidden');
            const arrow = document.getElementById('auth-lang-arrow');
            if (arrow) arrow.style.transform = 'rotate(0deg)';
            showToast('Chuyển đổi ngôn ngữ thành công', 'info');
        }

        // ================================================================
        //  FALLBACK
        // ================================================================
        function handleLogoFallback(img) { img.onerror = null;
            img.src = "https://via.placeholder.com/120x40?text=myVTC"; }

        function handleBannerFallback(img) { img.onerror = null;
            img.src = "https://via.placeholder.com/450x400/0e56cc/ffffff?text=myVTC+Ecosystem"; }

        // ================================================================
        //  INIT
        // ================================================================
        document.addEventListener('DOMContentLoaded', function() {
            const logged = localStorage.getItem('myvtc_logged_in');
            const savedUser = localStorage.getItem('myvtc_current_user');
            if (savedUser) {
                try {
                    currentUser = { ...currentUser, ...JSON.parse(savedUser) };
                } catch (e) {}
            }
            if (logged === 'true') {
                isLoggedIn = true;
            }
            renderHeader();
initMyAccountPage();
initLoyaltyPage();
initShopPage();
initShopRechargeButtons();
initRechargeDetailPage();

            document.addEventListener('click', function(e) {
                const container = document.getElementById('avatar-dropdown-container');
                if (container && !container.contains(e.target)) {
                    const dropdown = document.getElementById('avatar-dropdown');
                    const arrow = document.getElementById('avatar-arrow');
                    if (dropdown) dropdown.classList.remove('open');
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                }
                const footerLangContainer = document.querySelector('footer .relative');
                if (footerLangContainer && !footerLangContainer.contains(e.target)) {
                    const dd = document.getElementById('footer-lang-dropdown');
                    const arrow = document.getElementById('footer-lang-arrow');
                    if (dd) dd.classList.add('hidden');
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                }
                const authLangContainer = document.querySelector('.lang-top .relative');
                if (authLangContainer && !authLangContainer.contains(e.target)) {
                    const dd = document.getElementById('auth-lang-dropdown');
                    const arrow = document.getElementById('auth-lang-arrow');
                    if (dd) dd.classList.add('hidden');
                    if (arrow) arrow.style.transform = 'rotate(0deg)';
                }
            });
        });
let activeServiceFilter = 'all';

function setServiceFilter(type) {
    activeServiceFilter = type;

    document.querySelectorAll('[data-service-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.serviceFilter === type);
    });

    filterServiceList();
}

function filterServiceList() {
    const input = document.getElementById('service-search-input');
    const list = document.getElementById('service-list');
    const empty = document.getElementById('service-empty');

    if (!list) return;

    const keyword = (input?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    list.querySelectorAll('.service-card').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        const type = card.dataset.type || '';
        const matchType = activeServiceFilter === 'all' || activeServiceFilter === type;
        const matchKeyword = !keyword || name.includes(keyword);

        const isVisible = matchType && matchKeyword;
        card.classList.toggle('hidden', !isVisible);

        if (isVisible) visibleCount++;
    });

    if (empty) {
        empty.classList.toggle('hidden', visibleCount > 0);
    }
}
let activeShopFilter = 'all';
let activeShopSlide = 0;
let shopSlideTimer = null;

function initShopPage() {
    if (!document.querySelector('.shop-page')) return;

    setShopSlide(0);

    if (shopSlideTimer) {
        clearInterval(shopSlideTimer);
    }

    shopSlideTimer = setInterval(function() {
        const slides = document.querySelectorAll('.shop-slide');
        if (!slides.length) return;

        activeShopSlide = (activeShopSlide + 1) % slides.length;
        setShopSlide(activeShopSlide);
    }, 4500);

    document.querySelectorAll('.shop-slide').forEach(slide => {
        slide.addEventListener('click', function() {
            const name = slide.dataset.service || 'Audition PC';
            goRechargeDetail(name);
        });
    });

    document.querySelectorAll('.shop-recommend-card, .shop-service-card').forEach(card => {
        card.addEventListener('click', function() {
            const name = card.dataset.name || 'Audition PC';
            goRechargeDetail(name);
        });
    });

    filterShopServiceList();
}

function setShopSlide(index) {
    const slides = document.querySelectorAll('.shop-slide');
    const dots = document.querySelectorAll('.shop-slider-dots button');

    if (!slides.length) return;

    activeShopSlide = index;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
    });
}

function setShopFilter(type) {
    activeShopFilter = type;

    document.querySelectorAll('[data-shop-filter]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shopFilter === type);
    });

    filterShopServiceList();
}

function filterShopServiceList() {
    const list = document.getElementById('shop-service-list');
    const empty = document.getElementById('shop-empty');

    if (!list) return;

    let visibleCount = 0;

    list.querySelectorAll('.shop-service-card').forEach(card => {
        const type = card.dataset.type || '';
        const isVisible = activeShopFilter === 'all' || activeShopFilter === type;

        card.classList.toggle('hidden', !isVisible);

        if (isVisible) visibleCount++;
    });

    if (empty) {
        empty.classList.toggle('hidden', visibleCount > 0);
    }
}
// ================================================================
//  RECHARGE DETAIL
// ================================================================
const mockRechargeServices = [
    { slug: 'nap-so-du-myvtc', name: 'Nạp số dư MyVTC', icon: 'P', iconImg: 'icon/icon_001.jpg', thumb: 'thumbnail/thumb_001.png', type: 'balance', linkedAccount: 'hongtran', allowGuestTopup: true, isBalanceTopup: true },
    { slug: 'audition-pc', name: 'Audition PC', icon: 'AU', iconImg: 'icon/icon_002.jpg', thumb: 'thumbnail/thumb_002.png', type: 'pc', linkedAccount: 'hongtran_AU', allowGuestTopup: true, packageFilters: [
        { id: 'diamond', name: 'Nạp Kim Cương' },
        { id: 'golden', name: 'Gói ưu đãi' },
        { id: 'star', name: 'Gói Đại lộ ngôi sao' },
        { id: 'month', name: 'Gói Thẻ tháng' }
    ] },
    { slug: 'dot-kich', aliases: ['dot-kich-crossfire'], name: 'Đột Kích', icon: 'CF', iconImg: 'icon/icon_003.jpg', thumb: 'thumbnail/thumb_003.png', type: 'pc', linkedAccount: 'CF_HongTran', allowGuestTopup: false },
    { slug: 'truy-kich-pc', name: 'Truy Kích PC', icon: 'TK', iconImg: 'icon/icon_004.jpg', thumb: 'thumbnail/thumb_004.png', type: 'pc', linkedAccount: '', allowGuestTopup: true },
    { slug: 'phi-doi', name: 'Phi Đội', icon: 'AO', iconImg: 'icon/icon_005.jpg', thumb: 'thumbnail/thumb_005.png', type: 'pc', linkedAccount: '', allowGuestTopup: false },
    { slug: 'silkroad-origin-vtc', name: 'Silkroad Origin VTC', icon: 'SR', iconImg: 'icon/icon_006.jpg', thumb: 'thumbnail/thumb_006.png', type: 'pc', linkedAccount: 'SilkHong90', allowGuestTopup: true },
    { slug: 'giang-ho-bat-phai', name: 'Giang Hồ Bát Phái', icon: 'GH', iconImg: 'icon/icon_007.jpg', thumb: 'thumbnail/thumb_007.png', type: 'mobile', linkedAccount: '', allowGuestTopup: true },
    { slug: 'be-a-pro-football', name: 'Be A Pro Football', icon: 'BP', iconImg: 'icon/icon_008.jpg', thumb: 'thumbnail/thumb_008.png', type: 'mobile', linkedAccount: 'BAP_HongTran', allowGuestTopup: true },
    { slug: 'football-pro-vtc', name: 'Football Pro VTC', icon: 'FP', iconImg: 'icon/icon_009.jpg', thumb: 'thumbnail/thumb_009.png', type: 'mobile', linkedAccount: '', allowGuestTopup: true },
    { slug: 'dai-chien-tam-quoc', name: 'Đại Chiến Tam Quốc', icon: 'TQ', iconImg: 'icon/icon_010.jpg', thumb: 'thumbnail/thumb_010.png', type: 'mobile', linkedAccount: '', allowGuestTopup: false },
    { slug: 'ngoi-nha-trong-mo', name: 'Ngôi Nhà Trong Mơ', icon: 'NM', iconImg: 'icon/icon_011.jpg', thumb: 'thumbnail/thumb_011.png', type: 'mobile', linkedAccount: 'DreamHome88', allowGuestTopup: true }
];

let rechargeState = {
    service: null,
    selectedPackage: null,
    quantity: 1,
    payment: 'Số dư MyVTC',
    discount: 0,
    packageFilter: 'all'
};

function slugifyServiceName(name) {
    return String(name || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function getRechargeServiceBySlug(slug) {
    return mockRechargeServices.find(service => service.slug === slug || service.aliases?.includes(slug)) || mockRechargeServices[0];
}

function goRechargeDetail(serviceName) {
    const slug = slugifyServiceName(serviceName || 'Audition PC');
    window.location.href = `RechargeDetail.html?service=${encodeURIComponent(slug)}`;
}

function initShopRechargeButtons() {
    document.querySelectorAll('.shop-recharge-btn').forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.stopPropagation();
            const holder = btn.closest('[data-name], [data-service]');
            const name = holder?.dataset.name || holder?.dataset.service || 'Audition PC';
            goRechargeDetail(name);
        });
    });
}

function getRechargePackages(service) {
    if (service?.isBalanceTopup) {
        return [
            { id: 'point_100', name: 'Nạp 100 Point', price: 100000, point: 100, thumb: 'thumbnail/thumb_001.png' },
            { id: 'point_300', name: 'Nạp 300 Point', price: 300000, point: 300, thumb: 'thumbnail/thumb_002.png' },
            { id: 'point_500', name: 'Nạp 500 Point', price: 500000, point: 500, thumb: 'thumbnail/thumb_003.png' },
            { id: 'point_1000', name: 'Nạp 1.000 Point', price: 1000000, point: 1000, thumb: 'thumbnail/thumb_004.png' },
            { id: 'point_2000', name: 'Nạp 2.000 Point', price: 2000000, point: 2000, thumb: 'thumbnail/thumb_005.png' },
            { id: 'point_5000', name: 'Nạp 5.000 Point', price: 5000000, point: 5000, thumb: 'thumbnail/thumb_006.png' }
        ];
    }

    if (service?.packageFilters?.length) {
        return [
            { id: 'diamond_1', filter: 'diamond', name: 'Nạp Kim Cương 100', price: 100000, point: 100, thumb: 'thumbnail/thumb_002.png' },
            { id: 'diamond_2', filter: 'diamond', name: 'Nạp Kim Cương 300', price: 300000, point: 300, thumb: 'thumbnail/thumb_003.png' },
            { id: 'diamond_3', filter: 'diamond', name: 'Nạp Kim Cương 500', price: 500000, point: 500, thumb: 'thumbnail/thumb_004.png' },
            { id: 'golden_1', filter: 'golden', name: 'Gói ưu đãi Golden 1', price: 150000, point: 160, thumb: 'thumbnail/thumb_005.png' },
            { id: 'golden_2', filter: 'golden', name: 'Gói ưu đãi Golden 2', price: 300000, point: 330, thumb: 'thumbnail/thumb_006.png' },
            { id: 'star_1', filter: 'star', name: 'Gói ưu đãi VIP 1', price: 500000, point: 560, thumb: 'thumbnail/thumb_007.png' },
            { id: 'star_2', filter: 'star', name: 'Gói ưu đãi VIP 2', price: 1000000, point: 1150, thumb: 'thumbnail/thumb_008.png' },
            { id: 'month_1', filter: 'month', name: 'Thẻ thủy tinh 1', price: 99000, point: 100, thumb: 'thumbnail/thumb_009.png' },
            { id: 'month_2', filter: 'month', name: 'Thẻ thủy tinh 2', price: 199000, point: 220, thumb: 'thumbnail/thumb_010.png' }
        ];
    }

    return [
        { id: 'pkg_1', name: `${service.name} - Gói 100 Point`, price: 100000, point: 100, thumb: 'thumbnail/thumb_012.png' },
        { id: 'pkg_2', name: `${service.name} - Gói 300 Point`, price: 300000, point: 300, thumb: 'thumbnail/thumb_013.png' },
        { id: 'pkg_3', name: `${service.name} - Gói 500 Point`, price: 500000, point: 500, thumb: 'thumbnail/thumb_014.png' },
        { id: 'pkg_4', name: `${service.name} - Gói 1.000 Point`, price: 1000000, point: 1000, thumb: 'thumbnail/thumb_015.png' },
        { id: 'pkg_5', name: `${service.name} - Gói ưu đãi`, price: 150000, point: 160, thumb: 'thumbnail/thumb_016.png' },
        { id: 'pkg_6', name: `${service.name} - Gói cao cấp`, price: 2000000, point: 2200, thumb: 'thumbnail/thumb_017.png' }
    ];
}

function initRechargeDetailPage() {
    const page = document.getElementById('recharge-detail-page');
    if (!page) return;

    const slug = new URLSearchParams(window.location.search).get('service') || 'audition-pc';
    const service = getRechargeServiceBySlug(slug);
        rechargeState = {
        service,
        selectedPackage: getRechargePackages(service)[0],
        quantity: 1,
                payment: service.isBalanceTopup ? 'Thẻ Vcoin' : 'Số dư MyVTC',
        discount: 0,
        packageFilter: 'all'
    };

    document.getElementById('recharge-service-icon').innerHTML = `<img src="${service.iconImg}" alt="${service.name}">`;
    document.getElementById('recharge-service-name').textContent = service.name;

    renderRechargePaymentMethods();
    renderRechargeAccountBox();
    renderRechargePackages();
    updateRechargeOrder();
}

function renderRechargeAccountBox() {
    const box = document.getElementById('recharge-account-box');
    if (!box || !rechargeState.service) return;

    const service = rechargeState.service;

    if (!isLoggedIn) {
        box.innerHTML = `
            <div class="recharge-login-box">
                <strong>Bạn cần đăng nhập để nạp dịch vụ</strong>
                <span>Đăng nhập MyVTC để kiểm tra tài khoản sử dụng dịch vụ và thanh toán.</span>
                <div class="recharge-login-actions">
                    <button type="button" onclick="openAuthModal('login')">Đăng nhập</button>
                    <button type="button" onclick="quickLoginAndRefreshRecharge()">Đăng nhập nhanh</button>
                </div>
                <div class="recharge-social-actions">
                    <button type="button" onclick="initSocialLogin('Google')"><i class="fab fa-google"></i> Google</button>
                    <button type="button" onclick="initSocialLogin('Facebook')"><i class="fab fa-facebook-f"></i> Facebook</button>
                    <button type="button" onclick="initSocialLogin('Apple ID')"><i class="fab fa-apple"></i> Apple</button>
                </div>
            </div>
        `;
        return;
    }

    if (service.linkedAccount) {
        box.innerHTML = `
            <div class="recharge-account-found">
                <strong>${service.linkedAccount}</strong>
                <span>Tên tài khoản đang dùng ${service.name}</span>
            </div>
        `;
        return;
    }

    if (service.allowGuestTopup) {
        box.innerHTML = `
            <div class="recharge-account-search">
                <strong>Nhập tên tài khoản sử dụng dịch vụ</strong>
                <span>Dịch vụ này cho phép nạp khi chưa liên kết tài khoản.</span>
                <div class="search-line">
                    <input id="recharge-player-name" placeholder="Nhập tên tài khoản" />
                    <button type="button" onclick="searchRechargePlayer()">Tìm tài khoản</button>
                </div>
            </div>
        `;
        return;
    }

    box.innerHTML = `
        <div class="recharge-account-missing">
            <strong>Bạn không có tài khoản của dịch vụ này</strong>
            <span>Vui lòng đăng nhập tài khoản khác có dùng dịch vụ này hoặc lựa chọn dịch vụ khác.</span>
        </div>
    `;
}

function quickLoginAndRefreshRecharge() {
    isLoggedIn = true;
    localStorage.setItem('myvtc_logged_in', 'true');
    localStorage.setItem('myvtc_current_user', JSON.stringify(currentUser));
    renderHeader();
    renderRechargeAccountBox();
    showToast('Đã đăng nhập nhanh tài khoản demo', 'success');
}

function searchRechargePlayer() {
    const input = document.getElementById('recharge-player-name');
    const value = input?.value.trim();
    if (!value) {
        showToast('Vui lòng nhập tên tài khoản sử dụng dịch vụ', 'info');
        return;
    }
    rechargeState.service.linkedAccount = value;
    renderRechargeAccountBox();
    showToast('Đã tìm thấy tài khoản sử dụng dịch vụ', 'success');
}
function renderRechargePaymentMethods() {
    const holder = document.getElementById('recharge-payment-methods');
    if (!holder || !rechargeState.service) return;

    const methods = rechargeState.service.isBalanceTopup
        ? ['Thẻ Vcoin', 'Chuyển khoản', 'VTC Pay', 'Ngân hàng nội địa', 'Thẻ quốc tế']
        : ['Số dư MyVTC', 'Chuyển khoản', 'VTC Pay', 'Ngân hàng nội địa', 'Thẻ quốc tế'];

    if (!methods.includes(rechargeState.payment)) {
        rechargeState.payment = methods[0];
    }

    holder.innerHTML = methods.map(method => `
        <button type="button" class="${method === rechargeState.payment ? 'active' : ''}" data-payment="${method}" onclick="selectRechargePayment('${method}')">${method}</button>
    `).join('');
}
function isMyVtcBalancePayment() {
    return rechargeState.payment === 'Số dư MyVTC';
}

function getPackagePayAmount(pkg) {
    if (!pkg) return 0;
    return isMyVtcBalancePayment() ? pkg.point : pkg.price;
}

function formatRechargeAmount(value) {
    const amount = Number(value || 0).toLocaleString('vi-VN');
    return isMyVtcBalancePayment() ? `${amount} Points` : `${amount} VNĐ`;
}

function formatPackagePriceHtml(value) {
    const amount = Number(value || 0).toLocaleString('vi-VN');
    if (isMyVtcBalancePayment()) {
        return `<span class="point-price"><span class="point-coin">P</span>${amount}</span>`;
    }
    return `${amount} VNĐ`;
}

function getVisibleRechargePackages() {
    const packages = getRechargePackages(rechargeState.service);

    if (rechargeState.packageFilter === 'all') {
        return packages;
    }

    return packages.filter(pkg => pkg.filter === rechargeState.packageFilter);
}

function renderRechargePackageFilters() {
    const holder = document.getElementById('recharge-package-filters');
    if (!holder || !rechargeState.service) return;

    const filters = rechargeState.service.packageFilters || [];

    if (!filters.length) {
        holder.innerHTML = '';
        holder.classList.add('hidden');
        rechargeState.packageFilter = 'all';
        return;
    }

    holder.classList.remove('hidden');
    holder.innerHTML = [
        { id: 'all', name: 'Tất cả' },
        ...filters
    ].map(filter => `
        <button type="button" class="${filter.id === rechargeState.packageFilter ? 'active' : ''}" onclick="selectRechargePackageFilter('${filter.id}')">${filter.name}</button>
    `).join('');
}

function selectRechargePackageFilter(filterId) {
    rechargeState.packageFilter = filterId;
    rechargeState.selectedPackage = getVisibleRechargePackages()[0] || getRechargePackages(rechargeState.service)[0];
    rechargeState.discount = 0;
    renderRechargePackageFilters();
    renderRechargePackages();
    updateRechargeOrder();
}

function renderRechargePackages() {
    const list = document.getElementById('recharge-package-list');
    if (!list || !rechargeState.service) return;

    if (rechargeState.service.isBalanceTopup && rechargeState.payment === 'Thẻ Vcoin') {
        list.innerHTML = `
            <div class="vcoin-card-form">
                <div class="vcoin-field">
                    <label for="vcoin-serial">Serial</label>
                    <input id="vcoin-serial" placeholder="Nhập số serial">
                </div>
                <div class="vcoin-field">
                    <label for="vcoin-code">Mã thẻ</label>
                    <input id="vcoin-code" placeholder="Nhập mã thẻ Vcoin">
                </div>
                <div class="vcoin-field">
                    <label for="vcoin-captcha">Mã captcha</label>
                    <div class="captcha-line">
                        <input id="vcoin-captcha" placeholder="Nhập captcha">
                        <strong>8P4K</strong>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('order-product-name').textContent = 'Nạp số dư bằng Thẻ Vcoin';
        document.getElementById('order-quantity').textContent = 1;
        document.getElementById('order-subtotal').textContent = 'Theo mệnh giá thẻ';
        document.getElementById('order-discount').textContent = '0đ';
        document.getElementById('order-total').textContent = 'Theo mệnh giá thẻ';
        return;
    }

         renderRechargePackageFilters();

    list.innerHTML = getVisibleRechargePackages().map(pkg => {
    const packageThumb = pkg.thumb || rechargeState.service.thumb;

    return `
        <button type="button" class="recharge-package-card ${pkg.id === rechargeState.selectedPackage.id ? 'active' : ''}" style="background-image: linear-gradient(180deg, rgba(15, 23, 42, 0.18) 0%, rgba(15, 23, 42, 0.48) 42%, rgba(15, 23, 42, 0.9) 100%), linear-gradient(90deg, rgba(15, 23, 42, 0.72) 0%, rgba(15, 23, 42, 0.18) 100%), url('${packageThumb}');" onclick="selectRechargePackage('${pkg.id}')">
            <span class="recharge-package-content">
                <h3>${pkg.name}</h3>
                <p>${formatPackagePriceHtml(getPackagePayAmount(pkg))}</p>
            </span>
        </button>
    `;
}).join('');
}
function selectRechargePackage(packageId) {
    rechargeState.selectedPackage = getRechargePackages(rechargeState.service).find(pkg => pkg.id === packageId) || rechargeState.selectedPackage;
    rechargeState.discount = 0;
    renderRechargePackages();
    updateRechargeOrder();
}

function changeRechargeQty(delta) {
    rechargeState.quantity = Math.max(1, rechargeState.quantity + delta);
    updateRechargeOrder();
}

function selectRechargePayment(payment) {
    rechargeState.payment = payment;
    rechargeState.packageFilter = 'all';
    rechargeState.selectedPackage = getRechargePackages(rechargeState.service)[0];
    rechargeState.discount = 0;

    document.querySelectorAll('#recharge-payment-methods button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.payment === payment);
    });

    renderRechargePackages();
    updateRechargeOrder();
}
function selectRechargeVoucherCode() {
    const select = document.getElementById('recharge-voucher-select');
    const input = document.getElementById('recharge-voucher');

    if (select && input) {
        input.value = select.value;
    }
}
function applyRechargeVoucher() {
    const input = document.getElementById('recharge-voucher');
    const select = document.getElementById('recharge-voucher-select');
    const message = document.getElementById('voucher-message');
    const code = (input?.value || select?.value || '').trim().toUpperCase();

    if (rechargeState.service?.isBalanceTopup && rechargeState.payment === 'Thẻ Vcoin') {
        rechargeState.discount = 0;
        if (message) message.textContent = 'Thẻ Vcoin không áp dụng voucher';
        updateRechargeOrder();
        return;
    }

        const subtotal = getPackagePayAmount(rechargeState.selectedPackage) * rechargeState.quantity;

    if (code === 'MYVTC10') {
        rechargeState.discount = Math.min(isMyVtcBalancePayment() ? 50 : 50000, Math.round(subtotal * 0.1));
        if (message) message.textContent = `Áp dụng voucher thành công, giảm ${formatRechargeAmount(rechargeState.discount)}`;
    } else if (code === 'VTCPAY20') {
        rechargeState.discount = isMyVtcBalancePayment() ? 20 : 20000;
        if (message) message.textContent = `Áp dụng voucher thành công, giảm ${formatRechargeAmount(rechargeState.discount)}`;
    } else if (code === 'NEWUSER') {
        rechargeState.discount = isMyVtcBalancePayment() ? 30 : 30000;
        if (message) message.textContent = `Áp dụng voucher thành công, giảm ${formatRechargeAmount(rechargeState.discount)}`;
    } else {
        rechargeState.discount = 0;
        if (message) message.textContent = 'Mã hợp lệ để test: MYVTC10, VTCPAY20, NEWUSER';
    }

    updateRechargeOrder();
}

function updateRechargeOrder() {
    const pkg = rechargeState.selectedPackage;
	 if (rechargeState.service?.isBalanceTopup && rechargeState.payment === 'Thẻ Vcoin') {
        document.getElementById('order-product-name').textContent = 'Nạp số dư bằng Thẻ Vcoin';
        document.getElementById('order-quantity').textContent = 1;
        document.getElementById('order-subtotal').textContent = 'Theo mệnh giá thẻ';
        document.getElementById('order-discount').textContent = '0đ';
        document.getElementById('order-total').textContent = 'Theo mệnh giá thẻ';
        return;
    }
    if (!pkg) return;

        const subtotal = getPackagePayAmount(pkg) * rechargeState.quantity;
    const total = Math.max(0, subtotal - rechargeState.discount);

    document.getElementById('order-product-name').textContent = pkg.name;
    document.getElementById('order-quantity').textContent = rechargeState.quantity;
    document.getElementById('order-subtotal').textContent = formatRechargeAmount(subtotal);
    document.getElementById('order-discount').textContent = formatRechargeAmount(rechargeState.discount);
    document.getElementById('order-total').textContent = formatRechargeAmount(total);
}

function submitRechargeOrder() {
    if (!isLoggedIn) {
        openAuthModal('login');
        return;
    }
	    if (rechargeState.service?.isBalanceTopup && rechargeState.payment === 'Thẻ Vcoin') {
        const serial = document.getElementById('vcoin-serial')?.value.trim();
        const code = document.getElementById('vcoin-code')?.value.trim();
        const captcha = document.getElementById('vcoin-captcha')?.value.trim();

        if (!serial || !code || !captcha) {
            showToast('Vui lòng nhập đủ Serial, Mã thẻ và Captcha', 'info');
            return;
        }
    }
    showToast('Đã tạo đơn thanh toán demo', 'success');
}

// ================================================================
//  SUPPORT PAGE
// ================================================================
const supportFaqData = {
    login: {
        title: 'Cách đăng nhập tài khoản MyVTC',
        intro: 'Bạn đăng nhập bằng mật khẩu, OTP hoặc tài khoản Google, Apple, Facebook đã liên kết.',
        steps: [
            'Chọn Đăng nhập trên header.',
            'Nhập SĐT, Email hoặc tên tài khoản.',
            'Chọn đăng nhập bằng mật khẩu hoặc OTP.',
            'Hoàn tất xác thực và kiểm tra lại thông tin tài khoản.'
        ]
    },
    forgot: {
        title: 'Tôi quên mật khẩu thì làm gì?',
        intro: 'Bạn đặt lại mật khẩu bằng SĐT, Email hoặc tên tài khoản đã đăng ký.',
        steps: [
            'Chọn Quên mật khẩu.',
            'Nhập thông tin tài khoản cần khôi phục.',
            'Nhận OTP qua phương thức còn hiệu lực.',
            'Nhập mật khẩu mới và đăng nhập lại.'
        ]
    },
    link: {
        title: 'Liên kết tài khoản dịch vụ',
        intro: 'Tính năng này giúp đồng bộ tài khoản chơi dịch vụ với tài khoản MyVTC.',
        steps: [
            'Vào Tài khoản, chọn Tài khoản liên kết.',
            'Chọn dịch vụ cần liên kết.',
            'Nhập tài khoản đang chơi hoặc tạo tài khoản mới.',
            'Kiểm tra thông tin và xác nhận liên kết.'
        ]
    },
    topup: {
        title: 'Cách nạp Point MyVTC',
        intro: 'Bạn nạp Point bằng Thẻ Vcoin, chuyển khoản, VTC Pay, ngân hàng nội địa hoặc thẻ quốc tế.',
        steps: [
            'Vào Shop, chọn Nạp số dư MyVTC.',
            'Chọn gói nạp.',
            'Chọn phương thức thanh toán.',
            'Kiểm tra đơn hàng và xác nhận thanh toán.'
        ]
    },
    payment: {
        title: 'Thanh toán gói dịch vụ không thành công',
        intro: 'Giao dịch lỗi thường do số dư không đủ, thông tin thanh toán sai hoặc quá hạn xác thực.',
        steps: [
            'Kiểm tra lại trạng thái trong Lịch sử giao dịch.',
            'Kiểm tra số dư hoặc hạn mức thanh toán.',
            'Thử lại bằng phương thức thanh toán khác.',
            'Gửi yêu cầu hỗ trợ nếu tiền đã trừ nhưng đơn chưa ghi nhận.'
        ]
    },
    voucher: {
        title: 'Cách nhập voucher khi thanh toán',
        intro: 'Voucher áp dụng theo điều kiện từng dịch vụ, từng phương thức thanh toán và thời hạn hiệu lực.',
        steps: [
            'Mở khu vực Voucher trong đơn hàng.',
            'Nhập mã hoặc chọn mã có sẵn.',
            'Bấm Dùng để kiểm tra ưu đãi.',
            'Kiểm tra số tiền giảm trước khi thanh toán.'
        ]
    },
    security: {
        title: 'Thiết lập bảo mật OTP và 2FA',
        intro: 'Bảo mật 2 bước giúp bảo vệ đăng nhập và giao dịch quan trọng.',
        steps: [
            'Vào Tài khoản, chọn Bảo mật.',
            'Chọn phương thức OTP hoặc 2FA.',
            'Xác thực thông tin liên hệ.',
            'Bật bảo mật và lưu thay đổi.'
        ]
    },
    profile: {
        title: 'Cập nhật SĐT hoặc Email',
        intro: 'Bạn cần xác thực OTP trước khi đổi SĐT hoặc Email cho tài khoản.',
        steps: [
            'Vào Tài khoản, chọn Thông tin cá nhân.',
            'Chọn cập nhật SĐT hoặc Email.',
            'Nhập thông tin mới.',
            'Nhập OTP để xác nhận thay đổi.'
        ]
    },
    loyalty: {
        title: 'Điểm EXP và hạng thành viên',
        intro: 'EXP dùng để xét hạng thành viên và mở quyền lợi Loyalty.',
        steps: [
            'Vào Thành viên để xem hạng hiện tại.',
            'Kiểm tra tiến trình EXP trong chu kỳ.',
            'Làm nhiệm vụ hoặc giao dịch để nhận EXP.',
            'Nhận thưởng khi đạt điều kiện nâng hạng.'
        ]
    },
    inventory: {
        title: 'Kiểm tra Túi đồ, vật phẩm và voucher',
        intro: 'Túi đồ lưu voucher, vật phẩm và quà tặng bạn đã nhận.',
        steps: [
            'Vào Tài khoản, chọn Túi đồ.',
            'Chọn loại vật phẩm cần xem.',
            'Kiểm tra hạn dùng và điều kiện áp dụng.',
            'Dùng vật phẩm trong màn thanh toán hoặc sự kiện phù hợp.'
        ]
    }
};

function filterSupportArticles() {
    const input = document.getElementById('support-search-input');
    const list = document.getElementById('support-article-list');
    const empty = document.getElementById('support-empty');
    if (!input || !list || !empty) return;

    closeSupportFaq(false);

    const keyword = input.value.trim().toLowerCase();
    let visible = 0;

    list.querySelectorAll('.support-article').forEach(article => {
        const text = article.innerText.toLowerCase() + ' ' + (article.dataset.title || '').toLowerCase();
        const matched = !keyword || text.includes(keyword);
        article.classList.toggle('hidden', !matched);
        if (matched) visible++;
    });

    empty.classList.toggle('hidden', visible > 0);
}

function openSupportFaq(key) {
    const faq = supportFaqData[key];
    const list = document.getElementById('support-article-list');
    const empty = document.getElementById('support-empty');
    const detail = document.getElementById('support-faq-detail');
    const content = document.getElementById('support-faq-detail-content');
    if (!faq || !list || !detail || !content) return;

    list.classList.add('hidden');
    if (empty) empty.classList.add('hidden');
    detail.classList.remove('hidden');

    content.innerHTML = `
        <article class="support-faq-card">
            <h2>${faq.title}</h2>
            <p>${faq.intro}</p>
            <ol>
                ${faq.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </article>
    `;

    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeSupportFaq(shouldScroll = true) {
    const list = document.getElementById('support-article-list');
    const detail = document.getElementById('support-faq-detail');
    if (!list || !detail) return;

    detail.classList.add('hidden');
    list.classList.remove('hidden');

    if (shouldScroll) {
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ================================================================
//  ACCOUNT NOTIFICATIONS
// ================================================================
const mockAccountNotifications = [
    { id: 'noti_1', icon: 'fa-shield-alt', title: 'Bật bảo mật 2 bước', body: 'Tài khoản của bạn chưa bật 2FA. Bật 2FA để bảo vệ giao dịch và thông tin đăng nhập.', time: 'Hôm nay', read: false },
    { id: 'noti_2', icon: 'fa-coins', title: 'Nạp Point thành công', body: 'Bạn đã nạp 1.000 Point vào số dư MyVTC.', time: 'Hôm qua', read: false },
    { id: 'noti_3', icon: 'fa-gift', title: 'Voucher mới trong Túi đồ', body: 'Bạn nhận được voucher giảm 10% khi nạp dịch vụ trong Shop.', time: '2 ngày trước', read: true },
    { id: 'noti_4', icon: 'fa-crown', title: 'Cập nhật hạng thành viên', body: 'Bạn cần thêm 480 EXP để đạt hạng Bạc trong chu kỳ hiện tại.', time: '3 ngày trước', read: true }
];

function getAccountNotifications() {
    const saved = localStorage.getItem('myvtc_account_notifications');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {}
    }
    localStorage.setItem('myvtc_account_notifications', JSON.stringify(mockAccountNotifications));
    return mockAccountNotifications;
}

function saveAccountNotifications(items) {
    localStorage.setItem('myvtc_account_notifications', JSON.stringify(items));
}

function renderAccountNotifications() {
    const list = document.getElementById('account-notification-list');
    if (!list) return;

    const items = getAccountNotifications();
    if (!items.length) {
        list.innerHTML = '<div class="notification-empty">Không có thông báo mới.</div>';
        return;
    }

    list.innerHTML = items.map(item => `
        <article class="notification-item ${item.read ? '' : 'unread'}">
            <div class="notification-icon"><i class="fas ${item.icon}"></i></div>
            <div>
                <h3>${item.title}</h3>
                <p>${item.body}</p>
            </div>
            <time>${item.time}</time>
        </article>
    `).join('');
}

function markAllNotificationsRead() {
    const items = getAccountNotifications().map(item => ({ ...item, read: true }));
    saveAccountNotifications(items);
    renderAccountNotifications();
    showToast('Đã đánh dấu tất cả thông báo là đã đọc', 'success');
}

function clearReadNotifications() {
    const items = getAccountNotifications().filter(item => !item.read);
    saveAccountNotifications(items);
    renderAccountNotifications();
    showToast('Đã ẩn thông báo đã đọc', 'success');
}
