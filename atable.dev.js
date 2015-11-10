var ATable = function(options) {
    
    var rowcounts = options.rowcount;
    var tabledomname = options.name;
    var datafromwhat = options.datafromurl;
    var rowsTotal;
    
    if(datafromwhat==null || datafromwhat=="")
    {
        rowsTotal = $('#'+tabledomname+' tbody tr').length;
    
        if(rowsTotal=="" || rowsTotal==null)
        {
            $('#'+tabledomname).after('<label classs="notfound">Record Not Found</label>');
        }
        tablePaging(tabledomname,rowcounts);
    }else{
         $('#'+tabledomname).after('<label id="'+tabledomname+'notfound" classs="atablenotfound">Records Loading</label>');
       var htmls = "";
       $.getJSON( datafromwhat, function( data ) {
           $.each( data, function( key, val ) {
               console.log(key);
              htmls += "<tr>";
              $.each( val, function( key, val ) {
                  htmls += "<td id='" + key + "'>" + val + "</td>";
              });
              htmls += "</tr>";
           });
           $('#'+tabledomname+'notfound').remove();
           $('#'+tabledomname+" tbody").append(htmls);
           rowsTotal = $('#'+tabledomname+' tbody tr').length;
           if(rowsTotal=="" || rowsTotal==null)
           {
                $('#'+tabledomname).after('<label classs="atablenotfound">Record Not Found</label>');
           }
           tablePaging(tabledomname,rowcounts);
        });
    }
    
    var tableop = {};
    
   
    
    $('#'+tabledomname).before('<input type="text" id="'+tabledomname+'search">');
    
    
    
    $('#'+tabledomname).before('<select id="'+tabledomname+'select"><option value="'+rowcounts+'">'+rowcounts+'</option><option value="25">25</option><option value="50">50</option><option value="100">100</option><option value="all">all</option></select>');
    
    $('#'+tabledomname).before('<input type="button" id="exportexcelbutton" value="Export to Excel">');
    
    $('#'+tabledomname+'select').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        var valueSelected = this.value;
        if(valueSelected=="all")
        {
            valueSelected = rowsTotal;
        }
        tablePaging(tabledomname,valueSelected);
    });
    
     $('#'+tabledomname+'search').keyup(function(){
        var rowcountselect = $( "#"+tabledomname+"select option:selected" ).text();
        $('#'+tabledomname+' tbody tr').slice(0, rowcountselect).show();
        var txt = this;
        $.each($("#"+tabledomname+" tbody").find("tr"), function() {
            
            if($(this).text().toLowerCase().indexOf($(txt).val().toLowerCase()) == -1)
            {
               $(this).hide();
            }else if($(txt).val()==null || $(txt).val()==""){
            	tablePaging(tabledomname,rowcountselect);
            }else{
            	$(this).show();     
                tableDisPaging(tabledomname);
            }
                 
        });
    }); 
    
    tableop.getRowcount = function() {
        return rowcounts;
    };
    
    tableop.getName = function() {
        return tabledomname;
    };
    
    
    function tableDisPaging(tabledomname) {
        var rowcountselect = $( "#"+tabledomname+"select option:selected" ).text();
    	$('#'+tabledomname+'nav').empty();
    }     
    
    function tablePaging(tabledomname,rowcount) {
        $('#'+tabledomname+'nav').empty();
        $('#'+tabledomname).after('<ul class="pagination pagination-sm" id="'+tabledomname+'nav"></ul>');
        var numPages = rowsTotal/rowcount;
        for(i = 0;i < numPages;i++) {
            var pageNum = i + 1;
            $('#'+tabledomname+'nav').append('<li><a href="#" rel="'+i+'">'+pageNum+'</a><li> ');
        }
        $('#'+tabledomname+' tbody tr').hide();
        $('#'+tabledomname+' tbody tr').slice(0, rowcount).show();
        $('#'+tabledomname+'nav li:first').addClass('active');
        $('#'+tabledomname+'nav a').bind('click', function(){

            $('#'+tabledomname+'nav li').removeClass('active');
            $(this).parent("li").addClass('active');
            var currPage = $(this).attr('rel');
            var startItem = currPage * rowcount;
            var endItem = startItem + rowcount;
            $('#'+tabledomname+' tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
            css('display','table-row').animate({opacity:1}, 300);
        });
    }
    
    function addTableRow(ATables,data){
        ATables.each(function(){
            var $table = $(this);
            var n = $('tr:last td', this).length;
            var tds = '<tr>';
            $.each( data, function( key, val ) {
                  tds += "<td id='" + key + "'>" + val + "</td>";
            });
            tds += '</tr>';
            if($('tbody', this).length > 0){
                $('tbody', this).append(tds);
            }else {
                $(this).append(tds);
            }
        });
	}
    
    //exprort to excel function
    tableop.exportexcel = function(table,name){
         var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
        
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx));
    };
    return tableop;
    
};