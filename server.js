// ================= NANAMI v3 — REAL SERVER (zero-dependency Node) =================
// Company: Krishang Alloy | Sealed bidding | Rating engine | Trips (Phase-2 API ready)
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3100;
const DBF=path.join(__dirname,'db.json');

const CITIES=[
 // Gujarat
 {n:"Umbergaon, Gujarat",pin:"396170",km:5},{n:"Valsad, Gujarat",pin:"396001",km:25},{n:"Vapi, Gujarat",pin:"396191",km:24},
 {n:"Navsari, Gujarat",pin:"396445",km:55},{n:"Surat, Gujarat",pin:"395003",km:95},{n:"Ankleshwar, Gujarat",pin:"393001",km:120},
 {n:"Bharuch, Gujarat",pin:"392001",km:140},{n:"Vadodara, Gujarat",pin:"390001",km:240},{n:"Nadiad, Gujarat",pin:"387001",km:285},
 {n:"Ahmedabad, Gujarat",pin:"380001",km:330},{n:"Mehsana, Gujarat",pin:"384001",km:385},{n:"Gandhidham, Gujarat",pin:"370201",km:640},
 {n:"Bhuj, Gujarat",pin:"370001",km:700},{n:"Rajkot, Gujarat",pin:"360001",km:500},{n:"Morbi, Gujarat",pin:"363641",km:530},
 {n:"Jamnagar, Gujarat",pin:"361001",km:560},{n:"Bhavnagar, Gujarat",pin:"364001",km:590},{n:"Junagadh, Gujarat",pin:"362001",km:660},
 // Maharashtra
 {n:"Daman, UT",pin:"396210",km:35},{n:"Silvassa, UT",pin:"396230",km:40},{n:"Palghar, Maharashtra",pin:"401404",km:60},
 {n:"Vasai, Maharashtra",pin:"401202",km:110},{n:"Bhiwandi, Maharashtra",pin:"421308",km:130},{n:"Kalyan, Maharashtra",pin:"421301",km:150},
 {n:"Thane, Maharashtra",pin:"400601",km:160},{n:"Taloja, Maharashtra",pin:"410208",km:170},{n:"Navi Mumbai, Maharashtra",pin:"400701",km:180},
 {n:"Mumbai, Maharashtra",pin:"400001",km:205},{n:"Talegaon Dabhade, Maharashtra",pin:"410506",km:270},{n:"Chakan, Maharashtra",pin:"410501",km:294},
 {n:"Chinchwad, Maharashtra",pin:"411019",km:310},{n:"Pune, Maharashtra",pin:"411001",km:320},{n:"Nashik, Maharashtra",pin:"422001",km:158},
 {n:"Baramati, Maharashtra",pin:"413102",km:390},{n:"Ahmednagar, Maharashtra",pin:"414001",km:420},{n:"Aurangabad, Maharashtra",pin:"431001",km:435},
 {n:"Dhule, Maharashtra",pin:"424001",km:415},{n:"Satara, Maharashtra",pin:"415001",km:500},{n:"Karad, Maharashtra",pin:"415110",km:545},
 {n:"Solapur, Maharashtra",pin:"413001",km:560},{n:"Sangli, Maharashtra",pin:"416416",km:590},{n:"Kolhapur, Maharashtra",pin:"416001",km:600},
 {n:"Ichalkaranji, Maharashtra",pin:"416115",km:620},{n:"Jalgaon, Maharashtra",pin:"425001",km:505},{n:"Ratnagiri, Maharashtra",pin:"415612",km:640},
 {n:"Latur, Maharashtra",pin:"413512",km:700},{n:"Nanded, Maharashtra",pin:"431601",km:750},{n:"Akola, Maharashtra",pin:"444001",km:760},
 {n:"Amravati, Maharashtra",pin:"444601",km:800},{n:"Nagpur, Maharashtra",pin:"440001",km:870},
 // Delhi / NCR / UP / Haryana
 {n:"New Delhi, Delhi",pin:"110001",km:1370},{n:"Noida, UP",pin:"201301",km:1375},{n:"Ghaziabad, UP",pin:"201001",km:1360},
 {n:"Faridabad, Haryana",pin:"121001",km:1290},{n:"Gurugram, Haryana",pin:"122001",km:1300},{n:"Manesar, Haryana",pin:"122051",km:1270},
 {n:"Bhiwadi, Rajasthan",pin:"301019",km:1230},{n:"Rohtak, Haryana",pin:"124001",km:1260},{n:"Panipat, Haryana",pin:"132103",km:1255},
 {n:"Karnal, Haryana",pin:"132001",km:1285},{n:"Hisar, Haryana",pin:"125001",km:1205},{n:"Ambala, Haryana",pin:"134003",km:1450},
 {n:"Meerut, UP",pin:"250001",km:1310},{n:"Mathura, UP",pin:"281001",km:1150},{n:"Agra, UP",pin:"282001",km:1180},
 {n:"Aligarh, UP",pin:"202001",km:1245},{n:"Moradabad, UP",pin:"244001",km:1435},{n:"Kanpur, UP",pin:"208001",km:1270},
 {n:"Lucknow, UP",pin:"226001",km:1395},{n:"Prayagraj, UP",pin:"211001",km:1445},{n:"Varanasi, UP",pin:"221001",km:1620},
 // Rajasthan
 {n:"Alwar, Rajasthan",pin:"301001",km:1140},{n:"Jaipur, Rajasthan",pin:"302001",km:1060},{n:"Ajmer, Rajasthan",pin:"305001",km:970},
 {n:"Kota, Rajasthan",pin:"324001",km:800},{n:"Pali, Rajasthan",pin:"306401",km:805},{n:"Jodhpur, Rajasthan",pin:"342001",km:900},
 {n:"Bhilwara, Rajasthan",pin:"311001",km:890},{n:"Udaipur, Rajasthan",pin:"313001",km:640},{n:"Bikaner, Rajasthan",pin:"334001",km:1150},
 {n:"Sri Ganganagar, Rajasthan",pin:"335001",km:1355},
 // MP
 {n:"Ratlam, MP",pin:"457001",km:545},{n:"Pithampur, MP",pin:"454775",km:595},{n:"Indore, MP",pin:"452001",km:600},
 {n:"Dewas, MP",pin:"455001",km:625},{n:"Ujjain, MP",pin:"456001",km:665},{n:"Bhopal, MP",pin:"462001",km:795},
 {n:"Gwalior, MP",pin:"474001",km:1095},{n:"Jabalpur, MP",pin:"482001",km:1185},
 // Punjab / Chandigarh / HP / J&K / UK
 {n:"Ludhiana, Punjab",pin:"141001",km:1455},{n:"Jalandhar, Punjab",pin:"144001",km:1525},{n:"Patiala, Punjab",pin:"147001",km:1425},
 {n:"Bathinda, Punjab",pin:"151001",km:1425},{n:"Amritsar, Punjab",pin:"143001",km:1665},{n:"Mohali, Punjab",pin:"160055",km:1475},
 {n:"Chandigarh, UT",pin:"160017",km:1455},{n:"Baddi, HP",pin:"173205",km:1585},{n:"Solan, HP",pin:"173212",km:1660},
 {n:"Shimla, HP",pin:"171001",km:1735},{n:"Jammu, J&K",pin:"180001",km:1900},{n:"Srinagar, J&K",pin:"190001",km:2200},
 {n:"Haridwar, Uttarakhand",pin:"249401",km:1540},{n:"Roorkee, Uttarakhand",pin:"247667",km:1565},{n:"Rudrapur, Uttarakhand",pin:"263153",km:1465},
 {n:"Dehradun, Uttarakhand",pin:"248001",km:1620},
 // Bihar / Jharkhand / Bengal / Odisha / Chhattisgarh
 {n:"Patna, Bihar",pin:"800001",km:1870},{n:"Gaya, Bihar",pin:"823001",km:1960},{n:"Muzaffarpur, Bihar",pin:"842001",km:2020},
 {n:"Ranchi, Jharkhand",pin:"834001",km:1790},{n:"Bokaro, Jharkhand",pin:"827001",km:1845},{n:"Jamshedpur, Jharkhand",pin:"831001",km:1900},
 {n:"Dhanbad, Jharkhand",pin:"826001",km:1935},{n:"Asansol, West Bengal",pin:"713301",km:2060},{n:"Durgapur, West Bengal",pin:"713201",km:2025},
 {n:"Kolkata, West Bengal",pin:"700001",km:2150},{n:"Howrah, West Bengal",pin:"711101",km:2150},{n:"Haldia, West Bengal",pin:"721602",km:2185},
 {n:"Siliguri, West Bengal",pin:"734001",km:2400},{n:"Rourkela, Odisha",pin:"769001",km:1650},{n:"Jharsuguda, Odisha",pin:"768201",km:1505},
 {n:"Angul, Odisha",pin:"759122",km:1625},{n:"Sambalpur, Odisha",pin:"768001",km:1565},{n:"Bhubaneswar, Odisha",pin:"751001",km:1785},
 {n:"Cuttack, Odisha",pin:"753001",km:1795},{n:"Paradip, Odisha",pin:"754142",km:1845},{n:"Raipur, Chhattisgarh",pin:"492001",km:1270},
 {n:"Bhilai, Chhattisgarh",pin:"490001",km:1285},{n:"Bilaspur, Chhattisgarh",pin:"495001",km:1330},{n:"Raigarh, Chhattisgarh",pin:"496001",km:1450},
 {n:"Korba, Chhattisgarh",pin:"495677",km:1370},
 // Telangana / Andhra
 {n:"Hyderabad, Telangana",pin:"500001",km:1010},{n:"Warangal, Telangana",pin:"506002",km:1135},{n:"Guntur, Andhra",pin:"522001",km:1195},
 {n:"Vijayawada, Andhra",pin:"520001",km:1200},{n:"Tirupati, Andhra",pin:"517501",km:1290},{n:"Nellore, Andhra",pin:"524001",km:1295},
 {n:"Kakinada, Andhra",pin:"533001",km:1470},{n:"Visakhapatnam, Andhra",pin:"530001",km:1560},
 // Karnataka / Goa
 {n:"Belagavi, Karnataka",pin:"590001",km:650},{n:"Dharwad, Karnataka",pin:"580001",km:745},{n:"Hubballi, Karnataka",pin:"580020",km:750},
 {n:"Kalaburagi, Karnataka",pin:"585101",km:860},{n:"Ballari, Karnataka",pin:"583101",km:900},{n:"Anantapur, Andhra",pin:"515001",km:1005},
 {n:"Bengaluru, Karnataka",pin:"560001",km:1150},{n:"Mangaluru, Karnataka",pin:"575001",km:1100},{n:"Mysuru, Karnataka",pin:"570001",km:1280},
 {n:"Mapusa, Goa",pin:"403507",km:670},{n:"Margao, Goa",pin:"403601",km:690},{n:"Panaji, Goa",pin:"403001",km:700},
 {n:"Vasco da Gama, Goa",pin:"403802",km:700},
 // Tamil Nadu / Kerala / Puducherry
 {n:"Hosur, Tamil Nadu",pin:"635110",km:1255},{n:"Sriperumbudur, Tamil Nadu",pin:"602105",km:1365},{n:"Vellore, Tamil Nadu",pin:"632001",km:1425},
 {n:"Erode, Tamil Nadu",pin:"638001",km:1410},{n:"Salem, Tamil Nadu",pin:"636001",km:1415},{n:"Puducherry, UT",pin:"605001",km:1370},
 {n:"Coimbatore, Tamil Nadu",pin:"641001",km:1450},{n:"Chennai, Tamil Nadu",pin:"600001",km:1500},{n:"Tiruchirappalli, Tamil Nadu",pin:"620001",km:1530},
 {n:"Madurai, Tamil Nadu",pin:"625001",km:1580},{n:"Tirunelveli, Tamil Nadu",pin:"627001",km:1680},{n:"Kozhikode, Kerala",pin:"673001",km:1340},
 {n:"Thrissur, Kerala",pin:"680001",km:1550},{n:"Kochi, Kerala",pin:"682001",km:1620},{n:"Thiruvananthapuram, Kerala",pin:"695001",km:1780},
 // Assam
 {n:"Guwahati, Assam",pin:"781001",km:2720}];

