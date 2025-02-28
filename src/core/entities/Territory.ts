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

  reset(population: number, safety: number, prosperity: number, area: number) {
    this.population = population;
    this.safety = safety;
    this.prosperity = prosperity;
    this.area = area;
  }

  get popuInc(): number {
    return Math.round(
      Math.max(this.population, this.area * 10000) * this.popuIncRate
    );
  }

  get popuIncRate(): number {
    const standardPopulation = 10000 * this.area;
    const rate = 0.05;
    if (this.safety >= 50) {
      if (this.population <= standardPopulation) {
        const baseRate = rate;
        return baseRate * ((this.safety - 50) / 50);
      }
      if (this.population <= 2 * standardPopulation) {
        const baseRate =
          ((2 * standardPopulation - this.population) * rate) /
          standardPopulation;
        return baseRate * ((this.safety - 50) / 50);
      }
      const baseRate =
        ((2 * standardPopulation - this.population) * rate) /
        standardPopulation;
      return baseRate * ((50 - this.safety) / 50);
    }
    if (this.population <= standardPopulation) {
      const baseRate = rate;
      return baseRate * ((this.safety - 50) / 50);
    }
    const baseRate =
      ((this.population - standardPopulation) / standardPopulation) * rate +
      rate;
    return baseRate * ((this.safety - 50) / 50);
  }

  get prosInc(): number {
    if (this.safety > 50) {
      return Math.round(
        100 * ((((10000 - this.prosperity) / 10000) * (this.safety - 50)) / 50)
      );
    }
    return Math.round(
      100 * (this.prosperity / 10000) * ((this.safety - 50) / 50)
    );
  }

  get tax(): number {
    return Math.round((this.population * this.prosperity) / 10000);
  }
}
