class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];

        this.animaisPermitidos = {
            LEAO: { tamanho: 3, biomas: ["savana"] },
            LEOPARDO: { tamanho: 2, biomas: ["savana"] },
            CROCODILO: { tamanho: 3, biomas: ["rio"] },
            MACACO: { tamanho: 1, biomas: ["savana", "floresta"] },
            GAZELA: { tamanho: 2, biomas: ["savana"] },
            HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"] }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const biomasPermitidos = this.animaisPermitidos[animal].biomas;
        const tamanhoAnimal = this.animaisPermitidos[animal].tamanho;

        let recintosViaveis = [];

        for (const recinto of this.recintos) {
            const espacoOcupado = this.calcularEspacoOcupado(recinto, animal);
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;

            const biomaValido = biomasPermitidos.some(bioma => recinto.bioma.includes(bioma));
            const espacoSuficiente = espacoLivre >= quantidade * tamanhoAnimal;

            if (animal === "MACACO" && recinto.animais.length === 0 && quantidade === 1) {
                continue;
            }

            if (biomaValido && espacoSuficiente) {
                if (this.validarCarnivoros(recinto, animal) && this.validarHipopotamo(recinto, animal)) {
                    recintosViaveis.push({
                        numero: recinto.numero,
                        espacoLivre: espacoLivre - quantidade * tamanhoAnimal,
                        total: recinto.tamanhoTotal
                    });
                }
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        recintosViaveis.sort((a, b) => a.numero - b.numero);

        const recintosFormatados = recintosViaveis.map(
            recinto => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.total})`
        );

        return { erro: null, recintosViaveis: recintosFormatados };
    }

    calcularEspacoOcupado(recinto, novoAnimal = null) {
        let espacoOcupado = 0;
        let especiesNoRecinto = new Set();

        for (const animal of recinto.animais) {
            const especieAnimal = this.animaisPermitidos[animal.especie];
            if (!especieAnimal) {
                throw new Error(`Animal ${animal.especie} não permitido`);
            }
            const tamanhoAnimal = especieAnimal.tamanho;
            espacoOcupado += animal.quantidade * tamanhoAnimal;
            especiesNoRecinto.add(animal.especie);
        }

        if (novoAnimal) {
            especiesNoRecinto.add(novoAnimal);
        }

        if (especiesNoRecinto.size > 1) {
            espacoOcupado += 1;
        }

        return espacoOcupado;
    }

    validarCarnivoros(recinto, novoAnimal) {
        const isCarnivoro = ["LEAO", "LEOPARDO", "CROCODILO"].includes(novoAnimal);
        if (!isCarnivoro) {

            for (const animal of recinto.animais) {
                if (["LEAO", "LEOPARDO", "CROCODILO"].includes(animal.especie)) {
                    return false;
                }
            }
            return true;
        } else {
            for (const animal of recinto.animais) {
                if (animal.especie !== novoAnimal) {
                    return false;
                }
            }
            return true;
        }
    }

    validarHipopotamo(recinto, novoAnimal) {
        if (novoAnimal !== "HIPOPOTAMO") return true;
        return recinto.bioma === "savana e rio" || (recinto.bioma === "rio" && recinto.animais.length === 0);
    }
}

export { RecintosZoo as RecintosZoo };