function seed(){const day=86400000,now=Date.now();
 const mk=(id,city,pin,km,wt,qbr,bids,award,dA,p,veh,body)=>({id,pickup:"Survey No-336&334, P2 Village-Vankas, Tal-Umbergaon, Valsad, Gujarat 396150",
  city:city,pin:pin,km:km,weight:wt,unit:"MT",vehicle:veh,body:body,commodity:"Aluminum Alloy",party:p||"",qbr:qbr,remarks:"",
  openT:now-dA*day-40*60000,closeT:now-dA*day,tenureMin:40,vendors:["annu","kk","krishna","ram"],cancelled:false,
  created:now-dA*day-45*60000,bids:bids,award:award});
 return {nextRfq:99205,nextTrip:502,toks:{},drivers:[],cities:CITIES.map(c=>({n:c.n,pin:c.pin,km:c.km})),
  factory:{id:"factory",pass:"factory123",name:"Krishang Alloy"},
  transporters:[{id:"annu",pass:"pass123",name:"Annu Roadlines",blocked:false},
    {id:"kk",pass:"pass123",name:"K K Roadlines Corporation",blocked:false},
    {id:"krishna",pass:"pass123",name:"Shree Krishna Road Carrier",blocked:false},
    {id:"ram",pass:"pass123",name:"Shree Ram Roadlines",blocked:false}],
  rfqs:[mk(99201,"Chakan, Maharashtra","410501",294,10,22000,{annu:[21699],kk:[21850],krishna:[22010]},{id:"annu",rate:21699},2,"MAP Alloys","Truck","Dala Body"),
        mk(99202,"Pune, Maharashtra","411001",320,24,44000,{annu:[42800],ram:[43500]},{id:"annu",rate:42800},2,"Aakar Foundry","Truck","Dala Body"),
        mk(99203,"Surat, Gujarat","395003",95,12,16500,{kk:[16200],krishna:[16350]},{id:"kk",rate:16200},1,"","Truck","Dala Body")],
  trips:[{id:501,party:"MAP Alloys",city:"Chakan, Maharashtra",pin:"410501",mob:"9822011204",gadi:"DD 01 E 9222 — SUNIL",rfq:99201,status:"done",
    startedAt:now-3*day,consentAt:now-3*day+10*60000,deliveredAt:now-3*day+8*3600000,
    notes:[{t:now-3*day+10*60000,txt:"✅ Driver consent — SIM tracking ON"},{t:now-3*day+8*3600000,txt:"🏁 Delivered — Chakan"}]}]};}
