declare module "preact/debug";
declare module "*.scss";
declare module "*/words.json" {
    const words: Word[];
    export default words;
}

interface Word {
    abbr: string;
    meaning: string;
}
