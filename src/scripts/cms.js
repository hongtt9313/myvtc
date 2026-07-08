var cmsAccountData = [
  {
    username:'hongtt',
    accountId:'ACC-00012118',
    fullName:'Trần Thúy Hồng',
    nickname:'Trần Thúy Hồng',
    avatar:'https://i.pravatar.cc/160?img=47',
    portrait:'https://i.pravatar.cc/160?img=47',
    status:'Đang hoạt động',
    ekycStatus:'Đã xác thực',
    citizenId:'001186012345',
    dob:'12/08/1986',
    gender:'Nữ',
    address:'Cầu Giấy, Hà Nội',
    issuedDate:'18/06/2022',
    expiredDate:'18/06/2032',
    phone:'0936168687',
    email:'hongtt@vtc.vn',
    emailVerified:'Đã xác thực',
    twoFa:'Bật',
    socialLinks:[
      {channel:'Google',status:'Đã kết nối'},
      {channel:'Apple',status:'Đã kết nối'}
    ],
    sessions:[
      {platform:'Web',device:'Chrome Windows',os:'Windows 10',version:'1.0.6',ip:'117.103.228.53',loginAt:'29/06/2026 08:41'},
      {platform:'Mobile App',device:'iPhone 15',os:'iOS 18',version:'2.3.1',ip:'14.225.12.90',loginAt:'28/06/2026 21:15'}
    ],
    partners:[
      {name:'VTC Game / Au Mobile',scope:'Gắn kết tài khoản, xác thực MyVTC',grantedAt:'20/06/2026 10:12',partnerUser:'hongtt_au',status:'Đang hoạt động'},
      {name:'VTC Edu / edu.vtc.vn',scope:'Đăng nhập SSO',grantedAt:'12/06/2026 09:30',partnerUser:'hongtt',status:'Đã hủy'}
    ],
    pointBalance:125000,
    pointLots:[
      {amount:50000,receivedAt:'01/06/2026',expiredAt:'01/12/2026',status:'Còn hiệu lực'},
      {amount:75000,receivedAt:'15/06/2026',expiredAt:'15/07/2026',status:'Sắp hết hạn'}
    ],
    loyalty:{
      rank:'Vàng',
      lifetimeExp:3480,
      cycleExp:1480,
      cycleStart:'01/01/2026',
      cycleEnd:'31/12/2026',
      progress:74,
      expMissing:520,
      rankHistory:[
        {time:'01/02/2026 00:05',type:'Nâng hạng',reason:'Đạt ngưỡng Cycle EXP hạng Vàng'},
        {time:'01/01/2026 00:05',type:'Duy trì hạng',reason:'Đủ EXP duy trì hạng Bạc'}
      ]
    },
    vouchers:[
      {name:'Giảm 10% nạp Points',code:'MYVTC10-HONG',status:'Khả dụng',expiredAt:'31/07/2026'},
      {name:'Voucher sinh nhật',code:'BDAY-2026',status:'Đã dùng',expiredAt:'30/06/2026'}
    ]
  },
  {
    username:'toanth',
    accountId:'ACC-00012124',
    fullName:'Trần Hùng Toàn',
    nickname:'Trần Hùng Toàn',
    avatar:'https://i.pravatar.cc/160?img=12',
    portrait:'https://i.pravatar.cc/160?img=12',
    status:'Tạm khóa',
    ekycStatus:'Chưa xác thực',
    citizenId:'',
    dob:'',
    gender:'',
    address:'',
    issuedDate:'',
    expiredDate:'',
    phone:'0961381232',
    email:'toanth@vtc.vn',
    emailVerified:'Chưa xác thực',
    twoFa:'Tắt',
    socialLinks:[
      {channel:'Google',status:'Đã kết nối'},
      {channel:'Apple',status:'Chưa liên kết'}
    ],
    sessions:[
      {platform:'Web',device:'Edge Windows',os:'Windows 11',version:'1.0.6',ip:'117.103.228.53',loginAt:'25/06/2026 09:32'}
    ],
    partners:[
      {name:'VTC Pay / Payment Gateway',scope:'Thanh toán bằng Points',grantedAt:'14/06/2026 14:22',partnerUser:'toanth',status:'Đang hoạt động'}
    ],
    pointBalance:23000,
    pointLots:[
      {amount:23000,receivedAt:'10/06/2026',expiredAt:'10/12/2026',status:'Còn hiệu lực'}
    ],
    loyalty:{
      rank:'Đồng',
      lifetimeExp:260,
      cycleExp:260,
      cycleStart:'10/06/2026',
      cycleEnd:'10/06/2027',
      progress:52,
      expMissing:240,
      rankHistory:[
        {time:'10/06/2026 10:00',type:'Khởi tạo hạng',reason:'Tạo tài khoản mới'}
      ]
    },
    vouchers:[
      {name:'Ưu đãi người dùng mới',code:'NEWUSER-2026',status:'Khả dụng',expiredAt:'31/08/2026'}
    ]
  }
];
var cmsOriginalUpdateData = null;
var cmsCurrentUpdateAccount = null;
var cmsLookupTableState = {};
var cmsCurrentLookupAccount = null;
var cmsCurrentIdentityAccount = null;
var cmsOriginalIdentityData = null;
var cmsAuditLogs = [];
var cmsIdentityAuditLogs = [];

function cmsSafeText(value){
  return String(value == null ? '' : value)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

function cmsMoney(value){
  return Number(value || 0).toLocaleString('vi-VN') + ' Point';
}

function cmsNow(){
  return new Date().toLocaleString('vi-VN',{hour12:false});
}

function cmsSetAlert(id,type,message){
  var el = document.getElementById(id);
  if(!el) return;
  el.className = 'account-alert ' + (type || '');
  el.textContent = message || '';
}

function cmsFindByUsername(username){
  var key = String(username || '').trim().toLowerCase();
  if(!key || !/^[a-zA-Z0-9._@-]{3,50}$/.test(key)) return null;
  return cmsAccountData.find(function(item){return String(item.username).toLowerCase() === key;});
}

function cmsFindByPhone(phone){
  var key = String(phone || '').trim();
  if(!/^0\d{9}$/.test(key)) return null;
  return cmsAccountData.find(function(item){return item.phone === key;});
}


function cmsIsPhoneUsername(value){
  return /^0\d{9}$/.test(String(value || '').trim());
}

function cmsIsEmailUsername(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function cmsFindAccountForUsernameUpdate(username){
  var key = String(username || '').trim().toLowerCase();
  if(!key || !/^[a-zA-Z0-9._@-]{3,80}$/.test(key)) return null;
  return cmsAccountData.find(function(item){
    return String(item.username || '').toLowerCase() === key;
  });
}

function cmsParseVnDate(value){
  var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value || '').trim());
  if(!match) return null;
  var day = Number(match[1]);
  var month = Number(match[2]);
  var year = Number(match[3]);
  var date = new Date(year, month - 1, day);
  if(date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  date.setHours(0,0,0,0);
  return date;
}

function cmsAgeAtToday(date){
  var today = new Date();
  var age = today.getFullYear() - date.getFullYear();
  var m = today.getMonth() - date.getMonth();
  if(m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
  return age;
}

function cmsSetFieldDisabled(id,disabled,message){
  var input = document.getElementById(id);
  if(!input) return;
  input.disabled = !!disabled;
  input.classList.toggle('locked-field',!!disabled);
  var hint = document.getElementById(id + 'Hint');
  if(hint && message) hint.textContent = message;
}

function cmsPushAudit(list,admin,feature,changes){
  if(!changes.length) return;
  list.unshift({
    admin:admin || 'hongtt',
    time:cmsNow(),
    feature:feature,
    changes:changes
  });
}

function cmsRenderAuditList(targetId,list){
  var node = document.getElementById(targetId);
  if(!node) return;
  if(!list.length){
    node.innerHTML = '';
    return;
  }
  node.innerHTML = list.slice(0,6).map(function(log){
    var details = log.changes.map(function(item){
      return cmsSafeText(item.field) + ': ' + cmsSafeText(item.oldValue || '-') + ' → ' + cmsSafeText(item.newValue || '-');
    }).join('; ');
    return '<li><b>' + cmsSafeText(log.time) + '</b> - Admin ' + cmsSafeText(log.admin) + ' - ' + cmsSafeText(log.feature) + ': ' + details + '</li>';
  }).join('');
}

function cmsGetSocial(acc,channel){
  var item = (acc.socialLinks || []).find(function(link){return link.channel === channel;});
  return item || {channel:channel,status:'Chưa liên kết',account:'',linkedAt:'',providerId:''};
}

function cmsNormalizeAccountDemoData(){
  cmsAccountData.forEach(function(acc,index){
    if(!acc.phoneVerified) acc.phoneVerified = acc.phone ? 'Đã xác thực' : 'Chưa xác thực';
    if(!acc.emailVerified) acc.emailVerified = acc.email ? 'Đã xác thực' : 'Chưa xác thực';
    if(!acc.updatedAt) acc.updatedAt = index === 0 ? '26/06/2026 13:59' : '25/06/2026 09:32';
    if(!acc.securityMethods) acc.securityMethods = acc.twoFa === 'Bật' ? ['SMS OTP','Email OTP','App OTP'] : ['SMS OTP'];
    if(!acc.identityImages) acc.identityImages = acc.portrait ? ['Ảnh chân dung'] : [];
    if(!acc.socialLinks) acc.socialLinks = [];

    acc.socialLinks.forEach(function(link){
      if(!link.account && link.status === 'Đã kết nối') link.account = acc.username + '@demo.vn';
      if(!link.linkedAt && link.status === 'Đã kết nối') link.linkedAt = '01/06/2026 09:00';
      if(!link.providerId && link.status === 'Đã kết nối') link.providerId = link.channel.toLowerCase() + '_' + acc.accountId.replace(/[^0-9]/g,'');
    });

    ['Google','Apple','Facebook'].forEach(function(channel){
      if(!acc.socialLinks.some(function(link){return link.channel === channel;})){
        acc.socialLinks.push({channel:channel,status:'Chưa liên kết',account:'',linkedAt:'',providerId:''});
      }
    });

    (acc.partners || []).forEach(function(partner){
      if(!partner.cancelAt) partner.cancelAt = partner.status === 'Đã hủy' ? '20/06/2026 10:15' : '';
    });

    (acc.vouchers || []).forEach(function(voucher,i){
      if(!voucher.issuedAt) voucher.issuedAt = i === 0 ? '01/06/2026' : '10/06/2026';
      if(!voucher.usedAt) voucher.usedAt = voucher.status === 'Đã dùng' ? '20/06/2026' : '';
    });
  });
}

function cmsRows(items,columns,formatter){
  if(!items || !items.length){
    return '<tr><td colspan="'+columns.length+'">Không có dữ liệu</td></tr>';
  }
  return items.map(function(item){
    return '<tr>' + columns.map(function(col){
      var value = item[col] || '';
      if(formatter) value = formatter(col,value,item);
      return '<td>' + value + '</td>';
    }).join('') + '</tr>';
  }).join('');
}

function cmsBindAccountEnterSearch(){
  var lookupInput = document.getElementById('accountLookupUsername');
  if(lookupInput){
    lookupInput.onkeydown = function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        cmsLookupAccount();
      }
    };
  }

  var updateInput = document.getElementById('accountUpdateUsernameSearch') || document.getElementById('accountUpdatePhoneSearch');
  if(updateInput){
    updateInput.onkeydown = function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        cmsLoadAccountForUpdate();
      }
    };
  }
}

function cmsPrepareLookupTabs(){
  var result = document.getElementById('accountLookupResult');
  if(!result) return;
  result.classList.add('lookup-tabs-ready');

  var cards = Array.prototype.slice.call(result.querySelectorAll('.account-card'));
  var oldTabs = document.getElementById('accountLookupTabs');
  if(oldTabs) oldTabs.remove();

  var tabs = document.createElement('div');
  tabs.id = 'accountLookupTabs';
  tabs.className = 'account-lookup-tabs';

  cards.forEach(function(card,index){
    var titleNode = card.querySelector('.account-card-title');
    var title = titleNode ? titleNode.textContent.trim() : ('Thông tin ' + (index + 1));
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'account-lookup-tab';
    button.textContent = title;
    button.onclick = function(){cmsShowLookupTab(index);};
    tabs.appendChild(button);
  });

  result.insertAdjacentElement('afterbegin',tabs);
  cmsShowLookupTab(0);
}

function cmsShowLookupTab(index){
  var result = document.getElementById('accountLookupResult');
  if(!result) return;
  var cards = Array.prototype.slice.call(result.querySelectorAll('.account-card'));
  var tabs = Array.prototype.slice.call(result.querySelectorAll('.account-lookup-tab'));

  cards.forEach(function(card,i){card.classList.toggle('active',i === index);});
  tabs.forEach(function(tab,i){tab.classList.toggle('active',i === index);});
}

function cmsEnsureTableChrome(tbodyId,title){
  var tbody = document.getElementById(tbodyId);
  if(!tbody) return;
  var wrap = tbody.closest('.table-wrap');
  if(!wrap) return;

  if(!wrap.querySelector('.account-table-title')){
    wrap.insertAdjacentHTML('afterbegin','<div class="account-table-title">' + cmsSafeText(title) + '</div>');
  }

  if(!document.getElementById(tbodyId + 'Pager')){
    wrap.insertAdjacentHTML('beforeend','<div class="account-pager" id="' + tbodyId + 'Pager"></div>');
  }
}

