let options = `<label for="sort_by" style="display: inline-block;padding:5px;margin-top: 10px;vertical-align: top;">Sort By:</label>
      <select name="sort_by" id="sort_by" >
        <option value="">Sort by</option>
        <option value="rating">Rating</option>
        <option value="name">Name (A-Z)</option>
        <option value="active_installs">Active Installs</option>
        <option value="last_updated">Last Updated</option>
        <option value="downloaded">Most Downloaded</option>
    </select>`;

let searchBtn = `<input type="button" value="Search" id="search-btn" class="button" style="margin:10px 0 0 5px;" />`;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let sortBy = params.sort_by;

jQuery(document).ready(function ($) {
  var searchInputElement = $("#search-plugins");

  searchInputElement.after($(searchBtn));
  searchInputElement.after($(options));

  $("#sort_by").val(sortBy);

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
      };

      searchLocation =
        location.href.split("?")[0] +
        "?" +
        $.param(_.omit(data, ["_ajax_nonce", "pagenow"]));
      window.location = searchLocation;
    }, 1000)
  );

  $("#search-plugins").keydown(function (e) {
    if (e.keyCode === 13) {
      console.log(e.keyCode);
      $(".search-form")[0].submit();
    }
  });

  $("#search-plugins").unbind("keyup input");

  
});
