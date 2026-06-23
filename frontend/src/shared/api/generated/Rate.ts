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

export class Rate<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns the blended exchange rate for a single currency pair. Without a date param, returns the latest rate.
   *
   * @name GetRate
   * @summary Get a single exchange rate pair
   * @request GET:/rate/{base}/{quote}
   */
  getRate = (
    base: string,
    quote: string,
    query?: {
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
    },
    params: RequestParams = {},
  ) =>
    this.request<
      Rate,
      {
        message?: string;
      }
    >({
      path: `/rate/${base}/${quote}`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
