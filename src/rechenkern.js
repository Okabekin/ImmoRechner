/* ===== Rechenkern (Formeln aus Lektion 3, 6 und Übung 5) ===== */
function afaNormal(bj){ return bj<1925?2.5:(bj>=2023?3:2); }
function nebenkosten(p){
  const KP=p.kaufpreis, inv=Math.min(p.inventar||0,KP);
  const grest=(KP-inv)*p.grest/100, notar=KP*p.notar/100, makler=KP*p.makler/100;
  return {grest,notar,makler,nk:grest+notar+makler};
}
function simulate(p, ov){
  p = Object.assign({}, p, ov||{});
  const KP=p.kaufpreis, inv=Math.min(p.inventar||0,KP);
  const {grest,notar,makler,nk}=nebenkosten(p);
  const gesamt=KP+nk;
  const ek = p.ekModus==='nk' ? nk : p.ekModus==='nkpct' ? Math.min(nk+KP*(p.ekProzent||0)/100, gesamt) : Math.min(p.ekBetrag, gesamt);
  const darlehen=Math.max(0,gesamt-ek);
  const nkQuote=nk/KP;
  const gebBasis=(KP-inv)*(1+nkQuote)*p.gebAnteil/100;
  const invBasis=inv*(1+nkQuote);
  // Degressive AfA (§ 7 Abs. 5a EStG): 5 % vom Restwert, nur Neubau mit Baubeginn 10/2023–9/2029
  const deg=!!p.degressiv && p.baujahr>=2023;
  const afaSatz=deg ? 5 : (p.rnd ? 100/p.rndJahre : afaNormal(p.baujahr));
  const afaGeb=gebBasis*afaSatz/100;
  const N=Math.max(1,Math.round(p.halte));
  const wert0=p.marktwert>0?p.marktwert:KP;
  let rs=darlehen, zins=p.zins/100, rateM=darlehen*(p.zins+p.tilg)/1200, rateNach=null;
  const years=[]; let cum=0, afaGebCum=0, afaInvCum=0;
  const flows=[-ek];
  for(let y=1;y<=N;y++){
    if(y===p.bindung+1 && rs>0){ zins=p.anschlussZins/100; rateM=rs*(p.anschlussZins+p.anschlussTilg)/1200; rateNach=rateM; }
    let zY=0,tY=0;
    for(let m=0;m<12;m++){ if(rs<=0.005) break; const z=rs*zins/12; const t=Math.min(rateM-z, rs); zY+=z; tY+=t; rs-=t; }
    const g=Math.pow(1+p.mietSteig/100,y-1), gk=Math.pow(1+p.kostSteig/100,y-1);
    const miete=p.miete*12*g;
    const leer=(y===1? (p.leerMonate||0):0);
    const ausfall=miete*p.ausfall/100 + miete/12*leer;
    const nu=p.nichtUml*12*gk, rue=p.ruecklageQm*p.flaeche*12*gk;
    const gut=(y===1&&p.rnd)?p.gutachten:0, su=(y===1)?(p.sonderumlage||0):0;
    const cfVor=miete-ausfall-nu-rue-gut-su-zY-tY;
    const rest=Math.max(0,gebBasis-afaGebCum);
    // degressiv: 5 % vom Restwert; Wechsel auf linear (Rest / Restnutzungsdauer 33 1/3 J.), sobald das mehr bringt
    const aG=deg ? Math.max(rest*0.05, Math.min(rest, rest/Math.max(1,100/3-(y-1)))) : Math.min(afaGeb, rest); afaGebCum+=aG;
    const aI=Math.min(invBasis/10, Math.max(0,invBasis-afaInvCum)); afaInvCum+=aI;
    const ergebnis=miete-ausfall-nu-rue-gut-su-zY-aG-aI;
    const steuer=-ergebnis*p.steuer/100; // positiv = Erstattung
    const cfNach=cfVor+steuer; cum+=cfNach;
    const wert=wert0*Math.pow(1+p.wz/100,y);
    years.push({y,miete,ausfall,nu,rue,gut,su,zins:zY,tilg:tY,afa:aG+aI,ergebnis,steuer,cfVor,cfNach,restschuld:Math.max(0,rs),wert,vermoegen:wert-Math.max(0,rs),cum});
    flows.push(cfNach);
  }
  const last=years[N-1];
  const vk=last.wert*(p.verkaufskosten||0)/100;
  let spekSteuer=0;
  if(N<10){ const buchwert=gesamt-afaGebCum-afaInvCum; spekSteuer=Math.max(0,(last.wert-vk-buchwert)*p.steuer/100); }
  const erloes=last.wert-vk-last.restschuld-spekSteuer;
  flows[N]+=erloes;
  const zuz=-years.reduce((s,r)=>s+Math.min(0,r.cfNach),0);
  const gewinn=flows.reduce((a,b)=>a+b,0);
  // ETF mit denselben Einzahlungen (EK + jede Zuzahlung), Rendite nach Steuern
  const etfPfad=[ek]; let etf=ek;
  for(let y=1;y<=N;y++){ etf=etf*(1+p.etf/100)+Math.max(0,-years[y-1].cfNach)*(1+p.etf/200); etfPfad.push(etf); }
  const einzPfad=[ek]; let e=ek; for(let y=1;y<=N;y++){ e+=Math.max(0,-years[y-1].cfNach); einzPfad.push(e); }
  return {p,grest,notar,makler,nk,gesamt,ek,darlehen,rate0:darlehen*(p.zins+p.tilg)/1200,rateNach,
    gebBasis,invBasis,afaSatz,afaGeb,years,flows,erloes,spekSteuer,vk,irr:irr(flows),zuz,gewinn,etf,etfPfad,einzPfad,wert0,N};
}
function irr(f){
  const npv=r=>f.reduce((s,c,i)=>s+c/Math.pow(1+r,i),0);
  let lo=-0.99,hi=3; if(npv(lo)*npv(hi)>0) return NaN;
  for(let i=0;i<200;i++){ const m=(lo+hi)/2; if(npv(lo)*npv(m)<=0) hi=m; else lo=m; }
  return (lo+hi)/2;
}
function maxPreis(p, zielIrr, ov){
  // Ohne Marktwert gilt Wert = Preis (Wert sinkt mit dem Preis). Nur ein eingetragener Marktwert bleibt fest.
  const base=Object.assign({},p,ov||{});
  const f=kp=>{ const x=simulate(base,{kaufpreis:kp,marktwert:p.marktwert>0?p.marktwert:0});
    // Kein Vorzeichenwechsel: nur Einnahmen = unendlich gut, nur Ausgaben = unendlich schlecht
    return isNaN(x.irr) ? (x.flows.every(c=>c>=0)||x.flows.reduce((s,c)=>s+c,0)>0 ? Infinity : -Infinity) : x.irr; };
  let lo=p.kaufpreis*0.2, hi=p.kaufpreis*2.5;
  if(!(f(lo)>=zielIrr)) return NaN; if(f(hi)>=zielIrr) return Infinity;
  for(let i=0;i<60;i++){ const m=(lo+hi)/2; const v=f(m); if(v>=zielIrr) lo=m; else hi=m; }
  return lo;
}
/* Eigennutzung: Kaufen vs. Mieten (Vermögensvergleich) */
function eigennutzung(p){
  const s=simulate(p,{rnd:false,sonderumlage:0,leerMonate:0});
  const N=s.N, r=p.tagesgeld/100;
  let depot=s.ek, rows=[], breakEven=null;
  const gk=y=>Math.pow(1+p.kostSteig/100,y-1), gm=y=>Math.pow(1+p.mietSteig/100,y-1);
  const y1=s.years[0];
  const kaufMonat={rate:(y1.zins+y1.tilg)/12, zins:y1.zins/12, tilg:y1.tilg/12, hausgeld:p.hausgeld, nu:p.nichtUml, rue:p.ruecklageQm*p.flaeche,
    opp:s.ek*r/12};
  kaufMonat.weg=kaufMonat.zins+kaufMonat.nu+kaufMonat.rue+kaufMonat.opp;
  kaufMonat.gesamt=kaufMonat.rate+kaufMonat.nu+kaufMonat.rue; // ohne umlegbare NK (zahlt man als Mieter auch)
  for(let y=1;y<=N;y++){
    const yr=s.years[y-1];
    const kauf=yr.zins+yr.tilg+yr.nu+yr.rue;
    const miete=p.vergleichsmiete*12*gm(y);
    depot=depot*(1+r)+Math.max(0,kauf-miete);
    const vk=yr.wert*(p.verkaufskosten||0)/100;
    const vKauf=yr.wert-vk-yr.restschuld - Math.max(0,miete-kauf)*0; 
    rows.push({y,vKauf,depot});
    if(breakEven===null && vKauf>=depot) breakEven=y;
  }
  return {kaufMonat,mieteMonat:p.vergleichsmiete,rows,breakEven,s};
}
if(typeof module!=='undefined') module.exports={simulate,irr,maxPreis,eigennutzung,nebenkosten};
