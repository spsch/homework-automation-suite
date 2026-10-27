## **1\. Předpoklady pro testování, součinnost a nejasnosti v zadání**

### **Předpoklady pro testování (Prerequisites)**

* **Testovací prostředí pro platební bránu:**  
-  Stabilní testovací prostředí (sandbox) dodavatele brány s možností simulovat různé návratové kódy, stavové kódy (webhooks/callbacks) a chybové situace (výpadek spojení, zamítnutí bankou, session time-out).  
* **Izolované testovací prostředí pro e-shopu (Test/Staging):**   
- Možnost resetu databáze, mocking platebních metod a přístup k databázovým logům (administraci) pro ověření stavů plateb a objednávek.  
* **Testovací data a testovací karty:**   
- Sada testovacích platebních karet pro různé typy scénářů (3D Secure 1 vs. 2, zamítnuté transakce, vypršení limitu na bráně, Click to Pay apod.).  
* **Dokumentace API a mapování stavů:**   
- Kompletní API kontrakt (Swagger/OpenAPI specifikace nové brány), specifikace webhooks, event-driven notifikací a tabulka mapování chybových kódů.

### **Součinnost s dalšími rolemi**

* **Business/ Product Owner (PO):**   
- Upřesnění nejasných požadavků v zadání (viz níže) a schválení akceptačních kritérií pro hraniční stavy plateb.  
* **Vývojářský tým (Backend / Frontend):**   
- Součinnost při nastavování logování, simulaci síťových výpadků (např. pomocí Charles Proxy / Toxiproxy) a paralelní deployment samotných bran.  
* **Dodavatel platební brány/ Payment Provider:**  
-  Technická podpora pro řešení nesouladu mezi callbacks (webhooks) a synchronním přesměrováním (redirect).

### 

### 

### 

### 

### 

### **Nejasnosti, chybějící informace a konflikty v zadání**

* **Bod 6 (Bezpečnost / Copy-Paste & Autofill):**   
- Požadavek zakázat kopírování/vkládání (clipboard) a automatické vyplňování (autofill) v platebním formuláři.  
  * *Riziko:* Běží \- li platební brána v externím iframe nebo na stránkách třetí strany, e-shop nemá nad chováním vstupů přímou kontrolu (brána by je musela nativně podporovat). Blokace autofillu a paste často snižuje konverzní poměr a může být v rozporu s některými standardy přístupnosti (accessibility). Je nutné ověřit, zda jde o nativní chování brány, nebo požadavek na funkcionalitu checkout šablony.  
* **Bod 8 (Double check):** Požadavek, aby *všechny platební kroky byly pro ochranu zákazníka potvrzovány zákazníkem dvakrát*.  
  * *Riziko:* V moderním e-commerce UX společně se standardy 3D Secure / PSD2 je dvoufázové ověření standardně řešeno samotnou bankou (2FA / 3DS) nebo payment providerem; je-li myšleno “dvojité kliknutí na e-shopu”, tak, že uživatel postupuje např. "Shrnutí" \-\> "Zaplatit",pak jde o běžný přístup;je-li však vyžadováno, aby uživatel dvakrát potvrdit platbu na straně brány,pak je toto v konfliktu se standardním platebním flow a může dojít k nejasnostem, případně se flow může stát zmatečným.  
* **Bod 12 (Opětovné zahájení platby bez nové objednávky):**  
  * *Riziko:* Pokud uživatel nezaplatí, objednávka zůstane v rezervaci (blokuje skladové zásoby). Pokusí-li se platbu opakovat po delší době, hrozí vyprodání zboží nebo změna cen \- proto je nutné definovat business timeout pro expiraci neuhrazené objednávky.

## 

## 

## 

## 

## 

## 

## 

## **2\. Přístup k testování (Test Approach) v čase**

Strategie testování je rozdělena do čtyř hlavních fází s důrazem na Risk-Based metodiku.:

### **Fáze 1: Analytická fáze a statické testování (Shift-Left)**

