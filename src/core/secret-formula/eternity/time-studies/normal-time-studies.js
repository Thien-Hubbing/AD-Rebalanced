import { DC } from "../../../constants";
import { ReplicantiUpgrade } from "../../../replicanti";

const thisInfinityMult = thisInfinity => {
  // All "this inf time" or "best inf time" mults are * 10
  const scaledInfinity = thisInfinity * 10 + 1;
  const cappedInfinity = Math.pow(scaledInfinity, 0.0345);
  return DC.D15.pow(Math.log(scaledInfinity) * cappedInfinity);
};
const passiveIPMult = () => {
  const isEffarigLimited = Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY;
  const normalValue = Perk.studyPassive.isBought ? 1e50 : 1e25;
  return normalValue.toDecimal().times(TimeStudy(143).effectValue.cbrt())
    .min(isEffarigLimited ? Effarig.eternityCap : DC.E9E15);
};


/**
 * List of time study specifications and attributes
 * {
 *  @property {Number} id                   Numerical ID shown for each time study in code and in-game
 *  @property {Number} cost                 Amount of available time theorems required to purchase
 *  @property {Number} STcost               Amount of available space theorems required to purchase if needed
 *  @property {Object[]} requirement   Array of Numbers or functions which are checked to determine purchasability
 *  @property {Number} reqType              Number specified by enum in TS_REQUIREMENT_TYPE for requirement behavior
 *  @property {Number[]} requiresST    Array of Numbers indicating which other studies will cause this particular
 *    study to also cost space theorems - in all cases this applies if ANY in the array are bought
 *  @property {function: @return String} description  Text to be shown in-game for the time study's effects
 *  @property {function: @return Number} effect       Numerical value for the effects of a study
 *  @property {String[]} cap     Hard-coded cap for studies which don't scale forever
 *  @property {String} formatEffect   Formatting function for effects, if the default formatting isn't appropriate
 * }
 */