function cmsRenderPagedTable(tbodyId,title,items,columns,page,pageSize,formatter){
  cmsEnsureTableChrome(tbodyId,title);
  cmsLookupTableState[tbodyId] = {title:title,items:items || [],columns:columns,page:page || 1,pageSize:pageSize || 5,formatter:formatter};
  cmsDrawPagedTable(tbodyId);
}

function cmsDrawPagedTable(tbodyId){
  var state = cmsLookupTableState[tbodyId];
  var tbody = document.getElementById(tbodyId);
  var pager = document.getElementById(tbodyId + 'Pager');
  if(!state || !tbody) return;

  var totalPage = Math.max(1,Math.ceil(state.items.length / state.pageSize));
  state.page = Math.min(Math.max(1,state.page),totalPage);
  var start = (state.page - 1) * state.pageSize;
  var rows = state.items.slice(start,start + state.pageSize);

  if(!rows.length){
    tbody.innerHTML = '<tr><td colspan="' + state.columns.length + '">Không có dữ liệu</td></tr>';
  } else {
    tbody.innerHTML = rows.map(function(item){
      return '<tr>' + state.columns.map(function(col){
        var value = item[col] || '';
        if(state.formatter) value = state.formatter(col,value,item);
        return '<td>' + value + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  if(pager){
    pager.innerHTML = '';
    for(var i = 1; i <= totalPage; i++){
      pager.innerHTML += '<button type="button" class="' + (i === state.page ? 'active' : '') + '" onclick="cmsGoLookupPage(\'' + tbodyId + '\',' + i + ')">' + i + '</button>';
    }
  }
}

function cmsGoLookupPage(tbodyId,page){
  if(!cmsLookupTableState[tbodyId]) return;
  cmsLookupTableState[tbodyId].page = page;
  cmsDrawPagedTable(tbodyId);
}

function cmsRenderLookupSocial(acc){
  var node = document.getElementById('lookupSocialLinks');
  if(!node) return;
  node.innerHTML = ['Google','Apple','Facebook'].map(function(channel){
    var item = cmsGetSocial(acc,channel);
    return '<div class="account-social-item">' +
      '<b>' + cmsSafeText(channel) + '</b>' +
      '<span>Trạng thái: ' + cmsSafeText(item.status) + '</span>' +
      '<span>Tài khoản: ' + cmsSafeText(item.account || '-') + '</span>' +
      '<span>Provider ID: ' + cmsSafeText(item.providerId || '-') + '<br>Ngày liên kết: ' + cmsSafeText(item.linkedAt || '-') + '</span>' +
    '</div>';
  }).join('');
}

function cmsRenderSecurityMethods(acc){
  var node = document.getElementById('lookupSecurityMethods');
  if(!node) return;
  var methods = acc.securityMethods && acc.securityMethods.length ? acc.securityMethods : ['Chưa bật phương thức bảo mật'];
  node.innerHTML = methods.map(function(method){
    return '<span class="account-badge">' + cmsSafeText(method) + '</span>';
  }).join('');
}

function cmsLookupAccount(){
  cmsNormalizeAccountDemoData();
  var username = document.getElementById('accountLookupUsername').value;
  var acc = cmsFindByUsername(username);
  var result = document.getElementById('accountLookupResult');

  if(!acc){
    result.classList.add('hidden');
    cmsCurrentLookupAccount = null;
    cmsSetAlert('accountLookupAlert','error','Không tìm thấy tài khoản hoặc Username không hợp lệ.');
    return;
  }

  cmsCurrentLookupAccount = acc;
  cmsSetAlert('accountLookupAlert','success','Tra cứu tài khoản thành công.');
  result.classList.remove('hidden');
  cmsPrepareLookupTabs();

  document.getElementById('lookupAvatar').src = acc.avatar;
  document.getElementById('lookupAvatar2').src = acc.avatar;
  document.getElementById('lookupPortrait').src = acc.portrait;
  document.getElementById('lookupFullName').textContent = acc.fullName;
  document.getElementById('lookupUsername').textContent = acc.username;
  document.getElementById('lookupAccountId').textContent = acc.accountId;
  document.getElementById('lookupStatus').textContent = acc.status;
var lookupStatusSelect = document.getElementById('lookupStatusSelect');
if(lookupStatusSelect) lookupStatusSelect.value = acc.status;
  document.querySelectorAll('[data-lookup]').forEach(function(el){
    var key = el.getAttribute('data-lookup');
    var value = acc[key];
    if(key === 'pointBalance') value = cmsMoney(acc.pointBalance);
    if(key === 'rank') value = acc.loyalty.rank;
    if(key === 'lifetimeExp') value = acc.loyalty.lifetimeExp.toLocaleString('vi-VN') + ' EXP';
    if(key === 'cycleExp') value = acc.loyalty.cycleExp.toLocaleString('vi-VN') + ' EXP';
    if(key === 'cycleStart') value = acc.loyalty.cycleStart;
    if(key === 'cycleEnd') value = acc.loyalty.cycleEnd;
    if(key === 'progress') value = acc.loyalty.progress + '%';
    if(key === 'expMissing') value = acc.loyalty.expMissing.toLocaleString('vi-VN') + ' EXP';
    el.textContent = value || '';
  });

  cmsRenderLookupSocial(acc);
  cmsRenderSecurityMethods(acc);

  var voucherHead = document.querySelector('#lookupVouchers').closest('table').querySelector('thead tr');
  voucherHead.innerHTML = '<th>Tên voucher</th><th>Mã code</th><th>Trạng thái</th><th>Ngày phát hành</th><th>Ngày sử dụng</th><th>Ngày hết hạn</th>';

  cmsRenderPagedTable('lookupSessions','Danh sách phiên đăng nhập',acc.sessions,['platform','device','os','version','ip','loginAt'],1,5,function(col,value){return cmsSafeText(value);});
  cmsRenderPagedTable('lookupPartners','Danh sách đối tác / dịch vụ đã cấp quyền',acc.partners,['name','scope','grantedAt','partnerUser','status','cancelAt','action'],1,5,function(col,value,item){
    if(col === 'action'){
      return item.status === 'Đang hoạt động' ? '<button class="account-mini-btn danger" type="button" onclick="cmsCancelPartner(\'' + cmsSafeText(item.name) + '\')">Hủy</button>' : '-';
    }
    return cmsSafeText(value || '-');
  });
  cmsRenderPagedTable('lookupPointLots','Danh sách lô Points',acc.pointLots,['amount','receivedAt','expiredAt','status'],1,5,function(col,value){return col === 'amount' ? cmsMoney(value) : cmsSafeText(value);});
  cmsRenderPagedTable('lookupRankHistory','Lịch sử thay đổi hạng',acc.loyalty.rankHistory,['time','type','reason'],1,5,function(col,value){return cmsSafeText(value);});
  cmsRenderPagedTable('lookupVouchers','Danh sách voucher trong kho đồ',acc.vouchers,['name','code','status','issuedAt','usedAt','expiredAt'],1,5,function(col,value){return cmsSafeText(value || '-');});

  document.getElementById('lookupProgressBar').style.width = acc.loyalty.progress + '%';
}

function cmsResetLookup(){
  document.getElementById('accountLookupUsername').value = '';
  document.getElementById('accountLookupResult').classList.add('hidden');
  cmsSetAlert('accountLookupAlert','','');
  cmsCurrentLookupAccount = null;
}

function cmsChangeLookupStatus(nextStatus){
  if(!cmsCurrentLookupAccount) return;

  if(['Đang hoạt động','Tạm khóa','Bị vô hiệu hóa'].indexOf(nextStatus) < 0){
    alert('Trạng thái không hợp lệ.');
    return;
  }

  if(nextStatus === cmsCurrentLookupAccount.status) return;

  if(!confirm('Yêu cầu xác thực Admin. Bạn xác nhận cập nhật trạng thái tài khoản?')){
    var select = document.getElementById('lookupStatusSelect');
    if(select) select.value = cmsCurrentLookupAccount.status;
    return;
  }

  cmsCurrentLookupAccount.status = nextStatus;
  cmsCurrentLookupAccount.updatedAt = cmsNow();
  cmsLookupAccount();
}

function cmsCancelPartner(partnerName){
  if(!cmsCurrentLookupAccount) return;
  var partner = (cmsCurrentLookupAccount.partners || []).find(function(item){return item.name === partnerName;});
  if(!partner || partner.status !== 'Đang hoạt động') return;
  if(!confirm('Bạn chắc chắn muốn hủy quyền dịch vụ ' + partner.name + '?')) return;
  partner.status = 'Đã hủy';
  partner.cancelAt = cmsNow();
  cmsCurrentLookupAccount.updatedAt = cmsNow();
  cmsLookupAccount();
}

function cmsEnhanceAccountUpdateUi(){
  var phoneRow = document.getElementById('updPhone');
  if(phoneRow && !document.getElementById('updPhoneVerified')){
    phoneRow.closest('.account-edit-row').insertAdjacentHTML('afterend',
      '<div class="account-edit-row">' +
        '<label>Trạng thái xác thực SĐT</label>' +
        '<select id="updPhoneVerified" data-update-field="phoneVerified">' +
          '<option>Chưa xác thực</option>' +
          '<option>Đã xác thực</option>' +
        '</select>' +
      '</div>'
    );
  }

  var socialRow = document.getElementById('updRemoveGoogle');
  if(socialRow && !document.getElementById('updSocialGoogle')){
    socialRow.closest('.account-edit-row').innerHTML =
      '<label>Tài khoản liên kết</label>' +
      '<div>' +
        '<div class="account-social-list">' +
          '<div id="updSocialGoogle" class="account-social-item"></div>' +
          '<div id="updSocialApple" class="account-social-item"></div>' +
          '<div id="updSocialFacebook" class="account-social-item"></div>' +
        '</div>' +
        '<input id="updRemoveGoogle" data-update-field="removeGoogle" type="checkbox" hidden>' +
        '<input id="updRemoveApple" data-update-field="removeApple" type="checkbox" hidden>' +
        '<input id="updRemoveFacebook" data-update-field="removeFacebook" type="checkbox" hidden>' +
      '</div>';
  }

  var auditBox = document.querySelector('#screen-account-update .audit-box');
  if(auditBox) auditBox.remove();
}


function cmsRenderSocialUpdate(acc){
  ['Google','Apple','Facebook'].forEach(function(channel){
    var item = cmsGetSocial(acc,channel);
    var node = document.getElementById('updSocial' + channel);
    if(!node) return;

    var linked = item.status === 'Đã kết nối';
    node.innerHTML =
      '<b>' + cmsSafeText(channel) + '</b>' +
      '<span>' + cmsSafeText(item.status) + '</span>' +
      '<span>' + cmsSafeText(item.account || '-') + '</span>' +
      '<button class="account-social-remove-btn" type="button" ' +
        (linked ? '' : 'disabled ') +
        'onclick="cmsToggleRemoveSocial(\'' + channel + '\',this)">Xóa liên kết ' + cmsSafeText(channel) + '</button>';
  });
}

function cmsToggleRemoveSocial(channel,btn){
  var checkbox = document.getElementById('updRemove' + channel);
  if(!checkbox) return;

  checkbox.checked = !checkbox.checked;
  if(btn) btn.classList.toggle('active',checkbox.checked);

  cmsCheckUpdateChanged();
}


function cmsLoadAccountForUpdate(){
  cmsNormalizeAccountDemoData();
  cmsEnhanceAccountUpdateUi();

  var usernameInput = document.getElementById('accountUpdateUsernameSearch') || document.getElementById('accountUpdatePhoneSearch');
  var username = usernameInput ? usernameInput.value : '';
  var acc = cmsFindAccountForUsernameUpdate(username);
  var wrap = document.getElementById('accountUpdateFormWrap');

  if(!acc){
    wrap.classList.add('hidden');
    cmsSetAlert('accountUpdateAlert','error','Không tìm thấy tài khoản hoặc Username không hợp lệ.');
    return;
  }

  cmsCurrentUpdateAccount = acc;
  cmsOriginalUpdateData = {
    phone:acc.phone || '',
    nickname:acc.nickname || '',
    status:acc.status || 'Đang hoạt động',
    phoneVerified:acc.phoneVerified || 'Chưa xác thực',
    email:acc.email || '',
    emailVerified:acc.emailVerified || 'Chưa xác thực',
    twoFa:acc.twoFa || 'Tắt',
    removeGoogle:false,
    removeApple:false,
    removeFacebook:false,
    avatar:''
  };

  cmsSetAlert('accountUpdateAlert','success','Đã tìm thấy tài khoản theo Username. Bạn có thể cập nhật các trường bên dưới.');
  wrap.classList.remove('hidden');

  document.getElementById('updateCurrentAvatar').src = acc.avatar;
  document.getElementById('updateCurrentName').textContent = acc.fullName;
  document.getElementById('updateCurrentUsername').textContent = acc.username;
  document.getElementById('updateCurrentAccountId').textContent = acc.accountId;
  document.getElementById('updateCurrentStatus').textContent = acc.status;

  document.getElementById('updPhone').value = acc.phone || '';
  document.getElementById('updPhoneVerified').value = acc.phoneVerified || 'Chưa xác thực';
  document.getElementById('updNickname').value = acc.nickname || '';
  document.getElementById('updStatus').value = acc.status || 'Đang hoạt động';
  document.getElementById('updEmail').value = acc.email || '';
  document.getElementById('updEmailVerified').value = acc.emailVerified || 'Chưa xác thực';
  document.getElementById('updTwoFa').value = acc.twoFa || 'Tắt';
  document.getElementById('updRemoveGoogle').checked = false;
  document.getElementById('updRemoveApple').checked = false;
  document.getElementById('updRemoveFacebook').checked = false;
  document.getElementById('updAvatar').value = '';

  var lockPhone = cmsIsPhoneUsername(acc.username);
  var lockEmail = cmsIsEmailUsername(acc.username);
  cmsSetFieldDisabled('updPhone',lockPhone,lockPhone ? 'Username của tài khoản là số điện thoại nên không cho chỉnh sửa SĐT.' : 'Cho phép sửa SĐT vì Username không phải số điện thoại.');
  cmsSetFieldDisabled('updEmail',lockEmail,lockEmail ? 'Username của tài khoản là Email nên không cho chỉnh sửa Email.' : 'Cho phép sửa Email vì Username không phải Email.');

  cmsRenderSocialUpdate(acc);
  cmsRenderAuditList('accountAuditList',cmsAuditLogs);
  cmsBindUpdateWatchers();
  cmsCheckUpdateChanged();
}

function cmsBindUpdateWatchers(){
  document.querySelectorAll('[data-update-field]').forEach(function(el){
    el.oninput = cmsCheckUpdateChanged;
    el.onchange = cmsCheckUpdateChanged;
  });
}

function cmsGetUpdateValues(){
  return {
    phone:document.getElementById('updPhone').value.trim(),
    nickname:document.getElementById('updNickname').value.trim(),
    status:document.getElementById('updStatus').value,
    phoneVerified:document.getElementById('updPhoneVerified').value,
    email:document.getElementById('updEmail').value.trim(),
    emailVerified:document.getElementById('updEmailVerified').value,
    twoFa:document.getElementById('updTwoFa').value,
    removeGoogle:document.getElementById('updRemoveGoogle').checked,
    removeApple:document.getElementById('updRemoveApple').checked,
    removeFacebook:document.getElementById('updRemoveFacebook').checked,
    avatar:document.getElementById('updAvatar').value
  };
}

function cmsValidateUpdate(values){
  var valid = true;
  var phoneInput = document.getElementById('updPhone');
  var phoneOk = phoneInput.disabled || /^0\d{9}$/.test(values.phone);
  var duplicatePhone = cmsAccountData.some(function(acc){
    return acc !== cmsCurrentUpdateAccount && values.phone && acc.phone === values.phone;
  });
  document.getElementById('errPhone').classList.toggle('show',!phoneOk || duplicatePhone);
  valid = valid && phoneOk && !duplicatePhone;

  if(values.phoneVerified === 'Đã xác thực' && !values.phone){
    document.getElementById('errPhone').textContent = 'Không thể đặt Đã xác thực khi SĐT đang để trống.';
    document.getElementById('errPhone').classList.add('show');
    valid = false;
  } else {
    document.getElementById('errPhone').textContent = 'Số điện thoại không hợp lệ hoặc trùng với tài khoản khác.';
  }

  var nicknameOk = /^[a-zA-ZÀ-ỹ0-9 ]{2,50}$/.test(values.nickname);
  document.getElementById('errNickname').classList.toggle('show',!nicknameOk);
  valid = valid && nicknameOk;

  var emailInput = document.getElementById('updEmail');
  var emailOk = emailInput.disabled || !values.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  var duplicateEmail = cmsAccountData.some(function(acc){
    return acc !== cmsCurrentUpdateAccount && values.email && acc.email && acc.email.toLowerCase() === values.email.toLowerCase();
  });
  document.getElementById('errEmail').classList.toggle('show',!emailOk || duplicateEmail);
  valid = valid && emailOk && !duplicateEmail;

  if(values.emailVerified === 'Đã xác thực' && !values.email){
    document.getElementById('errEmail').textContent = 'Không thể đặt Đã xác thực khi Email đang để trống.';
    document.getElementById('errEmail').classList.add('show');
    valid = false;
  } else {
    document.getElementById('errEmail').textContent = 'Email không hợp lệ hoặc trùng với tài khoản khác.';
  }

  var avatar = document.getElementById('updAvatar').files[0];
  var avatarOk = true;
  if(avatar){
    avatarOk = ['image/jpeg','image/png'].indexOf(avatar.type) >= 0 && avatar.size <= 5 * 1024 * 1024;
  }
  document.getElementById('errAvatar').classList.toggle('show',!avatarOk);
  valid = valid && avatarOk;

  return valid;
}

function cmsHasUpdateChanged(values){
  if(!cmsOriginalUpdateData) return false;
  return Object.keys(values).some(function(key){return values[key] !== cmsOriginalUpdateData[key];});
}

function cmsCheckUpdateChanged(){
  var values = cmsGetUpdateValues();
  var valid = cmsValidateUpdate(values);
  var changed = cmsHasUpdateChanged(values);
  document.getElementById('btnSaveAccountUpdate').disabled = !(valid && changed);
}

function cmsBuildChanges(original,values,labels){
  var changes = [];
  Object.keys(values).forEach(function(key){
    if(values[key] !== original[key]){
      changes.push({field:labels[key] || key,oldValue:original[key],newValue:values[key]});
    }
  });
  return changes;
}

function cmsSaveAccountUpdate(){
  var values = cmsGetUpdateValues();
  if(!cmsValidateUpdate(values) || !cmsHasUpdateChanged(values)) return;

  if(values.status !== cmsCurrentUpdateAccount.status){
    if(!confirm('Yêu cầu xác thực Admin. Bạn xác nhận cập nhật trạng thái tài khoản?')) return;
  }

  if(values.twoFa === 'Tắt' && cmsCurrentUpdateAccount.twoFa !== 'Tắt'){
    if(!confirm('Tắt 2FA làm giảm mức bảo mật tài khoản. Bạn chắc chắn muốn tiếp tục?')) return;
  }

  var channels = ['Google','Apple','Facebook'];
  for(var i = 0; i < channels.length; i++){
    var channel = channels[i];
    var needRemove = values['remove' + channel];
    if(!needRemove) continue;

    var linked = cmsCurrentUpdateAccount.socialLinks.some(function(item){
      return item.channel === channel && item.status === 'Đã kết nối';
    });

    if(!linked){
      alert('Không thể xóa ' + channel + ' vì liên kết chưa ở trạng thái Đã kết nối.');
      return;
    }

    if(!confirm('Bạn chắc chắn muốn xóa liên kết ' + channel + '?')) return;
  }

  var labels = {phone:'SĐT',nickname:'Biệt danh',status:'Trạng thái tài khoản',phoneVerified:'Trạng thái xác thực SĐT',email:'Email',emailVerified:'Trạng thái xác thực Email',twoFa:'Bảo mật 2 bước',removeGoogle:'Xóa liên kết Google',removeApple:'Xóa liên kết Apple',removeFacebook:'Xóa liên kết Facebook',avatar:'Avatar'};
  var changes = cmsBuildChanges(cmsOriginalUpdateData,values,labels);

  cmsCurrentUpdateAccount.phone = values.phone;
  cmsCurrentUpdateAccount.nickname = values.nickname;
  cmsCurrentUpdateAccount.fullName = values.nickname;
  cmsCurrentUpdateAccount.status = values.status;
  cmsCurrentUpdateAccount.phoneVerified = values.phoneVerified;
  cmsCurrentUpdateAccount.email = values.email;
  cmsCurrentUpdateAccount.emailVerified = values.emailVerified;
  cmsCurrentUpdateAccount.twoFa = values.twoFa;
  cmsCurrentUpdateAccount.updatedAt = cmsNow();

  channels.forEach(function(channel){
    if(values['remove' + channel]){
      cmsCurrentUpdateAccount.socialLinks.forEach(function(item){
        if(item.channel === channel){
          item.status = 'Đã hủy';
          item.account = '';
          item.linkedAt = '';
          item.providerId = '';
        }
      });
    }
  });

  cmsPushAudit(cmsAuditLogs,'hongtt','Cập nhật thông tin tài khoản',changes);
  cmsSetAlert('accountUpdateAlert','success','Lưu cập nhật thành công.');
  cmsLoadAccountForUpdate();
}

function cmsResetUpdate(){
  var input = document.getElementById('accountUpdateUsernameSearch') || document.getElementById('accountUpdatePhoneSearch');
  if(input) input.value = '';
  document.getElementById('accountUpdateFormWrap').classList.add('hidden');
  cmsSetAlert('accountUpdateAlert','','');
  cmsOriginalUpdateData = null;
  cmsCurrentUpdateAccount = null;
}

function cmsLoadIdentityForUpdate(){
  cmsNormalizeAccountDemoData();
  var usernameInput = document.getElementById('identityUsernameSearch') || document.getElementById('identityPhoneSearch');
  var username = usernameInput ? usernameInput.value.trim() : '';
  var acc = cmsFindByUsername(username);
  var wrap = document.getElementById('identityUpdateFormWrap');

  if(!acc){
    wrap.classList.add('hidden');
    cmsSetAlert('identityUpdateAlert','error','Không tìm thấy tài khoản hoặc Username không hợp lệ.');
    return;
  }

  cmsCurrentIdentityAccount = acc;
  cmsOriginalIdentityData = {
    ekycStatus:acc.ekycStatus || 'Chưa xác thực',
    citizenId:acc.citizenId || '',
    dob:acc.dob || '',
    gender:acc.gender || '',
    address:acc.address || '',
    issuedDate:acc.issuedDate || '',
    expiredDate:acc.expiredDate || '',
    images:''
  };

  cmsSetAlert('identityUpdateAlert','success','Đã tìm thấy tài khoản theo Username. Bạn có thể cập nhật thông tin định danh.');
  wrap.classList.remove('hidden');

  document.getElementById('identityCurrentAvatar').src = acc.avatar;
  document.getElementById('identityCurrentName').textContent = acc.fullName;
  document.getElementById('identityCurrentUsername').textContent = acc.username;
  document.getElementById('identityCurrentAccountId').textContent = acc.accountId;
  document.getElementById('identityCurrentStatus').textContent = acc.ekycStatus;

  document.getElementById('idUsername').value = acc.username;
  document.getElementById('idEkycVerified').checked = (acc.ekycStatus || 'Chưa xác thực') === 'Đã xác thực';
  document.getElementById('idCitizenId').value = acc.citizenId || '';
  document.getElementById('idDob').value = acc.dob || '';
  document.getElementById('idGender').value = acc.gender || '';
  document.getElementById('idAddress').value = acc.address || '';
  document.getElementById('idIssuedDate').value = acc.issuedDate || '';
  document.getElementById('idExpiredDate').value = acc.expiredDate || '';
  document.getElementById('idImages').value = '';
  document.getElementById('idImagesHint').textContent = 'Đã có ' + (acc.identityImages || []).length + ' ảnh. Tải tối đa 3 ảnh mới. JPG, PNG. Mỗi ảnh tối đa 5MB.';

  cmsRenderAuditList('identityAuditList',cmsIdentityAuditLogs);
  cmsBindIdentityWatchers();
  cmsCheckIdentityChanged();
}

function cmsBindIdentityWatchers(){
  document.querySelectorAll('[data-identity-field]').forEach(function(el){
    el.oninput = cmsCheckIdentityChanged;
    el.onchange = cmsCheckIdentityChanged;
  });

  var input = document.getElementById('identityUsernameSearch') || document.getElementById('identityPhoneSearch');
  if(input){
    input.onkeydown = function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        cmsLoadIdentityForUpdate();
      }
    };
  }
}

function cmsGetIdentityValues(){
  return {
    ekycStatus:document.getElementById('idEkycVerified').checked ? 'Đã xác thực' : 'Chưa xác thực',
    citizenId:document.getElementById('idCitizenId').value.trim(),
    dob:document.getElementById('idDob').value.trim(),
    gender:document.getElementById('idGender').value,
    address:document.getElementById('idAddress').value.trim(),
    issuedDate:document.getElementById('idIssuedDate').value.trim(),
    expiredDate:document.getElementById('idExpiredDate').value.trim(),
    images:document.getElementById('idImages').value
  };
}

function cmsValidateIdentity(values){
  var valid = true;
  var citizenOk = /^\d{12}$/.test(values.citizenId);
  var duplicateCitizen = cmsAccountData.some(function(acc){
    return acc !== cmsCurrentIdentityAccount && values.citizenId && acc.citizenId === values.citizenId;
  });
  document.getElementById('errIdCitizenId').classList.toggle('show',!citizenOk || duplicateCitizen);
  valid = valid && citizenOk && !duplicateCitizen;

  var dob = cmsParseVnDate(values.dob);
  var dobOk = !!dob && cmsAgeAtToday(dob) >= 18;
  document.getElementById('errIdDob').classList.toggle('show',!dobOk);
  valid = valid && dobOk;

  var genderOk = values.gender === 'Nam' || values.gender === 'Nữ';
  document.getElementById('errIdGender').classList.toggle('show',!genderOk);
  valid = valid && genderOk;

  var addressOk = values.address.length > 0 && values.address.length <= 255 && values.address.split(',').length >= 4;
  document.getElementById('errIdAddress').classList.toggle('show',!addressOk);
  valid = valid && addressOk;

  var issued = cmsParseVnDate(values.issuedDate);
  var expired = cmsParseVnDate(values.expiredDate);
  var today = new Date();
  today.setHours(0,0,0,0);
  var issuedOk = !!issued && issued <= today && (!expired || issued <= expired);
  document.getElementById('errIdIssuedDate').classList.toggle('show',!issuedOk);
  valid = valid && issuedOk;

  var expiredOk = !!expired && !!issued && expired > issued;
  document.getElementById('errIdExpiredDate').classList.toggle('show',!expiredOk);
  valid = valid && expiredOk;

  var warn = document.getElementById('warnIdExpiredDate');
  if(warn){
    warn.textContent = expired && expired <= today ? 'Cảnh báo: CCCD đã hết hạn hoặc hết hạn trong ngày hiện tại. Vẫn cho phép lưu để phục vụ dữ liệu lịch sử.' : '';
  }

  var files = Array.prototype.slice.call(document.getElementById('idImages').files || []);
  var existingCount = (cmsCurrentIdentityAccount.identityImages || []).length;
  var totalImages = existingCount + files.length;
  var imageOk = totalImages >= 1 && totalImages <= 3 && files.every(function(file){
    return ['image/jpeg','image/png'].indexOf(file.type) >= 0 && file.size <= 5 * 1024 * 1024;
  });
  document.getElementById('errIdImages').classList.toggle('show',!imageOk);
  valid = valid && imageOk;

  var canVerify = citizenOk && !duplicateCitizen && dobOk && genderOk && addressOk && issuedOk && expiredOk && totalImages >= 1;
  document.getElementById('errIdEkycStatus').classList.toggle('show',values.ekycStatus === 'Đã xác thực' && !canVerify);
  if(values.ekycStatus === 'Đã xác thực' && !canVerify) valid = false;

  return valid;
}

function cmsHasIdentityChanged(values){
  if(!cmsOriginalIdentityData) return false;
  return Object.keys(values).some(function(key){return values[key] !== cmsOriginalIdentityData[key];});
}

function cmsCheckIdentityChanged(){
  var values = cmsGetIdentityValues();
  var valid = cmsValidateIdentity(values);
  var changed = cmsHasIdentityChanged(values);
  document.getElementById('btnSaveIdentityUpdate').disabled = !(valid && changed);
}

function cmsSaveIdentityUpdate(){
  var values = cmsGetIdentityValues();
  if(!cmsValidateIdentity(values) || !cmsHasIdentityChanged(values)) return;

  var labels = {ekycStatus:'Trạng thái xác thực',citizenId:'Số CCCD',dob:'Ngày sinh',gender:'Giới tính',address:'Địa chỉ thường trú',issuedDate:'Ngày cấp CCCD',expiredDate:'Ngày hết hạn CCCD',images:'Ảnh định danh'};
  var changes = cmsBuildChanges(cmsOriginalIdentityData,values,labels);

  cmsCurrentIdentityAccount.ekycStatus = values.ekycStatus;
  cmsCurrentIdentityAccount.citizenId = values.citizenId;
  cmsCurrentIdentityAccount.dob = values.dob;
  cmsCurrentIdentityAccount.gender = values.gender;
  cmsCurrentIdentityAccount.address = values.address;
  cmsCurrentIdentityAccount.issuedDate = values.issuedDate;
  cmsCurrentIdentityAccount.expiredDate = values.expiredDate;
  cmsCurrentIdentityAccount.updatedAt = cmsNow();

  var files = Array.prototype.slice.call(document.getElementById('idImages').files || []);
  if(files.length){
    cmsCurrentIdentityAccount.identityImages = files.map(function(file){return file.name;});
    cmsCurrentIdentityAccount.portrait = cmsCurrentIdentityAccount.avatar;
  }

  cmsPushAudit(cmsIdentityAuditLogs,'hongtt','Cập nhật thông tin định danh',changes);
  cmsSetAlert('identityUpdateAlert','success','Lưu cập nhật định danh thành công.');
  cmsLoadIdentityForUpdate();
}

function cmsResetIdentityUpdate(){
  var input = document.getElementById('identityUsernameSearch') || document.getElementById('identityPhoneSearch');
  if(input) input.value = '';
  document.getElementById('identityUpdateFormWrap').classList.add('hidden');
  cmsSetAlert('identityUpdateAlert','','');
  cmsOriginalIdentityData = null;
  cmsCurrentIdentityAccount = null;
}

function cmsHandleDemoButton(btn){
  if(!btn || btn.disabled) return;
  var row = btn.closest('tr');
  var text = (btn.textContent || '').trim();
  var icon = btn.querySelector('i');
  var iconClass = icon ? icon.className : '';

  if(iconClass.indexOf('fa-trash') >= 0){
    if(row && confirm('Bạn xác nhận xóa bản ghi demo này?')){
      row.remove();
      alert('Đã xóa bản ghi demo.');
    }
    return;
  }

  if(iconClass.indexOf('fa-ban') >= 0 || iconClass.indexOf('fa-check-circle') >= 0 || iconClass.indexOf('fa-check') >= 0){
    if(row){
      var cells = row.querySelectorAll('td');
      var statusCell = cells.length > 1 ? cells[cells.length - 2] : null;
      if(statusCell){
        var current = statusCell.textContent.trim();
        statusCell.textContent = current === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động';
      }
    }
    alert('Đã đổi trạng thái demo.');
    return;
  }

  if(iconClass.indexOf('fa-edit') >= 0 || text.indexOf('Lưu') >= 0){
    alert('Đã mở mô phỏng cập nhật. Bạn có thể chỉnh form demo hoặc quay lại danh sách.');
    return;
  }

  if(iconClass.indexOf('fa-plus') >= 0 || text.indexOf('Thêm') >= 0){
    var table = btn.closest('.cms-content') ? btn.closest('.cms-content').querySelector('tbody') : null;
    if(table){
      var colCount = table.closest('table').querySelectorAll('thead th').length || 6;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="' + colCount + '">Bản ghi demo mới đã được thêm. Bấm Tra cứu để làm mới danh sách.</td>';
      table.appendChild(tr);
    }
    alert('Đã thêm bản ghi demo.');
    return;
  }

  if(iconClass.indexOf('fa-search') >= 0 || text.indexOf('Tra cứu') >= 0){
    alert('Tra cứu demo thành công. Danh sách hiện tại đã được giữ nguyên để kiểm tra giao diện.');
    return;
  }

  if(iconClass.indexOf('fa-download') >= 0 || text.indexOf('Xuất') >= 0){
    alert('Đã mô phỏng xuất dữ liệu demo.');
    return;
  }

  if(text.indexOf('Ẩn/hiện cột') >= 0){
    var content = btn.closest('.cms-content');
    if(content){
      content.querySelectorAll('table th:last-child, table td:last-child').forEach(function(cell){
        cell.classList.toggle('hidden');
      });
    }
    return;
  }

  if(text === 'Trước' || text === 'Tiếp' || /^\d+$/.test(text)){
    alert('Đã chuyển trang demo.');
    return;
  }

  alert('Đã thực hiện thao tác demo.');
}

function cmsBindDemoButtons(){
  document.querySelectorAll('button').forEach(function(btn){
    if(!btn.getAttribute('type')) btn.setAttribute('type','button');
  });

  document.addEventListener('click',function(e){
    var btn = e.target.closest('button');
    if(!btn) return;
    if(btn.hasAttribute('onclick')) return;
    e.preventDefault();
    cmsHandleDemoButton(btn);
  });
}

function cmsCleanMenuText(text){
  return String(text || '')
    .replace(/\s+/g,' ')
    .replace(/\b\d+(?:\.\d+)?\s+/g,'')
    .replace(/\s*▼\s*/g,'')
    .trim();
}

function cmsApplyBreadcrumbTitle(node,btn){
  if(!node || !btn) return;
  var title = node.querySelector('.cms-screen-title');
  if(!title) return;
  var menu = btn.closest('.cms-menu-item');
  var tabBtn = menu ? menu.querySelector('.cms-nav-btn') : null;
  var tabName = tabBtn ? cmsCleanMenuText(tabBtn.textContent) : '';
  var functionName = cmsCleanMenuText(btn.textContent);
  if(!tabName || !functionName) return;
  var icon = title.querySelector('i');
  title.innerHTML = '';
  if(icon) title.appendChild(icon.cloneNode(true));
  title.appendChild(document.createTextNode(' ' + tabName + ' > ' + functionName));
}

function showScreen(name,btn){
  document.querySelectorAll('.screen').forEach(function(s){s.classList.add('hidden');});
  var node = document.getElementById('screen-' + name);
  if(node){
    node.classList.remove('hidden');
    cmsApplyBreadcrumbTitle(node,btn);
  }

  document.querySelectorAll('.cms-dropdown button').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');

  document.querySelectorAll('.cms-nav-btn').forEach(function(b){b.classList.remove('active');});
  var activeMenu = btn ? btn.closest('.cms-menu-item') : document.querySelector('.cms-menu-item');
  if(activeMenu){
    var nav = activeMenu.querySelector('.cms-nav-btn');
    if(nav) nav.classList.add('active');
  }
}


var cmsLoyaltyEventTypes = [
  {name:'Đăng nhập hàng ngày',desc:'Người dùng đăng nhập vào hệ thống'},
  {name:'Liên kết Google',desc:'Đăng nhập bằng Google lần đầu tiên'},
  {name:'Liên kết Apple',desc:'Đăng nhập bằng Apple lần đầu tiên'},
  {name:'Xác minh email',desc:'Xác thực email qua link kích hoạt'},
  {name:'Xác minh eKYC',desc:'Hoàn thành định danh điện tử (CMND/CCCD)'},
  {name:'Liên kết tài khoản ngân hàng',desc:'Liên kết thành công tài khoản ngân hàng/thẻ'},
  {name:'Bật thông báo (Push Notification)',desc:'Người dùng cấp quyền nhận thông báo ứng dụng'},
  {name:'Xem nội dung / bài viết',desc:'Đọc bài viết, tin tức trong ứng dụng đủ thời gian quy định'},
  {name:'Sinh nhật',desc:'Hệ thống tự động trao vào đúng ngày sinh nhật người dùng'},
  {name:'Kỷ niệm ngày mở tài khoản',desc:'Trao thưởng vào đúng ngày kỷ niệm tham gia hệ thống'},
  {name:'Giới thiệu bạn bè',desc:'Trao thưởng khi Bạn bè nhập mã giới thiệu hợp lệ'},
  {name:'Được bạn bè giới thiệu',desc:'Trao thưởng khi nhập mã của Bạn bè hợp lệ'},
  {name:'Chuỗi đăng nhập 7 ngày',desc:'Người dùng đăng nhập vào hệ thống liên tiếp 7 ngày không gián đoạn'},
  {name:'Chuỗi đăng nhập 30 ngày',desc:'Người dùng đăng nhập vào hệ thống liên tiếp 30 ngày không gián đoạn'},
  {name:'Cửa hàng',desc:'Không phải sự kiện hành vi, dán nhãn để hiển thị voucher trên Cửa hàng'}
];

var cmsLoyaltyEvents = [
  {code:'EVT_DAILY_LOGIN',name:'Đăng nhập hàng ngày',type:'Đăng nhập hàng ngày',desc:'Người dùng đăng nhập vào hệ thống',status:'Active'},
  {code:'EVT_BIRTHDAY',name:'Sinh nhật',type:'Sinh nhật',desc:'Hệ thống tự động trao vào đúng ngày sinh nhật người dùng',status:'Active'},
  {code:'EVT_STORE_LABEL',name:'Cửa hàng',type:'Cửa hàng',desc:'Không phải sự kiện hành vi, dán nhãn để hiển thị voucher trên Cửa hàng',status:'Inactive'}
];
var cmsEditingLoyaltyEventCode = null;
var cmsLoyaltyEventPage = 1;
var cmsLoyaltyEventPageSize = 8;
var cmsLoyaltyEventFiltered = cmsLoyaltyEvents.slice();

function cmsSlugEvent(value){
  var map = {'Đ':'D','đ':'d'};
  return String(value || '').replace(/[Đđ]/g,function(c){return map[c];})
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_+|_+$/g,'')
    .toUpperCase();
}

function cmsGetLoyaltyEventType(name){
  return cmsLoyaltyEventTypes.find(function(item){return item.name === name;}) || cmsLoyaltyEventTypes[0];
}

function cmsFillLoyaltyEventSelects(){
  var filter = document.getElementById('loyaltyEventTypeFilter');
  var select = document.getElementById('loyaltyEventType');
  if(filter && filter.options.length <= 1){
    cmsLoyaltyEventTypes.forEach(function(item){filter.innerHTML += '<option>' + cmsSafeText(item.name) + '</option>';});
  }
  if(select && !select.options.length){
    cmsLoyaltyEventTypes.forEach(function(item){select.innerHTML += '<option>' + cmsSafeText(item.name) + '</option>';});
    select.onchange = cmsSyncLoyaltyEventDesc;
  }
}

function cmsSyncLoyaltyEventDesc(){
  var type = cmsGetLoyaltyEventType(document.getElementById('loyaltyEventType').value);
  cmsSetValue('loyaltyEventDesc',type.desc);
}

function cmsSetLoyaltyEventAlert(type,message){
  cmsSetAlert('loyaltyEventAlert',type,message);
}

function cmsRenderLoyaltyEvents(){
  var tbody = document.getElementById('loyaltyEventRows');
  if(!tbody) return;
  cmsFillLoyaltyEventSelects();
  var totalPage = Math.max(1,Math.ceil(cmsLoyaltyEventFiltered.length / cmsLoyaltyEventPageSize));
  cmsLoyaltyEventPage = Math.min(Math.max(1,cmsLoyaltyEventPage),totalPage);
  var start = (cmsLoyaltyEventPage - 1) * cmsLoyaltyEventPageSize;
  var rows = cmsLoyaltyEventFiltered.slice(start,start + cmsLoyaltyEventPageSize);
  tbody.innerHTML = rows.length ? rows.map(function(item){
    return '<tr><td>' + cmsSafeText(item.code) + '</td><td>' + cmsSafeText(item.name) + '</td><td>' + cmsSafeText(item.type) + '</td><td>' + cmsSafeText(item.desc) + '</td><td><span class="account-badge ' + (item.status === 'Active' ? 'status-active' : 'status-inactive') + '">' + cmsSafeText(item.status) + '</span></td><td><button class="icon-square orange" type="button" onclick="cmsEditLoyaltyEvent(\'' + cmsSafeText(item.code) + '\')"><i class="fa fa-edit"></i></button><button class="icon-square red" type="button" onclick="cmsDeleteLoyaltyEvent(\'' + cmsSafeText(item.code) + '\')"><i class="fa fa-trash"></i></button></td></tr>';
  }).join('') : '<tr><td colspan="6">Không có sự kiện phù hợp.</td></tr>';
  var count = document.getElementById('loyaltyEventCount');
  if(count) count.textContent = 'Hiển thị ' + rows.length + ' / ' + cmsLoyaltyEventFiltered.length + ' bản ghi';
  var page = document.getElementById('loyaltyEventPage');
  if(page) page.textContent = cmsLoyaltyEventPage;
}

function cmsSearchLoyaltyEvents(){
  var keyword = String(cmsGetValue('loyaltyEventKeyword') || '').trim().toLowerCase();
  var type = cmsGetValue('loyaltyEventTypeFilter');
  var status = cmsGetValue('loyaltyEventStatusFilter');
  cmsLoyaltyEventFiltered = cmsLoyaltyEvents.filter(function(item){
    var matchKeyword = !keyword || [item.code,item.name,item.type,item.desc].join(' ').toLowerCase().indexOf(keyword) >= 0;
    var matchType = !type || item.type === type;
    var matchStatus = !status || item.status === status;
    return matchKeyword && matchType && matchStatus;
  });
  cmsLoyaltyEventPage = 1;
  cmsRenderLoyaltyEvents();
}

function cmsSetLoyaltyEventPage(page){
  cmsLoyaltyEventPage = page;
  cmsRenderLoyaltyEvents();
}

function cmsOpenLoyaltyEventForm(code){
  cmsClearLoyaltyEventForm(true);
  showScreen('loyalty-offer-event-form');
  if(code) cmsEditLoyaltyEvent(code);
}

function cmsCloseLoyaltyEventForm(){
  cmsEditingLoyaltyEventCode = null;
  showScreen('loyalty-offer-events');
}

function cmsClearLoyaltyEventForm(keepPanel){
  cmsEditingLoyaltyEventCode = null;
  cmsSetValue('loyaltyEventName','');
  cmsSetValue('loyaltyEventCode','');
  cmsSetValue('loyaltyEventStatus','Active');
  cmsFillLoyaltyEventSelects();
  if(document.getElementById('loyaltyEventType')) document.getElementById('loyaltyEventType').selectedIndex = 0;
  cmsSyncLoyaltyEventDesc();
  var title = document.getElementById('loyaltyEventFormTitle');
  if(title) title.textContent = 'Thêm sự kiện ưu đãi';
  if(!keepPanel) cmsSetLoyaltyEventAlert('', '');
}

function cmsEditLoyaltyEvent(code){
  var item = cmsLoyaltyEvents.find(function(event){return event.code === code;});
  if(!item) return;
  cmsEditingLoyaltyEventCode = code;
 showScreen('loyalty-offer-event-form');
  cmsSetValue('loyaltyEventName',item.name);
  cmsSetValue('loyaltyEventType',item.type);
  cmsSetValue('loyaltyEventCode',item.code);
  cmsSetValue('loyaltyEventStatus',item.status);
  cmsSetValue('loyaltyEventDesc',item.desc);
  var title = document.getElementById('loyaltyEventFormTitle');
  if(title) title.textContent = 'Sửa sự kiện ưu đãi';
  cmsSetLoyaltyEventAlert('', '');
}

function cmsSaveLoyaltyEvent(){
  cmsFillLoyaltyEventSelects();
  var name = String(cmsGetValue('loyaltyEventName') || '').trim();
  var type = cmsGetValue('loyaltyEventType');
  var status = cmsGetValue('loyaltyEventStatus');
  var typeInfo = cmsGetLoyaltyEventType(type);
  if(name.length < 2 || name.length > 50){
    cmsSetLoyaltyEventAlert('error','Tên sự kiện phải có độ dài từ 2 đến 50 ký tự.');
    return;
  }
  if(['Active','Inactive'].indexOf(status) < 0){
    cmsSetLoyaltyEventAlert('error','Trạng thái bắt buộc là Active hoặc Inactive.');
    return;
  }
  if(cmsEditingLoyaltyEventCode){
    var current = cmsLoyaltyEvents.find(function(item){return item.code === cmsEditingLoyaltyEventCode;});
    if(!current) return;
    current.name = name;
    current.type = type;
    current.desc = typeInfo.desc;
    current.status = status;
    cmsSetLoyaltyEventAlert('success','Đã cập nhật sự kiện ' + current.code + '.');
  } else {
    var baseCode = 'EVT_' + cmsSlugEvent(type || name);
    var code = baseCode;
    var i = 1;
    while(cmsLoyaltyEvents.some(function(item){return item.code === code;})){
      i += 1;
      code = baseCode + '_' + i;
    }
    cmsLoyaltyEvents.unshift({code:code,name:name,type:type,desc:typeInfo.desc,status:status});
    cmsSetValue('loyaltyEventCode',code);
    cmsSetLoyaltyEventAlert('success','Đã tạo sự kiện ' + code + '.');
  }
  cmsSearchLoyaltyEvents();
  cmsEditingLoyaltyEventCode = null;
  showScreen('loyalty-offer-events');
}

function cmsDeleteLoyaltyEvent(code){
  var item = cmsLoyaltyEvents.find(function(event){return event.code === code;});
  if(!item) return;
  if(!confirm('Bạn chắc chắn muốn xóa sự kiện ' + item.name + '?')) return;
  cmsLoyaltyEvents = cmsLoyaltyEvents.filter(function(event){return event.code !== code;});
  cmsSetLoyaltyEventAlert('success','Đã xóa sự kiện ' + code + '.');
  cmsSearchLoyaltyEvents();
}

function cmsResetLoyaltyEventSearch(){
  cmsSetValue('loyaltyEventKeyword','');
  cmsSetValue('loyaltyEventTypeFilter','');
  cmsSetValue('loyaltyEventStatusFilter','');
  cmsLoyaltyEventFiltered = cmsLoyaltyEvents.slice();
  cmsLoyaltyEventPage = 1;
  cmsRenderLoyaltyEvents();
}

function cmsBindLoyaltyEventEnter(){
  var input = document.getElementById('loyaltyEventKeyword');
  if(input){
    input.onkeydown = function(e){
      if(e.key === 'Enter'){
        e.preventDefault();
        cmsSearchLoyaltyEvents();
      }
    };
  }
}

function cmsInitLoyaltyAdmin(){
  cmsFillLoyaltyEventSelects();
  cmsResetLoyaltyEventSearch();
  cmsBindLoyaltyEventEnter();
}
document.addEventListener('DOMContentLoaded',function(){
  cmsInitLoyaltyAdmin();
  cmsBindLoyaltyConfigFormNavigation();
});
document.addEventListener('DOMContentLoaded',function(){
  cmsInitLoyaltyAdmin();
});

document.addEventListener('DOMContentLoaded',function(){
  cmsNormalizeAccountDemoData();
  cmsEnhanceAccountUpdateUi();
  cmsBindAccountEnterSearch();
  cmsBindIdentityWatchers();
  cmsBindDemoButtons();
});


var cmsPaymentRates = [
  {id:'RATE-0001',currency:'VNĐ',value:100,start:'2026-06-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực',note:'100 Point cho mỗi 1.000 VNĐ',createdBy:'hongtt',createdAt:'01/06/2026 00:00',used:true},
  {id:'RATE-0002',currency:'Vcoin',value:10,start:'2026-06-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực',note:'10 Point cho mỗi 1 Vcoin',createdBy:'hongtt',createdAt:'01/06/2026 00:00',used:false},
  {id:'RATE-0003',currency:'VNĐ',value:80,start:'2026-01-01T00:00',end:'2026-05-31T23:59',status:'Hết hiệu lực',note:'Cấu hình cũ',createdBy:'hanhpd',createdAt:'01/01/2026 00:00',used:true}
];

var cmsPaymentRateLogs = [
  {time:'01/06/2026 00:00',admin:'hongtt',content:'Kích hoạt RATE-0001. RATE-0003 chuyển Hết hiệu lực.'}
];

var cmsPaymentLimits = [
  {id:'LIMIT-0001',business:'Nạp Point',min:1000,max:5000000,requireEkyc:true,start:'2026-07-01T00:00',end:'2026-12-31T23:59',status:'Chờ hiệu lực'},
  {id:'LIMIT-0002',business:'Thanh toán bằng Point',min:100,max:2000000,requireEkyc:true,start:'2026-06-01T00:00',end:'2026-12-31T23:59',status:'Đang hoạt động'},
  {id:'LIMIT-0003',business:'Thanh toán bằng VTC Pay',min:1000,max:10000000,requireEkyc:false,start:'2026-06-01T00:00',end:'2026-12-31T23:59',status:'Đang hoạt động'}
];

var cmsPaymentTransactions = [
  {id:'TX-TOPUP-0001',type:'Nạp Point',user:'0936168687',status:'Thành công',createdAt:'29/06/2026 08:10',successAt:'29/06/2026 08:11',money:100000,point:10000,method:'Chuyển khoản',voucher:'MYVTC10-HONG',moneyDiscount:10000,pointDiscount:0,vtcPayId:'VTP-20260629-001',serviceId:'MYVTC',partnerRef:'',description:'Nạp Point qua VTC Pay',updatedBy:'Người dùng'},
  {id:'TX-PAY-0001',type:'Thanh toán bằng Point',user:'0936168687',status:'Thành công',createdAt:'29/06/2026 09:20',successAt:'29/06/2026 09:20',money:0,point:15000,method:'Point',voucher:'',moneyDiscount:0,pointDiscount:500,vtcPayId:'',serviceId:'AU2',partnerRef:'AU2-ORDER-7788',description:'Thanh toán gói Kim Cương',updatedBy:'Người dùng'},
  {id:'TX-VTP-0001',type:'Thanh toán bằng VTC Pay',user:'0961381232',status:'Thành công',createdAt:'28/06/2026 20:02',successAt:'28/06/2026 20:04',money:200000,point:0,method:'ATM',voucher:'',moneyDiscount:0,pointDiscount:0,vtcPayId:'VTP-20260628-015',serviceId:'CF',partnerRef:'CF-ORDER-9911',description:'Thanh toán đơn hàng game',updatedBy:'Người dùng'},
  {id:'TX-TOPUP-0002',type:'Nạp Point',user:'0961381232',status:'Thất bại',createdAt:'28/06/2026 12:00',successAt:'',money:50000,point:0,method:'Thẻ quốc tế',voucher:'',moneyDiscount:0,pointDiscount:0,vtcPayId:'VTP-20260628-008',serviceId:'MYVTC',partnerRef:'',description:'Thanh toán thất bại từ cổng',updatedBy:'Hệ thống'}
];

var cmsPaymentRefunds = [];
var cmsPaymentAdjustments = [];
var cmsPaymentTransactionFiltered = cmsPaymentTransactions.slice();
var cmsPaymentTransactionPage = 1;
var cmsPaymentPageSize = 6;

function cmsGetValue(id){
  var el = document.getElementById(id);
  return el ? String(el.value || '').trim() : '';
}

function cmsSetValue(id,value){
  var el = document.getElementById(id);
  if(el) el.value = value == null ? '' : value;
}

function cmsSetChecked(id,value){
  var el = document.getElementById(id);
  if(el) el.checked = !!value;
}

function cmsPaymentNextId(prefix,list){
  var max = 0;
  list.forEach(function(item){
    var n = Number(String(item.id || '').replace(/\D/g,''));
    if(n > max) max = n;
  });
  return prefix + '-' + String(max + 1).padStart(4,'0');
}

function cmsPaymentFormatDateTime(value){
  if(!value) return '';
  if(value.indexOf('T') > -1){
    var parts = value.split('T');
    return parts[1] + ' ' + parts[0].split('-').reverse().join('/');
  }
  return value;
}

function cmsPaymentNumber(value,suffix){
  var number = Number(value || 0);
  if(!number) return '';
  return number.toLocaleString('vi-VN') + (suffix ? ' ' + suffix : '');
}

function cmsPaymentStatusClass(status){
  if(status === 'Hiệu lực' || status === 'Đang hoạt động' || status === 'Thành công') return 'active';
  if(status === 'Chờ áp dụng' || status === 'Chờ hiệu lực' || status === 'Đang xử lý') return 'waiting';
  if(status === 'Đã hủy' || status === 'Thất bại') return 'cancelled';
  return 'expired';
}

function cmsPaymentStatusHtml(status){
  return '<span class="payment-status ' + cmsPaymentStatusClass(status) + '">' + cmsSafeText(status) + '</span>';
}

function cmsPaymentAlert(id,type,message){
  cmsSetAlert(id,type,message);
}

function cmsPushPaymentRateLog(content){
  cmsPaymentRateLogs.unshift({time:cmsNow(),admin:'hongtt',content:content});
  cmsRenderPaymentRateLogs();
}

function cmsUpdatePaymentRateRuntimeStatus(){
  var now = new Date();
  cmsPaymentRates.forEach(function(rate){
    if(rate.status === 'Hết hiệu lực') return;
    var start = new Date(rate.start);
    var end = new Date(rate.end);
    if(now < start) rate.status = 'Chờ áp dụng';
    if(now >= start && now <= end) rate.status = 'Hiệu lực';
    if(now > end) rate.status = 'Hết hiệu lực';
  });

  ['VNĐ','Vcoin'].forEach(function(currency){
    var active = cmsPaymentRates.filter(function(rate){return rate.currency === currency && rate.status === 'Hiệu lực';});
    active.sort(function(a,b){return new Date(b.start) - new Date(a.start);});
    active.slice(1).forEach(function(rate){rate.status = 'Hết hiệu lực';});
  });
}

function cmsRenderPaymentRates(){
  cmsUpdatePaymentRateRuntimeStatus();
  var tbody = document.getElementById('paymentRateRows');
  if(!tbody) return;
  var currency = cmsGetValue('rateFilterCurrency');
  var status = cmsGetValue('rateFilterStatus');
  var rows = cmsPaymentRates.filter(function(item){
    return (!currency || item.currency === currency) && (!status || item.status === status);
  });

  tbody.innerHTML = rows.length ? rows.map(function(item){
    var unit = item.currency === 'VNĐ' ? 'Point / 1.000 VNĐ' : 'Point / 1 Vcoin';
    return '<tr>' +
      '<td>' + cmsSafeText(item.id) + '</td>' +
      '<td>' + cmsSafeText(item.currency) + '</td>' +
      '<td><span class="payment-money">' + cmsPaymentNumber(item.value,'') + '</span> ' + cmsSafeText(unit) + '</td>' +
      '<td>' + cmsSafeText(cmsPaymentFormatDateTime(item.start)) + '</td>' +
      '<td>' + cmsSafeText(cmsPaymentFormatDateTime(item.end)) + '</td>' +
      '<td>' + cmsPaymentStatusHtml(item.status) + '</td>' +
      '<td>' + cmsSafeText(item.createdBy) + '</td>' +
      '<td>' + cmsSafeText(item.createdAt) + '</td>' +
      '<td>' + cmsSafeText(item.note || '') + '</td>' +
            '<td class="ops"><button class="icon-square orange" onclick="cmsOpenPaymentRateForm(\'' + item.id + '\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" onclick="cmsActivatePaymentRate(\'' + item.id + '\')"><i class="fa fa-check"></i></button><button class="icon-square red" onclick="cmsDeletePaymentRate(\'' + item.id + '\')"><i class="fa fa-trash"></i></button></td>' +
    '</tr>';
  }).join('') : '<tr><td colspan="10">Không có dữ liệu</td></tr>';
}

function cmsRenderPaymentRateLogs(){
  var node = document.getElementById('paymentRateLogs');
  if(!node) return;
  node.innerHTML = cmsPaymentRateLogs.length ? cmsPaymentRateLogs.slice(0,8).map(function(log){
    return '<div class="payment-log-item"><b>' + cmsSafeText(log.time) + '</b><br>Admin ' + cmsSafeText(log.admin) + ': ' + cmsSafeText(log.content) + '</div>';
  }).join('') : '<div>Chưa có lịch sử thay đổi.</div>';
}

function cmsOpenPaymentRateForm(id){
  cmsResetPaymentRateForm();
  showScreen('payment-rate-form');
  if(id) cmsEditPaymentRate(id);
}

function cmsBackPaymentRateList(){
  showScreen('payment-rate');
}

function cmsResetPaymentRateForm(){
  cmsSetValue('rateEditingId','');
  cmsSetValue('rateCurrency','VNĐ');
  cmsSetValue('rateValue','');
  cmsSetValue('rateStart','');
  cmsSetValue('rateEnd','');
  cmsSetValue('rateNote','');
  cmsPaymentAlert('paymentRateAlert','', '');
}

function cmsSavePaymentRate(){
  var id = cmsGetValue('rateEditingId');
  var currency = cmsGetValue('rateCurrency');
  var value = Number(cmsGetValue('rateValue'));
  var start = cmsGetValue('rateStart');
  var end = cmsGetValue('rateEnd');
  var note = cmsGetValue('rateNote');

  if(!currency || !value || value <= 0 || !start || !end){
    cmsPaymentAlert('paymentRateAlert','error','Vui lòng nhập đủ thông tin bắt buộc. Tỉ lệ quy đổi phải lớn hơn 0.');
    return;
  }
  if(new Date(end) <= new Date(start)){
    cmsPaymentAlert('paymentRateAlert','error','Thời gian hiệu lực đến phải lớn hơn thời gian hiệu lực từ.');
    return;
  }
  if(note.length > 500){
    cmsPaymentAlert('paymentRateAlert','error','Ghi chú tối đa 500 ký tự.');
    return;
  }

  var current = id ? cmsPaymentRates.find(function(item){return item.id === id;}) : null;
  if(current){
    var old = current.currency + ' ' + current.value + ' từ ' + current.start + ' đến ' + current.end;
    current.currency = currency;
    current.value = value;
    current.start = start;
    current.end = end;
    current.note = note;
    cmsPushPaymentRateLog('Sửa ' + id + '. Trước: ' + old + '. Sau: ' + currency + ' ' + value + '.');
  } else {
    current = {id:cmsPaymentNextId('RATE',cmsPaymentRates),currency:currency,value:value,start:start,end:end,status:'Chờ áp dụng',note:note,createdBy:'hongtt',createdAt:cmsNow(),used:false};
    cmsPaymentRates.unshift(current);
    cmsPushPaymentRateLog('Tạo mới ' + current.id + ' cho loại tiền ' + currency + '.');
  }

  cmsUpdatePaymentRateRuntimeStatus();
  if(current.status === 'Hiệu lực'){
    cmsPaymentRates.forEach(function(item){
      if(item.id !== current.id && item.currency === current.currency && item.status === 'Hiệu lực'){
        item.status = 'Hết hiệu lực';
        cmsPushPaymentRateLog('Tự động chuyển ' + item.id + ' sang Hết hiệu lực do kích hoạt ' + current.id + '.');
      }
    });
  }

  cmsPaymentAlert('paymentRateAlert','success','Đã lưu cấu hình tỉ lệ quy đổi.');
  cmsResetPaymentRateForm();
  cmsRenderPaymentRates();
  showScreen('payment-rate');
}

function cmsEditPaymentRate(id){
  var item = cmsPaymentRates.find(function(rate){return rate.id === id;});
  if(!item) return;
  cmsSetValue('rateEditingId',item.id);
  cmsSetValue('rateCurrency',item.currency);
  cmsSetValue('rateValue',item.value);
  cmsSetValue('rateStart',item.start);
  cmsSetValue('rateEnd',item.end);
  cmsSetValue('rateNote',item.note);
  cmsPaymentAlert('paymentRateAlert','success','Đang sửa ' + item.id + '.');
  showScreen('payment-rate-form');
}

function cmsActivatePaymentRate(id){
  var item = cmsPaymentRates.find(function(rate){return rate.id === id;});
  if(!item) return;
  cmsPaymentRates.forEach(function(rate){
    if(rate.currency === item.currency && rate.id !== item.id && rate.status === 'Hiệu lực') rate.status = 'Hết hiệu lực';
  });
  item.status = 'Hiệu lực';
  cmsPushPaymentRateLog('Kích hoạt ' + item.id + '. Các cấu hình cùng loại tiền chuyển Hết hiệu lực.');
  cmsPaymentAlert('paymentRateAlert','success','Đã kích hoạt ' + item.id + '.');
  cmsRenderPaymentRates();
}

function cmsDeletePaymentRate(id){
  var item = cmsPaymentRates.find(function(rate){return rate.id === id;});
  if(!item) return;
  if(item.used){
    item.status = 'Hết hiệu lực';
    cmsPushPaymentRateLog('Không xóa ' + id + ' vì đã phát sinh giao dịch. Chuyển Hết hiệu lực.');
    cmsPaymentAlert('paymentRateAlert','error','Tỉ lệ đã từng được dùng trong giao dịch. Hệ thống chuyển sang Hết hiệu lực.');
  } else {
    cmsPaymentRates = cmsPaymentRates.filter(function(rate){return rate.id !== id;});
    cmsPushPaymentRateLog('Xóa cấu hình ' + id + '.');
    cmsPaymentAlert('paymentRateAlert','success','Đã xóa cấu hình chưa phát sinh giao dịch.');
  }
  cmsRenderPaymentRates();
}

function cmsRenderPaymentLimits(){
  var tbody = document.getElementById('paymentLimitRows');
  if(!tbody) return;
  var business = cmsGetValue('limitFilterBusiness');
  var status = cmsGetValue('limitFilterStatus');
  var rows = cmsPaymentLimits.filter(function(item){
    return (!business || item.business === business) && (!status || item.status === status);
  });

  tbody.innerHTML = rows.length ? rows.map(function(item){
    return '<tr>' +
      '<td>' + cmsSafeText(item.id) + '</td>' +
      '<td>' + cmsSafeText(item.business) + '</td>' +
      '<td>' + cmsPaymentNumber(item.min,'Point') + '</td>' +
      '<td>' + cmsPaymentNumber(item.max,'Point') + '</td>' +
      '<td>' + (item.requireEkyc ? 'Đã xác thực CCCD' : 'Không yêu cầu') + '</td>' +
      '<td>' + cmsSafeText(cmsPaymentFormatDateTime(item.start)) + '</td>' +
      '<td>' + cmsSafeText(cmsPaymentFormatDateTime(item.end)) + '</td>' +
      '<td>' + cmsPaymentStatusHtml(item.status) + '</td>' +
            '<td class="ops"><button class="icon-square orange" onclick="cmsOpenPaymentLimitForm(\'' + item.id + '\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" onclick="cmsActivatePaymentLimit(\'' + item.id + '\')"><i class="fa fa-check"></i></button><button class="icon-square red" onclick="cmsDeletePaymentLimit(\'' + item.id + '\')"><i class="fa fa-trash"></i></button></td>' +
    '</tr>';
  }).join('') : '<tr><td colspan="9">Không có dữ liệu</td></tr>';
}

function cmsOpenPaymentLimitForm(id){
  cmsResetPaymentLimitForm();
  showScreen('payment-limit-form');
  if(id) cmsEditPaymentLimit(id);
}

function cmsBackPaymentLimitList(){
  showScreen('payment-limit');
}

function cmsResetPaymentLimitForm(){
  cmsSetValue('limitEditingId','');
  cmsSetValue('limitBusiness','Nạp Point');
  cmsSetValue('limitMin','');
  cmsSetValue('limitMax','');
  cmsSetValue('limitStart','');
  cmsSetValue('limitEnd','');
  cmsSetValue('limitStatus','Chờ hiệu lực');
  cmsSetChecked('limitRequireEkyc',false);
  cmsPaymentAlert('paymentLimitAlert','', '');
}

function cmsSavePaymentLimit(){
  var id = cmsGetValue('limitEditingId');
  var business = cmsGetValue('limitBusiness');
  var min = Number(cmsGetValue('limitMin'));
  var max = Number(cmsGetValue('limitMax'));
  var start = cmsGetValue('limitStart');
  var end = cmsGetValue('limitEnd');
  var status = cmsGetValue('limitStatus');
  var requireEkyc = !!(document.getElementById('limitRequireEkyc') && document.getElementById('limitRequireEkyc').checked);

  if(!business || isNaN(min) || isNaN(max) || !start || !end){
    cmsPaymentAlert('paymentLimitAlert','error','Vui lòng nhập đủ thông tin bắt buộc.');
    return;
  }
  if(min < 0 || max <= min){
    cmsPaymentAlert('paymentLimitAlert','error','Giá trị tối đa Y phải lớn hơn giá trị tối thiểu X.');
    return;
  }
  if(new Date(end) <= new Date(start)){
    cmsPaymentAlert('paymentLimitAlert','error','Thời gian kết thúc phải lớn hơn thời gian bắt đầu.');
    return;
  }

  if(status === 'Đang hoạt động'){
    cmsPaymentLimits.forEach(function(item){
      if(item.business === business && item.id !== id && item.status === 'Đang hoạt động') item.status = 'Hết hiệu lực';
    });
  }

  var current = id ? cmsPaymentLimits.find(function(item){return item.id === id;}) : null;
  if(current){
    current.business = business;
    current.min = min;
    current.max = max;
    current.requireEkyc = requireEkyc;
    current.start = start;
    current.end = end;
    current.status = status;
  } else {
    cmsPaymentLimits.unshift({id:cmsPaymentNextId('LIMIT',cmsPaymentLimits),business:business,min:min,max:max,requireEkyc:requireEkyc,start:start,end:end,status:status});
  }

cmsPaymentAlert('paymentLimitAlert','success','Đã lưu cấu hình hạn mức.');
  cmsResetPaymentLimitForm();
  cmsRenderPaymentLimits();
  showScreen('payment-limit');
}

function cmsEditPaymentLimit(id){
  var item = cmsPaymentLimits.find(function(limit){return limit.id === id;});
  if(!item) return;
  cmsSetValue('limitEditingId',item.id);
  cmsSetValue('limitBusiness',item.business);
  cmsSetValue('limitMin',item.min);
  cmsSetValue('limitMax',item.max);
  cmsSetValue('limitStart',item.start);
  cmsSetValue('limitEnd',item.end);
  cmsSetValue('limitStatus',item.status);
  cmsSetChecked('limitRequireEkyc',item.requireEkyc);
 cmsPaymentAlert('paymentLimitAlert','success','Đang sửa ' + item.id + '.');
  showScreen('payment-limit-form');
}

function cmsActivatePaymentLimit(id){
  var item = cmsPaymentLimits.find(function(limit){return limit.id === id;});
  if(!item) return;
  cmsPaymentLimits.forEach(function(limit){
    if(limit.business === item.business && limit.id !== item.id && limit.status === 'Đang hoạt động') limit.status = 'Hết hiệu lực';
  });
  item.status = 'Đang hoạt động';
  cmsPaymentAlert('paymentLimitAlert','success','Đã kích hoạt ' + item.id + '.');
  cmsRenderPaymentLimits();
}

function cmsDeletePaymentLimit(id){
  var item = cmsPaymentLimits.find(function(limit){return limit.id === id;});
  if(!item) return;
  if(item.status === 'Đang hoạt động'){
    item.status = 'Đã hủy';
    cmsPaymentAlert('paymentLimitAlert','success','Cấu hình đang hoạt động đã chuyển sang Đã hủy.');
  } else {
    cmsPaymentLimits = cmsPaymentLimits.filter(function(limit){return limit.id !== id;});
    cmsPaymentAlert('paymentLimitAlert','success','Đã xóa cấu hình hạn mức.');
  }
  cmsRenderPaymentLimits();
}

function cmsFindTransaction(id){
  var key = String(id || '').trim().toLowerCase();
  return cmsPaymentTransactions.find(function(tx){return tx.id.toLowerCase() === key;});
}

function cmsCheckRefundTransaction(){
  var tx = cmsFindTransaction(cmsGetValue('refundOriginalTx'));
  var phone = cmsGetValue('refundPhone');
  var preview = document.getElementById('refundPreview');
  if(!tx || tx.type !== 'Thanh toán bằng Point' || tx.status !== 'Thành công'){
    if(preview) preview.innerHTML = '';
    cmsPaymentAlert('paymentRefundAlert','error','Giao dịch gốc phải tồn tại, là Thanh toán bằng Point và đã thành công.');
    return null;
  }
  if(tx.user !== phone || !cmsFindByPhone(phone)){
    if(preview) preview.innerHTML = '';
    cmsPaymentAlert('paymentRefundAlert','error','Người dùng không hợp lệ hoặc không khớp giao dịch gốc.');
    return null;
  }
  var existed = cmsPaymentRefunds.some(function(refund){return refund.originalTx === tx.id;});
  if(existed || tx.status === 'Hoàn tiền'){
    cmsPaymentAlert('paymentRefundAlert','error','Giao dịch này đã được hoàn Point.');
    return null;
  }

  if(preview){
    preview.innerHTML = '<div class="payment-detail-title">Thông tin giao dịch đủ điều kiện hoàn</div>' +
      '<div class="payment-detail-grid"><b>Mã giao dịch</b><span>' + cmsSafeText(tx.id) + '</span><b>Người dùng</b><span>' + cmsSafeText(tx.user) + '</span><b>Số Point hoàn</b><span>' + cmsPaymentNumber(tx.point,'Point') + '</span><b>Thời gian giao dịch</b><span>' + cmsSafeText(tx.successAt) + '</span><b>Dịch vụ</b><span>' + cmsSafeText(tx.serviceId) + '</span></div>';
  }
  cmsPaymentAlert('paymentRefundAlert','success','Giao dịch hợp lệ. Hệ thống hỗ trợ hoàn toàn bộ ' + cmsPaymentNumber(tx.point,'Point') + '.');
  return tx;
}

function cmsCreatePointRefund(){
  var tx = cmsCheckRefundTransaction();
  var reason = cmsGetValue('refundReason');
  if(!tx) return;
  if(!reason){
    cmsPaymentAlert('paymentRefundAlert','error','Vui lòng nhập lý do hoàn tiền.');
    return;
  }

  var refundId = cmsPaymentNextId('REFUND',cmsPaymentRefunds);
  var time = cmsNow();
  cmsPaymentRefunds.unshift({id:refundId,originalTx:tx.id,user:tx.user,point:tx.point,txTime:tx.successAt,refundTime:time,reason:reason});
  tx.status = 'Hoàn tiền';
  cmsPaymentTransactions.unshift({id:'TX-REFUND-' + String(cmsPaymentRefunds.length).padStart(4,'0'),type:'Hoàn Point',user:tx.user,status:'Thành công',createdAt:time,successAt:time,money:0,point:tx.point,method:'Point',voucher:'',moneyDiscount:0,pointDiscount:0,vtcPayId:'',serviceId:tx.serviceId,partnerRef:tx.partnerRef,description:'Hoàn toàn bộ Point cho ' + tx.id + '. Lý do: ' + reason,updatedBy:'Admin'});
  var acc = cmsFindByPhone(tx.user);
  if(acc) acc.pointBalance = Number(acc.pointBalance || 0) + Number(tx.point || 0);

  cmsPaymentAlert('paymentRefundAlert','success','Đã hoàn Point thành công. Mã yêu cầu ' + refundId + '.');
  cmsResetRefundForm(true);
  cmsRenderPaymentRefunds();
  cmsSearchPaymentTransactions();
}

function cmsResetRefundForm(keepAlert){
  cmsSetValue('refundOriginalTx','');
  cmsSetValue('refundPhone','');
  cmsSetValue('refundReason','');
  var preview = document.getElementById('refundPreview');
  if(preview) preview.innerHTML = '';
  if(!keepAlert) cmsPaymentAlert('paymentRefundAlert','', '');
}

function cmsRenderPaymentRefunds(){
  var tbody = document.getElementById('paymentRefundRows');
  if(!tbody) return;
  tbody.innerHTML = cmsPaymentRefunds.length ? cmsPaymentRefunds.map(function(item){
    return '<tr><td>' + cmsSafeText(item.id) + '</td><td>' + cmsSafeText(item.originalTx) + '</td><td>' + cmsSafeText(item.user) + '</td><td>' + cmsPaymentNumber(item.point,'Point') + '</td><td>' + cmsSafeText(item.txTime) + '</td><td>' + cmsSafeText(item.refundTime) + '</td><td>' + cmsSafeText(item.reason) + '</td></tr>';
  }).join('') : '<tr><td colspan="7">Chưa có yêu cầu hoàn Point.</td></tr>';
}

function cmsSearchPaymentTransactions(){
  var user = cmsGetValue('txFilterUser').toLowerCase();
  var myvtc = cmsGetValue('txFilterMyvtc').toLowerCase();
  var vtcpay = cmsGetValue('txFilterVtcpay').toLowerCase();
  var service = cmsGetValue('txFilterService').toLowerCase();
  var partner = cmsGetValue('txFilterPartner').toLowerCase();
  var type = cmsGetValue('txFilterType');
  var status = cmsGetValue('txFilterStatus');
  var from = cmsGetValue('txFilterFrom');
  var to = cmsGetValue('txFilterTo');

  cmsPaymentTransactionFiltered = cmsPaymentTransactions.filter(function(tx){
    var createdKey = cmsPaymentDateKey(tx.createdAt);
    if(user && tx.user.toLowerCase().indexOf(user) < 0) return false;
    if(myvtc && tx.id.toLowerCase().indexOf(myvtc) < 0) return false;
    if(vtcpay && String(tx.vtcPayId || '').toLowerCase().indexOf(vtcpay) < 0) return false;
    if(service && String(tx.serviceId || '').toLowerCase().indexOf(service) < 0) return false;
    if(partner && String(tx.partnerRef || '').toLowerCase().indexOf(partner) < 0) return false;
    if(type && tx.type !== type) return false;
    if(status && tx.status !== status) return false;
    if(from && createdKey < from) return false;
    if(to && createdKey > to) return false;
    return true;
  }).sort(function(a,b){return cmsPaymentDateValue(b.createdAt) - cmsPaymentDateValue(a.createdAt);});

  cmsPaymentTransactionPage = 1;
  cmsRenderPaymentTransactions();
}

function cmsPaymentDateKey(value){
  var m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(value || ''));
  if(!m) return '';
  return m[3] + '-' + m[2] + '-' + m[1];
}

function cmsPaymentDateValue(value){
  var m = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(String(value || ''));
  if(!m) return 0;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]), Number(m[4] || 0), Number(m[5] || 0)).getTime();
}

