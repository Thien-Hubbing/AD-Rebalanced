import { DC } from "../../constants";

export const GlyphCombiner = Object.freeze({
  /**
   * @param {number[]} x
   * @returns {number}
   */
  add: x => x.reduce(Number.sumReducer, 0),
  /**
   * @param {number[]} x
   * @returns {number}
   */
  multiply: x => x.reduce(Number.prodReducer, 1),
  /**
   * For exponents, the base value is 1, so when we add two exponents a and b we want to get a + b - 1,
   * so that if a and b are both close to 1 so is their sum. In general, when we add a list x of exponents,
   * we have to add 1 - x.length to the actual sum, so that if all the exponents are close to 1 the result
   * is also close to 1 rather than close to x.length.
   * @param {number[]} x
   * @returns {number}
   */
  addExponents: x => x.reduce(Number.sumReducer, 1 - x.length),
  /**
   * @param {Decimal[]} x
   * @returns {Decimal}
   */
  multiplyDecimal: x => x.reduce(Decimal.prodReducer, DC.D1)
});

export const glyphEffects = {
  timepow: {
    id: "timepow",
    bitmaskIndex: 0,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Time Dimension power +{value}",
    totalDesc: "Time Dimension multipliers ^{value}",
    shortDesc: "TD power +{value}",
    effect: (level, strength) => 1.025 + Math.pow(level, 0.35) * Math.pow(strength, 0.6) / 70,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  timespeed: {
    id: "timespeed",
    bitmaskIndex: 1,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Multiply game speed by {value}",
    totalDesc: "Game runs ×{value} faster",
    genericDesc: "Game speed multiplier",
    shortDesc: "Game speed ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("time")
      ? 1 + Math.pow(level, 0.4) * Math.pow(strength, 4)
      : 1 + Math.pow(level, 0.32) * Math.pow(strength, 2 / 3) / 20),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("time"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
  },
  timeetermult: {
    id: "timeetermult",
    bitmaskIndex: 2,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: "Multiply Eternity gain by {value}",
    totalDesc: "Eternity gain ×{value}",
    genericDesc: "Eternity gain multiplier",
    shortDesc: "Eternities ×{value}",
    effect: (level, strength) => Math.pow((strength ** 3) * level, 0.87) *
      Math.pow(3, GlyphAlteration.sacrificeBoost("time")),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("time"),
    alterationType: ALTERATION_TYPE.BOOST
  },
  timeEP: {
    id: "timeEP",
    bitmaskIndex: 3,
    isGenerated: true,
    glyphTypes: ["time"],
    singleDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain \n×{value} [and ^]{value2}"
      : "Multiply Eternity Point gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain ×{value} and ^{value2}"
      : "Eternity Point gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("time")
      ? "Eternity Point gain multiplier and power"
      : "Eternity Point gain multiplier"),
    shortDesc: () => (GlyphAlteration.isAdded("time")
      ? "EP ×{value} and ^{value2}"
      : "EP ×{value}"),
    effect: (level, strength) => Math.pow(level * strength, strength) ** 1.16,
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    conversion: x => 1 + Math.log10(x) / 60,
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("time"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  dilationDT: {
    id: "dilationDT",
    bitmaskIndex: 4,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Multiply Dilated Time gain by {value}",
    totalDesc: "Dilated Time gain ×{value}",
    shortDesc: "DT ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("dilation")
      ? DC.D1_05.pow(level * strength).times(15)
      : Decimal.pow(level * strength, 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("dilation"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  dilationgalaxyThreshold: {
    id: "dilationgalaxyThreshold",
    bitmaskIndex: 5,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Tachyon Galaxy threshold multiplier ×{value}",
    genericDesc: "Tachyon Galaxy cost multiplier",
    shortDesc: "TG threshold ×{value}",
    effect: (level, strength) => 1 - Math.pow(level, 0.2) * Math.pow(strength, 0.4) / 60 -
      GlyphAlteration.sacrificeBoost("dilation") / 35,
    formatEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getBoostColor("dilation"),
    alterationType: ALTERATION_TYPE.BOOST,
    combine: effects => {
      const prod = effects.reduce(Number.prodReducer, 1);
      return prod < 0.4
        ? { value: 0.4 - Math.pow(0.4 - prod, 1.7), capped: true }
        : { value: prod, capped: false };
    },
    enabledInDoomed: true,
  },
  dilationTTgen: {
    // TTgen slowly generates TT, value amount is per second, displayed per hour
    id: "dilationTTgen",
    bitmaskIndex: 6,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generates {value} Time Theorems/hour \n[and multiplies Time Theorem \ngeneration by] {value2}"
      : "Generates {value} Time Theorems per hour"),
    totalDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Generating {value} Time Theorems/hour and Time Theorem generation ×{value2}"
      : "Generating {value} Time Theorems per hour"),
    genericDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "Time Theorem generation and multiplier"
      : "Time Theorem generation"),
    shortDesc: () => (GlyphAlteration.isAdded("dilation")
      ? "{value} TT/hr and TTgen ×{value2}"
      : "{value} TT/hr"),
    effect: (level, strength) => Math.pow(level * strength, 0.5),
    /** @type {function(number): string} */
    formatEffect: x => format(3600 * x, 2, 2),
    combine: GlyphCombiner.add,
    conversion: x => Math.clampMin(Math.pow(10000 * x, 1.6), 1),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("dilation"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: true
  },
  dilationpow: {
    id: "dilationpow",
    bitmaskIndex: 7,
    isGenerated: true,
    glyphTypes: ["dilation"],
    singleDesc: "Antimatter Dimension power +{value} while Dilated",
    totalDesc: "Antimatter Dimension multipliers ^{value} while Dilated",
    genericDesc: "Antimatter Dimensions ^x while Dilated",
    shortDesc: "Dilated AD power +{value}",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.85) * (strength / 20),
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  replicationspeed: {
    id: "replicationspeed",
    bitmaskIndex: 8,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => (GlyphAlteration.isEmpowered("replication") && GlyphAlteration.isAdded("replication")
      ? `Multiply Replication speed by ×{value}\n[ and Replicanti chance exponent] by ×{value2}`
      : `Multiply Replication speed by ×{value}`
    ),
    totalDesc: () => (GlyphAlteration.isEmpowered("replication") && GlyphAlteration.isAdded("replication")
    ? `Replication speed ×{value} and Replicanti chance exponent ×{value2}`
    : `Replication speed ×{value}`
    ),
    genericDesc: () => (GlyphAlteration.isEmpowered("replication") && GlyphAlteration.isAdded("replication")
    ? `Replication speed and chance exponent multiplier`
    : `Replication speed multiplier`
    ),
    shortDesc: () => (GlyphAlteration.isEmpowered("replication") && GlyphAlteration.isAdded("replication")
    ? `Replication speed ×{value}, chance exponent multiplier ×{value2}`
    : `Replication speed ×{value}`
    ),
    effect: (level, strength) => (GlyphAlteration.isEmpowered("replication")
      ? DC.D1_3.pow(level * strength).times(10)
      : Decimal.times(level, strength).times(3)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    conversion: x => Decimal.log10(x.pow(0.025)),
    formatSecondaryEffect: x => format(x, 2, 3),
    alteredColor: () => {
      return GlyphAlteration.getEmpowermentColor("replication")
    },
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  replicationpow: {
    id: "replicationpow",
    bitmaskIndex: 9,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: "Replicanti multiplier and chance power +{value}",
    totalDesc: "Replicanti multiplier and chance ^{value}",
    shortDesc: "Replicanti mult., chance power +{value}",
    effect: (level, strength) => 1.1 + Math.pow(level, 0.65) * strength / 18 +
      GlyphAlteration.sacrificeBoost("replication") * 4,
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x - 1, 2, 2),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("replication"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  replicationdtgain: {
    id: "replicationdtgain",
    bitmaskIndex: 10,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => (GlyphAlteration.isAdded("replication")
      ? `Multiply Dilated Time \n[, Replicanti speed, and Replicanti chance bonus] by \n+{value} per ${format(DC.E10000)} replicanti`
      : `Multiply Dilated Time gain \nand Replicanti chance bonus by \n+{value} per ${format(DC.E10000)} replicanti`),
    totalDesc: () => (GlyphAlteration.isAdded("replication")
      ? `Multiply Dilated Time, Replication speed, and Replicanti chance bonus by +{value} per ${format(DC.E10000)} replicanti`
      : `Multiply Dilated Time gain and Replicanti chance bonus by +{value} per ${format(DC.E10000)} replicanti`),
    genericDesc: () => (GlyphAlteration.isAdded("replication")
      ? "Dilated Time, Replicanti speed, and Replicanti chance from replicanti"
      : "Dilated Time gain and Replicanti chance multiplier from replicanti"),
    shortDesc: () => (GlyphAlteration.isAdded("replication")
      ? `×DT, repl., repl. chance by +{value} per ${format(DC.E10000)} replicanti`
      : `×DT, repl. chance by +{value} per ${format(DC.E10000)} replicanti`),
    effect: (level, strength) => Math.pow(level, 0.4) * Math.pow(strength, 0.65),
    formatEffect: x => format(x, 2, 2),
    formatSingleEffect: x => format(x, 2, 2),
    // It's bad to stack this one additively (N glyphs acts as a DT mult of N) or multiplicatively (the raw number is
    // less than 1), so instead we do a multiplicative stacking relative to the "base" effect of a level 1, 0% glyph.
    // We also introduce a 3x mult per glyph after the first, so that stacking level 1, 0% glyphs still has an effect.
    // This is still just a flat DT mult when stacking multiple glyphs, but at least it's bigger than 2 or 3.
    combine: effects => ({
      value: effects.length === 0 ? 0 : effects.reduce(Number.prodReducer, Math.pow(0.0001, 1 - effects.length)),
      capped: false
    }),
    conversion: x => x,
    formatSecondaryEffect: x => format(x, 2, 3),
    formatSingleSecondaryEffect: x => format(x, 5, 5),
    alteredColor: () => GlyphAlteration.getAdditionColor("replication"),
    alterationType: ALTERATION_TYPE.ADDITION,
  },
  replicationglyphlevel: {
    id: "replicationglyphlevel",
    bitmaskIndex: 11,
    isGenerated: true,
    glyphTypes: ["replication"],
    singleDesc: () => `Replicanti factor for Glyph level:\n ^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    totalDesc: () => `Replicanti factor for Glyph level: ^${format(0.4, 1, 1)}
      ➜ ^(${format(0.4, 1, 1)} + {value})`,
    genericDesc: "Replicanti factor for Glyph level",
    shortDesc: "Replicanti pow. for level +{value}",
    effect: (level, strength) => Math.pow(Math.pow(level, 1 / 3) * Math.pow(strength, 0.5), 0.6) / 40,
    formatEffect: x => format(x, 3, 3),
    combine: effects => {
      let sum = effects.reduce(Number.sumReducer, 0);
      if (effects.length > 2) sum *= 6 / (effects.length + 4);
      return sum > 0.1
        ? { value: 0.1 + 0.2 * (sum - 0.1), capped: true }
        : { value: sum, capped: effects.length > 2 };
    },
    enabledInDoomed: true,
  },
  infinitypow: {
    id: "infinitypow",
    bitmaskIndex: 12,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: "Infinity Dimension power +{value}",
    totalDesc: "Infinity Dimension multipliers ^{value}",
    shortDesc: "ID power +{value}",
    effect: (level, strength) => 1.01 + Math.pow(level, 0.26) * Math.pow(strength, 0.5) / 70 +
      GlyphAlteration.sacrificeBoost("infinity") / 50,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("infinity"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  infinityrate: {
    id: "infinityrate",
    bitmaskIndex: 13,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => `Infinity Power conversion rate: \n^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    totalDesc: () => `Infinity Power conversion rate: ^${formatInt(7)}
      ➜ ^(${formatInt(7)} + {value})`,
    genericDesc: "Infinity Power conversion rate",
    shortDesc: "Infinity Power conversion +{value}",
    effect: (level, strength) => (Math.pow(level, 0.50) * strength) * 0.02765,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
  },
  infinityIP: {
    id: "infinityIP",
    bitmaskIndex: 14,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain \n×{value} [and ^]{value2}"
      : "Multiply Infinity Point gain by {value}"),
    totalDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain ×{value} and ^{value2}"
      : "Infinity Point gain ×{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "Infinity Point gain multiplier and power"
      : "Infinity Point gain multiplier"),
    shortDesc: () => (GlyphAlteration.isAdded("infinity")
      ? "IP ×{value} and ^{value2}"
      : "IP ×{value}"),
    effect: (level, strength) => Math.pow(level * (strength + 1), 6.5) * 10000,
    formatEffect: x => format(x, 2, 3),
    combine: GlyphCombiner.multiply,
    // eslint-disable-next-line no-negated-condition
    softcap: value => ((Effarig.eternityCap !== undefined) ? Math.min(value, Effarig.eternityCap.toNumber()) : value),
    conversion: x => 1 + Math.log10(x) / 170,
    formatSecondaryEffect: x => format(x, 4, 4),
    alteredColor: () => GlyphAlteration.getAdditionColor("infinity"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  infinityinfmult: {
    id: "infinityinfmult",
    bitmaskIndex: 15,
    isGenerated: true,
    glyphTypes: ["infinity"],
    singleDesc: "Multiply Infinity gain by {value}",
    totalDesc: "Infinity gain ×{value}",
    genericDesc: "Infinity gain multiplier",
    shortDesc: "Infinities ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("infinity")
      ? DC.D1_02.pow(level)
      : Decimal.pow(level * strength, 1.5).times(2)),
    formatEffect: x => format(x, 2, 1),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("infinity"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  powerpow: {
    id: "powerpow",
    bitmaskIndex: 16,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimension power +{value}\n[and Antimatter Galaxy cost ×]{value2}"
      : "Antimatter Dimension power +{value}"),
    totalDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimension multipliers ^{value} and Antimatter Galaxy cost ×{value2}"
      : "Antimatter Dimension multipliers ^{value}"),
    genericDesc: () => (GlyphAlteration.isAdded("power")
      ? "Antimatter Dimensions multipliers ^x and Antimatter Galaxy cost multiplier"
      : "Antimatter Dimension multipliers ^x"),
    shortDesc: () => (GlyphAlteration.isAdded("power")
      ? "AD power +{value} and AG cost ×{value2}"
      : "AD power +{value}"),
    effect: (level, strength) => 1.02 + Math.pow(level, 0.3) * Math.pow(strength, 0.5) / 80,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    conversion: x => 1.5 / (x + 1),
    formatSecondaryEffect: x => format(x, 3, 3),
    alteredColor: () => GlyphAlteration.getAdditionColor("power"),
    alterationType: ALTERATION_TYPE.ADDITION,
    enabledInDoomed: true,
  },
  powermult: {
    id: "powermult",
    bitmaskIndex: 17,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: "Antimatter Dimension multipliers ×{value}",
    shortDesc: "AD ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("power")
      ? Decimal.clampMax(DC.D11111.pow(Math.pow(level, strength / 1.5)), DC.E3E12)
      : Decimal.pow(level * strength * 10, level * strength * 10)),
    formatEffect: x => formatPostBreak(x, 2, 0),
    combine: GlyphCombiner.multiplyDecimal,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("power"),
    alterationType: ALTERATION_TYPE.EMPOWER,
    enabledInDoomed: true,
  },
  powerdimboost: {
    id: "powerdimboost",
    bitmaskIndex: 18,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: "Dimension Boost multiplier ×{value}",
    genericDesc: "Dimension Boost multiplier",
    shortDesc: "Dimboost mult. ×{value}",
    effect: (level, strength) => Math.pow(level * strength, 0.667) *
      Math.pow(1 + GlyphAlteration.sacrificeBoost("power"), 3.5),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getBoostColor("power"),
    alterationType: ALTERATION_TYPE.BOOST,
    enabledInDoomed: true,
  },
  powerbuy10: {
    id: "powerbuy10",
    bitmaskIndex: 19,
    isGenerated: true,
    glyphTypes: ["power"],
    singleDesc: () => `Increase the bonus from buying ${formatInt(10)} Antimatter Dimensions by {value}`,
    totalDesc: () => `Multiplier from "Buy ${formatInt(10)}" ×{value}`,
    genericDesc: () => `"Buy ${formatInt(10)}" bonus increase`,
    shortDesc: () => `AD "Buy ${formatInt(10)}" mult. ×{value}`,
    effect: (level, strength) => 1 + level * strength / 9,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  effarigrm: {
    id: "effarigrm",
    bitmaskIndex: 20,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Reality Machine multiplier ×{value}",
    genericDesc: "Reality Machine multiplier",
    shortDesc: "RM ×{value}",
    effect: (level, strength) => (GlyphAlteration.isEmpowered("effarig")
      ? Math.pow(level, strength)
      : Math.pow(level, 0.85) * strength),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    alteredColor: () => GlyphAlteration.getEmpowermentColor("effarig"),
    alterationType: ALTERATION_TYPE.EMPOWER
  },
  effarigglyph: {
    id: "effarigglyph",
    bitmaskIndex: 21,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Glyph Instability starting level +{value}",
    genericDesc: "Glyph Instability delay",
    shortDesc: "Instability delay +{value}",
    effect: (level, strength) => Math.floor(60 * Math.pow(level * strength, 0.52)),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
  },
  effarigblackhole: {
    id: "effarigblackhole",
    bitmaskIndex: 22,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "Game speed power +{value}",
    totalDesc: "Game speed ^{value}",
    genericDesc: "Game speed ^x",
    shortDesc: "Game speed power +{value}",
    effect: (level, strength) => Math.clampMax(1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 75, 1 + 1 / 3),
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  effarigachievement: {
    id: "effarigachievement",
    bitmaskIndex: 23,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Multiply the alchemy resource cap by ×{value}`
      : `Achievement Multiplier power +{value}`),
    totalDesc: () => (GlyphAlteration.isAdded("effarig")
    ? `Multiply the alchemy resource cap by ×{value}`
    : `Achievement Multiplier ^{value}`),
    genericDesc: () => (GlyphAlteration.isAdded("effarig")
    ? `Alchemy resource cap multiplier`
    : `Achievement Multiplier ^x`),
    shortDesc: () => (GlyphAlteration.isAdded("effarig")
    ? `Alchemy resource cap ×{value}`
    : `Achievement Mult. power +{value}`),
    effect: (level, strength) => {
      const formula = (1 + Math.pow(level, 0.4) * Math.pow(strength, 0.6) / 60 +
      GlyphAlteration.sacrificeBoost("effarig") / 10)
      if (GlyphAlteration.isAdded("effarig")) return formula
      return formula * 0.6
    },
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    alteredColor: () => GlyphAlteration.getBoostColor("effarig"),
    alterationType: ALTERATION_TYPE.BOOST
  },
  effarigforgotten: {
    id: "effarigforgotten",
    bitmaskIndex: 24,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `"Buy ${formatInt(10)}" multiplier ^{value} [and\nDimension Boost multiplier ^]{value2}`
      : `Bonus from buying ${formatInt(10)} Dimensions ^{value}`),
    totalDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Multiplier from "Buy ${formatInt(10)}" ^{value} and Dimension Boost multiplier ^{value2}`
      : `Multiplier from "Buy ${formatInt(10)}" ^{value}`),
    genericDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `"Buy ${formatInt(10)}" and Dimension Boost multipliers ^x`
      : `"Buy ${formatInt(10)}" multiplier ^x`),
    shortDesc: () => (GlyphAlteration.isAdded("effarig")
      ? `Buy ${formatInt(10)} mult. ^{value}, Dimboost mult. ^{value2}`
      : `Buy ${formatInt(10)} mult. ^{value}`),
    effect: (level, strength) => 1 + (level * (strength / 3.4)),
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.multiply,
    conversion: x => Math.pow((x / 2.5) + 1, 0.1),
    formatSecondaryEffect: x => format(x, 2, 2),
    alteredColor: () => GlyphAlteration.getAdditionColor("effarig"),
    alterationType: ALTERATION_TYPE.ADDITION
  },
  effarigdimensions: {
    id: "effarigdimensions",
    bitmaskIndex: 25,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: "All Dimension power +{value}",
    totalDesc: "All Dimension multipliers ^{value}",
    genericDesc: "All Dimension multipliers ^x",
    shortDesc: "All Dimension power +{value}",
    effect: (level, strength) => 1 + Math.pow(level, 1 / 3) * Math.pow(strength, 1 / 3) / 120,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  effarigantimatter: {
    id: "effarigantimatter",
    bitmaskIndex: 26,
    isGenerated: true,
    glyphTypes: ["effarig"],
    singleDesc: () => `Antimatter production:\n${formatInt(10)}^x ➜ ${formatInt(10)}^(x^{value})`,
    genericDesc: "Antimatter production exponent power",
    shortDesc: "AM production exponent ^{value}",
    effect: (level, strength) => 1 + Math.pow(level, 0.25) * Math.pow(strength, 0.4) / 5000,
    formatEffect: x => format(x, 4, 4),
    combine: GlyphCombiner.multiply,
  },
  timeshardpow: {
    id: "timeshardpow",
    bitmaskIndex: 27,
    isGenerated: true,
    // This gets explicitly added to time glyphs elsewhere (once unlocked)
    glyphTypes: [],
    singleDesc: "Time Shard power +{value}",
    totalDesc: "Time Shard gain ^{value}",
    genericDesc: "Time Shards ^x",
    shortDesc: "Time Shard power +{value}",
    effect: (level, strength) => 1 + (strength / 2.8) * Math.pow(level, 0.38) / 500,
    formatEffect: x => format(x, 3, 3),
    formatSingleEffect: x => format(x - 1, 3, 3),
    combine: GlyphCombiner.addExponents,
    enabledInDoomed: true,
  },
  cursedgalaxies: {
    id: "cursedgalaxies",
    bitmaskIndex: 0,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: `All Galaxies are {value} weaker`,
    totalDesc: "All Galaxy strength -{value}",
    shortDesc: "Galaxy Strength -{value}",
    // Multiplies by 0.768 per glyph
    effect: level => Math.pow(level, -0.04),
    formatEffect: x => formatPercents(1 - x, 2),
    combine: GlyphCombiner.multiply,
  },
  curseddimensions: {
    id: "curseddimensions",
    bitmaskIndex: 1,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "All Dimension multipliers ^{value}",
    shortDesc: "All Dimensions ^{value}",
    // Multiplies by 0.734 per glyph
    effect: level => Math.pow(level, -0.05),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.multiply,
  },
  cursedtickspeed: {
    id: "cursedtickspeed",
    bitmaskIndex: 2,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "The threshold for Tickspeed Upgrades from Time Dimensions is multiplied by ×{value}",
    totalDesc: "The threshold for Tickspeed Upgrades from Time Dimensions is increased by ×{value}",
    shortDesc: "TD Tickspeed threshold ×{value}",
    // Additive 3.82 per glyph
    effect: level => Math.clampMin(Math.log10(level), 1),
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.add,
  },
  cursedEP: {
    id: "cursedEP",
    bitmaskIndex: 3,
    isGenerated: false,
    glyphTypes: ["cursed"],
    singleDesc: "Divide Eternity Point gain by {value}",
    totalDesc: "Eternity Point gain / {value}",
    shortDesc: "EP / {value}",
    // Divides e666.6 per glyph
    effect: level => Decimal.pow10(-level / 10),
    formatEffect: x => format(x.reciprocal()),
    combine: GlyphCombiner.multiplyDecimal,
  },
  realityglyphlevel: {
    id: "realityglyphlevel",
    bitmaskIndex: 4,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Increase the effective level of equipped basic Glyphs by {value}",
    totalDesc: "Equipped basic Glyph level +{value}",
    shortDesc: "Basic Glyph Level +{value}",
    effect: level => Math.floor(level ** 1.1),
    formatEffect: x => formatInt(x),
    combine: GlyphCombiner.add,
  },
  realitygalaxies: {
    id: "realitygalaxies",
    bitmaskIndex: 5,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "All Galaxies are {value} stronger",
    totalDesc: "All Galaxy strength +{value}",
    shortDesc: "Galaxy Strength +{value}",
    effect: level => 1 + Math.pow(level / 50000, 0.516),
    formatEffect: x => formatPercents(x - 1, 2),
    combine: GlyphCombiner.multiply,
  },
  realityrow1pow: {
    id: "realityrow1pow",
    bitmaskIndex: 6,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: "Multiplier from Reality Upgrade Amplifiers ^{value}",
    totalDesc: "Reality Upgrade Amplifier multiplier ^{value}",
    shortDesc: "Amplifier Multiplier ^{value}",
    effect: level => 1 + level / 125000,
    formatEffect: x => format(x, 3, 3),
    combine: GlyphCombiner.addExponents,
  },
  realityDTglyph: {
    id: "realityDTglyph",
    bitmaskIndex: 7,
    isGenerated: false,
    glyphTypes: ["reality"],
    singleDesc: () => `Dilated Time factor for Glyph level: \n^${format(1.3, 1, 1)}
      ➜ ^(${format(1.3, 1, 1)} + {value})`,
    totalDesc: () => `Dilated Time factor for Glyph level: ^${format(1.3, 1, 1)}
      ➜ ^(${format(1.3, 1, 1)} + {value})`,
    genericDesc: "Dilated Time factor for Glyph level",
    shortDesc: "DT pow. for level +{value}",
    // You can only get this effect on level 25000 reality glyphs anyway, might as well make it look nice
    // Actually, the alchemy resource gets it's cap extended so...
    effect: level => level / 100000,
    formatEffect: x => format(x, 2, 2),
    combine: GlyphCombiner.add,
  },
  companiondescription: {
    id: "companiondescription",
    bitmaskIndex: 8,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: "It does nothing but sit there and cutely smile at you, whisper into your dreams politely, " +
      "and plot the demise of all who stand against you. This one-of-a-kind Glyph will never leave you.",
    totalDesc: "+{value} happiness",
    shortDesc: "Doesn't want to hurt you",
    effect: () => {
      if (Enslaved.isRunning) return 0;
      const cursedCount = Glyphs.active.countWhere(g => g?.type === "cursed");
      if (cursedCount > 0) return Math.pow(0.2 + 0.2 * Math.random(), cursedCount);
      return 0.4 + 0.6 * Math.random();
    },
    formatEffect: x => formatPercents(x, 2, 2),
    combine: GlyphCombiner.add,
    enabledInDoomed: true,
  },
  companionEP: {
    id: "companionEP",
    bitmaskIndex: 9,
    isGenerated: false,
    glyphTypes: ["companion"],
    singleDesc: "Thanks for your dedication for the game! You reached {value} Eternity Points on your first Reality.",
    shortDesc: "It loves you very, very much",
    totalDesc: () => ((Enslaved.isRunning || Glyphs.active.countWhere(g => g?.type === "cursed")) ? "Help me" : "Yay!"),
    // The EP value for this is entirely encoded in rarity, but level needs to be present to
    // make sure the proper parameter is being used. The actual glyph level shouldn't do anything.
    // eslint-disable-next-line no-unused-vars
    effect: (level, strength) => Decimal.pow10(1e6 * strengthToRarity(strength)),
    formatEffect: x => formatPostBreak(x, 2),
    combine: GlyphCombiner.multiplyDecimal,
    enabledInDoomed: true,
  }
};
