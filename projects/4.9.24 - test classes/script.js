class Osoba {
    constructor(jmeno, prijmeni, rokNarozeni, druheJmeno = "") {
        this.jmeno = jmeno;
        this.prijmeni = prijmeni;
        this.rokNarozeni = rokNarozeni;
        this.druheJmeno = druheJmeno;
        this.zajmy = [];
    }

    vek() {
        return new Date().getFullYear() - this.rokNarozeni;
    }
    predstavSe() {
        console.log(`Ahoj, jmenuji se ${this.jmeno}${this.druheJmeno != "" ? ` ${this.druheJmeno}` : ""} ${this.prijmeni} a je mi ${this.vek()} let.`);
    }
    pridejZajem(zajem) {
        this.zajmy.push(zajem);
    }
    vypisZajmy() {
        console.log(`Moje zájmy jsou: ${this.zajmy.join(", ")}.`);
    }
}

const osoba = new Osoba("Jirka", "Adamec", 2069);
osoba.predstavSe();
osoba.pridejZajem("Klára Adamcová");
osoba.pridejZajem("Bára Adamcová");
osoba.pridejZajem("Gabriela Podojená");
osoba.vypisZajmy();