function cmsRenderPaymentTransactions(){
  var tbody = document.getElementById('paymentTransactionRows');
  if(!tbody) return;
  var count = document.getElementById('paymentTransactionCount');
  var pageNode = document.getElementById('paymentTransactionPage');
  var total = cmsPaymentTransactionFiltered.length;
  var totalPage = Math.max(1,Math.ceil(total / cmsPaymentPageSize));
  cmsPaymentTransactionPage = Math.min(Math.max(1,cmsPaymentTransactionPage),totalPage);
  var start = (cmsPaymentTransactionPage - 1) * cmsPaymentPageSize;
  var rows = cmsPaymentTransactionFiltered.slice(start,start + cmsPaymentPageSize);

  tbody.innerHTML = rows.length ? rows.map(function(tx){
    return '<tr>' +
      '<td>' + cmsSafeText(tx.id) + '</td>' +
      '<td>' + cmsSafeText(tx.type) + '</td>' +
      '<td>' + cmsSafeText(tx.user) + '</td>' +
      '<td>' + cmsPaymentStatusHtml(tx.status) + '</td>' +
      '<td>' + cmsSafeText(tx.createdAt) + '</td>' +
      '<td>' + cmsSafeText(tx.successAt || '-') + '</td>' +
      '<td>' + cmsPaymentNumber(tx.money,'VNĐ') + '</td>' +
      '<td>' + cmsPaymentNumber(tx.point,'Point') + '</td>' +
      '<td>' + cmsSafeText(tx.method) + '</td>' +
      '<td>' + cmsSafeText(tx.vtcPayId || '-') + '</td>' +
      '<td>' + cmsSafeText(tx.serviceId || '-') + '</td>' +
      '<td>' + cmsSafeText(tx.partnerRef || '-') + '</td>' +
      '<td>' + cmsSafeText(tx.updatedBy) + '</td>' +
      '<td class="ops"><button class="icon-square blue" onclick="cmsShowTransactionDetail(\'' + tx.id + '\')"><i class="fa fa-eye"></i></button></td>' +
    '</tr>';
  }).join('') : '<tr><td colspan="14">Không có giao dịch phù hợp.</td></tr>';

  if(count) count.textContent = 'Hiển thị ' + rows.length + ' / ' + total + ' giao dịch';
  if(pageNode) pageNode.textContent = cmsPaymentTransactionPage + ' / ' + totalPage;
}

