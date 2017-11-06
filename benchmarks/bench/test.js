(function () {

    suite("test", {}, function() {

    var generate = function (store) {
        var promises = [];
        for (var i = 0; i < 100; ++i)
            for (var j = 0; j < 100; ++j)
                promises.push(store.insert({i:i,j:j}));
        return BetaJS.Promise.and(promises);
    };

    window.testfunc = function (store) {
        return store.query({j: 5}).mapSuccess(function (v) {
            return v.asArray();
        });
    };

    window.memoryStore = new BetaJS.Data.Stores.MemoryStore();
    memoryStore.indices.j = new BetaJS.Data.Stores.MemoryIndex(memoryStore, "j");
    generate(memoryStore);

    window.zangodb = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodbx");
    window.zangodb.getTable("testsx").ensureIndex("j");
    window.zangodbStore = new BetaJS.Data.Stores.DatabaseStore(zangodb, "testsx");
    zangodbStore.clear().success(function () {
        generate(zangodbStore).success(function () {
            alert("Ready");
        });
    });

    bench("Memory Store without Index", function (deferred) {
        testfunc(memoryStore).success(function () {
            this.resolve();
        }, deferred);
    }, {
        defer: true
    });

    bench("ZangoDB Store without Index",  function (deferred) {
        testfunc(zangodbStore).success(function () {
            //console.log("asdf");
            this.resolve();
        }, deferred).error(function ( e) {
            console.log("error", e);
        })
    }, {
        defer: true
    });

}).call(this);