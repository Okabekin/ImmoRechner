/* ===== Eingaben ===== */
const GROUPS=[
 {t:"Objekt",open:true,f:[
  ["stadtteil","Stadtteil","",null,null,"STADTTEILE"],
  ["kaufpreis","Kaufpreis","€",1000],["marktwert","Marktwert, falls höher (optional)","€",1000,"leer = Kaufpreis"],
  ["flaeche","Wohnfläche","m²",0.1],["baujahr","Baujahr","",1],
  ["miete","Kaltmiete","€/Mon.",5,"leer = Schätzung aus Stadtteil"],["hausgeld","Hausgeld gesamt","€/Mon.",1,"leer = Schätzung"],
  ["nichtUml","davon nicht umlegbar","€/Mon.",1,"leer = 35 % vom Hausgeld"],["ruecklageQm","Eigene Rücklage","€/m²·Mon.",0.05,"Reparaturen in der Wohnung"],
  ["ausfall","Mietausfall","% Miete",0.5],["inventar","Inventar separat (EBK)","€",500,"ohne Grunderwerbsteuer, 10 J. AfA"],
  ["sonderumlage","Sonderumlage Jahr 1","€",500]]},
 {t:"Kaufnebenkosten",f:[
  ["grest","Grunderwerbsteuer","%",0.1,"Hamburg 5,5 %"],["notar","Notar + Grundbuch","%",0.1],["makler","Makler (Käuferanteil)","%",0.01,"privat: 0, sonst meist 3,57 %"]]},
 {t:"Finanzierung",open:true,f:[
  ["ekModus","Eigenkapital","",null,null,[["nk","= Nebenkosten (Kaufpreis voll finanziert)"],["betrag","eigener Betrag"]]],
  ["ekBetrag","Eigenkapital-Betrag","€",1000,"nur bei „eigener Betrag“"],
  ["zins","Sollzins","%",0.05],["tilg","Anfangstilgung","%",0.1],
  ["bindung","Zinsbindung","Jahre",1],["anschlussZins","Anschlusszins","%",0.1,"Stresstest: +2 Prozentpunkte"],
  ["anschlussTilg","Tilgung danach","%",0.1]]},
 {t:"Steuer & AfA",open:true,f:[
  ["steuer","Grenzsteuersatz","%",1,"inkl. Soli/KiSt, bei 50–70 T€ Brutto ca. 35–42 %"],["gebAnteil","Gebäudeanteil","%",1,"Finanzamt-Arbeitshilfe oft 40–60 %"],
  ["rnd","Restnutzungsdauer-Gutachten nutzen","chk"],
  ["rndJahre","Restnutzungsdauer laut Gutachten","Jahre",1,"25 J. = 4 % AfA, 20 J. = 5 %"],["gutachten","Gutachterkosten","€",100,"sofort absetzbar"],
  ["brw","Bodenrichtwert (BORIS)","€/m²",10,"optional, für Kaufpreisaufteilung"],["grundstueck","Grundstücksfläche","m²",1],
  ["mea","Miteigentumsanteil","/1000",0.1,"aus Teilungserklärung"]]},
 {t:"Prognose & Ziel",open:true,f:[
  ["halte","Haltedauer","Jahre",1,"ab 10 J. steuerfreier Verkauf"],["wz","Wertzuwachs","% p. a.",0.1],
  ["mietSteig","Mietsteigerung","% p. a.",0.1],["kostSteig","Kostensteigerung","% p. a.",0.1],
  ["verkaufskosten","Verkaufskosten","% vom Wert",0.5],["etf","ETF-Rendite nach Steuern","%",0.1],
  ["zielIrr","Ziel-Rendite (IRR)","%",0.5,"für den Maximalpreis"],["liegenschaftszins","Liegenschaftszins","%",0.1,"Marktbericht Gutachterausschuss, ETW HH ca. 1,5–3 %"]]},
 {t:"Eigennutzung",f:[
  ["vergleichsmiete","Kaltmiete vergleichbare Wohnung","€/Mon.",5,"leer = Kaltmiete oben"],["tagesgeld","Zins für Erspartes","%",0.1,"Was dein Eigenkapital sonst bringen würde"]]}
];
const BASE={stadtteil:"Eidelstedt",kaufpreis:155000,marktwert:0,flaeche:39.6,baujahr:1963,miete:515,hausgeld:219,nichtUml:66,ruecklageQm:0.6,ausfall:2,inventar:0,sonderumlage:0,
 grest:5.5,notar:2,makler:0,ekModus:"nk",ekBetrag:30000,zins:4,tilg:2,bindung:10,anschlussZins:6,anschlussTilg:2,
 steuer:35,gebAnteil:70,rnd:false,rndJahre:25,gutachten:1000,brw:0,grundstueck:0,mea:0,
 halte:10,wz:1.5,mietSteig:2,kostSteig:2,verkaufskosten:0,etf:6,zielIrr:6,liegenschaftszins:2.5,vergleichsmiete:475,tagesgeld:3};
const PRESETS={
 eid:Object.assign({},BASE),
 l6:Object.assign({},BASE,{stadtteil:"Hamburg (Durchschnitt)",kaufpreis:200000,marktwert:0,flaeche:50,baujahr:1965,miete:675,hausgeld:300,nichtUml:110,ruecklageQm:0.8,makler:3.57,zins:3.8,gebAnteil:50,vergleichsmiete:675}),
 l3:Object.assign({},BASE,{stadtteil:"Hamburg (Durchschnitt)",kaufpreis:300000,marktwert:0,flaeche:60,baujahr:1970,miete:840,hausgeld:300,nichtUml:120,ruecklageQm:50/60,makler:3.57,ekModus:"betrag",ekBetrag:60000,zins:3.8,gebAnteil:70,vergleichsmiete:840})
};
let P=Object.assign({},BASE);
try{const s=JSON.parse(localStorage.getItem("immo-rechner-v1")||"null"); if(s) P=Object.assign({},BASE,s);}catch(e){}

const $=s=>document.querySelector(s);
const nf=(d)=>new Intl.NumberFormat("de-DE",{maximumFractionDigits:d,minimumFractionDigits:d});
const eur=(v,d=0)=>isFinite(v)?nf(d).format(Math.round(v*Math.pow(10,d))/Math.pow(10,d)).replace(/^-/,"− ")+" €":"–";
const sgn=(v,d=0)=>isFinite(v)?(v>0.5?"+ ":"")+eur(v,d):"–";
const pct=(v,d=1)=>isFinite(v)?nf(d).format(v).replace(/^-/,"− ")+" %":"–";
const num=(v,d=1)=>isFinite(v)?nf(d).format(v):"–";
const cls=v=>v<-0.5?"neg":(v>0.5?"pos":"");
const pill=(kind,txt)=>`<span class="pill ${kind}">${txt}</span>`;

