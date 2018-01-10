/**
 * Copyright 2016, Sourcepole AG.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const CoordinatesUtils = require('../../MapStore2Components/utils/CoordinatesUtils');
const UrlParams = require("../utils/UrlParams");
const uuid = require('uuid');

const SEARCH_CHANGE = 'SEARCH_CHANGE';
const SEARCH_SET_REQUEST = 'SEARCH_SET_REQUEST';
const SEARCH_ADD_RESULTS = 'SEARCH_ADD_RESULTS';

function changeSearch(text, providers) {
    UrlParams.updateParams({st: text, sp: providers ? providers.join(",") : undefined});
    return {
        type: SEARCH_CHANGE,
        text: text || "",
        providers: providers
    };
}

function startSearch(text, options, providers) {
    return (dispatch) => {
        let reqId = uuid.v1();
        dispatch({
            type: SEARCH_SET_REQUEST,
            id: reqId,
            providers: Object.keys(providers)
        });
        Object.keys(providers).map(provider => {
            providers[provider].onSearch(text, reqId, options, dispatch);
        });
    }
}

function searchMore(moreItem, text, providers) {
    return (dispatch) => {
        if(moreItem.provider && providers[moreItem.provider].getMoreResults) {
            let reqId = uuid.v1();
            dispatch({
                type: SEARCH_SET_REQUEST,
                id: reqId,
                providers: moreItem.provider
            });
            providers[moreItem.provider].getMoreResults(moreItem, text, reqId, dispatch);
        }
    };
}

function addSearchResults(results, append) {
    return {
        type: SEARCH_ADD_RESULTS,
        results: results,
        append: append
    };
}

module.exports = {
    SEARCH_CHANGE,
    SEARCH_SET_REQUEST,
    SEARCH_ADD_RESULTS,
    changeSearch,
    startSearch,
    searchMore,
    addSearchResults
};
