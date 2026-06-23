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

import { GetRatesParams, Rate } from "./data-contracts";
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
  getRates = (query: GetRatesParams = {}, params: RequestParams = {}) =>
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
