export interface IEmailInfo{
    From ?: {
        Email: string,
        Name: string
    },
    To ?: {
        Email: string,
        Name: string
    }[],
    Subject ?: string,
    CustomID ?: string
}
