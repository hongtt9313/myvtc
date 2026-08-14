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
      targetExp:2000,
      cycleTExp:74,
      targetTExp:80,
      maintainExp:500,
      maintainTExp:0,
      nextRank:'Bạch Kim',
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
      targetExp:500,
      cycleTExp:28,
      targetTExp:40,
      maintainExp:100,
      maintainTExp:0,
      nextRank:'Bạc',
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

  cmsRenderPagedTable('lookupPartners','Danh sách đối tác / dịch vụ đã cấp quyền',acc.partners,['__stt','name','scope','grantedAt','partnerUser','status','cancelAt','action'],1,5,function(col,value,item){
    if(col === 'action'){
      return item.status === 'Đang hoạt động' ? '<button class="account-mini-btn danger" type="button" onclick="cmsCancelPartner(\'' + cmsSafeText(item.name) + '\')">Hủy</button>' : '-';
    }
    return cmsSafeText(value || '-');
  });
  cmsRenderPagedTable('lookupPointLots','Danh sách lô Points',acc.pointLots,['__stt','amount','receivedAt','expiredAt','status'],1,10,function(col,value){return col === 'amount' ? cmsMoney(value) : cmsSafeText(value);});
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
  if(breadcrumb) breadcrumb.innerHTML = '<i class="fa fa-edit"></i> Loyalty &gt; Quản trị nhiệm vụ';
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
    cmsSetLoyaltyEventAlert('error','Tên nhiệm vụ phải có độ dài từ 2 đến 100 ký tự.');
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
  setTimeout(cmsPaymentRateInitMulti,0);
  setTimeout(cmsPaymentLimitInitControls,0);
  setTimeout(cmsRenderPaymentLimits,0);
  cmsInitLoyaltyAdmin();
});
document.addEventListener('DOMContentLoaded',function(){
  setTimeout(cmsPaymentRateInitMulti,0);
  cmsInitLoyaltyAdmin();
});

document.addEventListener('DOMContentLoaded',function(){
  setTimeout(cmsPaymentRateInitMulti,0);
  cmsNormalizeAccountDemoData();
  cmsEnhanceAccountUpdateUi();
  cmsBindAccountEnterSearch();
  cmsBindIdentityWatchers();
  cmsBindDemoButtons();
});


var cmsPaymentRates = [
  {id:'RATE-0001',target:'Tài khoản',partner:'VTC Intecom',product:'MyVTC',currency:'VNĐ',value:100,start:'2026-06-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực',createdBy:'hongtt',createdAt:'01/06/2026 00:00',used:true},
  {id:'RATE-0002',target:'Tài khoản',partner:'VTC Mobile',product:'Audition',currency:'Vcoin',value:10,start:'2026-08-01T00:00',end:'2026-12-31T23:59',status:'Chờ áp dụng',createdBy:'hongtt',createdAt:'01/06/2026 00:00',used:false},
  {id:'RATE-0003',target:'Hệ thống',partner:'VTC Pay',product:'VTC Pay',currency:'VNĐ',value:80,start:'2026-01-01T00:00',end:'2026-05-31T23:59',status:'Hết hiệu lực',createdBy:'hanhpd',createdAt:'01/01/2026 00:00',used:true},
  {id:'RATE-0004',target:'Tài khoản',partner:'VTC Intecom',product:'CrossFire',currency:'VNĐ',value:120,start:'2026-07-01T00:00',end:'2026-11-30T23:59',status:'Tạm dừng',createdBy:'admin',createdAt:'20/06/2026 09:30',used:false}
];

var cmsPaymentRateLogs = [
  {time:'01/06/2026 00:00',admin:'hongtt',content:'Kích hoạt RATE-0001. RATE-0003 chuyển Hết hiệu lực.'}
];

var cmsPaymentLimits = [
  {id:'LIMIT-0001',target:'Tài khoản',partner:'VTC Intecom',product:'MyVTC',business:'Nạp Point',payment:'Thẻ Vcoin',min:1000,max:5000000,condition:'Đã xác minh eKYC',start:'2026-08-01T00:00',end:'2026-12-31T23:59',status:'Chờ áp dụng'},
  {id:'LIMIT-0002',target:'Tài khoản',partner:'VTC Mobile',product:'Audition',business:'Mua hàng',payment:'Số dư MyVTC',min:100,max:2000000,condition:'Đã xác minh email',start:'2026-06-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực'},
  {id:'LIMIT-0003',target:'Hệ thống',partner:'VTC Pay',product:'VTC Pay',business:'Nạp Point',payment:'Ví điện tử VTC Pay',min:1000,max:10000000,condition:'Đã liên kết tài khoản ngân hàng',start:'2026-01-01T00:00',end:'2026-05-31T23:59',status:'Hết hiệu lực'},
  {id:'LIMIT-0004',target:'Tài khoản',partner:'VTC Intecom',product:'CrossFire',business:'Mua hàng',payment:'VCB',min:50000,max:3000000,condition:'Đã liên kết Google',start:'2026-07-01T00:00',end:'2026-11-30T23:59',status:'Tạm dừng'}
];

var cmsPaymentTransactions = [
  {id:'TX-TOPUP-20260729-001',vtcPayId:'VTP-20260729-001',partnerRef:'MYVTC-REF-29001',user:'0936168687',type:'Nạp Point',product:'MyVTC',packageName:'Nạp số dư MyVTC',partnerValue:'100.000 VNĐ',money:100000,point:10000,method:'Ví VTC Pay',status:'Thành công',createdAt:'29/07/2026 08:10',updatedBy:'Hệ thống',device:'Chrome 150, Windows 10',version:'Web 2.6.7',description:'Nạp Point vào tài khoản MyVTC.'},
  {id:'TX-PAY-20260728-014',vtcPayId:'-',partnerRef:'AU2-ORDER-7788',user:'hongtt',type:'Thanh toán',product:'Audition',packageName:'Gói Kim Cương',partnerValue:'500 Kim Cương',money:150000,point:15000,method:'Số dư Point',status:'Thành công',createdAt:'28/07/2026 19:25',updatedBy:'hongtt',device:'iPhone 15 Pro, iOS 19',version:'Mobile App 3.2.1',description:'Thanh toán gói nạp Audition bằng Point.'},
  {id:'TX-PAY-20260727-009',vtcPayId:'VTP-20260727-032',partnerRef:'SRO-ORDER-53002',user:'minhthu@gmail.com',type:'Thanh toán',product:'Silkroad Origin VTC',packageName:'530 Silk',partnerValue:'530 Silk',money:500000,point:50000,method:'Thẻ ATM nội địa',status:'Đang xử lý',createdAt:'27/07/2026 10:15',updatedBy:'Hệ thống',device:'Edge 149, Windows 11',version:'Web 2.6.7',description:'Đang chờ đối tác trả kết quả.'},
  {id:'TX-REFUND-20260726-003',vtcPayId:'VTP-20260726-018',partnerRef:'FPO-ORDER-25001',user:'ngocanh88',type:'Hoàn Point',product:'Football Pro VTC',packageName:'25.000 Epic Coin',partnerValue:'25.000 Epic Coin',money:20000,point:2000,method:'Ví VTC Pay',status:'Đã hoàn',createdAt:'26/07/2026 11:05',updatedBy:'admin',device:'Chrome 150, macOS 15',version:'CMS 1.8.4',description:'Hoàn giao dịch do đối tác trả kết quả thất bại.'},
  {id:'TX-ADJ-20260725-001',vtcPayId:'-',partnerRef:'TX-TOPUP-20260725-009',user:'0961381232',type:'Cộng bù',product:'MyVTC',packageName:'Nạp số dư MyVTC',partnerValue:'50.000 VNĐ',money:50000,point:5000,method:'Điều chỉnh CMS',status:'Thành công',createdAt:'25/07/2026 10:20',updatedBy:'admin_hung',device:'Chrome 150, Windows 10',version:'CMS 1.8.4',description:'Cộng bù Point do giao dịch nạp ghi nhận thiếu.'},
  {id:'TX-PAY-20260724-021',vtcPayId:'VTP-20260724-055',partnerRef:'FPO-ORDER-62500',user:'0987654321',type:'Thanh toán',product:'Football Pro VTC',packageName:'62.500 Epic Coin',partnerValue:'62.500 Epic Coin',money:50000,point:0,method:'Ví VTC Pay',status:'Thất bại',createdAt:'24/07/2026 21:36',updatedBy:'Hệ thống',device:'Samsung Galaxy S25, Android 16',version:'Mobile App 3.2.1',description:'Cổng thanh toán trả kết quả thất bại.'}
];

var cmsPaymentRefunds = [
  {id:'REFUND-0003',partnerCode:'FPO-ORDER-25001',originalTx:'TX-PAY-0003',user:'ngocanh',point:25000,txTime:'27/07/2026 14:20',refundTime:'',product:'Football Pro VTC',packageName:'25.000 Epic Coin',reason:'Giao dịch trừ Point nhưng không nhận được vật phẩm.',requestedBy:'lannt',updatedBy:'lannt',status:'Chờ duyệt'},
  {id:'REFUND-0002',partnerCode:'SRO-ORDER-53002',originalTx:'TX-PAY-0002',user:'minhthu@gmail.com',point:50000,txTime:'26/07/2026 10:15',refundTime:'26/07/2026 11:05',product:'Silkroad Origin VTC',packageName:'530 Silk',reason:'Đơn hàng đối tác trả kết quả thất bại.',requestedBy:'hoangnv',updatedBy:'admin',status:'Đã duyệt'},
  {id:'REFUND-0001',partnerCode:'AU2-ORDER-7788',originalTx:'TX-PAY-0001',user:'0936168687',point:15000,txTime:'29/06/2026 09:20',refundTime:'',product:'Audition',packageName:'Gói Kim Cương',reason:'Yêu cầu không đủ điều kiện hoàn.',requestedBy:'hongtt',updatedBy:'admin',status:'Đã hủy'}
];
var cmsRefundFiltered = cmsPaymentRefunds.slice();
var cmsRefundPage = 1;
var cmsRefundPageSize = 6;
var cmsRefundSelectedTransaction = null;
var cmsRefundSelectedId = null;
var cmsRefundHiddenColumns = new Set();
var cmsPaymentAdjustments = [
  {time:'25/07/2026 10:18',originalId:'TX-TOPUP-20260725-009',id:'ADJ-20260725-001',point:5000,expired:'31/12/2026',type:'Cộng bù',updated:'25/07/2026 10:20',updatedBy:'admin_hung',reason:'Cộng bù Point do giao dịch nạp bị ghi nhận thiếu.'},
  {time:'18/07/2026 15:42',originalId:'TX-TOPUP-20260718-014',id:'ADJ-20260718-002',point:10000,expired:'30/09/2026',type:'Thu hồi',updated:'18/07/2026 15:45',updatedBy:'admin',reason:'Thu hồi giao dịch nạp Point trùng.'}
];
var cmsAdjustmentSourceTransactions = [
  {account:'0936168687',time:'29/07/2026 08:10',id:'TX-TOPUP-20260729-001',point:10000,expired:'31/12/2026'},
  {account:'0936168687',time:'15/07/2026 14:35',id:'TX-TOPUP-20260715-006',point:50000,expired:'31/01/2027'},
  {account:'0936168687',time:'03/07/2026 09:22',id:'TX-TOPUP-20260703-012',point:20000,expired:'31/12/2026'},
  {account:'0961381232',time:'22/07/2026 16:05',id:'TX-TOPUP-20260722-004',point:100000,expired:'30/06/2027'},
  {account:'ngocanh88',time:'10/07/2026 11:40',id:'TX-TOPUP-20260710-008',point:25000,expired:'31/12/2026'},
  {account:'0936168687',time:'28/06/2026 08:15',id:'TX-TOPUP-20260628-003',point:10000,expired:'30/11/2026'}
];
var cmsAdjustmentHiddenColumns = new Set();
var cmsAdjustmentSelectedTransaction = null;
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
    if(rate.status === 'Hết hiệu lực' || rate.status === 'Tạm dừng') return;
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

function cmsPaymentRateInitMulti(){
  var controls = [
    ['rateFilterTargetControl','Đối tượng','rateFilterTarget',['Tất cả','Hệ thống','Tài khoản']],
    ['rateFilterPartnerControl','Đối tác','rateFilterPartner',['Tất cả','VTC Intecom','VTC Mobile','VTC Pay']],
    ['rateFilterProductControl','Sản phẩm','rateFilterProduct',['Tất cả','MyVTC','Audition','CrossFire','VTC Pay']],
    ['rateFilterStatusControl','Trạng thái','rateFilterStatus',['Tất cả','Chờ áp dụng','Hiệu lực','Hết hiệu lực','Tạm dừng']],
    ['rateTargetControl','', 'rateTarget',['Tất cả','Hệ thống','Tài khoản']],
    ['ratePartnerControl','', 'ratePartner',['Tất cả','VTC Intecom','VTC Mobile','VTC Pay']],
    ['rateProductControl','', 'rateProduct',['Tất cả','MyVTC','Audition','CrossFire','VTC Pay']]
  ];
  controls.forEach(function(cfg){
    var node=document.getElementById(cfg[0]);
    if(node&&!node.innerHTML) node.innerHTML=cmsAccMultiFilter(cfg[1],cfg[2],cfg[3]);
  });
}
function cmsPaymentRateSelected(id){
  var values=cmsAccGetMultiValues(id);
  return !values.length||values.indexOf('Tất cả')>=0?null:values;
}
function cmsPaymentRateFormValue(id){
  var values=cmsAccGetMultiValues(id);
  return values.indexOf('Tất cả')>=0?'Tất cả':values.join(', ');
}
function cmsPaymentRateMatches(value,selected){
  if(!selected) return true;
  var rowValues=String(value||'').split(',').map(function(x){return x.trim()});
  return selected.some(function(x){return rowValues.indexOf(x)>=0;});
}
function cmsRenderPaymentRates(){
  cmsUpdatePaymentRateRuntimeStatus();
  var tbody = document.getElementById('paymentRateRows');
  if(!tbody) return;
  cmsPaymentRateInitMulti();
  var target = cmsPaymentRateSelected('rateFilterTarget');
  var partner = cmsPaymentRateSelected('rateFilterPartner');
  var product = cmsPaymentRateSelected('rateFilterProduct');
  var status = cmsPaymentRateSelected('rateFilterStatus');
  var keyword = cmsGetValue('rateQuickSearch').toLowerCase();
  var rows = cmsPaymentRates.filter(function(item){
    var haystack = [item.target,item.partner,item.product,item.currency,item.value,item.status,cmsPaymentFormatDateTime(item.start),cmsPaymentFormatDateTime(item.end)].join(' ').toLowerCase();
    return cmsPaymentRateMatches(item.target,target) && cmsPaymentRateMatches(item.partner,partner) && cmsPaymentRateMatches(item.product,product) && cmsPaymentRateMatches(item.status,status) && (!keyword || haystack.indexOf(keyword) !== -1);
  });
  tbody.innerHTML = rows.length ? rows.map(function(item,index){
    var currencyLabel = item.currency === 'VNĐ' ? '1.000 VNĐ' : '1 Vcoin';
    var ratio = cmsPaymentNumber(item.value,'') + ' Point';
    var pauseIcon = item.status === 'Tạm dừng' ? 'fa-play' : 'fa-pause';
    var pauseTitle = item.status === 'Tạm dừng' ? 'Tiếp tục' : 'Tạm dừng';
    return '<tr>' +
      '<td>' + (index + 1) + '</td>' +
      '<td>' + cmsSafeText(item.target) + '</td>' +
      '<td>' + cmsSafeText(item.partner) + '</td>' +
      '<td>' + cmsSafeText(item.product) + '</td>' +
      '<td>' + cmsSafeText(currencyLabel) + '</td>' +
      '<td><span class="payment-money">' + cmsSafeText(ratio) + '</span></td>' +
      '<td>' + cmsSafeText(cmsPaymentFormatDateTime(item.start)) + '</td>' +
      '<td>' + cmsSafeText(cmsPaymentFormatDateTime(item.end)) + '</td>' +
      '<td>' + cmsPaymentStatusHtml(item.status) + '</td>' +
      '<td class="ops payment-rate-actions"><button class="icon-square orange" title="Cập nhật" onclick="cmsOpenPaymentRateForm(\'' + item.id + '\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="' + pauseTitle + '" onclick="cmsTogglePaymentRatePause(\'' + item.id + '\')"><i class="fa ' + pauseIcon + '"></i></button><button class="icon-square red" title="Xóa" onclick="cmsDeletePaymentRate(\'' + item.id + '\')"><i class="fa fa-trash"></i></button></td>' +
    '</tr>';
  }).join('') : '<tr><td colspan="10">Không có dữ liệu</td></tr>';
  var count = document.getElementById('paymentRateCount');
  if(count) count.textContent = rows.length + ' bản ghi';
}

function cmsTogglePaymentRateColumns(){
  var table = document.getElementById('paymentRateTable');
  if(!table) return;
  var hidden = table.classList.toggle('payment-rate-compact-columns');
  cmsPaymentAlert('paymentRateAlert','success',hidden ? 'Đã ẩn cột Đối tác và Sản phẩm.' : 'Đã hiện đầy đủ các cột.');
}

function cmsTogglePaymentRatePause(id){
  var item = cmsPaymentRates.find(function(rate){return rate.id === id;});
  if(!item) return;
  var isPaused = item.status === 'Tạm dừng';
  var actionText = isPaused ? 'tiếp tục' : 'tạm dừng';
  var confirmTitle = isPaused ? 'Xác nhận tiếp tục chính sách' : 'Xác nhận tạm dừng chính sách';
  cmsConfirmAction(confirmTitle,'Bạn có chắc chắn muốn ' + actionText + ' chính sách <b>' + cmsSafeText(item.id) + '</b>?','Xác nhận',function(){
    item.status = isPaused ? 'Chờ áp dụng' : 'Tạm dừng';
    cmsPaymentAlert('paymentRateAlert','success',isPaused ? 'Đã tiếp tục chính sách.' : 'Đã tạm dừng chính sách.');
    cmsRenderPaymentRates();
  });
}

function cmsUpdatePaymentRateHint(){
  var hint = document.getElementById('rateValueHint');
  if(hint) hint.textContent = cmsGetValue('rateCurrency') === 'Vcoin' ? 'Số Point nhận được cho mỗi 1 Vcoin' : 'Số Point nhận được cho mỗi 1.000 VNĐ';
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
  cmsPaymentRateInitMulti();
  ['rateTarget','ratePartner','rateProduct'].forEach(function(id){cmsAccSetMultiValues(id,'Tất cả');});
  cmsSetValue('rateCurrency','VNĐ');
  cmsSetValue('rateValue','');
  cmsSetValue('rateStart','');
  cmsSetValue('rateEnd','');
  cmsUpdatePaymentRateHint();
  cmsPaymentAlert('paymentRateAlert','', '');
}

