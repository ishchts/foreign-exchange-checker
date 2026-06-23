import { Currencies as CurrenciesApi } from './generated/Currencies';

export const currencies = new CurrenciesApi({
    // baseUrl: '',
    // securityWorker: (token) =>
    //     token ? { headers: { Authorization: `Bearer ${token}` } } : {},
});
