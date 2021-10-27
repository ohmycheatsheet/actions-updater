/**
 * @see {@link https://github.com/changesets/action/blob/master/src/utils.ts}
 */
export declare function execWithOutput(command: string, args?: string[], options?: {
    ignoreReturnCode?: boolean;
    cwd?: string;
}): Promise<{
    code: number;
    stdout: string;
    stderr: string;
}>;
export declare const rt: (pathname?: string) => string;
export declare const rs: (pathname?: string) => string;
export declare const readChangelog: () => string;
export declare const readVersion: () => string;
export declare const DEFAULT_REPO = "ohmycheatsheet/cheatsheets";
export declare const shouldUpdate: () => boolean;
/**
 * @todo support define ignore
 */
export declare const update: () => Promise<void>;