let DB=null;
// ---- PERMANENT DATA (free Upstash Redis REST). Env na ho to purani db.json file se chalega ----
const RURL=process.env.UPSTASH_REDIS_REST_URL,RT=process.env.UPSTASH_REDIS_REST_TOKEN;
async function rget(){const r=await fetch(RURL,{method:'POST',headers:{Authorization:'Bearer '+RT},body:JSON.stringify(['GET','nanamidb'])});const j=await r.json();return j.result;}
function rset(v){fetch(RURL,{method:'POST',headers:{Authorization:'Bearer '+RT},body:JSON.stringify(['SET','nanamidb',v])}).catch(()=>{});}
async function load(){DB=null;
 if(RURL&&RT){try{const v=await rget();if(v)DB=JSON.parse(v);}catch(e){DB=null;}}
 if(!DB){try{DB=JSON.parse(fs.readFileSync(DBF,'utf8'));}catch(e){DB=null;}}
 if(!DB||!DB.factory){DB=seed();save();}}
function save(){const v=JSON.stringify(DB);try{fs.writeFileSync(DBF,v);}catch(e){} if(RURL&&RT)rset(v);}

// ---------- ENGINE ----------
const nowI=()=>Date.now();
const isLive=r=>!r.cancelled&&!r.award&&r.openT<=nowI()&&nowI()<r.closeT;
const isClosed=r=>!r.cancelled&&nowI()>=r.closeT;
const finals=r=>{const o={};for(const k in r.bids)o[k]=r.bids[k][r.bids[k].length-1];return o;};
function ranks(r){const f=finals(r);const a=Object.keys(f).map(id=>({id:id,rate:f[id]})).sort((x,y)=>x.rate-y.rate);
 let rk=0,pv=null;a.forEach(x=>{rk=(pv!==null&&x.rate===pv)?rk:rk+1;x.rank=rk;pv=x.rate;});return a;}
