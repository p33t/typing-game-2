import {KeySetName} from "../features/main/model";

export function enumerateKeySet(name: KeySetName): string[] {
    switch (name) {
        case "Home Keys":
            return ['f', 'j' ,'d' ,'k' ,'s' ,'l' ,'a' ,';'];
            
        case "Home Row":
            const arr = enumerateKeySet("Home Keys");
            arr.push('g', 'h', "'");
            return arr;
    }
}

export function nextKeyPrompt(available: string[]) {
    // TODO: This needs to get more elaborate and incorporate a probability profile
    const ix = Math.floor(Math.random() * available.length);
    return available[ix];
}