function cmsSetTransactionPage(page){
  cmsPaymentTransactionPage = page;
  cmsRenderPaymentTransactions();
}

function cmsResetTransactionFilters(){
  ['txFilterUser','txFilterMyvtc','txFilterVtcpay','txFilterService','txFilterPartner','txFilterType','txFilterStatus','txFilterFrom','txFilterTo'].forEach(function(id){cmsSetValue(id,'');});
  var detail = document.getElementById('transactionDetail');
  if(detail) detail.classList.add('hidden');
  cmsSearchPaymentTransactions();
}

function cmsShowTransactionDetail(id){
  var tx = cmsFindTransaction(id);
  var node = document.getElementById('transactionDetail');
  if(!tx || !node) return;
  node.classList.remove('hidden');
  node.innerHTML = '<div class="payment-detail-title">Chi tiết giao dịch ' + cmsSafeText(tx.id) + '</div>' +
    '<div class="payment-detail-grid">' +
    '<b>Loại giao dịch</b><span>' + cmsSafeText(tx.type) + '</span>' +
    '<b>Người dùng</b><span>' + cmsSafeText(tx.user) + '</span>' +
    '<b>Trạng thái</b><span>' + cmsSafeText(tx.status) + '</span>' +
    '<b>Thời gian khởi tạo</b><span>' + cmsSafeText(tx.createdAt) + '</span>' +
    '<b>Thời gian thành công</b><span>' + cmsSafeText(tx.successAt || '-') + '</span>' +
    '<b>Số tiền</b><span>' + cmsPaymentNumber(tx.money,'VNĐ') + '</span>' +
    '<b>Số Point</b><span>' + cmsPaymentNumber(tx.point,'Point') + '</span>' +
    '<b>Phương thức thanh toán</b><span>' + cmsSafeText(tx.method) + '</span>' +
    '<b>Mã voucher</b><span>' + cmsSafeText(tx.voucher || '-') + '</span>' +
    '<b>Số tiền giảm trừ</b><span>' + cmsPaymentNumber(tx.moneyDiscount,'VNĐ') + '</span>' +
    '<b>Số Point giảm trừ</b><span>' + cmsPaymentNumber(tx.pointDiscount,'Point') + '</span>' +
    '<b>Mã giao dịch VTC Pay</b><span>' + cmsSafeText(tx.vtcPayId || '-') + '</span>' +
    '<b>Mã dịch vụ</b><span>' + cmsSafeText(tx.serviceId || '-') + '</span>' +
    '<b>Mã đối tác</b><span>' + cmsSafeText(tx.partnerRef || '-') + '</span>' +
    '<b>Mô tả</b><span>' + cmsSafeText(tx.description || '-') + '</span>' +
    '<b>Người cập nhật</b><span>' + cmsSafeText(tx.updatedBy) + '</span>' +
    '</div>';
}

