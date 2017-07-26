Scoped.define("module:ZangoDatabaseTable", [
    "data:Databases.DatabaseTable",
    "base:Promise",
    "base:Iterators.ArrayIterator",
    "base:Tokens"
], function(DatabaseTable, Promise, ArrayIterator, Tokens, scoped) {
    return DatabaseTable.extend({
        scoped: scoped
    }, {

        table: function() {
            if (!this.__table)
                this.__table = this._database._getTable(this._table_name);
            return this.__table;
        },

        primary_key: function() {
            return "_id";
        },

        _insertRow: function(row) {
            if (!row[this.primary_key()])
                row[this.primary_key()] = Tokens.generate_token();
            return Promise.funcCallback(this.table(), this.table().insert, row).mapSuccess(function(result) {
                return row;
            }, this);
        },

        _removeRow: function(query) {
            return Promise.funcCallback(this.table(), this.table().remove, query);
        },

        _updateRow: function(query, row) {
            return Promise.funcCallback(this.table(), this.table().update, query, {
                "$set": row
            }).mapSuccess(function() {
                return row;
            });
        },

        _find: function(query, options) {
            var result = this.table().find(query);
            options = options || {};
            if ("sort" in options)
                result = result.sort(options.sort);
            if ("skip" in options)
                result = result.skip(options.skip);
            if ("limit" in options)
                result = result.limit(options.limit);
            return Promise.funcCallback(result, result.toArray).mapSuccess(function(cols) {
                return new ArrayIterator(cols);
            }, this);
        },

        ensureIndex: function(key) {
            this.__table = null;
            this._database._ensureIndex(this._table_name, key);
        }

    });
});