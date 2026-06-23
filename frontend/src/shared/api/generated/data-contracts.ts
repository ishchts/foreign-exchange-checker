/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Rate {
  /**
   * The date of the rate
   * @format date
   */
  date: string;
  /** Base currency code */
  base: string;
  /** Quote currency code */
  quote: string;
  /**
   * Exchange rate value
   * @exclusiveMin 0
   */
  rate: number;
  /** Per-provider rates for this pair. Present only when `expand=providers` is set. Each entry has the provider's published rate (rebased to the row's base). Entries with `excluded: true` did not contribute to the blended `rate` — either flagged as outliers by the consensus filter, or overridden by a currency peg. Omitted on synthesized peg rows where no provider published the quote. */
  providers?: {
    /** Provider key */
    key: string;
    /**
     * Provider's rate, rebased to the row's base
     * @exclusiveMin 0
     */
    rate: number;
    /** Present and true when this entry did not contribute to the blended rate */
    excluded?: boolean;
  }[];
}

export interface Currency {
  /** ISO 4217 currency code */
  iso_code: string;
  /** ISO 4217 numeric code */
  iso_numeric?: string | null;
  /** Full currency name */
  name: string;
  /** Currency symbol */
  symbol?: string | null;
  /**
   * Earliest available date
   * @format date
   */
  start_date?: string | null;
  /**
   * Latest available date
   * @format date
   */
  end_date?: string | null;
}

export interface CurrencyDetail {
  /** ISO 4217 currency code */
  iso_code: string;
  /** ISO 4217 numeric code */
  iso_numeric?: string | null;
  /** Full currency name */
  name: string;
  /** Currency symbol */
  symbol?: string | null;
  /** Provider keys that publish this currency */
  providers?: string[];
  /** Peg metadata, present only for pegged currencies */
  peg?: {
    base?: string;
    rate?: number;
    authority?: string;
    /** @format uri */
    source?: string;
  };
}

export interface Provider {
  /** Provider identifier */
  key: string;
  /** Full provider name */
  name: string;
  /** ISO 3166-1 alpha-2 country code */
  country_code?: string | null;
  /** Official rate type as used by the source */
  rate_type?: string | null;
  /** Base currency for published rates */
  pivot_currency?: string | null;
  /**
   * Link to the data source
   * @format uri
   */
  data_url?: string | null;
  /**
   * Link to terms of use
   * @format uri
   */
  terms_url?: string | null;
  /**
   * Earliest available date
   * @format date
   */
  start_date?: string | null;
  /**
   * Latest available date
   * @format date
   */
  end_date?: string | null;
  /** How often the provider publishes rates. Determines the unit of publishes_missed: a count of days, ISO weeks, or calendar months. Null for historical-only providers with no scheduled cadence. */
  publish_cadence?: "daily" | "weekly" | "monthly";
  /**
   * Number of expected publishes missed since end_date, in units of publish_cadence. For daily providers, counts scheduled publish days strictly between end_date and today. For weekly and monthly providers, counts ISO weeks or calendar months between the latest imported bucket and the bucket whose publish window has already started. Null when the provider has no scheduled cadence or no imported data.
   * @min 0
   */
  publishes_missed?: number | null;
  /** Currency codes covered by this provider */
  currencies: string[];
}

export interface GetRatesParams {
  /**
   * Specific date (YYYY-MM-DD). Cannot be combined with from/to.
   * @format date
   * @example "2024-01-15"
   */
  date?: string;
  /**
   * Start of date range (YYYY-MM-DD)
   * @format date
   * @example "2024-01-01"
   */
  from?: string;
  /**
   * End of date range (YYYY-MM-DD). Defaults to today.
   * @format date
   * @example "2024-01-31"
   */
  to?: string;
  /**
   * Base currency (default: EUR)
   * @default "EUR"
   * @example "USD"
   */
  base?: string;
  /**
   * Comma-separated list of quote currencies to include
   * @example "USD,GBP,JPY"
   */
  quotes?: string;
  /**
   * Comma-separated list of data providers to include
   * @example "ECB,TCMB"
   */
  providers?: string;
  /**
   * Downsample rates by time period. Only applies to date ranges.
   * @example "month"
   */
  group?: "week" | "month";
  /**
   * Comma-separated list of optional fields to include per record. Currently supports `providers`, which adds an array of `{ key, rate }` objects per record showing each provider's individual rate. Outliers excluded from the blend (and providers whose rate was overridden by a currency peg) are flagged with `excluded: true`. The field is omitted on synthesized peg rows where no provider published the quote. In CSV output, the `providers` column is encoded as `KEY:RATE` pairs joined by `|`, with a trailing `*` on excluded entries (e.g. `ECB:0.92|FED:1.50*`).
   * @example "providers"
   */
  expand?: "providers";
}

export interface GetRateParams {
  /**
   * Specific date (YYYY-MM-DD). Cannot be combined with from/to.
   * @format date
   * @example "2024-01-15"
   */
  date?: string;
  /**
   * Comma-separated list of data providers to include
   * @example "ECB,TCMB"
   */
  providers?: string;
  /** @example "EUR" */
  base: string;
  /** @example "USD" */
  quote: string;
}

export interface GetCurrencyParams {
  /** @example "USD" */
  code: string;
}

export interface GetCurrenciesParams {
  /** Set to 'all' to include legacy currencies */
  scope?: "all";
  /**
   * Comma-separated list of data providers to include
   * @example "ECB,TCMB"
   */
  providers?: string;
}
