/* Erklärungen zu jedem Eingabefeld (Info-Knopf) */
const INFO={
 stadtteil:"Wird nur für Schätzungen gebraucht. Fehlt im Inserat die Miete, schätzt der Rechner sie aus der typischen Angebotsmiete im Stadtteil (immoportal.com, Stand Oktober 2026) minus 12 %. Der Abschlag steht für Bestandswohnungen und die Mietpreisbremse: Bei Neuvermietung sind höchstens 10 % über dem Mietenspiegel erlaubt. Beispiel Eidelstedt: 14,70 €/m² Angebot, geschätzt ca. 12,90 €/m². Bei Neubau ab 2014 gilt die Mietpreisbremse nicht, dann ohne Abschlag.",
 kaufpreis:"Der Preis im Inserat bzw. dein verhandelter Preis. Darauf werden Grunderwerbsteuer, Notar und Makler berechnet.",
 marktwert:"Nur ausfüllen, wenn du die Wohnung unter Wert kaufst, z. B. 190.000 € für eine Wohnung, die eigentlich 200.000 € wert ist (Erbengemeinschaft, Zwangsversteigerung, gut verhandelt). Der Wertzuwachs und der spätere Verkauf werden dann ab dem echten Wert gerechnet, nicht ab deinem Kaufpreis. So sieht man, was ein guter Einkauf bringt. Leer lassen heißt: Marktwert = Kaufpreis.",
 flaeche:"Wohnfläche laut Exposé. Daraus rechnet der Rechner Preis pro m², Miete pro m², die eigene Rücklage und Schätzungen.",
 baujahr:"Bestimmt die normale AfA: vor 1925 2,5 %, 1925 bis 2022 2 %, ab 2023 3 %. Bei Häusern vor ca. 1980 lohnt oft ein Restnutzungsdauer-Gutachten (siehe Steuer & AfA).",
 miete:"Nettokaltmiete pro Monat, ohne Nebenkosten. Bei vermieteten Wohnungen steht sie im Exposé. Fehlt sie, das Feld leer lassen: Dann schätzt der Rechner sie aus Stadtteil und Wohnfläche. Vor dem Kauf immer mit dem Mietenspiegel-Rechner der Stadt Hamburg prüfen. Mehr als Mietenspiegel + 10 % ist bei Neuvermietung meist nicht erlaubt.",
 hausgeld:"Monatliche Zahlung an die Eigentümergemeinschaft (WEG). Enthält umlegbare Kosten (Müll, Wasser, Hausreinigung, Grundsteuer, oft Heizung) und nicht umlegbare (Verwaltung, Erhaltungsrücklage). Steht fast immer im Exposé. Fehlt es, leer lassen: Dann rechnet der Rechner mit ca. 4,50 €/m² bei kleinen und 4 €/m² bei größeren Wohnungen. Üblich in Hamburg sind ca. 3,50 bis 5,50 €/m². Fehlt das Hausgeld im Inserat, unbedingt nachfragen und den Wirtschaftsplan verlangen.",
 nichtUml:"Der Teil des Hausgelds, den du als Vermieter selbst trägst: Verwaltergebühr, Erhaltungsrücklage der WEG, Bankgebühren. Typisch 30 bis 40 % des Hausgelds, steht genau im Wirtschaftsplan oder in der Hausgeldabrechnung. Leer lassen = Schätzung mit 35 %.",
 ruecklageQm:"Geld, das du selbst für Reparaturen in der Wohnung zurücklegst (Bad, Küche, Böden, Therme, Renovierung bei Mieterwechsel). Die WEG-Rücklage deckt nur Gemeinschaftseigentum wie Dach und Fassade. Faustregel: 0,50 bis 1 €/m² im Monat, bei älteren oder unrenovierten Wohnungen eher mehr. Gerechnet wird mit 0,60 €/m².",
 ausfall:"Monate ohne Mieteinnahme, z. B. zwischen zwei Mietern oder wenn ein Mieter nicht zahlt. 2 % der Jahresmiete sind ungefähr eine Woche pro Jahr, für gefragte Hamburger Wohnungen üblich. In schwächeren Lagen 3 bis 4 % ansetzen.",
 inventar:"Einbauküche (EBK), Markise, Möbel. Wird das Inventar im Kaufvertrag mit realistischem Wert separat aufgeführt, zahlst du darauf keine Grunderwerbsteuer (5,5 % gespart) und schreibst es über 10 statt 50 Jahre ab. Nur realistische Zeitwerte angeben, z. B. 3.000 bis 8.000 € für eine gute Küche.",
 sonderumlage:"Eine Extra-Zahlung an die WEG, wenn die Rücklage für eine Sanierung (Dach, Fassade, Leitungen) nicht reicht. Steht in den Protokollen der Eigentümerversammlung. Schon beschlossene Sonderumlagen im Kaufvertrag dem Verkäufer zuweisen oder vom Preis abziehen. Hier eintragen, wenn du sie selbst zahlen musst.",
 grest:"Grunderwerbsteuer in Hamburg: 5,5 % vom Kaufpreis (ohne separat ausgewiesenes Inventar).",
 notar:"Notar und Grundbuchamt, zusammen ca. 1,5 bis 2 % vom Kaufpreis.",
 makler:"Käuferanteil der Maklerprovision. In Hamburg meist 3,57 % inkl. Mehrwertsteuer, bei Privatverkauf 0.",
 ekModus:"„= Nebenkosten“: Die Bank finanziert den ganzen Kaufpreis, du zahlst nur Grunderwerbsteuer, Notar und Makler selbst. So rechnen viele Kapitalanleger (mehr Hebel). „Nebenkosten + %“: Du zahlst die Nebenkosten und zusätzlich einen Anteil vom Kaufpreis, z. B. 10 %. „Eigener Betrag“: Du bringst mehr Eigenkapital mit, der Kredit wird kleiner.",
 ekProzent:"Bei „Nebenkosten + % vom Kaufpreis“: Du zahlst die Nebenkosten und zusätzlich diesen Anteil des Kaufpreises selbst. Klassisch sind 10 bis 20 %, das bringt bei der Bank oft einen besseren Zins.",
 ekBetrag:"Dein gesamtes eingesetztes Geld inklusive Nebenkosten. Nur aktiv, wenn oben „eigener Betrag“ gewählt ist.",
 zins:"Sollzins der Bank pro Jahr. Vergleiche mehrere Banken (Interhyp, Dr. Klein, Sparkasse). 0,3 Prozentpunkte Unterschied machen auf 200.000 € über 10 Jahre ca. 6.000 € aus.",
 tilg:"Anfangstilgung pro Jahr. 2 % ist üblich. Weniger Tilgung = besserer Cashflow, aber langsamer schuldenfrei.",
 bindung:"So viele Jahre ist der Zins fest. Danach gilt der Anschlusszins.",
 anschlussZins:"Angenommener Zins nach Ende der Zinsbindung. Niemand kennt ihn, deshalb vorsichtig ansetzen. Der Stresstest rechnet zusätzlich mit +2 Prozentpunkten.",
 anschlussTilg:"Tilgung nach Ende der Zinsbindung.",
 steuer:"Dein persönlicher Grenzsteuersatz: So viel Steuer zahlst du auf den letzten verdienten Euro. Bei 50.000 bis 70.000 € Brutto-Jahresgehalt ca. 35 bis 42 % inklusive Soli und Kirchensteuer. Je höher, desto mehr bringen Verluste aus Vermietung.",
 gebAnteil:"Nur das Gebäude wird abgeschrieben, nicht der Boden. Das Finanzamt schätzt den Gebäudeanteil in Hamburg oft nur auf 40 bis 60 %. Besser: Aufteilung im Notarvertrag festlegen, begründet über den Bodenrichtwert (Felder unten).",
 degressiv:"Nur für Neubau: Statt 3 % linear darfst du jedes Jahr 5 % vom Restwert abschreiben (Jahr 1: 5 % vom Gebäudewert, danach etwas weniger). Bedingungen: Baubeginn (Bauantrag) zwischen 01.10.2023 und 30.09.2029, und du kaufst spätestens im Jahr der Fertigstellung. Gilt nur, wenn das Baujahr ab 2023 eingetragen ist. Insgesamt schreibst du gleich viel ab, aber früher, das hebt den IRR.",
 rnd:"Mit einem Gutachten zur Restnutzungsdauer darfst du schneller abschreiben, wenn das Haus nicht mehr 50 Jahre hält. Lohnt sich vor allem bei Häusern vor ca. 1980.",
 rndJahre:"Restnutzungsdauer laut Gutachten. AfA = 100 ÷ Jahre: 25 Jahre = 4 %, 20 Jahre = 5 %.",
 gutachten:"Kosten für das Restnutzungsdauer-Gutachten, ca. 800 bis 1.500 €, im ersten Jahr voll absetzbar.",
 brw:"Bodenrichtwert in €/m² Grundstück, kostenlos auf geoportal-hamburg.de (BORIS). Zusammen mit Grundstücksfläche und Miteigentumsanteil ergibt sich der Bodenwert deiner Wohnung.",
 grundstueck:"Größe des ganzen Grundstücks laut Grundbuch oder Teilungserklärung.",
 mea:"Dein Anteil am Grundstück laut Teilungserklärung, z. B. 45,3/1000.",
 halte:"Wie lange du die Wohnung behalten willst. Ab 10 Jahren ist der Verkaufsgewinn steuerfrei.",
 wz:"Angenommene Wertsteigerung pro Jahr. Nicht garantiert: 2022 bis 2024 sind die Preise in Hamburg gefallen. Rechne immer auch mit 0 %.",
 mietSteig:"Mietsteigerung pro Jahr. In Hamburg sind Erhöhungen im Bestand auf 15 % in 3 Jahren begrenzt und nur bis zum Mietenspiegel.",
 kostSteig:"Wie stark Hausgeld und Rücklage pro Jahr steigen.",
 verkaufskosten:"Kosten beim Verkauf, z. B. Makler. Bei Privatverkauf 0.",
 etf:"Vergleichsrendite eines breiten ETF nach Abgeltungsteuer, ca. 6 % pro Jahr im langen Schnitt.",
 zielIrr:"Welche Rendite pro Jahr du mindestens willst. Der Rechner zeigt dann den höchsten Kaufpreis, bei dem das noch klappt. Das ist dein Verhandlungsziel.",
 liegenschaftszins:"Mit diesem Zins rechnen Gutachter den Ertragswert aus der Miete. Steht im Immobilienmarktbericht des Gutachterausschusses Hamburg, für Eigentumswohnungen meist ca. 1,5 bis 3 %.",
 vergleichsmiete:"Was du für eine vergleichbare Wohnung als Mieter kalt zahlen würdest.",
 tagesgeld:"Was dein Eigenkapital sonst bringen würde, z. B. Tagesgeld 3 %. Der Mieter legt sein Geld so an."
};
/* Typische Angebotsmieten €/m² nach Stadtteil (immoportal.com, Oktober 2026)  Steilshoop fehlt dort: miet-check.de 14,04 €/m², auf immoportal-Niveau umgerechnet (Bramfeld 14,96 vs. 14,35). */
const MIETEN={"Hamburg (Durchschnitt)":15.19,Alsterdorf:17.24,"Altona-Altstadt":15.22,"Altona-Nord":15.29,Bahrenfeld:15.61,"Barmbek-Nord":14.11,"Barmbek-Süd":16.22,Bergedorf:14.93,Billstedt:12.32,Blankenese:17.36,Borgfelde:14.79,Bramfeld:14.35,Dulsberg:13.39,Eidelstedt:14.70,Eilbek:15.53,"Eimsbüttel":16.06,"Eißendorf":13.13,Eppendorf:17.17,"Farmsen-Berne":14.11,"Fuhlsbüttel":15.43,"Groß Borstel":16.87,"Groß Flottbek":17.08,HafenCity:22.91,Hamm:13.49,Hammerbrook:18.44,Harburg:13.34,Harvestehude:18.75,Hausbruch:11.23,Heimfeld:13.04,"Hoheluft-Ost":16.79,"Hoheluft-West":17.11,Hohenfelde:19.00,Horn:12.15,"Hummelsbüttel":15.16,Jenfeld:14.96,Kirchwerder:13.63,Langenhorn:14.48,"Lohbrügge":15.05,Lokstedt:18.04,Lurup:14.02,Marienthal:14.78,"Neuallermöhe":13.59,"Neugraben-Fischbek":13.17,Neustadt:18.13,Niendorf:16.05,Ohlsdorf:15.63,Osdorf:15.42,Othmarschen:18.50,Ottensen:16.37,"Poppenbüttel":15.84,Rahlstedt:13.74,Rissen:15.25,Rothenburgsort:15.54,Rotherbaum:19.01,"Sankt Georg":15.35,"Sankt Pauli":15.35,Sasel:16.02,Schnelsen:15.91,Steilshoop:13.46,Stellingen:17.28,Sternschanze:15.90,Tonndorf:15.23,Uhlenhorst:17.47,Volksdorf:15.51,Wandsbek:14.74,"Wellingsbüttel":15.75,Wilhelmsburg:12.80,Wilstorf:12.18,Winterhude:17.30};
/* Schätzungen für fehlende Exposé-Angaben */
function schaetzen(p){
  const q={...p}, est={};
  const leer=v=>v===null||v===undefined||v==="";
  if(leer(q.miete)){ const a=MIETEN[q.stadtteil]||MIETEN["Hamburg (Durchschnitt)"]; const f=q.baujahr>=2014?1:0.88;
    q.miete=Math.round(a*f*q.flaeche/5)*5; est.miete=`Kaltmiete ${Math.round(q.miete)} € (${String((a*f).toFixed(2)).replace(".",",")} €/m² aus ${q.stadtteil||"Hamburg-Schnitt"})`; }
  if(leer(q.hausgeld)){ q.hausgeld=Math.round((q.flaeche<50?4.5:4)*q.flaeche); est.hausgeld=`Hausgeld ${q.hausgeld} € (${q.flaeche<50?"4,50":"4,00"} €/m²)`; }
  if(leer(q.nichtUml)){ q.nichtUml=Math.round(q.hausgeld*0.35); est.nichtUml=`nicht umlegbar ${q.nichtUml} € (35 % vom Hausgeld)`; }
  if(leer(q.vergleichsmiete)){ q.vergleichsmiete=q.miete; }
  return {q,est};
}