function ratingOf(tid){const n=nowI(),from=n-10*86400000;let pts=[];
 DB.rfqs.filter(r=>r.closeT<n&&r.closeT>=from&&r.qbr>0&&!r.cancelled).forEach(r=>{const f=finals(r);
  if(f[tid]!==undefined)pts.push(Math.max(0,(r.qbr-f[tid])/r.qbr*100));});
 if(!pts.length)return 3.0;const avg=pts.reduce((a,b)=>a+b,0)/pts.length;
 return Math.min(5,Math.round((3+Math.min(2,avg))*10)/10);}

// ---------- AUTH ----------
const TOK=new Map();
const issue=u=>{const t=crypto.randomBytes(16).toString('hex');TOK.set(t,u);DB.toks=DB.toks||{};DB.toks[t]=u;save();return t;};
const auth=h=>{const a=h['authorization']||'';return a.startsWith('Bearer ')?TOK.get(a.slice(7)):null;};

// ---------- ROLE-SAFE STATE (sealed logic) ----------
function stateFor(u){
 const stars={};DB.transporters.forEach(t=>stars[t.id]=ratingOf(t.id));
 if(u.role==='factory'){
  const rfqs=DB.rfqs.filter(r=>!r.cancelled||true).map(r=>{ // company sees all incl cancelled flag
   const o=Object.assign({},r);
   if(isLive(r)||(!isClosed(r)&&!r.award)){o.bids={};o.bc=Object.keys(r.bids).length;}
   return o;});
  return {ok:true,me:{role:'factory',id:DB.factory.id,name:DB.factory.name},stars:stars,
   transporters:DB.transporters.map(t=>({id:t.id,name:t.name,blocked:t.blocked,pending:!!t.pending})),rfqs:rfqs,trips:DB.trips,cities:(DB.cities||CITIES),drivers:(DB.drivers||[]),serverNow:nowI()};
 }
 const t=DB.transporters.find(x=>x.id===u.id);
 if(!t)return {ok:false,err:'login phir se'};
 const mine=DB.rfqs.filter(r=>!r.cancelled&&r.vendors.indexOf(u.id)>=0).map(r=>{
  if(isLive(r)||(!isClosed(r)&&!r.award)){
   const o=Object.assign({},r);o.bids=r.bids[u.id]?{[u.id]:r.bids[u.id]}:{};delete o.party;delete o.award;return o;}
  const rk=ranks(r);const m=rk.find(x=>x.id===u.id);
  const o=Object.assign({},r);
  delete o.bids;delete o.party;delete o.award;delete o.vendors;
  o.won=!!(r.award&&r.award.id===u.id);o.myRank=m?m.rank:null;o.myRate=m?m.rate:null;
  return o;});
 return {ok:true,me:{role:'tpt',id:t.id,name:t.name},stars:stars,
  transporters:DB.transporters.map(x=>({id:x.id,name:x.name,blocked:x.blocked})),rfqs:mine,trips:[],cities:(DB.cities||CITIES),serverNow:nowI()};
}

