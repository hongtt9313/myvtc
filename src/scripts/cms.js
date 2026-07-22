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
  var raw=String(value || '').trim();
  var match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(raw);
  if(!match){var iso=/^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);if(iso)match=[iso[0],iso[3],iso[2],iso[1]];}
  if(!match) return null;
  var day = Number(match[1]);
  var month = Number(match[2]);
  var year = Number(match[3]);
  var date = new Date(year, month - 1, day);
  if(date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  date.setHours(0,0,0,0);
  return date;
}


function cmsDateToInput(value){var m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(value||''));return m?m[3]+'-'+m[2]+'-'+m[1]:String(value||'')}
function cmsDateToVn(value){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value||''));return m?m[3]+'/'+m[2]+'/'+m[1]:String(value||'')}

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
    var baseDate=['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20'];
    function fill20(list,builder){while(list.length<20) list.push(builder(list.length));}
    fill20(acc.sessions,function(i){return {platform:i%2?'Mobile App':'Web',device:i%2?'Android '+(10+i):'Chrome Windows',os:i%2?'Android 15':'Windows 11',version:'2.'+(i%5)+'.'+i,ip:'117.103.228.'+(50+i),loginAt:(baseDate[i]||'20')+'/07/2026 '+String(8+i%12).padStart(2,'0')+':15:00'};});
    fill20(acc.pointLots,function(i){return {amount:10000+(i*5000),receivedAt:(baseDate[i]||'20')+'/06/2026',expiredAt:(baseDate[i]||'20')+'/12/2026',status:i%4===0?'Sắp hết hạn':'Còn hiệu lực'};});
    fill20(acc.loyalty.rankHistory,function(i){return {time:(baseDate[i]||'20')+'/06/2026 09:00:00',type:i%3===0?'Nâng hạng':(i%3===1?'Duy trì hạng':'Cập nhật hạng'),reason:'Cập nhật theo Cycle EXP kỳ '+(i+1)};});
    fill20(acc.vouchers,function(i){return {name:'Voucher MyVTC '+String(i+1).padStart(2,'0'),code:'MYVTC-'+acc.username.toUpperCase()+'-'+String(i+1).padStart(2,'0'),status:i%3===0?'Đã dùng':(i%4===0?'Hết hạn':'Khả dụng'),issuedAt:(baseDate[i]||'20')+'/06/2026',usedAt:i%3===0?(baseDate[i]||'20')+'/07/2026':'',expiredAt:(baseDate[i]||'20')+'/12/2026'};});

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

  var oldTabs = document.getElementById('accountLookupTabs');
  if(oldTabs) oldTabs.remove();
  result.classList.remove('lookup-tabs-ready');

  var cards = Array.prototype.slice.call(result.querySelectorAll('.account-card'));
  if(!cards.length) return;

  var layout = result.querySelector('.account-lookup-columns');
  if(!layout){
    layout = document.createElement('div');
    layout.className = 'account-lookup-columns';
    layout.innerHTML = '<div class="account-lookup-column lookup-column-left"></div><div class="account-lookup-column lookup-column-right"></div>';
    result.appendChild(layout);
  }

  var left = layout.querySelector('.lookup-column-left');
  var right = layout.querySelector('.lookup-column-right');
  var leftIndexes = [0,1,4];
  cards.forEach(function(card,index){
    card.classList.add('active');
    card.dataset.lookupSection = String(index + 1);
    (leftIndexes.indexOf(index) >= 0 ? left : right).appendChild(card);

    var title = card.querySelector('.account-card-title');
    var body = card.querySelector('.account-card-body');
    if(title && body && !title.querySelector('.account-collapse-btn')){
      var toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'account-collapse-btn';
      toggle.title = 'Thu hẹp';
      toggle.setAttribute('aria-label','Thu hẹp');
      toggle.innerHTML = '<i class="fa fa-chevron-up"></i>';
      toggle.onclick = function(e){
        e.stopPropagation();
        var collapsed = card.classList.toggle('collapsed');
        toggle.title = collapsed ? 'Mở rộng' : 'Thu hẹp';
        toggle.setAttribute('aria-label',collapsed ? 'Mở rộng' : 'Thu hẹp');
        toggle.innerHTML = '<i class="fa ' + (collapsed ? 'fa-chevron-down' : 'fa-chevron-up') + '"></i>';
      };
      title.appendChild(toggle);
    }
  });

  Array.prototype.slice.call(result.querySelectorAll('.account-grid')).forEach(function(grid){
    if(!grid.children.length) grid.remove();
  });
}

function cmsShowLookupTab(index){
  var result = document.getElementById('accountLookupResult');
  if(!result) return;
  var card = result.querySelector('[data-lookup-section="' + (index + 1) + '"]');
  if(card) card.scrollIntoView({behavior:'smooth',block:'start'});
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
  cmsLookupTableState[tbodyId] = {title:title,items:(items || []).slice(),columns:columns,page:page || 1,pageSize:pageSize || 10,formatter:formatter};
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
        var value = col === '__stt' ? (start + rows.indexOf(item) + 1) : (item[col] || '');
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
  var channels=['Google','Apple','Facebook'];
  var items=channels.map(function(channel){return cmsGetSocial(acc,channel);});
  function statusIcon(item){var linked=item.status==='Đã kết nối';return '<span class="social-status '+(linked?'linked':'unlinked')+'"><i class="fa '+(linked?'fa-check-circle':'fa-times-circle')+'"></i> '+(linked?'Đã kết nối':'Chưa kết nối')+'</span>';}
  node.innerHTML = '<tr><th>Trạng thái</th>'+items.map(function(x){return '<td>'+statusIcon(x)+'</td>';}).join('')+'</tr>'+
    '<tr><th>Email</th>'+items.map(function(x){return '<td>'+cmsSafeText(x.account||'-')+'</td>';}).join('')+'</tr>'+
    '<tr><th>ProviderID</th>'+items.map(function(x){return '<td>'+cmsSafeText(x.providerId||'-')+'</td>';}).join('')+'</tr>'+
    '<tr><th>Ngày liên kết</th>'+items.map(function(x){return '<td>'+cmsSafeText(x.linkedAt||'-')+'</td>';}).join('')+'</tr>';
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
    if(key === 'cycleExpSummary') value = acc.loyalty.cycleExp.toLocaleString('vi-VN') + '/' + (acc.loyalty.targetExp || (acc.loyalty.cycleExp + acc.loyalty.expMissing)).toLocaleString('vi-VN') + ' EXP - Hạng tiếp theo (' + (acc.loyalty.nextRank || 'Bạch Kim') + ')';
    if(key === 'cycleRange') value = 'Từ ngày ' + acc.loyalty.cycleStart + ' đến ngày ' + acc.loyalty.cycleEnd;
    if(key === 'cycleStart') value = acc.loyalty.cycleStart;
    if(key === 'cycleEnd') value = acc.loyalty.cycleEnd;
    if(key === 'progress') value = acc.loyalty.progress + '%';
    if(key === 'expMissing') value = acc.loyalty.expMissing.toLocaleString('vi-VN') + ' EXP';
    el.textContent = value || '';
  });

  cmsRenderLookupSocial(acc);
  cmsRenderSecurityMethods(acc);

  var voucherHead = document.querySelector('#lookupVouchers').closest('table').querySelector('thead tr');
  voucherHead.innerHTML = '<th>STT</th><th>Tên voucher</th><th>Mã code</th><th>Trạng thái</th><th>Ngày phát hành</th><th>Ngày sử dụng</th><th>Ngày hết hạn</th>';

  cmsRenderPagedTable('lookupSessions','Danh sách phiên đăng nhập',acc.sessions,['__stt','platform','device','os','version','ip','loginAt'],1,10,function(col,value){return cmsSafeText(value);});
  cmsRenderPagedTable('lookupPartners','Danh sách đối tác / dịch vụ đã cấp quyền',acc.partners,['__stt','name','scope','grantedAt','partnerUser','status','cancelAt','action'],1,5,function(col,value,item){
    if(col === 'action'){
      return item.status === 'Đang hoạt động' ? '<button class="account-mini-btn danger" type="button" onclick="cmsCancelPartner(\'' + cmsSafeText(item.name) + '\')">Hủy</button>' : '-';
    }
    return cmsSafeText(value || '-');
  });
  cmsRenderPagedTable('lookupPointLots','Danh sách lô Points',acc.pointLots,['__stt','amount','receivedAt','expiredAt','status'],1,10,function(col,value){return col === 'amount' ? cmsMoney(value) : cmsSafeText(value);});
  cmsRenderPagedTable('lookupRankHistory','Lịch sử thay đổi hạng',acc.loyalty.rankHistory,['__stt','time','type','reason'],1,10,function(col,value){return cmsSafeText(value);});
  cmsRenderPagedTable('lookupVouchers','Danh sách voucher trong kho đồ',acc.vouchers,['__stt','name','code','status','issuedAt','usedAt','expiredAt'],1,10,function(col,value){return cmsSafeText(value || '-');});

  var progressBar=document.getElementById('lookupProgressBar'); if(progressBar) progressBar.style.width = acc.loyalty.progress + '%';
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
    cmsOpenProductModal('Dữ liệu không hợp lệ','Trạng thái tài khoản không hợp lệ.');
    return;
  }
  if(nextStatus === cmsCurrentLookupAccount.status) return;
  var oldStatus = cmsCurrentLookupAccount.status;
  cmsConfirmAction('Xác nhận cập nhật trạng thái','Bạn có chắc chắn muốn chuyển trạng thái tài khoản từ <b>' + oldStatus + '</b> sang <b>' + nextStatus + '</b>?','Cập nhật',function(){
    cmsCurrentLookupAccount.status = nextStatus;
    cmsCurrentLookupAccount.updatedAt = cmsNow();
    cmsLookupAccount();
  });
  var select = document.getElementById('lookupStatusSelect');
  if(select) select.value = oldStatus;
}

function cmsCancelPartner(partnerName){
  if(!cmsCurrentLookupAccount) return;
  var partner = (cmsCurrentLookupAccount.partners || []).find(function(item){return item.name === partnerName;});
  if(!partner || partner.status !== 'Đang hoạt động') return;
  cmsConfirmAction('Xác nhận hủy quyền','Bạn có chắc chắn muốn hủy quyền dịch vụ <b>' + cmsSafeText(partner.name) + '</b>?','Hủy quyền',function(){
    partner.status = 'Đã hủy';
    partner.cancelAt = cmsNow();
    cmsCurrentLookupAccount.updatedAt = cmsNow();
    cmsLookupAccount();
  },'red');
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
  var channels = ['Google','Apple','Facebook'];
  var removeChannels = [];
  for(var i = 0; i < channels.length; i++){
    var channel = channels[i];
    if(!values['remove' + channel]) continue;
    var linked = cmsCurrentUpdateAccount.socialLinks.some(function(item){
      return item.channel === channel && item.status === 'Đã kết nối';
    });
    if(!linked){
      cmsOpenProductModal('Không thể xóa liên kết','Liên kết ' + channel + ' chưa ở trạng thái Đã kết nối.');
      return;
    }
    removeChannels.push(channel);
  }

  var messages = [];
  if(values.status !== cmsCurrentUpdateAccount.status) messages.push('Cập nhật trạng thái tài khoản sang <b>' + values.status + '</b>');
  if(values.twoFa === 'Tắt' && cmsCurrentUpdateAccount.twoFa !== 'Tắt') messages.push('Tắt bảo mật 2 bước');
  if(removeChannels.length) messages.push('Xóa liên kết ' + removeChannels.join(', '));
  if(!messages.length) messages.push('Lưu các thông tin tài khoản đã chỉnh sửa');

  cmsConfirmAction('Xác nhận cập nhật tài khoản',messages.map(function(item){return '• ' + item;}).join('<br>'),'Cập nhật',function(){
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
          if(item.channel === channel){ item.status='Đã hủy'; item.account=''; item.linkedAt=''; item.providerId=''; }
        });
      }
    });
    cmsPushAudit(cmsAuditLogs,'hongtt','Cập nhật thông tin tài khoản',changes);
    cmsSetAlert('accountUpdateAlert','success','Lưu cập nhật thành công.');
    cmsLoadAccountForUpdate();
  });
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
    dob:cmsDateToInput(acc.dob || ''),
    gender:acc.gender || '',
    address:acc.address || '',
    issuedDate:cmsDateToInput(acc.issuedDate || ''),
    expiredDate:cmsDateToInput(acc.expiredDate || ''),
    images:''
  };

  cmsSetAlert('identityUpdateAlert','success','Đã tìm thấy tài khoản theo Username. Bạn có thể cập nhật thông tin định danh.');
  wrap.classList.remove('hidden');


  document.getElementById('idEkycVerified').checked = (acc.ekycStatus || 'Chưa xác thực') === 'Đã xác thực';
  document.getElementById('idCitizenId').value = acc.citizenId || '';
  document.getElementById('idDob').value = cmsDateToInput(acc.dob || '');
  document.getElementById('idGender').value = acc.gender || '';
  document.getElementById('idAddress').value = acc.address || '';
  document.getElementById('idIssuedDate').value = cmsDateToInput(acc.issuedDate || '');
  document.getElementById('idExpiredDate').value = cmsDateToInput(acc.expiredDate || '');
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
  cmsCurrentIdentityAccount.dob = cmsDateToVn(values.dob);
  cmsCurrentIdentityAccount.gender = values.gender;
  cmsCurrentIdentityAccount.address = values.address;
  cmsCurrentIdentityAccount.issuedDate = cmsDateToVn(values.issuedDate);
  cmsCurrentIdentityAccount.expiredDate = cmsDateToVn(values.expiredDate);
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

function cmsConfirmAction(title, message, confirmText, onConfirm, confirmClass){
  cmsOpenProductModal(title, message, confirmText || 'Xác nhận', onConfirm, confirmClass || 'blue');
}

function cmsHandleDemoButton(btn){
  if(!btn || btn.disabled) return;
  var row = btn.closest('tr');
  var text = (btn.textContent || '').trim();
  var icon = btn.querySelector('i');
  var iconClass = icon ? icon.className : '';

  if(iconClass.indexOf('fa-trash') >= 0){
    cmsConfirmAction('Xác nhận xóa','Bạn có chắc chắn muốn xóa bản ghi này?','Xóa',function(){ if(row) row.remove(); },'red');
    return;
  }

  if(iconClass.indexOf('fa-ban') >= 0 || iconClass.indexOf('fa-check-circle') >= 0 || iconClass.indexOf('fa-check') >= 0){
    var statusCell = row ? row.querySelectorAll('td')[row.querySelectorAll('td').length - 2] : null;
    var current = statusCell ? statusCell.textContent.trim() : 'Hoạt động';
    var next = current === 'Hoạt động' ? 'Không hoạt động' : 'Hoạt động';
    cmsConfirmAction('Xác nhận trạng thái','Bạn có chắc chắn muốn chuyển trạng thái sang <b>' + next + '</b>?','Xác nhận',function(){ if(statusCell) statusCell.textContent = next; });
    return;
  }

  if(iconClass.indexOf('fa-edit') >= 0 || text.indexOf('Lưu') >= 0){
    cmsConfirmAction('Xác nhận cập nhật','Bạn có chắc chắn muốn lưu thông tin cập nhật?','Cập nhật',function(){});
    return;
  }

  if(iconClass.indexOf('fa-plus') >= 0 || text.indexOf('Thêm') >= 0){
    cmsConfirmAction('Xác nhận thêm mới','Bạn có chắc chắn muốn thêm bản ghi mới?','Thêm mới',function(){
      var table = btn.closest('.cms-content') ? btn.closest('.cms-content').querySelector('tbody') : null;
      if(table){
        var colCount = table.closest('table').querySelectorAll('thead th').length || 6;
        var tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="' + colCount + '">Bản ghi mới</td>';
        table.appendChild(tr);
      }
    });
    return;
  }

  if(iconClass.indexOf('fa-search') >= 0 || text.indexOf('Tra cứu') >= 0) return;

  if(iconClass.indexOf('fa-download') >= 0 || text.indexOf('Xuất') >= 0){
    cmsConfirmAction('Xác nhận xuất dữ liệu','Bạn có chắc chắn muốn xuất dữ liệu theo điều kiện hiện tại?','Xuất dữ liệu',function(){});
    return;
  }

  if(text.indexOf('Ẩn/hiện cột') >= 0){
    var content = btn.closest('.cms-content');
    if(content){
      content.querySelectorAll('table th:last-child, table td:last-child').forEach(function(cell){ cell.classList.toggle('hidden'); });
    }
    return;
  }

  if(text === 'Trước' || text === 'Tiếp' || /^\d+$/.test(text)) return;
}