function cmsSavePaymentRate(){
  var id = cmsGetValue('rateEditingId');
  var target = cmsPaymentRateFormValue('rateTarget');
  var partner = cmsPaymentRateFormValue('ratePartner');
  var product = cmsPaymentRateFormValue('rateProduct');
  var currency = cmsGetValue('rateCurrency');
  var value = Number(cmsGetValue('rateValue'));
  var start = cmsGetValue('rateStart');
  var end = cmsGetValue('rateEnd');

  if(!target || !partner || !product || !currency || !value || value <= 0 || !start || !end){
    cmsPaymentAlert('paymentRateAlert','error','Vui lòng nhập đủ thông tin bắt buộc. Tỉ lệ quy đổi phải lớn hơn 0.');
    return;
  }
  if(new Date(end) <= new Date(start)){
    cmsPaymentAlert('paymentRateAlert','error','Thời gian hiệu lực đến phải lớn hơn thời gian hiệu lực từ.');
    return;
  }
  var current = id ? cmsPaymentRates.find(function(item){return item.id === id;}) : null;
  if(current){
    var old = current.target + ' / ' + current.partner + ' / ' + current.product + ' / ' + current.currency + ' ' + current.value + ' từ ' + current.start + ' đến ' + current.end;
    current.target = target;
    current.partner = partner;
    current.product = product;
    current.currency = currency;
    current.value = value;
    current.start = start;
    current.end = end;
    cmsPushPaymentRateLog('Sửa ' + id + '. Trước: ' + old + '. Sau: ' + currency + ' ' + value + '.');
  } else {
    current = {id:cmsPaymentNextId('RATE',cmsPaymentRates),target:target,partner:partner,product:product,currency:currency,value:value,start:start,end:end,status:'Chờ áp dụng',createdBy:'hongtt',createdAt:cmsNow(),used:false};
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
  cmsPaymentRateInitMulti();
  cmsAccSetMultiValues('rateTarget',item.target);
  cmsAccSetMultiValues('ratePartner',item.partner);
  cmsAccSetMultiValues('rateProduct',item.product);
  cmsSetValue('rateCurrency',item.currency);
  cmsSetValue('rateValue',item.value);
  cmsSetValue('rateStart',item.start);
  cmsSetValue('rateEnd',item.end);
  cmsUpdatePaymentRateHint();
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

function cmsPaymentLimitInitControls(){
  var controls = [
    ['limitFilterPartnerControl','Đối tác','limitFilterPartner',['Tất cả','VTC Intecom','VTC Mobile','VTC Pay']],
    ['limitFilterProductControl','Sản phẩm','limitFilterProduct',['Tất cả','MyVTC','Audition','CrossFire','VTC Pay']],
    ['limitFilterBusinessControl','Loại giao dịch','limitFilterBusiness',['Tất cả','Nạp Point','Mua hàng']],
    ['limitFilterStatusControl','Trạng thái','limitFilterStatus',['Tất cả','Chờ áp dụng','Hiệu lực','Hết hiệu lực','Tạm dừng']],
    ['limitTargetControl','', 'limitTarget',['Tất cả','Hệ thống','Tài khoản']],
    ['limitPartnerControl','', 'limitPartner',['Tất cả','VTC Intecom','VTC Mobile','VTC Pay']],
    ['limitProductControl','', 'limitProduct',['Tất cả','MyVTC','Audition','CrossFire','VTC Pay']]
  ];
  controls.forEach(function(cfg){
    var node=document.getElementById(cfg[0]);
    if(node&&!node.innerHTML) node.innerHTML=cmsAccMultiFilter(cfg[1],cfg[2],cfg[3]);
  });
  var paymentFilter=document.getElementById('limitFilterPaymentControl');
  if(paymentFilter&&!paymentFilter.innerHTML) paymentFilter.innerHTML=cmsTexpPaymentMultiFilter('Hình thức thanh toán','limitFilterPayment');
  var paymentForm=document.getElementById('limitPaymentControl');
  if(paymentForm&&!paymentForm.innerHTML) paymentForm.innerHTML=cmsTexpPaymentMultiFilter('','limitPayment');
  var condition=document.getElementById('limitCondition');
  if(condition&&!condition.options.length){
    condition.innerHTML=cmsLoyaltyEvents.map(function(event){return '<option value="'+cmsSafeText(event.name)+'">'+cmsSafeText(event.name)+'</option>';}).join('');
  }
}
function cmsPaymentLimitSelected(id){var values=cmsAccGetMultiValues(id);return !values.length||values.indexOf('Tất cả')>=0?null:values;}
function cmsPaymentLimitFormValue(id){var values=cmsAccGetMultiValues(id);return values.indexOf('Tất cả')>=0?'Tất cả':values.join(', ');}
function cmsPaymentLimitMatches(value,selected){if(!selected)return true;var rowValues=String(value||'').split(',').map(function(x){return x.trim()});return selected.some(function(x){return rowValues.indexOf(x)>=0;});}
function cmsRenderPaymentLimits(){
  var tbody=document.getElementById('paymentLimitRows');if(!tbody)return;
  cmsPaymentLimitInitControls();
  var partner=cmsPaymentLimitSelected('limitFilterPartner');
  var product=cmsPaymentLimitSelected('limitFilterProduct');
  var business=cmsPaymentLimitSelected('limitFilterBusiness');
  var payment=cmsPaymentLimitSelected('limitFilterPayment');
  var status=cmsPaymentLimitSelected('limitFilterStatus');
  var keyword=cmsGetValue('limitQuickSearch').toLowerCase();
  var rows=cmsPaymentLimits.filter(function(item){
    var haystack=[item.target,item.partner,item.product,item.business,item.payment,item.condition,item.status,cmsPaymentFormatDateTime(item.start),cmsPaymentFormatDateTime(item.end)].join(' ').toLowerCase();
    return cmsPaymentLimitMatches(item.partner,partner)&&cmsPaymentLimitMatches(item.product,product)&&cmsPaymentLimitMatches(item.business,business)&&cmsPaymentLimitMatches(item.payment,payment)&&cmsPaymentLimitMatches(item.status,status)&&(!keyword||haystack.indexOf(keyword)>=0);
  });
  tbody.innerHTML=rows.length?rows.map(function(item,index){return '<tr><td>'+(index+1)+'</td><td>'+cmsSafeText(item.target)+'</td><td>'+cmsSafeText(item.partner)+'</td><td>'+cmsSafeText(item.product)+'</td><td>'+cmsSafeText(item.business)+'</td><td>'+cmsSafeText(item.payment)+'</td><td>'+cmsSafeText(cmsPaymentFormatDateTime(item.start))+'</td><td>'+cmsSafeText(cmsPaymentFormatDateTime(item.end))+'</td><td>'+cmsSafeText(item.status)+'</td><td class="payment-limit-actions"><button class="icon-square orange" title="Cập nhật" onclick="cmsOpenPaymentLimitForm(\''+item.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="Tạm dừng" onclick="cmsPausePaymentLimit(\''+item.id+'\')"><i class="fa fa-pause"></i></button><button class="icon-square red" title="Xóa" onclick="cmsDeletePaymentLimit(\''+item.id+'\')"><i class="fa fa-trash"></i></button></td></tr>';}).join(''):'<tr><td colspan="10">Không có dữ liệu</td></tr>';
  var count=document.getElementById('paymentLimitCount');if(count)count.textContent=rows.length+' bản ghi';
}
function cmsTogglePaymentLimitColumns(){var table=document.getElementById('paymentLimitTable');if(table)table.classList.toggle('payment-limit-compact-columns');}
function cmsOpenPaymentLimitForm(id){
  cmsPaymentLimitInitControls();cmsResetPaymentLimitForm();
  var title=document.getElementById('paymentLimitFormTitle');if(title)title.textContent=id?'Cập nhật hạn mức giao dịch':'Thêm mới hạn mức giao dịch';
  showScreen('payment-limit-form');if(id)cmsEditPaymentLimit(id);
}
function cmsBackPaymentLimitList(){showScreen('payment-limit');}
function cmsResetPaymentLimitForm(){
  cmsPaymentLimitInitControls();cmsSetValue('limitEditingId','');
  ['limitTarget','limitPartner','limitProduct','limitPayment'].forEach(function(id){cmsAccSetMultiValues(id,'Tất cả');});
  cmsSetValue('limitBusiness','Nạp Point');cmsSetValue('limitMin','');cmsSetValue('limitMax','');cmsSetValue('limitStart','');cmsSetValue('limitEnd','');
  var condition=document.getElementById('limitCondition');if(condition&&condition.options.length)condition.selectedIndex=0;
  cmsPaymentAlert('paymentLimitAlert','','');
}
function cmsSavePaymentLimit(){
  var id=cmsGetValue('limitEditingId'),target=cmsPaymentLimitFormValue('limitTarget'),partner=cmsPaymentLimitFormValue('limitPartner'),product=cmsPaymentLimitFormValue('limitProduct'),business=cmsGetValue('limitBusiness'),payment=cmsPaymentLimitFormValue('limitPayment'),min=Number(cmsGetValue('limitMin')),max=Number(cmsGetValue('limitMax')),condition=cmsGetValue('limitCondition'),start=cmsGetValue('limitStart'),end=cmsGetValue('limitEnd');
  if(!target||!partner||!product||!business||!payment||!condition||isNaN(min)||isNaN(max)||!start||!end){cmsPaymentAlert('paymentLimitAlert','error','Vui lòng nhập đủ thông tin bắt buộc.');return;}
  if(min<0||max<=min){cmsPaymentAlert('paymentLimitAlert','error','Giá trị tối đa phải lớn hơn giá trị tối thiểu.');return;}
  if(new Date(end)<=new Date(start)){cmsPaymentAlert('paymentLimitAlert','error','Thời gian kết thúc phải lớn hơn thời gian áp dụng.');return;}
  var current=id?cmsPaymentLimits.find(function(item){return item.id===id;}):null;
  if(current){current.target=target;current.partner=partner;current.product=product;current.business=business;current.payment=payment;current.min=min;current.max=max;current.condition=condition;current.start=start;current.end=end;}
  else cmsPaymentLimits.unshift({id:cmsPaymentNextId('LIMIT',cmsPaymentLimits),target:target,partner:partner,product:product,business:business,payment:payment,min:min,max:max,condition:condition,start:start,end:end,status:'Chờ áp dụng'});
  cmsPaymentAlert('paymentLimitAlert','success','Đã lưu cấu hình hạn mức giao dịch.');cmsRenderPaymentLimits();showScreen('payment-limit');
}
function cmsEditPaymentLimit(id){
  var item=cmsPaymentLimits.find(function(limit){return limit.id===id;});if(!item)return;
  cmsSetValue('limitEditingId',item.id);cmsAccSetMultiValues('limitTarget',item.target);cmsAccSetMultiValues('limitPartner',item.partner);cmsAccSetMultiValues('limitProduct',item.product);cmsSetValue('limitBusiness',item.business);cmsAccSetMultiValues('limitPayment',item.payment);cmsTexpSyncPaymentGroups('limitPayment');cmsSetValue('limitMin',item.min);cmsSetValue('limitMax',item.max);cmsSetValue('limitCondition',item.condition);cmsSetValue('limitStart',item.start);cmsSetValue('limitEnd',item.end);showScreen('payment-limit-form');
}
function cmsPausePaymentLimit(id){var item=cmsPaymentLimits.find(function(limit){return limit.id===id;});if(!item)return;if(!window.confirm('Bạn có chắc chắn muốn tạm dừng cấu hình này?'))return;item.status='Tạm dừng';cmsPaymentAlert('paymentLimitAlert','success','Đã tạm dừng '+item.id+'.');cmsRenderPaymentLimits();}
function cmsDeletePaymentLimit(id){var item=cmsPaymentLimits.find(function(limit){return limit.id===id;});if(!item)return;if(!window.confirm('Bạn có chắc chắn muốn xóa cấu hình này?'))return;cmsPaymentLimits=cmsPaymentLimits.filter(function(limit){return limit.id!==id;});cmsPaymentAlert('paymentLimitAlert','success','Đã xóa cấu hình hạn mức.');cmsRenderPaymentLimits();}

function cmsFindTransaction(id){
  var key = String(id || '').trim().toLowerCase();
  return cmsPaymentTransactions.find(function(tx){return tx.id.toLowerCase() === key;});
}

function cmsRefundProductInfo(tx){
  var map={AU2:['Audition','Gói Kim Cương'],CF:['CrossFire','Gói vật phẩm'],MYVTC:['Nạp số dư MyVTC','Gói Point']};
  return map[tx.serviceId] || [tx.serviceId || 'Sản phẩm VTC',tx.description || 'Gói dịch vụ'];
}
function cmsRefundAccountMatches(tx,value){
  var key=String(value||'').trim().toLowerCase();
  if(!key) return false;
  if(String(tx.user||'').toLowerCase()===key) return true;
  var acc=(typeof cmsAccountData!=='undefined'?cmsAccountData:[]).find(function(item){
    return [item.phone,item.email,item.username,item.userName].some(function(v){return String(v||'').toLowerCase()===key;});
  });
  return !!(acc && String(acc.phone||'')===String(tx.user||''));
}
function cmsRefundSetCreateAlert(type,message){cmsSetAlert('refundCreateAlert',type,message);}
function cmsOpenRefundCreateModal(){
  cmsResetRefundForm();
  var modal=document.getElementById('refundCreateModal'); if(modal) modal.classList.add('show');
}
function cmsCloseRefundCreateModal(){var modal=document.getElementById('refundCreateModal');if(modal)modal.classList.remove('show');cmsResetRefundForm();}
function cmsCheckRefundTransaction(){
  var tx=cmsFindTransaction(cmsGetValue('refundOriginalTx'));
  var account=cmsGetValue('refundAccount');
  var preview=document.getElementById('refundPreview');
  var reasonRow=document.getElementById('refundReasonRow');
  var createBtn=document.getElementById('refundCreateButton');
  cmsRefundSelectedTransaction=null;
  if(!tx || tx.type!=='Thanh toán bằng Point' || tx.status!=='Thành công'){
    if(preview){preview.innerHTML='';preview.classList.add('hidden');}
    if(reasonRow)reasonRow.classList.add('hidden'); if(createBtn)createBtn.disabled=true;
    cmsRefundSetCreateAlert('error','Không tìm thấy giao dịch thanh toán bằng Point thành công.'); return null;
  }
  if(!cmsRefundAccountMatches(tx,account)){
    if(preview){preview.innerHTML='';preview.classList.add('hidden');}
    if(reasonRow)reasonRow.classList.add('hidden'); if(createBtn)createBtn.disabled=true;
    cmsRefundSetCreateAlert('error','Tài khoản không khớp với giao dịch gốc.'); return null;
  }
  if(cmsPaymentRefunds.some(function(item){return item.originalTx===tx.id && item.status!=='Đã hủy';})){
    cmsRefundSetCreateAlert('error','Giao dịch đã có yêu cầu hoàn Point đang xử lý hoặc đã duyệt.'); return null;
  }
  var info=cmsRefundProductInfo(tx); cmsRefundSelectedTransaction=tx;
  if(preview){preview.classList.remove('hidden');preview.innerHTML='<div><b>Thời gian giao dịch</b><span>'+cmsSafeText(tx.successAt)+'</span></div><div><b>Tên sản phẩm</b><span>'+cmsSafeText(info[0])+'</span></div><div><b>Tên gói nạp</b><span>'+cmsSafeText(info[1])+'</span></div><div><b>Mã giao dịch</b><span>'+cmsSafeText(tx.id)+'</span></div><div><b>Mã đối tác</b><span>'+cmsSafeText(tx.partnerRef||'--')+'</span></div><div><b>Số Point</b><span>'+cmsPaymentNumber(tx.point,'Point')+'</span></div>';}
  if(reasonRow)reasonRow.classList.remove('hidden'); if(createBtn)createBtn.disabled=false;
  cmsRefundSetCreateAlert('success','Đã tìm thấy giao dịch phù hợp.'); return tx;
}
function cmsCreatePointRefund(){
  var tx=cmsRefundSelectedTransaction || cmsCheckRefundTransaction();
  var reason=cmsGetValue('refundReason'); if(!tx)return;
  if(!reason){cmsRefundSetCreateAlert('error','Vui lòng nhập lý do hoàn giao dịch.');return;}
  var info=cmsRefundProductInfo(tx); var id=cmsPaymentNextId('REFUND',cmsPaymentRefunds);
  cmsPaymentRefunds.unshift({id:id,partnerCode:tx.partnerRef||'',originalTx:tx.id,user:cmsGetValue('refundAccount'),point:tx.point,txTime:tx.successAt,refundTime:'',product:info[0],packageName:info[1],reason:reason,requestedBy:'hongtt',updatedBy:'hongtt',status:'Chờ duyệt'});
  cmsCloseRefundCreateModal(); cmsSearchPaymentRefunds(); cmsPaymentAlert('paymentRefundAlert','success','Đã tạo yêu cầu hoàn Point '+id+'.');
}
function cmsResetRefundForm(){
  cmsSetValue('refundOriginalTx','');cmsSetValue('refundAccount','');cmsSetValue('refundReason','');cmsRefundSelectedTransaction=null;
  var preview=document.getElementById('refundPreview');if(preview){preview.innerHTML='';preview.classList.add('hidden');}
  var row=document.getElementById('refundReasonRow');if(row)row.classList.add('hidden');
  var btn=document.getElementById('refundCreateButton');if(btn)btn.disabled=true;cmsRefundSetCreateAlert('','');
}
function cmsRefundDateValue(text){var m=String(text||'').match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime():0;}
function cmsSearchPaymentRefunds(){
  var from=cmsGetValue('refundFilterFrom'),to=cmsGetValue('refundFilterTo'),product=cmsGetValue('refundFilterProduct'),packageName=cmsGetValue('refundFilterPackage'),account=cmsGetValue('refundFilterAccount').toLowerCase(),transaction=cmsGetValue('refundFilterTransaction').toLowerCase(),request=cmsGetValue('refundFilterRequest').toLowerCase(),status=cmsGetValue('refundFilterStatus'),quick=cmsGetValue('refundQuickSearch').toLowerCase();
  var fromTime=from?new Date(from).getTime():0,toTime=to?new Date(to).getTime():0;
  cmsRefundFiltered=cmsPaymentRefunds.filter(function(item){var t=cmsRefundDateValue(item.txTime);var search=[item.id,item.partnerCode,item.originalTx,item.user,item.product,item.packageName,item.reason,item.updatedBy,item.status].join(' ').toLowerCase();return(!fromTime||t>=fromTime)&&(!toTime||t<=toTime)&&(!product||item.product===product)&&(!packageName||item.packageName===packageName)&&(!account||item.user.toLowerCase().indexOf(account)>=0)&&(!transaction||item.originalTx.toLowerCase().indexOf(transaction)>=0)&&(!request||item.id.toLowerCase().indexOf(request)>=0)&&(!status||item.status===status)&&(!quick||search.indexOf(quick)>=0);});
  cmsRefundPage=1;cmsRenderPaymentRefunds();
}
function cmsRenderPaymentRefunds(){
  var tbody=document.getElementById('paymentRefundRows');if(!tbody)return;
  var total=Math.max(1,Math.ceil(cmsRefundFiltered.length/cmsRefundPageSize));cmsRefundPage=Math.min(Math.max(1,cmsRefundPage),total);var start=(cmsRefundPage-1)*cmsRefundPageSize;var rows=cmsRefundFiltered.slice(start,start+cmsRefundPageSize);
  tbody.innerHTML=rows.length?rows.map(function(item,index){var approve=item.status==='Chờ duyệt'?'<button class="icon-square blue" title="Duyệt" onclick="cmsOpenRefundApproveModal(\''+item.id+'\')" type="button"><i class="fa fa-check"></i></button>':'';return '<tr><td>'+(start+index+1)+'</td><td>'+cmsSafeText(item.txTime)+'</td><td>'+cmsSafeText(item.refundTime||'--')+'</td><td>'+cmsSafeText(item.product)+'</td><td>'+cmsSafeText(item.packageName)+'</td><td>'+cmsSafeText(item.id)+'</td><td>'+cmsSafeText(item.originalTx)+'</td><td>'+cmsSafeText(item.partnerCode||'--')+'</td><td>'+cmsSafeText(item.user)+'</td><td>'+cmsPaymentNumber(item.point,'Point')+'</td><td>'+cmsSafeText(item.updatedBy)+'</td><td>'+cmsSafeText(item.reason)+'</td><td>'+cmsSafeText(item.status)+'</td><td><button class="icon-square orange" title="View" onclick="cmsOpenRefundViewModal(\''+item.id+'\')" type="button"><i class="fa fa-eye"></i></button>'+approve+'</td></tr>';}).join(''):'<tr><td colspan="14">Không có yêu cầu hoàn Point phù hợp.</td></tr>';
  var count=document.getElementById('paymentRefundCount');if(count)count.textContent='Hiển thị '+rows.length+' / '+cmsRefundFiltered.length+' bản ghi';var page=document.getElementById('paymentRefundPage');if(page)page.textContent=cmsRefundPage;cmsApplyRefundColumns();
}
function cmsSetRefundPage(page){cmsRefundPage=page;cmsRenderPaymentRefunds();}
function cmsRefundDetailHtml(item){return '<div><b>Mã yêu cầu</b><span>'+cmsSafeText(item.id)+'</span></div><div><b>Thời gian giao dịch</b><span>'+cmsSafeText(item.txTime)+'</span></div><div><b>Tên sản phẩm</b><span>'+cmsSafeText(item.product)+'</span></div><div><b>Tên gói nạp</b><span>'+cmsSafeText(item.packageName)+'</span></div><div><b>Mã giao dịch</b><span>'+cmsSafeText(item.originalTx)+'</span></div><div><b>Mã đối tác</b><span>'+cmsSafeText(item.partnerCode||'--')+'</span></div><div><b>Tài khoản</b><span>'+cmsSafeText(item.user)+'</span></div><div><b>Số Point</b><span>'+cmsPaymentNumber(item.point,'Point')+'</span></div><div><b>Lý do</b><span>'+cmsSafeText(item.reason)+'</span></div><div><b>Người gửi yêu cầu</b><span>'+cmsSafeText(item.requestedBy)+'</span></div>'+(item.status?'<div><b>Trạng thái</b><span>'+cmsSafeText(item.status)+'</span></div>':'');}
function cmsOpenRefundApproveModal(id){var item=cmsPaymentRefunds.find(function(x){return x.id===id;});if(!item)return;cmsRefundSelectedId=id;document.getElementById('refundApproveContent').innerHTML=cmsRefundDetailHtml(item);document.getElementById('refundApproveModal').classList.add('show');}
function cmsCloseRefundApproveModal(){var m=document.getElementById('refundApproveModal');if(m)m.classList.remove('show');cmsRefundSelectedId=null;}
function cmsApproveRefundRequest(){var item=cmsPaymentRefunds.find(function(x){return x.id===cmsRefundSelectedId;});if(!item)return;item.status='Đã duyệt';item.refundTime=cmsNow();item.updatedBy='admin';var tx=cmsFindTransaction(item.originalTx);if(tx)tx.status='Hoàn tiền';cmsCloseRefundApproveModal();cmsSearchPaymentRefunds();cmsPaymentAlert('paymentRefundAlert','success','Đã duyệt yêu cầu '+item.id+'.');}
function cmsCancelRefundRequest(){var item=cmsPaymentRefunds.find(function(x){return x.id===cmsRefundSelectedId;});if(!item)return;item.status='Đã hủy';item.updatedBy='admin';cmsCloseRefundApproveModal();cmsSearchPaymentRefunds();cmsPaymentAlert('paymentRefundAlert','success','Đã hủy yêu cầu '+item.id+'.');}
function cmsOpenRefundViewModal(id){var item=cmsPaymentRefunds.find(function(x){return x.id===id;});if(!item)return;document.getElementById('refundViewContent').innerHTML=cmsRefundDetailHtml(item);document.getElementById('refundViewModal').classList.add('show');}
function cmsCloseRefundViewModal(){var m=document.getElementById('refundViewModal');if(m)m.classList.remove('show');}
function cmsToggleRefundColumns(btn){var old=document.getElementById('refundColumnPicker');if(old){old.remove();return;}var table=document.getElementById('paymentRefundTable');if(!table)return;var panel=document.createElement('div');panel.id='refundColumnPicker';panel.className='column-picker show';Array.from(table.tHead.rows[0].cells).forEach(function(th,i){if(i===0||i===13)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsRefundHiddenColumns.has(i);c.onchange=function(){if(c.checked)cmsRefundHiddenColumns.delete(i);else cmsRefundHiddenColumns.add(i);cmsApplyRefundColumns();};l.append(c,document.createTextNode(th.textContent.trim()));panel.append(l);});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close);}},0);},0);}
function cmsApplyRefundColumns(){var table=document.getElementById('paymentRefundTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=cmsRefundHiddenColumns.has(i)?'none':'';});});}

var cmsTransactionHiddenColumns = new Set();
function cmsSearchPaymentTransactions(keepPage){
  var user=cmsGetValue('txFilterUser').toLowerCase(),myvtc=cmsGetValue('txFilterMyvtc').toLowerCase(),vtcpay=cmsGetValue('txFilterVtcpay').toLowerCase(),partner=cmsGetValue('txFilterPartner').toLowerCase(),product=cmsGetValue('txFilterProduct'),packageName=cmsGetValue('txFilterPackage'),type=cmsGetValue('txFilterType'),status=cmsGetValue('txFilterStatus'),from=cmsGetValue('txFilterFrom'),to=cmsGetValue('txFilterTo'),quick=cmsGetValue('txQuickSearch').toLowerCase();
  cmsPaymentTransactionFiltered=cmsPaymentTransactions.filter(function(tx){var key=cmsPaymentDateKey(tx.createdAt),all=[tx.id,tx.vtcPayId,tx.partnerRef,tx.user,tx.type,tx.product,tx.packageName,tx.partnerValue,tx.money,tx.point,tx.method,tx.updatedBy,tx.status].join(' ').toLowerCase();return (!user||tx.user.toLowerCase().indexOf(user)>=0)&&(!myvtc||tx.id.toLowerCase().indexOf(myvtc)>=0)&&(!vtcpay||String(tx.vtcPayId).toLowerCase().indexOf(vtcpay)>=0)&&(!partner||String(tx.partnerRef).toLowerCase().indexOf(partner)>=0)&&(!product||tx.product===product)&&(!packageName||tx.packageName===packageName)&&(!type||tx.type===type)&&(!status||tx.status===status)&&(!from||key>=from.slice(0,10))&&(!to||key<=to.slice(0,10))&&(!quick||all.indexOf(quick)>=0);}).sort(function(a,b){return cmsPaymentDateValue(b.createdAt)-cmsPaymentDateValue(a.createdAt);});
  if(!keepPage)cmsPaymentTransactionPage=1;cmsRenderPaymentTransactions();
}
function cmsPaymentDateKey(value){var m=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(String(value||''));return m?m[3]+'-'+m[2]+'-'+m[1]:'';}
function cmsPaymentDateValue(value){var m=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(String(value||''));return m?new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime():0;}
function cmsRenderPaymentTransactions(){var tbody=document.getElementById('paymentTransactionRows');if(!tbody)return;var total=cmsPaymentTransactionFiltered.length,totalPage=Math.max(1,Math.ceil(total/cmsPaymentPageSize));cmsPaymentTransactionPage=Math.min(Math.max(1,cmsPaymentTransactionPage),totalPage);var start=(cmsPaymentTransactionPage-1)*cmsPaymentPageSize,rows=cmsPaymentTransactionFiltered.slice(start,start+cmsPaymentPageSize);tbody.innerHTML=rows.length?rows.map(function(tx,i){return '<tr><td>'+(start+i+1)+'</td><td>'+cmsSafeText(tx.createdAt)+'</td><td>'+cmsSafeText(tx.id)+'</td><td>'+cmsSafeText(tx.vtcPayId||'-')+'</td><td>'+cmsSafeText(tx.partnerRef||'-')+'</td><td>'+cmsSafeText(tx.user)+'</td><td>'+cmsSafeText(tx.type)+'</td><td>'+cmsSafeText(tx.product)+'</td><td>'+cmsSafeText(tx.packageName)+'</td><td>'+cmsSafeText(tx.partnerValue)+'</td><td>'+Number(tx.money||0).toLocaleString('vi-VN')+'</td><td>'+Number(tx.point||0).toLocaleString('vi-VN')+'</td><td>'+cmsSafeText(tx.method)+'</td><td>'+cmsSafeText(tx.updatedBy)+'</td><td class="ops"><button class="icon-square yellow" title="View" onclick="cmsShowTransactionDetail(\''+tx.id+'\')"><i class="fa fa-eye"></i></button></td></tr>';}).join(''):'<tr><td colspan="15" style="text-align:center">Không có giao dịch phù hợp.</td></tr>';document.getElementById('paymentTransactionCount').textContent=total?'Hiển thị từ '+(start+1)+' tới '+Math.min(start+rows.length,total)+' của '+total+' bản ghi':'Không có bản ghi';document.getElementById('paymentTransactionPage').textContent=cmsPaymentTransactionPage+' / '+totalPage;cmsApplyTransactionColumns();}
function cmsSetTransactionPage(page){cmsPaymentTransactionPage=page;cmsRenderPaymentTransactions();}
function cmsShowTransactionDetail(id){var tx=cmsPaymentTransactions.find(function(x){return x.id===id;}),modal=document.getElementById('transactionDetailModal'),node=document.getElementById('transactionDetailContent');if(!tx||!modal||!node)return;var fields=[['Thời gian',tx.createdAt],['Mã giao dịch MyVTC',tx.id],['Mã giao dịch VTC Pay',tx.vtcPayId||'-'],['Mã đối tác',tx.partnerRef||'-'],['Tài khoản',tx.user],['Loại giao dịch',tx.type],['Sản phẩm',tx.product],['Gói nạp',tx.packageName],['Mệnh giá đối tác',tx.partnerValue],['Giá trị',Number(tx.money||0).toLocaleString('vi-VN')+' VNĐ'],['Số Point',Number(tx.point||0).toLocaleString('vi-VN')+' Point'],['Phương thức thanh toán',tx.method],['Trạng thái',tx.status],['Người cập nhật',tx.updatedBy],['Thiết bị',tx.device],['Phiên bản',tx.version],['Mô tả',tx.description||'-']];node.innerHTML=fields.map(function(f){return '<div><span>'+cmsSafeText(f[0])+'</span><strong>'+cmsSafeText(f[1])+'</strong></div>';}).join('');modal.classList.add('show');}
function cmsCloseTransactionDetail(){var modal=document.getElementById('transactionDetailModal');if(modal)modal.classList.remove('show');}
function cmsToggleTransactionColumns(btn){var old=document.getElementById('transactionColumnPicker');if(old){old.remove();return;}var table=document.getElementById('paymentTransactionTable');if(!table)return;var panel=document.createElement('div');panel.id='transactionColumnPicker';panel.className='column-picker show';Array.from(table.tHead.rows[0].cells).forEach(function(th,i){if(i===0||i===14)return;var label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=!cmsTransactionHiddenColumns.has(i);check.onchange=function(){if(check.checked)cmsTransactionHiddenColumns.delete(i);else cmsTransactionHiddenColumns.add(i);cmsApplyTransactionColumns();};label.append(check,document.createTextNode(th.textContent.trim()));panel.append(label);});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close);}},0);},0);}
function cmsApplyTransactionColumns(){var table=document.getElementById('paymentTransactionTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=cmsTransactionHiddenColumns.has(i)?'none':'';});});}

function cmsExportPaymentTransactions(){
  cmsConfirmAction('Xác nhận xuất dữ liệu','Xuất <b>' + cmsPaymentTransactionFiltered.length + '</b> giao dịch theo bộ lọc hiện tại?','Xuất dữ liệu',function(){});
}

function cmsAdjustmentDateToValue(text){
  var p=String(text||'').split(' ')[0].split('/');
  return p.length===3 ? p[2]+'-'+p[1]+'-'+p[0] : '';
}
function cmsAdjustmentFormatDate(value){
  if(!value)return '-';
  var p=String(value).split('-');
  return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:value;
}
function cmsAdjustmentCurrentMonthRange(){
  var now=new Date(2026,6,29),y=now.getFullYear(),m=String(now.getMonth()+1).padStart(2,'0');
  return {from:y+'-'+m+'-01',to:y+'-'+m+'-'+String(new Date(y,now.getMonth()+1,0).getDate()).padStart(2,'0')};
}
function cmsOpenAdjustmentForm(){
  showScreen('payment-adjustment-form');
  cmsResetAdjustmentForm();
}
function cmsResetAdjustmentForm(){
  var range=cmsAdjustmentCurrentMonthRange();
  cmsSetValue('adjustmentAccount','0936168687');
  cmsSetValue('adjustmentFromDate',range.from);cmsSetValue('adjustmentToDate',range.to);
  cmsSetValue('adjustmentType','Thu hồi');cmsSetValue('adjustmentReason','');cmsSetValue('adjustmentNewExpiry','');
  cmsAdjustmentSelectedTransaction=null;
  cmsAdjustmentTypeChanged();cmsRenderAdjustmentSourceTransactions();
  cmsPaymentAlert('paymentAdjustmentFormAlert','','');
}
function cmsAdjustmentAccountChanged(){cmsAdjustmentSelectedTransaction=null;cmsRenderAdjustmentSourceTransactions();}
function cmsAdjustmentTypeChanged(){
  var add=cmsGetValue('adjustmentType')==='Cộng bù';
  var field=document.getElementById('adjustmentNewExpiryField');if(field)field.classList.toggle('hidden',!add);
}
function cmsRenderAdjustmentSourceTransactions(){
  var tbody=document.getElementById('adjustmentSourceRows');if(!tbody)return;
  var account=cmsGetValue('adjustmentAccount').toLowerCase(),from=cmsGetValue('adjustmentFromDate'),to=cmsGetValue('adjustmentToDate');
  var rows=cmsAdjustmentSourceTransactions.filter(function(tx){
    var d=cmsAdjustmentDateToValue(tx.time);
    return (!account||tx.account.toLowerCase().indexOf(account)>-1) && (!from||d>=from) && (!to||d<=to);
  });
  tbody.innerHTML=rows.length?rows.map(function(tx,i){return '<tr class="'+(cmsAdjustmentSelectedTransaction===tx.id?'selected':'')+'"><td><input type="radio" name="adjustmentSourceTransaction" '+(cmsAdjustmentSelectedTransaction===tx.id?'checked':'')+' onchange="cmsSelectAdjustmentTransaction(\''+tx.id+'\')"/></td><td>'+(i+1)+'</td><td>'+cmsSafeText(tx.time)+'</td><td>'+cmsSafeText(tx.id)+'</td><td>'+cmsPaymentNumber(tx.point,'Point')+'</td><td>'+cmsSafeText(tx.expired)+'</td></tr>';}).join(''):'<tr><td colspan="6" class="empty-cell">Không có giao dịch Nạp Point phù hợp.</td></tr>';
  var count=document.getElementById('adjustmentSourceCount');if(count)count.textContent=rows.length+' giao dịch';
}
function cmsSelectAdjustmentTransaction(id){cmsAdjustmentSelectedTransaction=id;cmsRenderAdjustmentSourceTransactions();}
function cmsOpenAdjustmentConfirm(){
  var account=cmsGetValue('adjustmentAccount'),type=cmsGetValue('adjustmentType'),reason=cmsGetValue('adjustmentReason'),newExpiry=cmsGetValue('adjustmentNewExpiry');
  var tx=cmsAdjustmentSourceTransactions.find(function(x){return x.id===cmsAdjustmentSelectedTransaction;});
  if(!account||!tx||!reason||(type==='Cộng bù'&&!newExpiry)){
    cmsPaymentAlert('paymentAdjustmentFormAlert','error','Vui lòng nhập tài khoản, chọn giao dịch, nhập lý do'+(type==='Cộng bù'?' và chọn ngày hết hạn mới.':'.'));
    return;
  }
  var title=document.getElementById('adjustmentConfirmTitle'),btn=document.getElementById('adjustmentConfirmButton');
  title.innerHTML='<i class="fa '+(type==='Thu hồi'?'fa-minus-circle':'fa-plus-circle')+'"></i> Xác nhận '+type+' Point';
  btn.className='btn '+(type==='Thu hồi'?'red':'blue');btn.innerHTML='<i class="fa fa-check"></i> Xác nhận '+type;
  document.getElementById('adjustmentConfirmSummary').innerHTML='<div class="adjustment-confirm-grid"><b>Tài khoản</b><span>'+cmsSafeText(account)+'</span><b>Mã giao dịch</b><span>'+cmsSafeText(tx.id)+'</span><b>Số lượng Point</b><span>'+cmsPaymentNumber(tx.point,'Point')+'</span><b>Ngày hết hạn</b><span>'+cmsSafeText(type==='Cộng bù'?cmsAdjustmentFormatDate(newExpiry):tx.expired)+'</span><b>Loại nghiệp vụ</b><span>'+cmsSafeText(type)+'</span></div>';
  var reasonField=document.getElementById('adjustmentConfirmReasonField');reasonField.classList.toggle('hidden',type!=='Thu hồi');
  cmsSetValue('adjustmentConfirmReason',reason);document.getElementById('adjustmentConfirmReasonError').textContent='';
  document.getElementById('paymentAdjustmentConfirmModal').classList.add('show');
}
function cmsCloseAdjustmentConfirm(){document.getElementById('paymentAdjustmentConfirmModal').classList.remove('show');}
function cmsConfirmPointAdjustment(){
  var type=cmsGetValue('adjustmentType'),reason=type==='Thu hồi'?cmsGetValue('adjustmentConfirmReason'):cmsGetValue('adjustmentReason');
  if(type==='Thu hồi'&&!reason){document.getElementById('adjustmentConfirmReasonError').textContent='Vui lòng nhập lý do thu hồi.';return;}
  var tx=cmsAdjustmentSourceTransactions.find(function(x){return x.id===cmsAdjustmentSelectedTransaction;});if(!tx)return;
  var now='29/07/2026 16:43',id='ADJ-20260729-'+String(cmsPaymentAdjustments.length+1).padStart(3,'0');
  cmsPaymentAdjustments.unshift({time:tx.time,originalId:tx.id,id:id,point:tx.point,expired:type==='Cộng bù'?cmsAdjustmentFormatDate(cmsGetValue('adjustmentNewExpiry')):tx.expired,type:type,updated:now,updatedBy:'admin',reason:reason});
  cmsCloseAdjustmentConfirm();showScreen('payment-adjustment');cmsRenderPaymentAdjustments();
  cmsPaymentAlert('paymentAdjustmentAlert','success','Đã '+type.toLowerCase()+' '+cmsPaymentNumber(tx.point,'Point')+' cho giao dịch '+tx.id+'.');
}
function cmsToggleAdjustmentColumns(){
  var table=document.getElementById('paymentAdjustmentTable');if(!table)return;
  var labels=Array.prototype.map.call(table.querySelectorAll('thead th'),function(th){return th.textContent.trim();});
  cmsConfirmAction('Ẩn hiện cột','<div class="column-picker-list">'+labels.map(function(label,i){return '<label><input type="checkbox" '+(!cmsAdjustmentHiddenColumns.has(i)?'checked':'')+' onchange="cmsSetAdjustmentColumn('+i+',this.checked)"> '+cmsSafeText(label)+'</label>';}).join('')+'</div>','Đóng',function(){});
}
function cmsSetAdjustmentColumn(index,visible){visible?cmsAdjustmentHiddenColumns.delete(index):cmsAdjustmentHiddenColumns.add(index);cmsApplyAdjustmentColumns();}
function cmsApplyAdjustmentColumns(){
  var table=document.getElementById('paymentAdjustmentTable');if(!table)return;
  Array.prototype.forEach.call(table.rows,function(row){Array.prototype.forEach.call(row.cells,function(cell,i){cell.style.display=cmsAdjustmentHiddenColumns.has(i)?'none':'';});});
}
function cmsRenderPaymentAdjustments(){
  var tbody=document.getElementById('paymentAdjustmentRows');if(!tbody)return;
  var q=cmsGetValue('adjustmentQuickSearch').toLowerCase();
  var from=cmsGetValue('adjustmentListFromDate'),to=cmsGetValue('adjustmentListToDate');
  var transaction=cmsGetValue('adjustmentListTransaction').toLowerCase(),type=cmsGetValue('adjustmentListType');
  var rows=cmsPaymentAdjustments.filter(function(item){
    var d=cmsAdjustmentDateToValue(item.time);
    return (!from||d>=from)&&(!to||d<=to)&&(!transaction||[item.originalId,item.id].join(' ').toLowerCase().indexOf(transaction)>-1)&&(!type||item.type===type)&&(!q||[item.time,item.originalId,item.id,item.point,item.expired,item.type,item.updated,item.updatedBy,item.reason].join(' ').toLowerCase().indexOf(q)>-1);
  });
  tbody.innerHTML=rows.length?rows.map(function(item,i){var cls=item.type==='Cộng bù'?'payment-positive':'payment-negative';return '<tr><td>'+(i+1)+'</td><td>'+cmsSafeText(item.time)+'</td><td>'+cmsSafeText(item.originalId||'-')+'</td><td class="'+cls+'">'+cmsPaymentNumber(item.point,'Point')+'</td><td>'+cmsSafeText(item.expired||'-')+'</td><td>'+cmsSafeText(item.type)+'</td><td>'+cmsSafeText(item.id)+'</td><td>'+cmsSafeText(item.updated)+'</td><td>'+cmsSafeText(item.updatedBy)+'</td><td>'+cmsSafeText(item.reason)+'</td></tr>';}).join(''):'<tr><td colspan="10" class="empty-cell">Không có giao dịch Cộng bù/Thu hồi Point.</td></tr>';
  var count=document.getElementById('paymentAdjustmentCount');if(count)count.textContent=rows.length+' bản ghi';cmsApplyAdjustmentColumns();
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

/* Đã bỏ cơ chế chặn nút Thêm mới/Cập nhật dùng chung của Loyalty.
   Từng CMS tự quản lý màn hình và luồng cấu hình riêng. */
document.addEventListener('DOMContentLoaded',function(){
  setTimeout(cmsPaymentRateInitMulti,0);
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
    row.dataset.filterMatch=ok?'true':'false';
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
  if(screen.id==='screen-recharge-package-list'){
    cmsRechargePackagePage=1;
    cmsRenderRechargePackagePagination();
  }
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
function cmsAccMultiFilter(label,id,opts){var items=opts.filter(function(x){return x!=='Tất cả'});return '<div class="acc-multi-filter"><span>'+label+'</span><details ontoggle="cmsAccMultiToggle(this)"><summary id="'+id+'Summary">Tất cả</summary><div class="acc-multi-options"><label class="acc-multi-all"><input type="checkbox" checked onchange="cmsAccToggleMultiAll(\''+id+'\',this)"><span>Tất cả</span></label>'+items.map(function(x){return '<label><input type="checkbox" data-multi="'+id+'" value="'+x+'" onchange="cmsAccUpdateMulti(\''+id+'\')"><span>'+x+'</span></label>'}).join('')+'</div></details></div>'}

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
function cmsAexpRender(){var body=document.getElementById('aexpTableBody');if(!body)return;var rows=cmsAexpFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsAexpState.size));if(cmsAexpState.page>pages)cmsAexpState.page=pages;var off=(cmsAexpState.page-1)*cmsAexpState.size,part=rows.slice(off,off+cmsAexpState.size);body.innerHTML=part.map(function(x,i){var r=x.row,a='<button class="icon-square orange" title="Cập nhật" onclick="cmsAexpOpenForm('+x.index+')"><i class="fa fa-edit"></i></button> ';if(r.status==='Hiệu lực'||r.status==='Chờ áp dụng')a+='<button class="icon-square red" title="Hủy" onclick="cmsAexpCancel('+x.index+')"><i class="fa fa-ban"></i></button> ';a+='<button class="icon-square red" title="Xóa" onclick="cmsAexpDelete('+x.index+')"><i class="fa fa-trash"></i></button>';return '<tr><td>'+(off+i+1)+'</td><td>'+r.name+'</td><td>'+r.unit+'</td><td>'+r.product+'</td><td>'+r.event+'</td><td>'+r.value+'</td><td>'+r.limit+' / '+r.period+'</td><td>'+cmsAexpFormatDate(r.start)+'</td><td>'+cmsAexpFormatDate(r.end)+'</td><td><span class="texp-table-status '+cmsAexpStatusClass(r.status)+'">'+r.status+'</span></td><td class="action-cell">'+a+'</td></tr>'}).join('')||'<tr><td colspan="12" style="text-align:center">Không có dữ liệu</td></tr>';document.getElementById('aexpPageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsAexpState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';var p=document.getElementById('aexpPager');p.innerHTML='<button '+(cmsAexpState.page===1?'disabled':'')+' onclick="cmsAexpPage('+(cmsAexpState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsAexpState.page?'active':'')+'" onclick="cmsAexpPage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsAexpState.page===pages?'disabled':'')+' onclick="cmsAexpPage('+(cmsAexpState.page+1)+')">Tiếp</button>';cmsAexpApplyColumns()}
function cmsAexpPage(p){cmsAexpState.page=p;cmsAexpRender()}
function cmsAexpOpenForm(index){cmsAexpState.editIndex=typeof index==='number'?index:null;showScreen('loyalty-aexp-form');cmsAexpResetForm(false);var edit=cmsAexpState.editIndex!==null,r=edit?cmsAexpRows[cmsAexpState.editIndex]:null;document.getElementById('aexpFormTitle').textContent=edit?'Cập nhật thiết lập':'Thêm mới thiết lập';if(r){aexpName.value=r.name;aexpEventForm.value=r.event;aexpValue.value=r.value;aexpLimit.value=r.limit;aexpLimitPeriod.value=r.period;aexpStart.value=r.start;aexpEnd.value=r.end;cmsAccSetMultiValues('aexpUnitForm',r.unit);cmsAccSetMultiValues('aexpProductForm',r.product)}['aexpEventForm','aexpUnitControl','aexpProductControl'].forEach(function(id){var el=document.getElementById(id);if(el){if(el.tagName==='SELECT')el.disabled=edit;else{el.classList.toggle('is-disabled',edit);el.querySelectorAll('input').forEach(function(x){x.disabled=edit});var d=el.querySelector('details');if(d)d.ontoggle=edit?function(){this.open=false}:null}}})}
function cmsAexpResetForm(clearMode){['aexpName','aexpValue','aexpLimit','aexpStart','aexpEnd'].forEach(function(id){var e=document.getElementById(id);if(e)e.value=''});cmsAccSetMultiValues('aexpUnitForm','Tất cả');cmsAccSetMultiValues('aexpProductForm','Tất cả');var ev=document.getElementById('aexpEventForm');if(ev)ev.selectedIndex=0;var lp=document.getElementById('aexpLimitPeriod');if(lp)lp.value='Ngày';document.querySelectorAll('#screen-loyalty-aexp-form .field-error').forEach(function(e){e.textContent=''});cmsSetAlert('aexpFormAlert','','');if(clearMode!==false)cmsAexpState.editIndex=null}
function cmsAexpSave(){var ids=['aexpName','aexpEventForm','aexpValue','aexpLimit','aexpStart','aexpEnd'],ok=true;ids.forEach(function(id){var e=document.getElementById(id),er=document.getElementById('err-'+id);var bad=!e||!String(e.value).trim();if(er)er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});var unit=cmsAexpMultiValue('aexpUnitForm'),product=cmsAexpMultiValue('aexpProductForm');if(!unit){document.getElementById('err-aexpUnitForm').textContent='Trường bắt buộc.';ok=false}if(!product){document.getElementById('err-aexpProductForm').textContent='Trường bắt buộc.';ok=false}if(aexpStart.value&&aexpEnd.value&&new Date(aexpEnd.value)<=new Date(aexpStart.value)){document.getElementById('err-aexpEnd').textContent='Ngày kết thúc phải sau ngày áp dụng.';ok=false}if(!ok)return;var status=new Date(aexpStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực',row={name:aexpName.value.trim(),event:aexpEventForm.value,unit:unit,product:product,value:+aexpValue.value,limit:+aexpLimit.value,period:aexpLimitPeriod.value,start:aexpStart.value,end:aexpEnd.value,status:status};if(cmsAexpState.editIndex!==null){var old=cmsAexpRows[cmsAexpState.editIndex];row.event=old.event;row.unit=old.unit;row.product=old.product;row.status=old.status;cmsAexpRows[cmsAexpState.editIndex]=row}else cmsAexpRows.push(row);cmsSetAlert('aexpFormAlert','success','Đã lưu thiết lập A-EXP.');cmsAexpRender()}
function cmsAexpCancel(i){cmsAccConfirm('Hủy thiết lập','Bạn xác nhận hủy thiết lập A-EXP này?',function(){cmsAexpRows[i].status='Tạm dừng';cmsAexpRender()})}
function cmsAexpDelete(i){cmsAccConfirm('Xóa thiết lập','Bạn xác nhận xóa thiết lập A-EXP này?',function(){cmsAexpRows.splice(i,1);cmsAexpRender()})}
function cmsAexpApplyColumns(){var table=document.getElementById('aexpTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(c,i){c.style.display=cmsAexpState.hiddenColumns.has(i)?'none':''})})}
function cmsAexpToggleColumns(btn){var old=document.getElementById('aexpColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='aexpColumnPicker';panel.className='column-picker show';document.querySelectorAll('#aexpTable thead th').forEach(function(th,i){if(i===13)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsAexpState.hiddenColumns.has(i);c.onchange=function(){if(c.checked)cmsAexpState.hiddenColumns.delete(i);else cmsAexpState.hiddenColumns.add(i);cmsAexpApplyColumns()};l.append(c,document.createTextNode(th.textContent.trim()));panel.append(l)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
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
function cmsRankRender(){var body=document.getElementById('rankTableBody');if(!body)return;var rows=cmsRankFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsRankState.size));if(cmsRankState.page>pages)cmsRankState.page=pages;var off=(cmsRankState.page-1)*cmsRankState.size,part=rows.slice(off,off+cmsRankState.size);body.innerHTML=part.map(function(x){var r=x.row,a='<button class="icon-square orange" title="Cập nhật" onclick="cmsRankOpenForm('+x.index+')"><i class="fa fa-edit"></i></button> ';if(r.status==='Hiệu lực'||r.status==='Chờ áp dụng')a+='<button class="icon-square red" title="Hủy" onclick="cmsRankCancel('+x.index+')"><i class="fa fa-ban"></i></button> ';a+='<button class="icon-square red" title="Xóa" onclick="cmsRankDelete('+x.index+')"><i class="fa fa-trash"></i></button>';return '<tr><td><span class="rank-name-cell"><span class="rank-color-dot" style="background:'+r.color+'"></span>'+r.name+'</span></td><td>'+r.order+'</td><td>'+r.minExp.toLocaleString('vi-VN')+'</td><td>'+r.maintainExp.toLocaleString('vi-VN')+'</td><td>'+r.description+'</td><td>'+cmsAexpFormatDate(r.start)+'</td><td>'+cmsAexpFormatDate(r.end)+'</td><td><span class="texp-table-status '+cmsRankStatusClass(r.status)+'">'+r.status+'</span></td><td class="action-cell">'+a+'</td></tr>'}).join('')||'<tr><td colspan="10" style="text-align:center">Không có dữ liệu</td></tr>';document.getElementById('rankPageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsRankState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';var p=document.getElementById('rankPager');p.innerHTML='<button '+(cmsRankState.page===1?'disabled':'')+' onclick="cmsRankPage('+(cmsRankState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsRankState.page?'active':'')+'" onclick="cmsRankPage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsRankState.page===pages?'disabled':'')+' onclick="cmsRankPage('+(cmsRankState.page+1)+')">Tiếp</button>';cmsRankApplyColumns()}
function cmsRankPage(p){cmsRankState.page=p;cmsRankRender()}
function cmsRankOpenForm(index){var edit=typeof index==='number';if(edit&&cmsRankRows[index].status!=='Chờ áp dụng'){cmsAccInfo('Chỉ được cập nhật cấu hình đang Chờ áp dụng.');return}cmsRankState.editIndex=edit?index:null;showScreen('loyalty-rank-form');cmsRankResetForm(false);document.getElementById('rankFormTitle').textContent=edit?'Cập nhật thiết lập':'Thêm mới thiết lập';if(edit){var r=cmsRankRows[index];rankName.value=r.name;rankColor.value=r.color;rankColorPicker.value=r.color;rankOrder.value=r.order;rankMinExp.value=r.minExp;rankTexpRate.value=r.texpRate;rankMaintainExp.value=r.maintainExp;rankDescription.value=r.description;rankStart.value=r.start;rankEnd.value=r.end}}
function cmsRankResetForm(clearMode){['rankName','rankOrder','rankMinExp','rankTexpRate','rankMaintainExp','rankDescription','rankStart','rankEnd'].forEach(function(id){var e=document.getElementById(id);if(e)e.value=''});var icon=document.getElementById('rankIcon');if(icon)icon.value='';var preview=document.getElementById('rankIconPreview');if(preview)preview.innerHTML='<i class="fa fa-image"></i>';var color=document.getElementById('rankColor');if(color)color.value='#C0C0C0';var picker=document.getElementById('rankColorPicker');if(picker)picker.value='#c0c0c0';document.querySelectorAll('#screen-loyalty-rank-form .field-error').forEach(function(e){e.textContent=''});cmsSetAlert('rankFormAlert','','');if(clearMode!==false)cmsRankState.editIndex=null}
function cmsRankSyncColor(v){if(/^#[0-9A-Fa-f]{6}$/.test(v))rankColorPicker.value=v}
function cmsRankPickColor(v){rankColor.value=v.toUpperCase()}
function cmsRankPreviewIcon(input){var p=document.getElementById('rankIconPreview'),f=input.files&&input.files[0];if(!p||!f)return;var reader=new FileReader();reader.onload=function(e){p.innerHTML='<img alt="Biểu tượng hạng" src="'+e.target.result+'">'};reader.readAsDataURL(f)}
function cmsRankPositive(id,label,allowZero){var e=document.getElementById(id),er=document.getElementById('err-'+id),v=Number(e.value),bad=!String(e.value).trim()||!Number.isInteger(v)||(allowZero?v<0:v<=0);if(er)er.textContent=bad?label+' phải là số nguyên '+(allowZero?'không âm.':'dương.'):'';return !bad}
function cmsRankSave(){var ok=true;['rankName','rankColor','rankStart','rankEnd'].forEach(function(id){var e=document.getElementById(id),er=document.getElementById('err-'+id),bad=!e.value.trim();if(er)er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});if(!/^#[0-9A-Fa-f]{6}$/.test(rankColor.value)){document.getElementById('err-rankColor').textContent='Nhập mã HEX theo định dạng #RRGGBB.';ok=false}ok=cmsRankPositive('rankOrder','Thứ tự hạng',false)&&ok;ok=cmsRankPositive('rankMinExp','EXP tối thiểu',false)&&ok;ok=cmsRankPositive('rankMaintainExp','EXP duy trì',false)&&ok;var tr=Number(rankTexpRate.value);if(rankTexpRate.value===''||tr<0||tr>100){document.getElementById('err-rankTexpRate').textContent='Tỉ lệ phải từ 0 đến 100.';ok=false}else document.getElementById('err-rankTexpRate').textContent='';if(rankStart.value&&rankEnd.value&&new Date(rankEnd.value)<=new Date(rankStart.value)){document.getElementById('err-rankEnd').textContent='Ngày kết thúc phải sau ngày áp dụng.';ok=false}if(!ok)return;var old=cmsRankState.editIndex!==null?cmsRankRows[cmsRankState.editIndex]:null,row={name:rankName.value.trim(),order:+rankOrder.value,minExp:+rankMinExp.value,texpRate:+rankTexpRate.value,maintainExp:+rankMaintainExp.value,description:rankDescription.value.trim(),start:rankStart.value,end:rankEnd.value,status:old?old.status:(new Date(rankStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực'),color:rankColor.value.toUpperCase(),icon:''};if(old)cmsRankRows[cmsRankState.editIndex]=row;else cmsRankRows.push(row);cmsSetAlert('rankFormAlert','success','Đã lưu thiết lập hạng thành viên.');cmsRankRender()}
function cmsRankCancel(i){cmsAccConfirm('Hủy thiết lập','Bạn xác nhận hủy thiết lập hạng thành viên này?',function(){cmsRankRows[i].status='Tạm dừng';cmsRankRender()})}
function cmsRankDelete(i){cmsAccConfirm('Xóa thiết lập','Bạn xác nhận xóa thiết lập hạng thành viên này?',function(){cmsRankRows.splice(i,1);cmsRankRender()})}
function cmsRankApplyColumns(){var table=document.getElementById('rankTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(c,i){c.style.display=cmsRankState.hiddenColumns.has(i)?'none':''})})}
function cmsRankToggleColumns(btn){var old=document.getElementById('rankColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='rankColumnPicker';panel.className='column-picker show';document.querySelectorAll('#rankTable thead th').forEach(function(th,i){if(i===9)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsRankState.hiddenColumns.has(i);c.onchange=function(){if(c.checked)cmsRankState.hiddenColumns.delete(i);else cmsRankState.hiddenColumns.add(i);cmsRankApplyColumns()};l.append(c,document.createTextNode(th.textContent.trim()));panel.append(l)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsRankRender);

var cmsCycleRows=[
 {object:'Hệ thống',unit:'Tất cả',product:'Tất cả',length:12,lengthUnit:'Tháng',reviewTime:'2026-12-31T23:59:00',start:'2026-01-01T00:00:00',end:'2026-12-31T23:59:59',status:'Hiệu lực'},
 {object:'Tài khoản',unit:'VTC Game',product:'Audition',length:365,lengthUnit:'Ngày',reviewTime:'2027-06-30T23:59:00',start:'2026-07-01T00:00:00',end:'2027-06-30T23:59:59',status:'Chờ áp dụng'},
 {object:'Tài khoản',unit:'VTC Pay',product:'Số dư MyVTC',length:1,lengthUnit:'Năm',reviewTime:'2025-12-31T23:59:00',start:'2025-01-01T00:00:00',end:'2025-12-31T23:59:59',status:'Hết hiệu lực'}
];
var cmsCycleState={page:1,size:10,hiddenColumns:new Set(),editIndex:null};
function cmsCycleInit(){
 var objectFilter=document.getElementById('cycleObjectFilter');if(!objectFilter)return;
 objectFilter.innerHTML=cmsAccMultiFilter('Đối tượng','cycleObjectFilterValue',['Tất cả','Hệ thống','Tài khoản']);
 document.getElementById('cycleUnitFilter').innerHTML=cmsAccMultiFilter('Đơn vị','cycleUnitFilterValue',cmsAccUnits);
 document.getElementById('cycleProductFilter').innerHTML=cmsAccMultiFilter('Sản phẩm','cycleProductFilterValue',['Tất cả'].concat(cmsAccProducts));
 document.getElementById('cycleObjectControl').innerHTML=cmsAccMultiFilter('','cycleObjectForm',['Hệ thống','Tài khoản']);
 document.getElementById('cycleUnitControl').innerHTML=cmsAccMultiFilter('','cycleUnitForm',cmsAccUnits);
 document.getElementById('cycleProductControl').innerHTML=cmsAccMultiFilter('','cycleProductForm',['Tất cả'].concat(cmsAccProducts));
 cmsCycleRender();
}
function cmsCycleSelected(id){var values=cmsAccGetMultiValues(id);return values.length&&values.indexOf('Tất cả')<0?values:null}
function cmsCycleFiltered(){
 var objects=cmsCycleSelected('cycleObjectFilterValue'),units=cmsCycleSelected('cycleUnitFilterValue'),products=cmsCycleSelected('cycleProductFilterValue');
 var q=((document.getElementById('cycleQuickSearch')||{}).value||'').trim().toLowerCase();
 return cmsCycleRows.map(function(row,index){return {row:row,index:index}}).filter(function(item){var r=item.row;return(!objects||objects.indexOf(r.object)>=0)&&(!units||units.some(function(v){return r.unit.indexOf(v)>=0}))&&(!products||products.some(function(v){return r.product.indexOf(v)>=0}))&&(!q||Object.values(r).join(' ').toLowerCase().indexOf(q)>=0)})
}
function cmsCycleSearch(){cmsCycleState.page=1;cmsCycleRender()}
function cmsCycleStatusClass(status){return status==='Hiệu lực'?'texp-status-active':status==='Chờ áp dụng'?'texp-status-waiting':status==='Hết hiệu lực'?'texp-status-expired':'texp-status-paused'}
function cmsCycleFormat(value){return typeof cmsAexpFormatDate==='function'?cmsAexpFormatDate(value):value}
function cmsCycleRender(){
 var body=document.getElementById('cycleTableBody');if(!body)return;var rows=cmsCycleFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsCycleState.size));if(cmsCycleState.page>pages)cmsCycleState.page=pages;var off=(cmsCycleState.page-1)*cmsCycleState.size,part=rows.slice(off,off+cmsCycleState.size);
 body.innerHTML=part.map(function(x){var r=x.row,a='<button class="icon-square orange" title="Cập nhật" onclick="cmsCycleOpenForm('+x.index+')"><i class="fa fa-edit"></i></button> ';if(r.status==='Hiệu lực'||r.status==='Chờ áp dụng')a+='<button class="icon-square red" title="Hủy" onclick="cmsCycleCancel('+x.index+')"><i class="fa fa-ban"></i></button> ';a+='<button class="icon-square red" title="Xóa" onclick="cmsCycleDelete('+x.index+')"><i class="fa fa-trash"></i></button>';return '<tr><td>'+r.object+'</td><td>'+r.unit+'</td><td>'+r.product+'</td><td>'+r.length+' '+r.lengthUnit+'</td><td>'+cmsCycleFormat(r.reviewTime)+'</td><td>'+cmsCycleFormat(r.start)+'</td><td>'+cmsCycleFormat(r.end)+'</td><td><span class="texp-table-status '+cmsCycleStatusClass(r.status)+'">'+r.status+'</span></td><td class="action-cell">'+a+'</td></tr>'}).join('')||'<tr><td colspan="10" style="text-align:center">Không có dữ liệu</td></tr>';
 document.getElementById('cyclePageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsCycleState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';document.getElementById('cyclePager').innerHTML='<button '+(cmsCycleState.page===1?'disabled':'')+' onclick="cmsCyclePage('+(cmsCycleState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,i){return '<button class="'+(i+1===cmsCycleState.page?'active':'')+'" onclick="cmsCyclePage('+(i+1)+')">'+(i+1)+'</button>'}).join('')+'<button '+(cmsCycleState.page===pages?'disabled':'')+' onclick="cmsCyclePage('+(cmsCycleState.page+1)+')">Tiếp</button>';cmsCycleApplyColumns();
}
function cmsCyclePage(page){cmsCycleState.page=page;cmsCycleRender()}
function cmsCycleOpenForm(index){cmsCycleState.editIndex=typeof index==='number'?index:null;showScreen('loyalty-cycle-form');cmsCycleResetForm(false);document.getElementById('cycleFormTitle').textContent=cmsCycleState.editIndex===null?'Thêm mới cấu hình':'Cập nhật cấu hình';if(cmsCycleState.editIndex!==null){var r=cmsCycleRows[cmsCycleState.editIndex];cmsAccSetMultiValues('cycleObjectForm',r.object);cmsAccSetMultiValues('cycleUnitForm',r.unit);cmsAccSetMultiValues('cycleProductForm',r.product);cycleLength.value=r.length;cycleLengthUnit.value=r.lengthUnit;cycleReviewTime.value=r.reviewTime;cycleStart.value=r.start;cycleEnd.value=r.end}}
function cmsCycleResetForm(clearMode){['cycleObjectForm','cycleUnitForm','cycleProductForm'].forEach(function(id){cmsAccSetMultiValues(id,'Tất cả');var er=document.getElementById('err-'+id);if(er)er.textContent=''});['cycleLength','cycleReviewTime','cycleStart','cycleEnd'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';var er=document.getElementById('err-'+id);if(er)er.textContent=''});if(document.getElementById('cycleLengthUnit'))cycleLengthUnit.value='Ngày';cmsSetAlert('cycleFormAlert','','');if(clearMode!==false&&cmsCycleState.editIndex!==null){var r=cmsCycleRows[cmsCycleState.editIndex];cmsAccSetMultiValues('cycleObjectForm',r.object);cmsAccSetMultiValues('cycleUnitForm',r.unit);cmsAccSetMultiValues('cycleProductForm',r.product);cycleLength.value=r.length;cycleLengthUnit.value=r.lengthUnit;cycleReviewTime.value=r.reviewTime;cycleStart.value=r.start;cycleEnd.value=r.end}}
function cmsCycleFormValue(id){var values=cmsAccGetMultiValues(id);return values.indexOf('Tất cả')>=0?'Tất cả':values.join(', ')}
function cmsCycleSave(){var ok=true;['cycleObjectForm','cycleUnitForm','cycleProductForm'].forEach(function(id){var er=document.getElementById('err-'+id),bad=!cmsAccGetMultiValues(id).length;if(er)er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});['cycleLength','cycleReviewTime','cycleStart','cycleEnd'].forEach(function(id){var e=document.getElementById(id),er=document.getElementById('err-'+id),bad=!String(e.value||'').trim();if(er)er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});if(!Number.isInteger(Number(cycleLength.value))||Number(cycleLength.value)<=0){document.getElementById('err-cycleLength').textContent='Độ dài chu kỳ phải là số nguyên dương.';ok=false}if(cycleEnd.value&&cycleStart.value&&new Date(cycleEnd.value)<=new Date(cycleStart.value)){document.getElementById('err-cycleEnd').textContent='Thời gian kết thúc phải sau thời gian áp dụng.';ok=false}if(cycleReviewTime.value&&cycleStart.value&&cycleEnd.value&&(new Date(cycleReviewTime.value)<new Date(cycleStart.value)||new Date(cycleReviewTime.value)>new Date(cycleEnd.value))){document.getElementById('err-cycleReviewTime').textContent='Thời điểm xét hạng phải nằm trong thời gian hiệu lực.';ok=false}if(!ok)return;var old=cmsCycleState.editIndex!==null?cmsCycleRows[cmsCycleState.editIndex]:null,row={object:cmsCycleFormValue('cycleObjectForm'),unit:cmsCycleFormValue('cycleUnitForm'),product:cmsCycleFormValue('cycleProductForm'),length:Number(cycleLength.value),lengthUnit:cycleLengthUnit.value,reviewTime:cycleReviewTime.value,start:cycleStart.value,end:cycleEnd.value,status:old?old.status:(new Date(cycleStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực')};if(old)cmsCycleRows[cmsCycleState.editIndex]=row;else cmsCycleRows.push(row);cmsSetAlert('cycleFormAlert','success','Đã lưu cấu hình chu kỳ xét hạng.');cmsCycleRender()}
function cmsCycleCancel(index){cmsAccConfirm('Hủy cấu hình','Bạn xác nhận hủy cấu hình chu kỳ xét hạng này?',function(){cmsCycleRows[index].status='Tạm dừng';cmsCycleRender()})}
function cmsCycleDelete(index){cmsAccConfirm('Xóa cấu hình','Bạn xác nhận xóa cấu hình chu kỳ xét hạng này?',function(){cmsCycleRows.splice(index,1);cmsCycleRender()})}
function cmsCycleApplyColumns(){var table=document.getElementById('cycleTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=cmsCycleState.hiddenColumns.has(i)?'none':''})})}
function cmsCycleToggleColumns(btn){var old=document.getElementById('cycleColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='cycleColumnPicker';panel.className='column-picker show';document.querySelectorAll('#cycleTable thead th').forEach(function(th,i){if(i===9)return;var label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=!cmsCycleState.hiddenColumns.has(i);check.onchange=function(){if(check.checked)cmsCycleState.hiddenColumns.delete(i);else cmsCycleState.hiddenColumns.add(i);cmsCycleApplyColumns()};label.append(check,document.createTextNode(th.textContent.trim()));panel.append(label)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsCycleInit);


/* Loyalty event benefit setting */
var cmsEventBenefitEvents=[
 {code:'EVT_DAILY_LOGIN',name:'Đăng nhập hàng ngày'},
 {code:'EVT_LINK_GOOGLE',name:'Liên kết Google'},
 {code:'EVT_LINK_APPLE',name:'Liên kết Apple'},
 {code:'EVT_VERIFY_EMAIL',name:'Xác minh email'},
 {code:'EVT_VERIFY_EKYC',name:'Xác minh eKYC'},
 {code:'EVT_LINK_BANK',name:'Liên kết tài khoản ngân hàng'},
 {code:'EVT_ENABLE_PUSH',name:'Bật thông báo (Push Notification)'},
 {code:'EVT_VIEW_CONTENT',name:'Xem nội dung / bài viết'}
];
var cmsEventBenefitRows=[
 {code:'EVT_PHONE_VERIFY',name:'Xác thực số điện thoại',condition:'Đã xác thực SĐT',transactionType:'',transactionValue:'',rewardType:'Point',rewardValue:'1000',receivePeriod:'Trọn đời',receiveLimit:1,otherLimitType:'Tài khoản',otherLimitValue:1,start:'2026-07-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực',rewardName:'Thưởng xác thực số điện thoại',imageName:'reward-phone.png',homeVisible:true,homeOrder:1,serviceVisible:false,serviceOrder:1,shopVisible:false,shopOrder:1},
 {code:'EVT_FIRST_TOPUP',name:'Nạp Point lần đầu',condition:'Phát sinh giao dịch',transactionType:'Nạp Point',transactionValue:'100000',rewardType:'Voucher',rewardValue:'Voucher giảm 10%',rewardQuantity:1,receivePeriod:'Trọn đời',receiveLimit:1,otherLimitType:'Thiết bị',otherLimitValue:1,start:'2026-08-01T00:00',end:'2027-07-31T23:59',status:'Chờ áp dụng',rewardName:'Ưu đãi nạp Point lần đầu',imageName:'reward-topup.png',homeVisible:true,homeOrder:2,serviceVisible:true,serviceOrder:1,shopVisible:false,shopOrder:2},
 {code:'EVT_PAYMENT',name:'Thanh toán dịch vụ',condition:'Phát sinh giao dịch',transactionType:'Thanh toán',transactionValue:'50000',rewardType:'EXP',rewardValue:'20',receivePeriod:'Tháng',receiveLimit:5,otherLimitType:'IP',otherLimitValue:3,start:'2026-01-01T00:00',end:'2026-06-30T23:59',status:'Hết hiệu lực',rewardName:'Thưởng thanh toán dịch vụ',imageName:'reward-payment.png',homeVisible:false,homeOrder:3,serviceVisible:true,serviceOrder:2,shopVisible:true,shopOrder:1}
];
var cmsEventBenefitState={page:1,size:10,hiddenColumns:new Set(),editIndex:null};
function cmsEventBenefitInit(){var s=document.getElementById('eventBenefitEvent');if(!s)return;var opts=cmsEventBenefitEvents.map(function(x){return '<option value="'+x.code+'">'+x.name+'</option>'}).join('');s.innerHTML=opts;cmsEventBenefitRender();cmsEventBenefitRewardChanged();cmsEventBenefitToggleAllDisplayOrders();}
function cmsEventBenefitToggleDisplayOrder(key){var visible=(document.getElementById('eventBenefit'+key+'Visible')||{}).value!=='hide',order=document.getElementById('eventBenefit'+key+'Order');if(order){order.disabled=!visible;if(!visible)order.value=''}}
function cmsEventBenefitToggleAllDisplayOrders(){['Home','Service','Shop'].forEach(cmsEventBenefitToggleDisplayOrder)}
function cmsEventBenefitPreviewImage(input){var p=document.getElementById('eventBenefitImagePreview');if(!p)return;var f=input&&input.files&&input.files[0];if(!f){p.innerHTML='<span>Chưa có ảnh</span>';return}var reader=new FileReader();reader.onload=function(e){p.innerHTML='<img src="'+e.target.result+'" alt="Ảnh đại diện">'};reader.readAsDataURL(f)}
function cmsEventBenefitFiltered(){var f=(document.getElementById('eventBenefitFromFilter')||{}).value||'',to=(document.getElementById('eventBenefitToFilter')||{}).value||'',rw=(document.getElementById('eventBenefitRewardFilter')||{}).value||'',st=(document.getElementById('eventBenefitStatusFilter')||{}).value||'',q=((document.getElementById('eventBenefitQuickSearch')||{}).value||'').toLowerCase();return cmsEventBenefitRows.map(function(r,i){return {row:r,index:i}}).filter(function(x){var r=x.row,t=Object.values(r).join(' ').toLowerCase();return(!f||new Date(r.start)>=new Date(f))&&(!to||new Date(r.end)<=new Date(to))&&(!rw||r.rewardType===rw)&&(!st||r.status===st)&&(!q||t.indexOf(q)>=0)})}
function cmsEventBenefitSearch(){cmsEventBenefitState.page=1;cmsEventBenefitRender()}
function cmsEventBenefitStatusClass(s){return s==='Hiệu lực'?'texp-status-active':s==='Chờ áp dụng'?'texp-status-waiting':s==='Hết hiệu lực'?'texp-status-expired':'texp-status-paused'}
function cmsEventBenefitRewardText(r){return r.rewardType==='Voucher'?r.rewardValue+' x '+(r.rewardQuantity||1):(Number(r.rewardValue)||0).toLocaleString('vi-VN')+' '+r.rewardType}
function cmsEventBenefitDisplayText(r){var a=[];if(r.homeVisible!==false)a.push('Trang chủ: '+(r.homeOrder||1));if(r.serviceVisible)a.push('Dịch vụ: '+(r.serviceOrder||1));if(r.shopVisible)a.push('Cửa hàng: '+(r.shopOrder||1));return a.length?a.join(' · '):'Ẩn'}
function cmsEventBenefitRender(){var body=document.getElementById('eventBenefitTableBody');if(!body)return;var rows=cmsEventBenefitFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsEventBenefitState.size));if(cmsEventBenefitState.page>pages)cmsEventBenefitState.page=pages;var off=(cmsEventBenefitState.page-1)*cmsEventBenefitState.size,part=rows.slice(off,off+cmsEventBenefitState.size);body.innerHTML=part.map(function(x,i){var r=x.row,a='<button class="icon-square orange" type="button" title="Cập nhật" onclick="cmsEventBenefitOpenForm('+x.index+')"><i class="fa fa-edit"></i></button> ';if(r.status!=='Tạm dừng'&&r.status!=='Hết hiệu lực')a+='<button class="icon-square red" type="button" title="Tạm dừng" onclick="cmsEventBenefitPause('+x.index+')"><i class="fa fa-ban"></i></button> ';a+='<button class="icon-square red" type="button" title="Xóa" onclick="cmsEventBenefitDelete('+x.index+')"><i class="fa fa-trash"></i></button>';return '<tr><td>'+(off+i+1)+'</td><td>'+r.code+'</td><td>'+r.name+'</td><td>'+(r.rewardName||'')+'</td><td>'+(r.imageName||'Chưa tải')+'</td><td>'+r.rewardType+'</td><td>'+cmsEventBenefitRewardText(r)+'</td><td>'+r.receiveLimit+' / '+r.receivePeriod+'</td><td>'+r.otherLimitValue+' / '+r.otherLimitType+'</td><td>'+cmsAexpFormatDate(r.start)+'</td><td>'+cmsAexpFormatDate(r.end)+'</td><td>'+cmsEventBenefitDisplayText(r)+'</td><td><span class="texp-table-status '+cmsEventBenefitStatusClass(r.status)+'">'+r.status+'</span></td><td class="action-cell">'+a+'</td></tr>'}).join('')||'<tr><td colspan="14" style="text-align:center">Không có dữ liệu</td></tr>';document.getElementById('eventBenefitPageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsEventBenefitState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';var p=document.getElementById('eventBenefitPager');p.innerHTML='<button '+(cmsEventBenefitState.page===1?'disabled':'')+' onclick="cmsEventBenefitPage('+(cmsEventBenefitState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsEventBenefitState.page?'active':'')+'" onclick="cmsEventBenefitPage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsEventBenefitState.page===pages?'disabled':'')+' onclick="cmsEventBenefitPage('+(cmsEventBenefitState.page+1)+')">Tiếp</button>';cmsEventBenefitApplyColumns()}
function cmsEventBenefitPage(p){cmsEventBenefitState.page=p;cmsEventBenefitRender()}
function cmsEventBenefitOpenForm(index){cmsEventBenefitState.editIndex=typeof index==='number'?index:null;showScreen('loyalty-event-benefit-form');cmsEventBenefitResetForm(false);var edit=cmsEventBenefitState.editIndex!==null,r=edit?cmsEventBenefitRows[cmsEventBenefitState.editIndex]:null;document.getElementById('eventBenefitFormTitle').textContent=edit?'Cập nhật thiết lập':'Thêm mới thiết lập';if(r){eventBenefitEvent.value=r.code;eventBenefitCondition.value=r.condition;eventBenefitTransactionType.value=r.transactionType||'Nạp Point';eventBenefitTransactionValue.value=r.transactionValue||'';eventBenefitRewardType.value=r.rewardType;cmsEventBenefitRewardChanged();eventBenefitRewardValue.value=r.rewardValue;eventBenefitVoucherQuantity.value=r.rewardQuantity||1;eventBenefitReceivePeriod.value=r.receivePeriod;eventBenefitReceiveLimit.value=r.receiveLimit;eventBenefitOtherLimitType.value=r.otherLimitType;eventBenefitOtherLimitValue.value=r.otherLimitValue;eventBenefitStart.value=r.start;eventBenefitEnd.value=r.end;eventBenefitRewardName.value=r.rewardName||'';eventBenefitHomeVisible.value=r.homeVisible===false?'hide':'show';eventBenefitHomeOrder.value=r.homeOrder||1;eventBenefitServiceVisible.value=r.serviceVisible?'show':'hide';eventBenefitServiceOrder.value=r.serviceOrder||1;eventBenefitShopVisible.value=r.shopVisible?'show':'hide';eventBenefitShopOrder.value=r.shopOrder||1;var preview=document.getElementById('eventBenefitImagePreview');if(preview)preview.innerHTML=r.imageName?'<span>'+r.imageName+'</span>':'<span>Chưa có ảnh</span>'}cmsEventBenefitToggleAllDisplayOrders();cmsEventBenefitToggleTransaction();cmsEventBenefitRewardChanged()}
function cmsEventBenefitToggleTransaction(){var row=document.getElementById('eventBenefitTransactionRow'),show=(document.getElementById('eventBenefitCondition')||{}).value==='Phát sinh giao dịch';if(row)row.classList.toggle('hidden',!show)}
function cmsEventBenefitRewardChanged(){var t=(document.getElementById('eventBenefitRewardType')||{}).value||'Voucher',row=document.getElementById('eventBenefitRewardValueRow'),v=document.getElementById('eventBenefitRewardValue'),qRow=document.getElementById('eventBenefitVoucherQuantityRow');if(!v)return;var replacement;if(t==='Voucher'){replacement=document.createElement('select');replacement.innerHTML=cmsRankBenefitVouchers.map(function(x){return '<option>'+x+'</option>'}).join('');if(row)row.querySelector('.form-label-text').innerHTML='Voucher <span class="required">*</span>';if(qRow)qRow.classList.remove('hidden')}else{replacement=document.createElement('input');replacement.type='number';replacement.min='1';replacement.placeholder='Nhập giá trị '+t;if(row)row.querySelector('.form-label-text').innerHTML='Giá trị thưởng <span class="required">*</span>';if(qRow)qRow.classList.add('hidden')}replacement.id='eventBenefitRewardValue';replacement.value=v.value||'';v.replaceWith(replacement)}
function cmsEventBenefitResetForm(clearMode){['eventBenefitTransactionValue','eventBenefitRewardValue','eventBenefitVoucherQuantity','eventBenefitReceiveLimit','eventBenefitOtherLimitValue','eventBenefitStart','eventBenefitEnd','eventBenefitRewardName'].forEach(function(id){var e=document.getElementById(id);if(e)e.value=''});['eventBenefitEvent','eventBenefitCondition','eventBenefitTransactionType','eventBenefitRewardType','eventBenefitReceivePeriod','eventBenefitOtherLimitType','eventBenefitHomeVisible','eventBenefitServiceVisible','eventBenefitShopVisible'].forEach(function(id){var e=document.getElementById(id);if(e)e.selectedIndex=0});['Home','Service','Shop'].forEach(function(k){var o=document.getElementById('eventBenefit'+k+'Order');if(o)o.value='1'});var img=document.getElementById('eventBenefitImage');if(img)img.value='';var preview=document.getElementById('eventBenefitImagePreview');if(preview)preview.innerHTML='<span>Chưa có ảnh</span>';document.querySelectorAll('#screen-loyalty-event-benefit-form .field-error').forEach(function(e){e.textContent=''});cmsSetAlert('eventBenefitFormAlert','','');cmsEventBenefitToggleAllDisplayOrders();cmsEventBenefitToggleTransaction();cmsEventBenefitRewardChanged();if(clearMode!==false)cmsEventBenefitState.editIndex=null}
function cmsEventBenefitSave(){var required=['eventBenefitEvent','eventBenefitRewardName','eventBenefitCondition','eventBenefitRewardType','eventBenefitRewardValue','eventBenefitReceiveLimit','eventBenefitOtherLimitValue','eventBenefitStart','eventBenefitEnd'],ok=true;required.forEach(function(id){var e=document.getElementById(id),er=document.getElementById('err-'+id),bad=!e||!String(e.value).trim();if(er)er.textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});var isTx=eventBenefitCondition.value==='Phát sinh giao dịch';var isVoucher=eventBenefitRewardType.value==='Voucher';if(isVoucher&&!String(eventBenefitVoucherQuantity.value).trim()){document.getElementById('err-eventBenefitVoucherQuantity').textContent='Trường bắt buộc.';ok=false}else document.getElementById('err-eventBenefitVoucherQuantity').textContent='';if(isVoucher&&Number(eventBenefitVoucherQuantity.value)<1){document.getElementById('err-eventBenefitVoucherQuantity').textContent='Số lượng phải lớn hơn 0.';ok=false}if(isTx&&!String(eventBenefitTransactionValue.value).trim()){document.getElementById('err-eventBenefitTransactionValue').textContent='Trường bắt buộc.';ok=false}else document.getElementById('err-eventBenefitTransactionValue').textContent='';if(eventBenefitStart.value&&eventBenefitEnd.value&&new Date(eventBenefitEnd.value)<=new Date(eventBenefitStart.value)){document.getElementById('err-eventBenefitEnd').textContent='Ngày kết thúc phải sau ngày áp dụng.';ok=false}var display={};['Home','Service','Shop'].forEach(function(k){var vis=document.getElementById('eventBenefit'+k+'Visible').value!=='hide',val=Number(document.getElementById('eventBenefit'+k+'Order').value),er=document.getElementById('err-eventBenefit'+k+'Order');display[k]={visible:vis,order:val};if(vis&&(!val||val<1)){if(er)er.textContent='Nhập vị trí lớn hơn 0.';ok=false}else if(er)er.textContent=''});if(!ok)return;var ev=cmsEventBenefitEvents.find(function(x){return x.code===eventBenefitEvent.value}),old=cmsEventBenefitState.editIndex!==null?cmsEventBenefitRows[cmsEventBenefitState.editIndex]:null,row={code:ev.code,name:ev.name,condition:eventBenefitCondition.value,transactionType:isTx?eventBenefitTransactionType.value:'',transactionValue:isTx?eventBenefitTransactionValue.value:'',rewardType:eventBenefitRewardType.value,rewardValue:eventBenefitRewardValue.value,rewardQuantity:isVoucher?+eventBenefitVoucherQuantity.value:0,receivePeriod:eventBenefitReceivePeriod.value,receiveLimit:+eventBenefitReceiveLimit.value,otherLimitType:eventBenefitOtherLimitType.value,otherLimitValue:+eventBenefitOtherLimitValue.value,start:eventBenefitStart.value,end:eventBenefitEnd.value,rewardName:eventBenefitRewardName.value.trim(),imageName:(eventBenefitImage.files&&eventBenefitImage.files[0]?eventBenefitImage.files[0].name:(old&&old.imageName?old.imageName:'')),homeVisible:display.Home.visible,homeOrder:display.Home.visible?display.Home.order:(old&&old.homeOrder?old.homeOrder:1),serviceVisible:display.Service.visible,serviceOrder:display.Service.visible?display.Service.order:(old&&old.serviceOrder?old.serviceOrder:1),shopVisible:display.Shop.visible,shopOrder:display.Shop.visible?display.Shop.order:(old&&old.shopOrder?old.shopOrder:1),status:old?old.status:(new Date(eventBenefitStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực')};if(old)cmsEventBenefitRows[cmsEventBenefitState.editIndex]=row;else cmsEventBenefitRows.push(row);cmsSetAlert('eventBenefitFormAlert','success','Đã lưu thiết lập phần thưởng nhiệm vụ.');cmsEventBenefitRender()}
function cmsEventBenefitPause(i){cmsAccConfirm('Tạm dừng thiết lập','Bạn xác nhận tạm dừng thiết lập phần thưởng nhiệm vụ này?',function(){cmsEventBenefitRows[i].status='Tạm dừng';cmsEventBenefitRender()})}
function cmsEventBenefitDelete(i){cmsAccConfirm('Xóa thiết lập','Bạn xác nhận xóa thiết lập phần thưởng nhiệm vụ này?',function(){cmsEventBenefitRows.splice(i,1);cmsEventBenefitRender()})}
function cmsEventBenefitApplyColumns(){var table=document.getElementById('eventBenefitTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(c,i){c.style.display=cmsEventBenefitState.hiddenColumns.has(i)?'none':''})})}
function cmsEventBenefitToggleColumns(btn){var old=document.getElementById('eventBenefitColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='eventBenefitColumnPicker';panel.className='column-picker show';document.querySelectorAll('#eventBenefitTable thead th').forEach(function(th,i){if(i===11)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsEventBenefitState.hiddenColumns.has(i);c.onchange=function(){if(c.checked)cmsEventBenefitState.hiddenColumns.delete(i);else cmsEventBenefitState.hiddenColumns.add(i);cmsEventBenefitApplyColumns()};l.append(c,document.createTextNode(th.textContent.trim()));panel.append(l)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsEventBenefitInit);

/* Loyalty member-rank benefit */
var cmsRankBenefitVouchers=['Voucher giảm 5%','Voucher giảm 10%','Voucher 50.000 VNĐ','Voucher miễn phí vận chuyển'];
var cmsRankBenefitRows=[
 {rank:'Bạc',rewards:[{type:'Voucher',value:'Voucher giảm 5%',quantity:1},{type:'Point',value:'20000'}],policy:'Mỗi lần đạt hạng',start:'2026-07-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực'},
 {rank:'Vàng',rewards:[{type:'EXP',value:'500'},{type:'Voucher',value:'Voucher giảm 10%',quantity:1}],policy:'Chỉ lần đầu',start:'2026-08-01T00:00',end:'2027-01-31T23:59',status:'Chờ áp dụng'},
 {rank:'Bạch Kim',rewards:[{type:'Point',value:'50000'}],policy:'Mỗi lần đạt hạng',start:'2026-01-01T00:00',end:'2026-06-30T23:59',status:'Hết hiệu lực'}
];
var cmsRankBenefitState={page:1,size:10,hiddenColumns:new Set(),editIndex:null};
function cmsRankBenefitInit(){if(!document.getElementById('rankBenefitTableBody'))return;cmsRankBenefitRender()}
function cmsRankBenefitFiltered(){var f=(document.getElementById('rankBenefitFromFilter')||{}).value||'',t=(document.getElementById('rankBenefitToFilter')||{}).value||'',rw=(document.getElementById('rankBenefitRewardFilter')||{}).value||'',q=((document.getElementById('rankBenefitQuickSearch')||{}).value||'').toLowerCase();return cmsRankBenefitRows.map(function(r,i){return{row:r,index:i}}).filter(function(x){var r=x.row,text=[r.rank,r.policy,r.status].concat(r.rewards.map(function(a){return a.type+' '+a.value})).join(' ').toLowerCase();return(!f||new Date(r.start)>=new Date(f))&&(!t||new Date(r.end)<=new Date(t))&&(!rw||r.rewards.some(function(a){return a.type===rw}))&&(!q||text.indexOf(q)>=0)})}
function cmsRankBenefitSearch(){cmsRankBenefitState.page=1;cmsRankBenefitRender()}
function cmsRankBenefitValueText(a){return a.type==='Voucher'?a.value+' x '+(a.quantity||1):(Number(a.value)||0).toLocaleString('vi-VN')+' '+a.type}
function cmsRankBenefitRender(){var body=document.getElementById('rankBenefitTableBody');if(!body)return;var rows=cmsRankBenefitFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsRankBenefitState.size));if(cmsRankBenefitState.page>pages)cmsRankBenefitState.page=pages;var off=(cmsRankBenefitState.page-1)*cmsRankBenefitState.size,part=rows.slice(off,off+cmsRankBenefitState.size),html='';part.forEach(function(x,i){var r=x.row,n=Math.max(1,r.rewards.length),actions='<button class="icon-square orange" type="button" title="Cập nhật" onclick="cmsRankBenefitOpenForm('+x.index+')"><i class="fa fa-edit"></i></button> ';if(r.status!=='Tạm dừng'&&r.status!=='Hết hiệu lực')actions+='<button class="icon-square red" type="button" title="Tạm dừng" onclick="cmsRankBenefitPause('+x.index+')"><i class="fa fa-ban"></i></button> ';actions+='<button class="icon-square red" type="button" title="Xóa" onclick="cmsRankBenefitDelete('+x.index+')"><i class="fa fa-trash"></i></button>';r.rewards.forEach(function(a,j){html+='<tr>';if(j===0){html+='<td rowspan="'+n+'">'+(off+i+1)+'</td><td rowspan="'+n+'">'+r.rank+'</td>'}html+='<td>'+a.type+'</td><td>'+cmsRankBenefitValueText(a)+'</td>';if(j===0)html+='<td rowspan="'+n+'">'+r.policy+'</td><td rowspan="'+n+'">'+cmsAexpFormatDate(r.start)+'</td><td rowspan="'+n+'">'+cmsAexpFormatDate(r.end)+'</td><td rowspan="'+n+'"><span class="texp-table-status '+cmsEventBenefitStatusClass(r.status)+'">'+r.status+'</span></td><td rowspan="'+n+'" class="action-cell">'+actions+'</td>';html+='</tr>'})});body.innerHTML=html||'<tr><td colspan="10" style="text-align:center">Không có dữ liệu</td></tr>';document.getElementById('rankBenefitPageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsRankBenefitState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';document.getElementById('rankBenefitPager').innerHTML='<button '+(cmsRankBenefitState.page===1?'disabled':'')+' onclick="cmsRankBenefitPage('+(cmsRankBenefitState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsRankBenefitState.page?'active':'')+'" onclick="cmsRankBenefitPage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsRankBenefitState.page===pages?'disabled':'')+' onclick="cmsRankBenefitPage('+(cmsRankBenefitState.page+1)+')">Tiếp</button>';cmsRankBenefitApplyColumns()}
function cmsRankBenefitPage(p){cmsRankBenefitState.page=p;cmsRankBenefitRender()}
function cmsRankBenefitRewardHtml(a){a=a||{type:'Voucher',value:'',quantity:1};var options='<option>Voucher</option><option>Point</option><option>EXP</option>';var value=a.type==='Voucher'?'<select class="rank-benefit-reward-value">'+cmsRankBenefitVouchers.map(function(v){return '<option'+(v===a.value?' selected':'')+'>'+v+'</option>'}).join('')+'</select><input class="rank-benefit-reward-quantity" min="1" type="number" placeholder="Số lượng" value="'+(a.quantity||1)+'"/>':'<input class="rank-benefit-reward-value" min="1" type="number" placeholder="Nhập giá trị '+a.type+'" value="'+(a.value||'')+'"/><input class="rank-benefit-reward-quantity hidden" min="1" type="number" placeholder="Số lượng"/>';return '<div class="rank-benefit-reward-item"><select class="rank-benefit-reward-type" onchange="cmsRankBenefitRewardTypeChanged(this)">'+options.replace('>'+a.type+'<',' selected>'+a.type+'<')+'</select>'+value+'<button class="icon-square red" type="button" title="Xóa loại thưởng" onclick="cmsRankBenefitRemoveReward(this)"><i class="fa fa-trash"></i></button></div>'}
function cmsRankBenefitAddReward(a){var list=document.getElementById('rankBenefitRewardList');if(list)list.insertAdjacentHTML('beforeend',cmsRankBenefitRewardHtml(a))}
function cmsRankBenefitRemoveReward(btn){var list=document.getElementById('rankBenefitRewardList');if(list&&list.children.length>1)btn.closest('.rank-benefit-reward-item').remove()}
function cmsRankBenefitRewardTypeChanged(sel){var item=sel.closest('.rank-benefit-reward-item'),old=item.querySelector('.rank-benefit-reward-value'),qty=item.querySelector('.rank-benefit-reward-quantity'),type=sel.value,repl;if(type==='Voucher'){repl=document.createElement('select');repl.className='rank-benefit-reward-value';repl.innerHTML=cmsRankBenefitVouchers.map(function(v){return '<option>'+v+'</option>'}).join('');qty.classList.remove('hidden');qty.value=qty.value||1}else{repl=document.createElement('input');repl.className='rank-benefit-reward-value';repl.type='number';repl.min='1';repl.placeholder='Nhập giá trị '+type;qty.classList.add('hidden');qty.value=''}old.replaceWith(repl)}
function cmsRankBenefitOpenForm(index){cmsRankBenefitState.editIndex=typeof index==='number'?index:null;showScreen('loyalty-rank-benefit-form');cmsRankBenefitResetForm(false);var edit=cmsRankBenefitState.editIndex!==null,r=edit?cmsRankBenefitRows[cmsRankBenefitState.editIndex]:null;document.getElementById('rankBenefitFormTitle').textContent=edit?'Cập nhật thiết lập':'Thêm mới thiết lập';if(r){rankBenefitRank.value=r.rank;rankBenefitPolicy.value=r.policy;rankBenefitStart.value=r.start;rankBenefitEnd.value=r.end;document.getElementById('rankBenefitRewardList').innerHTML='';r.rewards.forEach(cmsRankBenefitAddReward)}}
function cmsRankBenefitResetForm(clearMode){var list=document.getElementById('rankBenefitRewardList');if(!list)return;rankBenefitRank.selectedIndex=0;rankBenefitPolicy.selectedIndex=0;rankBenefitStart.value='';rankBenefitEnd.value='';list.innerHTML='';cmsRankBenefitAddReward();document.querySelectorAll('#screen-loyalty-rank-benefit-form .field-error').forEach(function(e){e.textContent=''});cmsSetAlert('rankBenefitFormAlert','','');if(clearMode!==false)cmsRankBenefitState.editIndex=null}
function cmsRankBenefitSave(){var rewards=[],ok=true;document.querySelectorAll('#rankBenefitRewardList .rank-benefit-reward-item').forEach(function(item){var type=item.querySelector('.rank-benefit-reward-type').value,value=item.querySelector('.rank-benefit-reward-value').value,quantity=type==='Voucher'?item.querySelector('.rank-benefit-reward-quantity').value:'';if(!String(value).trim()||(type==='Voucher'&&(!String(quantity).trim()||Number(quantity)<1)))ok=false;rewards.push({type:type,value:value,quantity:type==='Voucher'?+quantity:0})});document.getElementById('err-rankBenefitRewards').textContent=ok?'':'Nhập đầy đủ giá trị thưởng.';['rankBenefitRank','rankBenefitPolicy','rankBenefitStart','rankBenefitEnd'].forEach(function(id){var e=document.getElementById(id),bad=!String(e.value).trim();document.getElementById('err-'+id).textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});if(rankBenefitStart.value&&rankBenefitEnd.value&&new Date(rankBenefitEnd.value)<=new Date(rankBenefitStart.value)){document.getElementById('err-rankBenefitEnd').textContent='Ngày kết thúc phải sau ngày áp dụng.';ok=false}if(!ok)return;var old=cmsRankBenefitState.editIndex!==null?cmsRankBenefitRows[cmsRankBenefitState.editIndex]:null,row={rank:rankBenefitRank.value,rewards:rewards,policy:rankBenefitPolicy.value,start:rankBenefitStart.value,end:rankBenefitEnd.value,status:old?old.status:(new Date(rankBenefitStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực')};if(old)cmsRankBenefitRows[cmsRankBenefitState.editIndex]=row;else cmsRankBenefitRows.push(row);cmsSetAlert('rankBenefitFormAlert','success','Đã lưu thiết lập ưu đãi hạng thành viên.');cmsRankBenefitRender()}
function cmsRankBenefitPause(i){cmsAccConfirm('Tạm dừng thiết lập','Bạn xác nhận tạm dừng thiết lập ưu đãi hạng thành viên này?',function(){cmsRankBenefitRows[i].status='Tạm dừng';cmsRankBenefitRender()})}
function cmsRankBenefitDelete(i){cmsAccConfirm('Xóa thiết lập','Bạn xác nhận xóa thiết lập ưu đãi hạng thành viên này?',function(){cmsRankBenefitRows.splice(i,1);cmsRankBenefitRender()})}
function cmsRankBenefitApplyColumns(){var table=document.getElementById('rankBenefitTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(c,i){c.style.display=cmsRankBenefitState.hiddenColumns.has(i)?'none':''})})}
function cmsRankBenefitToggleColumns(btn){var old=document.getElementById('rankBenefitColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='rankBenefitColumnPicker';panel.className='column-picker show';document.querySelectorAll('#rankBenefitTable thead th').forEach(function(th,i){if(i===9)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsRankBenefitState.hiddenColumns.has(i);c.onchange=function(){if(c.checked)cmsRankBenefitState.hiddenColumns.delete(i);else cmsRankBenefitState.hiddenColumns.add(i);cmsRankBenefitApplyColumns()};l.append(c,document.createTextNode(th.textContent.trim()));panel.append(l)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsRankBenefitInit);

/* Loyalty > Thiết lập Voucher */
var cmsVoucherObjects=['Tất cả','Hệ thống','Tài khoản'];
var cmsVoucherRows=[
 {object:'Hệ thống',unit:'Tổng công ty VTC',product:'Dịch Vụ Scoin',name:'Giảm 10% nạp Point',prefix:'POINT10',description:'Giảm 10% cho giao dịch nạp Point đủ điều kiện.',image:'',transaction:'Nạp Point',payment:'Ví điện tử VTC Pay',discountType:'Theo tỉ lệ',discountValue:10,maxDiscount:50000,minTransaction:100000,validityType:'Theo thiết lập voucher',receiveMode:'',validityDays:'',dailyLimit:1,totalLimit:5000,start:'2026-07-01T00:00',end:'2026-12-31T23:59',status:'Hiệu lực'},
 {object:'Tài khoản',unit:'VTC Intecom',product:'Au Mobile',name:'Ưu đãi thành viên mới',prefix:'NEW20K',description:'Ưu đãi dành cho thành viên mới.',image:'',transaction:'Thanh toán/Mua hàng',payment:'Số dư MyVTC',discountType:'Theo số tiền',discountValue:20000,maxDiscount:0,minTransaction:50000,validityType:'Kể từ ngày nhận',receiveMode:'Trong vòng',validityDays:30,dailyLimit:1,totalLimit:10000,start:'2026-08-01T00:00',end:'2027-01-31T23:59',status:'Chờ áp dụng'},
 {object:'Hệ thống',unit:'VTC Mobile',product:'Truy Kích',name:'Voucher khách hàng thân thiết',prefix:'LOYAL50',description:'Voucher dành cho khách hàng thân thiết.',image:'',transaction:'Tất cả',payment:'Tất cả',discountType:'Theo số tiền',discountValue:50000,maxDiscount:0,minTransaction:200000,validityType:'Kể từ ngày nhận',receiveMode:'Trọn đời',validityDays:'',dailyLimit:2,totalLimit:3000,start:'2026-01-01T00:00',end:'2026-06-30T23:59',status:'Hết hiệu lực'},
 {object:'Tài khoản',unit:'VTC Digital',product:'Trang chủ VTC.VN',name:'Giảm phí thanh toán',prefix:'PAY5',description:'Giảm phí khi thanh toán dịch vụ.',image:'',transaction:'Thanh toán/Mua hàng',payment:'VCB, TCB',discountType:'Theo tỉ lệ',discountValue:5,maxDiscount:30000,minTransaction:100000,validityType:'Theo thiết lập voucher',receiveMode:'',validityDays:'',dailyLimit:3,totalLimit:8000,start:'2026-06-01T00:00',end:'2026-12-31T23:59',status:'Tạm dừng'}
];
var cmsVoucherState={page:1,size:10,hiddenColumns:new Set(),editIndex:null,imageData:''};
function cmsVoucherInit(){
 var root=document.getElementById('voucherObjectFilter');if(!root)return;
 root.innerHTML=cmsAccMultiFilter('Đối tượng','voucherObjectFilterValue',cmsVoucherObjects);
 document.getElementById('voucherUnitFilter').innerHTML=cmsAccMultiFilter('Đơn vị','voucherUnitFilterValue',cmsTexpUnits);
 document.getElementById('voucherProductFilter').innerHTML=cmsAccMultiFilter('Sản phẩm','voucherProductFilterValue',['Tất cả'].concat(cmsAccProducts));
 var voucherNames=Array.from(new Set(cmsVoucherRows.map(function(r){return r.name}))).sort();
 var voucherPrefixes=Array.from(new Set(cmsVoucherRows.map(function(r){return r.prefix}))).sort();
 var voucherTransactions=Array.from(new Set(cmsVoucherRows.map(function(r){return r.transaction}))).sort();
 var voucherPayments=Array.from(new Set(cmsVoucherRows.map(function(r){return r.payment}))).sort();
 document.getElementById('voucherNameOptions').innerHTML=voucherNames.map(function(v){return '<option value="'+v.replace(/"/g,'&quot;')+'"></option>'}).join('');
 document.getElementById('voucherPrefixOptions').innerHTML=voucherPrefixes.map(function(v){return '<option value="'+v.replace(/"/g,'&quot;')+'"></option>'}).join('');
 document.getElementById('voucherTransactionFilter').innerHTML='<option value="">Tất cả</option>'+voucherTransactions.map(function(v){return '<option>'+v+'</option>'}).join('');
 document.getElementById('voucherPaymentFilter').innerHTML='<option value="">Tất cả</option>'+voucherPayments.map(function(v){return '<option>'+v+'</option>'}).join('');
 document.getElementById('voucherObjectControl').innerHTML=cmsAccMultiFilter('','voucherObjectForm',cmsVoucherObjects);
 document.getElementById('voucherUnitControl').innerHTML=cmsAccMultiFilter('','voucherUnitForm',cmsTexpUnits);
 document.getElementById('voucherProductControl').innerHTML=cmsAccMultiFilter('','voucherProductForm',['Tất cả'].concat(cmsAccProducts));
 document.getElementById('voucherTransactionControl').innerHTML=cmsAccMultiFilter('','voucherTransactionForm',cmsTexpTransactions);
 document.getElementById('voucherPaymentControl').innerHTML=cmsTexpPaymentMultiFilter('','voucherPaymentForm');
 cmsVoucherRender();cmsVoucherDiscountChanged();cmsVoucherValidityChanged();
}
function cmsVoucherFiltered(){
 var objects=cmsTexpSelected('voucherObjectFilterValue'),units=cmsTexpSelected('voucherUnitFilterValue'),products=cmsTexpSelected('voucherProductFilterValue');
 var name=((document.getElementById('voucherNameFilter')||{}).value||'').trim().toLowerCase();
 var prefix=((document.getElementById('voucherPrefixFilter')||{}).value||'').trim().toLowerCase();
 var transaction=(document.getElementById('voucherTransactionFilter')||{}).value||'';
 var payment=(document.getElementById('voucherPaymentFilter')||{}).value||'';
 var status=(document.getElementById('voucherStatusFilter')||{}).value||'',q=((document.getElementById('voucherQuickSearch')||{}).value||'').toLowerCase();
 return cmsVoucherRows.map(function(r,i){return{row:r,index:i}}).filter(function(x){var r=x.row,text=Object.keys(r).map(function(k){return r[k]}).join(' ').toLowerCase();return(!objects||objects.indexOf(r.object)>=0)&&(!units||units.indexOf(r.unit)>=0)&&(!products||products.indexOf(r.product)>=0)&&(!name||String(r.name).toLowerCase().indexOf(name)>=0)&&(!prefix||String(r.prefix).toLowerCase().indexOf(prefix)>=0)&&(!transaction||r.transaction===transaction)&&(!payment||r.payment===payment)&&(!status||r.status===status)&&(!q||text.indexOf(q)>=0)});
}
function cmsVoucherSearch(){cmsVoucherState.page=1;cmsVoucherRender()}
function cmsVoucherDate(v){return v?String(v).replace('T',' ').slice(0,16):'-'}
function cmsVoucherDiscountText(r){return r.discountType==='Theo tỉ lệ'?(Number(r.discountValue)||0)+'%'+(r.maxDiscount?' / tối đa '+Number(r.maxDiscount).toLocaleString('vi-VN')+' VNĐ':''):Number(r.discountValue||0).toLocaleString('vi-VN')+' VNĐ'}
function cmsVoucherValidityText(r){if(r.validityType==='Theo thiết lập voucher')return 'Theo thiết lập voucher';return r.receiveMode==='Trọn đời'?'Kể từ ngày nhận, Trọn đời':'Kể từ ngày nhận, '+r.validityDays+' ngày'}
function cmsVoucherRender(){
 var body=document.getElementById('voucherSettingTableBody');if(!body)return;var rows=cmsVoucherFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsVoucherState.size));if(cmsVoucherState.page>pages)cmsVoucherState.page=pages;var off=(cmsVoucherState.page-1)*cmsVoucherState.size,part=rows.slice(off,off+cmsVoucherState.size);
 body.innerHTML=part.map(function(x,i){var r=x.row,actions='<div class="voucher-action-buttons"><button class="icon-square blue" title="Xem chi tiết" onclick="cmsVoucherView('+x.index+')"><i class="fa fa-eye"></i></button><button class="icon-square orange" title="Cập nhật" onclick="cmsVoucherOpenForm('+x.index+')"><i class="fa fa-edit"></i></button>';if(r.status!=='Tạm dừng'&&r.status!=='Hết hiệu lực')actions+='<button class="icon-square red" title="Tạm dừng" onclick="cmsVoucherPause('+x.index+')"><i class="fa fa-ban"></i></button>';actions+='<button class="icon-square red" title="Xóa" onclick="cmsVoucherDelete('+x.index+')"><i class="fa fa-trash"></i></button></div>';return '<tr><td>'+(off+i+1)+'</td><td>'+cmsSafeText(r.name)+'</td><td>'+cmsSafeText(r.prefix)+'</td><td>'+cmsSafeText(r.transaction)+'</td><td>'+cmsSafeText(r.payment)+'</td><td>'+cmsSafeText(r.discountType)+'</td><td>'+cmsVoucherDiscountText(r)+'</td><td>'+cmsVoucherValidityText(r)+'</td><td>'+cmsVoucherDate(r.start)+'</td><td>'+cmsVoucherDate(r.end)+'</td><td><span class="texp-table-status '+cmsTexpStatusClass(r.status)+'">'+r.status+'</span></td><td class="action-cell">'+actions+'</td></tr>'}).join('')||'<tr><td colspan="14" style="text-align:center">Không có dữ liệu</td></tr>';
 document.getElementById('voucherPageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsVoucherState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';document.getElementById('voucherPager').innerHTML='<button '+(cmsVoucherState.page===1?'disabled':'')+' onclick="cmsVoucherPage('+(cmsVoucherState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsVoucherState.page?'active':'')+'" onclick="cmsVoucherPage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsVoucherState.page===pages?'disabled':'')+' onclick="cmsVoucherPage('+(cmsVoucherState.page+1)+')">Tiếp</button>';cmsVoucherApplyColumns();
}
function cmsVoucherPage(p){if(p>0){cmsVoucherState.page=p;cmsVoucherRender()}}
function cmsVoucherView(i){var r=cmsVoucherRows[i],modal=document.getElementById('voucherDetailModal'),content=document.getElementById('voucherDetailContent');if(!r||!modal||!content)return;var imageValue=r.image?'<img src="'+r.image+'" alt="Ảnh đại diện Voucher"/>':'<span class="voucher-detail-empty-image"><i class="fa fa-image"></i> Chưa có ảnh</span>';var general=[['Tên voucher',r.name],['Prefix code',r.prefix],['Ảnh',imageValue,'image'],['Mô tả',r.description||'-','wide'],['Đối tượng',r.object],['Đơn vị',r.unit],['Sản phẩm',r.product],['Loại giao dịch',r.transaction],['Hình thức thanh toán',r.payment,'wide']];var detail=[['Loại giảm giá',r.discountType],['Giá trị giảm',r.discountType==='Theo tỉ lệ'?(Number(r.discountValue)||0)+'%':Number(r.discountValue||0).toLocaleString('vi-VN')+' VNĐ'],['Giá trị tối đa',r.maxDiscount?Number(r.maxDiscount).toLocaleString('vi-VN')+' VNĐ':'-'],['Giá trị giao dịch tối thiểu',Number(r.minTransaction||0).toLocaleString('vi-VN')+' VNĐ'],['Thời hạn sử dụng',cmsVoucherValidityText(r),'wide'],['Thời gian áp dụng',cmsVoucherDate(r.start)],['Thời gian kết thúc',cmsVoucherDate(r.end)],['Trạng thái',r.status,'status']];function section(title,items){return '<section class="voucher-detail-section"><h4>'+title+'</h4><div class="voucher-detail-grid">'+items.map(function(item){var cls='voucher-detail-item'+(item[2]==='wide'?' voucher-detail-wide':'')+(item[2]==='image'?' voucher-detail-image-item':'')+(item[2]==='status'?' voucher-detail-status-item':'');var value=item[2]==='image'?item[1]:cmsSafeText(item[1]||'-');if(item[2]==='status')value='<span class="texp-table-status '+cmsTexpStatusClass(r.status)+'">'+cmsSafeText(r.status)+'</span>';return '<div class="'+cls+'"><span>'+cmsSafeText(item[0])+'</span><strong>'+value+'</strong></div>'}).join('')+'</div></section>'}content.innerHTML=section('1. Thông tin chung',general)+section('2. Thông tin chi tiết',detail);modal.classList.add('show')}
function cmsVoucherCloseDetail(){var modal=document.getElementById('voucherDetailModal');if(modal)modal.classList.remove('show')}
function cmsVoucherDiscountChanged(){var type=(document.getElementById('voucherDiscountType')||{}).value||'Theo số tiền';var row=document.getElementById('voucherMaxDiscountRow'),unit=document.getElementById('voucherDiscountUnit');if(row)row.classList.toggle('hidden',type!=='Theo tỉ lệ');if(unit)unit.textContent=type==='Theo tỉ lệ'?'%':'VNĐ'}
function cmsVoucherValidityChanged(){var type=(document.getElementById('voucherValidityType')||{}).value||'Theo thiết lập voucher';var row=document.getElementById('voucherReceiveValidityRow');if(row)row.classList.toggle('hidden',type!=='Kể từ ngày nhận');cmsVoucherReceiveModeChanged()}
function cmsVoucherReceiveModeChanged(){var checked=document.querySelector('input[name="voucherReceiveMode"]:checked'),days=document.getElementById('voucherDaysField');if(days)days.classList.toggle('hidden',!checked||checked.value!=='Trong vòng')}
function cmsVoucherPreviewImage(input){var preview=document.getElementById('voucherImagePreview');if(!preview)return;var file=input&&input.files&&input.files[0];if(!file){cmsVoucherState.imageData='';preview.innerHTML='<i class="fa fa-image"></i><span>Chưa chọn ảnh</span>';return}if(!file.type.match(/^image\//)){input.value='';cmsVoucherState.imageData='';preview.innerHTML='<i class="fa fa-image"></i><span>Định dạng không hợp lệ</span>';return}var reader=new FileReader();reader.onload=function(e){cmsVoucherState.imageData=e.target.result;preview.innerHTML='<img src="'+e.target.result+'" alt="Ảnh đại diện Voucher"/>'};reader.readAsDataURL(file)}
function cmsVoucherOpenForm(index){cmsVoucherState.editIndex=typeof index==='number'?index:null;showScreen('loyalty-voucher-form');cmsVoucherResetForm(false);var edit=cmsVoucherState.editIndex!==null,r=edit?cmsVoucherRows[cmsVoucherState.editIndex]:null;document.getElementById('voucherFormTitle').textContent=edit?'Cập nhật thiết lập':'Thêm mới thiết lập';if(!r)return;cmsAccSetMultiValues('voucherObjectForm',r.object);cmsAccSetMultiValues('voucherUnitForm',r.unit);cmsAccSetMultiValues('voucherProductForm',r.product);cmsAccSetMultiValues('voucherTransactionForm',r.transaction);cmsAccSetMultiValues('voucherPaymentForm',r.payment);cmsTexpSyncPaymentGroups('voucherPaymentForm');voucherName.value=r.name;voucherPrefix.value=r.prefix;voucherDescription.value=r.description||'';cmsVoucherState.imageData=r.image||'';var preview=document.getElementById('voucherImagePreview');if(preview)preview.innerHTML=r.image?'<img src="'+r.image+'" alt="Ảnh đại diện Voucher"/>':'<i class="fa fa-image"></i><span>Chưa chọn ảnh</span>';voucherDiscountType.value=r.discountType;voucherDiscountValue.value=r.discountValue;voucherMaxDiscount.value=r.maxDiscount||'';voucherMinTransaction.value=r.minTransaction;voucherValidityType.value=r.validityType;var radio=document.querySelector('input[name="voucherReceiveMode"][value="'+(r.receiveMode||'Trọn đời')+'"]');if(radio)radio.checked=true;voucherValidityDays.value=r.validityDays||'';voucherDailyLimit.value=r.dailyLimit;voucherTotalLimit.value=r.totalLimit;voucherStart.value=r.start;voucherEnd.value=r.end;cmsVoucherDiscountChanged();cmsVoucherValidityChanged()}
function cmsVoucherResetForm(clearMode){if(!document.getElementById('voucherName'))return;cmsAccSetMultiValues('voucherObjectForm','Tất cả');cmsAccSetMultiValues('voucherUnitForm','Tất cả');cmsAccSetMultiValues('voucherProductForm','Tất cả');cmsAccSetMultiValues('voucherTransactionForm','Tất cả');cmsAccSetMultiValues('voucherPaymentForm','Tất cả');['voucherName','voucherPrefix','voucherDescription','voucherDiscountValue','voucherMaxDiscount','voucherMinTransaction','voucherValidityDays','voucherDailyLimit','voucherTotalLimit','voucherStart','voucherEnd'].forEach(function(id){document.getElementById(id).value=''});var imageInput=document.getElementById('voucherImage');if(imageInput)imageInput.value='';cmsVoucherState.imageData='';var preview=document.getElementById('voucherImagePreview');if(preview)preview.innerHTML='<i class="fa fa-image"></i><span>Chưa chọn ảnh</span>';voucherDiscountType.value='Theo số tiền';voucherValidityType.value='Theo thiết lập voucher';var lifetime=document.querySelector('input[name="voucherReceiveMode"][value="Trọn đời"]');if(lifetime)lifetime.checked=true;document.querySelectorAll('#screen-loyalty-voucher-form .field-error').forEach(function(e){e.textContent=''});cmsSetAlert('voucherFormAlert','','');cmsVoucherDiscountChanged();cmsVoucherValidityChanged();if(clearMode!==false)cmsVoucherState.editIndex=null}
function cmsVoucherFormValue(id){var values=cmsAccGetMultiValues(id);return values.indexOf('Tất cả')>=0?'Tất cả':values.join(', ')}
function cmsVoucherSave(){var ok=true;function req(id,msg){var e=document.getElementById(id),bad=!String(e.value||'').trim();var err=document.getElementById('err-'+id);if(err)err.textContent=bad?(msg||'Trường bắt buộc.'):'';ok=ok&&!bad}['voucherName','voucherPrefix','voucherDiscountValue','voucherMinTransaction','voucherDailyLimit','voucherTotalLimit','voucherStart','voucherEnd'].forEach(function(id){req(id)});[['voucherObjectForm','err-voucherObjectForm'],['voucherUnitForm','err-voucherUnitForm'],['voucherProductForm','err-voucherProductForm'],['voucherTransactionForm','err-voucherTransactionForm'],['voucherPaymentForm','err-voucherPaymentForm']].forEach(function(a){var bad=!cmsAccGetMultiValues(a[0]).length;document.getElementById(a[1]).textContent=bad?'Trường bắt buộc.':'';ok=ok&&!bad});if(voucherDiscountType.value==='Theo tỉ lệ')req('voucherMaxDiscount');else document.getElementById('err-voucherMaxDiscount').textContent='';var mode=(document.querySelector('input[name="voucherReceiveMode"]:checked')||{}).value||'Trọn đời';if(voucherValidityType.value==='Kể từ ngày nhận'&&mode==='Trong vòng')req('voucherValidityDays');else document.getElementById('err-voucherValidityDays').textContent='';if(voucherStart.value&&voucherEnd.value&&new Date(voucherEnd.value)<=new Date(voucherStart.value)){document.getElementById('err-voucherEnd').textContent='Ngày kết thúc phải sau ngày áp dụng.';ok=false}if(!ok)return;var old=cmsVoucherState.editIndex!==null?cmsVoucherRows[cmsVoucherState.editIndex]:null,row={object:cmsVoucherFormValue('voucherObjectForm'),unit:cmsVoucherFormValue('voucherUnitForm'),product:cmsVoucherFormValue('voucherProductForm'),name:voucherName.value.trim(),prefix:voucherPrefix.value.trim().toUpperCase(),description:voucherDescription.value.trim(),image:cmsVoucherState.imageData||(old&&old.image)||'',transaction:cmsVoucherFormValue('voucherTransactionForm'),payment:cmsVoucherFormValue('voucherPaymentForm'),discountType:voucherDiscountType.value,discountValue:Number(voucherDiscountValue.value),maxDiscount:voucherDiscountType.value==='Theo tỉ lệ'?Number(voucherMaxDiscount.value):0,minTransaction:Number(voucherMinTransaction.value),validityType:voucherValidityType.value,receiveMode:voucherValidityType.value==='Kể từ ngày nhận'?mode:'',validityDays:voucherValidityType.value==='Kể từ ngày nhận'&&mode==='Trong vòng'?Number(voucherValidityDays.value):'',dailyLimit:Number(voucherDailyLimit.value),totalLimit:Number(voucherTotalLimit.value),start:voucherStart.value,end:voucherEnd.value,status:old?old.status:(new Date(voucherStart.value)>new Date()?'Chờ áp dụng':'Hiệu lực')};if(old)cmsVoucherRows[cmsVoucherState.editIndex]=row;else cmsVoucherRows.push(row);cmsSetAlert('voucherFormAlert','success','Đã lưu thiết lập Voucher.');cmsVoucherRender()}
function cmsVoucherPause(i){cmsAccConfirm('Tạm dừng thiết lập','Bạn xác nhận tạm dừng thiết lập Voucher này?',function(){cmsVoucherRows[i].status='Tạm dừng';cmsVoucherRender()})}
function cmsVoucherDelete(i){cmsAccConfirm('Xóa thiết lập','Bạn xác nhận xóa thiết lập Voucher này?',function(){cmsVoucherRows.splice(i,1);cmsVoucherRender()})}
function cmsVoucherApplyColumns(){var table=document.getElementById('voucherSettingTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=cmsVoucherState.hiddenColumns.has(i)?'none':''})})}
function cmsVoucherToggleColumns(btn){var old=document.getElementById('voucherColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='voucherColumnPicker';panel.className='column-picker show';document.querySelectorAll('#voucherSettingTable thead th').forEach(function(th,i){if(i===11)return;var label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=!cmsVoucherState.hiddenColumns.has(i);box.onchange=function(){if(box.checked)cmsVoucherState.hiddenColumns.delete(i);else cmsVoucherState.hiddenColumns.add(i);cmsVoucherApplyColumns()};label.append(box,document.createTextNode(th.textContent.trim()));panel.append(label)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsVoucherInit);


/* Loyalty > Quản lý Voucher */
var cmsVoucherManageRows=[
 {code:'BDAY-2026-8F2K',name:'Voucher sinh nhật',account:'hongtt',transaction:'Thanh toán',payment:'Số dư MyVTC',discount:50000,issued:'2026-07-01T08:30:00',expired:'2026-07-31T23:59:59',used:'',transactionCode:'',updatedBy:'Hệ thống',updated:'2026-07-01T08:30:00',status:'Còn hiệu lực',description:'Ưu đãi sinh nhật dành cho thành viên.',discountType:'Theo số tiền',minTransaction:200000,programIndex:1,eventCode:'EVT-BIRTHDAY',eventName:'Sinh nhật thành viên'},
 {code:'MYVTC10-X7P9',name:'Voucher giảm 10%',account:'toanth',transaction:'Mua hàng',payment:'Thẻ Vcoin',discount:30000,issued:'2026-06-20T10:15:00',expired:'2026-07-20T23:59:59',used:'2026-07-05T19:20:12',transactionCode:'GD26070501982',updatedBy:'toanth',updated:'2026-07-05T19:20:12',status:'Đã sử dụng',description:'Giảm 10%, tối đa 30.000 VNĐ.',discountType:'Theo tỉ lệ',minTransaction:100000,programIndex:0,eventCode:'EVT-SUMMER',eventName:'Ưu đãi hè 2026'},
 {code:'NAPPOINT-5A6C',name:'Voucher nạp Point',account:'ngocanh88',transaction:'Nạp Point',payment:'Ngân hàng nội địa',discount:0,issued:'2026-05-10T14:00:00',expired:'2026-06-10T23:59:59',used:'',transactionCode:'',updatedBy:'Admin',updated:'2026-06-11T00:05:00',status:'Hết hiệu lực',description:'Voucher ưu đãi nạp Point.',discountType:'Theo số tiền',minTransaction:500000,programIndex:0,eventCode:'EVT-TOPUP',eventName:'Khuyến mại nạp Point'},
 {code:'PAY50K-H2M4',name:'Voucher giảm 50.000 VNĐ',account:'minhquan',transaction:'Thanh toán',payment:'Ví VTC Pay',discount:50000,issued:'2026-07-18T09:45:00',expired:'2026-08-18T23:59:59',used:'',transactionCode:'',updatedBy:'Admin',updated:'2026-07-18T09:45:00',status:'Còn hiệu lực',description:'Giảm trực tiếp 50.000 VNĐ.',discountType:'Theo số tiền',minTransaction:300000,programIndex:2,eventCode:'EVT-PAYMENT',eventName:'Ưu đãi thanh toán'}
];
var cmsVoucherManageState={page:1,size:8,hiddenColumns:new Set(),revokeIndex:null};
function cmsVoucherManageDate(v){if(!v)return '-';var d=new Date(v);return isNaN(d)?'-':d.toLocaleString('vi-VN',{hour12:false,day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'}).replace(',', '')}
function cmsVoucherManageStatusClass(s){return s==='Còn hiệu lực'?'texp-status-active':s==='Đã sử dụng'?'voucher-manage-status-used':'texp-status-expired'}
function cmsVoucherManageFiltered(){var account=(document.getElementById('voucherManageAccountFilter')||{}).value||'',code=(document.getElementById('voucherManageCodeFilter')||{}).value||'',name=(document.getElementById('voucherManageNameFilter')||{}).value||'',status=(document.getElementById('voucherManageStatusFilter')||{}).value||'',transaction=(document.getElementById('voucherManageTransactionFilter')||{}).value||'',quick=(document.getElementById('voucherManageQuickSearch')||{}).value||'',from=(document.getElementById('voucherManageFromDate')||{}).value||'',to=(document.getElementById('voucherManageToDate')||{}).value||'';function has(v,q){return String(v||'').toLowerCase().indexOf(String(q||'').trim().toLowerCase())>=0}return cmsVoucherManageRows.map(function(row,index){return {row:row,index:index}}).filter(function(x){var r=x.row,all=[r.code,r.name,r.account,r.transaction,r.payment,r.transactionCode,r.updatedBy,r.status].join(' ');var issued=r.issued||'';return (!account||has(r.account,account))&&(!code||has(r.code,code))&&(!name||has(r.name,name))&&(!status||r.status===status)&&(!transaction||r.transaction===transaction)&&(!quick||has(all,quick))&&(!from||issued>=from)&&(!to||issued<=to)})}
function cmsVoucherManageSearch(){cmsVoucherManageState.page=1;cmsVoucherManageRender()}
function cmsVoucherManageRender(){var body=document.getElementById('voucherManageTableBody');if(!body)return;var rows=cmsVoucherManageFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsVoucherManageState.size));if(cmsVoucherManageState.page>pages)cmsVoucherManageState.page=pages;var off=(cmsVoucherManageState.page-1)*cmsVoucherManageState.size,part=rows.slice(off,off+cmsVoucherManageState.size);body.innerHTML=part.map(function(x,rowIndex){var r=x.row,actions='<div class="voucher-action-buttons"><button class="icon-square blue" title="Xem chi tiết" onclick="cmsVoucherManageView('+x.index+')"><i class="fa fa-eye"></i></button>';if(r.status==='Còn hiệu lực')actions+='<button class="icon-square orange" title="Thu hồi" onclick="cmsVoucherManageOpenRevoke('+x.index+')"><i class="fa fa-undo"></i></button>';actions+='</div>';return '<tr><td>'+(off+rowIndex+1)+'</td><td>'+cmsSafeText(r.code)+'</td><td>'+cmsSafeText(r.name)+'</td><td>'+cmsSafeText(r.account)+'</td><td>'+cmsSafeText(r.transaction)+'</td><td>'+cmsSafeText(r.payment)+'</td><td>'+cmsSafeText(r.transactionCode||'-')+'</td><td>'+(r.status==='Đã sử dụng'?Number(r.discount||0).toLocaleString('vi-VN')+' VNĐ':'-')+'</td><td>'+cmsSafeText(r.updatedBy)+'</td><td>'+cmsVoucherManageDate(r.updated)+'</td><td><span class="texp-table-status '+cmsVoucherManageStatusClass(r.status)+'">'+cmsSafeText(r.status)+'</span></td><td class="action-cell">'+actions+'</td></tr>'}).join('')||'<tr><td colspan="14" style="text-align:center">Không có dữ liệu</td></tr>';document.getElementById('voucherManagePageInfo').textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsVoucherManageState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';document.getElementById('voucherManagePager').innerHTML='<button '+(cmsVoucherManageState.page===1?'disabled':'')+' onclick="cmsVoucherManagePage('+(cmsVoucherManageState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsVoucherManageState.page?'active':'')+'" onclick="cmsVoucherManagePage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsVoucherManageState.page===pages?'disabled':'')+' onclick="cmsVoucherManagePage('+(cmsVoucherManageState.page+1)+')">Tiếp</button>';cmsVoucherManageApplyColumns()}
function cmsVoucherManagePage(p){if(p>0){cmsVoucherManageState.page=p;cmsVoucherManageRender()}}
function cmsVoucherManageOpenProgram(i){cmsVoucherManageCloseDetail();showScreen('loyalty-voucher-setting');setTimeout(function(){cmsVoucherView(typeof i==='number'?i:0)},0)}
function cmsVoucherManageView(i){var r=cmsVoucherManageRows[i],modal=document.getElementById('voucherManageDetailModal'),content=document.getElementById('voucherManageDetailContent');if(!r||!modal||!content)return;var issue=[['Mã Voucher',r.code],['Tên Voucher',r.name],['Tài khoản nhận',r.account],['Chương trình phát hành','<button class="voucher-program-link" type="button" onclick="cmsVoucherManageOpenProgram('+Number(r.programIndex||0)+')"><i class="fa fa-external-link"></i> '+cmsSafeText(r.name)+'</button>','html'],['Sự kiện phát hành','<span class="voucher-event-info"><b>'+cmsSafeText(r.eventCode||'-')+'</b><span>'+cmsSafeText(r.eventName||'-')+'</span></span>','html'],['Ngày phát hành',cmsVoucherManageDate(r.issued)]];var activity=[['Mã giao dịch',r.transactionCode||'-'],['Loại giao dịch',r.transaction],['Hình thức thanh toán',r.payment],['Loại giảm giá',r.discountType],['Số tiền giảm giá',r.status==='Đã sử dụng'?Number(r.discount).toLocaleString('vi-VN')+' VNĐ':'-'],['Ngày hết hạn',cmsVoucherManageDate(r.expired)],['Ngày sử dụng',cmsVoucherManageDate(r.used)],['Ngày cập nhật',cmsVoucherManageDate(r.updated)],['Người cập nhật',r.updatedBy],['Trạng thái',r.status,'status']];function section(title,items){return '<section class="voucher-detail-section"><h4>'+title+'</h4><div class="voucher-detail-grid">'+items.map(function(item){var cls='voucher-detail-item'+(item[2]==='status'?' voucher-detail-status-item':'');var value=item[2]==='status'?'<span class="texp-table-status '+cmsVoucherManageStatusClass(r.status)+'">'+cmsSafeText(r.status)+'</span>':item[2]==='html'?item[1]:cmsSafeText(item[1]||'-');return '<div class="'+cls+'"><span>'+cmsSafeText(item[0])+'</span><strong>'+value+'</strong></div>'}).join('')+'</div></section>'}content.innerHTML=section('1. Thông tin phát hành',issue)+section('2. Thông tin hoạt động',activity);modal.classList.add('show')}
function cmsVoucherManageCloseDetail(){var m=document.getElementById('voucherManageDetailModal');if(m)m.classList.remove('show')}
function cmsVoucherManageOpenRevoke(i){var r=cmsVoucherManageRows[i];if(!r||r.status!=='Còn hiệu lực')return;cmsVoucherManageState.revokeIndex=i;document.getElementById('voucherManageRevokeText').textContent='Bạn xác nhận thu hồi Voucher '+r.code+' của tài khoản '+r.account+'?';document.getElementById('voucherManageRevokeReason').value='';document.getElementById('voucherManageRevokeError').textContent='';document.getElementById('voucherManageRevokeModal').classList.add('show')}
function cmsVoucherManageCloseRevoke(){var m=document.getElementById('voucherManageRevokeModal');if(m)m.classList.remove('show');cmsVoucherManageState.revokeIndex=null}
function cmsVoucherManageConfirmRevoke(){var i=cmsVoucherManageState.revokeIndex,reason=document.getElementById('voucherManageRevokeReason').value.trim();if(!reason){document.getElementById('voucherManageRevokeError').textContent='Vui lòng nhập lý do thu hồi.';return}var r=cmsVoucherManageRows[i];if(!r)return;r.status='Hết hiệu lực';r.updatedBy='Admin';r.updated=new Date().toISOString().slice(0,19);cmsVoucherManageCloseRevoke();cmsVoucherManageRender()}
function cmsVoucherManageOpenIssue(){document.getElementById('voucherManageIssueAccount').value='';document.getElementById('voucherManageIssueName').value='';document.getElementById('voucherManageIssueError').textContent='';document.getElementById('voucherManageIssueModal').classList.add('show')}
function cmsVoucherManageCloseIssue(){var m=document.getElementById('voucherManageIssueModal');if(m)m.classList.remove('show')}
function cmsVoucherManageConfirmIssue(){var account=document.getElementById('voucherManageIssueAccount').value.trim(),name=document.getElementById('voucherManageIssueName').value;if(!account||!name){document.getElementById('voucherManageIssueError').textContent='Vui lòng nhập đủ thông tin.';return}var now=new Date(),end=new Date(now.getTime()+30*86400000),code='VOUCHER-'+Math.random().toString(36).slice(2,8).toUpperCase();cmsVoucherManageRows.unshift({code:code,name:name,account:account,transaction:'Thanh toán',payment:'Số dư MyVTC',discount:0,issued:now.toISOString().slice(0,19),expired:end.toISOString().slice(0,19),used:'',transactionCode:'',updatedBy:'Admin',updated:now.toISOString().slice(0,19),status:'Còn hiệu lực',description:'Voucher phát hành thủ công từ CMS.',discountType:'Theo thiết lập Voucher',minTransaction:0,programIndex:0,eventCode:'-',eventName:'Phát hành thủ công'});cmsVoucherManageCloseIssue();cmsVoucherManageRender()}
function cmsVoucherManageApplyColumns(){var table=document.getElementById('voucherManageTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=cmsVoucherManageState.hiddenColumns.has(i)?'none':''})})}
function cmsVoucherManageToggleColumns(btn){var old=document.getElementById('voucherManageColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='voucherManageColumnPicker';panel.className='column-picker show';document.querySelectorAll('#voucherManageTable thead th').forEach(function(th,i){if(i===11)return;var label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=!cmsVoucherManageState.hiddenColumns.has(i);box.onchange=function(){if(box.checked)cmsVoucherManageState.hiddenColumns.delete(i);else cmsVoucherManageState.hiddenColumns.add(i);cmsVoucherManageApplyColumns()};label.append(box,document.createTextNode(th.textContent.trim()));panel.append(label)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsVoucherManageRender);

/* Loyalty > Tra cứu giao dịch EXP */
var cmsExpTxProducts=['Dịch Vụ Scoin','Au Mobile','Truy Kích','Trang chủ VTC.VN','Đào tạo số edu.vtc.vn','Tập kích','TS Origin','Đại Chiến Tam Quốc','Web VTCGame','Au Top','Phong Vân Chí'];
var cmsExpTxRows=[
 {time:'2026-07-23T10:25:18',account:'hongtt9313',name:'Trần Thị Hồng',expType:'T-EXP',amount:120,source:'Tích lũy',code:'EXP-T-20260723-001',transactionType:'Nạp Point',product:'Dịch Vụ Scoin',lifeBefore:3280,lifeAfter:3400,rankBefore:'Vàng',rankAfter:'Vàng',updatedBy:'Hệ thống',device:'Chrome trên Windows 10',version:'Website 1.1.1',ip:'113.160.12.45'},
 {time:'2026-07-23T09:18:42',account:'nguyenvana',name:'Nguyễn Văn A',expType:'A-EXP',amount:50,source:'Thưởng sự kiện',code:'EXP-A-20260723-002',transactionType:'Mua hàng',product:'Au Mobile',lifeBefore:980,lifeAfter:1030,rankBefore:'Bạc',rankAfter:'Vàng',updatedBy:'Admin',device:'iPhone 15 Pro',version:'Mobile App 1.1.1',ip:'14.177.82.19'},
 {time:'2026-07-22T21:06:10',account:'phamminhduc',name:'Phạm Minh Đức',expType:'T-EXP',amount:-80,source:'Thu hồi',code:'EXP-T-20260722-003',transactionType:'Mua hàng',product:'Truy Kích',lifeBefore:2210,lifeAfter:2130,rankBefore:'Vàng',rankAfter:'Vàng',updatedBy:'admin_loan',device:'Samsung Galaxy S24',version:'SDK 1.1.1',ip:'171.244.55.98'},
 {time:'2026-07-22T16:44:29',account:'lethuy88',name:'Lê Thuỷ',expType:'A-EXP',amount:30,source:'Cộng bù',code:'EXP-A-20260722-004',transactionType:'Nạp Point',product:'Trang chủ VTC.VN',lifeBefore:450,lifeAfter:480,rankBefore:'Bạc',rankAfter:'Bạc',updatedBy:'admin_hung',device:'Firefox trên macOS',version:'Website 1.1.1',ip:'27.72.104.12'},
 {time:'2026-07-21T14:12:03',account:'doquanghuy',name:'Đỗ Quang Huy',expType:'T-EXP',amount:200,source:'Tích lũy',code:'EXP-T-20260721-005',transactionType:'Mua hàng',product:'TS Origin',lifeBefore:4860,lifeAfter:5060,rankBefore:'Bạch Kim',rankAfter:'Bạch Kim',updatedBy:'Hệ thống',device:'Chrome trên Android',version:'SDK 1.1.1',ip:'103.199.33.71'},
 {time:'2026-07-20T08:35:55',account:'trananh99',name:'Trần Anh',expType:'A-EXP',amount:100,source:'Thưởng sự kiện',code:'EXP-A-20260720-006',transactionType:'Nạp Point',product:'Au Top',lifeBefore:8920,lifeAfter:9020,rankBefore:'Bạch Kim',rankAfter:'Kim Cương',updatedBy:'Hệ thống',device:'iPad Air',version:'Mobile App 1.1.1',ip:'115.73.220.46'},
 {time:'2026-07-19T19:20:11',account:'mai.linh',name:'Mai Linh',expType:'T-EXP',amount:-25,source:'Thu hồi',code:'EXP-T-20260719-007',transactionType:'Mua hàng',product:'Phong Vân Chí',lifeBefore:1300,lifeAfter:1275,rankBefore:'Vàng',rankAfter:'Vàng',updatedBy:'Admin',device:'Edge trên Windows 11',version:'Website 1.1.1',ip:'42.112.90.15'},
 {time:'2026-07-18T11:02:47',account:'vuhoangnam',name:'Vũ Hoàng Nam',expType:'A-EXP',amount:40,source:'Cộng bù',code:'EXP-A-20260718-008',transactionType:'Mua hàng',product:'Đại Chiến Tam Quốc',lifeBefore:690,lifeAfter:730,rankBefore:'Bạc',rankAfter:'Bạc',updatedBy:'admin_nga',device:'Xiaomi 14',version:'SDK 1.1.1',ip:'118.70.181.66'}
];
var cmsExpTxState={page:1,size:6,hiddenColumns:new Set()};
function cmsExpTxEsc(v){return cmsSafeText(v==null?'-':v)}
function cmsExpTxFormatTime(v){if(!v)return '-';var d=new Date(v);if(isNaN(d.getTime()))return String(v).replace('T',' ');return d.toLocaleString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit'}).replace(',','')}
function cmsExpTxInit(){var f=document.getElementById('expTxProduct');if(!f)return;var opts=cmsExpTxProducts.map(function(x){return '<option>'+cmsExpTxEsc(x)+'</option>'}).join('');f.innerHTML='<option value="">Tất cả</option>'+opts;cmsExpTxRender()}
function cmsExpTxFiltered(){var from=(document.getElementById('expTxFrom')||{}).value||'',to=(document.getElementById('expTxTo')||{}).value||'',account=((document.getElementById('expTxAccount')||{}).value||'').trim().toLowerCase(),source=(document.getElementById('expTxSource')||{}).value||'',type=(document.getElementById('expTxType')||{}).value||'',product=(document.getElementById('expTxProduct')||{}).value||'',code=((document.getElementById('expTxCode')||{}).value||'').trim().toLowerCase(),quick=((document.getElementById('expTxQuick')||{}).value||'').trim().toLowerCase();return cmsExpTxRows.map(function(r,i){return{row:r,index:i}}).filter(function(x){var r=x.row,text=Object.keys(r).map(function(k){return r[k]}).join(' ').toLowerCase();return(!from||r.time>=from)&&(!to||r.time<=to)&&(!account||(r.account+' '+r.name).toLowerCase().indexOf(account)>=0)&&(!source||r.source===source)&&(!type||r.transactionType===type)&&(!product||r.product===product)&&(!code||r.code.toLowerCase().indexOf(code)>=0)&&(!quick||text.indexOf(quick)>=0)})}
function cmsExpTxSearch(){cmsExpTxState.page=1;cmsExpTxRender()}
function cmsExpTxRender(){var body=document.getElementById('expTxTableBody');if(!body)return;var rows=cmsExpTxFiltered(),pages=Math.max(1,Math.ceil(rows.length/cmsExpTxState.size));if(cmsExpTxState.page>pages)cmsExpTxState.page=pages;var off=(cmsExpTxState.page-1)*cmsExpTxState.size,part=rows.slice(off,off+cmsExpTxState.size);body.innerHTML=part.map(function(x,i){var r=x.row,sign=Number(r.amount)>=0?'+':'',amountCls=Number(r.amount)>=0?'exp-value-positive':'exp-value-negative';return '<tr><td>'+(off+i+1)+'</td><td>'+cmsExpTxFormatTime(r.time)+'</td><td>'+cmsExpTxEsc(r.account)+'</td><td>'+cmsExpTxEsc(r.name)+'</td><td><span class="exp-type-badge">'+cmsExpTxEsc(r.expType)+'</span></td><td class="'+amountCls+'">'+sign+Number(r.amount).toLocaleString('vi-VN')+'</td><td>'+cmsExpTxEsc(r.source)+'</td><td>'+cmsExpTxEsc(r.code)+'</td><td>'+cmsExpTxEsc(r.transactionType)+'</td><td>'+cmsExpTxEsc(r.product)+'</td><td>'+Number(r.lifeBefore).toLocaleString('vi-VN')+'</td><td>'+Number(r.lifeAfter).toLocaleString('vi-VN')+'</td><td>'+cmsExpTxEsc(r.rankBefore)+'</td><td>'+cmsExpTxEsc(r.rankAfter)+'</td><td>'+cmsExpTxEsc(r.updatedBy)+'</td><td class="action-cell"><button class="icon-square blue" title="Xem chi tiết" onclick="cmsExpTxView('+x.index+')"><i class="fa fa-eye"></i></button></td></tr>'}).join('')||'<tr><td colspan="16" style="text-align:center">Không có dữ liệu</td></tr>';var info=document.getElementById('expTxPageInfo'),pager=document.getElementById('expTxPager');if(info)info.textContent=rows.length?'Hiển thị từ '+(off+1)+' tới '+Math.min(off+cmsExpTxState.size,rows.length)+' của '+rows.length+' bản ghi':'Không có bản ghi';if(pager)pager.innerHTML='<button '+(cmsExpTxState.page===1?'disabled':'')+' onclick="cmsExpTxPage('+(cmsExpTxState.page-1)+')">Trước</button>'+Array.from({length:pages},function(_,n){return '<button class="'+(n+1===cmsExpTxState.page?'active':'')+'" onclick="cmsExpTxPage('+(n+1)+')">'+(n+1)+'</button>'}).join('')+'<button '+(cmsExpTxState.page===pages?'disabled':'')+' onclick="cmsExpTxPage('+(cmsExpTxState.page+1)+')">Tiếp</button>';cmsExpTxApplyColumns()}
function cmsExpTxPage(p){if(p>0){cmsExpTxState.page=p;cmsExpTxRender()}}
function cmsExpTxView(i){var r=cmsExpTxRows[i],modal=document.getElementById('expTxDetailModal'),content=document.getElementById('expTxDetailContent');if(!r||!modal||!content)return;var items=[['Thời gian',cmsExpTxFormatTime(r.time)],['Tài khoản',r.account],['Họ và tên',r.name],['Loại EXP',r.expType],['Số EXP',(r.amount>=0?'+':'')+Number(r.amount).toLocaleString('vi-VN')],['Nguồn phát',r.source],['Mã giao dịch EXP',r.code],['Loại giao dịch',r.transactionType],['Sản phẩm',r.product],['Life EXP trước GD',Number(r.lifeBefore).toLocaleString('vi-VN')],['Life EXP sau GD',Number(r.lifeAfter).toLocaleString('vi-VN')],['Hạng thành viên trước GD',r.rankBefore],['Hạng thành viên sau GD',r.rankAfter],['Người cập nhật',r.updatedBy],['Thiết bị',r.device],['Phiên bản',r.version],['IP',r.ip]];content.innerHTML=items.map(function(x){return '<div class="exp-tx-detail-item"><span>'+cmsExpTxEsc(x[0])+'</span><strong>'+cmsExpTxEsc(x[1])+'</strong></div>'}).join('');modal.classList.add('show')}
function cmsExpTxCloseDetail(){var m=document.getElementById('expTxDetailModal');if(m)m.classList.remove('show')}
function cmsExpTxApplyColumns(){var table=document.getElementById('expTxTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=cmsExpTxState.hiddenColumns.has(i)?'none':''})})}
function cmsExpTxToggleColumns(btn){var old=document.getElementById('expTxColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='expTxColumnPicker';panel.className='column-picker show';document.querySelectorAll('#expTxTable thead th').forEach(function(th,i){if(i===15)return;var label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=!cmsExpTxState.hiddenColumns.has(i);box.onchange=function(){if(box.checked)cmsExpTxState.hiddenColumns.delete(i);else cmsExpTxState.hiddenColumns.add(i);cmsExpTxApplyColumns()};label.append(box,document.createTextNode(th.textContent.trim()));panel.append(label)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsExpTxInit);


/* Loyalty > Tra cứu hạng thành viên */
var cmsMemberRankLookupAccount = null;
var cmsMemberRankLookupPage = 1;
var cmsMemberRankLookupPageSize = 10;

function cmsFindAccountByAny(value){
  var key = String(value || '').trim().toLowerCase();
  if(!key) return null;
  return cmsAccountData.find(function(acc){
    return [acc.username, acc.phone, acc.email, acc.accountId].some(function(item){
      return String(item || '').trim().toLowerCase() === key;
    });
  }) || null;
}

function cmsLookupMemberRank(){
  cmsNormalizeAccountDemoData();
  var input = document.getElementById('loyaltyRankLookupAccount');
  var result = document.getElementById('loyaltyRankLookupResult');
  var acc = cmsFindAccountByAny(input ? input.value : '');
  if(!acc){
    cmsMemberRankLookupAccount = null;
    if(result) result.classList.add('hidden');
    cmsSetAlert('loyaltyRankLookupAlert','error','Không tìm thấy tài khoản. Vui lòng kiểm tra Username, Số điện thoại hoặc Email.');
    return;
  }
  cmsMemberRankLookupAccount = acc;
  cmsMemberRankLookupPage = 1;
  cmsSetAlert('loyaltyRankLookupAlert','success','Tra cứu hạng thành viên thành công.');
  if(result) result.classList.remove('hidden');
  var setText = function(id,value){var node=document.getElementById(id);if(node)node.textContent=value || '-';};
  setText('loyaltyRankFullName',acc.fullName);
  setText('loyaltyRankUsername',acc.username);
  setText('loyaltyRankAccountId',acc.accountId);
  setText('loyaltyRankStatus',acc.status);
  setText('loyaltyRankCurrent',acc.loyalty.rank);
  setText('loyaltyRankLifetimeExp',Number(acc.loyalty.lifetimeExp || 0).toLocaleString('vi-VN') + ' EXP');
  var targetExp = acc.loyalty.targetExp || (Number(acc.loyalty.cycleExp || 0) + Number(acc.loyalty.expMissing || 0));
  var targetTExp = acc.loyalty.targetTExp || 80;
  var maintainExp = Number(acc.loyalty.maintainExp || 0);
  var maintainTExp = Number(acc.loyalty.maintainTExp || 0);
  setText('loyaltyRankCycleExp',Number(acc.loyalty.cycleExp || 0).toLocaleString('vi-VN') + ' EXP / Cần đạt ' + Number(targetExp).toLocaleString('vi-VN') + ' EXP để lên hạng | ' + maintainExp.toLocaleString('vi-VN') + ' EXP giữ hạng');
  setText('loyaltyRankCycleTExp',Number(acc.loyalty.cycleTExp || 0).toLocaleString('vi-VN') + ' T-EXP / Cần đạt ' + Number(targetTExp).toLocaleString('vi-VN') + ' T-EXP để lên hạng | ' + maintainTExp.toLocaleString('vi-VN') + ' T-EXP giữ hạng');
  setText('loyaltyRankNext',acc.loyalty.nextRank || '-');
  setText('loyaltyRankCycleStart',acc.loyalty.cycleStart);
  setText('loyaltyRankCycleEnd',acc.loyalty.cycleEnd);
  cmsRenderMemberRankHistory();
}

function cmsRenderMemberRankHistory(){
  var body = document.getElementById('loyaltyRankHistoryBody');
  if(!body || !cmsMemberRankLookupAccount) return;
  var rows = cmsMemberRankLookupAccount.loyalty.rankHistory || [];
  var pages = Math.max(1,Math.ceil(rows.length / cmsMemberRankLookupPageSize));
  cmsMemberRankLookupPage = Math.min(Math.max(1,cmsMemberRankLookupPage),pages);
  var start = (cmsMemberRankLookupPage - 1) * cmsMemberRankLookupPageSize;
  var part = rows.slice(start,start + cmsMemberRankLookupPageSize);
  body.innerHTML = part.map(function(row,index){
    return '<tr><td>'+(start+index+1)+'</td><td>'+cmsSafeText(row.time)+'</td><td>'+cmsSafeText(row.type)+'</td><td>'+cmsSafeText(row.reason)+'</td></tr>';
  }).join('') || '<tr><td colspan="4" style="text-align:center">Không có dữ liệu</td></tr>';
  var info = document.getElementById('loyaltyRankPageInfo');
  if(info) info.textContent = rows.length ? 'Hiển thị từ '+(start+1)+' tới '+Math.min(start+cmsMemberRankLookupPageSize,rows.length)+' của '+rows.length+' bản ghi' : 'Không có bản ghi';
  var pager = document.getElementById('loyaltyRankPager');
  if(pager){
    pager.innerHTML = Array.from({length:pages},function(_,i){
      var page=i+1;
      return '<button class="'+(page===cmsMemberRankLookupPage?'active':'')+'" onclick="cmsSetMemberRankPage('+page+')">'+page+'</button>';
    }).join('');
  }
}

function cmsSetMemberRankPage(page){
  cmsMemberRankLookupPage = page;
  cmsRenderMemberRankHistory();
}

/* CMS Sản phẩm > Quản trị gói nạp */
var cmsRechargePackagePage = 1;
var cmsRechargePackagePageSize = 5;

function cmsRenderRechargePackagePagination(){
  var screen=document.getElementById('screen-recharge-package-list');
  if(!screen)return;
  var rows=cmsProductRows(screen);
  var matched=rows.filter(function(row){return row.dataset.filterMatch!=='false';});
  var total=matched.length;
  var totalPages=Math.max(1,Math.ceil(total/cmsRechargePackagePageSize));
  cmsRechargePackagePage=Math.min(Math.max(1,cmsRechargePackagePage),totalPages);
  var start=(cmsRechargePackagePage-1)*cmsRechargePackagePageSize;
  var end=Math.min(start+cmsRechargePackagePageSize,total);
  rows.forEach(function(row){row.style.display='none';});
  matched.slice(start,end).forEach(function(row){row.style.display='';});
  var info=document.getElementById('rechargePackagePageInfo');
  if(info)info.textContent=total?'Hiển thị từ '+(start+1)+' tới '+end+' của '+total+' bản ghi':'Không có bản ghi';
  var pager=document.getElementById('rechargePackagePagination');
  if(!pager)return;
  var html='';
  for(var page=1;page<=totalPages;page++){
    html+='<button type="button" class="'+(page===cmsRechargePackagePage?'active':'')+'" onclick="cmsSetRechargePackagePage('+page+')">'+page+'</button>';
  }
  html+='<button type="button" aria-label="Trang tiếp theo" title="Trang tiếp theo" '+(cmsRechargePackagePage===totalPages?'disabled':'')+' onclick="cmsSetRechargePackagePage('+(cmsRechargePackagePage+1)+')">›</button>';
  html+='<button type="button" aria-label="Trang cuối" title="Trang cuối" '+(cmsRechargePackagePage===totalPages?'disabled':'')+' onclick="cmsSetRechargePackagePage('+totalPages+')">»</button>';
  pager.innerHTML=html;
}

function cmsSetRechargePackagePage(page){
  cmsRechargePackagePage=page;
  cmsRenderRechargePackagePagination();
}

function cmsInitRechargePackageAdmin(){
  var list=document.getElementById('screen-recharge-package-list');
  if(list){
    var lookup=list.querySelector('.cms-actions-center .btn.gray');
    if(lookup){lookup.dataset.cmsHandled='true';lookup.onclick=function(e){e.preventDefault();e.stopPropagation();cmsApplyProductFilters(list);};}
    var quick=list.querySelector('.tools-row input');
    if(quick){quick.oninput=function(){cmsApplyProductFilters(list);};quick.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();cmsApplyProductFilters(list);}};}
    var columnButton=list.querySelector('.tools-row button');
    if(columnButton){columnButton.dataset.cmsHandled='true';columnButton.onclick=function(e){e.preventDefault();e.stopPropagation();cmsOpenColumnPicker(list,columnButton);};}
    cmsProductRows(list).forEach(function(row){row.dataset.filterMatch='true';});
    cmsBindProductRowActions(list);
    cmsRenderRechargePackagePagination();
  }
  ['recharge-package-form-add','recharge-package-form-edit'].forEach(function(id){
    var screen=document.getElementById('screen-'+id);if(!screen)return;
    var form=screen.querySelector('.recharge-package-form');
    var reset=screen.querySelector('.recharge-package-reset');
    var save=screen.querySelector('.recharge-package-save');
    if(reset)reset.onclick=function(e){e.preventDefault();Array.prototype.forEach.call(form.querySelectorAll('input'),function(input){if(input.type==='checkbox')input.checked=true;else if(input.type!=='file')input.value='';else input.value='';});Array.prototype.forEach.call(form.querySelectorAll('select'),function(select){select.selectedIndex=0;});};
    if(save)save.onclick=function(e){
      e.preventDefault();
      var invalid=Array.prototype.find.call(form.querySelectorAll('[required]'),function(field){return !String(field.value||'').trim();});
      if(invalid){invalid.focus();cmsOpenProductModal('Dữ liệu chưa đầy đủ','Vui lòng nhập đủ các trường bắt buộc.');return;}
      cmsOpenProductModal('Thành công',id.indexOf('edit')>-1?'Thông tin gói nạp đã được cập nhật.':'Gói nạp mới đã được thêm.','Đóng',function(){showScreen('recharge-package-list');},'blue');
    };
  });
}
document.addEventListener('DOMContentLoaded',cmsInitRechargePackageAdmin);


// Support CMS
var cmsSupportPage={topic:1,article:1,template:1,notification:1},cmsSupportSize=5,cmsSupportHidden={topic:new Set(),article:new Set(),template:new Set(),notification:new Set()};
var cmsSupportTopics=[{id:'FAQ-TOPIC-001',name:'Tài khoản MyVTC',priority:1,status:'Hoạt động'},{id:'FAQ-TOPIC-002',name:'Đăng nhập và bảo mật',priority:2,status:'Hoạt động'},{id:'FAQ-TOPIC-003',name:'Nạp Point',priority:3,status:'Hoạt động'},{id:'FAQ-TOPIC-004',name:'Thanh toán dịch vụ',priority:4,status:'Hoạt động'},{id:'FAQ-TOPIC-005',name:'Voucher và ưu đãi',priority:5,status:'Tạm dừng'},{id:'FAQ-TOPIC-006',name:'Hạng thành viên',priority:6,status:'Hoạt động'}];
var cmsSupportArticles=[{id:'FAQ-ART-001',topic:'Tài khoản MyVTC',title:'Cách đăng ký tài khoản MyVTC',priority:1,status:'Hoạt động',content:'Hướng dẫn đăng ký tài khoản.',keywords:'#dangky, #taikhoan',related:[]},{id:'FAQ-ART-002',topic:'Đăng nhập và bảo mật',title:'Lấy lại mật khẩu khi quên',priority:1,status:'Hoạt động',content:'Hướng dẫn lấy lại mật khẩu.',keywords:'#matkhau, #otp',related:[]},{id:'FAQ-ART-003',topic:'Nạp Point',title:'Các phương thức nạp Point',priority:1,status:'Hoạt động',content:'Thông tin phương thức nạp Point.',keywords:'#point, #nap',related:[]},{id:'FAQ-ART-004',topic:'Thanh toán dịch vụ',title:'Xử lý giao dịch thanh toán lỗi',priority:2,status:'Hoạt động',content:'Hướng dẫn xử lý giao dịch lỗi.',keywords:'#thanhtoan, #giaodich',related:[]},{id:'FAQ-ART-005',topic:'Voucher và ưu đãi',title:'Điều kiện dùng Voucher',priority:1,status:'Tạm dừng',content:'Thông tin điều kiện Voucher.',keywords:'#voucher',related:[]},{id:'FAQ-ART-006',topic:'Hạng thành viên',title:'Cách tính EXP và xét hạng',priority:1,status:'Hoạt động',content:'Thông tin EXP và xét hạng.',keywords:'#exp, #hangthanhvien',related:[]}];
var cmsSupportTemplates=[{id:'NTF-TPL-001',event:'Đăng nhập hàng ngày',title:'Bạn đã nhận thưởng đăng nhập',channels:['Push Notification','In-app'],status:'Hoạt động',content:'Bạn đã nhận thưởng đăng nhập hôm nay.'},{id:'NTF-TPL-002',event:'Liên kết Google',title:'Liên kết Google thành công',channels:['In-app','Email'],status:'Hoạt động',content:'Tài khoản của bạn đã liên kết Google.'},{id:'NTF-TPL-003',event:'Xác minh email',title:'Xác minh email thành công',channels:['In-app','Email'],status:'Hoạt động',content:'Email của bạn đã được xác minh.'},{id:'NTF-TPL-004',event:'Nạp Point thành công',title:'Nạp Point thành công',channels:['Push Notification','In-app','SMS'],status:'Hoạt động',content:'Giao dịch nạp Point đã hoàn tất.'},{id:'NTF-TPL-005',event:'Thanh toán thành công',title:'Thanh toán dịch vụ thành công',channels:['Push Notification','In-app'],status:'Tạm dừng',content:'Giao dịch thanh toán đã hoàn tất.'}];
var cmsSupportNotifications=[{id:'NTF-001',sendTime:'2026-07-30T09:00',title:'Bảo trì hệ thống thanh toán',channels:['Push Notification','Email'],type:'Hệ thống',recipient:'Tất cả',recipientDetail:'Tất cả tài khoản',updatedAt:'29/07/2026 17:45',status:'Chờ gửi',content:'Hệ thống thanh toán tạm dừng để bảo trì.'},{id:'NTF-002',sendTime:'2026-07-29T14:00',title:'Hoàn Point giao dịch lỗi',channels:['Push Notification','SMS'],type:'Giao dịch',recipient:'Danh sách tài khoản',recipientDetail:'125 tài khoản',updatedAt:'29/07/2026 13:20',status:'Đã gửi',content:'Point đã được hoàn về tài khoản.'},{id:'NTF-003',sendTime:'2026-07-31T08:30',title:'Ưu đãi dành cho hạng Vàng',channels:['Push Notification','Email'],type:'Loyalty',recipient:'Theo hạng',recipientDetail:'Hạng Vàng',updatedAt:'29/07/2026 16:10',status:'Chờ gửi',content:'Nhận ưu đãi dành riêng cho thành viên hạng Vàng.'},{id:'NTF-004',sendTime:'2026-07-28T10:00',title:'Cập nhật chính sách hỗ trợ',channels:['Email'],type:'Hỗ trợ',recipient:'Theo nhóm tài khoản',recipientDetail:'Khách hàng thường xuyên',updatedAt:'28/07/2026 09:15',status:'Đã gửi',content:'Chính sách hỗ trợ mới đã được cập nhật.'},{id:'NTF-005',sendTime:'2026-08-01T20:00',title:'Nhắc hoàn tất xác minh tài khoản',channels:['Push Notification','SMS'],type:'Hệ thống',recipient:'Theo nhóm tài khoản',recipientDetail:'Tài khoản cần chăm sóc',updatedAt:'29/07/2026 18:05',status:'Chờ gửi',content:'Vui lòng hoàn tất xác minh tài khoản.'},{id:'NTF-006',sendTime:'2026-07-27T18:00',title:'Thông báo chương trình tích Point',channels:['Push Notification'],type:'Loyalty',recipient:'Tất cả',recipientDetail:'Tất cả tài khoản',updatedAt:'27/07/2026 17:30',status:'Đã hủy',content:'Chương trình tích Point mới.'}];
function cmsSupportData(type){return type==='topic'?cmsSupportTopics:type==='article'?cmsSupportArticles:type==='template'?cmsSupportTemplates:cmsSupportNotifications;}
function cmsSupportPrefix(type){return type==='topic'?'supportTopic':type==='article'?'supportArticle':type==='template'?'supportTemplate':'supportNotification';}
function cmsSupportEsc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function cmsSupportStatus(v){return '<span class="support-status">'+cmsSupportEsc(v)+'</span>';}
function cmsSupportFiltered(type){var p=cmsSupportPrefix(type),q=(document.getElementById(p+'Quick')||{}).value||'';q=q.toLowerCase();return cmsSupportData(type).filter(function(x){var ok=true;if(type==='topic'){var n=(document.getElementById(p+'NameFilter')||{}).value||'',s=(document.getElementById(p+'StatusFilter')||{}).value||'';ok=(!n||x.name.toLowerCase().indexOf(n.toLowerCase())>=0)&&(!s||x.status===s);}else if(type==='article'){var t=(document.getElementById(p+'TopicFilter')||{}).value||'',n=(document.getElementById(p+'NameFilter')||{}).value||'',c=(document.getElementById(p+'CodeFilter')||{}).value||'',s=(document.getElementById(p+'StatusFilter')||{}).value||'';ok=(!t||x.topic===t)&&(!n||x.title.toLowerCase().indexOf(n.toLowerCase())>=0)&&(!c||x.id.toLowerCase().indexOf(c.toLowerCase())>=0)&&(!s||x.status===s);}else if(type==='template'){var title=(document.getElementById(p+'TitleFilter')||{}).value||'',event=(document.getElementById(p+'EventFilter')||{}).value||'',s=(document.getElementById(p+'StatusFilter')||{}).value||'';ok=(!title||x.title.toLowerCase().indexOf(title.toLowerCase())>=0)&&(!event||x.event===event)&&(!s||x.status===s);}else{var from=(document.getElementById(p+'FromFilter')||{}).value||'',to=(document.getElementById(p+'ToFilter')||{}).value||'',title=(document.getElementById(p+'TitleFilter')||{}).value||'',channel=(document.getElementById(p+'ChannelFilter')||{}).value||'',kind=(document.getElementById(p+'TypeFilter')||{}).value||'',s=(document.getElementById(p+'StatusFilter')||{}).value||'';ok=(!from||x.sendTime>=from)&&(!to||x.sendTime<=to)&&(!title||x.title.toLowerCase().indexOf(title.toLowerCase())>=0)&&(!channel||x.channels.indexOf(channel)>=0)&&(!kind||x.type===kind)&&(!s||x.status===s);}return ok&&(!q||JSON.stringify(x).toLowerCase().indexOf(q)>=0);});}
function cmsSupportFormatDate(v){if(!v)return '';var d=new Date(v);if(isNaN(d.getTime()))return v;return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');}
function cmsSupportRender(type){cmsSupportSyncSelects();var list=cmsSupportFiltered(type),pages=Math.max(1,Math.ceil(list.length/cmsSupportSize));cmsSupportPage[type]=Math.min(cmsSupportPage[type],pages);var start=(cmsSupportPage[type]-1)*cmsSupportSize,rows=list.slice(start,start+cmsSupportSize),p=cmsSupportPrefix(type),html='';rows.forEach(function(x,i){var actions='';if(type==='notification'){actions='<button class="icon-square orange" title="Cập nhật" onclick="cmsSupportOpenForm(\'notification\',\''+x.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="Hủy" '+(x.status!=='Chờ gửi'?'disabled':'')+' onclick="cmsSupportCancelNotification(\''+x.id+'\')"><i class="fa fa-ban"></i></button><button class="icon-square red" title="Xóa" onclick="cmsSupportDelete(\'notification\',\''+x.id+'\')"><i class="fa fa-trash"></i></button>';html+='<tr><td>'+(start+i+1)+'</td><td>'+cmsSupportFormatDate(x.sendTime)+'</td><td>'+cmsSupportEsc(x.title)+'</td><td>'+cmsSupportEsc(x.channels.join(', '))+'</td><td>'+cmsSupportEsc(x.type)+'</td><td>'+cmsSupportEsc(x.recipientDetail||x.recipient)+'</td><td>'+cmsSupportEsc(x.updatedAt)+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+actions+'</td></tr>';return;}actions='<button class="icon-square orange" title="Cập nhật" onclick="cmsSupportOpenForm(\''+type+'\',\''+x.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="Bật/Tắt trạng thái" onclick="cmsSupportToggleStatus(\''+type+'\',\''+x.id+'\')"><i class="fa '+(x.status==='Hoạt động'?'fa-pause':'fa-play')+'"></i></button><button class="icon-square red" title="Xóa" onclick="cmsSupportDelete(\''+type+'\',\''+x.id+'\')"><i class="fa fa-trash"></i></button>';if(type==='topic')html+='<tr><td>'+(start+i+1)+'</td><td>'+x.id+'</td><td>'+cmsSupportEsc(x.name)+'</td><td>'+x.priority+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+actions+'</td></tr>';else if(type==='article')html+='<tr><td>'+(start+i+1)+'</td><td>'+x.id+'</td><td>'+cmsSupportEsc(x.topic)+'</td><td>'+cmsSupportEsc(x.title)+'</td><td>'+x.priority+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+actions+'</td></tr>';else html+='<tr><td>'+(start+i+1)+'</td><td>'+x.id+'</td><td>'+cmsSupportEsc(x.event)+'</td><td>'+cmsSupportEsc(x.title)+'</td><td>'+cmsSupportEsc(x.channels.join(', '))+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+actions+'</td></tr>';});var colspan=type==='notification'?9:7;document.getElementById(p+'Rows').innerHTML=html||'<tr><td colspan="'+colspan+'" class="empty-cell">Không có dữ liệu phù hợp.</td></tr>';document.getElementById(p+'Count').textContent=list.length?'Hiển thị '+(start+1)+' đến '+Math.min(start+rows.length,list.length)+' trong '+list.length+' bản ghi':'0 bản ghi';var pager=document.getElementById(p+'Pager'),ph='<button '+(cmsSupportPage[type]===1?'disabled':'')+' onclick="cmsSupportSetPage(\''+type+'\','+(cmsSupportPage[type]-1)+')">‹</button>';for(var n=1;n<=pages;n++)ph+='<button class="'+(n===cmsSupportPage[type]?'active':'')+'" onclick="cmsSupportSetPage(\''+type+'\','+n+')">'+n+'</button>';ph+='<button '+(cmsSupportPage[type]===pages?'disabled':'')+' onclick="cmsSupportSetPage(\''+type+'\','+(cmsSupportPage[type]+1)+')">›</button>';pager.innerHTML=ph;cmsSupportApplyColumns(type);}
function cmsSupportSearch(type){cmsSupportPage[type]=1;cmsSupportRender(type);}function cmsSupportSetPage(type,n){cmsSupportPage[type]=n;cmsSupportRender(type);}
function cmsSupportToggleStatus(type,id){var x=cmsSupportData(type).find(function(v){return v.id===id});if(x){x.status=x.status==='Hoạt động'?'Tạm dừng':'Hoạt động';cmsSupportRender(type);}}
function cmsSupportDelete(type,id){if(!confirm('Bạn có chắc chắn muốn xóa bản ghi này?'))return;if(type==='topic')cmsSupportTopics=cmsSupportTopics.filter(function(x){return x.id!==id});else if(type==='article')cmsSupportArticles=cmsSupportArticles.filter(function(x){return x.id!==id});else if(type==='template')cmsSupportTemplates=cmsSupportTemplates.filter(function(x){return x.id!==id});else cmsSupportNotifications=cmsSupportNotifications.filter(function(x){return x.id!==id});cmsSupportRender(type);}
function cmsSupportCancelNotification(id){var x=cmsSupportNotifications.find(function(v){return v.id===id});if(!x||x.status!=='Chờ gửi')return;if(confirm('Bạn có chắc chắn muốn hủy thông báo này?')){x.status='Đã hủy';x.updatedAt=new Date().toLocaleString('vi-VN',{hour12:false});cmsSupportRender('notification');}}
function cmsSupportToggleColumns(type,btn){var old=document.querySelector('.support-column-picker');if(old){old.remove();return;}var table=document.getElementById(cmsSupportPrefix(type)+'Table'),box=document.createElement('div');box.className='support-column-picker';Array.from(table.tHead.rows[0].cells).forEach(function(th,i){if(i===0||i===table.tHead.rows[0].cells.length-1)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsSupportHidden[type].has(i);c.onchange=function(){c.checked?cmsSupportHidden[type].delete(i):cmsSupportHidden[type].add(i);cmsSupportApplyColumns(type)};l.append(c,document.createTextNode(th.textContent));box.append(l)});document.body.append(box);var r=btn.getBoundingClientRect();box.style.left=r.left+'px';box.style.top=(r.bottom+5+scrollY)+'px';}
function cmsSupportApplyColumns(type){var table=document.getElementById(cmsSupportPrefix(type)+'Table');if(!table)return;Array.from(table.rows).forEach(function(r){Array.from(r.cells).forEach(function(c,i){c.style.display=cmsSupportHidden[type].has(i)?'none':''})});}
function cmsSupportSyncSelects(){var opts=cmsSupportTopics.map(function(x){return '<option>'+cmsSupportEsc(x.name)+'</option>'}).join(''),filter=document.getElementById('supportArticleTopicFilter'),form=document.getElementById('supportArticleTopic');if(filter){var v=filter.value;filter.innerHTML='<option value="">Tất cả</option>'+opts;filter.value=v}if(form){var v2=form.value;form.innerHTML=opts;form.value=v2||cmsSupportTopics[0].name}var related=document.getElementById('supportArticleRelated');if(related){var selected=Array.from(related.selectedOptions||[]).map(function(o){return o.value});related.innerHTML=cmsSupportArticles.map(function(x){return '<option value="'+x.id+'">'+cmsSupportEsc(x.title)+'</option>'}).join('');Array.from(related.options).forEach(function(o){o.selected=selected.indexOf(o.value)>=0});cmsSupportRenderRelated()}}
function cmsSupportOpenForm(type,id){cmsSupportSyncSelects();var x=id?cmsSupportData(type).find(function(v){return v.id===id}):null,p=cmsSupportPrefix(type);document.getElementById(p+'EditId').value=x?x.id:'';document.getElementById(p+'FormTitle').textContent=x?'Cập nhật':'Thêm mới';if(type==='topic'){document.getElementById(p+'Name').value=x?x.name:'';document.getElementById(p+'Priority').value=x?x.priority:1;document.getElementById(p+'Status').checked=!x||x.status==='Hoạt động';showScreen('support-faq-topic-form')}else if(type==='article'){document.getElementById(p+'Topic').value=x?x.topic:cmsSupportTopics[0].name;document.getElementById(p+'Title').value=x?x.title:'';document.getElementById(p+'Content').innerHTML=x?x.content:'';document.getElementById(p+'Keywords').value=x?x.keywords:'';document.getElementById(p+'Priority').value=x?x.priority:1;document.getElementById(p+'Status').checked=!x||x.status==='Hoạt động';document.getElementById('supportArticleRelatedSearch').value='';Array.from(document.getElementById(p+'Related').options).forEach(function(o){o.selected=!!(x&&x.related.indexOf(o.value)>=0)});cmsSupportRenderRelated();showScreen('support-faq-article-form')}else if(type==='template'){document.getElementById(p+'Event').value=x?x.event:'Đăng nhập hàng ngày';document.getElementById(p+'Title').value=x?x.title:'';document.getElementById(p+'Content').value=x?x.content:'';document.getElementById(p+'Status').checked=!x||x.status==='Hoạt động';document.querySelectorAll('#screen-support-notification-template-form .support-channel input').forEach(function(c){c.checked=x&&x.channels.indexOf(c.value)>=0});showScreen('support-notification-template-form')}else{document.getElementById(p+'Title').value=x?x.title:'';document.getElementById(p+'Content').value=x?x.content:'';document.getElementById(p+'Type').value=x?x.type:'Giao dịch';document.getElementById(p+'Recipient').value=x?x.recipient:'Tất cả';document.getElementById(p+'Tier').value=x&&x.recipient==='Theo hạng'?(x.recipientDetail||'Đồng'):'Đồng';document.getElementById(p+'Group').value=x&&x.recipient==='Theo nhóm tài khoản'?(x.recipientDetail||'Khách hàng mới'):'Khách hàng mới';document.getElementById(p+'File').value='';var fileName=document.getElementById(p+'FileName');if(fileName)fileName.textContent=x&&x.recipient==='Danh sách tài khoản'?(x.recipientDetail||'Chưa chọn file'):'Chưa chọn file';document.getElementById(p+'SendTime').value=x?x.sendTime:'';document.querySelectorAll('#screen-support-notification-form .support-notification-channel input').forEach(function(c){c.checked=!!(x&&x.channels.indexOf(c.value)>=0)});cmsSupportRecipientChange();showScreen('support-notification-form')}}
function cmsSupportRecipientChange(){var v=(document.getElementById('supportNotificationRecipient')||{}).value;['Tier','File','Group'].forEach(function(k){var el=document.getElementById('supportNotification'+k+'Wrap');if(el)el.classList.add('hidden')});if(v!=='Theo hạng'){var tier=document.getElementById('supportNotificationTier');if(tier)tier.selectedIndex=0}if(v!=='Theo nhóm tài khoản'){var group=document.getElementById('supportNotificationGroup');if(group)group.selectedIndex=0}if(v!=='Danh sách tài khoản'){var file=document.getElementById('supportNotificationFile'),name=document.getElementById('supportNotificationFileName');if(file)file.value='';if(name)name.textContent='Chưa chọn file'}var map={'Theo hạng':'Tier','Danh sách tài khoản':'File','Theo nhóm tài khoản':'Group'};if(map[v])document.getElementById('supportNotification'+map[v]+'Wrap').classList.remove('hidden');}

function cmsSupportEditorCommand(command,value){var editor=document.getElementById('supportArticleContent');if(!editor)return;editor.focus();document.execCommand(command,false,value||null)}
function cmsSupportInsertLink(){var url=prompt('Nhập đường dẫn liên kết:','https://');if(url)cmsSupportEditorCommand('createLink',url)}
function cmsSupportInsertImage(input){var file=input&&input.files&&input.files[0];if(!file)return;if(!file.type.match(/^image\//)){alert('Vui lòng chọn file ảnh.');input.value='';return}var reader=new FileReader();reader.onload=function(e){cmsSupportEditorCommand('insertImage',e.target.result);input.value=''};reader.readAsDataURL(file)}
function cmsSupportRenderRelated(){var select=document.getElementById('supportArticleRelated'),list=document.getElementById('supportArticleRelatedList'),search=document.getElementById('supportArticleRelatedSearch');if(!select||!list)return;var q=((search||{}).value||'').trim().toLowerCase(),editId=(document.getElementById('supportArticleEditId')||{}).value||'',html='';Array.from(select.options).forEach(function(o){if(o.value===editId||q&&o.text.toLowerCase().indexOf(q)<0)return;html+='<label class="support-related-option"><input type="checkbox" value="'+cmsSupportEsc(o.value)+'" '+(o.selected?'checked':'')+' onchange="cmsSupportToggleRelated(this)"><span>'+cmsSupportEsc(o.text)+'</span></label>'});list.innerHTML=html||'<div class="support-related-empty">Không tìm thấy bài viết.</div>'}
function cmsSupportFilterRelated(){cmsSupportRenderRelated()}
function cmsSupportToggleRelated(input){var select=document.getElementById('supportArticleRelated');if(!select)return;var option=Array.from(select.options).find(function(o){return o.value===input.value});if(option)option.selected=input.checked}
function cmsSupportFileSelected(input){var name=document.getElementById('supportNotificationFileName');if(name)name.textContent=input.files&&input.files[0]?input.files[0].name:'Chưa chọn file'}

function cmsSupportResetForm(type){cmsSupportOpenForm(type);}
function cmsSupportNext(type){var a=cmsSupportData(type),prefix=type==='topic'?'FAQ-TOPIC-':type==='article'?'FAQ-ART-':type==='template'?'NTF-TPL-':'NTF-';return prefix+String(a.length+1).padStart(3,'0')}
function cmsSupportSave(type){var p=cmsSupportPrefix(type),id=document.getElementById(p+'EditId').value,x=id?cmsSupportData(type).find(function(v){return v.id===id}):null;if(type==='topic'){var name=document.getElementById(p+'Name').value.trim(),priority=Number(document.getElementById(p+'Priority').value);if(!name||!priority){alert('Vui lòng nhập đủ thông tin bắt buộc.');return}var obj={id:id||cmsSupportNext(type),name:name,priority:priority,status:document.getElementById(p+'Status').checked?'Hoạt động':'Tạm dừng'};if(x)Object.assign(x,obj);else cmsSupportTopics.unshift(obj);showScreen('support-faq-topic')}else if(type==='article'){var topic=document.getElementById(p+'Topic').value,title=document.getElementById(p+'Title').value.trim(),editor=document.getElementById(p+'Content'),content=editor.innerHTML.trim(),plain=editor.textContent.trim();if(!topic||!title||!plain){alert('Vui lòng nhập đủ thông tin bắt buộc.');return}var obj={id:id||cmsSupportNext(type),topic:topic,title:title,content:content,keywords:document.getElementById(p+'Keywords').value,related:Array.from(document.getElementById(p+'Related').selectedOptions).map(function(o){return o.value}),priority:Number(document.getElementById(p+'Priority').value)||1,status:document.getElementById(p+'Status').checked?'Hoạt động':'Tạm dừng'};if(x)Object.assign(x,obj);else cmsSupportArticles.unshift(obj);showScreen('support-faq-article')}else if(type==='template'){var event=document.getElementById(p+'Event').value,title=document.getElementById(p+'Title').value.trim(),content=document.getElementById(p+'Content').value.trim(),channels=Array.from(document.querySelectorAll('#screen-support-notification-template-form .support-channel input:checked')).map(function(c){return c.value});if(!event||!title||!content||!channels.length){alert('Vui lòng nhập đủ thông tin bắt buộc và chọn ít nhất một kênh gửi.');return}var obj={id:id||cmsSupportNext(type),event:event,title:title,content:content,channels:channels,status:document.getElementById(p+'Status').checked?'Hoạt động':'Tạm dừng'};if(x)Object.assign(x,obj);else cmsSupportTemplates.unshift(obj);showScreen('support-notification-template')}else{var title=document.getElementById(p+'Title').value.trim(),content=document.getElementById(p+'Content').value.trim(),kind=document.getElementById(p+'Type').value,recipient=document.getElementById(p+'Recipient').value,sendTime=document.getElementById(p+'SendTime').value,channels=Array.from(document.querySelectorAll('#screen-support-notification-form .support-notification-channel input:checked')).map(function(c){return c.value}),detail=recipient==='Theo hạng'?document.getElementById(p+'Tier').value:recipient==='Theo nhóm tài khoản'?document.getElementById(p+'Group').value:recipient==='Danh sách tài khoản'?(document.getElementById(p+'File').files[0]?document.getElementById(p+'File').files[0].name:(x?x.recipientDetail:'')):'Tất cả tài khoản';if(!title||!content||!kind||!recipient||!sendTime||!channels.length||(recipient==='Danh sách tài khoản'&&!detail)){alert('Vui lòng nhập đủ thông tin bắt buộc, chọn kênh gửi và khai báo đối tượng nhận.');return}var obj={id:id||cmsSupportNext(type),title:title,content:content,type:kind,recipient:recipient,recipientDetail:detail,sendTime:sendTime,channels:channels,updatedAt:new Date().toLocaleString('vi-VN',{hour12:false}),status:x?x.status:'Chờ gửi'};if(x)Object.assign(x,obj);else cmsSupportNotifications.unshift(obj);showScreen('support-notification')}cmsSupportRender(type);}
document.addEventListener('DOMContentLoaded',function(){cmsSupportSyncSelects();});


// Support > Quản trị giới hạn tính năng
var cmsSupportLimits=[
{id:'FEATURE-001',name:'Nạp Point',description:'Cho phép tài khoản nạp Point vào ví MyVTC.',requirement:'SĐT',audience:'Tất cả',audienceDetail:'Tất cả tài khoản',exception:'Nhóm tài khoản',exceptionDetail:'Tài khoản cần chăm sóc',status:'Hoạt động',updatedAt:'29/07/2026 18:20',updatedBy:'admin.hong'},
{id:'FEATURE-002',name:'Thanh toán dịch vụ',description:'Cho phép thanh toán các dịch vụ trong hệ sinh thái.',requirement:'eKYC',audience:'Theo hạng',audienceDetail:'Hạng Bạc trở lên',exception:'Danh sách tài khoản',exceptionDetail:'payment_exception.xlsx',status:'Hoạt động',updatedAt:'29/07/2026 17:35',updatedBy:'admin.payment'},
{id:'FEATURE-003',name:'Đổi Voucher',description:'Cho phép đổi Point lấy Voucher.',requirement:'SĐT',audience:'Theo hạng',audienceDetail:'Hạng Vàng',exception:'Theo hạng',exceptionDetail:'Hạng Kim Cương',status:'Hoạt động',updatedAt:'28/07/2026 16:10',updatedBy:'admin.loyalty'},
{id:'FEATURE-004',name:'Liên kết tài khoản mạng xã hội',description:'Cho phép liên kết Google, Facebook và Apple.',requirement:'None',audience:'Tất cả',audienceDetail:'Tất cả tài khoản',exception:'Không có',exceptionDetail:'Không có',status:'Tạm dừng',updatedAt:'27/07/2026 11:45',updatedBy:'admin.account'},
{id:'FEATURE-005',name:'Nhận ưu đãi hạng thành viên',description:'Cho phép nhận ưu đãi theo hạng.',requirement:'eKYC',audience:'Theo hạng',audienceDetail:'Hạng Bạc',exception:'Nhóm tài khoản',exceptionDetail:'Tài khoản cần chăm sóc',status:'Hoạt động',updatedAt:'26/07/2026 09:30',updatedBy:'admin.loyalty'},
{id:'FEATURE-006',name:'Chuyển Point',description:'Cho phép chuyển Point giữa các tài khoản.',requirement:'eKYC',audience:'Tất cả',audienceDetail:'Tất cả tài khoản',exception:'Danh sách tài khoản',exceptionDetail:'blocked_transfer.csv',status:'Tạm dừng',updatedAt:'25/07/2026 15:15',updatedBy:'admin.risk'}];
cmsSupportPage.limit=1;cmsSupportHidden.limit=new Set();
var _cmsSupportData=cmsSupportData,_cmsSupportPrefix=cmsSupportPrefix,_cmsSupportFiltered=cmsSupportFiltered,_cmsSupportRender=cmsSupportRender,_cmsSupportOpenForm=cmsSupportOpenForm,_cmsSupportSave=cmsSupportSave,_cmsSupportDelete=cmsSupportDelete,_cmsSupportToggleStatus=cmsSupportToggleStatus,_cmsSupportNext=cmsSupportNext;
cmsSupportData=function(type){return type==='limit'?cmsSupportLimits:_cmsSupportData(type)};
cmsSupportPrefix=function(type){return type==='limit'?'supportLimit':_cmsSupportPrefix(type)};
cmsSupportFiltered=function(type){if(type!=='limit')return _cmsSupportFiltered(type);var p='supportLimit',q=((document.getElementById(p+'Quick')||{}).value||'').toLowerCase(),name=((document.getElementById(p+'NameFilter')||{}).value||'').toLowerCase(),req=(document.getElementById(p+'RequirementFilter')||{}).value||'',aud=(document.getElementById(p+'AudienceFilter')||{}).value||'',status=(document.getElementById(p+'StatusFilter')||{}).value||'';return cmsSupportLimits.filter(function(x){return(!name||x.name.toLowerCase().indexOf(name)>=0)&&(!req||x.requirement===req)&&(!aud||x.audience===aud)&&(!status||x.status===status)&&(!q||JSON.stringify(x).toLowerCase().indexOf(q)>=0)})};
cmsSupportRender=function(type){if(type!=='limit')return _cmsSupportRender(type);var list=cmsSupportFiltered(type),pages=Math.max(1,Math.ceil(list.length/cmsSupportSize));cmsSupportPage.limit=Math.min(cmsSupportPage.limit,pages);var start=(cmsSupportPage.limit-1)*cmsSupportSize,rows=list.slice(start,start+cmsSupportSize),html='';rows.forEach(function(x,i){var actions='<button class="icon-square orange" title="Cập nhật" onclick="cmsSupportOpenForm(\'limit\',\''+x.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="Bật/Tắt trạng thái" onclick="cmsSupportToggleStatus(\'limit\',\''+x.id+'\')"><i class="fa '+(x.status==='Hoạt động'?'fa-pause':'fa-play')+'"></i></button><button class="icon-square red" title="Xóa" onclick="cmsSupportDelete(\'limit\',\''+x.id+'\')"><i class="fa fa-trash"></i></button>';html+='<tr><td>'+(start+i+1)+'</td><td>'+cmsSupportEsc(x.id)+'</td><td>'+cmsSupportEsc(x.name)+'</td><td>'+cmsSupportEsc(x.requirement)+'</td><td>'+cmsSupportEsc(x.audienceDetail)+'</td><td>'+cmsSupportEsc(x.exceptionDetail)+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+cmsSupportEsc(x.updatedAt)+'</td><td>'+cmsSupportEsc(x.updatedBy)+'</td><td>'+actions+'</td></tr>'});document.getElementById('supportLimitRows').innerHTML=html||'<tr><td colspan="10" class="empty-cell">Không có dữ liệu phù hợp.</td></tr>';document.getElementById('supportLimitCount').textContent=list.length?'Hiển thị '+(start+1)+' đến '+Math.min(start+rows.length,list.length)+' trong '+list.length+' bản ghi':'0 bản ghi';var ph='<button '+(cmsSupportPage.limit===1?'disabled':'')+' onclick="cmsSupportSetPage(\'limit\','+(cmsSupportPage.limit-1)+')">‹</button>';for(var n=1;n<=pages;n++)ph+='<button class="'+(n===cmsSupportPage.limit?'active':'')+'" onclick="cmsSupportSetPage(\'limit\','+n+')">'+n+'</button>';ph+='<button '+(cmsSupportPage.limit===pages?'disabled':'')+' onclick="cmsSupportSetPage(\'limit\','+(cmsSupportPage.limit+1)+')">›</button>';document.getElementById('supportLimitPager').innerHTML=ph;cmsSupportApplyColumns(type)};
cmsSupportOpenForm=function(type,id){if(type!=='limit')return _cmsSupportOpenForm(type,id);var x=id?cmsSupportLimits.find(function(v){return v.id===id}):null;document.getElementById('supportLimitEditId').value=x?x.id:'';document.getElementById('supportLimitFormTitle').textContent=x?'Cập nhật':'Thêm mới';document.getElementById('supportLimitName').value=x?x.name:'';document.getElementById('supportLimitDescription').value=x?x.description:'';document.getElementById('supportLimitRequirement').value=x?x.requirement:'None';document.getElementById('supportLimitAudience').value=x?x.audience:'Tất cả';document.getElementById('supportLimitAudienceTier').value=x&&x.audience==='Theo hạng'?x.audienceDetail.replace('Hạng ','').replace(' trở lên',''):'Đồng';document.getElementById('supportLimitException').value=x?x.exception:'Không có';document.getElementById('supportLimitExceptionTier').value=x&&x.exception==='Theo hạng'?x.exceptionDetail.replace('Hạng ',''):'Đồng';document.getElementById('supportLimitExceptionGroup').value=x&&x.exception==='Nhóm tài khoản'?x.exceptionDetail:'Khách hàng mới';document.getElementById('supportLimitExceptionFile').value='';document.getElementById('supportLimitExceptionFileName').textContent=x&&x.exception==='Danh sách tài khoản'?x.exceptionDetail:'Chưa chọn file';document.getElementById('supportLimitStatus').checked=!x||x.status==='Hoạt động';cmsSupportLimitAudienceChange();cmsSupportLimitExceptionChange();showScreen('support-feature-limit-form')};
cmsSupportLimitAudienceChange=function(){var v=document.getElementById('supportLimitAudience').value;document.getElementById('supportLimitAudienceTierWrap').classList.toggle('hidden',v!=='Theo hạng')};
cmsSupportLimitExceptionChange=function(){var v=document.getElementById('supportLimitException');['Tier','File','Group'].forEach(function(k){document.getElementById('supportLimitException'+k+'Wrap').classList.add('hidden')});var map={'Theo hạng':'Tier','Danh sách tài khoản':'File','Nhóm tài khoản':'Group'};if(map[v.value])document.getElementById('supportLimitException'+map[v.value]+'Wrap').classList.remove('hidden')};
cmsSupportLimitFileSelected=function(input){document.getElementById('supportLimitExceptionFileName').textContent=input.files&&input.files[0]?input.files[0].name:'Chưa chọn file'};
cmsSupportToggleStatus=function(type,id){if(type!=='limit')return _cmsSupportToggleStatus(type,id);var x=cmsSupportLimits.find(function(v){return v.id===id});if(!x)return;var next=x.status==='Hoạt động'?'Tạm dừng':'Hoạt động';if(confirm('Bạn có chắc chắn muốn '+(next==='Hoạt động'?'bật':'tắt')+' trạng thái chức năng này?')){x.status=next;x.updatedAt=new Date().toLocaleString('vi-VN',{hour12:false});x.updatedBy='admin.hong';cmsSupportRender('limit')}};
cmsSupportDelete=function(type,id){if(type!=='limit')return _cmsSupportDelete(type,id);if(!confirm('Bạn có chắc chắn muốn xóa bản ghi này?'))return;cmsSupportLimits=cmsSupportLimits.filter(function(x){return x.id!==id});cmsSupportRender('limit')};
cmsSupportNext=function(type){if(type!=='limit')return _cmsSupportNext(type);return 'FEATURE-'+String(cmsSupportLimits.length+1).padStart(3,'0')};
cmsSupportSave=function(type){if(type!=='limit')return _cmsSupportSave(type);var id=document.getElementById('supportLimitEditId').value,x=id?cmsSupportLimits.find(function(v){return v.id===id}):null,name=document.getElementById('supportLimitName').value.trim(),description=document.getElementById('supportLimitDescription').value.trim(),requirement=document.getElementById('supportLimitRequirement').value,audience=document.getElementById('supportLimitAudience').value,audienceDetail=audience==='Theo hạng'?'Hạng '+document.getElementById('supportLimitAudienceTier').value:'Tất cả tài khoản',exception=document.getElementById('supportLimitException').value,exceptionDetail='Không có';if(exception==='Theo hạng')exceptionDetail='Hạng '+document.getElementById('supportLimitExceptionTier').value;else if(exception==='Nhóm tài khoản')exceptionDetail=document.getElementById('supportLimitExceptionGroup').value;else if(exception==='Danh sách tài khoản')exceptionDetail=document.getElementById('supportLimitExceptionFile').files[0]?document.getElementById('supportLimitExceptionFile').files[0].name:(x?x.exceptionDetail:'');if(!name||!requirement||!audience||(exception==='Danh sách tài khoản'&&!exceptionDetail)){alert('Vui lòng nhập đủ thông tin bắt buộc.');return}var obj={id:id||cmsSupportNext(type),name:name,description:description,requirement:requirement,audience:audience,audienceDetail:audienceDetail,exception:exception,exceptionDetail:exceptionDetail,status:document.getElementById('supportLimitStatus').checked?'Hoạt động':'Tạm dừng',updatedAt:new Date().toLocaleString('vi-VN',{hour12:false}),updatedBy:'admin.hong'};if(x)Object.assign(x,obj);else cmsSupportLimits.unshift(obj);showScreen('support-feature-limit');cmsSupportRender('limit')};



/* Support > Quản lý thời gian truy cập */
var cmsSupportAccessTimes=[
{id:'ACCESS-001',audience:'Hệ thống',partner:'VTC Game',product:'Silkroad Origin VTC',perGame:180,total:300,rest:30,warning:80,reset:'00:00',exception:'Theo hạng',exceptionDetail:'Hạng Đồng',group:'',start:'2026-07-01T00:00',end:'2026-12-31T23:59',status:'Hoạt động'},
{id:'ACCESS-002',audience:'Tài khoản',partner:'VTC Game',product:'Football Pro VTC',perGame:120,total:240,rest:20,warning:75,reset:'05:00',exception:'Nhóm tài khoản',exceptionDetail:'Khách hàng VIP',group:'Khách hàng VIP',start:'2026-07-15T08:00',end:'2026-10-31T23:59',status:'Hoạt động'},
{id:'ACCESS-003',audience:'Hệ thống',partner:'VTC Mobile',product:'Audition',perGame:90,total:180,rest:15,warning:85,reset:'00:00',exception:'Danh sách tài khoản',exceptionDetail:'access_exception.xlsx',group:'',start:'2026-08-01T00:00',end:'2026-09-30T23:59',status:'Tạm dừng'}
];
cmsSupportPage.accessTime=1;cmsSupportHidden.accessTime=new Set();
var _cmsSupportPrefixAccess=cmsSupportPrefix,_cmsSupportFilteredAccess=cmsSupportFiltered,_cmsSupportRenderAccess=cmsSupportRender,_cmsSupportOpenFormAccess=cmsSupportOpenForm,_cmsSupportSaveAccess=cmsSupportSave,_cmsSupportDeleteAccess=cmsSupportDelete,_cmsSupportToggleStatusAccess=cmsSupportToggleStatus,_cmsSupportNextAccess=cmsSupportNext,_cmsSupportResetFormAccess=cmsSupportResetForm;
cmsSupportPrefix=function(type){return type==='accessTime'?'supportAccessTime':_cmsSupportPrefixAccess(type)};
cmsSupportFiltered=function(type){if(type!=='accessTime')return _cmsSupportFilteredAccess(type);var q=(document.getElementById('supportAccessTimeQuick').value||'').toLowerCase(),aud=document.getElementById('supportAccessTimeAudienceFilter').value,partner=document.getElementById('supportAccessTimePartnerFilter').value,product=document.getElementById('supportAccessTimeProductFilter').value,group=document.getElementById('supportAccessTimeGroupFilter').value,status=document.getElementById('supportAccessTimeStatusFilter').value;return cmsSupportAccessTimes.filter(function(x){return(!aud||x.audience===aud)&&(!partner||x.partner===partner)&&(!product||x.product===product)&&(!group||x.group===group||x.exceptionDetail===group)&&(!status||x.status===status)&&(!q||JSON.stringify(x).toLowerCase().indexOf(q)>=0)})};
cmsSupportFormatAccessDate=function(v){if(!v)return'';var d=new Date(v);return isNaN(d)?v:d.toLocaleString('vi-VN',{hour12:false})};
cmsSupportRender=function(type){if(type!=='accessTime')return _cmsSupportRenderAccess(type);var list=cmsSupportFiltered(type),pages=Math.max(1,Math.ceil(list.length/cmsSupportSize));cmsSupportPage.accessTime=Math.min(cmsSupportPage.accessTime,pages);var start=(cmsSupportPage.accessTime-1)*cmsSupportSize,rows=list.slice(start,start+cmsSupportSize),html='';rows.forEach(function(x,i){var actions='<button class="icon-square orange" title="Cập nhật" onclick="cmsSupportOpenForm(\'accessTime\',\''+x.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="Bật/Tắt trạng thái" onclick="cmsSupportToggleStatus(\'accessTime\',\''+x.id+'\')"><i class="fa '+(x.status==='Hoạt động'?'fa-pause':'fa-play')+'"></i></button><button class="icon-square red" title="Xóa" onclick="cmsSupportDelete(\'accessTime\',\''+x.id+'\')"><i class="fa fa-trash"></i></button>';html+='<tr><td>'+(start+i+1)+'</td><td>'+cmsSupportEsc(x.audience)+'</td><td>'+cmsSupportEsc(x.partner)+'</td><td>'+cmsSupportEsc(x.product)+'</td><td>'+x.perGame+'</td><td>'+x.total+'</td><td>'+x.rest+'</td><td>'+x.warning+'</td><td>'+cmsSupportEsc(x.reset)+'</td><td>'+cmsSupportEsc(x.exceptionDetail)+'</td><td>'+cmsSupportFormatAccessDate(x.start)+'</td><td>'+cmsSupportFormatAccessDate(x.end)+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+actions+'</td></tr>'});document.getElementById('supportAccessTimeRows').innerHTML=html||'<tr><td colspan="14" class="empty-cell">Không có dữ liệu phù hợp.</td></tr>';document.getElementById('supportAccessTimeCount').textContent=list.length?'Hiển thị '+(start+1)+' đến '+Math.min(start+rows.length,list.length)+' trong '+list.length+' bản ghi':'0 bản ghi';var ph='<button '+(cmsSupportPage.accessTime===1?'disabled':'')+' onclick="cmsSupportSetPage(\'accessTime\','+(cmsSupportPage.accessTime-1)+')">‹</button>';for(var n=1;n<=pages;n++)ph+='<button class="'+(n===cmsSupportPage.accessTime?'active':'')+'" onclick="cmsSupportSetPage(\'accessTime\','+n+')">'+n+'</button>';ph+='<button '+(cmsSupportPage.accessTime===pages?'disabled':'')+' onclick="cmsSupportSetPage(\'accessTime\','+(cmsSupportPage.accessTime+1)+')">›</button>';document.getElementById('supportAccessTimePager').innerHTML=ph;cmsSupportApplyColumns(type)};
cmsSupportAccessTimeExceptionChange=function(){var v=document.getElementById('supportAccessTimeException').value;['File','Tier','Group'].forEach(function(k){document.getElementById('supportAccessTimeException'+k+'Wrap').classList.add('hidden')});var map={'Danh sách tài khoản':'File','Theo hạng':'Tier','Nhóm tài khoản':'Group'};document.getElementById('supportAccessTimeException'+map[v]+'Wrap').classList.remove('hidden')};
cmsSupportAccessTimeFileSelected=function(input){document.getElementById('supportAccessTimeExceptionFileName').textContent=input.files&&input.files[0]?input.files[0].name:'Chưa chọn file'};
cmsSupportOpenForm=function(type,id){if(type!=='accessTime')return _cmsSupportOpenFormAccess(type,id);var x=id?cmsSupportAccessTimes.find(function(v){return v.id===id}):null;document.getElementById('supportAccessTimeEditId').value=x?x.id:'';document.getElementById('supportAccessTimeFormTitle').textContent=x?'Cập nhật':'Thêm mới';document.getElementById('supportAccessTimeAudience').value=x?x.audience:'Hệ thống';document.getElementById('supportAccessTimePartner').value=x?x.partner:'VTC Game';document.getElementById('supportAccessTimeProduct').value=x?x.product:'Silkroad Origin VTC';document.getElementById('supportAccessTimePerGame').value=x?x.perGame:180;document.getElementById('supportAccessTimeTotal').value=x?x.total:300;document.getElementById('supportAccessTimeRest').value=x?x.rest:30;document.getElementById('supportAccessTimeWarning').value=x?x.warning:80;document.getElementById('supportAccessTimeReset').value=x?x.reset:'00:00';document.getElementById('supportAccessTimeException').value=x?x.exception:'Danh sách tài khoản';document.getElementById('supportAccessTimeExceptionTier').value=x&&x.exception==='Theo hạng'?x.exceptionDetail.replace('Hạng ',''):'Đồng';document.getElementById('supportAccessTimeExceptionGroup').value=x&&x.exception==='Nhóm tài khoản'?x.exceptionDetail:'Khách hàng mới';document.getElementById('supportAccessTimeExceptionFile').value='';document.getElementById('supportAccessTimeExceptionFileName').textContent=x&&x.exception==='Danh sách tài khoản'?x.exceptionDetail:'Chưa chọn file';document.getElementById('supportAccessTimeStart').value=x?x.start:'2026-07-29T00:00';document.getElementById('supportAccessTimeEnd').value=x?x.end:'2026-12-31T23:59';document.getElementById('supportAccessTimeStatus').checked=!x||x.status==='Hoạt động';cmsSupportAccessTimeExceptionChange();showScreen('support-access-time-form')};
cmsSupportSave=function(type){if(type!=='accessTime')return _cmsSupportSaveAccess(type);var id=document.getElementById('supportAccessTimeEditId').value,x=id?cmsSupportAccessTimes.find(function(v){return v.id===id}):null,exception=document.getElementById('supportAccessTimeException').value,detail='',group='';if(exception==='Theo hạng')detail='Hạng '+document.getElementById('supportAccessTimeExceptionTier').value;else if(exception==='Nhóm tài khoản'){detail=document.getElementById('supportAccessTimeExceptionGroup').value;group=detail}else detail=document.getElementById('supportAccessTimeExceptionFile').files[0]?document.getElementById('supportAccessTimeExceptionFile').files[0].name:(x?x.exceptionDetail:'');var obj={id:id||cmsSupportNext(type),audience:document.getElementById('supportAccessTimeAudience').value,partner:document.getElementById('supportAccessTimePartner').value,product:document.getElementById('supportAccessTimeProduct').value,perGame:Number(document.getElementById('supportAccessTimePerGame').value),total:Number(document.getElementById('supportAccessTimeTotal').value),rest:Number(document.getElementById('supportAccessTimeRest').value),warning:Number(document.getElementById('supportAccessTimeWarning').value),reset:document.getElementById('supportAccessTimeReset').value,exception:exception,exceptionDetail:detail,group:group,start:document.getElementById('supportAccessTimeStart').value,end:document.getElementById('supportAccessTimeEnd').value,status:document.getElementById('supportAccessTimeStatus').checked?'Hoạt động':'Tạm dừng'};if(!obj.audience||!obj.partner||!obj.product||!obj.perGame||!obj.total||obj.rest<0||!obj.warning||!obj.reset||!obj.start||!obj.end||(exception==='Danh sách tài khoản'&&!detail)){alert('Vui lòng nhập đủ thông tin bắt buộc.');return}if(new Date(obj.start)>=new Date(obj.end)){alert('Thời gian kết thúc phải lớn hơn thời gian bắt đầu.');return}if(x)Object.assign(x,obj);else cmsSupportAccessTimes.unshift(obj);showScreen('support-access-time');cmsSupportRender('accessTime')};
cmsSupportDelete=function(type,id){if(type!=='accessTime')return _cmsSupportDeleteAccess(type,id);if(!confirm('Bạn có chắc chắn muốn xóa bản ghi này?'))return;cmsSupportAccessTimes=cmsSupportAccessTimes.filter(function(x){return x.id!==id});cmsSupportRender(type)};
cmsSupportToggleStatus=function(type,id){if(type!=='accessTime')return _cmsSupportToggleStatusAccess(type,id);var x=cmsSupportAccessTimes.find(function(v){return v.id===id});if(x&&confirm('Bạn có chắc chắn muốn '+(x.status==='Hoạt động'?'tắt':'bật')+' trạng thái bản ghi này?')){x.status=x.status==='Hoạt động'?'Tạm dừng':'Hoạt động';cmsSupportRender(type)}};
cmsSupportNext=function(type){if(type!=='accessTime')return _cmsSupportNextAccess(type);return 'ACCESS-'+String(cmsSupportAccessTimes.length+1).padStart(3,'0')};
cmsSupportResetForm=function(type){if(type!=='accessTime')return _cmsSupportResetFormAccess(type);cmsSupportOpenForm(type)};


/* Support > Quản lý Banner */
var cmsSupportBanners=[
 {id:'BN001',name:'Hệ sinh thái dịch vụ VTC',page:'Trang chủ',position:'Header',order:1,type:'Banner chính',titleVi:'Hệ sinh thái dịch vụ VTC',buttonVi:'Khám phá ngay',titleEn:'VTC Service Ecosystem',buttonEn:'Explore now',link:'https://vtc.vn',imageName:'banner-home-main.jpg',imageData:'',visible:true,updatedAt:'29/07/2026 16:20:12',updatedBy:'admin.hong'},
 {id:'BN002',name:'Ưu đãi nạp Point tháng 7',page:'Cửa hàng',position:'Body',order:2,type:'Banner phụ',titleVi:'Ưu đãi nạp Point',buttonVi:'Nạp ngay',titleEn:'Point Top-up Offer',buttonEn:'Top up now',link:'https://vtc.vn/topup',imageName:'banner-shop-promo.jpg',imageData:'',visible:true,updatedAt:'28/07/2026 10:05:40',updatedBy:'admin.lan'},
 {id:'BN003',name:'Dịch vụ nổi bật',page:'Dịch vụ',position:'Body',order:1,type:'Banner chính',titleVi:'Dịch vụ nổi bật',buttonVi:'Xem dịch vụ',titleEn:'Featured Services',buttonEn:'View services',link:'https://vtc.vn/services',imageName:'banner-service-main.jpg',imageData:'',visible:false,updatedAt:'25/07/2026 09:18:22',updatedBy:'admin.hong'},
 {id:'BN004',name:'Tải ứng dụng MyVTC',page:'Trang chủ',position:'Footer',order:3,type:'Banner phụ',titleVi:'Tải ứng dụng MyVTC',buttonVi:'Tải ngay',titleEn:'Download MyVTC App',buttonEn:'Download',link:'https://vtc.vn/app',imageName:'banner-app-footer.jpg',imageData:'',visible:true,updatedAt:'22/07/2026 14:42:08',updatedBy:'admin.minh'},
 {id:'BN005',name:'Quà tặng thành viên mới',page:'Cửa hàng',position:'Header',order:1,type:'Banner chính',titleVi:'Quà tặng thành viên mới',buttonVi:'Nhận quà',titleEn:'New Member Gifts',buttonEn:'Claim now',link:'https://vtc.vn/gifts',imageName:'banner-new-member.jpg',imageData:'',visible:true,updatedAt:'20/07/2026 11:30:15',updatedBy:'admin.hong'},
 {id:'BN006',name:'Hỗ trợ dịch vụ 24/7',page:'Dịch vụ',position:'Footer',order:4,type:'Banner phụ',titleVi:'Hỗ trợ dịch vụ 24/7',buttonVi:'Liên hệ',titleEn:'24/7 Service Support',buttonEn:'Contact us',link:'https://vtc.vn/support',imageName:'banner-support.jpg',imageData:'',visible:true,updatedAt:'18/07/2026 08:12:31',updatedBy:'admin.lan'},
 {id:'BN007',name:'Sự kiện mùa hè',page:'Trang chủ',position:'Body',order:2,type:'Banner phụ',titleVi:'Sự kiện mùa hè',buttonVi:'Tham gia',titleEn:'Summer Event',buttonEn:'Join now',link:'https://vtc.vn/event',imageName:'banner-summer.jpg',imageData:'',visible:false,updatedAt:'15/07/2026 17:01:09',updatedBy:'admin.minh'}
];
var cmsSupportBannerState={page:1,size:5,hiddenColumns:new Set()};
function cmsSupportBannerEsc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function cmsSupportBannerFiltered(){var type=(document.getElementById('supportBannerTypeFilter')||{}).value||'',page=(document.getElementById('supportBannerPageFilter')||{}).value||'',position=(document.getElementById('supportBannerPositionFilter')||{}).value||'',q=((document.getElementById('supportBannerQuick')||{}).value||'').trim().toLowerCase();return cmsSupportBanners.filter(function(x){return(!type||x.type===type)&&(!page||x.page===page)&&(!position||x.position===position)&&(!q||JSON.stringify(x).toLowerCase().indexOf(q)>=0)})}
function cmsSupportBannerSearch(){cmsSupportBannerState.page=1;cmsSupportBannerRender()}
function cmsSupportBannerRender(){var body=document.getElementById('supportBannerRows');if(!body)return;var list=cmsSupportBannerFiltered(),pages=Math.max(1,Math.ceil(list.length/cmsSupportBannerState.size));cmsSupportBannerState.page=Math.min(cmsSupportBannerState.page,pages);var start=(cmsSupportBannerState.page-1)*cmsSupportBannerState.size,rows=list.slice(start,start+cmsSupportBannerState.size);body.innerHTML=rows.map(function(x,i){var toggleTitle=x.visible?'Tắt hiển thị':'Bật hiển thị',toggleIcon=x.visible?'fa-eye-slash':'fa-eye';return '<tr class="'+(x.visible?'':'support-banner-hidden-row')+'"><td>'+(start+i+1)+'</td><td class="text-left">'+cmsSupportBannerEsc(x.name)+'</td><td>'+cmsSupportBannerEsc(x.page)+'</td><td>'+cmsSupportBannerEsc(x.position)+'</td><td>'+x.order+'</td><td>'+cmsSupportBannerEsc(x.type)+'</td><td><span class="support-status">'+(x.visible?'Hoạt động':'Không hoạt động')+'</span></td><td>'+cmsSupportBannerEsc(x.updatedAt)+'</td><td>'+cmsSupportBannerEsc(x.updatedBy)+'</td><td class="action-cell"><button class="icon-square orange" title="Cập nhật" onclick="cmsSupportBannerOpenForm(\''+x.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="'+toggleTitle+'" onclick="cmsSupportBannerToggleVisible(\''+x.id+'\')"><i class="fa '+toggleIcon+'"></i></button><button class="icon-square red" title="Xóa" onclick="cmsSupportBannerDelete(\''+x.id+'\')"><i class="fa fa-trash"></i></button></td></tr>'}).join('')||'<tr><td colspan="10" class="empty-cell">Không có dữ liệu phù hợp.</td></tr>';document.getElementById('supportBannerCount').textContent=list.length?'Hiển thị '+(start+1)+' đến '+Math.min(start+rows.length,list.length)+' trong '+list.length+' bản ghi':'0 bản ghi';var p='<button '+(cmsSupportBannerState.page===1?'disabled':'')+' onclick="cmsSupportBannerSetPage('+(cmsSupportBannerState.page-1)+')">‹</button>';for(var n=1;n<=pages;n++)p+='<button class="'+(n===cmsSupportBannerState.page?'active':'')+'" onclick="cmsSupportBannerSetPage('+n+')">'+n+'</button>';p+='<button '+(cmsSupportBannerState.page===pages?'disabled':'')+' onclick="cmsSupportBannerSetPage('+(cmsSupportBannerState.page+1)+')">›</button>';document.getElementById('supportBannerPager').innerHTML=p;cmsSupportBannerApplyColumns()}
function cmsSupportBannerSetPage(p){if(p<1)return;cmsSupportBannerState.page=p;cmsSupportBannerRender()}
function cmsSupportBannerOpenForm(id){var x=id?cmsSupportBanners.find(function(v){return v.id===id}):null;document.getElementById('supportBannerEditId').value=x?x.id:'';document.getElementById('supportBannerFormTitle').textContent=x?'Cập nhật':'Thêm mới';document.getElementById('supportBannerName').value=x?x.name:'';document.getElementById('supportBannerPage').value=x?x.page:'Trang chủ';document.getElementById('supportBannerPosition').value=x?x.position:'Header';document.getElementById('supportBannerOrder').value=x?x.order:1;document.getElementById('supportBannerType').value=x?x.type:'Banner chính';document.getElementById('supportBannerStatus').checked=x?x.visible:true;document.getElementById('supportBannerTitleVi').value=x?x.titleVi:'';document.getElementById('supportBannerButtonVi').value=x?x.buttonVi:'';document.getElementById('supportBannerTitleEn').value=x?x.titleEn:'';document.getElementById('supportBannerButtonEn').value=x?x.buttonEn:'';document.getElementById('supportBannerLink').value=x?x.link:'';document.getElementById('supportBannerImage').value='';document.getElementById('supportBannerImageName').textContent=x?x.imageName:'Chưa chọn ảnh';var preview=document.getElementById('supportBannerPreview');if(x&&x.imageData){preview.src=x.imageData;preview.classList.remove('hidden')}else{preview.removeAttribute('src');preview.classList.add('hidden')}showScreen('support-banner-form')}
function cmsSupportBannerResetForm(){cmsSupportBannerOpenForm(document.getElementById('supportBannerEditId').value||null)}
function cmsSupportBannerImageSelected(input){var file=input.files&&input.files[0],name=document.getElementById('supportBannerImageName'),preview=document.getElementById('supportBannerPreview');name.textContent=file?file.name:'Chưa chọn ảnh';if(!file){preview.classList.add('hidden');return}var reader=new FileReader();reader.onload=function(e){preview.src=e.target.result;preview.classList.remove('hidden')};reader.readAsDataURL(file)}
function cmsSupportBannerSave(){var id=document.getElementById('supportBannerEditId').value,x=id?cmsSupportBanners.find(function(v){return v.id===id}):null,file=document.getElementById('supportBannerImage').files[0],name=document.getElementById('supportBannerName').value.trim(),order=Number(document.getElementById('supportBannerOrder').value);if(!name||!document.getElementById('supportBannerPage').value||!document.getElementById('supportBannerPosition').value||!order||!document.getElementById('supportBannerType').value||(!x&&!file)){alert('Vui lòng nhập đủ thông tin bắt buộc.');return}var save=function(imageData){var obj={id:id||'BN'+String(Date.now()).slice(-6),name:name,page:document.getElementById('supportBannerPage').value,position:document.getElementById('supportBannerPosition').value,order:order,type:document.getElementById('supportBannerType').value,titleVi:document.getElementById('supportBannerTitleVi').value.trim(),buttonVi:document.getElementById('supportBannerButtonVi').value.trim(),titleEn:document.getElementById('supportBannerTitleEn').value.trim(),buttonEn:document.getElementById('supportBannerButtonEn').value.trim(),link:document.getElementById('supportBannerLink').value.trim(),imageName:file?file.name:(x?x.imageName:''),imageData:imageData!==undefined?imageData:(x?x.imageData:''),visible:document.getElementById('supportBannerStatus').checked,updatedAt:new Date().toLocaleString('vi-VN',{hour12:false}),updatedBy:'admin.hong'};if(x)Object.assign(x,obj);else cmsSupportBanners.unshift(obj);showScreen('support-banner');cmsSupportBannerRender()};if(file){var reader=new FileReader();reader.onload=function(e){save(e.target.result)};reader.readAsDataURL(file)}else save()}
function cmsSupportBannerToggleVisible(id){var x=cmsSupportBanners.find(function(v){return v.id===id});if(!x)return;if(confirm('Bạn xác nhận '+(x.visible?'tắt':'bật')+' hiển thị Banner này?')){x.visible=!x.visible;x.updatedAt=new Date().toLocaleString('vi-VN',{hour12:false});x.updatedBy='admin.hong';cmsSupportBannerRender()}}
function cmsSupportBannerDelete(id){var x=cmsSupportBanners.find(function(v){return v.id===id});if(x&&confirm('Bạn xác nhận xóa Banner "'+x.name+'"?')){cmsSupportBanners=cmsSupportBanners.filter(function(v){return v.id!==id});cmsSupportBannerRender()}}
function cmsSupportBannerApplyColumns(){var table=document.getElementById('supportBannerTable');if(!table)return;Array.from(table.rows).forEach(function(row){Array.from(row.cells).forEach(function(cell,i){cell.style.display=cmsSupportBannerState.hiddenColumns.has(i)?'none':''})})}
function cmsSupportBannerToggleColumns(btn){var old=document.getElementById('supportBannerColumnPicker');if(old){old.remove();return}var panel=document.createElement('div');panel.id='supportBannerColumnPicker';panel.className='column-picker show';document.querySelectorAll('#supportBannerTable thead th').forEach(function(th,i){if(i===9)return;var label=document.createElement('label'),box=document.createElement('input');box.type='checkbox';box.checked=!cmsSupportBannerState.hiddenColumns.has(i);box.onchange=function(){if(box.checked)cmsSupportBannerState.hiddenColumns.delete(i);else cmsSupportBannerState.hiddenColumns.add(i);cmsSupportBannerApplyColumns()};label.append(box,document.createTextNode(th.textContent.trim()));panel.append(label)});document.body.append(panel);var r=btn.getBoundingClientRect();panel.style.left=Math.max(8,r.left)+'px';panel.style.top=(r.bottom+6)+'px';setTimeout(function(){document.addEventListener('click',function close(e){if(!panel.contains(e.target)&&e.target!==btn){panel.remove();document.removeEventListener('click',close)}},0)},0)}
document.addEventListener('DOMContentLoaded',cmsSupportBannerRender);

/* Support: Mẫu thông báo hệ thống, Thông báo Marketing, Quản lý email */
(function(){
  cmsSupportTemplates.forEach(function(x,i){
    x.event=(x.event||'').replace('Xác minh','Xác thực');
    x.channels=i%2===0?['Website','Mobile App']:['Website'];
    x.navigation=x.navigation||(['Lịch sử giao dịch','Xác thực email','Xác thực Số điện thoại','Xác thực CCCD','Cài đặt bảo mật'][i%5]);
    x.content=x.content||'Xin chào @username.';
  });
  cmsSupportNotifications.forEach(function(x,i){
    x.channels=i%2===0?['Website','Mobile App']:['Mobile App'];
    x.navigation=x.navigation||(['Lịch sử giao dịch','Xác thực email','Xác thực Số điện thoại','Xác thực CCCD','Cài đặt bảo mật'][i%5]);
    x.htmlContent=x.htmlContent||'<p>'+cmsSupportEsc(x.content||'')+'</p>';
    x.bannerName=x.bannerName||'';
    x.bannerData=x.bannerData||'';
  });

  var _supportRenderFinal=cmsSupportRender,
      _supportOpenFormFinal=cmsSupportOpenForm,
      _supportSaveFinal=cmsSupportSave,
      _supportNextFinal=cmsSupportNext;

  function supportCustomFiltered(type){
    var p=type==='template'?'supportTemplate':'supportNotification';
    var q=((document.getElementById(p+'Quick')||{}).value||'').toLowerCase();
    if(type==='template'){
      var title=((document.getElementById(p+'TitleFilter')||{}).value||'').toLowerCase();
      var task=(document.getElementById(p+'EventFilter')||{}).value||'';
      var status=(document.getElementById(p+'StatusFilter')||{}).value||'';
      return cmsSupportTemplates.filter(function(x){return(!title||x.title.toLowerCase().indexOf(title)>=0)&&(!task||x.event===task)&&(!status||x.status===status)&&(!q||JSON.stringify(x).toLowerCase().indexOf(q)>=0)});
    }
    var from=(document.getElementById(p+'FromFilter')||{}).value||'';
    var to=(document.getElementById(p+'ToFilter')||{}).value||'';
    var ntitle=((document.getElementById(p+'TitleFilter')||{}).value||'').toLowerCase();
    var channel=(document.getElementById(p+'ChannelFilter')||{}).value||'';
    var nstatus=(document.getElementById(p+'StatusFilter')||{}).value||'';
    return cmsSupportNotifications.filter(function(x){return(!from||x.sendTime>=from)&&(!to||x.sendTime<=to)&&(!ntitle||x.title.toLowerCase().indexOf(ntitle)>=0)&&(!channel||x.channels.indexOf(channel)>=0)&&(!nstatus||x.status===nstatus)&&(!q||JSON.stringify(x).toLowerCase().indexOf(q)>=0)});
  }

  cmsSupportRender=function(type){
    if(type!=='template'&&type!=='notification')return _supportRenderFinal(type);
    var p=type==='template'?'supportTemplate':'supportNotification', list=supportCustomFiltered(type), pages=Math.max(1,Math.ceil(list.length/cmsSupportSize));
    cmsSupportPage[type]=Math.min(Math.max(1,cmsSupportPage[type]||1),pages);
    var start=(cmsSupportPage[type]-1)*cmsSupportSize, rows=list.slice(start,start+cmsSupportSize), html='';
    rows.forEach(function(x,i){
      if(type==='template'){
        var actions='<button class="icon-square orange" title="Cập nhật" onclick="cmsSupportOpenForm(\'template\',\''+x.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="Bật/Tắt trạng thái" onclick="cmsSupportToggleStatus(\'template\',\''+x.id+'\')"><i class="fa '+(x.status==='Hoạt động'?'fa-pause':'fa-play')+'"></i></button><button class="icon-square red" title="Xóa" onclick="cmsSupportDelete(\'template\',\''+x.id+'\')"><i class="fa fa-trash"></i></button>';
        html+='<tr><td>'+(start+i+1)+'</td><td>'+cmsSupportEsc(x.id)+'</td><td>'+cmsSupportEsc(x.event)+'</td><td>'+cmsSupportEsc(x.title)+'</td><td>'+cmsSupportEsc(x.channels.join(', '))+'</td><td>'+cmsSupportEsc(x.navigation||'')+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+actions+'</td></tr>';
      }else{
        var nactions='<button class="icon-square orange" title="Cập nhật" onclick="cmsSupportOpenForm(\'notification\',\''+x.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="Hủy" '+(x.status!=='Chờ gửi'?'disabled':'')+' onclick="cmsSupportCancelNotification(\''+x.id+'\')"><i class="fa fa-ban"></i></button><button class="icon-square red" title="Xóa" onclick="cmsSupportDelete(\'notification\',\''+x.id+'\')"><i class="fa fa-trash"></i></button>';
        html+='<tr><td>'+(start+i+1)+'</td><td>'+cmsSupportFormatDate(x.sendTime)+'</td><td>'+cmsSupportEsc(x.title)+'</td><td>'+cmsSupportEsc(x.channels.join(', '))+'</td><td>'+cmsSupportEsc(x.recipientDetail||x.recipient)+'</td><td>'+cmsSupportEsc(x.navigation||'')+'</td><td>'+cmsSupportEsc(x.updatedAt)+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+nactions+'</td></tr>';
      }
    });
    var colspan=type==='template'?8:9;
    var body=document.getElementById(p+'Rows'); if(body)body.innerHTML=html||'<tr><td colspan="'+colspan+'" class="empty-cell">Không có dữ liệu phù hợp.</td></tr>';
    var count=document.getElementById(p+'Count'); if(count)count.textContent=list.length?'Hiển thị '+(start+1)+' đến '+Math.min(start+rows.length,list.length)+' trong '+list.length+' bản ghi':'0 bản ghi';
    var pager=document.getElementById(p+'Pager'); if(pager){var ph='<button '+(cmsSupportPage[type]===1?'disabled':'')+' onclick="cmsSupportSetPage(\''+type+'\','+(cmsSupportPage[type]-1)+')">‹</button>';for(var n=1;n<=pages;n++)ph+='<button class="'+(n===cmsSupportPage[type]?'active':'')+'" onclick="cmsSupportSetPage(\''+type+'\','+n+')">'+n+'</button>';ph+='<button '+(cmsSupportPage[type]===pages?'disabled':'')+' onclick="cmsSupportSetPage(\''+type+'\','+(cmsSupportPage[type]+1)+')">›</button>';pager.innerHTML=ph;}
    cmsSupportApplyColumns(type);
  };

  cmsSupportOpenForm=function(type,id){
    if(type!=='template'&&type!=='notification')return _supportOpenFormFinal(type,id);
    var x=id?(type==='template'?cmsSupportTemplates:cmsSupportNotifications).find(function(v){return v.id===id}):null;
    if(type==='template'){
      document.getElementById('supportTemplateEditId').value=x?x.id:'';
      document.getElementById('supportTemplateFormTitle').textContent=x?'Cập nhật':'Thêm mới';
      document.getElementById('supportTemplateEvent').value=x?x.event:'Đăng nhập hàng ngày';
      document.getElementById('supportTemplateTitle').value=x?x.title:'';
      document.getElementById('supportTemplateContent').value=x?x.content:'';
      document.getElementById('supportTemplateNavigation').value=x?x.navigation:'';
      document.getElementById('supportTemplateStatus').checked=!x||x.status==='Hoạt động';
      document.querySelectorAll('#screen-support-notification-template-form .support-channel input').forEach(function(c){c.checked=!!(x&&x.channels.indexOf(c.value)>=0)});
      showScreen('support-notification-template-form');return;
    }
    document.getElementById('supportNotificationEditId').value=x?x.id:'';
    document.getElementById('supportNotificationFormTitle').textContent=x?'Cập nhật':'Thêm mới';
    document.getElementById('supportNotificationTitle').value=x?x.title:'';
    document.getElementById('supportNotificationContent').value=x?x.content:'';
    document.getElementById('supportNotificationHtmlContent').innerHTML=x?x.htmlContent:'';
    document.getElementById('supportNotificationRecipient').value=x?x.recipient:'Tất cả';
    document.getElementById('supportNotificationTier').value=x&&x.recipient==='Theo hạng'?(x.recipientDetail||'Đồng'):'Đồng';
    document.getElementById('supportNotificationGroup').value=x&&x.recipient==='Theo nhóm tài khoản'?(x.recipientDetail||'Khách hàng mới'):'Khách hàng mới';
    document.getElementById('supportNotificationFile').value='';
    document.getElementById('supportNotificationFileName').textContent=x&&x.recipient==='Danh sách tài khoản'?(x.recipientDetail||'Chưa chọn file'):'Chưa chọn file';
    document.getElementById('supportNotificationNavigation').value=x?x.navigation:'';
    document.getElementById('supportNotificationSendTime').value=x?x.sendTime:'';
    document.getElementById('supportNotificationBanner').value='';
    document.getElementById('supportNotificationBannerName').textContent=x&&x.bannerName?x.bannerName:'Chưa chọn ảnh';
    var preview=document.getElementById('supportNotificationBannerPreview');
    if(x&&x.bannerData){preview.src=x.bannerData;preview.classList.remove('hidden')}else{preview.removeAttribute('src');preview.classList.add('hidden')}
    document.querySelectorAll('#screen-support-notification-form .support-notification-channel input').forEach(function(c){c.checked=!!(x&&x.channels.indexOf(c.value)>=0)});
    cmsSupportRecipientChange();showScreen('support-notification-form');
  };

  cmsSupportSave=function(type){
    if(type!=='template'&&type!=='notification')return _supportSaveFinal(type);
    if(type==='template'){
      var id=document.getElementById('supportTemplateEditId').value,x=id?cmsSupportTemplates.find(function(v){return v.id===id}):null;
      var task=document.getElementById('supportTemplateEvent').value,title=document.getElementById('supportTemplateTitle').value.trim(),content=document.getElementById('supportTemplateContent').value.trim(),navigation=document.getElementById('supportTemplateNavigation').value,channels=Array.from(document.querySelectorAll('#screen-support-notification-template-form .support-channel input:checked')).map(function(c){return c.value});
      if(!task||!title||!content||!navigation||!channels.length){alert('Vui lòng nhập đủ thông tin bắt buộc và chọn ít nhất một kênh gửi.');return;}
      var obj={id:id||_supportNextFinal('template'),event:task,title:title,content:content,navigation:navigation,channels:channels,status:document.getElementById('supportTemplateStatus').checked?'Hoạt động':'Tạm dừng'};
      if(x)Object.assign(x,obj);else cmsSupportTemplates.unshift(obj);showScreen('support-notification-template');cmsSupportRender('template');return;
    }
    var nid=document.getElementById('supportNotificationEditId').value,nx=nid?cmsSupportNotifications.find(function(v){return v.id===nid}):null;
    var ntitle=document.getElementById('supportNotificationTitle').value.trim(),desc=document.getElementById('supportNotificationContent').value.trim(),editor=document.getElementById('supportNotificationHtmlContent'),htmlContent=editor.innerHTML.trim(),plain=editor.textContent.trim(),recipient=document.getElementById('supportNotificationRecipient').value,sendTime=document.getElementById('supportNotificationSendTime').value,navigation=document.getElementById('supportNotificationNavigation').value,channels=Array.from(document.querySelectorAll('#screen-support-notification-form .support-notification-channel input:checked')).map(function(c){return c.value});
    var detail=recipient==='Theo hạng'?document.getElementById('supportNotificationTier').value:recipient==='Theo nhóm tài khoản'?document.getElementById('supportNotificationGroup').value:recipient==='Danh sách tài khoản'?(document.getElementById('supportNotificationFile').files[0]?document.getElementById('supportNotificationFile').files[0].name:(nx?nx.recipientDetail:'')):'Tất cả tài khoản';
    if(!ntitle||!desc||!plain||!recipient||!sendTime||!navigation||!channels.length||(recipient==='Danh sách tài khoản'&&!detail)){alert('Vui lòng nhập đủ thông tin bắt buộc, chọn kênh gửi và khai báo đối tượng nhận.');return;}
    var file=document.getElementById('supportNotificationBanner').files[0];
    var finish=function(bannerData){var obj={id:nid||_supportNextFinal('notification'),title:ntitle,content:desc,htmlContent:htmlContent,recipient:recipient,recipientDetail:detail,sendTime:sendTime,navigation:navigation,channels:channels,bannerName:file?file.name:(nx?nx.bannerName:''),bannerData:bannerData!==undefined?bannerData:(nx?nx.bannerData:''),updatedAt:new Date().toLocaleString('vi-VN',{hour12:false}),status:nx?nx.status:'Chờ gửi'};if(nx)Object.assign(nx,obj);else cmsSupportNotifications.unshift(obj);showScreen('support-notification');cmsSupportRender('notification')};
    if(file){var reader=new FileReader();reader.onload=function(e){finish(e.target.result)};reader.readAsDataURL(file)}else finish();
  };
})();

function cmsSupportInsertVariable(id,token){var el=document.getElementById(id);if(!el)return;var start=el.selectionStart==null?el.value.length:el.selectionStart,end=el.selectionEnd==null?start:el.selectionEnd;el.value=el.value.slice(0,start)+token+el.value.slice(end);el.focus();el.selectionStart=el.selectionEnd=start+token.length;}
function cmsSupportMarketingEditorCommand(command,value){var editor=document.getElementById('supportNotificationHtmlContent');if(!editor)return;editor.focus();document.execCommand(command,false,value||null)}
function cmsSupportMarketingInsertLink(){var url=prompt('Nhập đường dẫn liên kết:','https://');if(url)cmsSupportMarketingEditorCommand('createLink',url)}
function cmsSupportNotificationBannerSelected(input){var file=input.files&&input.files[0],name=document.getElementById('supportNotificationBannerName'),preview=document.getElementById('supportNotificationBannerPreview');name.textContent=file?file.name:'Chưa chọn ảnh';if(!file){preview.classList.add('hidden');return}var reader=new FileReader();reader.onload=function(e){preview.src=e.target.result;preview.classList.remove('hidden')};reader.readAsDataURL(file)}

var cmsSupportEmails=[
{id:'EMAIL-001',name:'verify-email',title:'[MyVTC] Xác thực email',status:'Hoạt động',creator:'quyen.nguyen',createdAt:'25/02/2026 08:48:08',content:'<h2>Xác thực email</h2><p>Xin chào @username, vui lòng xác thực email của bạn.</p>'},
{id:'EMAIL-002',name:'otp_email',title:'[MyVTC] Mã xác thực',status:'Hoạt động',creator:'quyen.nguyen',createdAt:'25/02/2026 08:48:08',content:'<p>Mã OTP của bạn là <strong>@otp</strong>.</p>'},
{id:'EMAIL-003',name:'forgot-password',title:'[MyVTC] Quên mật khẩu',status:'Hoạt động',creator:'admin.hong',createdAt:'06/04/2026 11:02:15',content:'<p>Yêu cầu đặt lại mật khẩu cho tài khoản @username.</p>'},
{id:'EMAIL-004',name:'payment-success',title:'[MyVTC] Thanh toán thành công',status:'Hoạt động',creator:'admin.payment',createdAt:'14/08/2026 09:15:20',content:'<p>Giao dịch @transaction_code đã thanh toán thành công.</p>'},
{id:'EMAIL-005',name:'account-security',title:'[MyVTC] Cảnh báo bảo mật tài khoản',status:'Tạm dừng',creator:'admin.security',createdAt:'14/08/2026 10:25:04',content:'<p>Phát hiện hoạt động mới trên tài khoản @username.</p>'}
];
var cmsSupportEmailState={page:1,size:25,hidden:new Set()};
function cmsSupportEmailFiltered(){var name=((document.getElementById('supportEmailNameFilter')||{}).value||'').toLowerCase(),title=((document.getElementById('supportEmailTitleFilter')||{}).value||'').toLowerCase(),status=(document.getElementById('supportEmailStatusFilter')||{}).value||'',q=((document.getElementById('supportEmailQuick')||{}).value||'').toLowerCase();return cmsSupportEmails.filter(function(x){return(!name||x.name.toLowerCase().indexOf(name)>=0)&&(!title||x.title.toLowerCase().indexOf(title)>=0)&&(!status||x.status===status)&&(!q||JSON.stringify(x).toLowerCase().indexOf(q)>=0)})}
function cmsSupportEmailSearch(){cmsSupportEmailState.page=1;cmsSupportEmailRender()}
function cmsSupportEmailRender(){var body=document.getElementById('supportEmailRows');if(!body)return;var list=cmsSupportEmailFiltered(),pages=Math.max(1,Math.ceil(list.length/cmsSupportEmailState.size));cmsSupportEmailState.page=Math.min(cmsSupportEmailState.page,pages);var start=(cmsSupportEmailState.page-1)*cmsSupportEmailState.size,rows=list.slice(start,start+cmsSupportEmailState.size);body.innerHTML=rows.map(function(x,i){return '<tr><td>'+(start+i+1)+'</td><td>'+cmsSupportEsc(x.id)+'</td><td>'+cmsSupportEsc(x.name)+'</td><td>'+cmsSupportEsc(x.title)+'</td><td>'+cmsSupportStatus(x.status)+'</td><td>'+cmsSupportEsc(x.creator)+'</td><td>'+cmsSupportEsc(x.createdAt)+'</td><td><button class="icon-square orange" title="Cập nhật" onclick="cmsSupportEmailOpenForm(\''+x.id+'\')"><i class="fa fa-edit"></i></button><button class="icon-square blue" title="Bật/Tắt trạng thái" onclick="cmsSupportEmailToggleStatus(\''+x.id+'\')"><i class="fa '+(x.status==='Hoạt động'?'fa-pause':'fa-play')+'"></i></button><button class="icon-square red" title="Xóa" onclick="cmsSupportEmailDelete(\''+x.id+'\')"><i class="fa fa-trash"></i></button></td></tr>'}).join('')||'<tr><td colspan="8" class="empty-cell">Không có dữ liệu phù hợp.</td></tr>';document.getElementById('supportEmailCount').textContent=list.length?'Hiển thị '+(start+1)+' đến '+Math.min(start+rows.length,list.length)+' trong '+list.length+' bản ghi':'0 bản ghi';var p='<button '+(cmsSupportEmailState.page===1?'disabled':'')+' onclick="cmsSupportEmailSetPage('+(cmsSupportEmailState.page-1)+')">‹</button>';for(var n=1;n<=pages;n++)p+='<button class="'+(n===cmsSupportEmailState.page?'active':'')+'" onclick="cmsSupportEmailSetPage('+n+')">'+n+'</button>';p+='<button '+(cmsSupportEmailState.page===pages?'disabled':'')+' onclick="cmsSupportEmailSetPage('+(cmsSupportEmailState.page+1)+')">›</button>';document.getElementById('supportEmailPager').innerHTML=p;cmsSupportEmailApplyColumns()}
function cmsSupportEmailSetPage(p){if(p<1)return;cmsSupportEmailState.page=p;cmsSupportEmailRender()}
function cmsSupportEmailOpenForm(id){var x=id?cmsSupportEmails.find(function(v){return v.id===id}):null;document.getElementById('supportEmailEditId').value=x?x.id:'';document.getElementById('supportEmailFormTitle').textContent=x?'Cập nhật':'Thêm mới';document.getElementById('supportEmailName').value=x?x.name:'';document.getElementById('supportEmailTitle').value=x?x.title:'';document.getElementById('supportEmailContent').innerHTML=x?x.content:'';document.getElementById('supportEmailStatus').checked=!x||x.status==='Hoạt động';showScreen('support-email-form')}
function cmsSupportEmailResetForm(){cmsSupportEmailOpenForm(document.getElementById('supportEmailEditId').value||null)}
function cmsSupportEmailSave(){var id=document.getElementById('supportEmailEditId').value,x=id?cmsSupportEmails.find(function(v){return v.id===id}):null,name=document.getElementById('supportEmailName').value.trim(),title=document.getElementById('supportEmailTitle').value.trim(),editor=document.getElementById('supportEmailContent'),content=editor.innerHTML.trim(),plain=editor.textContent.trim();if(!name||!title||!plain){alert('Vui lòng nhập đủ thông tin bắt buộc.');return}if(cmsSupportEmails.some(function(v){return v.name.toLowerCase()===name.toLowerCase()&&v.id!==id})){alert('Tên Email đã tồn tại.');return}var obj={id:id||'EMAIL-'+String(cmsSupportEmails.length+1).padStart(3,'0'),name:name,title:title,content:content,status:document.getElementById('supportEmailStatus').checked?'Hoạt động':'Tạm dừng',creator:x?x.creator:'admin.hong',createdAt:x?x.createdAt:new Date().toLocaleString('vi-VN',{hour12:false})};if(x)Object.assign(x,obj);else cmsSupportEmails.unshift(obj);showScreen('support-email');cmsSupportEmailRender()}
function cmsSupportEmailToggleStatus(id){var x=cmsSupportEmails.find(function(v){return v.id===id});if(x){x.status=x.status==='Hoạt động'?'Tạm dừng':'Hoạt động';cmsSupportEmailRender()}}
function cmsSupportEmailDelete(id){var x=cmsSupportEmails.find(function(v){return v.id===id});if(x&&confirm('Bạn xác nhận xóa Email "'+x.name+'"?')){cmsSupportEmails=cmsSupportEmails.filter(function(v){return v.id!==id});cmsSupportEmailRender()}}
function cmsSupportEmailEditorCommand(command,value){var editor=document.getElementById('supportEmailContent');if(!editor)return;editor.focus();document.execCommand(command,false,value||null)}
function cmsSupportEmailInsertLink(){var url=prompt('Nhập đường dẫn liên kết:','https://');if(url)cmsSupportEmailEditorCommand('createLink',url)}
function cmsSupportEmailInsertImage(input){var file=input.files&&input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(e){cmsSupportEmailEditorCommand('insertImage',e.target.result);input.value=''};reader.readAsDataURL(file)}
function cmsSupportEmailApplyColumns(){var table=document.getElementById('supportEmailTable');if(!table)return;Array.from(table.rows).forEach(function(r){Array.from(r.cells).forEach(function(c,i){c.style.display=cmsSupportEmailState.hidden.has(i)?'none':''})})}
function cmsSupportEmailToggleColumns(btn){var old=document.getElementById('supportEmailColumnPicker');if(old){old.remove();return}var table=document.getElementById('supportEmailTable'),box=document.createElement('div');box.id='supportEmailColumnPicker';box.className='support-column-picker';Array.from(table.tHead.rows[0].cells).forEach(function(th,i){if(i===0||i===table.tHead.rows[0].cells.length-1)return;var l=document.createElement('label'),c=document.createElement('input');c.type='checkbox';c.checked=!cmsSupportEmailState.hidden.has(i);c.onchange=function(){c.checked?cmsSupportEmailState.hidden.delete(i):cmsSupportEmailState.hidden.add(i);cmsSupportEmailApplyColumns()};l.append(c,document.createTextNode(th.textContent));box.append(l)});document.body.append(box);var r=btn.getBoundingClientRect();box.style.left=r.left+'px';box.style.top=(r.bottom+5+scrollY)+'px'}
document.addEventListener('DOMContentLoaded',cmsSupportEmailRender);
