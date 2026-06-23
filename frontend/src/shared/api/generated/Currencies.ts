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

import { Currency, GetCurrenciesParams } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Currencies<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns available currencies with their names and date ranges. By default, only active currencies are included.
   *
   * @name GetCurrencies
   * @summary Get available currencies
   * @request GET:/currencies
   */
  getCurrencies = (
    query: GetCurrenciesParams = {},
    params: RequestParams = {},
  ) =>
    this.request<Currency[], any>({
      path: `/currencies`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
