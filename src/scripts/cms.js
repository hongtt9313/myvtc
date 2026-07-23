*{box-sizing:border-box}
body{margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;background:#f7f7f7}
.cms-top-line{height:6px;background:#0576bb}
.cms-header{height:64px;background:#fff;border-bottom:1px solid #ddd;box-shadow:0 1px 4px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:space-between;padding:0 18px}
.cms-left{display:flex;align-items:center;gap:18px}
.cms-logo{height:38px;width:auto;display:block}
.cms-nav{display:flex;align-items:center;gap:8px}
.cms-menu-item{position:relative}
.cms-nav-btn{height:34px;border:1px solid #1f5f95;border-radius:4px;background:linear-gradient(#347fb8,#1f5f95);color:#fff;font-weight:700;padding:0 15px;display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:inset 0 1px rgba(255,255,255,.25)}
.cms-menu-item:hover .cms-nav-btn,.cms-nav-btn.active{background:linear-gradient(#2d74aa,#174d7e)}
.cms-dropdown{
position:absolute;
left:0;
top:34px;
min-width:245px;
background:#fff;
border:1px solid #c8c8c8;
box-shadow:0 2px 4px rgba(0,0,0,.2);
padding:0;
border-radius:0;
z-index:999;
display:none;
}
.cms-menu-item:hover .cms-dropdown{display:block}
.cms-dropdown button{
display:flex;
align-items:center;
gap:7px;
width:100%;
height:33px;
border:0;
background:#fff;
color:#333;
text-align:left;
padding:0 12px;
border-radius:0;
font-weight:400;
cursor:pointer;
white-space:nowrap;
}
.cms-dropdown button:hover,
.cms-dropdown button.active{
background:#f5f5f5;
color:#333;
}
.cms-user{display:flex;align-items:center;gap:28px;color:#145fb0;font-weight:700}
.cms-warning{height:30px;background:#f2f2f2;margin:0 14px;display:flex;align-items:center;padding-left:12px;gap:6px}
.cms-warning span{background:#ef4123;color:#fff;border-radius:2px;padding:4px 9px;font-weight:700}
.cms-screen-title{height:36px;background:#2e7db6;color:#fff;margin:15px 14px 0;border:1px solid #2b78b0;border-bottom:0;display:flex;align-items:center;padding:0 14px;font-weight:700;gap:8px}
.cms-screen-title.light{height:36px;background:#d9edf7;color:#31708f;border-color:#d9edf7;margin:0 14px}
.cms-content{margin:0 14px 20px;background:#fff;border:1px solid #2b94e6;min-height:520px;padding:14px}
.cms-content.compact{padding:0}
.cms-center{max-width:1120px;margin:0 auto}
.cms-actions-center{display:flex;justify-content:center;gap:6px;padding:14px 0}
.btn{border:1px solid transparent;border-radius:4px;min-height:32px;padding:0 12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;color:#fff;background:#337ab7}
.btn.blue{background:#337ab7;border-color:#2e6da4}.btn.green{background:#4caf50;border-color:#398439}.btn.orange{background:#f0ad4e;border-color:#eea236}.btn.red{background:#d9534f;border-color:#d43f3a}.btn.gray{background:#eee;color:#222;border-color:#ccc}.btn.info{background:#31b0d5;border-color:#269abc}
.icon-round{width:26px;height:26px;border-radius:50%;border:0;color:#fff;margin:0 2px;cursor:pointer}.icon-round.orange{background:#f0ad4e}.icon-round.red{background:#d9534f}.icon-round.blue{background:#337ab7}.icon-square{width:30px;height:28px;border:0;border-radius:4px;color:#fff;margin:0 2px;cursor:pointer}.icon-square.blue{background:#109af0}.icon-square.orange{background:#f0ad4e}.icon-square.red{background:#d9534f}.icon-square.green{background:#20b65a}
.fn-tree{width:980px;margin:8px auto 0;border:1px solid #2f92ef;border-collapse:collapse;color:#2b84d4}
.fn-tree td{height:31px;border:1px solid #2f92ef;padding:0 9px;background:#fff}.fn-tree .ops{width:150px;text-align:center}.fn-tree .level1{font-weight:700}.fn-tree .indent1{padding-left:34px}.fn-tree .indent2{padding-left:58px}.fn-tree i{margin-right:6px}
.form-shell{background:#fff;min-height:440px}.form-section{height:40px;background:#d9edf7;color:#31708f;display:flex;align-items:center;gap:8px;padding:0 18px;font-size:18px}.form-body{max-width:790px;margin:16px auto 0}.form-row{display:grid;grid-template-columns:220px 1fr;gap:24px;align-items:center;margin-bottom:15px}.form-row label{text-align:right;font-weight:700}.form-row input,.form-row select{height:36px;border:1px solid #ccc;border-radius:3px;padding:0 12px;width:100%;font-size:14px}.form-row input.valid{border-color:#5cb85c;background:#eef7ff}.form-row input.invalid{border-color:#d9534f;background:#eef7ff}.required{color:#d00}.check-icon{position:relative}.check-icon:after{content:'\f00c';font-family:'Font Awesome 6 Free';font-weight:900;position:absolute;right:13px;top:9px;color:#c6c6c6}.x-icon:after{content:'\f00d';color:#c6c6c6}.form-help{color:#d9534f;font-size:13px;margin-top:-8px;margin-bottom:15px;padding-left:244px}.form-bottom{background:#f5f5f5;border-top:1px solid #eee;text-align:center;padding:13px;display:flex;justify-content:center;gap:6px}
.sort-wrap{max-width:1440px;margin:0 auto;padding:20px 0 28px}.sort-actions{text-align:center;margin-bottom:16px}.sort-tree{max-width:1360px;margin:0 auto}.sort-group{display:grid;grid-template-columns:28px 1fr;gap:8px;align-items:center;margin:8px 0}.minus{font-size:24px;font-weight:700;text-align:center}.sort-item{height:31px;border:1px solid #cfcfcf;border-radius:3px;background:linear-gradient(#fff,#eee);display:flex;align-items:center;padding:0 12px;font-weight:700;gap:8px}.sort-child{margin-left:48px;margin-bottom:6px}.sort-child .sort-item{font-weight:700}
.tools-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0 8px}.filter-row{display:flex;align-items:center;gap:18px;flex-wrap:wrap}.filter-row label{font-weight:700;display:flex;align-items:center;gap:8px}.input,.select{height:34px;border:1px solid #ccc;border-radius:3px;padding:0 10px;background:#fff}.select{min-width:120px}.table-wrap{overflow-x:auto}.data-table{width:100%;border-collapse:collapse;min-width:1180px}.data-table th{background:#d9edf7;border:1px solid #c9dfe9;text-align:center;padding:9px 8px;font-weight:700}.data-table td{border:1px solid #ddd;text-align:center;padding:7px 8px;background:#fff}.data-table tr:nth-child(even) td{background:#f8f8f8}.ok{color:green;font-weight:700}.no{color:red;font-weight:700}.page-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 0}.pager{display:flex}.pager button{height:32px;min-width:34px;border:1px solid #ddd;background:#fff;color:#337ab7}.pager .active{background:#337ab7;color:#fff}.permission-table{width:1120px;margin:18px auto;border-collapse:collapse}.permission-table th,.permission-table td{border:1px solid #ddd;padding:8px;background:#fff}.permission-table th{font-weight:700;text-align:center}.permission-table td{text-align:center}.permission-table td:first-child{text-align:left}.permission-table .group{font-weight:700}.permission-table .child1{padding-left:34px}.permission-table .child2{padding-left:58px}.log-filter{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px 80px;padding:18px 24px 10px}.log-filter label{font-weight:700;display:flex;align-items:center;gap:12px}.log-filter .center-actions{grid-column:2;text-align:center}.hidden{display:none!important}
.product-filter-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px 80px;align-items:center;margin-bottom:16px}
.product-filter-grid label{font-weight:700;color:#0f5e8f;display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:center}
.cms-form-wide{max-width:760px;margin:16px auto 0}
.cms-form-row{display:grid;grid-template-columns:230px 1fr;gap:20px;align-items:center;margin-bottom:14px}
.cms-form-row label{text-align:right;font-weight:700}
.cms-form-row input,.cms-form-row select,.cms-form-row textarea{width:100%;border:1px solid #ccc;border-radius:3px;padding:8px 10px;font-size:14px}
.cms-form-row input,.cms-form-row select{height:36px}
.cms-form-row textarea{height:58px;resize:vertical}
.cms-file{padding-top:6px}
.required{color:#d00}
.field-list{display:flex;flex-direction:column;gap:8px}
.field-line{display:grid;grid-template-columns:150px 12px 240px 20px;gap:6px;align-items:center}
.field-line input{height:28px;text-align:center;background:#f9f9f9}
.field-line .remove{color:red;font-weight:700}
.form-id-text{font-weight:700}
.account-search-box{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;background:#f7fbff;border:1px solid #cfe5f5;border-radius:4px;padding:14px;margin-bottom:14px}
.account-search-box label{font-weight:700;color:#0f5e8f;display:flex;flex-direction:column;gap:6px;min-width:280px}
.account-alert{display:none;border-radius:4px;padding:10px 12px;margin:0 0 14px;font-weight:700}
.account-alert.error{display:block;background:#f8d7da;color:#842029;border:1px solid #f5c2c7}
.account-alert.success{display:block;background:#d1e7dd;color:#0f5132;border:1px solid #badbcc}
.account-profile-head{display:flex;align-items:center;gap:14px;background:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:14px;margin-bottom:14px}
.account-avatar{width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.18)}
.account-name{font-size:20px;font-weight:700;color:#145fb0}
.account-sub{margin-top:4px;color:#555}
.account-badge{display:inline-flex;align-items:center;gap:6px;border-radius:20px;padding:5px 10px;font-weight:700;background:#eaf4ff;color:#1769aa;border:1px solid #b7daf5}
.account-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.account-card{border:1px solid #d7e6f2;border-radius:4px;background:#fff;overflow:hidden}
.account-card-title{height:38px;background:#d9edf7;color:#31708f;display:flex;align-items:center;gap:8px;padding:0 12px;font-weight:700}
.account-card-body{padding:12px}
.account-info-row{display:grid;grid-template-columns:180px 1fr;gap:10px;border-bottom:1px solid #eee;padding:8px 0}
.account-info-row:last-child{border-bottom:0}
.account-info-row b{color:#333}
.account-table{width:100%;border-collapse:collapse}
.account-table th{background:#f1f8fe;border:1px solid #d9e9f5;padding:8px;text-align:left}
.account-table td{border:1px solid #e5e5e5;padding:8px;vertical-align:top}
.account-mini-avatar{width:96px;height:96px;object-fit:cover;border-radius:4px;border:1px solid #ddd}
.account-rank{display:flex;align-items:center;gap:8px;font-weight:700;color:#b47b00}
.account-rank-icon{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#fff2cc;border:1px solid #d6b656;color:#b47b00}
.account-progress{height:12px;background:#eee;border-radius:20px;overflow:hidden}
.account-progress span{display:block;height:100%;background:#337ab7}
.account-edit-shell{max-width:920px;margin:0 auto}
.account-edit-form{border:1px solid #d7e6f2;background:#fff;border-radius:4px;padding:16px}
.account-edit-row{display:grid;grid-template-columns:230px 1fr;gap:16px;align-items:center;margin-bottom:13px}
.account-edit-row label{text-align:right;font-weight:700}
.account-edit-row input,.account-edit-row select{height:36px;border:1px solid #ccc;border-radius:3px;padding:0 10px;width:100%}
.account-edit-row input[type="file"]{padding:6px 10px;height:auto}
.account-edit-row .checkbox-line{display:flex;gap:16px;align-items:center;flex-wrap:wrap}
.account-edit-row .checkbox-line label{text-align:left;font-weight:400;display:flex;align-items:center;gap:6px}
.account-hint{font-size:12px;color:#777;margin-top:4px}
.account-field-error{color:#d9534f;font-size:12px;margin-top:4px;display:none}
.account-field-error.show{display:block}
.account-update-actions{background:#f5f5f5;border-top:1px solid #eee;margin:14px -16px -16px;padding:13px;text-align:center;display:flex;justify-content:center;gap:8px}
.account-update-actions .btn[disabled]{opacity:.55;cursor:not-allowed}
.audit-box{margin-top:14px;border:1px solid #d7e6f2;border-radius:4px;background:#fff}
.audit-box-title{height:36px;background:#d9edf7;color:#31708f;display:flex;align-items:center;gap:8px;padding:0 12px;font-weight:700}
.audit-list{padding:10px 14px;margin:0}
.audit-list li{margin:6px 0}
@media(max-width:1000px){.account-grid{grid-template-columns:1fr}.account-edit-row{grid-template-columns:1fr}.account-edit-row label{text-align:left}.account-info-row{grid-template-columns:1fr}}
@media(max-width:900px){.cms-header{height:auto;align-items:flex-start;flex-direction:column;padding:10px}.cms-left{align-items:flex-start;flex-direction:column}.cms-nav{flex-wrap:wrap}.cms-dropdown{position:static;box-shadow:none;margin-top:4px}.cms-content{margin:0 8px 16px}.cms-screen-title,.cms-screen-title.light{margin-left:8px;margin-right:8px}.fn-tree,.permission-table{width:100%}.form-row{grid-template-columns:1fr;gap:6px}.form-row label{text-align:left}.form-help{padding-left:0}.log-filter{grid-template-columns:1fr}.log-filter .center-actions{grid-column:1}}
.account-search-box{justify-content:center;max-width:760px;margin:0 auto 14px}
#accountLookupResult{max-width:1040px;margin:0 auto}
#screen-account-lookup #accountLookupResult>.account-profile-head{display:none}
.account-lookup-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:0 auto 14px;max-width:1040px}
.account-lookup-tab{min-height:38px;border:1px solid #b7daf5;background:#fff;color:#1769aa;border-radius:6px;padding:7px 10px;font-weight:700;cursor:pointer;text-align:center}
.account-lookup-tab.active{background:#337ab7;color:#fff;border-color:#337ab7}
.lookup-tabs-ready .account-grid{display:block;margin-bottom:0}
.lookup-tabs-ready .account-card{display:none;max-width:1040px;margin:0 auto 14px}
.lookup-tabs-ready .account-card.active{display:block}
.account-status-select{height:30px;border:1px solid #b7daf5;border-radius:4px;padding:0 8px;color:#1769aa;background:#fff;font-weight:700}
.account-social-remove-btn{height:30px;border:1px solid #d9534f;background:#fff;color:#d9534f;border-radius:4px;padding:0 10px;font-weight:700;cursor:pointer}
.account-social-remove-btn:hover,.account-social-remove-btn.active{background:#d9534f;color:#fff}
@media(max-width:900px){.account-lookup-tabs{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.account-lookup-tabs{grid-template-columns:1fr}}
.account-table-title{font-weight:700;color:#0f5e8f;text-align:center;background:#f7fbff;border:1px solid #d9e9f5;border-bottom:0;padding:9px}
.account-pager{display:flex;justify-content:center;gap:6px;padding:10px 0 2px}
.account-pager button{min-width:32px;height:30px;border:1px solid #cfe5f5;background:#fff;color:#337ab7;border-radius:3px;cursor:pointer}
.account-pager button.active{background:#337ab7;color:#fff;border-color:#337ab7}
.account-social-list{display:grid;gap:8px;margin-bottom:10px}
.account-social-item{border:1px solid #d9e9f5;background:#f7fbff;border-radius:4px;padding:8px 10px;display:grid;grid-template-columns:120px 1fr 1fr 1fr;gap:8px;align-items:center}
.account-social-item span{color:#555}
.account-inline-action{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.account-social-detail-list{display:grid;gap:8px}
.account-security-methods{display:flex;gap:6px;flex-wrap:wrap}
.account-mini-btn{height:28px;border:1px solid #337ab7;background:#fff;color:#337ab7;border-radius:3px;padding:0 9px;font-weight:700;cursor:pointer}
.account-mini-btn:hover{background:#337ab7;color:#fff}
.account-mini-btn.danger{border-color:#d9534f;color:#d9534f}
.account-mini-btn.danger:hover{background:#d9534f;color:#fff}
@media(max-width:900px){.account-social-item{grid-template-columns:1fr}.account-search-box{max-width:none}}


.cms-dropdown-wide{min-width:310px}
.locked-field{background:#f1f1f1;color:#777;cursor:not-allowed}
.account-warning-text{color:#b47b00;font-size:12px;margin-top:4px;font-weight:700}
.loyalty-admin-shell{max-width:1180px;margin:0 auto}
.loyalty-goal{background:#f7fbff;border:1px solid #cfe5f5;border-radius:4px;padding:12px 14px;color:#0f5e8f;margin-bottom:14px}
.loyalty-filter-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:8px}
.loyalty-filter-grid label{font-weight:700;color:#0f5e8f;display:flex;flex-direction:column;gap:6px}
#screen-account-identity-update .account-edit-shell{max-width:980px}
#screen-account-identity-update .account-edit-form{margin-bottom:14px}
@media(max-width:900px){.loyalty-filter-grid{grid-template-columns:1fr}.cms-dropdown-wide{min-width:245px}}

.identity-check-line{display:inline-flex;align-items:center;gap:8px;font-weight:700;color:#0f5e8f}
.identity-check-line input{width:18px!important;height:18px!important}
.locked-field{background:#f1f1f1!important;color:#777!important;cursor:not-allowed}


.cms-dropdown-wide{min-width:310px}
.payment-layout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(320px,.65fr);gap:14px;margin-bottom:14px}
.payment-two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.payment-panel{border:1px solid #d7e6f2;background:#fff;border-radius:4px;overflow:hidden;margin-bottom:14px}
.payment-panel-title{height:38px;background:#d9edf7;color:#31708f;display:flex;align-items:center;gap:8px;padding:0 12px;font-weight:700}
.payment-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px 18px;padding:14px}
.payment-form-grid.one-col{grid-template-columns:1fr}
.payment-form-grid label{font-weight:700;color:#0f5e8f;display:flex;flex-direction:column;gap:6px}
.payment-form-grid input,.payment-form-grid select,.payment-form-grid textarea{border:1px solid #ccc;border-radius:3px;padding:8px 10px;font-size:14px;width:100%;background:#fff}
.payment-form-grid input,.payment-form-grid select{height:36px}
.payment-form-grid textarea{min-height:70px;resize:vertical}
.payment-full{grid-column:1/-1}
.payment-check{flex-direction:row!important;align-items:center;color:#333!important;padding-top:26px}
.payment-check input{width:auto!important;height:auto!important}
.payment-form-actions{margin-top:0}
.payment-log{padding:12px;min-height:158px;max-height:238px;overflow:auto}
.payment-log-item{border-bottom:1px solid #eee;padding:8px 0;line-height:1.45}
.payment-log-item:last-child{border-bottom:0}
.payment-log-item b{color:#145fb0}
.payment-status{display:inline-flex;align-items:center;justify-content:center;border-radius:20px;padding:4px 9px;font-weight:700;white-space:nowrap}
.payment-status.waiting{background:#fff3cd;color:#856404;border:1px solid #ffeeba}
.payment-status.active{background:#d1e7dd;color:#0f5132;border:1px solid #badbcc}
.payment-status.expired{background:#e2e3e5;color:#383d41;border:1px solid #d6d8db}
.payment-status.cancelled{background:#f8d7da;color:#842029;border:1px solid #f5c2c7}
.payment-table{min-width:1350px}
.payment-table td{vertical-align:middle}
.payment-table .ops{white-space:nowrap}
.payment-detail{border:1px solid #cfe5f5;background:#f7fbff;border-radius:4px;margin:14px;padding:12px;line-height:1.65}
.payment-detail-title{font-weight:700;color:#145fb0;margin-bottom:6px}
.payment-detail-grid{display:grid;grid-template-columns:180px 1fr;gap:6px 14px}
.payment-search-grid{grid-template-columns:repeat(3,1fr)}
.payment-money{font-weight:700;color:#145fb0}
.payment-negative{font-weight:700;color:#d9534f}
.payment-positive{font-weight:700;color:#20b65a}
@media(max-width:1100px){
  .payment-layout,.payment-two-col{grid-template-columns:1fr}
  .payment-search-grid,.payment-form-grid{grid-template-columns:1fr}
  .payment-full{grid-column:auto}
}


.loyalty-event-form{border:1px solid #d7e6f2;background:#fff;border-radius:4px;overflow:hidden;margin-top:14px}
.loyalty-event-form .payment-form-grid{padding:14px}
.loyalty-event-form textarea{min-height:68px;background:#f8f8f8;color:#555}
.account-badge.status-active{background:#d1e7dd;color:#0f5132;border-color:#badbcc}
.account-badge.status-inactive{background:#f8d7da;color:#842029;border-color:#f5c2c7}
#loyaltyEventRows td:nth-child(4){text-align:left;min-width:280px}
#loyaltyEventRows td:nth-child(2),#loyaltyEventRows td:nth-child(3){text-align:left}
/* CMS common layout: dùng layout Quản trị sản phẩm > Quản trị đơn vị phân phối cho Tài khoản, Loyalty, Thanh toán */

/* Bỏ toàn bộ text "Mục tiêu" trên màn hình CMS */
.loyalty-goal {
  display: none !important;
}

/* Khung nội dung chính full width như Quản trị đơn vị phân phối */
.account-edit-shell,
.loyalty-admin-shell,
.payment-layout,
.payment-two-col,
.payment-panel,
#accountLookupResult,
.account-lookup-tabs {
  max-width: none !important;
  width: 100% !important;
}

/* Bộ lọc của Tài khoản, Loyalty, Thanh toán dùng style giống product-filter-grid */
.account-search-box,
.loyalty-filter-grid,
.payment-search-grid,
.payment-form-grid {
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr !important;
  gap: 18px 80px !important;
  align-items: center !important;
  margin-bottom: 16px !important;
}

/* Label trong bộ lọc giống CMS Sản phẩm */
.account-search-box label,
.loyalty-filter-grid label,
.payment-search-grid label,
.payment-form-grid label {
  font-weight: 700 !important;
  color: #0f5e8f !important;
  display: grid !important;
  grid-template-columns: 150px 1fr !important;
  gap: 12px !important;
  align-items: center !important;
}

/* Input, select trong các khối lọc cùng chiều cao */
.account-search-box input,
.account-search-box select,
.loyalty-filter-grid input,
.loyalty-filter-grid select,
.payment-search-grid input,
.payment-search-grid select,
.payment-form-grid input,
.payment-form-grid select {
  height: 34px !important;
  border: 1px solid #ccc !important;
  border-radius: 3px !important;
  padding: 0 10px !important;
  background: #fff !important;
  width: 100% !important;
}

/* Textarea trong form thanh toán vẫn giữ dạng nhập nhiều dòng */
.payment-form-grid textarea {
  border: 1px solid #ccc !important;
  border-radius: 3px !important;
  padding: 8px 10px !important;
  background: #fff !important;
  width: 100% !important;
}

/* Các nút tra cứu, thêm mới, xuất dữ liệu căn giữa giống Quản trị đơn vị phân phối */
.account-update-actions,
.payment-form-actions,
.form-bottom {
  justify-content: center !important;
}

/* Bảng dữ liệu fit full width */
.table-wrap,
.data-table {
  width: 100% !important;
}

.data-table {
  min-width: 1180px;
}

/* Khối form Tài khoản, Loyalty, Thanh toán không bị bó hẹp */
.account-edit-form,
.payment-panel,
.loyalty-event-form {
  border: 1px solid #d7e6f2;
  background: #fff;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 1100px) {
  .account-search-box,
  .loyalty-filter-grid,
  .payment-search-grid,
  .payment-form-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  .account-search-box label,
  .loyalty-filter-grid label,
  .payment-search-grid label,
  .payment-form-grid label {
    grid-template-columns: 1fr !important;
  }
}
