Scoped.define("module:ZangoDatabase", [
    "data:Databases.Database",
    "module:ZangoDatabaseTable"
], function(Database, ZangoDatabaseTable, scoped) {
    return Database.extend({
        scoped: scoped
    }, function(inherited) {
        return {

            constructor: function(db) {
                inherited.constructor.call(this);
                this._db = db;
                this._config = {};
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
            }

        };

    });
});