export const normalTimeStudies = [
  {
    id: 11,
    cost: 1,
    // All requirements of an empty array will always evaluate to true, so this study is always purchasable
    requirement: [],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: "Tickspeed affects 1st Time Dimension with reduced effect",
    effect: () => {
      const tickspeed = Tickspeed.current.dividedBy(1000);
      const firstPart = tickspeed.pow(0.005).times(0.95);
      const secondPart = tickspeed.pow(0.0003).times(0.05);
      return firstPart.plus(secondPart).reciprocate();
    },
    cap: DC.E2_2E6,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 21,
    cost: 3,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Improve Replicanti multiplier formula to
      (log2(x)${formatPow(2)})+x${formatPow(0.032, 3, 3)}`,
    effect: () => {
      if (RealityUpgrade(24).isBought) return DC.D1;
      return Replicanti.amount.pow(0.032);
    },
    // This is a special case because the study itself is *added* to the existing formula, but it makes more sense
    // to display a multiplicative increase just like every other study. We need to do the calculation in here in order
    // to properly show only the effect of this study and nothing else
    formatEffect: value => {
      const oldVal = Decimal.pow(Decimal.log2(Replicanti.amount.clampMin(1)), 2);
      const newVal = oldVal.times(value);
      return formatX(newVal.div(oldVal).clampMin(1), 2, 2);
    }
  },
  {
    id: 22,
    cost: 2,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `You can buy below ${formatInt(1)}ms replicanti interval upgrades with increased cost scaling`,
    effect: 1e-320
  },
  {
    id: 23,
    cost: 3,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Tickspeed affects the global game speed with severally reduced effect`,
    effect: () => Tickspeed.perSecond.plus(1).log10() + 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 31,
    cost: 3,
    requirement: [21],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Powers up multipliers that are based on your Infinities (Bonuses${formatPow(36)})`,
    effect: 36
  },
  {
    id: 32,
    cost: 2,
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: `You gain more Infinities based on Dimension Boosts`,
    effect: () => Math.max(DimBoost.totalBoosts, 1),
    formatEffect: value => formatX(value, 2)
  },
  {
    id: 33,
    cost: 2,
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "You keep half of your Replicanti Galaxies on Infinity"
  },
  {
    id: 34,
    cost: 5,
    requirement: [23],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Antimatter Dimensions are cheaper based on your IP",
    effect: () => Currency.infinityPoints.value.plus(1).pow(0.0026).reciprocate(),
    formatEffect: value => `/${format(value.recip(), 2, 2)}`
  },
  {
    id: 41,
    cost: 4,
    requirement: [31],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `All Galaxies give a ${formatX(DC.D5, 1, 1)} multiplier to Infinity Points gained`,
    effect: () => DC.D5.pow(Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 42,
    cost: 6,
    requirement: [32, 34],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Antimatter Galaxy requirement increases by ${formatInt(32)}
      8th Dimensions instead of ${formatInt(60)}`,
    effect: 32
  },
  {
    id: 51,
    cost: 3,
    requirement: [41, 42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `You gain ${formatX(1e300)} more Infinity Points, more based on your Infinities`,
    effect: () => new Decimal(1e300).times(Currency.infinitiesTotal.value
      .plus(1).pow(4 * TimeStudy(31).effectOrDefault(1))),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 61,
    cost: 3,
    requirement: [51],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `You gain ${formatX(1e20)} more Eternity Points, more based on your Eternities`,
    effect: () => new Decimal(1e20).times(Currency.eternities.value.plus(1).pow(2.25)),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 62,
    cost: 3,
    requirement: [51],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `You gain Replicanti ${formatInt(10)} times faster`,
    effect: 10
  },
  {
    id: 63,
    cost: 3,
    requirement: [42, () => Perk.bypassEC5Lock.isBought || EternityChallenge(5).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `Distant Antimatter Galaxy scaling starts ${formatPercents(0.1)} later`,
    effect: 1.1
  },
  {
    id: 71,
    cost: 4,
    requirement: [62, () => Perk.studyECRequirement.isBought || !EternityChallenge(12).isUnlocked],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Dimensional Sacrifice affects all other Antimatter Dimensions with reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.333).clampMin(1),
    cap: DC.E1E9,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 72,
    cost: 6,
    requirement: [62,
      () => Perk.studyECRequirement.isBought ||
        (!EternityChallenge(11).isUnlocked && !EternityChallenge(12).isUnlocked)],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Dimensional Sacrifice affects 4th Infinity Dimension with greatly reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.04).clampMin(1),
    cap: DC.E5E7,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 73,
    cost: 5,
    requirement: [62, () => Perk.studyECRequirement.isBought || !EternityChallenge(11).isUnlocked],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: "Dimensional Sacrifice affects 3rd Time Dimension with greatly reduced effect",
    effect: () => Sacrifice.totalBoost.pow(0.005).clampMin(1),
    cap: DC.E1E6,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 81,
    cost: 4,
    requirement: [71],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Base Dimension Boost power becomes ${formatX(100)}`,
    effect: 100
  },
  {
    id: 82,
    cost: 6,
    requirement: [72],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Dimension Boosts affect Infinity Dimensions",
    effect: () => DC.D1_0000109.max(TimeStudy(183).canBeApplied ? 2 : 1)
      .pow(Math.pow(DimBoost.totalBoosts, TimeStudy(183).canBeApplied ? 1.5 : 2)),
    cap: DC.E5E10,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 83,
    cost: 5,
    requirement: [73],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Dimension Boost multiplier based on tick upgrades gained from TDs",
    effect: () => DC.D1_0004.pow(player.totalTickGained),
    cap: DC.E100000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 91,
    cost: 4,
    requirement: [81],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Antimatter Dimension multiplier based on time spent in this Eternity",
    effect: () => Decimal.pow10(Time.thisEternity.totalMinutes * 15).clampMin(DC.E320000),
    cap: DC.E320000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 92,
    cost: 5,
    requirement: [82],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Infinity Dimension multiplier based on fastest Eternity time",
    effect: () => DC.D2.pow(60 / Math.max(Time.bestEternity.totalSeconds, 2)),
    cap: DC.C2P30,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 93,
    cost: 7,
    requirement: [83],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Time Dimension multiplier based on tick upgrades gained",
    effect: () => Decimal.pow(1.12, player.totalTickGained).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 101,
    cost: 4,
    requirement: [91],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Antimatter Dimension multiplier based on Replicanti amount",
    effect: () => Decimal.max(Replicanti.amount.plus(1).pow(TimeStudy(182).effectOrDefault(285)), 1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 102,
    cost: 6,
    requirement: [92],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Replicanti Galaxies boost Replicanti multiplier",
    effect: () => DC.D8.pow(player.replicanti.galaxies),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 103,
    cost: 6,
    requirement: [93],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Time Dimension multiplier based on total Replicanti Galaxy amount",
    effect: () => Decimal.pow(8, Replicanti.galaxies.total),
    formatEffect: value => formatX(value, 2, 0)
  },
  {
    id: 111,
    cost: 12,
    requirement: [101, 102, 103],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => (Achievement(103).canBeApplied
      ? `Make the Infinity Point formula better log(x)/${formatInt(300)} ➜ log(x)/${formatInt(250)}`
      : `Make the Infinity Point formula better log(x)/${formatInt(308)} ➜ log(x)/${formatInt(250)}`),
    effect: 250
  },
  {
    id: 112,
    cost: 12,
    requirement: [101, 102, 103],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Make the Eternity Point formula better log(x)/${formatInt(308)} ➜ log(x)/${formatInt(285)}`,
    effect: 285
  },
  {
    id: 121,
    cost: 9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [122, 123],
    description: () => (Perk.studyActiveEP.isBought
      ? `You gain ${formatX(50)} more Eternity Points`
      : `You gain more EP based on how fast your last ten Eternities
      were${PlayerProgress.realityUnlocked() ? " (real time)" : ""}`),
    effect: () => (Perk.studyActiveEP.isBought
      ? 50
      : Math.clamp(250 / Player.averageRealTimePerEternity, 1, 50)),
    formatEffect: value => (Perk.studyActiveEP.isBought ? undefined : formatX(value, 1, 1)),
    cap: 50
  },
  {
    id: 122,
    cost: 9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [121, 123],
    description: () => (Perk.studyPassive.isBought
      ? `You gain ${formatX(500)} more Eternity Points`
      : `You gain ${formatX(35)} more Eternity Points`),
    effect: () => (Perk.studyPassive.isBought ? 500 : 35)
  },
  {
    id: 123,
    cost: 9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [121, 122],
    description: "You gain more Eternity Points based on time spent this Eternity",
    effect: () => {
      const perkEffect = TimeSpan.fromMinutes(Perk.studyIdleEP.effectOrDefault(0));
      const totalSeconds = Time.thisEternity.plus(perkEffect).totalSeconds;
      return Math.sqrt(5 * totalSeconds);
    },
    formatEffect: value => formatX(value, 1, 1)
  },
  {
    id: 131,
    cost: 5,
    STCost: 8,
    requirement: [121],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [132, 133],
    description: () => (Achievement(138).isUnlocked
      ? `You can get ${formatPercents(0.75)} more Replicanti Galaxies`
      : `Automatic Replicanti Galaxies are disabled, but you can get ${formatPercents(0.75)} more`),
    effect: () => Math.floor(player.replicanti.boughtGalaxyCap / 1.5)
  },
  {
    id: 132,
    cost: 5,
    STCost: 8,
    requirement: [122],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [131, 133],
    description: () => (Perk.studyPassive.isBought && !Pelle.isDoomed
      ? `Replicanti Galaxies are ${formatPercents(0.5)} stronger, you can gain ${formatPercents(0.5)} more,
       and Replicanti is ${format(1000)} times faster`
      : `Replicanti Galaxies are ${formatPercents(0.5)} stronger and you can gain ${formatPercents(0.5)} more.`),
    effect: () => ([0.5, Math.floor(player.replicanti.boughtGalaxyCap / 2)])
  },
  {
    id: 133,
    cost: 5,
    STCost: 8,
    requirement: [123],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [131, 132],
    description: () => (Achievement(138).isUnlocked
      ? `Replicanti Galaxies are ${formatPercents(0.8)} stronger`
      : `Replicanti are ${formatX(10)} slower until ${format(Number.MAX_VALUE, 2)}` +
    `, but Replicanti Galaxies are ${formatPercents(0.8)} stronger`),
    effect: 0.8
  },
  {
    id: 141,
    cost: 4,
    STCost: 2,
    requirement: [131],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [142, 143],
    description: () => (Perk.studyActiveEP.isBought
      ? `You gain ${formatX(DC.E45)} more Infinity Points`
      : "Multiplier to Infinity Points, which decays over this Infinity"),
    effect: () => (Perk.studyActiveEP.isBought
      ? DC.E45
      : DC.E45.divide(thisInfinityMult(getProperDeltaTime(Time.thisInfinity.totalSeconds, 2))).clampMin(1)),
    formatEffect: value => (Perk.studyActiveEP.isBought ? undefined : formatX(value, 2, 1))
  },
  {
    id: 142,
    cost: 4,
    STCost: 2,
    requirement: [132],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [141, 143],
    description: () => `You gain ${formatX(Perk.studyPassive.isBought ? 1e50 : 1e25)} more Infinity Points,
      more based on how long you spend in this infinity`,
    effect: passiveIPMult,
    formatEffect: value => formatX(value, 2, 2),
    cap: () => (Effarig.eternityCap === undefined ? undefined : Effarig.eternityCap.toNumber())
  },
  {
    id: 143,
    cost: 4,
    STCost: 2,
    requirement: [133],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [141, 142],
    description: "Multiplier to Infinity Points, which increases over this Infinity",
    effect: () => {
      const perkEffect = TimeSpan.fromMinutes(Perk.studyIdleEP.effectOrDefault(0));
      const totalSeconds = Time.thisInfinity.plus(perkEffect).totalSeconds;
      return thisInfinityMult(totalSeconds);
    },
    formatEffect: value => formatX(value, 2, 1),
    cap: () => Effarig.eternityCap
  },
  {
    id: 151,
    cost: 8,
    requirement: [141, 142, 143],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `${formatX(1e100)} multiplier on all Time Dimensions, boosted by your EC completions`,
    effect: () => DC.E100.pow(EternityChallenges.completions / 12 + 1),
    formatEffect: value => formatX(value, 2, 1),
  },
  {
    id: 161,
    cost: 7,
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `${formatX(DC.E100000)} multiplier on all Antimatter Dimensions, boosted by your EC completions`,
    effect: () => DC.E100000.pow(EternityChallenges.completions / 3 + 1),
    formatEffect: value => formatX(value, 2, 1),
  },
  {
    id: 162,
    cost: 7,
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `${formatX(1e300)} multiplier on all Infinity Dimensions, boosted by your EC completions`,
    effect: () => DC.E300.pow(EternityChallenges.completions / 7.5 + 1),
    formatEffect: value => formatX(value, 2, 1),
  },
  {
    id: 171,
    cost: 15,
    requirement: [161, 162],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Time Shard requirement for the next Tickspeed upgrade goes up slower
      ${formatX(1.33, 0, 2)} ➜ ${formatX(1.15, 0, 2)}`,
    effect: () => TS171_MULTIPLIER
  },
  {
    id: 181,
    cost: 200,
    requirement: [171,
      () => EternityChallenge(1).completions > 0 || Perk.bypassEC1Lock.isBought],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `You gain ${formatPercents(1)} of your Infinity Points gained on crunch each second`,
    effect: () => gainedInfinityPoints().times(Time.deltaTime)
      .timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige),
    formatEffect: value => `${format(value, 2, 2)}/sec`
  },
  {
    id: 182,
    cost: 150,
    requirement: [171,
      () => EternityChallenge(2).completions > 0 || Perk.bypassEC2Lock.isBought],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `Time Study 101 uses a better formula (x${formatPow(2.85, 0, 2)} => x${formatPow(12)})`,
    effect: 12
  },
  {
    id: 183,
    cost: 220,
    requirement: [171,
      () => EternityChallenge(3).completions > 0 || Perk.bypassEC3Lock.isBought],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `Time Study 82 uses a better formula`,
  },
  {
    id: 191,
    cost: 400,
    requirement: [181, 182, 183, () => EternityChallenge(10).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `After Eternity you permanently keep ${formatPercents(0.5)}
    of your Infinities as Banked Infinities`,
    effect: () => Currency.infinities.value.times(0.5).floor()
  },
  {
    id: 192,
    cost: 730,
    requirement: [181, 182, 183, () => EternityChallenge(10).completions > 0, () => !Enslaved.isRunning],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => (Enslaved.isRunning
      ? "There is not enough space in this Reality"
      : `Replicanti can go beyond ${format(replicantiCap(), 2, 1)}, but growth slows down at higher amounts`)
  },
  {
    id: 193,
    cost: 300,
    requirement: [181, 182, 183, () => EternityChallenge(10).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: "Antimatter Dimension multiplier based on Eternities",
    effect: () => (DC.E13000.pow(Currency.eternities.value.div(1e6).clampMax(1))),
    cap: DC.E13000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 201,
    cost: 900,
    requirement: [192],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Pick a second path from the Dimension Split"
  },
  {
    id: 211,
    cost: 120,
    requirement: [191],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Dimension Boost requirement scaling is reduced by ${formatInt(6)}`,
    effect: 6
  },
  {
    id: 212,
    cost: 150,
    requirement: [191],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "All Galaxies are stronger based on your Time Shards",
    effect: () => Math.pow(Currency.timeShards.value.clampMin(2).log2(), 0.01),
    cap: 1.5,
    formatEffect: value => `+${formatPercents(value - 1, 3)}`
  },
  {
    id: 213,
    cost: 200,
    requirement: [193],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Replicanti chance can go beyond ${formatPercents(1)} with a boost`,
    effect: () => {
      let eff = 1 + Math.log10(ReplicantiUpgrade.chance.value + 1);
      if (Achievement(161).isUnlocked) eff *= Math.sqrt(eff);
      return eff;
    },
    formatEffect: value => formatPow(value, 3, 3)
  },
  {
    id: 214,
    cost: 120,
    requirement: [193],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: "Dimensional Sacrifice further boosts the 8th Antimatter Dimension (softcaps after a while)",
    effect: () => {
      let eff = Sacrifice.totalBoost.plus(1).pow(2.2);
      if (eff.gte(DC.E1E12)) eff = eff.pow(1 / 6).times(DC.E1E12);
      return eff;
    },
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 221,
    cost: 900,
    STCost: 4,
    requirement: [211],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [222],
    description: "Time Dimension multiplier based on Dimension Boosts",
    effect: () => DC.D1_0025.pow(DimBoost.totalBoosts),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 222,
    cost: 900,
    STCost: 4,
    requirement: [211],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [221],
    description: () => `Dimension Boost costs scale by another ${formatInt(4)} less`,
    effect: 4
  },
  {
    id: 223,
    cost: 900,
    STCost: 4,
    requirement: [212],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [224],
    description: () => `Distant Galaxy cost scaling starts ${formatInt(500)} Galaxies later`,
    effect: 500
  },
  {
    id: 224,
    cost: 900,
    STCost: 4,
    requirement: [212],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [223],
    description() {
      const effect = TimeStudy(224).effectValue;
      return `Distant Galaxy cost scaling starts ${quantifyInt("Galaxy", effect)} later
        (${formatInt(1)} per ${formatInt(650)} Dim Boosts)`;
    },
    effect: () => Math.floor(DimBoost.totalBoosts / 650)
  },
  {
    id: 225,
    cost: 900,
    STCost: 4,
    requirement: [213],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [226],
    description: "You gain extra Replicanti Galaxies based on Replicanti amount",
    effect: () => {
      const eff = Math.floor(Replicanti.amount.exponent / 400);
      if (eff > 5e4) return eff * 0.02 + 5e4;
      return eff;
    },
    formatEffect: value => `+${formatInt(value)} RG`
  },
  {
    id: 226,
    cost: 900,
    STCost: 4,
    requirement: [213],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [225],
    description: "You gain extra Replicanti Galaxies based on their max",
    effect: () => Math.floor(player.replicanti.boughtGalaxyCap / 3.5),
    formatEffect: value => `+${formatInt(value)} RG`
  },
  {
    id: 227,
    cost: 900,
    STCost: 4,
    requirement: [214],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [228],
    description: () => {
      if (TimeStudy(227).isBought) return `DS affects 8th dimensions types`;
      return "Dimensional Sacrifice affects 8th Infinity and Time Dimensions with reduced effect";
    },
    effect: () => ({
      infinity: Sacrifice.totalBoost.plus(1).pow(0.001),
      time: Sacrifice.totalBoost.plus(1).pow(0.0002)
    }),
    formatEffect: obj => `${formatX(obj.infinity, 2, 2)} to infinity, ${formatX(obj.time, 2, 2)} to time`
  },
  {
    id: 228,
    cost: 900,
    STCost: 4,
    requirement: [214],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [227],
    description: () => `Dimensional Sacrifice formula scales better
      ${Sacrifice.getSacrificeDescription({ "TimeStudy228": false })} ➜
      ${Sacrifice.getSacrificeDescription({ "TimeStudy228": true })}`,
    effect: 0.2
  },
  {
    id: 231,
    cost: 500,
    STCost: 5,
    requirement: [221, 222],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [232],
    description: "Dimension Boosts are stronger based on their amount",
    effect: () => Decimal.pow(DimBoost.totalBoosts, 0.5).clampMin(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 232,
    cost: 500,
    STCost: 5,
    requirement: [223, 224],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [231],
    description: "All Galaxies are stronger based on Antimatter Galaxies",
    effect: () => Math.pow(1 + player.galaxies / 50, 0.175),
    formatEffect: value => `+${formatPercents(value - 1, 3)}`
  },
  {
    id: 233,
    cost: 500,
    STCost: 5,
    requirement: [225, 226],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [234],
    description: "Max Replicanti Galaxy upgrade is cheaper based on current Replicanti",
    effect: () => Replicanti.amount.pow(0.8),
    formatEffect: value => `/ ${format(value, 1, 2)}`
  },
  {
    id: 234,
    cost: 500,
    STCost: 5,
    requirement: [227, 228],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [233],
    description: "Dimensional Sacrifice applies to 1st Antimatter Dimension",
    effect: () => Sacrifice.totalBoost,
  },
  // Note: These last 4 entries are the triad studies
  {
    id: 301,
    cost: 0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1, 221, 222, 231],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [221, 222, 231],
    description: "Time Study 231 improves the effect of Time Study 221; Dimension Boosts scale 2 less",
    effect: () => TimeStudy(221).effectValue.pow(TimeStudy(231).effectValue.minus(1)).clampMin(1),
    formatEffect: value => formatX(value, 2, 1),
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1
  },
  {
    id: 302,
    cost: 0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2, 223, 224, 232],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [223, 224, 232],
    description: () => `Distant and Further Galaxy scaling threshold starts another
      ${formatInt(20000)} Antimatter Galaxies later`,
    effect: 20000,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2
  },
  {
    id: 303,
    cost: 0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3, 225, 226, 233],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [225, 226, 233],
    description: () => `Gain ${formatPercents(0.8)} more extra Replicanti Galaxies from Time Studies 225 and 226,
      and from Effarig's Infinity`,
    effect: 1.8,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3
  },
  {
    id: 304,
    cost: 0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4, 227, 228, 234],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [227, 228, 234],
    description: `Dimensional Sacrifice multiplier is cubed and uses an even better formula`,
    effect: 3,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4
  },
  {
    id: 241,
    cost: new Decimal("1e5000"),
    requirement: [() => TimeStudy.reality.isBought],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => `Disable the ${format(DC.E3E9, 2, 2)} IP multiplier cost scaling`
  },
  {
    id: 251,
    cost: new Decimal("1e6500"),
    requirement: [241],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Further Antimatter Galaxy scaling starts
      ${formatInt(1)} later per ${formatInt(1000)} Dimension Boosts`,
    effect: () => Math.floor((DimBoost.totalBoosts + 1) / 1000),
    formatEffect: value => `+${formatInt(value)} later`
  },
  {
    id: 252,
    cost: new Decimal("1e6350"),
    requirement: [241],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Remote Replicanti Galaxy scaling starts
      ${formatInt(1)} later per ${formatFloat(4.35, 2)} Extra Replicanti Galaxies`,
    effect: () => Math.floor((Replicanti.galaxies.extra + 1) / 4.35),
    formatEffect: value => `+${formatInt(value)} later`
  },
  {
    id: 253,
    cost: new Decimal("1e6000"),
    requirement: [241],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Further Antimatter Galaxy scaling starts
      ${formatInt(10)} later per ${formatFloat(3.785, 3)} Tachyon Galaxies`,
    effect: () => Math.floor((player.dilation.totalTachyonGalaxies + 1) / 3.785 * 10),
    formatEffect: value => `+${formatInt(value)} later`
  },
  {
    id: 261,
    cost: new Decimal("1e7000"),
    requirement: [251],
    STCost: 0,
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Dimension Boosts scales by ${formatFloat(0.5, 2)} less`,
    effect: () => 0.5
  },
  {
    id: 262,
    cost: new Decimal("1e7200"),
    requirement: [251],
    STCost: 0,
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Dimension Boosts affects Dark Matter Dimensions at a reduced rate`,
    effect: () => Decimal.pow(DimBoost.power, DimBoost.totalBoosts).plus(1).log10() + 1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 263,
    cost: new Decimal("1e7250"),
    requirement: [252],
    STCost: 0,
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Dark Matter Annihilation affects Replicanti Speed`,
    effect: () => Laitela.darkMatterMult,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 264,
    cost: new Decimal("1e7500"),
    requirement: [252],
    STCost: 0,
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Distant Replicanti Galaxy scaling starts
      ${formatInt(1)} later per ${formatFloat(9.5, 2)} total Replicanti Galaxies`,
    effect: () => Math.floor((Replicanti.galaxies.total + 1) / 9.5),
    formatEffect: value => `+${formatInt(value)} later`
  },
  {
    id: 265,
    cost: new Decimal("1e7700"),
    requirement: [253],
    STCost: 0,
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `You gain more Tachyon Particles based on your total galaxy count`,
    effect: () => Decimal.pow(Replicanti.galaxies.total + player.galaxies + player.dilation.totalTachyonGalaxies, 3),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 266,
    cost: new Decimal("1e7850"),
    requirement: [253],
    STCost: 0,
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => `Charged Infinity Upgrade 1 affects Time Theorem production`,
    effect: () => (Ra.totalCharges > 0 ? InfinityUpgrade.totalTimeMult.chargedEffect.effectValue : 1),
    formatEffect: value => formatPow(value, 2, 3)
  },
];
