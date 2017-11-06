QUnit.test("zango database store default id", function (assert) {
    var done = assert.async();
	var zangodb = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodb");
	var store = new BetaJS.Data.Stores.DatabaseStore(zangodb, "tests");
	store.clear().success(function () {
        store.insert({x: 5}).success(function (object) {
            assert.ok(!!object._id);
            assert.equal(typeof object._id, "string");
            assert.equal(object.x, 5);
            store.update(object._id, {
                y: 7
            }).success(function (row) {
                assert.equal(row.y, 7);
                store.get(object._id).success(function (obj) {
                    assert.equal(obj.y, 7);
                    store.remove(object._id).success(function () {
                        store.get(object._id).success(function (result) {
                            assert.equal(result, null);
                            start();
                        });
                    });
                });
            });
        });
    });
});


QUnit.test("zango database store other id, separate ids", function (assert) {
    var done = assert.async();
    var zangodb = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodb");
    var store = new BetaJS.Data.Stores.DatabaseStore(zangodb, "tests", "id", true);
    store.clear().success(function () {
        store.insert({x: 5, id: 1234}).success(function (object) {
            assert.equal(object.id, 1234);
            assert.equal(object.x, 5);
            store.update(object.id, {
                y: 7
            }).success(function (row) {
                assert.equal(row.y, 7);
                store.get(object.id).success(function (obj) {
                    assert.equal(obj.y, 7);
                    store.remove(object.id).success(function () {
                        store.get(object.id).success(function (result) {
                            assert.equal(result, null);
                            done();
                        });
                    });
                });
            });
        });
    });
});


QUnit.test("zango database store other id, map", function (assert) {
    var done = assert.async();
    var zangodb = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodb");
    var store = new BetaJS.Data.Stores.DatabaseStore(zangodb, "tests", "id");
    store.clear().success(function () {
        store.insert({x: 5}).success(function (object) {
            assert.ok(!!object.id);
            assert.equal(object.x, 5);
            store.update(object.id, {
                y: 7
            }).success(function (row) {
                assert.equal(row.y, 7);
                store.get(object.id).success(function (obj) {
                    assert.equal(obj.y, 7);
                    store.remove(object.id).success(function () {
                        store.get(object.id).success(function (result) {
                            assert.equal(result, null);
                            done();
                        });
                    });
                });
            });
        });
    });
});