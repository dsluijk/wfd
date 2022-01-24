import { h, FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";

import { StateContext } from "/src/index";

import * as style from "./style.scss";

export const Header: FunctionalComponent = () => {
    const [state] = useContext(StateContext);

    return (
        <header class={style.header}>
            <span>
                WFD - Day {state.day} | Streak {state.streak}
            </span>
        </header>
    );
};
