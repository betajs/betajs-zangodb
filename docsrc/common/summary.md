We provide a simple abstraction for databases and tables, with a concrete implementation for ZangoDB.

First, you instantiate a database, e.g. a ZangoDB:

```javascript
	var database = new BetaJS.Data.Databases.Zango.ZangoDatabase("database");
```
 
The `ZangoDatabase` class inherits from the abstract `Database` class.

Once you have a `database` instance, you can access database tables / collections as follows:

```javascript
	var table = database.getTable('my-table-name');
```

A `table` instance allows you to perform the typical (asynchronous) CRUD operations on the table:

```javascript
	table.insertRow({row data}).success(function (inserted) {...}).error(function (error) {...});
	
	table.removeRow({remove query}).success(function () {...}).error(function (error) {...});
	table.removeById(id).success(function () {...}).error(function (error) {...});
	
	table.updateRow({update query}, {row data}).success(function (updated) {...}).error(function (error) {...});
	table.updateById(id, {row data}).success(function (updated) {...}).error(function (error) {...});
	
	table.find({search query}, {limit, skip, sort}).success(function (rowIterator) {...}).error(function (error) {...});
	table.findOne({search query}, {skip, sort}).success(function (row) {...}).error(function (error) {...});
	table.findById(id).success(function (row) {...}).error(function (error) {...});
``` 

In most cases, you would not access database table instances directly but through the abstraction of a store.

Database Stores allow you to access a database table through the abstract of a `Store`, providing all the additional functionality from the `BetaJS-Data` module.

Once you have instantiated your `database` instance, you can create a corresponding `Store` for a table as follows, e.g. for a ZangoDB:

```javascript
	var store = new BetaJS.Data.Stores.DatabaseStore(database, "my-database-table");
```