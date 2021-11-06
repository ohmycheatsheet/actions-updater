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
export declare const readTitle: () => string;
export declare const readMajorBranch: () => string;
/**
 * @description validate input
 */
export declare const validate: () => boolean;
export declare const shouldUpdate: () => boolean;
/**
 * @todo support define ignore
 */
export declare const update: () => Promise<void>;
