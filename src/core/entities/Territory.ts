/* eslint-disable import/prefer-default-export */
export class Territory {
  population: number;

  safety: number;

  prosperity: number;

  area: number;

  constructor(
    population: number,
    safety: number,
    prosperity: number,
    area: number
  ) {
    this.population = population;
    this.safety = safety;
    this.prosperity = prosperity;
    this.area = area;
  }

  get popuIncRate(): number {
    const standardPopulation = 10000 * this.area;
    let baseRate = 0;
    if (this.population <= standardPopulation) {
      baseRate = 0.01;
    } else {
      baseRate =
        ((2 * standardPopulation - this.population) * 0.01) /
        standardPopulation;
    }
    const safetyBuff = (this.safety - 50) / 50 / 100;
    return (baseRate + safetyBuff) / 12;
  }

  get prosIncRate(): number {
    if (this.safety > 50) {
      return 0.01 * (((10000 - this.prosperity) / 10000) * (this.safety / 100));
    }
    return 0.01 * ((this.prosperity / 10000) * ((this.safety - 50) / 100));
  }
}
