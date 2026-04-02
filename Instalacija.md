# Pokretanje projekta na Windows računaru

Ovaj projekat se sastoji iz:

- **Spring Boot backend-a**
- **Angular frontend-a**

Backend koristi:

- **Java 21**
- **Maven**
- **Spring Boot 3.3.5**
- **MySQL konektor**

---

## 1. Šta treba da bude instalirano

Za pokretanje projekta na Windows računaru potrebno je da budu instalirani:

### Za backend

- **Java 21**
- **Maven**
- **MySQL**

### Za frontend

- **Node.js**
- **npm**
- **Angular CLI**

---

## 2. Provera da li je sve instalirano

Otvoriti **Command Prompt** ili **PowerShell**.

### Provera backend alata

```bash
java -version
mvn -version
git --version
```

### Provera frontend alata

```bash
node -v
npm -v
ng version
git --version
```

### Provera MySQL-a

```bash
mysql --version
```

Ako želite da proverite da li možete da se povežete na bazu:

```bash
mysql -u root -p
```

---

## 3. Šta znače ove provere

- `java -version` → proverava da li je instalirana Java
- `mvn -version` → proverava da li je instaliran Maven
- `node -v` → proverava da li je instaliran Node.js
- `npm -v` → proverava da li je instaliran npm
- `ng version` → proverava da li je instaliran Angular CLI
- `git --version` → proverava da li je instaliran Git
- `mysql --version` → proverava da li je instaliran MySQL klijent

---

## 4. Ako Angular CLI nije instaliran

Ako komanda `ng version` ne radi, instalirati Angular CLI:

```bash
npm install -g @angular/cli
```

---

## 5. Pokretanje backend-a

Otvoriti terminal i ući u backend folder projekta:

```bash
cd backend
```

Standardni način pokretanja je:

```bash
mvn clean install
mvn spring-boot:run
```

Ako želite samo build bez testova:

```bash
mvn clean install -DskipTests
```

Ako želite da prvo napravite `.jar` fajl:

```bash
mvn clean package
```

A zatim da ga pokrenete:

```bash
java -jar target\backend-1.0-SNAPSHOT.jar
```

---

## 6. Pokretanje frontend-a

Otvoriti novi terminal i ući u frontend folder projekta:

```bash
cd frontend
```

Instalirati zavisnosti:

```bash
npm install
```

Pokrenuti Angular aplikaciju:

```bash
ng serve
```

Ako projekat koristi `npm start`, može i ovako:

```bash
npm start
```

---

## 7. Provera da li aplikacija radi

Kada se backend i frontend uspešno pokrenu, aplikacija je obično dostupna na sledećim adresama:

### Frontend

```text
http://localhost:4200
```

### Backend

```text
http://localhost:8080
```

---

## 8. Kompletan primer pokretanja

### Backend terminal

```bash
cd backend
java -version
mvn -version
mysql --version
mvn clean install
mvn spring-boot:run
```

### Frontend terminal

```bash
cd frontend
node -v
npm -v
ng version
npm install
ng serve
```

---

## 9. Kompletan primer provere da li drugi računar ima sve što treba

Pokrenuti sledeće komande:

```bash
java -version
mvn -version
node -v
npm -v
ng version
git --version
mysql --version
```

Ako sve ove komande rade bez greške, računar verovatno ima sve osnovno što je potrebno.

---

## 10. Šta uraditi ako neka komanda ne radi

### Ako `java -version` ne radi

Java nije instalirana ili nije dodata u `PATH`.

Potrebno je instalirati **JDK 21**.

### Ako `mvn -version` ne radi

Maven nije instaliran ili nije dodat u `PATH`.

Potrebno je instalirati Maven.

### Ako `node -v` ili `npm -v` ne radi

Node.js nije instaliran.

Potrebno je instalirati Node.js.

### Ako `ng version` ne radi

Angular CLI nije instaliran.

Pokrenuti:

```bash
npm install -g @angular/cli
```

### Ako `mysql --version` ne radi

MySQL klijent nije instaliran ili nije dodat u `PATH`.

### Ako backend ne može da se poveže na bazu

Proveriti:

- da li je MySQL servis pokrenut
- da li baza postoji
- da li su `spring.datasource.*` vrednosti tačne
- da li korisnik ima pristup toj bazi

---