function cmsExportPaymentTransactions(){
  alert('Đã mô phỏng xuất ' + cmsPaymentTransactionFiltered.length + ' giao dịch theo bộ lọc hiện tại.');
}

function cmsCreatePointAdjustment(type){
  if(type === 'add'){
    var phone = cmsGetValue('addPointUser');
    var acc = cmsFindByPhone(phone);
    var event = cmsGetValue('addPointEvent');
    var amount = Number(cmsGetValue('addPointAmount'));
    var expired = cmsGetValue('addPointExpired');
    var note = cmsGetValue('addPointNote');
    if(!acc || !event || !amount || amount <= 0){
      cmsPaymentAlert('paymentAddPointAlert','error','Vui lòng nhập người dùng hợp lệ, loại sự kiện và số Point nguyên dương.');
      return;
    }
    acc.pointBalance = Number(acc.pointBalance || 0) + amount;
    var id = 'TX-ADD-' + String(cmsPaymentAdjustments.length + 1).padStart(4,'0');
    var time = cmsNow();
    cmsPaymentAdjustments.unshift({id:id,type:'Cộng bù',user:phone,point:amount,originalTx:'',reason:event,note:note,updatedBy:'Admin',time:time,expired:expired});
    cmsPaymentTransactions.unshift({id:id,type:'Cộng bù',user:phone,status:'Thành công',createdAt:time,successAt:time,money:0,point:amount,method:'Point',voucher:'',moneyDiscount:0,pointDiscount:0,vtcPayId:'',serviceId:'MYVTC',partnerRef:'',description:event + (expired ? '. Hạn dùng: ' + expired : ''),updatedBy:'Admin'});
    cmsPaymentAlert('paymentAddPointAlert','success','Đã cộng ' + cmsPaymentNumber(amount,'Point') + ' cho ' + phone + '.');
    cmsResetAdjustmentForm('add',true);
  } else {
    var revokePhone = cmsGetValue('revokePointUser');
    var revokeAcc = cmsFindByPhone(revokePhone);
    var originalTx = cmsGetValue('revokeOriginalTx');
    var revokeAmount = Number(cmsGetValue('revokePointAmount'));
    var reason = cmsGetValue('revokeReason');
    var revokeNote = cmsGetValue('revokePointNote');
    if(!revokeAcc || !originalTx || !revokeAmount || revokeAmount <= 0){
      cmsPaymentAlert('paymentRevokePointAlert','error','Vui lòng nhập người dùng hợp lệ, mã giao dịch gốc và số Point nguyên dương.');
      return;
    }
    if(!cmsFindTransaction(originalTx)){
      cmsPaymentAlert('paymentRevokePointAlert','error','Không tìm thấy mã giao dịch gốc trong lịch sử giao dịch.');
      return;
    }
    if(Number(revokeAcc.pointBalance || 0) < revokeAmount){
      cmsPaymentAlert('paymentRevokePointAlert','error','Số dư Point không đủ để thu hồi.');
      return;
    }
    revokeAcc.pointBalance = Number(revokeAcc.pointBalance || 0) - revokeAmount;
    var revokeId = 'TX-REVOKE-' + String(cmsPaymentAdjustments.length + 1).padStart(4,'0');
    var revokeTime = cmsNow();
    cmsPaymentAdjustments.unshift({id:revokeId,type:'Thu hồi',user:revokePhone,point:revokeAmount,originalTx:originalTx,reason:reason,note:revokeNote,updatedBy:'Admin',time:revokeTime});
    cmsPaymentTransactions.unshift({id:revokeId,type:'Thu hồi',user:revokePhone,status:'Thành công',createdAt:revokeTime,successAt:revokeTime,money:0,point:revokeAmount,method:'Point',voucher:'',moneyDiscount:0,pointDiscount:0,vtcPayId:'',serviceId:'MYVTC',partnerRef:'',description:reason + '. Giao dịch gốc: ' + originalTx,updatedBy:'Admin'});
    cmsPaymentAlert('paymentRevokePointAlert','success','Đã thu hồi ' + cmsPaymentNumber(revokeAmount,'Point') + ' từ ' + revokePhone + '.');
    cmsResetAdjustmentForm('revoke',true);
  }

  cmsRenderPaymentAdjustments();
  cmsSearchPaymentTransactions();
}

