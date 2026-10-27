1.  Předpoklady pro testování, součinnost a nejasnosti v zadání
    Předpoklady pro testování (Prerequisites) Dostupnost sandboxu /
    testovacího prostředí platební brány: Stabilní testovací prostředí
    (sandbox) dodavatele brány s možností simulovat různé návratové
    kódy, stavové kódy (webhooky/callbacky) a chybové situace (výpadek
    spojení, zamítnutí bankou, vypršení session).

Izolované testovací prostředí e-shopu (Test/Staging): Možnost resetu
databáze, mockování platebních metod a přístup k databázovým logům (nebo
administraci) pro ověření stavů plateb a objednávek.

Testovací data a testovací karty: Sada testovacích platebních karet
(test cards) pro různé typy scénářů (3D Secure 1 vs. 2, zamítnuté
transakce, vypršení limitu na bráně).

Dokumentace k API a mapování stavů: Kompletní API kontrakt
(Swagger/OpenAPI specifikace nové brány), specifikace webhooků
(event-driven notifikací) a detailní tabulka mapování chybových kódů.

Součinnost s dalšími rolemi Byznys / Produktový vlastník (PO): Upřesnění
nejasných požadavků v zadání (viz níže) a schválení akceptačních
kritérií pro hraniční stavy plateb.

Vývojářský tým (Backend / Frontend): Součinnost při nastavování
logování, simulaci síťových výpadků (např. pomocí Charles Proxy /
Toxiproxy) a nasazení paralelního běhu bran.

Dodavatel platební brány: Technická podpora pro řešení nesouladu mezi
callbacky (webhooky) a synchronním přesměrováním (redirectem).

Nejasnosti, chybějící informace a rozpory v zadání Bod 6 (Bezpečnost /
Copy-Paste & Autofill): Požadavek zakázat kopírování/vkládání
(clipboard) a automatické vyplňování (autofill) v platebním formuláři.

Rozpor / Riziko: Pokud platební brána běží v externím iframe nebo na
stránkách třetí strany, e-shop nemá nad chováním inputů přímou kontrolu
(brána to musí nativně podporovat). Navíc blokace autofillu a paste
často snižuje konverzní poměr a může být v rozporu s některými standardy
přístupnosti (accessibility). Je nutné ověřit, zda jde o nativní chování
brány, nebo požadavek na vlastní checkout šablonu.

Bod 8 (Dvojité potvrzení): Požadavek, aby všechny platební kroky byly
pro ochranu zákazníka potvrzovány zákazníkem dvakrát.

Nejasnost: V moderním e-commerce UX (a vzhledem k 3D Secure / PSD2) je
dvoufázové ověření standardně řešeno samotnou bankou (2FA / 3DS). Pokud
zadání myslí dvojité kliknutí na e-shopu (např. "Shrnutí" -\>
"Zaplatit"), jde o běžný standard. Pokud však vyžaduje dvakrát potvrdit
platbu na straně brány, odporuje to standardním platebním flow a může to
mást uživatele.

Bod 12 (Opětovné zahájení platby bez nové objednávky):

Architektonické riziko: Pokud uživatel nezaplatí, objednávka zůstane v
rezervaci (blokuje skladové zásoby). Pokud se pokusí platbu opakovat po
delší době, hrozí vyprodání zboží nebo změna cen. Je nutné definovat
business timeout pro expiraci neuhrazené objednávky.

2.  Přístup k testování (Test Approach) v čase Strategie testování bude
    rozdělená do 4 hlavních fází s důrazem na rizikově orientovaný
    přístup (Risk-Based Testing):

Fáze 1: Analytická fáze a statické testování (Shift-Left) Aktivity:
Revize API specifikace, mapovací tabulky stavů (Bod 9) a
architektonického návrhu paralelního běhu staré a nové brány.

Výstup: Testovací strategie, revize akceptačních kritérií.

Fáze 2: Komponentní a integrační testování (Integration & API Testing)
Aktivity:

Testování API kontraktu nové brány (mock server / sandbox).

Ověření správnosti zpracování webhooků a asynchronních notifikací.

Testování mapování chybových kódů (Bod 9) a konzistence dat mezi bránou,
fakturací a finančními přehledy (Bod 2 a 4).

Fáze 3: Systémové a E2E testování (System & E2E Testing) Aktivity:

End-to-end průchody nákupním košíkem (Checkout flow) pro obě brány
běžící paralelně.

Ověření stavů plateb, ukládání poslední platební metody (Bod 3), exportů
přehledů (Bod 5) a propisování hodnocení úspěšnosti (Bod 10).

Testování obnovení neuhrazené platby (Bod 12).

Fáze 4: Akceptační a bezpečnostní testování (UAT & Security) Aktivity:

Ověření bezpečnostních požadavků (zákaz autofillu/paste, PCI-DSS scope
-- e-shop by neměl přijít do styku s citlivými kartovými údaji,
tokenizace).

Uživatelské akceptační testy (UAT) s byznysem.

Co do rozsahu testování NEZAHRNOVAT (Out of Scope): Interní core kód
samotné platební brány: Testování vnitřní logiky bankovního zpracování
transakce na straně poskytovatele brány (to je v režii dodavatele brány,
my testujeme integraci a rozhraní).

Kompletní regresní testování nesouvisejících modulů e-shopu: Např.
redakční systém, správa uživatelských účtů nebo marketingové kampaně,
které nemají vazbu na checkout a fakturaci.

