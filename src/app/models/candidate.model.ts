import {Deserializable} from './deserializable.model';

export class Candidate implements Deserializable {
    
    public id: number;
    public nombre: string;
    public nacimiento: Date;
    public numero: number;
    public partido: string;
    public antecedentes: string;
    public propuestas: string;
    
    constructor(id: number, nombre: string, nacimiento: Date, numero: number, partido: string, antecedentes: string, propuestas: string) {
        this.id = id;
        this.nombre = nombre;
        this.nacimiento = nacimiento;
        this.numero = numero;
        this.partido = partido;
        this.antecedentes = antecedentes;
        this.propuestas = propuestas;
    }

    deserialize(input: any): this {
        return Object.assign(this, input);
    }

    getId() {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(nombre: string) {
        this.nombre = nombre;
    }

    getNacimiento() {
        return this.nacimiento;
    }

    setNacimiento(nacimiento: Date) {
        this.nacimiento = nacimiento;
    }

    getNumero() {
        return this.numero;
    }

    setNumero(numero: number) {
        this.numero = numero;
    }

    getPartido() {
        return this.partido;
    }

    setPartido(partido: string) {
        this.partido = partido;
    }

    getAntecedentes() {
        return this.antecedentes;
    }

    setAntecedentes(antecedentes: string) {
        this.antecedentes = antecedentes;
    }

    getPropuestas() {
        return this.propuestas;
    }

    setPropuestas(propuestas: string) {
        this.propuestas = propuestas;
    }

}
