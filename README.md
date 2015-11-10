# ATable

Jquery Table Component


Usage : 

//Usage ATable init
// table1 is default html data
// table2 data from url

var tables = ATable({rowcount: 5, name : "table2", datafromurl : "http://www.w3schools.com/website/customers_mysql.php"});

 $('#exportexcelbutton').on('click', function (e) {
     console.log("asd");
     tables.exportexcel('table2', 'Table to Excel');
    });

console.log(tables.getName());



Note : 

Just required Jquery. 

