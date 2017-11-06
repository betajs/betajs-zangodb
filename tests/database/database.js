QUnit.test("zango database store", function (assert) {
    var done = assert.async();
	var db = new BetaJS.Data.Databases.Zango.ZangoDatabase("betajszangodb");
    db.getTable("tests").clear().success(function () {
        db.getTable("tests").insertRow({x: 5}).success(function (object) {
            assert.ok(!!object._id);
            assert.equal(typeof object._id, "string");
            assert.equal(object.x, 5);
            db.getTable("tests").updateById(object._id, {y: 6}).success(function () {
                db.getTable("tests").count().success(function (result) {
                    db.getTable("tests").findById(object._id).success(function (result) {
                        assert.equal(result.x, 5);
                        assert.equal(result.y, 6);
                        db.getTable("tests").removeById(object._id).success(function () {
                            db.getTable("tests").findById(object._id).success(function (result) {
                                assert.equal(result, null);
                                done();
                            });
                        });
                    });
                });
            });
        });
    });
});