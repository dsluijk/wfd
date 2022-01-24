import words from "/data/words.json";

export const init = (): State => {
    const state = loadState();
    const day = getDay();

    if (day > state.day) {
        newDay(state);
    }

    return state;
};

export const handleInput = (c: string, state: State): State => {
    if (state.state !== GameState.InProgress) return state;

    const attempt = state.submitted.findIndex((val) => !val);
    if (attempt === -1) return state;

    if (c === "enter") {
        return handleEnter(attempt, state);
    }

    if (c === "back") {
        return handleBackspace(attempt, state);
    }

    if (state.board[attempt].length >= 3) return state;
    state.board[attempt] += c.toUpperCase();

    return state;
};

const handleEnter = (attempt: number, state: State): State => {
    if (state.board[attempt].length !== 3) return state;
    if (!words.includes(state.board[attempt])) {
        alert("This word is not known!");
        return state;
    }

    state.submitted[attempt] = true;
    if (state.board[attempt] === state.solution) {
        alert("congrats!");
        state.streak++;
        state.stats[attempt]++;
        state.state = GameState.Success;
    } else if (attempt === 5) {
        alert("too bad :(");
        state.streak = 0;
        state.state = GameState.Failed;
    }

    return state;
};

const handleBackspace = (attempt: number, state: State): State => {
    if (state.board[attempt].length <= 0) return state;
    state.board[attempt] = state.board[attempt].slice(0, -1);

    return state;
};

export const getLetterResult = (
    attempt: number,
    state: State,
): LetterResult[] => {
    let result = [
        LetterResult.Unknown,
        LetterResult.Unknown,
        LetterResult.Unknown,
    ];

    if (!state.submitted[attempt]) {
        return result;
    }

    for (let i = 0; i < 3; i++) {
        if (state.board[attempt][i] === state.solution[i]) {
            result[i] = LetterResult.Correct;
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (result[i] === LetterResult.Correct) continue;
            if (state.solution[i] === state.board[attempt][j]) {
                result[j] = LetterResult.Place;
            }
        }
    }

    return result;
};

// Reset the state for the next day.
const newDay = (state: State) => {
    const day = getDay();
    if (state.day + 1 !== day || state.state !== GameState.Success) {
        state.streak = 0;
    }

    state.day = getDay();
    state.state = GameState.InProgress;
    state.solution = pickSolution(day);
    state.board = ["", "", "", "", "", ""];
    state.submitted = [false, false, false, false, false, false];
};

const pickSolution = (day: number): string => {
    // Generate a pseudo-random enough number;
    const i = (day + 100 * 2375942345) % words.length;
    return words[i].toUpperCase();
};

// Get the day we are playing with.
const getDay = (): number => {
    // Start date in milliseconds.
    // This is midnight from the 23th to 24th of jan in GMT.
    const startTime = 1642982400000;
    // One day in milliseconds.
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculate the current time, with correction for the timezone.
    let now = Date.now();
    now -= new Date().getTimezoneOffset() * 60 * 1000;

    return Math.floor((now - startTime) / oneDay);
};

const loadState = (): State => {
    return JSON.parse(localStorage.getItem("wfdstate")) || getDefault();
};

export const saveState = (state: State) => {
    return localStorage.setItem(
        "wfdstate",
        JSON.stringify(state || getDefault()),
    );
};

export const getDefault = (): State => {
    const day = getDay();

    return {
        state: GameState.InProgress,
        streak: 0,
        solution: pickSolution(day),
        board: ["", "", "", "", "", ""],
        submitted: [false, false, false, false, false, false],
        stats: [0, 0, 0, 0, 0, 0],
        day,
    };
};

export interface State {
    day: number;
    state: GameState;
    streak: number;
    solution: string;
    board: [string, string, string, string, string, string];
    submitted: [boolean, boolean, boolean, boolean, boolean, boolean];
    stats: [number, number, number, number, number, number];
}

export enum GameState {
    InProgress = 1,
    Failed = 2,
    Success = 3,
}

export enum LetterResult {
    Correct = "correct",
    Place = "place",
    Unknown = "",
}