function cmsBindDemoButtons(){
  document.querySelectorAll('button').forEach(function(btn){
    if(!btn.getAttribute('type')) btn.setAttribute('type','button');
  });

  document.addEventListener('click',function(e){
    var btn = e.target.closest('button');
    if(!btn) return;
    if(btn.hasAttribute('onclick') || btn.dataset.cmsHandled === 'true') return;
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
  cmsAccCloseMultiDropdowns();
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


var cmsLoyaltyEvents = [
  {code:'EVT_DAILY_LOGIN',name:'Đăng nhập hàng ngày',desc:'Người dùng đăng nhập vào hệ thống mỗi ngày.',status:'Đang hoạt động'},
  {code:'EVT_LINK_GOOGLE',name:'Liên kết Google',desc:'Người dùng liên kết tài khoản Google thành công.',status:'Đang hoạt động'},
  {code:'EVT_LINK_APPLE',name:'Liên kết Apple',desc:'Người dùng liên kết tài khoản Apple thành công.',status:'Đang hoạt động'},
  {code:'EVT_VERIFY_EMAIL',name:'Xác minh email',desc:'Người dùng xác minh địa chỉ email thành công.',status:'Đang hoạt động'},
  {code:'EVT_VERIFY_EKYC',name:'Xác minh eKYC',desc:'Người dùng hoàn thành xác minh danh tính eKYC.',status:'Đang hoạt động'},
  {code:'EVT_LINK_BANK',name:'Liên kết tài khoản ngân hàng',desc:'Người dùng liên kết tài khoản ngân hàng thành công.',status:'Đang hoạt động'},
  {code:'EVT_ENABLE_PUSH',name:'Bật thông báo (Push Notification)',desc:'Người dùng bật quyền nhận thông báo trên thiết bị.',status:'Đang hoạt động'},
  {code:'EVT_VIEW_CONTENT',name:'Xem nội dung / bài viết',desc:'Người dùng xem nội dung hoặc bài viết đủ điều kiện.',status:'Đang hoạt động'},
  {code:'EVT_BIRTHDAY',name:'Sinh nhật',desc:'Hệ thống ghi nhận sự kiện vào ngày sinh nhật của người dùng.',status:'Đang hoạt động'},
  {code:'EVT_ACCOUNT_ANNIVERSARY',name:'Kỷ niệm ngày mở tài khoản',desc:'Hệ thống ghi nhận ngày kỷ niệm mở tài khoản.',status:'Đang hoạt động'},
  {code:'EVT_REFERRER',name:'Giới thiệu bạn bè',desc:'Người dùng giới thiệu bạn bè đăng ký thành công.',status:'Đang hoạt động'},
  {code:'EVT_REFERRED',name:'Được bạn bè giới thiệu',desc:'Người dùng đăng ký bằng mã giới thiệu hợp lệ.',status:'Đang hoạt động'},
  {code:'EVT_LOGIN_STREAK_7',name:'Chuỗi đăng nhập 7 ngày',desc:'Người dùng đăng nhập liên tiếp trong 7 ngày.',status:'Đang hoạt động'},
  {code:'EVT_LOGIN_STREAK_30',name:'Chuỗi đăng nhập 30 ngày',desc:'Người dùng đăng nhập liên tiếp trong 30 ngày.',status:'Tạm dừng'},
  {code:'EVT_STORE',name:'Cửa hàng',desc:'Sự kiện phát sinh từ hoạt động tại Cửa hàng.',status:'Đang hoạt động'}
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

function cmsSetLoyaltyEventAlert(type,message){
  cmsSetAlert('loyaltyEventAlert',type,message);
}

function cmsSetLoyaltyEventFormMode(isEdit){
  var breadcrumb = document.getElementById('loyaltyEventBreadcrumb');
  var title = document.getElementById('loyaltyEventFormTitle');
  var label = isEdit ? 'Cập nhật sự kiện' : 'Thêm mới sự kiện';
  var codeRow = document.getElementById('loyaltyEventCodeRow');
  if(breadcrumb) breadcrumb.innerHTML = '<i class="fa fa-edit"></i> Loyalty &gt; Quản trị sự kiện ưu đãi';
  if(title) title.textContent = label;
  if(codeRow) codeRow.classList.toggle('hidden', !isEdit);
}

function cmsRenderLoyaltyEvents(){
  var tbody = document.getElementById('loyaltyEventRows');
  if(!tbody) return;
  var totalPage = Math.max(1,Math.ceil(cmsLoyaltyEventFiltered.length / cmsLoyaltyEventPageSize));
  cmsLoyaltyEventPage = Math.min(Math.max(1,cmsLoyaltyEventPage),totalPage);
  var start = (cmsLoyaltyEventPage - 1) * cmsLoyaltyEventPageSize;
  var rows = cmsLoyaltyEventFiltered.slice(start,start + cmsLoyaltyEventPageSize);
  tbody.innerHTML = rows.length ? rows.map(function(item,index){
    var stt = start + index + 1;
    return '<tr><td>' + stt + '</td><td>' + cmsSafeText(item.code) + '</td><td>' + cmsSafeText(item.name) + '</td><td>' + cmsSafeText(item.desc) + '</td><td><span class="loyalty-event-status-text">' + cmsSafeText(item.status) + '</span></td><td><button class="icon-square orange" type="button" title="Cập nhật" onclick="cmsEditLoyaltyEvent(\'' + cmsSafeText(item.code) + '\')"><i class="fa fa-edit"></i></button><button class="icon-square red" type="button" title="Xóa" onclick="cmsDeleteLoyaltyEvent(\'' + cmsSafeText(item.code) + '\')"><i class="fa fa-trash"></i></button></td></tr>';
  }).join('') : '<tr><td colspan="6">Không có sự kiện phù hợp.</td></tr>';
  var count = document.getElementById('loyaltyEventCount');
  if(count) count.textContent = 'Hiển thị ' + rows.length + ' / ' + cmsLoyaltyEventFiltered.length + ' bản ghi';
  var page = document.getElementById('loyaltyEventPage');
  if(page) page.textContent = cmsLoyaltyEventPage;
}

function cmsSearchLoyaltyEvents(){
  var keyword = String(cmsGetValue('loyaltyEventKeyword') || '').trim().toLowerCase();
  var quickKeyword = String(cmsGetValue('loyaltyEventQuickSearch') || '').trim().toLowerCase();
  var status = cmsGetValue('loyaltyEventStatusFilter');
  cmsLoyaltyEventFiltered = cmsLoyaltyEvents.filter(function(item){
    var searchable = [item.code,item.name,item.desc,item.status].join(' ').toLowerCase();
    var matchKeyword = !keyword || searchable.indexOf(keyword) >= 0;
    var matchQuickKeyword = !quickKeyword || searchable.indexOf(quickKeyword) >= 0;
    var matchStatus = !status || item.status === status;
    return matchKeyword && matchQuickKeyword && matchStatus;
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
  cmsSetLoyaltyEventFormMode(false);
  if(code) cmsEditLoyaltyEvent(code);
}

function cmsCloseLoyaltyEventForm(){
  cmsEditingLoyaltyEventCode = null;
  showScreen('loyalty-offer-events');
}

function cmsClearLoyaltyEventForm(keepPanel){
  cmsEditingLoyaltyEventCode = null;
  var codeNode = document.getElementById('loyaltyEventCode');
  if(codeNode) codeNode.textContent = '';
  cmsSetValue('loyaltyEventName','');
  cmsSetValue('loyaltyEventDesc','');
  var status = document.getElementById('loyaltyEventStatus');
  if(status) status.checked = true;
  cmsSetLoyaltyEventFormMode(false);
  if(!keepPanel) cmsSetLoyaltyEventAlert('', '');
}

function cmsEditLoyaltyEvent(code){
  var item = cmsLoyaltyEvents.find(function(event){return event.code === code;});
  if(!item) return;
  cmsEditingLoyaltyEventCode = code;
  showScreen('loyalty-offer-event-form');
  var codeNode = document.getElementById('loyaltyEventCode');
  if(codeNode) codeNode.textContent = item.code;
  cmsSetValue('loyaltyEventName',item.name);
  cmsSetValue('loyaltyEventDesc',item.desc);
  var status = document.getElementById('loyaltyEventStatus');
  if(status) status.checked = item.status === 'Đang hoạt động';
  cmsSetLoyaltyEventFormMode(true);
  cmsSetLoyaltyEventAlert('', '');
}

function cmsSaveLoyaltyEvent(){
  var name = String(cmsGetValue('loyaltyEventName') || '').trim();
  var desc = String(cmsGetValue('loyaltyEventDesc') || '').trim();
  var statusNode = document.getElementById('loyaltyEventStatus');
  var status = statusNode && statusNode.checked ? 'Đang hoạt động' : 'Tạm dừng';
  if(name.length < 2 || name.length > 100){
    cmsSetLoyaltyEventAlert('error','Tên sự kiện phải có độ dài từ 2 đến 100 ký tự.');
    return;
  }
  if(cmsEditingLoyaltyEventCode){
    var current = cmsLoyaltyEvents.find(function(item){return item.code === cmsEditingLoyaltyEventCode;});
    if(!current) return;
    current.name = name;
    current.desc = desc;
    current.status = status;
    cmsSetLoyaltyEventAlert('success','Đã cập nhật sự kiện ' + current.code + '.');
  } else {
    var baseCode = 'EVT_' + cmsSlugEvent(name);
    var code = baseCode;
    var i = 1;
    while(cmsLoyaltyEvents.some(function(item){return item.code === code;})){
      i += 1;
      code = baseCode + '_' + i;
    }
    cmsLoyaltyEvents.unshift({code:code,name:name,desc:desc,status:status});
    cmsSetLoyaltyEventAlert('success','Đã tạo sự kiện ' + code + '.');
  }
  cmsEditingLoyaltyEventCode = null;
  cmsLoyaltyEventFiltered = cmsLoyaltyEvents.slice();
  cmsLoyaltyEventPage = 1;
  showScreen('loyalty-offer-events');
  cmsRenderLoyaltyEvents();
}

function cmsDeleteLoyaltyEvent(code){
  var item = cmsLoyaltyEvents.find(function(event){return event.code === code;});
  if(!item) return;
  cmsConfirmAction('Xác nhận xóa','Bạn có chắc chắn muốn xóa sự kiện <b>' + cmsSafeText(item.name) + '</b>?','Xóa',function(){
    cmsLoyaltyEvents = cmsLoyaltyEvents.filter(function(event){return event.code !== code;});
    cmsSetLoyaltyEventAlert('success','Đã xóa sự kiện ' + code + '.');
    cmsSearchLoyaltyEvents();
  },'red');
}

function cmsOpenLoyaltyEventColumns(button){
  var screen = document.getElementById('screen-loyalty-offer-events');
  if(screen) cmsOpenColumnPicker(screen,button);
}

function cmsResetLoyaltyEventSearch(){
  cmsSetValue('loyaltyEventKeyword','');
  cmsSetValue('loyaltyEventQuickSearch','');
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
  {id:'LIMIT-0001',business:'Nạp Point',min:1000,max:5000000,requireEkyc:true,start:'2026-07-01T00:00:00',end:'2026-12-31T23:59:59',status:'Chờ hiệu lực'},
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
  var title=document.getElementById('paymentRateFormTitle');
  if(title) title.textContent=id?'Cập nhật tỉ lệ quy đổi':'Thêm mới tỉ lệ quy đổi';
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
  var title=document.getElementById('paymentRateFormTitle');
  if(title) title.textContent='Cập nhật tỉ lệ quy đổi';
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
  var title=document.getElementById('paymentLimitFormTitle');
  if(title) title.textContent=id?'Cập nhật hạn mức giao dịch':'Thêm mới hạn mức giao dịch';
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
  var title=document.getElementById('paymentLimitFormTitle');
  if(title) title.textContent='Cập nhật hạn mức giao dịch';
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
  cmsConfirmAction('Xác nhận xuất dữ liệu','Xuất <b>' + cmsPaymentTransactionFiltered.length + '</b> giao dịch theo bộ lọc hiện tại?','Xuất dữ liệu',function(){});
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
  if(formTitle) formTitle.textContent = mode === 'edit' ? 'Cập nhật cấu hình' : 'Thêm mới cấu hình';

  var screenTitle = document.querySelector('#screen-loyalty-config-form .cms-screen-title');
  if(screenTitle) screenTitle.innerHTML = '<i class="fa fa-edit"></i> ' + cmsSafeText(title);

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
    cmsOpenProductModal('Dữ liệu chưa đầy đủ','Vui lòng nhập Tên cấu hình và Giá trị cấu hình.');
    return;
  }
  cmsConfirmAction('Xác nhận lưu cấu hình','Bạn có chắc chắn muốn lưu cấu hình Loyalty?','Lưu',function(){ cmsBackToLoyaltyConfigList(); });
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
    if(screen.id === 'screen-loyalty-texp-rate') return;
    if(screen.id === 'screen-loyalty-texp-form') return;
    if(screen.id === 'screen-loyalty-aexp-rate') return;
    if(screen.id === 'screen-loyalty-aexp-form') return;
    if(screen.id === 'screen-loyalty-rank-setting') return;
    if(screen.id === 'screen-loyalty-rank-form') return;
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


// Shared behavior for product administration lists
var cmsProductPendingAction = null;
var cmsProductColumnPicker = null;

function cmsNormalizeText(value){
  return (value || '').toString().trim().toLowerCase();
}

function cmsCloseProductModal(){
  var modal=document.getElementById('cmsProductModal');
  if(modal) modal.classList.add('hidden');
  cmsProductPendingAction=null;
}

function cmsOpenProductModal(title,body,confirmText,onConfirm,confirmClass){
  var modal=document.getElementById('cmsProductModal');
  if(!modal) return;
  document.getElementById('cmsProductModalTitle').textContent=title;
  document.getElementById('cmsProductModalBody').innerHTML=body;
  var actions=document.getElementById('cmsProductModalActions');
  actions.innerHTML='';
  var cancel=document.createElement('button');
  cancel.type='button'; cancel.className='btn gray'; cancel.textContent='Hủy'; cancel.onclick=cmsCloseProductModal;
  actions.appendChild(cancel);
  if(confirmText){
    var confirm=document.createElement('button');
    confirm.type='button'; confirm.className='btn '+(confirmClass||'blue'); confirm.textContent=confirmText;
    confirm.onclick=function(){ if(onConfirm) onConfirm(); cmsCloseProductModal(); };
    actions.appendChild(confirm);
  }
  modal.classList.remove('hidden');
}

function cmsProductRows(screen){
  return Array.prototype.slice.call(screen.querySelectorAll('.data-table tbody tr')).filter(function(row){return !row.classList.contains('product-filter-empty-row');});
}

function cmsApplyProductFilters(screen){
  var rows=cmsProductRows(screen);
  var filterWrap=screen.querySelector('.product-filter-grid');
  var filters=filterWrap ? Array.prototype.slice.call(filterWrap.querySelectorAll('input,select')) : [];
  var search=screen.querySelector('.tools-row input');
  var searchText=cmsNormalizeText(search && search.value);
  var visible=0;
  rows.forEach(function(row){
    var text=cmsNormalizeText(row.textContent);
    var ok=!searchText || text.indexOf(searchText)>=0;
    filters.forEach(function(control){
      if(!ok) return;
      var value=cmsNormalizeText(control.value);
      if(!value || value==='tất cả') return;
      ok=text.indexOf(value)>=0;
    });
    row.style.display=ok?'':'none';
    if(ok) visible++;
  });
  var tbody=screen.querySelector('.data-table tbody');
  var empty=tbody && tbody.querySelector('.product-filter-empty-row');
  if(!visible && tbody){
    if(!empty){
      empty=document.createElement('tr'); empty.className='product-filter-empty-row';
      var td=document.createElement('td'); td.className='product-filter-empty'; td.colSpan=screen.querySelectorAll('.data-table thead th').length; td.textContent='Không có dữ liệu phù hợp';
      empty.appendChild(td); tbody.appendChild(empty);
    }
    empty.style.display='';
  }else if(empty){ empty.style.display='none'; }
}

function cmsOpenColumnPicker(screen,button){
  if(cmsProductColumnPicker) cmsProductColumnPicker.remove();
  var table=screen.querySelector('.data-table');
  var headers=Array.prototype.slice.call(table.querySelectorAll('thead th'));
  var picker=document.createElement('div'); picker.className='column-picker';
  picker.innerHTML='<div class="column-picker-title">Chọn cột hiển thị</div>';
  headers.forEach(function(th,index){
    if(index===headers.length-1) return;
    var label=document.createElement('label');
    var check=document.createElement('input'); check.type='checkbox'; check.checked=th.style.display!=='none';
    check.onchange=function(){
      Array.prototype.forEach.call(table.rows,function(row){ if(row.cells[index]) row.cells[index].style.display=check.checked?'':'none'; });
    };
    label.appendChild(check); label.appendChild(document.createTextNode(th.textContent.trim())); picker.appendChild(label);
  });
  document.body.appendChild(picker); cmsProductColumnPicker=picker;
  var r=button.getBoundingClientRect(); picker.style.left=Math.max(8,Math.min(r.left,window.innerWidth-250))+'px'; picker.style.top=(r.bottom+6)+'px';
  setTimeout(function(){document.addEventListener('click',cmsCloseColumnPickerOnce);},0);
}
function cmsCloseColumnPickerOnce(e){
  if(cmsProductColumnPicker && !cmsProductColumnPicker.contains(e.target)){cmsProductColumnPicker.remove();cmsProductColumnPicker=null;}
  document.removeEventListener('click',cmsCloseColumnPickerOnce);
}

function cmsBindProductRowActions(screen){
  cmsProductRows(screen).forEach(function(row){
    var cells=row.cells; if(!cells.length) return;
    var statusCell=cells[cells.length-2];
    var actionCell=cells[cells.length-1];
    var name=(cells[2]||cells[1]).textContent.trim();
    Array.prototype.slice.call(actionCell.querySelectorAll('button')).forEach(function(btn){
      btn.classList.add('product-admin-status-btn');
      btn.dataset.cmsHandled='true';
      if(btn.querySelector('.fa-eye')){
        btn.onclick=function(e){e.preventDefault();e.stopPropagation();
          var serviceId=(cells[1] ? cells[1].textContent.trim() : '');
          var key='MYVTC_'+serviceId.padStart(4,'0')+'_KEY';
          var returnUrl=serviceId==='8'?'https://edu.vtc.vn/callback':'https://service.myvtc.vn/callback/'+serviceId;
          cmsOpenProductModal('Thông tin tích hợp','<div class="integration-grid"><div>Service ID</div><div>'+serviceId+'</div><div>Service Key</div><div>'+key+'</div><div>Return URL</div><div>'+returnUrl+'</div></div>');
        };
      }else if(btn.querySelector('.fa-trash')){
        btn.onclick=function(e){e.preventDefault();e.stopPropagation();cmsOpenProductModal('Xác nhận xóa','Bạn có chắc chắn muốn xóa <b>'+name+'</b>?','Xóa',function(){row.remove();cmsApplyProductFilters(screen);},'red');};
      }else if(btn.querySelector('.fa-ban') || btn.querySelector('.fa-check-circle')){
        btn.onclick=function(e){e.preventDefault();e.stopPropagation();
          var active=cmsNormalizeText(statusCell.textContent)==='hoạt động';
          var next=active?'Không hoạt động':'Hoạt động';
          cmsOpenProductModal('Xác nhận trạng thái','Bạn có chắc chắn muốn '+(active?'tắt':'bật')+' trạng thái hoạt động của <b>'+name+'</b>?','Xác nhận',function(){
            statusCell.textContent=next;
            btn.classList.toggle('red',!active); btn.classList.toggle('green',active);
            btn.innerHTML=active?'<i class="fa fa-check-circle"></i>':'<i class="fa fa-ban"></i>';
          },active?'green':'red');
        };
      }
    });
  });
}

function cmsValidateReturnUrl(formScreen){
  var input=formScreen.querySelector('.product-return-url');
  if(!input) return true;
  var valid=false;
  try{ var url=new URL(input.value); valid=(url.protocol==='http:'||url.protocol==='https:'); }catch(e){ valid=false; }
  input.classList.toggle('invalid',!valid);
  if(!valid){ input.focus(); cmsOpenProductModal('Dữ liệu chưa hợp lệ','ReturnURL là trường bắt buộc và phải đúng định dạng URL HTTP hoặc HTTPS.'); }
  return valid;
}

function cmsInitProductAdmin(){
  var ids=['distributor-list','supplier-list','balance-type-list','profile-type-list','product-type-list','product-list'];
  ids.forEach(function(id){
    var screen=document.getElementById('screen-'+id); if(!screen) return;
    var lookup=screen.querySelector('.cms-actions-center .btn.gray');
    if(lookup){ lookup.dataset.cmsHandled='true'; lookup.onclick=function(e){e.preventDefault();e.stopPropagation();cmsApplyProductFilters(screen);}; }
    var quick=screen.querySelector('.tools-row input');
    if(quick){quick.oninput=function(){cmsApplyProductFilters(screen);};quick.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();cmsApplyProductFilters(screen);}};}
    var columnButton=screen.querySelector('.tools-row button');
    if(columnButton){ columnButton.dataset.cmsHandled='true'; columnButton.onclick=function(e){e.preventDefault();e.stopPropagation();cmsOpenColumnPicker(screen,columnButton);}; }
    cmsBindProductRowActions(screen);
  });
  ['product-form-add','product-form-edit'].forEach(function(id){
    var form=document.getElementById('screen-'+id); if(!form) return;
    var save=Array.prototype.slice.call(form.querySelectorAll('.form-bottom button')).pop();
    if(save){ save.dataset.cmsHandled='true'; save.onclick=function(e){e.preventDefault();e.stopPropagation();if(cmsValidateReturnUrl(form)){cmsOpenProductModal('Thành công','Thông tin sản phẩm đã được kiểm tra và lưu.','Đóng',function(){showScreen('product-list');},'blue');}}; }
    var input=form.querySelector('.product-return-url'); if(input) input.oninput=function(){input.classList.remove('invalid');};
  });
  var modal=document.getElementById('cmsProductModal'); if(modal) modal.onclick=function(e){if(e.target===modal) cmsCloseProductModal();};
}

document.addEventListener('DOMContentLoaded',cmsInitProductAdmin);

/* ===== CMS Tài khoản ===== */
var cmsAccState={};
var cmsAccData={
 statistics:[
  ['ACC-00012118','hongtt','0936168687','hongtt@vtc.vn','SVC001','VTC Game',5,4,'17/07/2026 08:30:15'],
  ['ACC-00012124','toanth','0961381232','toanth@vtc.vn','SVC002','VTC Pay',3,3,'16/07/2026 15:22:08'],
  ['ACC-00012135','minhnguyen','0988111222','minh.nguyen@gmail.com','SVC003','VTC Mobile',7,5,'15/07/2026 10:04:39'],
  ['ACC-00012146','lananh','0912345678','lananh@yahoo.com','SVC004','VTC Education',2,2,'14/07/2026 09:18:12'],
  ['ACC-00012157','quanghuy','0905123456','quanghuy@outlook.com','SVC005','VTC Loyalty',4,3,'13/07/2026 20:10:41'],
  ['ACC-00012168','thuyduong','0977555333','duong@vtc.vn','SVC006','VTC Store',6,6,'12/07/2026 12:40:06']
 ],
 policies:[
  ['Hệ thống','VTC','MyVTC','Đăng nhập','OTP SMS','Có','Có','Có','Không','Không',1,'01/07/2026 00:00','31/12/2026 23:59','Hiệu lực'],
  ['Hệ thống','VTC','VTC Game','Đổi mật khẩu','OTP Email','Không','Không','Không','Không','Có',2,'01/08/2026 00:00','31/12/2026 23:59','Chờ áp dụng'],
  ['Tài khoản','VTC Pay','Ví điện tử','Giao dịch','OTP App','Có','Có','Có','Có','Có',1,'01/01/2026 00:00','30/06/2026 23:59','Hết hiệu lực']
 ],
 links:[
  ['hongtt','hongtt_au','SVC001','VTC Game','Gắn kết','17/07/2026 08:32:14'],
  ['toanth','toan_pay','SVC002','VTC Pay','Gắn kết','16/07/2026 14:16:09'],
  ['minhnguyen','minh_mobile','SVC003','VTC Mobile','Hủy gắn kết','15/07/2026 11:01:28'],
  ['lananh','lan_edu','SVC004','VTC Education','Gắn kết','14/07/2026 09:20:34']
 ],
 otpHistory:[
  ['hongtt','OTP SMS','VTC','MyVTC','Đăng nhập','Thành công','17/07/2026 08:31:02'],
  ['toanth','OTP Email','VTC','VTC Pay','Đổi mật khẩu','Thất bại','16/07/2026 15:25:18'],
  ['minhnguyen','OTP App','VTC Mobile','VTC Mobile','Giao dịch','Thành công','15/07/2026 10:12:44'],
  ['lananh','OTP Voice','VTC','VTC Education','Đăng ký','Thành công','14/07/2026 09:22:10'],
  ['quanghuy','OTP SMS','VTC','VTC Loyalty','Đăng nhập','Thất bại','13/07/2026 20:11:05']
 ],
 sessions:[
  ['hongtt','Trần Thúy Hồng','17/07/2026 08:30:15','Chrome 150, PC','Windows 11','117.103.228.53, Hà Nội','Website'],
  ['hongtt','Trần Thúy Hồng','16/07/2026 21:05:28','iPhone 15','iOS 18','14.225.12.90, Hà Nội','Mobile App'],
  ['toanth','Trần Hùng Toàn','16/07/2026 15:21:06','Edge, Laptop','Windows 11','117.103.228.54, Hà Nội','CMS']
 ],
 devices:[
  ['hongtt','17/07/2026 08:30:15','Chrome 150, PC','Windows 11','117.103.228.53, Hà Nội','Website'],
  ['hongtt','16/07/2026 21:05:28','iPhone 15','iOS 18','14.225.12.90, Hà Nội','Mobile App'],
  ['toanth','16/07/2026 15:21:06','Edge, Laptop','Windows 11','117.103.228.54, Hà Nội','CMS']
 ]
};
function cmsAccBtn(cls,icon,text,fn){return '<button type="button" class="btn '+cls+'" onclick="'+fn+'"><i class="fa '+icon+'"></i> '+text+'</button>'}
function cmsAccWrap(id,title,icon,body){return '<section class="screen hidden account-module" id="screen-'+id+'"><div class="cms-screen-title"><i class="fa '+icon+'"></i> '+title+'</div><div class="cms-content">'+body+'</div></section>'}
function cmsAccFilter(fields,action){return '<div class="filter-box"><div class="filter-grid">'+fields+'</div><div class="filter-actions">'+cmsAccBtn('blue','fa-search','Tra cứu',action)+'</div></div>'}
function cmsAccEditField(label,id,req,opts,type){var mark=req?' <span class="required">*</span>':'';var control=opts?'<select id="'+id+'">'+opts.map(x=>'<option>'+x+'</option>').join('')+'</select>':'<input id="'+id+'" type="'+(type||'text')+'">';return '<div class="account-edit-row"><label>'+label+mark+'</label><div>'+control+'<div class="field-error" id="err-'+id+'"></div></div></div>'}
function cmsAccField(label,id,type,req,opts){var mark=req?' <span class="required-mark">*</span>':'';if(opts)return '<label>'+label+mark+'<select id="'+id+'">'+opts.map(x=>'<option>'+x+'</option>').join('')+'</select><span class="field-error" id="err-'+id+'"></span></label>';return '<label>'+label+mark+'<input id="'+id+'" type="'+(type||'text')+'"><span class="field-error" id="err-'+id+'"></span></label>'}
function cmsAccMultiFilter(label,id,opts){var items=opts.filter(function(x){return x!=='Tất cả'});return '<div class="acc-multi-filter"><span>'+label+'</span><details ontoggle="cmsAccMultiToggle(this)"><summary id="'+id+'Summary">Tất cả</summary><div class="acc-multi-options"><label class="acc-multi-all"><input type="checkbox" checked onchange="cmsAccToggleMultiAll(\''+id+'\',this)"> Tất cả</label>'+items.map(function(x){return '<label><input type="checkbox" data-multi="'+id+'" value="'+x+'" onchange="cmsAccUpdateMulti(\''+id+'\')"> '+x+'</label>'}).join('')+'</div></details></div>'}

function cmsAccCloseMultiDropdowns(except){document.querySelectorAll('.acc-multi-filter details[open]').forEach(function(d){if(d!==except)d.removeAttribute('open')})}
function cmsAccMultiToggle(details){if(details&&details.open)cmsAccCloseMultiDropdowns(details)}
document.addEventListener('click',function(e){if(!e.target.closest('.acc-multi-filter'))cmsAccCloseMultiDropdowns()});
function cmsAccToggleMultiAll(id,el){document.querySelectorAll('[data-multi="'+id+'"]').forEach(function(x){x.checked=false});cmsAccUpdateMulti(id)}
function cmsAccUpdateMulti(id){var checked=Array.from(document.querySelectorAll('[data-multi="'+id+'"]:checked'));var all=document.querySelector('.acc-multi-filter input[onchange*="'+id+'"]');if(all)all.checked=checked.length===0;var summary=document.getElementById(id+'Summary');if(summary)summary.textContent=checked.length===1?checked[0].value:(checked.length?('Đã chọn '+checked.length):'Tất cả')}
function cmsAccPolicyMultiField(label,id,opts){return '<div class="account-edit-row policy-multi-row"><label>'+label+' <span class="required">*</span></label><div>'+cmsAccMultiFilter('',id,opts)+'<div class="field-error" id="err-'+id+'"></div></div></div>'}
function cmsAccGetMultiValues(id){var values=Array.from(document.querySelectorAll('[data-multi="'+id+'"]:checked')).map(function(x){return x.value});var all=document.querySelector('.acc-multi-filter input[onchange*="'+id+'"]');return !values.length&&all&&all.checked?['Tất cả']:values}
function cmsAccSetMultiValues(id,value){var values=String(value||'').split(',').map(function(x){return x.trim()}).filter(Boolean),isAll=values.indexOf('Tất cả')>=0;document.querySelectorAll('[data-multi="'+id+'"]').forEach(function(x){x.checked=!isAll&&values.indexOf(x.value)>=0});var all=document.querySelector('.acc-multi-filter input[onchange*="'+id+'"]');if(all)all.checked=isAll||values.length===0;cmsAccUpdateMulti(id)}
function cmsAccPolicyObjectChanged(){var object=document.getElementById('pfObject'),row=document.getElementById('pfAccountRow');if(!object||!row)return;var show=object.value==='Tài khoản';row.classList.toggle('hidden',!show);if(!show){var input=document.getElementById('pfAccount'),err=document.getElementById('err-pfAccount');if(input)input.value='';if(err)err.textContent=''}}
function cmsAccAccountSearch(id,action,placeholder){return '<div class="account-search-reference"><div class="account-search-reference-row"><label for="'+id+'">Tài khoản</label><input id="'+id+'" type="text" placeholder="'+(placeholder||'Nhập SĐT, Email hoặc Tên tài khoản')+'"></div><div class="account-search-reference-action">'+cmsAccBtn('blue','fa-search','Tra cứu',action)+'</div></div>'}

var cmsAccProducts=['Đào tạo số edu.vtc.vn','Au Mobile','Truy Kích','Đại Chiến Tam Quốc','Tập kích','Trảm Tiên Quyết','Phong Vân Chí','Ngự Thần Sư','Đường Tăng Nghịch Thiên','Giang Hồ Ngũ Tuyệt','Đấu Trường Tam Quốc','Tam Quốc Chí','Au Top','Web VTCGame – Thông tin tài khoản','Trang chủ VTC.VN','Dịch Vụ Scoin','TS Origin','Đạo Sĩ Bắt Trương Phi'];
var cmsAccUnits=['Tất cả','Tổng công ty VTC','VTC Intecom','VTC Mobile','VTC Digital','Viện Giáo dục và Đào tạo số VTC'];
var cmsAccBusinesses=['Tất cả','Đăng ký tài khoản','Đăng nhập tài khoản 2 bước','Đổi mật khẩu','Quên mật khẩu','Thay đổi Email','Thay đổi SĐT','Hủy OTP SMS','Hủy OTP Email','Bật xác minh 2 bước'];
var cmsAccOtpMethods=['Tất cả','OTP SMS','OTP Voice','OTP Email','OTP App','OTP Zalo','Touch/FaceID','Mã PIN'];
function cmsAccUnitMultiSelect(){
 var units=cmsAccProducts;
 return '<div class="acc-unit-filter"><span>Sản phẩm</span><details><summary id="accStatUnitSummary">Tất cả</summary><div class="acc-unit-options"><label class="acc-unit-all"><input type="checkbox" id="accStatUnitAll" checked onchange="cmsAccToggleAllUnits(this)"> Tất cả</label>'+units.map(function(x){return '<label><input type="checkbox" class="acc-stat-unit" value="'+x+'" onchange="cmsAccUpdateUnitSummary()"> '+x+'</label>';}).join('')+'</div></details><span class="field-error" aria-hidden="true"></span></div>';
}
function cmsAccToggleAllUnits(el){document.querySelectorAll('.acc-stat-unit').forEach(function(x){x.checked=false});cmsAccUpdateUnitSummary();}
function cmsAccUpdateUnitSummary(){var checked=Array.from(document.querySelectorAll('.acc-stat-unit:checked')).map(function(x){return x.value});var all=document.getElementById('accStatUnitAll');if(all)all.checked=checked.length===0;var n=document.getElementById('accStatUnitSummary');if(n)n.textContent=checked.length?('Đã chọn '+checked.length+' sản phẩm'):'Tất cả';}
function cmsAccDateField(label,id){return '<label>'+label+'<input id="'+id+'" type="text" inputmode="numeric" maxlength="10" placeholder="DD/MM/YYYY" oninput="cmsAccFormatDate(this)"><span class="field-error" id="err-'+id+'"></span></label>'}
function cmsAccFormatDate(el){var v=el.value.replace(/\D/g,'').slice(0,8);if(v.length>4)v=v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4);else if(v.length>2)v=v.slice(0,2)+'/'+v.slice(2);el.value=v;}

function cmsAccTable(id,headers,extra){return '<div class="module-toolbar"><div class="toolbar-left">'+(extra||'')+cmsAccBtn('gray','fa-columns','Ẩn/hiện cột','cmsAccColumns(\''+id+'\',this)')+'</div><div class="toolbar-right"><input class="toolbar-search" id="'+id+'Search" placeholder="Tìm kiếm nhanh" oninput="cmsAccRender(\''+id+'\')"></div></div><div class="table-scroll"><table id="'+id+'Table"><thead><tr><th data-key="stt">STT</th>'+headers.map((h,i)=>'<th data-key="'+i+'" onclick="cmsAccSort(\''+id+'\','+i+')">'+h+' <i class="fa fa-sort"></i></th>').join('')+'</tr></thead><tbody></tbody></table></div><div class="pager-row"><span id="'+id+'Info"></span><div class="pager-actions" id="'+id+'Pager"></div></div>'}
function cmsAccBuildScreens(){
 var host=document.querySelector('main')||document.body; var modal=document.getElementById('cmsProductModal');
 function add(html){var w=document.createElement('div');w.innerHTML=html;var n=w.firstElementChild;(modal?modal.parentNode:host).insertBefore(n,modal||null)}
 add(cmsAccWrap('account-statistics','Tài khoản > Thống kê tài khoản','fa-bar-chart',cmsAccFilter(cmsAccDateField('Từ ngày','accStatFrom')+cmsAccDateField('Đến ngày','accStatTo')+cmsAccUnitMultiSelect(),"cmsAccRender('accStatistics')")+cmsAccTable('accStatistics',['ID tài khoản','Tên tài khoản','Số điện thoại','Email','Mã dịch vụ','Tên dịch vụ','Gắn kết','Xác thực','Thời gian tạo'],cmsAccBtn('green','fa-download','Tải danh sách',"cmsAccExport('accStatistics')"))));
 add(cmsAccWrap('account-password-reset','Tài khoản > Reset mật khẩu','fa-refresh',cmsAccAccountSearch('resetUsername','cmsAccLookupReset()')+'<div id="resetPassAlert" class="account-alert"></div><div id="resetPasswordForm" class="form-box narrow-form reset-password-form hidden"><div class="account-inline-form"><div class="account-inline-field"><label>Họ và tên</label><div class="account-inline-control"><input id="resetFullName" type="text" readonly></div></div><div class="account-inline-field"><label>Mật khẩu mới <span class="required-mark">*</span></label><div class="account-inline-control"><input id="resetPassword" type="password"><span class="field-error" id="err-resetPassword"></span></div></div></div><div class="form-actions">'+cmsAccBtn('blue','fa-save','Lưu lại','cmsAccResetPassword()')+cmsAccBtn('green','fa-refresh','Làm mới','cmsAccResetForm(\'reset\')')+cmsAccBtn('gray','fa-arrow-left','Quay lại','showScreen(\'account-statistics\')')+'</div></div>'));
 add(cmsAccWrap('otp-display-policy','Tài khoản > Thiết lập hiển thị OTP','fa-cube','<div class="filter-box"><div class="filter-grid">'+cmsAccMultiFilter('Đối tượng','polObject',['Tất cả','Hệ thống','Tài khoản'])+cmsAccMultiFilter('Đơn vị','polUnit',cmsAccUnits)+cmsAccMultiFilter('Sản phẩm','polService',['Tất cả'].concat(cmsAccProducts))+cmsAccMultiFilter('Nghiệp vụ','polBusiness',cmsAccBusinesses)+'</div><div class="filter-actions otp-policy-filter-actions">'+cmsAccBtn('blue','fa-search','Tra cứu',"cmsAccRender('otpPolicies')")+cmsAccBtn('green','fa-plus','Thêm mới',"cmsAccOpenPolicy()")+'</div></div>'+cmsAccTable('otpPolicies',['Đối tượng','Đơn vị','Sản phẩm','Nghiệp vụ','Phương thức OTP','Viettel','MobiFone','VinaPhone','Vietnamobile','Nhà mạng khác','Mức ưu tiên','Thời gian bắt đầu','Thời gian kết thúc','Trạng thái','Thao tác'])));
 add(cmsAccWrap('otp-policy-form','<span id="otpPolicyFormTitle">Tài khoản > Thêm mới chính sách hiển thị OTP</span>','fa-edit','<div class="account-edit-shell policy-edit-shell"><div id="policyAlert" class="account-alert"></div><div class="account-edit-form policy-account-edit">'+cmsAccEditField('Loại đối tượng','pfObject',true,['Hệ thống','Tài khoản'])+'<div class="account-edit-row hidden" id="pfAccountRow"><label for="pfAccount">Tài khoản <span class="required">*</span></label><div><input id="pfAccount" type="text" placeholder="Nhập SĐT, Email hoặc Username"><div class="field-error" id="err-pfAccount"></div></div></div>'+cmsAccEditField('Phương thức OTP','pfMethod',true,cmsAccOtpMethods.filter(x=>x!=='Tất cả'))+cmsAccPolicyMultiField('Đơn vị','pfUnit',cmsAccUnits)+cmsAccPolicyMultiField('Sản phẩm','pfService',['Tất cả'].concat(cmsAccProducts))+cmsAccPolicyMultiField('Nghiệp vụ','pfBusiness',cmsAccBusinesses)+cmsAccEditField('Mức ưu tiên','pfPriority',true,[1,2,3,4,5,6,7,8])+cmsAccEditField('Thời gian áp dụng','pfStart',true,null,'datetime-local')+cmsAccEditField('Thời gian kết thúc','pfEnd',true,null,'datetime-local')+cmsAccEditField('Số lần tối đa trong ngày','pfDayMax',true,null,'number')+cmsAccEditField('Số lần tối đa trong tháng','pfMonthMax',true,null,'number')+'<div class="account-edit-row policy-network-row"><label>Nhà mạng được hiển thị</label><div><div class="policy-network">'+['Viettel','MobiFone','VinaPhone','Vietnamobile','Nhà mạng khác'].map((x,i)=>'<label><input type="checkbox" class="pfNetwork" value="'+x+'" '+(i<3?'checked':'')+'> '+x+'</label>').join('')+'</div></div></div><div class="account-update-actions policy-form-actions">'+cmsAccBtn('blue','fa-save','Lưu lại','cmsAccSavePolicy()')+cmsAccBtn('green','fa-refresh','Làm mới',"cmsAccResetForm('policy')")+cmsAccBtn('gray','fa-arrow-left','Quay lại',"showScreen('otp-display-policy')")+'</div></div></div>'));
 add(cmsAccWrap('account-link-lookup','Tài khoản > Tra cứu gắn kết tài khoản','fa-link',cmsAccFilter(cmsAccDateField('Từ ngày','linkFrom')+cmsAccDateField('Đến ngày','linkTo')+cmsAccField('Tên tài khoản MyVTC','linkMy')+cmsAccField('Tên tài khoản đối tác','linkPartner'),"cmsAccRender('accountLinks')")+cmsAccTable('accountLinks',['Tên tài khoản MyVTC','Tên tài khoản đối tác','Mã dịch vụ','Tên dịch vụ','Nghiệp vụ','Thời gian thực hiện'])));
 add(cmsAccWrap('otp-history','Tài khoản > Tra cứu lịch sử xác thực OTP','fa-history','<div class="filter-box"><div class="filter-grid">'+cmsAccDateField('Từ ngày','otpFrom')+cmsAccDateField('Đến ngày','otpTo')+cmsAccMultiFilter('Đơn vị','otpUnit',cmsAccUnits)+cmsAccMultiFilter('Dịch vụ','otpService',['Tất cả'].concat(cmsAccProducts))+cmsAccMultiFilter('Nghiệp vụ','otpBusiness',cmsAccBusinesses)+cmsAccMultiFilter('Phương thức OTP','otpMethod',cmsAccOtpMethods)+cmsAccField('Tên tài khoản','otpAccount')+'</div><div class="filter-actions otp-history-actions">'+cmsAccBtn('blue','fa-search','Tra cứu',"cmsAccRender('otpHistory')")+cmsAccBtn('green','fa-bar-chart','Xem thống kê',"showScreen('otp-statistics')")+'</div></div>'+cmsAccTable('otpHistory',['Tài khoản','Phương thức OTP','Đơn vị','Dịch vụ','Nghiệp vụ','Kết quả','Thời gian'])));
 add(cmsAccWrap('otp-statistics','Tài khoản > Thống kê xác thực OTP','fa-bar-chart','<div class="summary-cards"><div class="summary-card">Tổng lượt xác thực<b>5</b></div><div class="summary-card">Thành công<b>3</b></div><div class="summary-card">Thất bại<b>2</b></div><div class="summary-card">Tỷ lệ thành công<b>60%</b></div></div>'+cmsAccTable('otpStats',['Phương thức OTP','Đơn vị','Dịch vụ','Nghiệp vụ','Số lượt thành công','Số lượt thất bại'],cmsAccBtn('gray','fa-times','Đóng cửa sổ thống kê',"showScreen('otp-history')"))));
 add(cmsAccWrap('account-security-lookup','Tài khoản > Tra cứu bảo mật','fa-lock',cmsAccAccountSearch('securityAccount','cmsAccLookupSecurity()')+'<div id="securityLookupAlert" class="account-alert"></div><div id="securityLookupResult" class="hidden"><div class="table-scroll security-table-wrap"><table class="security-table"><thead><tr><th>STT</th><th>Tên loại bảo mật</th><th>Trạng thái</th><th>Thao tác</th><th>Thời gian cập nhật gần nhất</th></tr></thead><tbody id="securityLookupBody"></tbody></table></div></div>'));
 add(cmsAccWrap('login-sessions','Tài khoản > Tra cứu phiên đăng nhập','fa-list',cmsAccAccountSearch('sessionAccount',"cmsAccRender('loginSessions')")+cmsAccTable('loginSessions',['Tài khoản','Họ và tên','Thời gian đăng nhập','Thiết bị','Hệ điều hành','Địa chỉ IP và vị trí','Sản phẩm','Chức năng'])));
 add(cmsAccWrap('trusted-devices','Tài khoản > Tra cứu thiết bị tin cậy','fa-laptop',cmsAccAccountSearch('deviceAccount',"cmsAccRender('trustedDevices')")+cmsAccTable('trustedDevices',['Tên tài khoản','Thời gian đăng nhập','Thiết bị','Hệ điều hành','Địa chỉ IP và vị trí','Sản phẩm','Chức năng'])));
 cmsAccReplaceUpdate();
 if(!document.getElementById('accountConfirm')){document.body.insertAdjacentHTML('beforeend','<div class="account-confirm hidden" id="accountConfirm"><div class="account-confirm-card"><div class="account-confirm-head" id="accountConfirmTitle">Xác nhận</div><div class="account-confirm-body" id="accountConfirmBody"></div><div class="account-confirm-actions"><button class="btn gray" onclick="cmsAccCloseConfirm()">Hủy</button><button class="btn blue" id="accountConfirmOk">Xác nhận</button></div></div></div>')}
 cmsAccInitTables();
}
function cmsAccReplaceUpdate(){
 var s=document.getElementById('screen-account-update');if(!s)return;
 function row(label,id,type,required,extra){
  return '<div class="account-inline-field"><label for="'+id+'">'+label+(required?' <span class="required-mark">*</span>':'')+'</label><div class="account-inline-control"><input id="'+id+'" type="'+(type||'text')+'">'+(extra||'')+'<span class="field-error" id="err-'+id+'"></span></div></div>';
 }
 var emailCheck='<label class="verify-checkbox"><input id="updEmailVerified" type="checkbox"> Đã xác thực</label>';
 var phoneCheck='<label class="verify-checkbox"><input id="updPhoneVerified" type="checkbox"> Đã xác thực</label>';
 s.classList.add('account-module');
 s.innerHTML='<div class="cms-screen-title"><i class="fa fa-user"></i> Tài khoản > Cập nhật thông tin tài khoản</div><div class="cms-content">'+cmsAccAccountSearch('updUsername','cmsAccLookupUpdate()')+'<div id="accountUpdateAlert" class="account-alert"></div><div class="form-box narrow-form account-update-compact account-update-detail hidden" id="accountUpdateDetail"><div id="accountUpdateResult" class="hidden"><div class="account-update-result-title">Thông tin tài khoản</div><div class="account-inline-form">'+row('Họ và tên','updFullName','text',true)+row('Email','updEmail','email',true,emailCheck)+row('Số điện thoại','updPhone','text',true,phoneCheck)+'</div><div class="form-actions">'+cmsAccBtn('blue','fa-save','Lưu lại','cmsAccSaveUpdate()')+cmsAccBtn('green','fa-refresh','Làm mới','cmsAccResetForm(\'update\')')+cmsAccBtn('gray','fa-arrow-left','Quay lại','showScreen(\'account-statistics\')')+'</div></div></div></div>'
}
function cmsAccInitTables(){
 cmsAccState.accStatistics={data:cmsAccData.statistics,headers:9,page:1,size:10};
 cmsAccState.otpPolicies={data:cmsAccData.policies,headers:14,page:1,size:10,actions:true};
 cmsAccState.accountLinks={data:cmsAccData.links,headers:6,page:1,size:10};
 cmsAccState.otpHistory={data:cmsAccData.otpHistory,headers:7,page:1,size:10,status:5};
 var groups={};cmsAccData.otpHistory.forEach(r=>{var k=r.slice(1,5).join('|');groups[k]=groups[k]||[r[1],r[2],r[3],r[4],0,0];groups[k][r[5]==='Thành công'?4:5]++});
 cmsAccState.otpStats={data:Object.values(groups),headers:6,page:1,size:10};
 cmsAccState.loginSessions={data:cmsAccData.sessions,headers:8,page:1,size:10,sessionActions:true};
 cmsAccState.trustedDevices={data:cmsAccData.devices,headers:7,page:1,size:10,deviceActions:true};
 Object.keys(cmsAccState).forEach(cmsAccRender)
}
function cmsAccRender(id){var st=cmsAccState[id],tb=document.querySelector('#'+id+'Table tbody');if(!st||!tb)return;var q=((document.getElementById(id+'Search')||{}).value||'').toLowerCase();var data=st.data.filter(r=>r.join(' ').toLowerCase().includes(q));var pages=Math.max(1,Math.ceil(data.length/st.size));st.page=Math.min(st.page,pages);var rows=data.slice((st.page-1)*st.size,st.page*st.size);tb.innerHTML=rows.map((r,ix)=>{var cells=r.map((v,i)=>{var content=v;if(id==='otpPolicies'&&i>=5&&i<=9){var checked=v==='Có'||v===true;content='<i class="fa '+(checked?'fa-check-circle policy-check':'fa-times-circle policy-uncheck')+'" title="'+(checked?'Có':'Không')+'" aria-label="'+(checked?'Có':'Không')+'"></i>'}else if(st.status===i){content='<span class="'+(v==='Thành công'?'status-ok':'status-fail')+'">'+v+'</span>'}return '<td>'+content+'</td>'}).join('');var act='';if(st.actions)act='<td><button class="icon-square blue" title="Xem nghiệp vụ" onclick="cmsAccInfo(\'Nghiệp vụ: '+r[3]+'\')"><i class="fa fa-eye"></i></button> <button class="icon-square orange" title="Sửa" onclick="cmsAccEditPolicy('+st.data.indexOf(r)+')"><i class="fa fa-edit"></i></button> <button class="icon-square red" title="Dừng" onclick="cmsAccStopPolicy('+st.data.indexOf(r)+')"><i class="fa fa-stop"></i></button></td>';if(st.sessionActions)act='<td class="action-cell"><button class="icon-square red" title="Thu hồi hoặc đăng xuất" aria-label="Thu hồi hoặc đăng xuất" onclick="cmsAccRemoveRow(\''+id+'\','+st.data.indexOf(r)+',\'Thu hồi hoặc đăng xuất phiên đăng nhập này?\')"><i class="fa fa-sign-out-alt"></i></button></td>';if(st.deviceActions)act='<td class="action-cell"><button class="icon-square red" title="Hủy tin cậy" aria-label="Hủy tin cậy" onclick="cmsAccRemoveRow(\''+id+'\','+st.data.indexOf(r)+',\'Hủy trạng thái thiết bị tin cậy này?\')"><i class="fa fa-shield-alt"></i></button></td>';return '<tr><td>'+((st.page-1)*st.size+ix+1)+'</td>'+cells+act+'</tr>'}).join('')||'<tr><td colspan="20" style="text-align:center">Không có dữ liệu</td></tr>';document.getElementById(id+'Info').textContent='Hiển thị '+rows.length+' / '+data.length+' bản ghi';document.getElementById(id+'Pager').innerHTML='<button onclick="cmsAccPage(\''+id+'\','+(st.page-1)+')">‹</button>'+Array.from({length:pages},(_,i)=>'<button class="'+(i+1===st.page?'active':'')+'" onclick="cmsAccPage(\''+id+'\','+(i+1)+')">'+(i+1)+'</button>').join('')+'<button onclick="cmsAccPage(\''+id+'\','+(st.page+1)+')">›</button>';cmsAccApplyHiddenColumns(id)}
function cmsAccPage(id,p){var st=cmsAccState[id];if(st&&p>0){st.page=p;cmsAccRender(id)}}function cmsAccSetSize(id){cmsAccState[id].size=+(document.getElementById(id+'Size').value);cmsAccState[id].page=1;cmsAccRender(id)}
function cmsAccSort(id,i){var st=cmsAccState[id];st.dir=st.sort===i?-st.dir:1;st.sort=i;st.data.sort((a,b)=>String(a[i]).localeCompare(String(b[i]),'vi',{numeric:true})*st.dir);cmsAccRender(id)}
function cmsAccApplyHiddenColumns(id){var st=cmsAccState[id],t=document.getElementById(id+'Table');if(!st||!t)return;var hidden=st.hiddenColumns||new Set();Array.from(t.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=hidden.has(i)?'none':''})})}
function cmsAccCloseColumns(){document.querySelectorAll('.column-panel').forEach(function(x){x.remove()});document.removeEventListener('click',cmsAccOutsideColumns);document.removeEventListener('keydown',cmsAccEscapeColumns)}
function cmsAccOutsideColumns(e){var panel=document.querySelector('.column-panel');if(panel&&!panel.contains(e.target)&&!e.target.closest('[data-column-picker-button]'))cmsAccCloseColumns()}
function cmsAccEscapeColumns(e){if(e.key==='Escape')cmsAccCloseColumns()}
function cmsAccColumns(id,btn){var opened=document.querySelector('.column-panel[data-table-id="'+id+'"]');cmsAccCloseColumns();if(opened)return;var t=document.getElementById(id+'Table'),st=cmsAccState[id];if(!t||!st)return;st.hiddenColumns=st.hiddenColumns||new Set();var p=document.createElement('div');p.className='column-panel';p.dataset.tableId=id;p.innerHTML='<div class="column-panel-title">Chọn cột hiển thị</div>';btn.dataset.columnPickerButton='true';Array.from(t.tHead.rows[0].cells).forEach(function(th,i){var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!st.hiddenColumns.has(i);c.onchange=function(){if(c.checked)st.hiddenColumns.delete(i);else st.hiddenColumns.add(i);cmsAccApplyHiddenColumns(id)};l.append(c,document.createTextNode(th.textContent.replace(/\s+/g,' ').trim()));p.append(l)});document.body.append(p);var r=btn.getBoundingClientRect(),w=p.offsetWidth||240,h=p.offsetHeight||300;var left=Math.min(Math.max(8,r.left),window.innerWidth-w-8);var top=r.bottom+6;if(top+h>window.innerHeight-8)top=Math.max(8,r.top-h-6);p.style.left=left+'px';p.style.top=top+'px';setTimeout(function(){document.addEventListener('click',cmsAccOutsideColumns);document.addEventListener('keydown',cmsAccEscapeColumns)},0)}
function cmsAccExport(id){var st=cmsAccState[id],csv=st.data.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n'),a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download=id+'.csv';a.click();URL.revokeObjectURL(a.href)}
function cmsAccConfirm(title,body,ok){document.getElementById('accountConfirmTitle').textContent=title;document.getElementById('accountConfirmBody').textContent=body;document.getElementById('accountConfirmOk').onclick=function(){cmsAccCloseConfirm();ok&&ok()};document.getElementById('accountConfirm').classList.remove('hidden')}function cmsAccCloseConfirm(){document.getElementById('accountConfirm').classList.add('hidden')}function cmsAccInfo(x){cmsAccConfirm('Thông tin',x)}
function cmsAccRemoveRow(id,i,msg){cmsAccConfirm('Xác nhận hành động',msg,function(){cmsAccState[id].data.splice(i,1);cmsAccRender(id)})}
function cmsAccOpenPolicy(){window.cmsPolicyEdit=null;cmsAccResetForm('policy');showScreen('otp-policy-form');var title=document.getElementById('otpPolicyFormTitle');if(title)title.textContent='Tài khoản > Thêm mới chính sách hiển thị OTP';var obj=document.getElementById('pfObject');if(obj){obj.value='Hệ thống';obj.onchange=cmsAccPolicyObjectChanged}cmsAccPolicyObjectChanged()}function cmsAccEditPolicy(i){var r=cmsAccData.policies[i];window.cmsPolicyEdit=i;showScreen('otp-policy-form');var title=document.getElementById('otpPolicyFormTitle');if(title)title.textContent='Tài khoản > Cập nhật chính sách hiển thị OTP';pfObject.value=r[0];pfObject.onchange=cmsAccPolicyObjectChanged;pfMethod.value=r[4];if(r[0]==='Tài khoản')pfAccount.value='hongtt';cmsAccSetMultiValues('pfUnit',r[1]);cmsAccSetMultiValues('pfService',r[2]);cmsAccSetMultiValues('pfBusiness',r[3]);pfPriority.value=r[10];cmsAccPolicyObjectChanged();document.querySelectorAll('.pfNetwork').forEach(function(x,idx){x.checked=r[5+idx]==='Có'})}function cmsAccStopPolicy(i){cmsAccConfirm('Dừng chính sách','Bạn xác nhận dừng chính sách này?',function(){cmsAccData.policies[i][13]='Hết hiệu lực';cmsAccRender('otpPolicies')})}
function cmsAccSavePolicy(){var ids=['pfObject','pfMethod','pfPriority','pfStart','pfEnd','pfDayMax','pfMonthMax'],ok=true;ids.forEach(function(id){var e=document.getElementById(id),er=document.getElementById('err-'+id);var bad=!e.value;er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});['pfUnit','pfService','pfBusiness'].forEach(function(id){var values=cmsAccGetMultiValues(id),er=document.getElementById('err-'+id);if(er)er.textContent='';if(!values.length){if(er)er.textContent='Trường bắt buộc.';ok=false}});if(pfObject.value==='Tài khoản'){var account=pfAccount.value.trim();if(!account){document.getElementById('err-pfAccount').textContent='Nhập SĐT, Email hoặc Username.';ok=false}}if(!ok)return;if(pfEnd.value<=pfStart.value){document.getElementById('err-pfEnd').textContent='Thời gian kết thúc phải sau thời gian áp dụng.';return}var unit=cmsAccGetMultiValues('pfUnit').join(', '),service=cmsAccGetMultiValues('pfService').join(', '),business=cmsAccGetMultiValues('pfBusiness').join(', ');var duplicate=cmsAccData.policies.some(function(r,i){return i!==window.cmsPolicyEdit&&r[0]===pfObject.value&&r[2]===service&&r[3]===business&&String(r[10])===pfPriority.value});if(duplicate){cmsSetAlert('policyAlert','error','Chính sách bị trùng phạm vi và mức ưu tiên.');return}var nets=Array.from(document.querySelectorAll('.pfNetwork')).map(function(x){return x.checked?'Có':'Không'});var objectValue=pfObject.value;var now=new Date(),startDate=new Date(pfStart.value),endDate=new Date(pfEnd.value),status=now<startDate?'Chờ áp dụng':(now>endDate?'Hết hiệu lực':'Hiệu lực');var row=[objectValue,unit,service,business,pfMethod.value].concat(nets,[+pfPriority.value,pfStart.value.replace('T',' '),pfEnd.value.replace('T',' '),status]);if(window.cmsPolicyEdit!=null)cmsAccData.policies[window.cmsPolicyEdit]=row;else cmsAccData.policies.push(row);window.cmsPolicyEdit=null;cmsSetAlert('policyAlert','success','Đã lưu chính sách hiển thị OTP.');cmsAccRender('otpPolicies')}
function cmsAccLookupUpdate(){if(!updUsername.value.trim()){cmsAccInfo('Nhập tên tài khoản cần tra cứu.');return}var detail=document.getElementById('accountUpdateDetail');if(detail)detail.classList.remove('hidden');cmsSetAlert('accountUpdateAlert','success','Đã tìm thấy tài khoản.');var updateResult=document.getElementById('accountUpdateResult');if(updateResult)updateResult.classList.remove('hidden');updFullName.value='Trần Thúy Hồng';updEmail.value='hongtt@vtc.vn';if(window.updEmailVerified)updEmailVerified.checked=true;updPhone.value='0936168687';if(window.updPhoneVerified)updPhoneVerified.checked=true}
function cmsAccSaveUpdate(){var ids=['updUsername','updFullName','updEmail','updPhone'],ok=true;ids.forEach(id=>{var e=document.getElementById(id),er=document.getElementById('err-'+id);var bad=!e.value.trim();er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});if(updEmail.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updEmail.value)){document.getElementById('err-updEmail').textContent='Email không đúng định dạng.';ok=false}if(updPhone.value&&!/^0\d{9}$/.test(updPhone.value)){document.getElementById('err-updPhone').textContent='Số điện thoại gồm 10 số và bắt đầu bằng 0.';ok=false}if(ok)cmsAccConfirm('Lưu lại','Xác nhận cập nhật thông tin tài khoản?',()=>cmsSetAlert('accountUpdateAlert','success','Cập nhật thông tin tài khoản thành công.'))}
function cmsAccLookupReset(){if(!resetUsername.value.trim()){cmsSetAlert('resetPassAlert','error','Nhập tên tài khoản.');return}cmsSetAlert('resetPassAlert','success','Đã tìm thấy tài khoản.');var fullName=document.getElementById('resetFullName');if(fullName)fullName.value='Trần Thúy Hồng';var f=document.getElementById('resetPasswordForm');if(f)f.classList.remove('hidden')}
function cmsAccResetPassword(){var p=resetPassword.value,u=resetUsername.value;if(!u){document.getElementById('err-resetUsername').textContent='Trường bắt buộc.';return}var rule=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/;if(!rule.test(p)){document.getElementById('err-resetPassword').textContent='Mật khẩu 8 đến 32 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';return}cmsAccConfirm('Đặt mật khẩu mới','Xác nhận đặt mật khẩu mới cho tài khoản '+u+'?',()=>cmsSetAlert('resetPassAlert','success','Đặt mật khẩu mới thành công.'))}
function cmsAccResetForm(type){var map={reset:['resetUsername','resetFullName','resetPassword'],policy:['pfObject','pfAccount','pfMethod','pfUnit','pfService','pfPriority','pfBusiness','pfStart','pfEnd','pfDayMax','pfMonthMax'],update:['updUsername','updFullName','updDob','updGender','updIdNo','updAddress','updEmail','updEmailVerified','updPhone','updPhoneVerified']};(map[type]||[]).forEach(id=>{var e=document.getElementById(id);if(e){if(e.type==='checkbox')e.checked=false;else e.value='';}var er=document.getElementById('err-'+id);if(er)er.textContent=''});if(type==='update'){var r=document.getElementById('accountUpdateResult');if(r)r.classList.add('hidden');var d=document.getElementById('accountUpdateDetail');if(d)d.classList.add('hidden');}if(type==='reset'){var f=document.getElementById('resetPasswordForm');if(f)f.classList.add('hidden');}if(type==='policy'){['pfUnit','pfService','pfBusiness'].forEach(function(id){document.querySelectorAll('[data-multi="'+id+'"]').forEach(function(x){x.checked=false});cmsAccUpdateMulti(id)});document.querySelectorAll('.pfNetwork').forEach(function(x,i){x.checked=i<3});cmsAccPolicyObjectChanged();}
['resetPassAlert','policyAlert','accountUpdateAlert'].forEach(id=>{var e=document.getElementById(id);if(e)e.className='account-alert',e.textContent=''})}

