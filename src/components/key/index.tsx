import { h, FunctionalComponent } from "preact";

import { handleInput } from "/src/logic";
import { StateContext } from "/src/index";

import * as style from "./style.scss";
import { useContext } from "preact/hooks";

export const Key: FunctionalComponent = (props) => {
    const [state, setState] = useContext(StateContext);

    const onClick = () => {
        setState(handleInput(props.children as string, state));
    };

    return (
        <button class={style.key} onClick={() => onClick()}>
            {props.children}
        </button>
    );
};
