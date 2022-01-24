import { h, FunctionalComponent } from "preact";

import { Key } from "/src/components/key";

import * as style from "./style.scss";

export const Keyboard: FunctionalComponent = () => {
    return (
        <section class={style.keyboard}>
            {layout.flat().map((letter) => (
                <Key>{letter}</Key>
            ))}
        </section>
    );
};

const layout: string[][] = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "back"],
];