var cmsSecurityRows=[
 {name:'Xác minh 2 bước',enabled:true,updated:'17/07/2026 08:45:12'},
 {name:'OTP SMS',enabled:true,updated:'15/07/2026 14:20:08'},
 {name:'OTP Voice',enabled:false,updated:'10/07/2026 09:12:34'},
 {name:'OTP Email',enabled:true,updated:'12/07/2026 16:05:41'},
 {name:'OTP App',enabled:false,updated:'08/07/2026 11:30:19'}
];
function cmsAccLookupSecurity(){
 var input=document.getElementById('securityAccount'),value=input?input.value.trim():'';
 if(!value){cmsSetAlert('securityLookupAlert','error','Nhập tài khoản cần tra cứu.');document.getElementById('securityLookupResult').classList.add('hidden');return}
 cmsSetAlert('securityLookupAlert','success','Đã tìm thấy thông tin bảo mật của tài khoản '+value+'.');
 document.getElementById('securityLookupResult').classList.remove('hidden');cmsAccRenderSecurity();
}
function cmsAccRenderSecurity(){
 var body=document.getElementById('securityLookupBody');if(!body)return;
 body.innerHTML=cmsSecurityRows.map(function(row,index){return '<tr><td>'+(index+1)+'</td><td>'+row.name+'</td><td><span class="security-status '+(row.enabled?'on':'off')+'">'+(row.enabled?'Bật':'Tắt')+'</span></td><td><button type="button" class="security-toggle '+(row.enabled?'off':'on')+'" onclick="cmsAccToggleSecurity('+index+')"><i class="fa '+(row.enabled?'fa-toggle-off':'fa-toggle-on')+'"></i> '+(row.enabled?'Tắt':'Bật')+'</button></td><td>'+row.updated+'</td></tr>'}).join('');
}
function cmsAccToggleSecurity(index){
 var row=cmsSecurityRows[index],account=(document.getElementById('securityAccount')||{}).value||'';
 cmsAccConfirm('Xác nhận hành động','Bạn xác nhận '+(row.enabled?'tắt ':'bật ')+row.name+' cho tài khoản '+account+'?',function(){row.enabled=!row.enabled;row.updated=new Date().toLocaleString('vi-VN');cmsAccRenderSecurity();cmsSetAlert('securityLookupAlert','success','Đã '+(row.enabled?'bật ':'tắt ')+row.name+'.')});
}

