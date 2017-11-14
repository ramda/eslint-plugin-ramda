'use strict';

const reqAll = require('req-all');
const createIndex = require('create-eslint-index');

const rules = reqAll('rules', { camelize: false });

const recommended = createIndex.createConfig({
    plugin: 'ramda',
    field: 'meta.docs.recommended'
}, rules);

module.exports = {
    rules,
    configs: {
        recommended: {
            rules: recommended
        }
    }
};
