import { h, FunctionalComponent } from "preact";
import { useContext, useState } from "preact/hooks";

import { StateContext } from "/src/index";
import { GameState, generateSharing } from "/src/logic";

import * as style from "./style.scss";

export const EndScreen: FunctionalComponent = () => {
    const [state] = useContext(StateContext);
    const [copied, setCopied] = useState(false);

    const activeClass =
        state.state !== GameState.InProgress ? style.active : "";
    const classes = `${style.header} ${activeClass}`;
    const shareClasses = `${style.share} ${copied ? style.shared : ""}`;

    let title;
    let emoji;
    if (state.state === GameState.Success) {
        title = "Well Done!";
        emoji = "🥳";
    } else {
        title = "Too bad...";
        emoji = "😭";
    }

    const share = () => {
        navigator.clipboard.writeText(generateSharing(state));
        setCopied(true);
    };

    return (
        <div class={classes}>
            <h1>{title}</h1>
            <span class={style.emoji}>{emoji}</span>
            <button class={shareClasses} onClick={() => share()}>
                {!copied ? "Share Result" : "Copied!"}
            </button>
        </div>
    );
};
