export const currencies = [
    {
        value: "USD",
        label: "$ Dollar",
        locate: "en-US"
    },
    {
        value: "EUR",
        label: "€ Euro",
        locate: "en-GB"
    },
    {
        value: "GBP",
        label: "£ Pound Sterling",
        locate: "en-GB"
    },
    {
        value: "JPY",
        label: "¥ Japanese Yen",
        locate: "ja-JP"
    },
    {
        value: "AUD",
        label: "A$ Australian Dollar",
        locate: "en-AU"
    },
    {
        value: "CAD",
        label: "C$ Canadian Dollar",
        locate: "en-CA"
    },
    {
        value: "CHF",
        label: "CHF Swiss Franc",
        locate: "fr-CH"
    },
    {
        value: "CNY",
        label: "¥ Chinese Yuan",
        locate: "zh-CN"
    },
    {
        value: "INR",
        label: "₹ Indian Rupee",
        locate: "hi-IN"
    },
    {
        value: "BRL",
        label: "R$ Brazilian Real",
        locate: "pt-BR"
    }
];


export type ICurrencies = (typeof currencies)[0]