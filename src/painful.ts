import { Notation } from "./notation";
import Decimal from "break_infinity.js/break_infinity";

// Unicode has no seven-pointed star.
const COINS = '▲■⬟⬣✴';

export class PainfulNotation extends Notation {
  public get name(): string {
    return "Painful";
  }

  public get infinite(): string {
    return 'ω';
  }

  public formatUnder1000(value: number): string {
    return this.formatAnyNumber(new Decimal(value));
  }

  public formatDecimal(value: Decimal): string {
    return this.formatAnyNumber(value);
  }

  private formatPain(value: number): string {
    return [4, 3, 2, 1, 0].map(i => {
      let digit = Math.floor(value / Math.pow(10, i)) % 10;
      if (digit === 0) {
        return '';
      } else if (digit === 1) {
        return COINS[i];
      } else {
        return digit + COINS[i];
      }
    }).join('');
  }

  private formatAnyNumber(value: Decimal): string {
    if (value.lt(0)) {
      return `-${this.formatAnyNumber(value.negate())}`;
    }
    if (value.eq(0)) {
      return "0";
    }
    let level = 0;
    while (value.lt(1)) {
      value = new Decimal(1e5 * value.toNumber());
      level -= 1;
    }
    while (value.gte(1e5)) {
      value = new Decimal(value.log(1e5));
      level += 1;
    }
    let numberValue = value.toNumber();
    let a = [];
    for (let i = 0; i < 2; i++) {
      a.push(Math.floor(numberValue + 1e-9));
      numberValue = 1e5 * (numberValue - Math.floor(numberValue + 1e-9));
    }
    if (a[1] === 0) {
      a.pop();
    }
    let b = a.map(x => this.formatPain(x))
    if (level <= 0) {
      return '↓'.repeat(-level) + b.join('↓');
    } else {
      return '↑'.repeat(level - a.length + 1) + b.reverse().join('↑');
    }
  }
}
