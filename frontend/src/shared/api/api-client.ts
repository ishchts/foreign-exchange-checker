import { Currencies as CurrenciesApi } from './generated/Currencies';
import { Rates } from './generated/Rates';

export const currencies = new CurrenciesApi({
    // baseUrl: '',
    // securityWorker: (token) =>
    //     token ? { headers: { Authorization: `Bearer ${token}` } } : {},
});

export const rates = new Rates();