function cmsOpenIdentityHistory(){
 var modal=document.getElementById('identityHistoryModal');
 if(modal) modal.classList.add('show');
}
function cmsCloseIdentityHistory(){
 var modal=document.getElementById('identityHistoryModal');
 if(modal) modal.classList.remove('show');
}
document.addEventListener('DOMContentLoaded',cmsAccBuildScreens);

/* Loyalty T-EXP rate */
var cmsTexpUnits=['Tất cả','Tổng công ty VTC','VTC Intecom','VTC Mobile','VTC Digital','Viện Giáo dục và Đào tạo số VTC'];
var cmsTexpTransactions=['Tất cả','Nạp Point','Thanh toán/Mua hàng'];
var cmsTexpDomesticBanks=['VCB','CTG','TCB','BIDV','VARB','NVB','STB','ACB','MB','TPB','SVB','VIB','VPB','SHB','EIB','BVB','VCCB','SCB','VRB','ABB','PVCB','MBV','NAB','HDB','VB','CFC','PBVN','HLB','PGB','COB','CIMB','IVB','Vikki','GPB','NASB','VAB','SGB','MSB','LPB','KLB','IBKHN','IBKHCM','WOO','SEAB','UOB','OCB','MAFC','KEBHANAHCM','KEBHANAHN','STANDARD','CAKE','Ubank','NonghyupBankHN','KBHN','KBHCM','DBS','CBB','KBankHCM','HSBC','TIMO','CITI','VNPTMONEY','VTLMONEY','VBSP','PVcomBankPay','BNPPARIBASHN','BNPPARIBASHCM','CUBHCM','BIDC','SVFC','BOCHK','VikkiHDBANK','Umee','Liobank','MVAS'];
var cmsTexpInternationalCards=['Visa','Mastercard','JCB'];
var cmsTexpPayments=['Tất cả','Số dư MyVTC','Thẻ Vcoin','Ví điện tử VTC Pay','Chuyển khoản'].concat(cmsTexpDomesticBanks,cmsTexpInternationalCards);
var cmsTexpRows=[
 {transaction:'Nạp Point',payment:'Thẻ Vcoin',unit:'Tổng công ty VTC',product:'Dịch Vụ Scoin',value:10,status:'Hiệu lực',start:'2026-07-01T00:00',end:'2026-12-31T23:59'},
 {transaction:'Thanh toán/Mua hàng',payment:'Số dư MyVTC',unit:'VTC Intecom',product:'Au Mobile',value:5,status:'Chờ áp dụng',start:'2026-08-01T00:00',end:'2026-12-31T23:59'},
 {transaction:'Nạp Point',payment:'Ví điện tử VTC Pay',unit:'VTC Mobile',product:'Truy Kích',value:8,status:'Tạm dừng',start:'2026-06-01T00:00',end:'2026-10-31T23:59'},
 {transaction:'Thanh toán/Mua hàng',payment:'Chuyển khoản',unit:'VTC Digital',product:'Trang chủ VTC.VN',value:3,status:'Hết hiệu lực',start:'2026-01-01T00:00:00',end:'2026-06-30T23:59:59'},
 {transaction:'Thanh toán/Mua hàng',payment:'VCB',unit:'Viện Giáo dục và Đào tạo số VTC',product:'Đào tạo số edu.vtc.vn',value:6,status:'Hiệu lực',start:'2026-07-10T00:00',end:'2027-01-10T23:59'},
 {transaction:'Nạp Point',payment:'Số dư MyVTC',unit:'VTC Intecom',product:'Tập kích',value:7,status:'Hiệu lực',start:'2026-07-15T00:00',end:'2026-11-30T23:59'},
 {transaction:'Nạp Point',payment:'Chuyển khoản',unit:'VTC Digital',product:'TS Origin',value:9,status:'Chờ áp dụng',start:'2026-09-01T00:00',end:'2027-02-28T23:59'},
 {transaction:'Thanh toán/Mua hàng',payment:'Thẻ Vcoin',unit:'VTC Mobile',product:'Đại Chiến Tam Quốc',value:4,status:'Hiệu lực',start:'2026-07-05T00:00',end:'2026-12-05T23:59'},
 {transaction:'Tất cả',payment:'Ví điện tử VTC Pay, Chuyển khoản',unit:'Tổng công ty VTC',product:'Web VTCGame – Thông tin tài khoản',value:12,status:'Tạm dừng',start:'2026-05-01T00:00',end:'2026-12-31T23:59'},
 {transaction:'Nạp Point',payment:'TCB',unit:'VTC Intecom',product:'Au Top',value:11,status:'Hiệu lực',start:'2026-07-20T00:00',end:'2027-01-20T23:59'},
 {transaction:'Thanh toán/Mua hàng',payment:'Số dư MyVTC, Thẻ Vcoin',unit:'VTC Mobile',product:'Phong Vân Chí',value:5,status:'Hết hiệu lực',start:'2025-12-01T00:00',end:'2026-06-30T23:59'},
 {transaction:'Tất cả',payment:'Tất cả',unit:'Viện Giáo dục và Đào tạo số VTC',product:'Tất cả',value:2,status:'Chờ áp dụng',start:'2026-10-01T00:00',end:'2027-03-31T23:59'}
];
var cmsTexpState={page:1,size:10,hiddenColumns:new Set(),editIndex:null};
function cmsTexpInit(){
 var unit=document.getElementById('texpUnitFilter');if(!unit)return;
 unit.innerHTML=cmsAccMultiFilter('Đơn vị','texpUnit',cmsTexpUnits);
 document.getElementById('texpProductFilter').innerHTML=cmsAccMultiFilter('Sản phẩm','texpProductFilterValue',['Tất cả'].concat(cmsAccProducts));
 document.getElementById('texpTransactionFilter').innerHTML=cmsAccMultiFilter('Loại giao dịch','texpTransactionFilterValue',cmsTexpTransactions);
 document.getElementById('texpPaymentFilter').innerHTML=cmsTexpPaymentMultiFilter('Hình thức thanh toán','texpPaymentFilterValue');
 document.getElementById('texpTransactionControl').innerHTML=cmsAccMultiFilter('','texpTransactionForm',cmsTexpTransactions);
 document.getElementById('texpPaymentControl').innerHTML=cmsTexpPaymentMultiFilter('','texpPaymentForm');
 document.getElementById('texpUnitControl').innerHTML=cmsAccMultiFilter('','texpUnitForm',cmsTexpUnits);
 document.getElementById('texpProductControl').innerHTML=cmsAccMultiFilter('','texpProductForm',['Tất cả'].concat(cmsAccProducts));
 cmsTexpRender();
}
function cmsTexpPaymentMultiFilter(label,id){
 var normal=['Số dư MyVTC','Thẻ Vcoin','Ví điện tử VTC Pay','Chuyển khoản'];
 function option(value,extraClass){return '<label class="'+(extraClass||'')+'"><input type="checkbox" data-multi="'+id+'" value="'+value+'" onchange="cmsTexpPaymentChildChanged(\''+id+'\')"> '+value+'</label>'}
 return '<div class="acc-multi-filter texp-payment-multi"><span>'+label+'</span><details ontoggle="cmsAccMultiToggle(this)"><summary id="'+id+'Summary">Tất cả</summary><div class="acc-multi-options"><label class="acc-multi-all"><input type="checkbox" checked onchange="cmsTexpTogglePaymentAll(\''+id+'\',this)"> Tất cả</label>'+normal.map(function(x){return option(x,'texp-payment-root')}).join('')+'<label class="texp-payment-group"><input type="checkbox" data-payment-group="domestic" onchange="cmsTexpTogglePaymentGroup(\''+id+'\',\'domestic\',this)"> Ngân hàng nội địa</label><div class="texp-payment-children">'+cmsTexpDomesticBanks.map(function(x){return option(x,'texp-payment-child')}).join('')+'</div><label class="texp-payment-group"><input type="checkbox" data-payment-group="international" onchange="cmsTexpTogglePaymentGroup(\''+id+'\',\'international\',this)"> Thẻ quốc tế</label><div class="texp-payment-children">'+cmsTexpInternationalCards.map(function(x){return option(x,'texp-payment-child')}).join('')+'</div></div></details></div>'
}
function cmsTexpPaymentGroupValues(group){return group==='domestic'?cmsTexpDomesticBanks:cmsTexpInternationalCards}
function cmsTexpTogglePaymentAll(id,check){document.querySelectorAll('[data-multi="'+id+'"]').forEach(function(x){x.checked=false});document.querySelectorAll('#'+id+'Summary').forEach(function(){});var wrap=document.getElementById(id+'Summary');var root=wrap&&wrap.closest('.acc-multi-filter');if(root)root.querySelectorAll('[data-payment-group]').forEach(function(x){x.checked=false;x.indeterminate=false});cmsAccToggleMultiAll(id,check)}
function cmsTexpTogglePaymentGroup(id,group,check){var values=cmsTexpPaymentGroupValues(group);document.querySelectorAll('[data-multi="'+id+'"]').forEach(function(x){if(values.indexOf(x.value)>=0)x.checked=check.checked});var all=document.querySelector('.texp-payment-multi input[onchange*="cmsTexpTogglePaymentAll(\''+id+'\'"]');if(all)all.checked=false;cmsTexpSyncPaymentGroups(id);cmsAccUpdateMulti(id)}
function cmsTexpPaymentChildChanged(id){var all=document.querySelector('.texp-payment-multi input[onchange*="cmsTexpTogglePaymentAll(\''+id+'\'"]');if(all)all.checked=false;cmsTexpSyncPaymentGroups(id);cmsAccUpdateMulti(id)}
function cmsTexpSyncPaymentGroups(id){var summary=document.getElementById(id+'Summary'),root=summary&&summary.closest('.acc-multi-filter');if(!root)return;['domestic','international'].forEach(function(group){var values=cmsTexpPaymentGroupValues(group),boxes=Array.from(root.querySelectorAll('[data-multi="'+id+'"]')).filter(function(x){return values.indexOf(x.value)>=0}),selected=boxes.filter(function(x){return x.checked}).length,groupBox=root.querySelector('[data-payment-group="'+group+'"]');if(groupBox){groupBox.checked=selected===boxes.length&&boxes.length>0;groupBox.indeterminate=selected>0&&selected<boxes.length}})}
function cmsTexpSelected(id){var values=cmsAccGetMultiValues(id);return values.length&&values.indexOf('Tất cả')<0?values:null}
function cmsTexpRender(){
 var body=document.getElementById('texpTableBody');if(!body)return;
 var units=cmsTexpSelected('texpUnit'),products=cmsTexpSelected('texpProductFilterValue'),transactions=cmsTexpSelected('texpTransactionFilterValue'),payments=cmsTexpSelected('texpPaymentFilterValue');
 var q=((document.getElementById('texpQuickSearch')||{}).value||'').trim().toLowerCase();
 var indexed=cmsTexpRows.map(function(row,index){return {row:row,index:index}}).filter(function(item){var r=item.row;return (!units||units.some(function(v){return r.unit.indexOf(v)>=0}))&&(!products||products.some(function(v){return r.product.indexOf(v)>=0}))&&(!transactions||transactions.some(function(v){return r.transaction.indexOf(v)>=0}))&&(!payments||payments.some(function(v){return r.payment.indexOf(v)>=0}))&&(!q||[r.transaction,r.payment,r.unit,r.product,r.value,r.status].join(' ').toLowerCase().indexOf(q)>=0)});
 var pages=Math.max(1,Math.ceil(indexed.length/cmsTexpState.size));cmsTexpState.page=Math.min(cmsTexpState.page,pages);var offset=(cmsTexpState.page-1)*cmsTexpState.size;var pageRows=indexed.slice(offset,offset+cmsTexpState.size);
 body.innerHTML=pageRows.map(function(item,i){var r=item.row,actions='<button class="icon-square orange" title="Cập nhật" onclick="cmsTexpOpenForm('+item.index+')"><i class="fa fa-edit"></i></button> ';if(r.status==='Hiệu lực')actions+='<button class="icon-square red" title="Dừng chính sách" onclick="cmsTexpStop('+item.index+')"><i class="fa fa-stop"></i></button> ';if(r.status==='Hết hiệu lực')actions+='<button class="icon-square red" title="Xóa" onclick="cmsTexpDelete('+item.index+')"><i class="fa fa-trash"></i></button>';return '<tr><td>'+(offset+i+1)+'</td><td>'+r.transaction+'</td><td>'+r.payment+'</td><td>'+r.unit+'</td><td>'+r.product+'</td><td>'+r.value+'</td><td><span class="texp-table-status '+cmsTexpStatusClass(r.status)+'">'+r.status+'</span></td><td class="action-cell">'+actions+'</td></tr>'}).join('')||'<tr><td colspan="8" style="text-align:center">Không có dữ liệu</td></tr>';
 document.getElementById('texpPageInfo').textContent='Hiển thị '+pageRows.length+' / '+indexed.length+' bản ghi';document.getElementById('texpPager').innerHTML='<button onclick="cmsTexpPage('+(cmsTexpState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,i){return '<button class="'+(i+1===cmsTexpState.page?'active':'')+'" onclick="cmsTexpPage('+(i+1)+')">'+(i+1)+'</button>'}).join('')+'<button onclick="cmsTexpPage('+(cmsTexpState.page+1)+')">Tiếp</button>';cmsTexpApplyColumns();
}
function cmsTexpStatusClass(status){return status==='Hiệu lực'?'texp-status-active':status==='Chờ áp dụng'?'texp-status-waiting':status==='Hết hiệu lực'?'texp-status-expired':'texp-status-paused'}
function cmsTexpPage(page){var pages=Math.max(1,Math.ceil(cmsTexpRows.length/cmsTexpState.size));if(page>0&&page<=pages){cmsTexpState.page=page;cmsTexpRender()}}
function cmsTexpSetLocked(id,locked){var wrap=document.getElementById(id+'Control');if(!wrap)return;wrap.classList.toggle('is-disabled',locked);var details=wrap.querySelector('details');if(details){details.style.pointerEvents=locked?'none':'';if(locked)details.removeAttribute('open')}wrap.querySelectorAll('input').forEach(function(x){x.disabled=locked})}
function cmsTexpOpenForm(index){
 cmsTexpState.editIndex=typeof index==='number'?index:null;showScreen('loyalty-texp-form');cmsTexpResetForm(false);
 var editing=cmsTexpState.editIndex!==null,title=document.getElementById('texpFormTitle');title.textContent=editing?'Cập nhật cấu hình':'Thêm mới cấu hình';
 ['texpTransaction','texpPayment','texpUnit'].forEach(function(id){cmsTexpSetLocked(id,editing)});cmsTexpSetLocked('texpProduct',false);
 if(editing){var r=cmsTexpRows[cmsTexpState.editIndex];cmsAccSetMultiValues('texpTransactionForm',r.transaction);cmsAccSetMultiValues('texpPaymentForm',r.payment);cmsTexpSyncPaymentGroups('texpPaymentForm');cmsAccSetMultiValues('texpUnitForm',r.unit);cmsAccSetMultiValues('texpProductForm',r.product);texpValue.value=r.value;texpStart.value=r.start;texpEnd.value=r.end}
}
function cmsTexpResetForm(clearMode){
 ['texpTransactionForm','texpPaymentForm','texpUnitForm','texpProductForm'].forEach(function(id){cmsAccSetMultiValues(id,'Tất cả');var er=document.getElementById('err-'+id);if(er)er.textContent=''});
 ['texpValue','texpStart','texpEnd'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';var er=document.getElementById('err-'+id);if(er)er.textContent=''});
 var alert=document.getElementById('texpFormAlert');if(alert){alert.className='account-alert';alert.textContent=''}
 if(clearMode!==false&&cmsTexpState.editIndex!==null){var r=cmsTexpRows[cmsTexpState.editIndex];cmsAccSetMultiValues('texpTransactionForm',r.transaction);cmsAccSetMultiValues('texpPaymentForm',r.payment);cmsTexpSyncPaymentGroups('texpPaymentForm');cmsAccSetMultiValues('texpUnitForm',r.unit);cmsAccSetMultiValues('texpProductForm',r.product);texpValue.value=r.value;texpStart.value=r.start;texpEnd.value=r.end}
}
function cmsTexpFormValue(id){var values=cmsAccGetMultiValues(id);return values.indexOf('Tất cả')>=0?'Tất cả':values.join(', ')}
function cmsTexpSave(){
 var multiIds=['texpTransactionForm','texpPaymentForm','texpUnitForm','texpProductForm'],ok=true;multiIds.forEach(function(id){var values=cmsAccGetMultiValues(id),er=document.getElementById('err-'+id),bad=!values.length;er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});
 ['texpValue','texpStart','texpEnd'].forEach(function(id){var e=document.getElementById(id),er=document.getElementById('err-'+id),bad=!String(e.value||'').trim();er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});if(!ok)return;
 if(+texpValue.value<=0){document.getElementById('err-texpValue').textContent='Giá trị quy đổi phải lớn hơn 0.';return}if(texpEnd.value<=texpStart.value){document.getElementById('err-texpEnd').textContent='Kết thúc ngày phải sau Áp dụng ngày.';return}
 var status=new Date(texpStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực';var row={transaction:cmsTexpFormValue('texpTransactionForm'),payment:cmsTexpFormValue('texpPaymentForm'),unit:cmsTexpFormValue('texpUnitForm'),product:cmsTexpFormValue('texpProductForm'),value:+texpValue.value,status:status,start:texpStart.value,end:texpEnd.value};if(cmsTexpState.editIndex!==null){var old=cmsTexpRows[cmsTexpState.editIndex];row.transaction=old.transaction;row.payment=old.payment;row.unit=old.unit;row.status=old.status;cmsTexpRows[cmsTexpState.editIndex]=row}else cmsTexpRows.push(row);cmsSetAlert('texpFormAlert','success','Đã lưu cấu hình T-EXP.');cmsTexpRender();
}
function cmsTexpStop(index){cmsAccConfirm('Dừng chính sách','Bạn xác nhận dừng chính sách T-EXP này?',function(){cmsTexpRows[index].status='Tạm dừng';cmsTexpRender()})}
function cmsTexpDelete(index){cmsAccConfirm('Xóa chính sách','Bạn xác nhận xóa chính sách T-EXP đã hết hiệu lực?',function(){cmsTexpRows.splice(index,1);cmsTexpRender()})}
function cmsTexpApplyColumns(){var table=document.getElementById('texpTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=cmsTexpState.hiddenColumns.has(i)?'none':''})})}
function cmsTexpColumns(btn){
 var old=document.querySelector('.column-panel[data-table-id="texpTable"]');cmsAccCloseColumns();if(old)return;var table=document.getElementById('texpTable');if(!table)return;var panel=document.createElement('div');panel.className='column-panel';panel.dataset.tableId='texpTable';panel.innerHTML='<div class="column-panel-title">Chọn cột hiển thị</div>';btn.dataset.columnPickerButton='true';Array.from(table.tHead.rows[0].cells).forEach(function(th,i){var label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=!cmsTexpState.hiddenColumns.has(i);check.onchange=function(){if(check.checked)cmsTexpState.hiddenColumns.delete(i);else cmsTexpState.hiddenColumns.add(i);cmsTexpApplyColumns()};label.append(check,document.createTextNode(th.textContent.trim()));panel.append(label)});document.body.append(panel);var r=btn.getBoundingClientRect(),w=panel.offsetWidth||240,h=panel.offsetHeight||300;panel.style.left=Math.min(Math.max(8,r.left),window.innerWidth-w-8)+'px';panel.style.top=(r.bottom+6+h>window.innerHeight?Math.max(8,r.top-h-6):r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',cmsAccOutsideColumns);document.addEventListener('keydown',cmsAccEscapeColumns)},0)
}
document.addEventListener('DOMContentLoaded',cmsTexpInit);


/* Loyalty A-EXP rate */
var cmsAexpEvents=['Đăng nhập hàng ngày','Liên kết Google','Liên kết Apple','Xác minh email','Xác minh eKYC','Liên kết tài khoản ngân hàng','Bật thông báo (Push Notification)','Xem nội dung / bài viết','Sinh nhật','Kỷ niệm ngày mở tài khoản','Giới thiệu bạn bè','Được bạn bè giới thiệu','Chuỗi đăng nhập 7 ngày','Chuỗi đăng nhập 30 ngày'];
var cmsAexpRows=[
{name:'Điểm danh nhận A-EXP',unit:'Tất cả',product:'Tất cả',event:'Đăng nhập hàng ngày',value:1,limit:1,period:'Ngày',start:'2026-07-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực'},
{name:'Thưởng liên kết Google',unit:'Tổng công ty VTC',product:'Tất cả',event:'Liên kết Google',value:20,limit:1,period:'Năm',start:'2026-08-01T00:00:00',end:'2027-07-31T23:59:59',status:'Chờ áp dụng'},
{name:'Thưởng xác minh eKYC',unit:'VTC Intecom',product:'Au Mobile',event:'Xác minh eKYC',value:50,limit:1,period:'Năm',start:'2026-01-01T00:00',end:'2026-06-30T23:59',status:'Hết hiệu lực'},
{name:'Thưởng giới thiệu bạn bè',unit:'VTC Mobile',product:'Truy Kích',event:'Giới thiệu bạn bè',value:30,limit:10,period:'Tháng',start:'2026-07-10T00:00:00',end:'2026-12-31T23:59:59',status:'Tạm dừng'}
];
var cmsAexpState={page:1,size:10,hiddenColumns:new Set(),editIndex:null};
function cmsAexpInit(){
 var u=document.getElementById('aexpUnitFilter');if(!u)return;
 u.innerHTML=cmsAccMultiFilter('Đơn vị','aexpUnitFilterValue',cmsTexpUnits);
 document.getElementById('aexpProductFilter').innerHTML=cmsAccMultiFilter('Sản phẩm','aexpProductFilterValue',['Tất cả'].concat(cmsAccProducts));
 var opts='<option value="">Tất cả</option>'+cmsAexpEvents.map(function(x){return '<option>'+x+'</option>'}).join('');
 document.getElementById('aexpEventFilter').innerHTML=opts;
 document.getElementById('aexpEventForm').innerHTML=cmsAexpEvents.map(function(x){return '<option>'+x+'</option>'}).join('');
 document.getElementById('aexpUnitControl').innerHTML=cmsAccMultiFilter('','aexpUnitForm',cmsTexpUnits);
 document.getElementById('aexpProductControl').innerHTML=cmsAccMultiFilter('','aexpProductForm',['Tất cả'].concat(cmsAccProducts));
 cmsAexpRender();
}
function cmsAexpMultiValue(id){var v=cmsAccGetMultiValues(id);return !v.length||v.indexOf('Tất cả')>=0?'Tất cả':v.join(', ')}
function cmsAexpMatchMulti(rowValue,id){var v=cmsAccGetMultiValues(id);return !v.length||v.indexOf('Tất cả')>=0||v.some(function(x){return rowValue.indexOf(x)>=0})}
function cmsAexpFormatDate(v){if(!v)return '';var d=new Date(v);if(isNaN(d))return v;var p=function(n){return String(n).padStart(2,'0')};return p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+d.getFullYear()+' '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds())}
function cmsAexpStatusClass(s){return s==='Hiệu lực'?'texp-status-active':s==='Chờ áp dụng'?'texp-status-waiting':s==='Hết hiệu lực'?'texp-status-expired':'texp-status-paused'}
function cmsAexpFiltered(){var kw=((document.getElementById('aexpKeyword')||{}).value||'').toLowerCase(),quick=((document.getElementById('aexpQuickSearch')||{}).value||'').toLowerCase(),ev=(document.getElementById('aexpEventFilter')||{}).value||'',st=(document.getElementById('aexpStatusFilter')||{}).value||'';return cmsAexpRows.map(function(r,i){return {row:r,index:i}}).filter(function(x){var r=x.row,t=Object.values(r).join(' ').toLowerCase();return (!kw||t.indexOf(kw)>=0)&&(!quick||t.indexOf(quick)>=0)&&cmsAexpMatchMulti(r.unit,'aexpUnitFilterValue')&&cmsAexpMatchMulti(r.product,'aexpProductFilterValue')&&(!ev||r.event===ev)&&(!st||r.status===st)})}
function cmsAexpSearch(){cmsAexpState.page=1;cmsAexpRender()}
function cmsAexpRender(){var body=document.getElementById('aexpTableBody');if(!body)return;var rows=cmsAexpFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsAexpState.size));if(cmsAexpState.page>pages)cmsAexpState.page=pages;var off=(cmsAexpState.page-1)*cmsAexpState.size,part=rows.slice(off,off+cmsAexpState.size);body.innerHTML=part.map(function(x,i){var r=x.row,a='<button class="icon-square orange" title="Cập nhật" onclick="cmsAexpOpenForm('+x.index+')"><i class="fa fa-edit"></i></button> ';if(r.status==='Hiệu lực'||r.status==='Chờ áp dụng')a+='<button class="icon-square red" title="Hủy" onclick="cmsAexpCancel('+x.index+')"><i class="fa fa-ban"></i></button> ';a+='<button class="icon-square red" title="Xóa" onclick="cmsAexpDelete('+x.index+')"><i class="fa fa-trash"></i></button>';return '<tr><td>'+(off+i+1)+'</td><td>'+r.name+'</td><td>'+r.unit+'</td><td>'+r.product+'</td><td>'+r.event+'</td><td>'+r.value+'</td><td>'+r.limit+' / '+r.period+'</td><td>'+cmsAexpFormatDate(r.start)+'</td><td>'+cmsAexpFormatDate(r.end)+'</td><td><span class="texp-table-status '+cmsAexpStatusClass(r.status)+'">'+r.status+'</span></td><td class="action-cell">'+a+'</td></tr>'}).join('')||'<tr><td colspan="11" style="text-align:center">Không có dữ liệu</td></tr>';document.getElementById('aexpPageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsAexpState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';var p=document.getElementById('aexpPager');p.innerHTML='<button '+(cmsAexpState.page===1?'disabled':'')+' onclick="cmsAexpPage('+(cmsAexpState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsAexpState.page?'active':'')+'" onclick="cmsAexpPage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsAexpState.page===pages?'disabled':'')+' onclick="cmsAexpPage('+(cmsAexpState.page+1)+')">Tiếp</button>';cmsAexpApplyColumns()}
function cmsAexpPage(p){cmsAexpState.page=p;cmsAexpRender()}
function cmsAexpOpenForm(index){cmsAexpState.editIndex=typeof index==='number'?index:null;showScreen('loyalty-aexp-form');cmsAexpResetForm(false);var edit=cmsAexpState.editIndex!==null,r=edit?cmsAexpRows[cmsAexpState.editIndex]:null;document.getElementById('aexpFormTitle').textContent=edit?'Cập nhật thiết lập':'Thêm mới thiết lập';if(r){aexpName.value=r.name;aexpEventForm.value=r.event;aexpValue.value=r.value;aexpLimit.value=r.limit;aexpLimitPeriod.value=r.period;aexpStart.value=r.start;aexpEnd.value=r.end;cmsAccSetMultiValues('aexpUnitForm',r.unit);cmsAccSetMultiValues('aexpProductForm',r.product)}['aexpEventForm','aexpUnitControl','aexpProductControl'].forEach(function(id){var el=document.getElementById(id);if(el){if(el.tagName==='SELECT')el.disabled=edit;else{el.classList.toggle('is-disabled',edit);el.querySelectorAll('input').forEach(function(x){x.disabled=edit});var d=el.querySelector('details');if(d)d.ontoggle=edit?function(){this.open=false}:null}}})}
function cmsAexpResetForm(clearMode){['aexpName','aexpValue','aexpLimit','aexpStart','aexpEnd'].forEach(function(id){var e=document.getElementById(id);if(e)e.value=''});cmsAccSetMultiValues('aexpUnitForm','Tất cả');cmsAccSetMultiValues('aexpProductForm','Tất cả');var ev=document.getElementById('aexpEventForm');if(ev)ev.selectedIndex=0;var lp=document.getElementById('aexpLimitPeriod');if(lp)lp.value='Ngày';document.querySelectorAll('#screen-loyalty-aexp-form .field-error').forEach(function(e){e.textContent=''});cmsSetAlert('aexpFormAlert','','');if(clearMode!==false)cmsAexpState.editIndex=null}
function cmsAexpSave(){var ids=['aexpName','aexpEventForm','aexpValue','aexpLimit','aexpStart','aexpEnd'],ok=true;ids.forEach(function(id){var e=document.getElementById(id),er=document.getElementById('err-'+id);var bad=!e||!String(e.value).trim();if(er)er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});var unit=cmsAexpMultiValue('aexpUnitForm'),product=cmsAexpMultiValue('aexpProductForm');if(!unit){document.getElementById('err-aexpUnitForm').textContent='Trường bắt buộc.';ok=false}if(!product){document.getElementById('err-aexpProductForm').textContent='Trường bắt buộc.';ok=false}if(aexpStart.value&&aexpEnd.value&&new Date(aexpEnd.value)<=new Date(aexpStart.value)){document.getElementById('err-aexpEnd').textContent='Ngày kết thúc phải sau ngày áp dụng.';ok=false}if(!ok)return;var status=new Date(aexpStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực',row={name:aexpName.value.trim(),event:aexpEventForm.value,unit:unit,product:product,value:+aexpValue.value,limit:+aexpLimit.value,period:aexpLimitPeriod.value,start:aexpStart.value,end:aexpEnd.value,status:status};if(cmsAexpState.editIndex!==null){var old=cmsAexpRows[cmsAexpState.editIndex];row.event=old.event;row.unit=old.unit;row.product=old.product;row.status=old.status;cmsAexpRows[cmsAexpState.editIndex]=row}else cmsAexpRows.push(row);cmsSetAlert('aexpFormAlert','success','Đã lưu thiết lập A-EXP.');cmsAexpRender()}
function cmsAexpCancel(i){cmsAccConfirm('Hủy thiết lập','Bạn xác nhận hủy thiết lập A-EXP này?',function(){cmsAexpRows[i].status='Tạm dừng';cmsAexpRender()})}
function cmsAexpDelete(i){cmsAccConfirm('Xóa thiết lập','Bạn xác nhận xóa thiết lập A-EXP này?',function(){cmsAexpRows.splice(i,1);cmsAexpRender()})}
function cmsAexpApplyColumns(){var table=document.getElementById('aexpTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(c,i){c.style.display=cmsAexpState.hiddenColumns.has(i)?'none':''})})}
function cmsAexpToggleColumns(btn){var old=document.getElementById('aexpColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='aexpColumnPicker';panel.className='column-picker show';document.querySelectorAll('#aexpTable thead th').forEach(function(th,i){if(i===10)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsAexpState.hiddenColumns.has(i);c.onchange=function(){if(c.checked)cmsAexpState.hiddenColumns.delete(i);else cmsAexpState.hiddenColumns.add(i);cmsAexpApplyColumns()};l.append(c,document.createTextNode(th.textContent.trim()));panel.append(l)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsAexpInit);


/* Loyalty member rank setting */
var cmsRankRows=[
{name:'Đồng',order:1,minExp:1,texpRate:0,maintainExp:1,description:'Hạng thành viên mặc định',start:'2026-01-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực',color:'#B87333',icon:'',balanceEnabled:false,balanceRate:0,voucherEnabled:false,voucher:''},
{name:'Bạc',order:2,minExp:500,texpRate:40,maintainExp:300,description:'Ưu đãi dành cho thành viên Bạc',start:'2026-08-01T00:00',end:'2027-07-31T23:59',status:'Chờ áp dụng',color:'#C0C0C0',icon:'',balanceEnabled:true,balanceRate:1,voucherEnabled:true,voucher:'Voucher giảm 10.000 VNĐ'},
{name:'Vàng',order:3,minExp:2000,texpRate:50,maintainExp:1200,description:'Ưu đãi dành cho thành viên Vàng',start:'2025-01-01T00:00',end:'2025-12-31T23:59',status:'Hết hiệu lực',color:'#FFD700',icon:'',balanceEnabled:true,balanceRate:2,voucherEnabled:true,voucher:'Voucher giảm 20%'},
{name:'Bạch Kim',order:4,minExp:5000,texpRate:60,maintainExp:3000,description:'Ưu đãi dành cho thành viên Bạch Kim',start:'2026-01-01T00:00',end:'2026-12-31T23:59',status:'Tạm dừng',color:'#E5E4E2',icon:'',balanceEnabled:true,balanceRate:3,voucherEnabled:true,voucher:'Voucher hoàn 50 Point'}
];
var cmsRankState={page:1,size:10,hiddenColumns:new Set(),editIndex:null};
function cmsRankStatusClass(s){return s==='Hiệu lực'?'texp-status-active':s==='Chờ áp dụng'?'texp-status-waiting':s==='Hết hiệu lực'?'texp-status-expired':'texp-status-paused'}
function cmsRankFiltered(){var st=(document.getElementById('rankStatusFilter')||{}).value||'',q=((document.getElementById('rankQuickSearch')||{}).value||'').toLowerCase();return cmsRankRows.map(function(r,i){return {row:r,index:i}}).filter(function(x){var t=Object.values(x.row).join(' ').toLowerCase();return (!st||x.row.status===st)&&(!q||t.indexOf(q)>=0)})}
function cmsRankSearch(){cmsRankState.page=1;cmsRankRender()}
function cmsRankRender(){var body=document.getElementById('rankTableBody');if(!body)return;var rows=cmsRankFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsRankState.size));if(cmsRankState.page>pages)cmsRankState.page=pages;var off=(cmsRankState.page-1)*cmsRankState.size,part=rows.slice(off,off+cmsRankState.size);body.innerHTML=part.map(function(x){var r=x.row,a='<button class="icon-square orange" title="Cập nhật" onclick="cmsRankOpenForm('+x.index+')"><i class="fa fa-edit"></i></button> ';if(r.status==='Hiệu lực'||r.status==='Chờ áp dụng')a+='<button class="icon-square red" title="Hủy" onclick="cmsRankCancel('+x.index+')"><i class="fa fa-ban"></i></button> ';a+='<button class="icon-square red" title="Xóa" onclick="cmsRankDelete('+x.index+')"><i class="fa fa-trash"></i></button>';return '<tr><td><span class="rank-name-cell"><span class="rank-color-dot" style="background:'+r.color+'"></span>'+r.name+'</span></td><td>'+r.order+'</td><td>'+r.minExp.toLocaleString('vi-VN')+'</td><td>'+r.maintainExp.toLocaleString('vi-VN')+'</td><td>'+r.description+'</td><td>'+cmsAexpFormatDate(r.start)+'</td><td>'+cmsAexpFormatDate(r.end)+'</td><td><span class="texp-table-status '+cmsRankStatusClass(r.status)+'">'+r.status+'</span></td><td class="action-cell">'+a+'</td></tr>'}).join('')||'<tr><td colspan="9" style="text-align:center">Không có dữ liệu</td></tr>';document.getElementById('rankPageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsRankState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';var p=document.getElementById('rankPager');p.innerHTML='<button '+(cmsRankState.page===1?'disabled':'')+' onclick="cmsRankPage('+(cmsRankState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsRankState.page?'active':'')+'" onclick="cmsRankPage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsRankState.page===pages?'disabled':'')+' onclick="cmsRankPage('+(cmsRankState.page+1)+')">Tiếp</button>';cmsRankApplyColumns()}
function cmsRankPage(p){cmsRankState.page=p;cmsRankRender()}
function cmsRankOpenForm(index){var edit=typeof index==='number';if(edit&&cmsRankRows[index].status!=='Chờ áp dụng'){cmsAccInfo('Chỉ được cập nhật cấu hình đang Chờ áp dụng.');return}cmsRankState.editIndex=edit?index:null;showScreen('loyalty-rank-form');cmsRankResetForm(false);document.getElementById('rankFormTitle').textContent=edit?'Cập nhật thiết lập':'Thêm mới thiết lập';if(edit){var r=cmsRankRows[index];rankName.value=r.name;rankColor.value=r.color;rankColorPicker.value=r.color;rankOrder.value=r.order;rankMinExp.value=r.minExp;rankTexpRate.value=r.texpRate;rankMaintainExp.value=r.maintainExp;rankDescription.value=r.description;rankStart.value=r.start;rankEnd.value=r.end;rankBalanceEnabled.checked=r.balanceEnabled;rankBalanceRate.value=r.balanceRate||'';rankVoucherEnabled.checked=r.voucherEnabled;rankVoucher.value=r.voucher||'';cmsRankToggleBenefitFields()}}
function cmsRankResetForm(clearMode){['rankName','rankOrder','rankMinExp','rankTexpRate','rankMaintainExp','rankBalanceRate','rankDescription','rankStart','rankEnd'].forEach(function(id){var e=document.getElementById(id);if(e)e.value=''});var icon=document.getElementById('rankIcon');if(icon)icon.value='';var preview=document.getElementById('rankIconPreview');if(preview)preview.innerHTML='<i class="fa fa-image"></i>';var color=document.getElementById('rankColor');if(color)color.value='#C0C0C0';var picker=document.getElementById('rankColorPicker');if(picker)picker.value='#c0c0c0';if(document.getElementById('rankBalanceEnabled'))rankBalanceEnabled.checked=false;if(document.getElementById('rankVoucherEnabled'))rankVoucherEnabled.checked=false;if(document.getElementById('rankVoucher'))rankVoucher.value='';cmsRankToggleBenefitFields();document.querySelectorAll('#screen-loyalty-rank-form .field-error').forEach(function(e){e.textContent=''});cmsSetAlert('rankFormAlert','','');if(clearMode!==false)cmsRankState.editIndex=null}
function cmsRankToggleBenefitFields(){var b=document.getElementById('rankBalanceEnabled'),v=document.getElementById('rankVoucherEnabled'),bd=document.getElementById('rankBalanceDetail'),vd=document.getElementById('rankVoucherDetail');if(bd)bd.classList.toggle('is-disabled',!b.checked);if(vd)vd.classList.toggle('is-disabled',!v.checked);if(document.getElementById('rankBalanceRate'))rankBalanceRate.disabled=!b.checked;if(document.getElementById('rankVoucher'))rankVoucher.disabled=!v.checked}
function cmsRankSyncColor(v){if(/^#[0-9A-Fa-f]{6}$/.test(v))rankColorPicker.value=v}
function cmsRankPickColor(v){rankColor.value=v.toUpperCase()}
function cmsRankPreviewIcon(input){var p=document.getElementById('rankIconPreview'),f=input.files&&input.files[0];if(!p||!f)return;var reader=new FileReader();reader.onload=function(e){p.innerHTML='<img alt="Biểu tượng hạng" src="'+e.target.result+'">'};reader.readAsDataURL(f)}
function cmsRankPositive(id,label,allowZero){var e=document.getElementById(id),er=document.getElementById('err-'+id),v=Number(e.value),bad=!String(e.value).trim()||!Number.isInteger(v)||(allowZero?v<0:v<=0);if(er)er.textContent=bad?label+' phải là số nguyên '+(allowZero?'không âm.':'dương.'):'';return !bad}
function cmsRankSave(){var ok=true;['rankName','rankColor','rankStart','rankEnd'].forEach(function(id){var e=document.getElementById(id),er=document.getElementById('err-'+id),bad=!e.value.trim();if(er)er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});if(!/^#[0-9A-Fa-f]{6}$/.test(rankColor.value)){document.getElementById('err-rankColor').textContent='Nhập mã HEX theo định dạng #RRGGBB.';ok=false}ok=cmsRankPositive('rankOrder','Thứ tự hạng',false)&&ok;ok=cmsRankPositive('rankMinExp','EXP tối thiểu',false)&&ok;ok=cmsRankPositive('rankMaintainExp','EXP duy trì',false)&&ok;var tr=Number(rankTexpRate.value);if(rankTexpRate.value===''||tr<0||tr>100){document.getElementById('err-rankTexpRate').textContent='Tỉ lệ phải từ 0 đến 100.';ok=false}else document.getElementById('err-rankTexpRate').textContent='';if(rankBalanceEnabled.checked&&(rankBalanceRate.value===''||Number(rankBalanceRate.value)<0||Number(rankBalanceRate.value)>100)){document.getElementById('err-rankBenefits').textContent='Nhập tỉ lệ thưởng từ 0 đến 100.';ok=false}else if(rankVoucherEnabled.checked&&!rankVoucher.value){document.getElementById('err-rankBenefits').textContent='Chọn voucher được thưởng.';ok=false}else document.getElementById('err-rankBenefits').textContent='';if(rankStart.value&&rankEnd.value&&new Date(rankEnd.value)<=new Date(rankStart.value)){document.getElementById('err-rankEnd').textContent='Ngày kết thúc phải sau ngày áp dụng.';ok=false}if(!ok)return;var old=cmsRankState.editIndex!==null?cmsRankRows[cmsRankState.editIndex]:null,row={name:rankName.value.trim(),order:+rankOrder.value,minExp:+rankMinExp.value,texpRate:+rankTexpRate.value,maintainExp:+rankMaintainExp.value,description:rankDescription.value.trim(),start:rankStart.value,end:rankEnd.value,status:old?old.status:(new Date(rankStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực'),color:rankColor.value.toUpperCase(),icon:'',balanceEnabled:rankBalanceEnabled.checked,balanceRate:+rankBalanceRate.value||0,voucherEnabled:rankVoucherEnabled.checked,voucher:rankVoucher.value};if(old)cmsRankRows[cmsRankState.editIndex]=row;else cmsRankRows.push(row);cmsSetAlert('rankFormAlert','success','Đã lưu thiết lập hạng thành viên.');cmsRankRender()}
function cmsRankCancel(i){cmsAccConfirm('Hủy thiết lập','Bạn xác nhận hủy thiết lập hạng thành viên này?',function(){cmsRankRows[i].status='Tạm dừng';cmsRankRender()})}
function cmsRankDelete(i){cmsAccConfirm('Xóa thiết lập','Bạn xác nhận xóa thiết lập hạng thành viên này?',function(){cmsRankRows.splice(i,1);cmsRankRender()})}
function cmsRankApplyColumns(){var table=document.getElementById('rankTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(c,i){c.style.display=cmsRankState.hiddenColumns.has(i)?'none':''})})}
function cmsRankToggleColumns(btn){var old=document.getElementById('rankColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='rankColumnPicker';panel.className='column-picker show';document.querySelectorAll('#rankTable thead th').forEach(function(th,i){if(i===8)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsRankState.hiddenColumns.has(i);c.onchange=function(){if(c.checked)cmsRankState.hiddenColumns.delete(i);else cmsRankState.hiddenColumns.add(i);cmsRankApplyColumns()};l.append(c,document.createTextNode(th.textContent.trim()));panel.append(l)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsRankRender);
