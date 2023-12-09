import { DC } from "../../constants";

function rebuyableCost(initialCost, increment, id) {
  return Decimal.multiply(initialCost, Decimal.pow(increment, player.dilation.rebuyables[id]));
}
function rebuyable(config) {
  return {
    id: config.id,
    cost: () => rebuyableCost(config.initialCost, config.increment, config.id),
    initialCost: config.initialCost,
    increment: config.increment,
    description: config.description,
    effect: () => config.effect(player.dilation.rebuyables[config.id]),
    formatEffect: config.formatEffect,
    formatCost: config.formatCost,
    purchaseCap: config.purchaseCap,
    reachedCap: () => player.dilation.rebuyables[config.id] >= config.purchaseCap,
    pelleOnly: Boolean(config.pelleOnly),
    rebuyable: true
  };
}

export const dilationUpgrades = {
  dtGain: rebuyable({
    id: 1,
    initialCost: 1e4,
    increment: 10,
    description: () =>
      ((SingularityMilestone.dilatedTimeFromSingularities.canBeApplied || Achievement(187).canBeApplied)
        ? `${formatX(2 * Effects.product(
          SingularityMilestone.dilatedTimeFromSingularities,
          Achievement(187)
        ), 2, 2)} Dilated Time gain`
        : "Double Dilated Time gain"),
    effect: bought => {
      const base = 2 * Effects.product(
        SingularityMilestone.dilatedTimeFromSingularities,
        Achievement(187)
      );
      return Decimal.pow(base, bought);
    },
    formatEffect: value => {
      const nonInteger = SingularityMilestone.dilatedTimeFromSingularities.canBeApplied ||
        Achievement(187).canBeApplied;
      return formatX(value, 2, nonInteger ? 2 : 0);
    },
    formatCost: value => format(value, 2),
    purchaseCap: Number.MAX_VALUE
  }),
  galaxyThreshold: rebuyable({
    id: 2,
    initialCost: 1e6,
    increment: 100,
    description: () =>
      (Perk.bypassTGReset.isBought && !Pelle.isDoomed
        ? "Reset Tachyon Galaxies, but lower their threshold"
        : "Reset Dilated Time and Tachyon Galaxies, but lower their threshold"),
    // The 38th purchase is at 1e80, and is the last purchase.
    effect: bought => (bought < 38 ? Math.pow(0.8, bought) : 0),
    formatEffect: effect => {
      if (effect === 0) return `${formatX(getTachyonGalaxyMult(effect), 4, 4)}`;
      const nextEffect = effect === Math.pow(0.8, 37) ? 0 : 0.8 * effect;
      return `${formatX(getTachyonGalaxyMult(effect), 4, 4)} ➜
        Next: ${formatX(getTachyonGalaxyMult(nextEffect), 4, 4)}`;
    },
    formatCost: value => format(value, 2),
    purchaseCap: 38
  }),
  tachyonGain: rebuyable({
    id: 3,
    initialCost: 1e7,
    increment: 20,
    description: () => {
      if (Pelle.isDoomed) return `Multiply the amount of Tachyon Particles gained by ${formatInt(1)}`;
      if (Enslaved.isRunning) return `Multiply the amount of Tachyon Particles gained
      by ${Math.pow(3, Enslaved.tachyonNerf).toFixed(2)}`;
      return "Triple the amount of Tachyon Particles gained";
    },
    effect: bought => {
      if (Pelle.isDoomed) return DC.D1.pow(bought);
      return DC.D3.pow(bought);
    },
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: Number.MAX_VALUE
  }),
  reduceAndIncrease: rebuyable({
    id: 4,
    initialCost: 1e10,
    increment: 40,
    description: () => {
      let base = 0.5;
      if (Currency.dilatedTime.value.gte(DC.E1000)) {
        base /= ((Decimal.log10(Currency.dilatedTime.value) / 2000) / 50) + 1;
      }
      // eslint-disable-next-line no-negated-condition
      const reduction = x => (x !== 0.5 ? `/${format(x.toDecimal().recip(), 2, 3)}` : formatPercents(x, 2, 2));
      return `Reduce dilated time gain by ${reduction(base)} but increase the TP gain by ${formatX(4)}`;
    },
    effect: bought => {
      let lowBaser = 0.5;
      if (Currency.dilatedTime.value.gte(DC.E1000)) {
        lowBaser /= ((Decimal.log10(Currency.dilatedTime.value) / 2000) / 50) + 1;
      }
      return {
        dt: Decimal.pow(lowBaser, bought),
        tp: DC.D4.pow(bought)
      };
    },
    formatEffect: obj => {
      if (obj.dt.lte(0.01)) return `/${format(obj.dt.recip(), 2, 2)} DT, ${formatX(obj.tp, 2, 2)} TP`;
      return `${formatX(obj.dt, 2, 2)} DT, ${formatX(obj.tp, 2, 2)} TP`;
    },
    formatCost: value => format(value, 2),
    purchaseCap: Number.MAX_VALUE
  }),
  doubleGalaxies: {
    id: 5,
    cost: 5e6,
    description: () => `Gain ${formatX(20)} as many Tachyon Galaxies, up to ${formatInt(500)} base Galaxies`,
    effect: 20
  },
  tdMultReplicanti: {
    id: 6,
    cost: 1e9,
    description: () => `Time Dimensions are affected by Replicanti multiplier ${formatPow(0.1, 1, 3)}`,
    effect: () => {
      const rep10 = replicantiMult().pLog10() * 0.1;
      return Decimal.pow10(rep10);
    },
    formatEffect: value => formatX(value, 2, 1)
  },
  ndMultDT: {
    id: 7,
    cost: 5e7,
    description: "Antimatter Dimension multiplier based on Dilated Time, unaffected by Time Dilation",
    effect: () => Currency.dilatedTime.value.pow(308).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  ipMultDT: {
    id: 8,
    cost: 2e12,
    description: "Gain a multiplier to Infinity Points based on Dilated Time and improve the IP mult upgrade",
    effect: () => Currency.dilatedTime.value.pow(1000).clampMin(1),
    formatEffect: value => formatX(value, 2, 1),
    cap: () => Effarig.eternityCap
  },
  timeStudySplit: {
    id: 9,
    cost: 1e10,
    description: "You can buy all three Time Study paths from the Dimension Split"
  },
  dilationPenalty: {
    id: 10,
    cost: 1e11,
    description: () => `Reduce the Dilation penalty (${formatPow(1.12, 2, 2)} after reduction)`,
    effect: 1.12,
  },
  ttGenerator: {
    id: 11,
    cost: 1e15,
    description: "Generate Time Theorems based on Tachyon Particles",
    effect: () => Currency.tachyonParticles.value.div(20000),
    formatEffect: value => `${format(value, 2, 1)}/sec`
  },
  dtGainPelle: rebuyable({
    id: 12,
    initialCost: 1e14,
    increment: 100,
    pelleOnly: true,
    description: () => `${formatX(5)} Dilated Time gain`,
    effect: bought => Decimal.pow(5, bought),
    formatEffect: value => formatX(value, 2),
    formatCost: value => format(value, 2),
    purchaseCap: Number.MAX_VALUE
  }),
  galaxyMultiplier: rebuyable({
    id: 13,
    initialCost: 1e15,
    increment: 1000,
    pelleOnly: true,
    description: "Multiply Tachyon Galaxies gained, applies after TG doubling upgrade",
    effect: bought => bought + 1,
    formatEffect: value => `${formatX(value, 2)} ➜ ${formatX(value + 1, 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: Number.MAX_VALUE
  }),
  tickspeedPower: rebuyable({
    id: 14,
    initialCost: 1e16,
    increment: 1e4,
    pelleOnly: true,
    description: "Gain a power to Tickspeed",
    effect: bought => 1 + bought * 0.03,
    formatEffect: value => `${formatPow(value, 2, 2)} ➜ ${formatPow(value + 0.03, 2, 2)}`,
    formatCost: value => format(value, 2),
    purchaseCap: Number.MAX_VALUE
  }),
  galaxyThresholdPelle: {
    id: 15,
    cost: 1e45,
    pelleOnly: true,
    description: "Apply a 10th root to the Tachyon Galaxy threshold",
    effect: 1 / 10
  },
  flatDilationMult: {
    id: 16,
    cost: 1e55,
    pelleOnly: true,
    description: () => `Gain more Dilated Time based on current EP`,
    effect: () => 1e9 ** Math.min((Math.max(player.eternityPoints.log10() - 1500, 0) / 2500) ** 1.2, 1),
    formatEffect: value => formatX(value, 2, 2)
  },
};
