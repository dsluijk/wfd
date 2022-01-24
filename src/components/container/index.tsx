import { h, FunctionalComponent } from "preact";

import * as style from "./style.scss";

export const Container: FunctionalComponent = (props) => {
    return <main class={style.container}>{props.children}</main>;
};