* **Aktivity:** Revize API specifikace, mapovací tabulky stavů (Bod 9\) a architektonického návrhu paralelního běhu staré a nové brány.  
* **Výstup:** Testovací strategie, revize akceptačních kritérií.

### **Fáze 2: Component a integrační testování (Integration & API Testing)**

* **Aktivity:**  
  * Testování API kontraktu nové brány (mock server / sandbox).  
  * Ověření správnosti zpracování webhooks a asynchronních notifikací.  
  * Testy pro mapování chybových kódů (Bod 9\) a konzistence dat mezi bránou, fakturací a finančními přehledy (Bod 2 a 4).

### **Fáze 3: Systémové a E2E testování (System & E2E Testing)**

* **Aktivity:**  
  * End-to-end průchody nákupním košíkem (Checkout flow) pro obě brány běžící paralelně.  
  * Ověření stavů plateb, ukládání poslední platební metody (Bod 3), přehledů a jejich exportu (Bod 5), propisování hodnocení úspěšnosti (Bod 10).  
  * Testování obnovení neuhrazené platby (Bod 12).

### **Fáze 4: Akceptační a security testování (UAT & Security)**

* **Aktivity:**  
  * Ověření bezpečnostních požadavků (zákaz autofillu/paste, PCI-DSS scope – e-shop by neměl přijít do styku s citlivými kartovými údaji, tokenizace).  
  * Uživatelské akceptační testy (UAT) s business/klientem.

### **Nezahrnuto v testech \- návrh Out of Scope:**

* **Interní core kód samotné platební brány:** Testování vnitřní logiky bankovního zpracování transakce na straně poskytovatele brány (pokrývá dodavatel brány, my testujeme integraci a rozhraní).  
* **Kompletní regresní testování nesouvisejících modulů e-shopu:** CMS, správa uživatelských účtů nebo marketingové kampaně, které nemají vazbu na checkout a fakturaci.

## **3\. Cíle testování a jejich priorita**

Pořadí testování vychází z business critical impacts (Financial & Core Business Impact):

1. **Integrita finančních dat a zamezení chybné fakturace (Bod 2, 4, 9):**  
   * *Důvod:* Absolutní priorita v bankovním/finančním sektoru. Neúspěšná platba nesmí nikdy generovat fakturu ani zalistovat transakci jako úspěšnou v účetnictví.  
2. **Jednoznačnost výsledku platby a chybové stavy (Bod 1, 7, 11):**  
   * *Důvod:* Zamezení stavů, kdy jsou uživateli odečteny peníze z účtu, ale systém v e-shopu objednávku stornuje nebo nechá  v nejasném stavu. Klíčová je auditní stopa.  
3. **Funkčnost paralelního provozu a platebního flow (Checkout & UX):**  
   * *Důvod:* Zajištění, že uživatelé správně přecházejí na novou bránu, vrací se do správného stavu košíku a funguje uložení platební metody (Bod 3\) spolu s opakováním platby (Bod 12).  
4. **Reporting, exporty a doplňkové atributy (Bod 5, 10):**  
   * *Důvod:* Interní kontroly, audit a analytika \- zásadní pro back-office oddělení, ale nemá přímý vliv na okamžitou ztrátu tržeb.  
5. **Bezpečnostní omezení (Bod 6, 8):**  
   * *Důvod:* Ověření kontrol/restrikcí formulářových polí a dodržení bezpečnostních standardů.

## 

## 

## 

## 

## 

## 

## 

## 

## **4\. Typy testování \- doporučení**

* **Funkční a integrační testování (Klíčové / Priorita 1):**  
  * *Rozsah:* 100% pokrytí všech stavy plateb, webhooks, chybových hlášení a vazeb do fakturace.  
* **Testování API a kontraktů (Klíčové / Priorita 1):**  
  * *Rozsah:* Ověření správnosti datových struktur posílaných na bránu a přijímaných z webhooks.  
