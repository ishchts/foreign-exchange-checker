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

import { Rate } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Rates<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns exchange rates blended across providers. Without date params, returns the latest rates. Each record is a single currency pair.
   *
   * @name GetRates
   * @summary Get exchange rates
   * @request GET:/rates
   */
  getRates = (
    query?: {
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
    },
    params: RequestParams = {},
  ) =>
    this.request<
      Rate[],
      {
        message?: string;
      }
    >({
      path: `/rates`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
