import { h, FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";

import { StateContext } from "/src/index";
import { getLetterResult } from "/src/logic";

import * as style from "./style.scss";

export const Board: FunctionalComponent = () => {
    const [state] = useContext(StateContext);

    let items = [];
    for (let i = 0; i < 8; i++) {
        const result = getLetterResult(i, state);

        for (let j = 0; j < 3; j++) {
            items.push(
                <span data-result={result[j]}>{state.board[i][j] || ""}</span>,
            );
        }
    }

    return <section class={style.board}>{items}</section>;
};
