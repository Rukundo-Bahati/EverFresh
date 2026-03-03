export type UserRole = "farmer" | "household" | "institution";

// mock for now (later from auth/backend)
export function useRole(): UserRole {
    return "farmer"; // change to test
}
