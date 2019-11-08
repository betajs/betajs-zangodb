Scoped.define("module:ZangoDatabaseTable", [
    "data:Databases.DatabaseTable",
    "base:Promise",
    "base:Iterators.ArrayIterator",
    "base:Tokens",
    "base:Objs",
    "base:Types"
], function(DatabaseTable, Promise, ArrayIterator, Tokens, Objs, Types, scoped) {

    var RESERVED_KEYS = ["weak"];

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

        _encode: function(data) {
            data = Objs.map(data, function(value) {
                return value && (Types.is_object(value) || Types.is_array(value)) ? this._encode(value) : value;
            }, this);
            RESERVED_KEYS.forEach(function(key) {
                if (key in data) {
                    data[key + "_reserved"] = data[key];
                    delete data[key];
                }
            });
            return data;
        },

        _decode: function(data) {
            data = Objs.map(data, function(value) {
                return value && (Types.is_object(value) || Types.is_array(value)) ? this._decode(value) : value;
            }, this);
            RESERVED_KEYS.forEach(function(key) {
                if ((key + "_reserved") in data) {
                    data[key] = data[key + "_reserved"];
                    delete data[key + "_reserved"];
                }
            });
            return data;
        },

        _find: function(query, options) {
            var result = this.table().find(query);
            options = options || {};
            if (options.sort)
                result = result.sort(options.sort);
            if (options.skip)
                result = result.skip(options.skip);
            if (options.limit)
                result = result.limit(options.limit);
            return Promise.funcCallback(result, result.toArray).mapSuccess(function(cols) {
                return new ArrayIterator(cols);
            }, this).error(function(e) {
                console.warn(e);
            });
        },

        ensureIndex: function(key) {
            this.__table = null;
            this._database._ensureIndex(this._table_name, key);
        }

    });
});