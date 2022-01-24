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
    state.board[attempt] += c.toLowerCase();

    return state;
};

const handleEnter = (attempt: number, state: State): State => {
    if (state.board[attempt].length !== 3) return state;
    if (!words.find((word: Word) => word.abbr === state.board[attempt])) {
        alert("This word is not known!");
        return state;
    }

    state.submitted[attempt] = true;
    if (state.board[attempt] === state.solution.abbr) {
        alert("congrats!");
        state.streak++;
        state.stats[attempt]++;
        state.state = GameState.Success;
    } else if (attempt + 1 === 8) {
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
    if (!state.submitted[attempt]) {
        return [
            LetterResult.Unknown,
            LetterResult.Unknown,
            LetterResult.Unknown,
        ];
    }

    let result = [LetterResult.Wrong, LetterResult.Wrong, LetterResult.Wrong];

    for (let i = 0; i < 3; i++) {
        if (state.board[attempt][i] === state.solution.abbr[i]) {
            result[i] = LetterResult.Correct;
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (result[i] === LetterResult.Correct) continue;
            if (state.solution.abbr[i] === state.board[attempt][j]) {
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
    state.board = ["", "", "", "", "", "", "", ""];
    state.submitted = [false, false, false, false, false, false, false, false];
};

const pickSolution = (day: number): Word => {
    // Generate a pseudo-random enough number;
    const i = (day + 100 * 2375942345) % words.length;
    return words[i];
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
    return migrate(
        JSON.parse(localStorage.getItem("wfdstate")) || getDefault(),
    );
};

const migrate = (state: State): State => {
    switch (state.version) {
        case undefined:
            state.version = 1;
        case 1:
            state.board.push("");
            state.board.push("");
            state.submitted.push(false);
            state.submitted.push(false);
            state.stats.push(0);
            state.stats.push(0);
            newDay(state);
    }

    state.version = 2;

    return state;
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
        version: 2,
        state: GameState.InProgress,
        streak: 0,
        solution: pickSolution(day),
        board: ["", "", "", "", "", "", "", ""],
        submitted: [false, false, false, false, false, false, false, false],
        stats: [0, 0, 0, 0, 0, 0],
        day,
    };
};

export interface State {
    version?: number;
    day: number;
    state: GameState;
    streak: number;
    solution: Word;
    board: [string, string, string, string, string, string, string, string];
    submitted: [
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
        boolean,
    ];
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
    Wrong = "wrong",
    Unknown = "",
}