// ---------- HTTP ----------
const J=(res,code,obj)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(obj));};
function body(req){return new Promise(res=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{try{res(JSON.parse(b||'{}'));}catch(e){res({});}});});}
const SRV=http.createServer(async(req,res)=>{
 const u=req.url.split('?')[0];
 if(req.method==='GET'&&(u==='/'||u==='/index.html')){
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
  return res.end(fs.readFileSync(path.join(__dirname,'index.html')));}
 if(u==='/api/state'&&req.method==='GET'){const me=auth(req.headers);if(!me)return J(res,401,{ok:false,err:'login phir se'});return J(res,200,stateFor(me));}
 if(req.method!=='POST')return J(res,404,{ok:false,err:'kuch nahi mila'});
 const d=await body(req);
 if(u==='/api/login'){
  if(d.id===DB.factory.id&&d.pass===DB.factory.pass)return J(res,200,{ok:true,token:issue({role:'factory'}),role:'factory',id:'factory',name:DB.factory.name});
  const t=DB.transporters.find(x=>x.id===String(d.id||'').toLowerCase());
  if(t&&t.pass===d.pass){if(t.blocked)return J(res,403,{ok:false,err:'ID block hai — company se baat karo'});
   if(t.pending)return J(res,403,{ok:false,err:'⏳ Khata ABHI approval mein hai — factory approve karegi, phir login hoga'});
   return J(res,200,{ok:true,token:issue({role:'tpt',id:t.id}),role:'tpt',id:t.id,name:t.name});}
  return J(res,401,{ok:false,err:'Galat ID ya password'});}
 if(u==='/api/register'){
  const rid=String(d.id||'').toLowerCase().replace(/[^a-z0-9_]/g,'');
  if(rid.length<3)return J(res,400,{ok:false,err:'ID kam se kam 3 akshar (a-z 0-9 _)'});
  if(!String(d.name||'').trim())return J(res,400,{ok:false,err:'Company ka naam likho'});
  if(String(d.pass||'').trim().length<4)return J(res,400,{ok:false,err:'Password kam se kam 4 akshar'});
  if(DB.transporters.some(x=>x.id===rid)||rid===DB.factory.id)return J(res,400,{ok:false,err:'Ye ID pehle se hai — doosri chuno'});
  DB.transporters.push({id:rid,pass:String(d.pass).trim(),name:String(d.name).trim().slice(0,40),blocked:false,pending:true});
  save();return J(res,200,{ok:true});}
 const me=auth(req.headers);if(!me)return J(res,401,{ok:false,err:'login phir se'});
 const isF=me.role==='factory';
 if(u==='/api/rfq'&&isF){
  const o=+d.openT,cl=+d.closeT;if(!(o<cl))return J(res,400,{ok:false,err:'Closing time, opening ke BAAD rakhna'});
  const vs=(d.vendors||[]).filter(v=>DB.transporters.some(t=>t.id===v&&!t.blocked&&!t.pending));
  if(!vs.length)return J(res,400,{ok:false,err:'Kam se kam 1 transporter chuno'});
  const r={id:DB.nextRfq++,pickup:String(d.pickup||'').slice(0,150)||"Survey No-336&334, P2 Village-Vankas, Tal-Umbergaon, Valsad, Gujarat 396150",
   city:String(d.city||''),pin:String(d.pin||''),km:+d.km||0,weight:Math.max(1,parseFloat(d.weight)||12),unit:'MT',
   vehicle:String(d.vehicle||'Truck'),body:String(d.body||'Dala Body'),commodity:String(d.commodity||'Aluminum Alloy'),
   party:String(d.party||'').slice(0,60),qbr:parseFloat(d.qbr)||0,remarks:String(d.remarks||'').slice(0,200),
   openT:o,closeT:cl,tenureMin:Math.round((cl-o)/60000),vendors:vs,cancelled:false,created:nowI(),bids:{},award:null};
  DB.rfqs.push(r);save();return J(res,200,{ok:true,id:r.id});}
 if(u==='/api/bid'&&!isF){
  const r=DB.rfqs.find(x=>x.id===+d.rfqId);if(!r)return J(res,404,{ok:false,err:'RFQ nahi mila'});
  if(r.vendors.indexOf(me.id)<0)return J(res,403,{ok:false,err:'Ye RFQ aapke liye nahi'});
  if(!isLive(r))return J(res,400,{ok:false,err:'⏰ Samay khatam — server ne rok diya'});
  const v=parseFloat(d.rate);if(!v||v<=0)return J(res,400,{ok:false,err:'Rate sahi likho'});
  r.bids[me.id]=r.bids[me.id]||[];
  if(r.bids[me.id].length>=3)return J(res,400,{ok:false,err:'3 mauke khatam — ab change nahi 🔒'});
  r.bids[me.id].push(v);save();return J(res,200,{ok:true});}
 if(u==='/api/award'&&isF){
  const r=DB.rfqs.find(x=>x.id===+d.rfqId);if(!r)return J(res,404,{ok:false,err:'RFQ nahi mila'});
  if(!isClosed(r)||r.award)return J(res,400,{ok:false,err:'Abhi award nahi ho sakta'});
  const f=finals(r);if(f[d.tid]===undefined)return J(res,400,{ok:false,err:'Bid nahi mila'});
  r.award={id:d.tid,rate:f[d.tid],ts:nowI()};save();return J(res,200,{ok:true});}
 if(u==='/api/cancel'&&isF){
  const r=DB.rfqs.find(x=>x.id===+d.rfqId);if(r&&!r.award){r.cancelled=true;save();return J(res,200,{ok:true});}
  return J(res,400,{ok:false,err:'Cancel nahi hua'});}
 if(u==='/api/city/add'&&isF){
  const nm=String(d.n||'').trim(),pin=String(d.pin||'').replace(/\D/g,''),km=Math.round(+d.km||0);
  if(nm.length<3)return J(res,400,{ok:false,err:'City ka naam likho (jaise: Talegaon, Maharashtra)'});
  if(pin.length!==6)return J(res,400,{ok:false,err:'PIN 6-ank ka daalo'});
  if(!(km>0))return J(res,400,{ok:false,err:'Doori (km) sahi likho'});
  DB.cities=DB.cities||[];
  if(DB.cities.some(c=>c.n.toLowerCase()===nm.toLowerCase()))return J(res,400,{ok:false,err:'Ye city pehle se hai'});
  DB.cities.push({n:nm.slice(0,50),pin:pin,km:km});save();return J(res,200,{ok:true});}
 if(u==='/api/city/remove'&&isF){DB.cities=(DB.cities||[]).filter(c=>c.n!==d.n);save();return J(res,200,{ok:true});}
 if(u==='/api/tpt/add'&&isF){
  const id=String(d.id||'').toLowerCase().replace(/[^a-z0-9_]/g,'');
  if(id.length<3||!d.name)return J(res,400,{ok:false,err:'ID+Naam dono likho'});
  if(DB.transporters.some(x=>x.id===id)||id===DB.factory.id)return J(res,400,{ok:false,err:'Ye ID pehle se hai'});
  DB.transporters.push({id:id,pass:String(d.pass||'').trim()||'pass123',name:String(d.name).slice(0,40),blocked:false});save();return J(res,200,{ok:true});}
 if(u==='/api/tpt/approve'&&isF){const t=DB.transporters.find(x=>x.id===d.id);if(!t)return J(res,404,{ok:false,err:'nahi mila'});
  t.pending=false;save();return J(res,200,{ok:true});}
 if(u==='/api/tpt/block'&&isF){const t=DB.transporters.find(x=>x.id===d.id);if(!t)return J(res,404,{ok:false,err:'nahi mila'});
  t.blocked=!!d.blocked;save();return J(res,200,{ok:true});}
 if(u==='/api/tpt/remove'&&isF){DB.transporters=DB.transporters.filter(x=>x.id!==d.id);save();return J(res,200,{ok:true});}
 if(u==='/api/tpt/resetPass'&&isF){const t=DB.transporters.find(x=>x.id===d.id);if(!t)return J(res,404,{ok:false,err:'nahi mila'});
  t.pass=String(d.pass||'').trim()||'pass123';save();return J(res,200,{ok:true});}
 if(u==='/api/tpt/rename'&&isF){const t=DB.transporters.find(x=>x.id===d.id);if(!t)return J(res,404,{ok:false,err:'nahi mila'});
  t.name=String(d.name||t.name).slice(0,40);save();return J(res,200,{ok:true});}
 if(u==='/api/me'){
  const acc=isF?DB.factory:DB.transporters.find(x=>x.id===me.id);
  if(d.name){acc.name=String(d.name).slice(0,40);save();return J(res,200,{ok:true,name:acc.name});}
  if(d.newPass){if(acc.pass!==d.oldPass)return J(res,400,{ok:false,err:'Purana password galat'});
   if(String(d.newPass).trim().length<4)return J(res,400,{ok:false,err:'Kam se kam 4 akshar'});
   acc.pass=String(d.newPass).trim();save();return J(res,200,{ok:true});}
  return J(res,400,{ok:false,err:'kuch bhejo'});}
 if(u==='/api/trip'&&isF){
  const mob=String(d.mob||'').replace(/\D/g,'');
  if(!String(d.party||'').trim())return J(res,400,{ok:false,err:'Party ka naam likho'});
  if(mob.length!==10)return J(res,400,{ok:false,err:'Sahi 10-ank mobile daalo'});
  if(!String(d.gadi||'').trim())return J(res,400,{ok:false,err:'Gaadi number chahiye'});
  const t={id:DB.nextTrip++,party:String(d.party).slice(0,80),city:String(d.city||''),pin:String(d.pin||''),mob:mob,
   dn:String(d.dn||'').slice(0,30),from:String(d.from||'').slice(0,120)||'Vankas, Umbergaon, Gujarat',
   gadi:String(d.gadi).slice(0,30),rfq:+d.rfq||0,status:'pend',startedAt:nowI(),consentAt:0,deliveredAt:0,
   notes:[{t:nowI(),txt:'📱 Consent SMS bheja — '+mob}]};
  DB.trips.unshift(t);
  DB.drivers=DB.drivers||[];const ex=DB.drivers.find(x=>x.g===t.gadi);
  if(ex){ex.dn=t.dn;ex.mob=mob;}else if(t.gadi)DB.drivers.push({g:t.gadi,dn:t.dn,mob:mob});
  save();return J(res,200,{ok:true,id:t.id});}
 if(u==='/api/trip/status'&&isF){
  const t=DB.trips.find(x=>x.id===+d.tripId);if(!t)return J(res,404,{ok:false,err:'Trip nahi mila'});
  if(d.status==='live'&&t.status==='pend'){t.status='live';t.consentAt=nowI();t.notes.push({t:nowI(),txt:'✅ Driver ne SMS me ✓ dabaya — SIM tracking ON 🛰️'});}
  else if(d.status==='done'&&t.status==='live'){t.status='done';t.deliveredAt=nowI();t.notes.push({t:nowI(),txt:'🏁 Delivered — '+t.party+' ('+t.city+')'});}
  else return J(res,400,{ok:false,err:'Status badal nahi sakta'});
  save();return J(res,200,{ok:true});}
 if(u==='/api/reset'&&isF){DB=seed();save();return J(res,200,{ok:true});}
 return J(res,404,{ok:false,err:'kuch nahi mila'});
});
load().then(()=>{Object.keys(DB.toks||{}).forEach(k=>TOK.set(k,DB.toks[k]));
 SRV.listen(PORT,'0.0.0.0',()=>console.log('🚚 NANAMI v3.4 LIVE on port '+PORT+(RURL?' + PERMANENT DB ☁️':' (file mode)')));});
