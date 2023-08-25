let options = `<label for="sort_by" class="hidden">Sort By:</label>
    <select name="sort_by" id="sort_by" >
        <option value="">Sort by</option>
        <option value="rating">Rating</option>
        <option value="name">Name</option>
         <option value="active_installs">Active Installs</option>
    </select>`;

let order = `<label for="order_by" class="hidden">Order By:</label>
    <select name="order_by" id="order_by" >
        <option value="">Order by</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
    </select>`;

let searchBtn = `<input type="button" value="Search" id="search-btn" class="button" style="margin:10px 0 0 5px;" />`;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let sortBy = params.sort_by;
let orderBy = params.order_by;

jQuery(document).ready(function ($) {
  var searchInputElement = $("#search-plugins");

  searchInputElement.after($(searchBtn));
  searchInputElement.after($(order));
  searchInputElement.after($(options));

  $("#sort_by").val(sortBy);
  $("#order_by").val(orderBy);

  $("#search-btn").on(
    "click",
    _.debounce(function (event, eventtype) {
      searchVal = $("#search-plugins").val();
      if (searchVal.length === 0) return;
      data = {
        _ajax_nonce: wp.updates.ajaxNonce,
        s: searchVal,
        tab: "search",
        type: $("#typeselector").val(),
        pagenow: pagenow,
        sort_by: $("#sort_by").val(),
        order_by: $("#order_by").val(),
      };

      searchLocation =
        location.href.split("?")[0] +
        "?" +
        $.param(_.omit(data, ["_ajax_nonce", "pagenow"]));
      window.location = searchLocation;
    }, 1000)
  );

  $("#search-plugins").unbind("keyup input");
});