3.  Hlavní testovací podmínky / cíle a jejich priorita Pořadí testování
    vychází z byznysové kritičnosti (Financial & Core Business Impact):

Integrita finančních dat a zamezení chybné fakturace (Bod 2, 4, 9):

Proč: Absolutní priorita v bankovním/finančním sektoru. Neúspěšná platba
nesmí nikdy vygenerovat fakturu ani zalistovat transakci jako úspěšnou v
účetnictví.

Jednoznačnost výsledku platby a chybové stavy (Bod 1, 7, 11):

Proč: Zamezení stavů, kdy uživateli odejdou peníze z účtu, ale systém v
e-shopu objednávku stornuje nebo nechá viset v "limbu". Klíčová je
sledovatelnost (auditní stopa).

Funkčnost paralelního provozu a platebního flow (Checkout & UX):

Proč: Zajištění, že uživatelé správně přecházejí na novou bránu, vrací
se do správného stavu košíku a funguje pamatování metody (Bod 3) i
opakování platby (Bod 12).

Reporting, exporty a doplňkové atributy (Bod 5, 10):

Proč: Interní kontroly, audit a analytika. Důležité pro back-office
oddělení, ale nemá přímý vliv na okamžitou ztrátu tržeb jako bod 1.

Bezpečnostní omezení (Bod 6, 8):

Proč: Ověření restrikcí na formulářová pole a dodržení bezpečnostních
standardů.

4.  Typy testování a jejich doporučení Funkční a integrační testování
    (Klíčové / Priorita 1):

Rozsah: 100% pokrytí všech stavy plateb, webhooků, chybových hlášení a
vazeb do fakturace.

Testování API a kontraktů (Klíčové / Priorita 1):

Rozsah: Ověření správnosti datových struktur posílaných na bránu a
přijímaných z webhooků.

Bezpečnostní testování (Klíčové / Priorita 2):

Rozsah: Ověření, že citlivá data karet neprosakují do systémových logů
e-shopu a že je dodržen PCI-DSS standard (e-shop zpracovává pouze
tokeny, nikoliv PAN/CVV).

Uživatelské a UX testování (Střední priorita):

Rozsah: Ověření srozumitelnosti chybových hlášení pro zákazníka při
návratu z brány.

Výkonnostní a zátěžové testování (Omezené / Nižší priorita):

Rozsah: Omezeno pouze na ověření odezvy vlastního API endpointu e-shopu
při příjmu webhooků (zátěž samotné brány testuje dodavatel).

Automatizované regresní testování (Doporučeno):

Rozsah: Vytvoření automatizovaných API/UI testů pro klíčové platební
scénáře (úspěch, zamítnutí, timeout) pro budoucí nasazení.

5.  Návrh konkrétních testovacích případů (Test Cases) Vybraná testovací
    podmínka: Bod 2 + Bod 9 -- Zamezení fakturace při
    neúspěšné/přerušené platbě a správné mapování chybových stavů.

Test Case 1: Přerušená platba uživatelem (User Abort / Redirect back)
ID: TC_PAY_01

Popis: Ověření chování systému, pokud zákazník na bráně klikne na "Zpět
do obchodu" nebo zavře okno před dokončením platby.

Předpoklady: Uživatel má vytvořenou objednávku v košíku, je v kroku
platební brány.

Testovací kroky:

Zákazník zahájí platbu novou platební bránou.

Na stránce platební brány klikne na tlačítko pro zrušení platby / návrat
do e-shopu.

Zákazník je přesměrován zpět do e-shopu.

Kontrola stavu objednávky v administraci / databázi.

Kontrola modulu fakturace a finančních přehledů.

Očekávaný výsledek:

Sestava checkoutu v e-shopu zobrazí srozumitelnou hlášku: "Platba byla
zrušena."

Stav objednávky v systému je namapován na Platební brána - zrušeno /
Neuhrazeno.

Nevznikne žádný záznam ve fakturaci (faktura se nevygeneruje).

Transakce není zahrnuta do finančních přehledů tržeb.

Uživatel má možnost platbu opětovně zahájit (Bod 12) bez nutnosti
vytvářet novou objednávku.

Test Case 2: Zamítnutí platby bankou (Issuer Declined) + Webhook
vs. Redirect ID: TC_PAY_02

Popis: Ověření reakce systému na zamítnutí transakce vydávající bankou a
konzistence dat při opožděném doručení webhooku.

Předpoklady: Použití testovací karty pro simulaci zamítnutí s,
Nedostatek prostředků (Insufficient funds).

Testovací kroky:

Zákazník zadá údaje testovací karty na bráně a potvrdí platbu.

Brána vrátí zamítnutí a přesměruje uživatele zpět s chybovým kódem
ERR_INSUFFICIENT_FUNDS.

Současně brána odešle asynchronní webhook do e-shopu.

Kontrola zalistování v systému a auditní stopy (Bod 11).

Očekávaný výsledek:

Systém správně namapuje chybový kód brány na interní stav Zamítnuto
vydavatelem (Bod 9).

Do objednávky se propíše hodnocení úspěšnosti platby (Bod 10) jako např.
Neúspěšné - zamítnuto.

Žádná fakturace nevznikne.

V auditní stopě objednávky je přesně zaznamenáno, kdy a na základě jaké
zprávy (webhook / redirect) ke změně stavu došlo (Bod 11).
