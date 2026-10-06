// Prüft den Rechenkern gegen die Ergebnisse aus Lektion 6 und Übung 5
const test = require('node:test');
const assert = require('node:assert');
const { simulate, maxPreis } = require('../src/rechenkern.js');

const basis = {kaufpreis:200000,marktwert:0,flaeche:50,baujahr:1965,miete:675,hausgeld:300,nichtUml:110,ruecklageQm:0.8,ausfall:2,
  grest:5.5,notar:2,makler:3.57,inventar:0,sonderumlage:0,ekModus:'nk',ekBetrag:0,zins:3.8,tilg:2,bindung:10,anschlussZins:6,anschlussTilg:2,
  steuer:35,gebAnteil:50,rnd:false,rndJahre:25,gutachten:1000,halte:10,wz:1.5,mietSteig:2,kostSteig:2,etf:6,verkaufskosten:0};
const irr = (ov) => Math.round(simulate(basis, ov).irr * 1000) / 10 + 0;

test('Lektion 6: Trick-Stapel bei 0 / 1,5 / 2,5 % Wertzuwachs', () => {
  const stufen = [
    [{}, [-4.1, 3.8, 7.6]],
    [{gebAnteil:65}, [-3.5, 4.3, 8.1]],
    [{gebAnteil:65, rnd:true}, [-0.8, 6.4, 10.0]],
    [{gebAnteil:65, rnd:true, inventar:8000, ekModus:'betrag', ekBetrag:22140}, [0, 7.0, 10.6]],
  ];
  for (const [ov, erwartet] of stufen) {
    assert.deepStrictEqual([0, 1.5, 2.5].map(wz => irr({...ov, wz})), erwartet);
  }
});

test('Lektion 6: Cashflow Jahr 1 und Restschuld', () => {
  const r = simulate(basis);
  assert.strictEqual(Math.round(r.years[0].cfVor / 12), -455);
  assert.strictEqual(Math.round(r.years[0].cfNach / 12), -350);
  assert.strictEqual(Math.round(r.rate0), 967);
});

test('Übung 5 Eidelstedt: Cashflow Jahr 1 bei 13 €/m²', () => {
  const r = simulate({...basis, kaufpreis:155000, flaeche:39.6, baujahr:1963, miete:515, nichtUml:66, ruecklageQm:0.6,
    makler:0, zins:4, gebAnteil:70});
  assert.strictEqual(Math.round(r.years[0].cfVor / 12), -360);
  assert.strictEqual(Math.round(r.years[0].cfNach / 12), -258);
});

test('Maximalpreis: ohne Marktwert sinkt der Wert mit dem Preis', () => {
  const mp = maxPreis(basis, 0.06);
  assert.ok(isFinite(mp));
  // Gegenprobe: zum Maximalpreis (Wert = Preis) ergibt sich genau 6 %
  assert.ok(Math.abs(simulate(basis, { kaufpreis: mp }).irr - 0.06) < 1e-4);
  // Mit festem Marktwert ist ein Rabatt Gewinn, der Maximalpreis also anders
  assert.notStrictEqual(Math.round(maxPreis({ ...basis, marktwert: 200000 }, 0.06)), Math.round(mp));
});
