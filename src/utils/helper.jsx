export const ensureEnv = (name) => {
    const value = import.meta.env[name];

    if (value === undefined) {
        throw new Error(`Missing environment variable ${name}`);
    }
    return value;
}
