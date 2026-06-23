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

import { CurrencyDetail, GetCurrencyParams } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Currency<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Returns details for a single currency, including provider information or peg metadata.
   *
   * @name GetCurrency
   * @summary Get a single currency
   * @request GET:/currency/{code}
   */
  getCurrency = ({ code }: GetCurrencyParams, params: RequestParams = {}) =>
    this.request<
      CurrencyDetail,
      {
        message?: string;
      }
    >({
      path: `/currency/${code}`,
      method: "GET",
      format: "json",
      ...params,
    });
}
