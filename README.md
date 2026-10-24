##  Setup
```
git clone https://github.com/mmilkos/telemedi.git
cd telemedi
npm install && npx playwright install --with-deps
```
## Odpalanie testów
- ``` npm run test --login=[LOGIN] --password=[PASSWORD] ``` - Testy w trybie headless
- ``` npm run test:headed --login=[LOGIN] --password=[PASSWORD]``` - Testy w widocznej przeglądarce
- ```npm run test:ui --login=[LOGIN] --password=[PASSWORD]``` - Testy z interaktywnym UI playwright
-  ```npm run report``` - Wyietlenie raportu z testów

## @known-bug

Test 'Umówienie wizyty zdalnej chat' oznaczony tagiem @known-bug pokrywa znaleziony defekt i nie przejdzie.