* **Security testování (Klíčové / Priorita 2):**  
  * *Rozsah:* Ověření, že citlivá data karet nejsou logovány v systémových záznamech e-shopu a že je dodržen PCI-DSS standard (e-shop zpracovává pouze tokeny, nikoliv PAN/CVV).  
* **Uživatelské a UX testování (Střední priorita):**  
  * *Rozsah:* Ověření srozumitelnosti chybových hlášení pro zákazníka při návratu z brány.  
* **Performance a load testování (Omezené / Nižší priorita):**  
  * *Rozsah:* Omezeno pouze na ověření odezvy vlastního API endpointu e-shopu při příjmu webhooků (zátěž samotné brány testuje dodavatel).  
* **Automatizované regresní testování (Doporučeno):**  
  * *Rozsah:* Vytvoření automatizovaných API/UI testů pro klíčové platební scénáře (úspěch, zamítnutí, timeout) pro budoucí nasazení.

## 

## 

## 

## 

## 

## 

## 

## 

## **5\. Návrh konkrétních testovacích případů (Test Cases)**

**Vybraná testovací podmínka:**

 *Bod 2 \+ Bod 9 – Zamezení fakturace při neúspěšné/přerušené platbě a správné mapování chybových stavů.*

### **Test Case 1: Přerušená platba uživatelem (User Abort / Redirect back)**

* **ID:** TC\_PAY\_01  
* **Popis:** Ověření chování systému, pokud zákazník na bráně klikne na "Zpět do obchodu" nebo zavře okno před dokončením platby.  
* **Předpoklady:** Uživatel má vytvořenou objednávku v košíku, je v kroku platební brány.  
* **Test steps:**  
  * Zákazník zahájí platbu novou platební bránou.  
  * Na stránce platební brány klikne na tlačítko pro zrušení platby / návrat do e-shopu.  
  * Zákazník je přesměrován zpět do e-shopu.  
  * Kontrola stavu objednávky v administraci / databázi.  
  * Kontrola modulu fakturace a finančních přehledů.  
* **Očekávaný výsledek:**  
  * Sestava checkoutu v e-shopu zobrazí srozumitelnou hlášku: *"Platba byla zrušena."*  
  * Stav objednávky v systému je namapován na `Platební brána - zrušeno / Neuhrazeno`.  
  * **Nevznikne žádný záznam ve fakturaci** (faktura se nevygeneruje).  
  * Transakce **není** zahrnuta do finančních přehledů tržeb.  
  * Uživatel má možnost platbu opětovně zahájit (Bod 12\) bez nutnosti vytvářet novou objednávku.

### 

### 

### 

### 

### 

### 

### **Test Case 2: Zamítnutí platby bankou (Issuer Declined) \+ Webhook vs. Redirect**

* **ID:** TC\_PAY\_02  
* **Popis:** Ověření reakce systému na zamítnutí transakce vydávající bankou a konzistence dat při opožděném doručení webhooku.  
* **Předpoklady:** Použití testovací karty pro simulaci zamítnutí s, Nedostatek prostředků (Insufficient funds).  
* **Test steps:**  
  * Zákazník zadá údaje testovací karty na bráně a potvrdí platbu.  
  * Brána vrátí zamítnutí a přesměruje uživatele zpět s chybovým kódem `ERR_INSUFFICIENT_FUNDS`.  
  * Současně brána odešle asynchronní webhook do e-shopu.  
  * Kontrola zalistování v systému a auditní stopy (Bod 11).  
* **Očekávaný výsledek:**  
  * Systém správně namapuje chybový kód brány na interní stav `Zamítnuto vydavatelem` (Bod 9).  
  * Do objednávky se propíše hodnocení úspěšnosti platby (Bod 10\) jako např. `Neúspěšné - zamítnuto`.  
  * **Žádná fakturace nevznikne.**  
  * V auditní stopě objednávky je přesně zaznamenáno, kdy a na základě jaké zprávy (webhook / redirect) ke změně stavu došlo (Bod 11).

