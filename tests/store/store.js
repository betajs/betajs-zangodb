test("zango database store default id", function () {
	var zangodb = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodb");
	var store = new BetaJS.Data.Stores.DatabaseStore(zangodb, "tests");
	store.insert({x: 5}).success(function (object) {
		ok(!!object._id);
		QUnit.equal(typeof object._id, "string");
		QUnit.equal(object.x, 5);
		store.update(object._id, {
			y: 7
		}).success(function (row) {
			QUnit.equal(row.y, 7);
			store.get(object._id).success(function (obj) {
                QUnit.equal(obj.y, 7);
                store.remove(object._id).success(function () {
                    store.get(object._id).success(function (result) {
                        QUnit.equal(result, null);
                        start();
                    });
                });
			});
		});
	});
	stop();
});


test("zango database store other id, separate ids", function () {
    var zangodb = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodb");
    var store = new BetaJS.Data.Stores.DatabaseStore(zangodb, "tests", "id", true);
    store.insert({x: 5, id: 1234}).success(function (object) {
        QUnit.equal(object.id, 1234);
        QUnit.equal(object.x, 5);
        store.update(object.id, {
            y: 7
        }).success(function (row) {
            QUnit.equal(row.y, 7);
            store.get(object.id).success(function (obj) {
                QUnit.equal(obj.y, 7);
                store.remove(object.id).success(function () {
                    store.get(object.id).success(function (result) {
                        QUnit.equal(result, null);
                        start();
                    });
                });
            });
        });
    });
    stop();
});


test("zango database store other id, map", function () {
    var zangodb = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodb");
    var store = new BetaJS.Data.Stores.DatabaseStore(zangodb, "tests", "id");
    store.insert({x: 5}).success(function (object) {
        ok(!!object.id);
        QUnit.equal(object.x, 5);
        store.update(object.id, {
            y: 7
        }).success(function (row) {
            QUnit.equal(row.y, 7);
            store.get(object.id).success(function (obj) {
                QUnit.equal(obj.y, 7);
                store.remove(object.id).success(function () {
                    store.get(object.id).success(function (result) {
                        QUnit.equal(result, null);
                        start();
                    });
                });
            });
        });
    });
    stop();
});