function cmsResetAdjustmentForm(type,keepAlert){
  if(type === 'add'){
    ['addPointUser','addPointAmount','addPointExpired','addPointNote'].forEach(function(id){cmsSetValue(id,'');});
    cmsSetValue('addPointEvent','Khiếu nại hợp lệ');
    if(!keepAlert) cmsPaymentAlert('paymentAddPointAlert','', '');
  } else {
    ['revokePointUser','revokeOriginalTx','revokePointAmount','revokePointNote'].forEach(function(id){cmsSetValue(id,'');});
    cmsSetValue('revokeReason','Vi phạm chính sách');
    if(!keepAlert) cmsPaymentAlert('paymentRevokePointAlert','', '');
  }
}

function cmsRenderPaymentAdjustments(){
  var tbody = document.getElementById('paymentAdjustmentRows');
  if(!tbody) return;
  tbody.innerHTML = cmsPaymentAdjustments.length ? cmsPaymentAdjustments.map(function(item){
    var cls = item.type === 'Cộng bù' ? 'payment-positive' : 'payment-negative';
    return '<tr><td>' + cmsSafeText(item.id) + '</td><td>' + cmsSafeText(item.type) + '</td><td>' + cmsSafeText(item.user) + '</td><td class="' + cls + '">' + cmsPaymentNumber(item.point,'Point') + '</td><td>' + cmsSafeText(item.originalTx || '-') + '</td><td>' + cmsSafeText(item.reason) + '</td><td>' + cmsSafeText(item.note || '-') + '</td><td>' + cmsSafeText(item.updatedBy) + '</td><td>' + cmsSafeText(item.time) + '</td></tr>';
  }).join('') : '<tr><td colspan="9">Chưa có giao dịch cộng bù hoặc thu hồi.</td></tr>';
}

