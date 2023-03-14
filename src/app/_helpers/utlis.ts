export const validateEmail = (email: string) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}; 

export function isNullOrEmpty(value: any) {
    return value === "" || value === null || value === undefined || typeof value === "string" && value.trim() === ""
}