const ib=id=>INFO[id]?`<button type="button" class="ib" data-pop="info:${id}" aria-label="Erklärung">i</button>`:"";
const ip=()=>"";
const OPT_LEER=new Set(["miete","hausgeld","nichtUml","vergleichsmiete","marktwert","kaufpreis","flaeche","baujahr"]);
const EST_FELDER=["miete","hausgeld","nichtUml","vergleichsmiete"];
function buildInputs(){
  const box=$("#inputs"); let h="";
  for(const g of GROUPS){
    h+=`<details class="grp"${g.open?" open":""}><summary>${g.t}</summary><div class="fields">`;
    for(const [id,lab,u,step,hint,opts] of g.f){
      if(u==="chk"){h+=`<div class="f wide"><div class="lab"><label class="chk"><input type="checkbox" id="${id}"> ${lab}</label>${ib(id)}</div>${ip(id)}</div>`;continue;}
      if(opts){const o=opts==="STADTTEILE"?Object.keys(MIETEN).map(k=>[k,k]):opts;
        h+=`<div class="f wide"><div class="lab"><label for="${id}">${lab}</label>${ib(id)}</div><div class="in"><select id="${id}">${o.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join("")}</select></div>${ip(id)}</div>`;continue;}
      const wide=hint&&hint.length>34?" wide":"";
      h+=`<div class="f${wide}"><div class="lab"><label for="${id}">${lab}</label>${ib(id)}</div><div class="in"><input id="${id}" type="number" inputmode="decimal" step="${step}"><span class="u">${u}</span></div>${hint?`<span class="hint" id="hint-${id}" data-base="${hint}">${hint}</span>`:""}${ip(id)}</div>`;
    }
    h+=`</div></details>`;
  }
  box.innerHTML=h;
  box.addEventListener("focusin",e=>{ if(e.target.classList&&e.target.classList.contains("est")) e.target.select(); });
  box.addEventListener("focusout",e=>{ if(EST_FELDER.includes(e.target.id)) render(); });
  box.addEventListener("input",e=>{const el=e.target; if(!el.id) return;
    if(el.type==="checkbox") P[el.id]=el.checked; else if(el.tagName==="SELECT") P[el.id]=el.value;
    else { const v=parseFloat(el.value); P[el.id]=isFinite(v)?v:(OPT_LEER.has(el.id)?null:0); el.classList.remove("est"); }
    save(); render();});
}
function fillInputs(){ for(const k in P){ const el=document.getElementById(k); if(!el) continue;
  if(el.type==="checkbox") el.checked=!!P[k]; else if(el.tagName==="SELECT") el.value=P[k];
  else el.value=(P[k]===null||(k==="marktwert"&&!P[k]))?"":+(+P[k]).toFixed(4); } }
function save(){ try{localStorage.setItem("immo-rechner-v1",JSON.stringify(P));}catch(e){} }

