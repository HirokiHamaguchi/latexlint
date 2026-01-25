<!-- markdownlint-disable MD041 -->

Detect URLs containing query strings in `.tex` and `.md` files.

The following query strings are considered unnecessary:

* ?utm_...= (see [Wikipedia](https://en.wikipedia.org/wiki/UTM_parameters))
* ?sessionid=...

The other query strings are allowed:

* `?user=...` (e.g., Google Scholar profile URLs)
* `?q=...` (e.g., search queries)
* `?page=...`
* `?lang=...`
