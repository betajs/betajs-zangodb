/*!
betajs-zangodb - v0.0.5 - 2018-11-15
Copyright (c) Oliver Friedmann
Apache-2.0 Software License.
*/

(function () {
var Scoped = this.subScope();
Scoped.binding('module', 'global:BetaJS.Data.Databases.Zango');
Scoped.binding('base', 'global:BetaJS');
Scoped.binding('data', 'global:BetaJS.Data');
Scoped.define("module:", function () {
	return {
    "guid": "1f4fd098-7b39-4f33-8638-585484cbe503",
    "version": "0.0.5",
    "datetime": 1542298583721
};
});
Scoped.assumeVersion('base:version', '~1.0.96');
Scoped.assumeVersion('data:version', '~1.0.41');
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
            if ("sort" in options)
                result = result.sort(options.sort);
            if ("skip" in options)
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
Scoped.define("module:ZangoDatabase", [
    "data:Databases.Database",
    "base:Promise",
    "module:ZangoDatabaseTable"
], function(Database, Promise, ZangoDatabaseTable, scoped) {
    return Database.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(db, tables) {
                inherited.constructor.call(this);
                this._db = db;
                this._config = tables || {};
                this._zangodb = null;
            },

            destroy: function() {
                this._unbind();
                inherited.destroy.call(this);
            },

            _unbind: function() {
                if (this._zangodb) {
                    this._zangodb.close();
                    this._zangodb = null;
                }
            },

            _bind: function() {
                if (!this._zangodb)
                    this._zangodb = new zango.Db(this._db, this._config);
            },

            _tableClass: function() {
                return ZangoDatabaseTable;
            },

            _ensureIndex: function(tableName, key) {
                this._config[tableName] = this._config[tableName] || [];
                this._config[tableName].push(key);
                this._unbind();
            },

            _getTable: function(tableName) {
                if (!this._config[tableName]) {
                    this._unbind();
                    this._config[tableName] = [];
                }
                this._bind();
                return this._zangodb.collection(tableName);
            },

            deleteDatabase: function() {
                this._unbind();
                return this.cls.deleteDatabase(this._db);
            }

        };

    }, {

        deleteDatabase: function(db) {
            var req = indexedDB.deleteDatabase(db);
            var promise = Promise.create();
            req.onsuccess = function() {
                promise.asyncSuccess(true);
            };
            req.onerror = function() {
                promise.asyncError("Couldn't delete database");
            };
            req.onblocked = function() {
                promise.asyncError("Couldn't delete database due to the operation being blocked");
            };
            return promise;
        }

    });
});
}).call(Scoped);