/* ===== Ausgabe ===== */
function row(label,v,c,extra){return `<tr${extra?` class="${extra}"`:""}><td>${label}</td><td class="num ${c||""}">${v}</td></tr>`;}
function render(){
  const fehlt=["kaufpreis","flaeche","baujahr"].filter(k=>!(P[k]>0));
  if(fehlt.length){
    for(const k of EST_FELDER){ const el=document.getElementById(k); if(el&&P[k]===null&&document.activeElement!==el){ el.value=""; el.classList.remove("est"); } }
    const namen={kaufpreis:"Kaufpreis",flaeche:"Wohnfläche",baujahr:"Baujahr"};
    LAST_SUMMARY="Noch kein Objekt eingegeben."; $("#out").innerHTML=`<section class="step leer"><h2>Neues Objekt</h2><p class="lead">Trag links mindestens <b>${fehlt.map(k=>namen[k]).join(", ")}</b> ein. Alles andere kannst du leer lassen: Fehlt die Miete oder das Hausgeld, schätzt der Rechner sie aus dem Stadtteil und zeigt dir den Wert direkt im Feld.</p><p class="lead">Deine Einstellungen zu Finanzierung, Steuer und Prognose sind geblieben.</p></section>`;
    return;
  }
  const {q:p,est}=schaetzen(P);
  for(const k of EST_FELDER){ const el=document.getElementById(k), hint=document.getElementById("hint-"+k); if(!el) continue;
    const geschaetzt=P[k]===null;
    if(geschaetzt&&document.activeElement!==el){ el.value=Math.round(p[k]); el.classList.add("est"); }
    if(!geschaetzt) el.classList.remove("est");
    if(hint){ hint.textContent=geschaetzt?(est[k]?"Geschätzt: "+est[k].replace(/^[^0-9]*/,"")+". Eigenen Wert eintragen, wenn bekannt.":"Geschätzt: wie Kaltmiete oben."):hint.dataset.base; hint.classList.toggle("warn",geschaetzt); } }
  const s=simulate(p), sStd=simulate(p,{rnd:false}), sRnd=simulate(p,{rnd:true});
  const y1=s.years[0], KP=p.kaufpreis, jm=p.miete*12;
  const faktor=KP/jm, brutto=jm/KP*100;
  const rein=jm*(1-p.ausfall/100)-p.nichtUml*12-p.ruecklageQm*p.flaeche*12;
  const netto=rein/s.gesamt*100;
  const objRendite=netto+p.wz, fkEk=s.ek>0?s.darlehen/s.ek:Infinity;
  const levEst=objRendite+(objRendite-p.zins)*fkEk;
  const ertragswert=p.liegenschaftszins>0?(jm-p.nichtUml*12)/(p.liegenschaftszins/100):NaN;
  const mieteQm=p.miete/p.flaeche;
  const ekJ1=(y1.cfNach+y1.tilg+s.wert0*p.wz/100)/s.ek*100;
  const irrMain=s.irr*100;
  const mp=maxPreis(p,p.zielIrr/100);
  const bindEnd=s.years[Math.min(p.bindung,s.N)-1];
  // Bewertungen
  const kF= faktor<22?["good","günstig"]:faktor<=30?["warn","HH-üblich"]:["bad","teuer"];
  const kN= netto>=p.zins?["good","über Zins"]:netto>=p.zins-1?["warn","knapp unter Zins"]:["bad","deutlich unter Zins"];
  const kC= y1.cfNach/12>=0?["good","trägt sich"]:y1.cfNach/12>-200?["warn","Zuzahlung"]:["bad","hohe Zuzahlung"];
  const kI= !isFinite(irrMain)?["warn","–"]:irrMain>=p.etf+1?["good","schlägt ETF"]:irrMain>=p.etf-1?["warn","≈ ETF"]:["bad","unter ETF"];
  const kM= !isFinite(mp)?["bad","Ziel unerreichbar"]:mp===Infinity?["good","weit über Preis"]:mp>=KP?["good",`${pct((mp/KP-1)*100,0)} Luft`]:["bad",`${pct((mp/KP-1)*100,0)} nötig`];
  let h="";
  const estL=Object.values(est);
  if(estL.length) h+=`<div class="schaetz">${pill("warn","Geschätzt")}<span>Im Inserat fehlte etwas, deshalb rechnet der Rechner mit: ${estL.join(", ")}. Vor einem Kauf durch echte Zahlen ersetzen.</span></div>`;
  const mon=y1.miete/12, f2=v=>eur(v,0);
  const zuzNetto=-s.years.reduce((a,r)=>a+r.cfNach,0), lastY=s.years[s.N-1];
  POPS.kpi1=`<b>Kaufpreisfaktor = Kaufpreis ÷ Jahreskaltmiete</b><table>
    <tr><td>Kaufpreis</td><td>${f2(KP)}</td></tr><tr><td>Jahreskaltmiete (${f2(p.miete)} × 12)</td><td>${f2(jm)}</td></tr>
    <tr class="sum"><td>Faktor</td><td>${num(faktor,1)}</td></tr></table>
    <p>Du zahlst ${num(faktor,1)} Jahresmieten für die Wohnung. Hamburg: unter 22 gut, 25 bis 30 üblich, über 30 teuer.</p>`;
  POPS.kpi2=`<b>Nettomietrendite = Reinertrag ÷ Gesamtkosten</b><table>
    <tr><td>Jahreskaltmiete</td><td>${f2(jm)}</td></tr><tr><td>− Mietausfall ${pct(p.ausfall,1)}</td><td>${f2(-jm*p.ausfall/100)}</td></tr>
    <tr><td>− nicht umlegbar (${f2(p.nichtUml)} × 12)</td><td>${f2(-p.nichtUml*12)}</td></tr><tr><td>− eigene Rücklage (${num(p.ruecklageQm,2)} € × ${num(p.flaeche,1)} m² × 12)</td><td>${f2(-p.ruecklageQm*p.flaeche*12)}</td></tr>
    <tr class="sum"><td>= Reinertrag</td><td>${f2(rein)}</td></tr><tr><td>Gesamtkosten (Kaufpreis + ${f2(s.nk)} Nebenkosten)</td><td>${f2(s.gesamt)}</td></tr>
    <tr class="sum"><td>Nettomietrendite</td><td>${pct(netto,2)}</td></tr></table>
    <p>Was das Objekt ohne Kredit bringt. Liegt sie unter dem Kreditzins (${pct(p.zins,2)}), kostet jeder geliehene Euro mehr, als er an Miete bringt.</p>`;
  POPS.kpi3=`<b>Cashflow im ersten Jahr, pro Monat</b><table>
    <tr><td>Kaltmiete</td><td>${f2(mon)}</td></tr><tr><td>− Mietausfall</td><td>${f2(-y1.ausfall/12)}</td></tr>
    <tr><td>− nicht umlegbares Hausgeld</td><td>${f2(-y1.nu/12)}</td></tr><tr><td>− eigene Rücklage</td><td>${f2(-y1.rue/12)}</td></tr>
    ${(y1.gut+y1.su)?`<tr><td>− Gutachten/Sonderumlage ÷ 12</td><td>${f2(-(y1.gut+y1.su)/12)}</td></tr>`:""}
    <tr><td>− Kreditrate (Zins ${f2(y1.zins/12)} + Tilgung ${f2(y1.tilg/12)})</td><td>${f2(-(y1.zins+y1.tilg)/12)}</td></tr>
    <tr class="sum"><td>= vor Steuern</td><td>${f2(y1.cfVor/12)}</td></tr><tr><td>± Steuer (${pct(p.steuer,0)} auf ${f2(y1.ergebnis)} Ergebnis ÷ 12)</td><td>${sgn(y1.steuer/12)}</td></tr>
    <tr class="sum"><td>= nach Steuern</td><td>${f2(y1.cfNach/12)}</td></tr></table>
    <p>So viel geht monatlich auf deinem Konto ab oder kommt dazu. Die Tilgung von ${f2(y1.tilg/12)} ist darin als Ausgabe enthalten, landet aber als Vermögen bei dir.</p>`;
  POPS.kpi4=`<b>IRR: Rendite pro Jahr auf alles, was du einzahlst</b><table>
    <tr><td>Eigenkapital am Anfang</td><td>${f2(s.ek)}</td></tr><tr><td>Zuzahlungen über ${s.N} Jahre (nach Steuern)</td><td>${f2(Math.max(0,zuzNetto))}</td></tr>
    <tr><td>Wert nach ${s.N} Jahren (+${pct(p.wz,1)} pro Jahr)</td><td>${f2(lastY.wert)}</td></tr><tr><td>− Restschuld</td><td>${f2(-lastY.restschuld)}</td></tr>
    ${(s.vk+s.spekSteuer)?`<tr><td>− Verkaufskosten/Steuer</td><td>${f2(-(s.vk+s.spekSteuer))}</td></tr>`:""}
    <tr class="sum"><td>= Erlös für dich</td><td>${f2(s.erloes)}</td></tr><tr class="sum"><td>IRR</td><td>${pct(irrMain,1)}</td></tr></table>
    <p>Der Zinssatz, den ein Sparkonto bräuchte, um dir bei denselben Einzahlungen am Ende genauso viel zu bringen. Vergleich: ETF ca. ${pct(p.etf,1)} nach Steuern.</p>`;
  POPS.kpi5=`<b>Maximalpreis: höchster Kaufpreis für ${pct(p.zielIrr,1)} IRR</b>
    <p>Der Rechner probiert so lange Kaufpreise durch, bis der IRR genau ${pct(p.zielIrr,1)} ergibt. Miete, Marktwert und alle anderen Eingaben bleiben gleich, Nebenkosten und Kredit passen sich an. Gerechnet mit ${pct(p.wz,1)} Wertzuwachs und ${p.rnd?"Gutachten-AfA":"normaler AfA"}.</p>
    <table><tr><td>Angebotspreis</td><td>${f2(KP)}</td></tr><tr><td>Maximalpreis</td><td>${mp===Infinity?"> "+f2(KP*2.5):f2(mp)}</td></tr>
    <tr class="sum"><td>Spielraum</td><td>${isFinite(mp)?sgn(mp-KP):"–"}</td></tr></table>
    <p>Darüber nicht kaufen. Das ist dein Verhandlungsziel.</p>`;
  const kpi=(k,l,v,pl)=>`<div class="kpi" data-pop="${k}" tabindex="0"><span class="l">${l}</span><span class="v">${v}</span>${pl}<span class="how">Wie berechnet?</span></div>`;
  h+=`<div class="kpis">
   ${kpi("kpi1","Kaufpreisfaktor",num(faktor,1),pill(...kF))}
   ${kpi("kpi2","Nettomietrendite",pct(netto,2),pill(...kN))}
   ${kpi("kpi3","Cashflow n. St. Jahr 1",eur(y1.cfNach/12),pill(...kC))}
   ${kpi("kpi4",`IRR ${s.N} J. bei ${pct(p.wz,1)} WZ`,pct(irrMain,1),pill(...kI))}
   ${kpi("kpi5",`Maximalpreis für ${pct(p.zielIrr,1)}`,mp===Infinity?"> "+eur(KP*2.5):eur(mp),pill(...kM))}
  </div>`;

  // 1 Schnellcheck
  h+=`<section class="step" id="schnellcheck"><h2><span class="n">01</span>Schnellcheck</h2><p class="lead">Lohnt es sich weiterzulesen? Faktor unter 22 ist in Hamburg gut, 25–30 normal, über 30 trägt sich nur über Wertzuwachs.</p>
  <div class="cols"><div class="tw"><table><tbody>
   ${row("Preis pro m²",eur(KP/p.flaeche))}${row("Miete pro m²",eur(mieteQm,2))}
   ${row("Jahreskaltmiete",eur(jm))}${row("Kaufpreisfaktor",num(faktor,1))}
   ${row("Bruttomietrendite",pct(brutto,2))}${row("Reinertrag (Miete − Ausfall − nicht umlegbar − Rücklage)",eur(rein))}
   ${row("Nettomietrendite (auf Gesamtkosten)",pct(netto,2),"","sum")}
  </tbody></table></div><div class="tw"><table><tbody>
   ${row("Grunderwerbsteuer",eur(s.grest))}${row("Notar + Grundbuch",eur(s.notar))}${row("Makler",eur(s.makler))}
   ${row("Kaufnebenkosten",eur(s.nk)+` <small>(${pct(s.nk/KP*100,1)})</small>`,"","sub")}
   ${row("Gesamtkosten",eur(s.gesamt),"","sum")}
   ${row(`Ertragswert (Reinertrag ÷ ${pct(p.liegenschaftszins,1)} Liegenschaftszins)`,eur(ertragswert))}
   ${row("Kaufpreis vs. Ertragswert",isFinite(ertragswert)?pct((KP/ertragswert-1)*100,0):"–",KP>ertragswert?"neg":"pos")}
  </tbody></table></div></div></section>`;

  // 2 Hebel
  const hebelPos=netto>p.zins;
  h+=`<section class="step" id="hebel"><h2><span class="n">02</span>Hebel: Objektrendite gegen Zins</h2><p class="lead">Der Kredit lohnt sich nur, wenn das Objekt mehr bringt als er kostet. Objektrendite = Nettomietrendite + Wertzuwachs.</p>
  <div class="cols"><div class="tw"><table><tbody>
   ${row("Nettomietrendite",pct(netto,2))}${row("+ Wertzuwachs",pct(p.wz,2))}${row("= Objektrendite",pct(objRendite,2),"","sum")}
   ${row("Kreditzins",pct(p.zins,2))}${row("Fremdkapital : Eigenkapital",isFinite(fkEk)?num(fkEk,1)+" : 1":"nur Fremdkapital")}
   ${row("EK-Rendite nach Hebelformel (vor Steuern, statisch)",pct(levEst,1),cls(levEst),"sum")}
  </tbody></table></div>
  <div><div class="verdict">${hebelPos?pill("good","Positiver Hebel ohne Wertzuwachs"):objRendite>p.zins?pill("warn","Hebel positiv nur mit Wertzuwachs"):pill("bad","Negativer Hebel")}</div>
  <p class="note">${hebelPos?"Schon die Miete allein bringt mehr als der Kredit kostet. Jeder geliehene Euro verdient Geld, auch ohne Wertzuwachs.":
   objRendite>p.zins?`Die Miete allein (${pct(netto,2)}) liegt unter dem Zins (${pct(p.zins,2)}). Du wettest auf Wertzuwachs: Bei ${pct(p.wz,1)} pro Jahr wird der Hebel positiv, ab ca. <b>${pct(p.zins-netto,1)} Wertzuwachs</b> ist die Gewinnschwelle erreicht.`:
   `Auch mit ${pct(p.wz,1)} Wertzuwachs bringt das Objekt weniger als der Kredit kostet. Mehr Kredit macht die Rendite hier schlechter, nicht besser.`}
   Formel: Objektrendite + (Objektrendite − Zins) × FK ÷ EK.</p></div></div></section>`;

  // 3 Finanzierung
  h+=`<section class="step" id="finanzierung"><h2><span class="n">03</span>Finanzierung</h2><p class="lead">Annuitätendarlehen, monatliche Rate. Banken verlangen bei 100-%-Finanzierung meist 0,2–0,5 Prozentpunkte Aufschlag.</p>
  <div class="cols"><div class="tw"><table><tbody>
   ${row("Eigenkapital",eur(s.ek))}${row("Darlehen",eur(s.darlehen))}${row("Beleihung (Darlehen ÷ Kaufpreis)",pct(s.darlehen/KP*100,0))}
   ${row("Monatsrate",eur(s.rate0),"","sum")}${row("Zins Jahr 1",eur(y1.zins))}${row("Tilgung Jahr 1",eur(y1.tilg))}
  </tbody></table></div><div class="tw"><table><tbody>
   ${row(`Restschuld nach ${Math.min(p.bindung,s.N)} Jahren`,eur(bindEnd.restschuld))}
   ${row(`Rate danach bei ${pct(p.anschlussZins,1)} + ${pct(p.anschlussTilg,1)} Tilgung`,eur(bindEnd.restschuld*(p.anschlussZins+p.anschlussTilg)/1200))}
   ${row(`Stresstest: Rate bei ${pct(p.anschlussZins+2,1)}`,eur(bindEnd.restschuld*(p.anschlussZins+2+p.anschlussTilg)/1200),"neg")}
   ${row("Liquiditätsreserve (6 Raten + 7.500 € Sonderumlage-Puffer)",eur(s.rate0*6+7500))}
  </tbody></table></div></div></section>`;

  // 4 Cashflow
  const cfTab=(x,lab)=>{const a=x.years[0]; return `<div class="tw"><table><thead><tr><th>${lab}</th><th class="num">€/Monat</th></tr></thead><tbody>
   ${row("Kaltmiete",eur(a.miete/12))}${row("− Mietausfall",eur(-a.ausfall/12),"neg")}${row("− nicht umlegbares Hausgeld",eur(-a.nu/12),"neg")}
   ${row("− eigene Rücklage",eur(-a.rue/12),"neg")}${(a.gut+a.su)?row("− Gutachten / Sonderumlage (auf 12 Mon.)",eur(-(a.gut+a.su)/12),"neg"):""}
   ${row("− Zins",eur(-a.zins/12),"neg")}${row("− Tilgung",eur(-a.tilg/12),"neg")}
   ${row("= Cashflow vor Steuern",eur(a.cfVor/12),cls(a.cfVor),"sum")}
   ${row("± Steuereffekt",sgn(a.steuer/12),cls(a.steuer))}
   ${row("= Cashflow nach Steuern",eur(a.cfNach/12),cls(a.cfNach),"sum")}
   ${row("+ Tilgung (gehört dir)",sgn(a.tilg/12),"pos")}
   ${row("= Vermögensbilanz ohne Wertzuwachs",sgn((a.cfNach+a.tilg)/12),cls(a.cfNach+a.tilg),"sum")}
  </tbody></table></div>`;};
  h+=`<section class="step" id="cashflow"><h2><span class="n">04</span>Cashflow im ersten Jahr</h2><p class="lead">Links mit normaler AfA (${pct(sStd.afaSatz,1)} wegen Baujahr ${p.baujahr}), rechts mit Restnutzungsdauer-Gutachten (${pct(sRnd.afaSatz,1)}). Gutachterkosten im ersten Jahr inklusive.</p>
  <div class="cols">${cfTab(sStd,"Normale AfA")}${cfTab(sRnd,"Mit Gutachten")}</div>
  <p class="note">Das Gutachten bringt dir <b>${eur((sRnd.afaGeb-sStd.afaGeb)*p.steuer/100/12)} pro Monat</b> mehr Steuerersparnis (ab Jahr 2). ${p.baujahr>=1980?"Bei Baujahr ab ca. 1980 ist eine verkürzte Restnutzungsdauer aber schwer zu begründen.":"Bei Häusern vor ca. 1980 fast immer prüfen."}</p></section>`;

  // 5 Steuer
  const brwOk=p.brw>0&&p.grundstueck>0&&p.mea>0;
  const boden=brwOk?p.brw*p.grundstueck*p.mea/1000:0, gebVorschlag=brwOk?Math.max(0,(1-boden/(KP-(p.inventar||0)))*100):NaN;
  const grenze15=s.gebBasis*0.15;
  h+=`<section class="step" id="steuer"><h2><span class="n">05</span>Steuer im ersten Jahr</h2><p class="lead">Einkünfte aus Vermietung. Ein Verlust wird mit deinem Gehalt verrechnet. Die Tilgung ist nicht absetzbar.</p>
  <div class="cols"><div class="tw"><table><tbody>
   ${row("Mieteinnahmen",eur(y1.miete))}${row("− Mietausfall",eur(-y1.ausfall),"neg")}${row("− Schuldzinsen",eur(-y1.zins),"neg")}
   ${row(`− AfA (${pct(s.afaSatz,2)} auf ${eur(s.gebBasis)}${p.inventar?" + Inventar 10 %":""})`,eur(-y1.afa),"neg")}
   ${row("− nicht umlegbares Hausgeld, Rücklage",eur(-(y1.nu+y1.rue)),"neg")}
   ${(y1.gut+y1.su)?row("− Gutachten, Sonderumlage",eur(-(y1.gut+y1.su)),"neg"):""}
   ${row("= Steuerliches Ergebnis",eur(y1.ergebnis),cls(y1.ergebnis),"sum")}
   ${row(`Steuereffekt bei ${pct(p.steuer,0)}`,sgn(y1.steuer)+(y1.steuer>0?" Erstattung":" Nachzahlung"),cls(y1.steuer),"sum")}
  </tbody></table></div><div class="tw"><table><tbody>
   ${row("AfA-Basis Gebäude (inkl. anteiliger Nebenkosten)",eur(s.gebBasis))}
   ${row("AfA pro Jahr",eur(s.afaGeb))}
   ${row("15-%-Grenze Renovierung in den ersten 3 Jahren (netto)",eur(grenze15),"","sum")}
   ${row("entspricht brutto inkl. 19 % MwSt ca.",eur(grenze15*1.19))}
   ${brwOk?row(`Bodenwert (${eur(p.brw)}/m² × ${num(p.grundstueck,0)} m² × ${num(p.mea,1)}/1000)`,eur(boden))+row("Realistischer Gebäudeanteil für den Notarvertrag",pct(gebVorschlag,0),"","sum"):row("Gebäudeanteil aus Bodenrichtwert (Eingaben unter Steuer & AfA)","–")}
   ${p.inventar?row("Grunderwerbsteuer gespart durch Inventar separat",eur(p.inventar*p.grest/100),"pos"):""}
  </tbody></table></div></div>
  <p class="note">Mehr über 15-%-Grenze, Kaufpreisaufteilung und Inventar in Lektion 6, Abschnitt 5. Liegt dein Gebäudeanteil unter dem Wert aus dem Bodenrichtwert, lohnt sich die Aufteilung im Notarvertrag. Jeder Prozentpunkt Gebäudeanteil bringt hier ${eur(s.gebBasis/p.gebAnteil*s.afaSatz/100*p.steuer/100)} Steuerersparnis pro Jahr.</p></section>`;

  // 6 Rendite
  const wzs=[0,1.5,2.5]; if(!wzs.includes(p.wz)) wzs.push(p.wz);
  const irrRow=(ov,lab)=>`<tr><td>${lab}</td>${wzs.map(w=>{const v=simulate(p,Object.assign({wz:w},ov)).irr*100; const hl=(w===p.wz&&ov.rnd===!!p.rnd)?" hl":""; return `<td class="num ${cls(v-p.etf)}${hl}">${pct(v,1)}</td>`;}).join("")}</tr>`;
  const ekRow=(ov,lab)=>`<tr><td>${lab}</td>${wzs.map(w=>{const x=simulate(p,Object.assign({wz:w},ov)); const a=x.years[0]; return `<td class="num">${pct((a.cfNach+a.tilg+x.wert0*w/100)/x.ek*100,0)}</td>`;}).join("")}</tr>`;
  const last=s.years[s.N-1];
  h+=`<section class="step" id="rendite"><h2><span class="n">06</span>Eigenkapitalrendite und IRR</h2><p class="lead">Der IRR zählt jede Zuzahlung mit und ist mit einem ETF (${pct(p.etf,1)} nach Steuern) direkt vergleichbar. Die EK-Rendite Jahr 1 schönt, weil sie die späteren Zuzahlungen ignoriert.</p>
  <div class="tw"><table><thead><tr><th>IRR über ${s.N} Jahre</th>${wzs.map(w=>`<th class="num">${pct(w,1)} WZ</th>`).join("")}</tr></thead><tbody>
   ${irrRow({rnd:false},`Normale AfA (${pct(sStd.afaSatz,1)})`)}${irrRow({rnd:true},`Mit Gutachten (${pct(sRnd.afaSatz,1)})`)}
  </tbody><thead><tr><th>EK-Rendite Jahr 1 (statisch)</th>${wzs.map(w=>`<th class="num">${pct(w,1)} WZ</th>`).join("")}</tr></thead><tbody>
   ${ekRow({rnd:false},"Normale AfA")}${ekRow({rnd:true},"Mit Gutachten")}
  </tbody></table></div>
  <div class="cols" style="margin-top:14px"><div class="tw"><table><tbody>
   ${row("Eingesetztes Eigenkapital",eur(s.ek))}${row(`Zuzahlungen über ${s.N} Jahre`,eur(s.zuz))}
   ${row(`Wert nach ${s.N} Jahren`,eur(last.wert))}${row("− Restschuld",eur(-last.restschuld),"neg")}
   ${s.vk?row("− Verkaufskosten",eur(-s.vk),"neg"):""}${s.spekSteuer?row("− Spekulationssteuer (unter 10 J.)",eur(-s.spekSteuer),"neg"):""}
   ${row("= Dein Vermögen in der Wohnung",eur(s.erloes),"","sum")}
   ${row("Gewinn (Vermögen − alles Eingezahlte + Überschüsse)",sgn(s.gewinn),cls(s.gewinn),"sum")}
   ${row(`ETF mit denselben Einzahlungen (${pct(p.etf,1)})`,eur(s.etf))}
   ${row("Vorsprung Wohnung gegenüber ETF",sgn(s.erloes+s.years.reduce((a,r)=>a+Math.max(0,r.cfNach),0)-s.etf),cls(s.erloes-s.etf))}
  </tbody></table></div><div style="min-width:0"><div class="chart" id="chart"></div>
   <div class="legend"><span><i style="background:var(--s1)"></i>Vermögen in der Wohnung (Wert − Restschuld)</span><span><i style="background:var(--s2)"></i>ETF mit denselben Einzahlungen</span><span><i style="background:var(--s3)"></i>Eingezahlt</span></div></div></div>
  </section>`;

  // 7 Stresstest
  const st=[["Basis",{}],["0 % Wertzuwachs",{wz:0}],["3 Monate Leerstand",{leerMonate:3}],["10.000 € Sonderumlage",{sonderumlage:(p.sonderumlage||0)+10000}],
   [`Anschlusszins +2 (${pct(p.anschlussZins+2,1)}), 15 J. halten`,{anschlussZins:p.anschlussZins+2,halte:Math.max(15,p.halte)}],
   ["Wert fällt 1,5 % pro Jahr",{wz:-1.5}],["Alles zusammen (0 % WZ, Leerstand, Sonderumlage)",{wz:0,leerMonate:3,sonderumlage:(p.sonderumlage||0)+10000}]];
  h+=`<section class="step" id="stress"><h2><span class="n">07</span>Stresstest</h2><p class="lead">Wenn du das schlechteste Jahr nicht aus Rücklagen bezahlen kannst, Finger weg.</p>
  <div class="tw"><table><thead><tr><th>Szenario</th><th class="num">Cashflow n. St. Jahr 1</th><th class="num">schlechtestes Jahr</th><th class="num">IRR</th><th class="num">Gewinn</th></tr></thead><tbody>
  ${st.map(([l,ov])=>{const x=simulate(p,ov); const worst=Math.min(...x.years.map(r=>r.cfNach)); const v=x.irr*100;
    return `<tr><td>${l}</td><td class="num ${cls(x.years[0].cfNach)}">${eur(x.years[0].cfNach)}</td><td class="num ${cls(worst)}">${eur(worst)}</td><td class="num ${cls(v)}">${pct(v,1)}</td><td class="num ${cls(x.gewinn)}">${sgn(x.gewinn)}</td></tr>`;}).join("")}
  </tbody></table></div></section>`;

  // 8 Maximalpreis
  const mpRow=(ov,lab)=>`<tr><td>${lab}</td>${[0,1.5,2.5].map(w=>{const v=maxPreis(p,p.zielIrr/100,Object.assign({wz:w},ov)); return `<td class="num ${v>=KP?"pos":"neg"}">${!isFinite(v)?"nicht erreichbar":v===Infinity?"> "+eur(KP*2.5):eur(Math.floor(v/500)*500)}</td>`;}).join("")}</tr>`;
  h+=`<section class="step" id="maxpreis"><h2><span class="n">08</span>Maximalpreis für ${pct(p.zielIrr,1)} IRR</h2><p class="lead">Bis zu welchem Kaufpreis erreichst du deine Ziel-Rendite? Marktwert und Miete bleiben gleich, Nebenkosten und Darlehen passen sich an. Darüber wird nicht gekauft.</p>
  <div class="tw"><table><thead><tr><th>Kaufpreis höchstens</th><th class="num">0 % WZ</th><th class="num">1,5 % WZ</th><th class="num">2,5 % WZ</th></tr></thead><tbody>
   ${mpRow({rnd:false},"Normale AfA")}${mpRow({rnd:true},"Mit Gutachten")}
  </tbody></table></div><p class="note">Angebotspreis: <b>${eur(KP)}</b>. Grün = Ziel bei diesem Preis erreichbar. Jede 5 % Preisnachlass sind ${eur(KP*0.05)}.</p></section>`;

  // 9 Jahrestabelle
  h+=`<section class="step" id="jahre"><h2><span class="n">09</span>Jahr für Jahr</h2>
  <div class="tw"><table><thead><tr><th>Jahr</th><th class="num">Kaltmiete</th><th class="num">Zins</th><th class="num">Tilgung</th><th class="num">AfA</th><th class="num">CF vor St.</th><th class="num">Steuer</th><th class="num">CF nach St.</th><th class="num">Restschuld</th><th class="num">Wert</th><th class="num">Vermögen</th></tr></thead><tbody>
  ${s.years.map(r=>`<tr><td>${r.y}</td><td class="num">${eur(r.miete)}</td><td class="num">${eur(r.zins)}</td><td class="num">${eur(r.tilg)}</td><td class="num">${eur(r.afa)}</td><td class="num ${cls(r.cfVor)}">${eur(r.cfVor)}</td><td class="num ${cls(r.steuer)}">${sgn(r.steuer)}</td><td class="num ${cls(r.cfNach)}">${eur(r.cfNach)}</td><td class="num">${eur(r.restschuld)}</td><td class="num">${eur(r.wert)}</td><td class="num">${eur(r.vermoegen)}</td></tr>`).join("")}
  </tbody></table></div></section>`;

  // 10 Eigennutzung
  const en=eigennutzung(p), km=en.kaufMonat, lastE=en.rows[en.rows.length-1];
  h+=`<section class="step" id="eigennutzung"><h2><span class="n">10</span>Selbst einziehen statt vermieten</h2><p class="lead">Kaufen gegen Mieten einer vergleichbaren Wohnung. Umlegbare Nebenkosten zahlst du in beiden Fällen und fallen deshalb raus. Der Mieter legt sein Eigenkapital und jede monatliche Ersparnis zu ${pct(p.tagesgeld,1)} an.</p>
  <div class="cols"><div class="tw"><table><thead><tr><th>Monat 1</th><th class="num">Kaufen</th></tr></thead><tbody>
   ${row("Kreditrate",eur(km.rate))}${row("nicht umlegbares Hausgeld",eur(km.nu))}${row("eigene Rücklage",eur(km.rue))}
   ${row("Belastung pro Monat",eur(km.gesamt),"","sum")}
   ${row("davon wirklich weg: Zins + Hausgeld + Rücklage",eur(km.zins+km.nu+km.rue))}
   ${row(`+ entgangene Zinsen auf ${eur(en.s.ek)} Eigenkapital`,eur(km.opp))}
   ${row("= Kosten Kaufen",eur(km.weg),"","sum")}
   ${row("Kosten Mieten (Kaltmiete)",eur(p.vergleichsmiete),"","sum")}
   ${row("Kaufen ist pro Monat",(km.weg>p.vergleichsmiete?"teurer um ":"günstiger um ")+eur(Math.abs(km.weg-p.vergleichsmiete)),km.weg>p.vergleichsmiete?"neg":"pos")}
  </tbody></table></div><div class="tw"><table><thead><tr><th>Vermögen nach</th><th class="num">Kaufen</th><th class="num">Mieten</th></tr></thead><tbody>
   ${en.rows.filter(r=>r.y===1||r.y%2===0||r.y===en.rows.length).map(r=>`<tr${r.y===en.breakEven?' class="sum"':""}><td>${r.y} ${r.y===1?"Jahr":"Jahren"}</td><td class="num ${r.vKauf>=r.depot?"pos":""}">${eur(r.vKauf)}</td><td class="num ${r.depot>r.vKauf?"pos":""}">${eur(r.depot)}</td></tr>`).join("")}
  </tbody></table></div></div>
  <div class="verdict">${en.breakEven?pill("good",`Kaufen liegt ab Jahr ${en.breakEven} vorn`):pill("bad",`Mieten bleibt über ${s.N} Jahre vorn`)}</div>
  <p class="note">Gerechnet mit ${pct(p.wz,1)} Wertzuwachs und den Nebenkosten als verlorenem Geld. Bei Eigennutzung ist der Verkauf schon nach 3 Kalenderjahren Selbstnutzung steuerfrei, Zinsen sind aber nicht absetzbar.</p></section>`;

  const g=k=>(P[k]===null?" (geschätzt)":"");
  LAST_SUMMARY=[
   "Immobilien-Rechner – Werte",
   `Objekt: ${p.stadtteil}, ${num(p.flaeche,1)} m², Baujahr ${p.baujahr}, Kaufpreis ${eur(KP)}${p.marktwert>0?`, Marktwert ${eur(p.marktwert)}`:""}`,
   `Kaltmiete ${eur(p.miete)}/Mon.${g("miete")}, Hausgeld ${eur(p.hausgeld)}${g("hausgeld")}, davon nicht umlegbar ${eur(p.nichtUml)}${g("nichtUml")}, eigene Rücklage ${num(p.ruecklageQm,2)} €/m², Mietausfall ${pct(p.ausfall,1)}, Inventar ${eur(p.inventar||0)}, Sonderumlage ${eur(p.sonderumlage||0)}`,
   `Nebenkosten: GrESt ${pct(p.grest,1)}, Notar ${pct(p.notar,1)}, Makler ${pct(p.makler,2)} = ${eur(s.nk)}`,
   `Finanzierung: Eigenkapital ${eur(s.ek)}, Darlehen ${eur(s.darlehen)}, Zins ${pct(p.zins,2)}, Tilgung ${pct(p.tilg,1)}, Bindung ${p.bindung} J., Anschlusszins ${pct(p.anschlussZins,1)}`,
   `Steuer: Grenzsteuersatz ${pct(p.steuer,0)}, Gebäudeanteil ${pct(p.gebAnteil,0)}, AfA ${p.rnd?`Gutachten ${p.rndJahre} J. (${pct(s.afaSatz,1)})`:pct(s.afaSatz,1)}`,
   `Prognose: ${s.N} J. halten, Wertzuwachs ${pct(p.wz,1)}, Mietsteigerung ${pct(p.mietSteig,1)}, Kosten ${pct(p.kostSteig,1)}, ETF ${pct(p.etf,1)}, Ziel-IRR ${pct(p.zielIrr,1)}`,
   "",
   `Ergebnis: Faktor ${num(faktor,1)}, brutto ${pct(brutto,2)}, netto ${pct(netto,2)}`,
   `Cashflow Jahr 1: vor Steuern ${eur(y1.cfVor/12)}/Mon., nach Steuern ${eur(y1.cfNach/12)}/Mon. (mit Gutachten-AfA: ${eur(sRnd.years[0].cfNach/12)})`,
   `IRR ${s.N} J.: ${pct(irrMain,1)} (normale AfA ${pct(sStd.irr*100,1)}, mit Gutachten ${pct(sRnd.irr*100,1)})`,
   `Maximalpreis für ${pct(p.zielIrr,1)} IRR: ${mp===Infinity?"> "+eur(KP*2.5):eur(mp)}`
  ].join("\n");
  $("#out").innerHTML=h;
  drawChart(s);
}

