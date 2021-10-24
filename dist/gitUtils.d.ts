export declare const setupUser: () => Promise<void>;
export declare const pullBranch: (branch: string) => Promise<void>;
export declare const push: (branch: string, { force }?: {
    force?: boolean | undefined;
}) => Promise<void>;
export declare const pushTags: () => Promise<void>;
export declare const switchToMaybeExistingBranch: (branch: string) => Promise<void>;
export declare const reset: (pathSpec: string, mode?: 'hard' | 'soft' | 'mixed') => Promise<void>;
export declare const commitAll: (message: string) => Promise<void>;
export declare const checkIfClean: () => Promise<boolean>;
