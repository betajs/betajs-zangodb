test("zango database store", function () {
	var db = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodb");
	db.getTable("tests").insertRow({x: 5}).success(function (object) {
		ok(!!object._id);
		QUnit.equal(typeof object._id, "string");
		QUnit.equal(object.x, 5);
		db.getTable("tests").updateById(object._id, {y: 6}).success(function () {
            db.getTable("tests").count().success(function (result) {
                db.getTable("tests").findById(object._id).success(function (result) {
                    QUnit.equal(result.x, 5);
                    QUnit.equal(result.y, 6);
                    db.getTable("tests").removeById(object._id).success(function () {
                        db.getTable("tests").findById(object._id).success(function (result) {
                            QUnit.equal(result, null);
                            start();
                        });
                    });
                });
            });
		});
	});
	stop();
});