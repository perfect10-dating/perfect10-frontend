export function fixIdentity(identity: string) {
    switch (identity) {
        case "man":
            return "Man"
        case "woman":
            return "Woman"
        case "nonbinary":
            return "Non-binary"
        case "transMan":
            return "Trans man"
        case "transWoman":
            return "Trans woman"
    }
    return ""
}