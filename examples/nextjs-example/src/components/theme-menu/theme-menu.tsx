'use client';

import { getChroma, ThemeConfig, useTheme } from 'cyhip-dynamic-themes';
import { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { CheckDot } from '~/components/ui/check-dot/check-dot';
import { MoonIcon } from '~/components/ui/icons/moon';
import { SolarIcon } from '~/components/ui/icons/solar';
import { capitalize, cn } from '~/lib/utils';
import { chromaData, hueScheme } from '~/themes/theme.config';
import styles from './theme-menu.module.scss';

const buildThemeSample = (hue: number) => {
    const oklchA = `oklch(${getChroma(4, +hue, chromaData)})`;
    const oklchB = `oklch(${getChroma(5, +hue, chromaData)})`;
    const oklchC = `oklch(${getChroma(6, +hue, chromaData)})`;
    const gradient = `linear-gradient(70deg, ${oklchA}, ${oklchB}, ${oklchC})`;
    return gradient;
};

const availableThemes: Record<string, string> = Object.keys(hueScheme).reduce(
    (acc, key) => {
        const value = hueScheme[key];
        acc[key] = buildThemeSample(value);
        return acc;
    },
    {} as Record<string, string>
);

const ThemeMenu = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { setTheme } = useTheme();
        const [hue, setHue] = useState(hueScheme.blue);
        const [darkMode, setDarkMode] = useState(false);

        useEffect(() => {
            setTheme({
                hue: hue,
                mode: darkMode ? 'dark' : 'light',
                chromaData: chromaData,
            } as ThemeConfig);
        }, [hue, darkMode, setTheme]);

        return (
            <div ref={ref} className={cn('theme-menu', className)} {...props}>
                <div className="palette-selectors grid grid-cols-2 sm:grid-cols-3 grid-flow-row gap-x-4 gap-y-2 mb-2">
                    {Object.entries(hueScheme).map(([key, value]) => (
                        <button
                            key={key}
                            className={cn(
                                styles._button,
                                hue === value ? styles._button__active : '',
                                'flex items-center gap-x-2'
                            )}
                            onClick={() => setHue(value)}
                        >
                            <span>
                                <CheckDot
                                    className="w-5 h-5 rounded-full"
                                    style={{
                                        background: availableThemes[key],
                                    }}
                                    selected={hue === value}
                                />
                            </span>

                            <span>
                                {key == 'monoCromatic'
                                    ? 'Default'
                                    : capitalize(key)}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="dark-mode-selectors gird flex justify-center gap-x-4 ">
                    <div className="mx-1">
                        <button
                            className={cn(
                                styles._button,
                                !darkMode ? styles._button__active : '',
                                'flex items-center gap-x-2'
                            )}
                            onClick={() => setDarkMode(false)}
                        >
                            <SolarIcon className="h-4 w-4 " />
                            Light
                        </button>
                    </div>
                    <div>
                        <button
                            className={cn(
                                styles._button,
                                darkMode ? styles._button__active : '',
                                'flex items-center gap-x-2'
                            )}
                            onClick={() => setDarkMode(true)}
                        >
                            <MoonIcon className="h-4 w-4 " />
                            Dark
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

ThemeMenu.displayName = 'ThemeMenu';

export { ThemeMenu };
