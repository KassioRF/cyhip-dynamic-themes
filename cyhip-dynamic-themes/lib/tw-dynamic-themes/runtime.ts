import {
    Color,
    Oklch,
    toGamut as _toGamut,
    converter,
    differenceEuclidean,
} from "culori";

import { makeVariable, shades } from "./common";

const toGamut = _toGamut as (...args: unknown[]) => (color: string) => Color;

/**
 * A map of CSS varable name to color
 */
type SingleVariable = [string, string];

export function getVariables({
    baseName,
    hue,
    mode = "consistent",
}: {
    baseName: string;
    hue: number;
    mode?: "bright" | "consistent";
}): SingleVariable[] {
    const whitePalette = hue == -1;
    const calculator = mode === "bright" ? highestChroma : consistentChroma;
    return shades.map((shade, shadeIndex) => [
        makeVariable({ name: baseName, shade }),
        calculator(shadeIndex, +hue, whitePalette),
    ]);
}

export function updateVariables(variables: SingleVariable[], el?: HTMLElement) {
    const target = el ?? document.documentElement;

    for (const [varName, value] of variables) {
        target.style.setProperty(varName, value + "");
    }
}

const lightnessForShade = (shade: number) => {
    const highestL = 100;
    const lowestL = 13;
    const diffL = highestL - lowestL;

    const shadeDiff = shades[shades.length - 1] - shades[0];

    // Maintaining the proximity of colors with a step of 50 and 100
    const multiplier = shade / shadeDiff;

    return (lowestL + (highestL - diffL * multiplier)) / 100;
};
const lightness = shades.map(lightnessForShade);

export const highestChroma = (shadeIndex: number, hue: number) => {
    const oklch = converter("oklch");

    // Setting an obsurdly high chroma
    const color = `oklch(${lightness[shadeIndex]} 0.4 ${hue})`;

    // Clamping it to the highest chroma possible
    return serializeColor(
        oklch(toGamut("p3", "oklch", differenceEuclidean("oklch"), 0)(color))
    );
};

export const consistentChroma = (
    i: number,
    hue: number,
    whitePalette: boolean = false
) => {
    const oklch = converter("oklch");

    // Using a pinned chroma
    const chroma = whitePalette ? chromaData[i] * 0.00001 : chromaData[i];
    const light = whitePalette ? lightness[i] * 1.0 : lightness[i] * 0.95;

    const color = `oklch(${light} ${chroma} ${hue})`;

    return serializeColor(
        oklch(toGamut("p3", "oklch", differenceEuclidean("oklch"), 0)(color))
    );
};

// const chromaData: Record<number, number> = {
//     0: 0.0108,
//     1: 0.0321,
//     2: 0.0609,
//     3: 0.0908,
//     4: 0.1398,
//     5: 0.1472,
//     6: 0.1299,
//     7: 0.1067,
//     8: 0.0898,
//     9: 0.0726,
//     10: 0.054,
// };

const chromaData: Record<number, number> = {
    0: 0.0114,
    1: 0.0331,
    2: 0.0774,
    3: 0.1275,
    4: 0.1547,
    5: 0.1355,
    6: 0.1164,
    7: 0.0974,
    8: 0.0782,
    9: 0.0588,
    10: 0.0491,
};

const serializeColor = (c: Oklch): string =>
    `${c.l.toFixed(3)} ${c.c.toFixed(3)} ${c.h?.toFixed(3)}`;