/* ===== Aufpoppende Erklärungen ===== */
const POPS={};
let LAST_SUMMARY="";
const pop=document.createElement("div"); pop.className="pop"; pop.hidden=true; pop.setAttribute("role","tooltip"); document.body.appendChild(pop);
let popPinned=null, popFor=null;
function popHtml(key){ return key.startsWith("info:")?INFO[key.slice(5)]:POPS[key]; }
function showPop(t){ const html=popHtml(t.dataset.pop); if(!html) return; popFor=t; pop.innerHTML=html; pop.hidden=false;
  const r=t.getBoundingClientRect(), w=Math.min(360,window.innerWidth-24); pop.style.width=w+"px";
  let x=Math.min(Math.max(12,r.left+r.width/2-w/2),window.innerWidth-w-12); pop.style.left=x+"px";
  const ph=pop.offsetHeight; let y=r.bottom+8; if(y+ph>window.innerHeight-8 && r.top-ph-8>8) y=r.top-ph-8; pop.style.top=Math.max(8,y)+"px"; }
function hidePop(){ pop.hidden=true; popFor=null; popPinned=null; }
document.addEventListener("mouseover",e=>{ if(popPinned) return; const t=e.target.closest("[data-pop]"); if(t&&t!==popFor) showPop(t); else if(!t&&popFor&&!e.target.closest(".pop")) hidePop(); });
document.addEventListener("click",e=>{ const t=e.target.closest("[data-pop]");
  if(t){ e.preventDefault(); if(popPinned===t){hidePop();return;} showPop(t); popPinned=t; return; }
  if(!e.target.closest(".pop")) hidePop(); });
