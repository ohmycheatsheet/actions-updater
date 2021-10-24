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
