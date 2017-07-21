var searchField = $('.search');
var searchInput = $("input[type='search']");
searchField.addClass('full');
var checkSearch = function(){
    var contents = searchInput.val();
    if(contents.length !== 0){
       searchField.addClass('full');
    } else {
       searchField.removeClass('full');
    }
};

$("input[type='search']").focus(function(){
    searchField.addClass('isActive');
  }).blur(function(){
  	searchField.removeClass('isActive');
    checkSearch();
});


$(window).on("load resize ", function() {
  var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
  $('.tbl-header').css({'padding-right':scrollWidth});
}).resize();     


