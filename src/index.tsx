/**
 * Include the debug code if it's a development build.
 * This has to be the first import, therefore the non-standard ordering.
 */
if (process.env.NODE_ENV === "development") {
    import("preact/debug");
}

import { createContext, FunctionalComponent, h, render } from "preact";
import { useState } from "preact/hooks";

import { Board } from "/src/components/board";
import { Container } from "/src/components/container";
import { Header } from "/src/components/header";
import { Keyboard } from "/src/components/keyboard";

import { init, saveState, State } from "/src/logic";

import "./global.scss";

export const StateContext = createContext(undefined);

const initialStore = init();

/**
 * The main component.
 */
const Main: FunctionalComponent = () => {
    const [state, setState] = useState(initialStore);

    const save = (state: State) => {
        setState(Object.assign({}, state));
        setTimeout(() => saveState(state), 0);
    };

    return (
        <StateContext.Provider value={[state, save]}>
            <Container>
                <Header />
                <Board />
                <Keyboard />
            </Container>
        </StateContext.Provider>
    );
};

/**
 * Let's render the main
 */
render(<Main />, document.body);