document.addEventListener("focusin",e=>{ const t=e.target.closest("[data-pop]"); if(t) showPop(t); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") hidePop(); });
window.addEventListener("scroll",()=>{ if(popFor) showPop(popFor); },true);

/* ===== Diagramm ===== */
function drawChart(s){
  const el=$("#chart"); const W=560,H=260,m={l:56,r:12,t:12,b:28};
  const N=s.N, vals=[];
  const ser=[{k:"Wohnung",c:"var(--s1)",d:[s.ek-0].concat([]),pts:[]},{k:"ETF",c:"var(--s2)",pts:[]},{k:"Eingezahlt",c:"var(--s3)",pts:[],dash:true}];
  const wohn=[s.wert0-s.darlehen].concat(s.years.map(r=>r.wert-r.restschuld-(r.y===N?s.vk+s.spekSteuer:0)));
  ser[0].pts=wohn; ser[1].pts=s.etfPfad; ser[2].pts=s.einzPfad;
  ser.forEach(x=>vals.push(...x.pts));
  let lo=Math.min(0,...vals), hi=Math.max(...vals);
  const step=niceStep((hi-lo)/4); lo=Math.floor(lo/step)*step; hi=Math.ceil(hi/step)*step;
  const X=i=>m.l+(W-m.l-m.r)*i/N, Y=v=>m.t+(H-m.t-m.b)*(1-(v-lo)/(hi-lo));
  let g="";
  for(let v=lo;v<=hi+1e-6;v+=step){g+=`<line x1="${m.l}" x2="${W-m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)" stroke-width="1"/><text x="${m.l-6}" y="${Y(v)+4}" text-anchor="end" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${nf(0).format(v/1000)} T€</text>`;}
  const every=N>15?5:N>8?2:1;
  for(let i=0;i<=N;i+=every){g+=`<text x="${X(i)}" y="${H-8}" text-anchor="middle" font-size="11" fill="var(--muted)" font-family="var(--f-mono)">${i===0?"Kauf":"J"+i}</text>`;}
  for(const x of ser){ g+=`<polyline fill="none" stroke="${x.c}" stroke-width="2" stroke-linejoin="round" ${x.dash?'stroke-dasharray="4 4"':""} points="${x.pts.map((v,i)=>X(i)+","+Y(v)).join(" ")}"/>`;
    g+=`<circle cx="${X(N)}" cy="${Y(x.pts[N])}" r="4" fill="${x.c}" stroke="var(--panel)" stroke-width="2"/>`; }
  g+=`<line id="cx" x1="0" x2="0" y1="${m.t}" y2="${H-m.b}" stroke="var(--ink2)" stroke-width="1" visibility="hidden"/>`;
  el.innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Vermögensentwicklung Wohnung gegen ETF">${g}<rect x="${m.l}" y="${m.t}" width="${W-m.l-m.r}" height="${H-m.t-m.b}" fill="transparent" id="hit"/></svg><div class="tip" hidden></div>`;
  const svg=el.querySelector("svg"), tip=el.querySelector(".tip"), cx=el.querySelector("#cx");
  const move=e=>{const r=svg.getBoundingClientRect(); const sx=(e.clientX-r.left)*W/r.width; const i=Math.max(0,Math.min(N,Math.round((sx-m.l)/(W-m.l-m.r)*N)));
    cx.setAttribute("x1",X(i)); cx.setAttribute("x2",X(i)); cx.setAttribute("visibility","visible");
    tip.innerHTML=`<b>${i===0?"Kauf":"Nach Jahr "+i}</b>`+ser.map(x=>`<div><span><i style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${x.c};margin-right:6px"></i>${x.k}</span><span>${eur(x.pts[i])}</span></div>`).join("");
    tip.hidden=false; const px=X(i)/W*r.width; tip.style.left=Math.min(px+12,r.width-200)+"px"; tip.style.top="8px";};
  svg.addEventListener("pointermove",move); svg.addEventListener("pointerleave",()=>{tip.hidden=true;cx.setAttribute("visibility","hidden");});
}
function niceStep(x){const p=Math.pow(10,Math.floor(Math.log10(Math.max(x,1)))); const n=x/p; return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p;}

buildInputs(); fillInputs(); render();
document.querySelectorAll("[data-preset]").forEach(b=>b.addEventListener("click",()=>{P=Object.assign({},PRESETS[b.dataset.preset]); fillInputs(); save(); render();}));
/* Neues Objekt: Objektdaten leeren, eigene Einstellungen behalten. Zweiter Klick bestätigt. */
/* Werte kopieren, um sie Claude im Chat zu schicken */
const copyBtn=$("#p-copy");
copyBtn.addEventListener("click",()=>{
  const fertig=t=>{copyBtn.textContent=t; setTimeout(()=>copyBtn.textContent="Werte kopieren",2500);};
  const fallback=()=>{ let ta=$("#copy-fallback"); if(!ta){ ta=document.createElement("textarea"); ta.id="copy-fallback"; ta.readOnly=true; ta.rows=12; copyBtn.closest("header").appendChild(ta);} ta.hidden=false; ta.value=LAST_SUMMARY; ta.focus(); ta.select(); fertig("Text markiert, Strg+C drücken"); };
  try{ navigator.clipboard.writeText(LAST_SUMMARY).then(()=>fertig("Kopiert ✓"),fallback); }catch(e){ fallback(); }
});
const neuBtn=$("#p-neu"); let neuTimer=null;
neuBtn.addEventListener("click",()=>{
  if(!neuBtn.classList.contains("confirm")){ neuBtn.classList.add("confirm"); neuBtn.textContent="Wirklich leeren? Nochmal klicken"; clearTimeout(neuTimer);
    neuTimer=setTimeout(()=>{neuBtn.classList.remove("confirm"); neuBtn.textContent="Neues Objekt";},4000); return; }
  clearTimeout(neuTimer); neuBtn.classList.remove("confirm"); neuBtn.textContent="Neues Objekt";
  P=Object.assign({},P,{stadtteil:"Hamburg (Durchschnitt)",kaufpreis:null,marktwert:0,flaeche:null,baujahr:null,miete:null,hausgeld:null,nichtUml:null,
    ruecklageQm:BASE.ruecklageQm,ausfall:BASE.ausfall,inventar:0,sonderumlage:0,makler:3.57,brw:0,grundstueck:0,mea:0,vergleichsmiete:null,rnd:false});
  fillInputs(); save(); render(); document.getElementById("kaufpreis").focus();
});