function cmsBindPaymentEnter(){
  ['refundOriginalTx','refundPhone'].forEach(function(id){
    var el = document.getElementById(id);
    if(el){
      el.onkeydown = function(e){
        if(e.key === 'Enter'){
          e.preventDefault();
          cmsCheckRefundTransaction();
        }
      };
    }
  });

  ['txFilterUser','txFilterMyvtc','txFilterVtcpay','txFilterService','txFilterPartner'].forEach(function(id){
    var node = document.getElementById(id);
    if(node){
      node.onkeydown = function(e){
        if(e.key === 'Enter'){
          e.preventDefault();
          cmsSearchPaymentTransactions();
        }
      };
    }
  });
}

function cmsInitPaymentAdmin(){
  cmsRenderPaymentRates();
  cmsRenderPaymentRateLogs();
  cmsRenderPaymentLimits();
  cmsRenderPaymentRefunds();
  cmsSearchPaymentTransactions();
  cmsRenderPaymentAdjustments();
  cmsBindPaymentEnter();
}
function cmsGetLoyaltyScreenTitle(screenId){
  var screen = document.getElementById('screen-' + screenId);
  var title = screen ? screen.querySelector('.cms-screen-title') : null;
  return title ? cmsCleanMenuText(title.textContent) : 'Loyalty > Cập nhật cấu hình';
}

