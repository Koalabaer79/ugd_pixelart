# Aufgabenergebnis

## Eingesetzte Technologien / Frameworks

Folgende Technologien / Frameworks setze ich in meinem Projekt ein:

- Angular mit Typescript

Ich habe mich für Angular entschieden, weil ich gerne mit diesem Framework arbeite.
Jedoch hat sich jetzt herausgestellt, dass die ngFor Loop-Funktion durch das Objekt zur Erstellung des Grids nicht so funktioniert wie ich es mir wünsche. Die Anordnung der Zellen ist -> 0 1 10 11 2 20 21 und das funktioniert so nicht mit der Anzeige. Wenn ich die Farben in des Objekt in die Keys von Row und Col einsetzen will, dann erscheinen sie woanders und nicht dort, wo sie sollen.
Nach ein bisschen puzzeln habe ich zumindest "paint" für die einzelnen Zeilen hinbekommen. Doch nun hackt es ein wenig an dem "paintbucket" Tool, welches nicht exakt das füllt, was es füllen sollte.


## Eingesetzte 3rd Party Libraries

Ich habe keine extra Libraries benutzt, da sie mir für das kleine aber feine Projekt nichts nützen.

## Installation / Ausführen des Projektes

- Repository clonen
- Angular Projekt nach Installation lokal ausführen

---

Folgende Komponenten müssen lokal installiert sein:

- [npm](https://www.npmjs.com/) 6.14.13
- [nodeJS](https://nodejs.org/de/) v14.17.1
- [.NET Core](https://dotnet.microsoft.com/download) v3.1

Um das Projekt lokal auszuführen, folgendes in der Commandline / Bash eingeben:

```console
$ git clone https://github.com/Koalabaer79/ugd_pixelart.git
$ cd ugd_pixelart/projekt
$ npm install
$ ng serve --o
```
---