function cmsOpenLoyaltyConfigForm(mode, sourceScreenId){
  cmsSetValue('loyaltyConfigSourceScreen',sourceScreenId || '');
  cmsSetValue('loyaltyConfigMode',mode || 'add');

  var title = cmsGetLoyaltyScreenTitle(sourceScreenId);
  var formTitle = document.getElementById('loyaltyConfigFormTitle');
  if(formTitle) formTitle.textContent = mode === 'edit' ? 'Chỉnh sửa cấu hình' : 'Thêm mới cấu hình';

  var screenTitle = document.querySelector('#screen-loyalty-config-form .cms-screen-title');
  if(screenTitle) screenTitle.innerHTML = '<i class="fa fa-edit"></i> ' + cmsSafeText(title) + ' > ' + (mode === 'edit' ? 'Chỉnh sửa' : 'Thêm mới');

  cmsResetLoyaltyConfigForm(true);

  if(mode === 'edit'){
    cmsSetValue('loyaltyConfigCode','AUTO-DEMO-001');
    cmsSetValue('loyaltyConfigName','Cấu hình demo');
    cmsSetValue('loyaltyConfigValue','Giá trị demo');
    cmsSetValue('loyaltyConfigStatus','Hoạt động');
  }

  showScreen('loyalty-config-form');
}

function cmsResetLoyaltyConfigForm(keepSource){
  if(!keepSource){
    cmsSetValue('loyaltyConfigSourceScreen','');
    cmsSetValue('loyaltyConfigMode','add');
  }
  cmsSetValue('loyaltyConfigCode','');
  cmsSetValue('loyaltyConfigName','');
  cmsSetValue('loyaltyConfigType','Tỉ lệ EXP');
  cmsSetValue('loyaltyConfigStatus','Hoạt động');
  cmsSetValue('loyaltyConfigValue','');
  cmsSetValue('loyaltyConfigStart','');
  cmsSetValue('loyaltyConfigNote','');
}

function cmsBackToLoyaltyConfigList(){
  var source = cmsGetValue('loyaltyConfigSourceScreen') || 'loyalty-texp-rate';
  showScreen(source);
}

function cmsSaveLoyaltyConfigForm(){
  var name = cmsGetValue('loyaltyConfigName');
  var value = cmsGetValue('loyaltyConfigValue');
  if(!name || !value){
    alert('Vui lòng nhập Tên cấu hình và Giá trị cấu hình.');
    return;
  }
  alert('Đã mô phỏng lưu cấu hình Loyalty.');
  cmsBackToLoyaltyConfigList();
}

function cmsBindLoyaltyConfigFormNavigation(){
  document.addEventListener('click',function(e){
    var btn = e.target.closest('button');
    if(!btn) return;

    var screen = btn.closest('.screen');
    if(!screen || !screen.id) return;
    if(screen.id.indexOf('screen-loyalty-') !== 0) return;
    if(screen.id === 'screen-loyalty-offer-events') return;
    if(screen.id === 'screen-loyalty-offer-event-form') return;
    if(screen.id === 'screen-loyalty-config-form') return;

    var isAdd = /Thêm mới/.test(btn.textContent || '');
    var isEdit = btn.classList.contains('orange') || !!btn.querySelector('.fa-edit');
    if(!isAdd && !isEdit) return;

    e.preventDefault();
    e.stopPropagation();
    cmsOpenLoyaltyConfigForm(isEdit ? 'edit' : 'add', screen.id.replace('screen-',''));
  },true);
}
document.addEventListener('DOMContentLoaded',function(){
  cmsInitPaymentAdmin();
});
