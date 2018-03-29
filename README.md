# cihm-gorilla

Gorilla is a temporary API for accessing and harvesting Canadiana metadata.

## Usage

### `GET /`

#### Response JSON Object

* **version**: API version. Currently `1.0`
* **readme**: A link to this README.
* **collections**: A list of URIs corresponding to Canadiana collections made accessible through this API.

### `GET /collection/:id`

Collection content has been separated into pages to avoid excessively long member lists; each page holds a maximum of 500 members. Members are sorted in reverse updated order, and as such changes can be detected by polling the first page of a collection.

#### Parameter

* **id**: Collection ID

#### Response JSON Object

* **pages**: List of Gorilla URIs for pages of collection members. 

### `GET /collection/:id/:page`

Collections have two types of members: series and items. Series describe ordered lists of items, and correspond to records of e.g. periodicals, newspapers, collections of microfiche. Items describe ordered lists of component images, and correspond to records of e.g. books, periodical issues, microfiche reels.

#### Parameters

* **id**: Collection ID
* **page**: Collection member list page number

#### Response JSON Object

* **members**: List of collection members, structured as follows:
  * **uri**: Gorilla URI corresponding to the series or item
  * **updated**: Time the record was last updated

### `GET /series/:key`

#### Parameter

* **key**: Unique series ID

#### Response JSON Object

* **key**: Same as above.
* **label**: Identifying label for the series.
* **collection**: Canadiana collections the series belongs to. (TODO: convert these to Gorilla URIs.)
* **items**: Ordered list of items owned by this series. Each element is an object defined as:
  * **uri**: Gorilla URI corresponding to the item
  * **label**: Identifying label for the item.
* **metadata**: Descriptive metadata for the series (defined below).

### `GET /item/:key`

#### Parameter

* **key**: Unique item ID

#### Response JSON Object

* **key**: Same as above.
* **label**: Identifying label for the item.
* **collection**: Canadiana collections the item belongs to. (TODO: convert these to Gorilla URIs.)
* **parent**: If this item is an issue of a series, this refers to the series. Its structure is defined as:
  * **uri**: Gorilla URI for the series
  * **label** Identifying label for the series
* **components**: Ordered list of component images owned by this item. Each element is an object defined as:
  * **uri**: Gorilla URI corresponding to the component
  * **label**: Identifying label for the component
* **metadata**: Descriptive metadata for the item (defined below).

### `GET /component/:key`

#### Parameter

* **key**: Unique component ID

#### Response JSON Object

* **key**: Same as above.
* **label**: Identifying label for the component.
* **collection**: Canadiana collections the component belongs to. (TODO: convert these to Gorilla URIs.)
* **parent**: The item this component belongs to. Its value is defined as:
  * **uri**: Gorilla URI corresponding to the item
* **metadata**: Descriptive metadata for the item (defined below).

## Descriptive metadata

Values in the metadata JSON object are all represented as JSON arrays.

### Series and Item

Example:

```
"metadata": {
  "lang": [
    "eng"
  ],
  "identifier": [
    "65591",
    "FC 02 0203 no. 65591"
  ],
  "ti": [
    "Saskatoon : spring 1908.",
    "CIHM/ICMH microfiche series ; no. 65591"
  ],
  "pu": [
    "[Saskatoon, Sask. : s.n., 1908 (Saskatoon, Sask.] : Phoenix Job Print)"
  ],
  "su": [
    "Saskatoon (Sask.) -- Descriptions et voyages.",
    "Saskatoon (Sask.) -- Description and travel.",
    "Saskatoon (Sask.) -- Conditions économiques.",
    "Saskatoon (Sask.) -- Economic conditions.",
    "Saskatoon (Sask.) -- Industries.",
    "Saskatoon (Sask.) -- Industrie."
  ],
  "no": [
    "1 microfiche (19 fr.) : ill., map.",
    "Cover title.",
    "24 p. : ill., map ; 21 cm."
  ],
  "no_source": [
    "Filmed from a copy of the original publication held by the National Library of Canada."
  ]
}
```

Possible fields include:

* **lang**: Language, provided in [ISO 639-2 codes](https://www.loc.gov/standards/iso639-2/php/code_list.php)
* **identifier**: Miscellaneous identifier
* **ti**: Title
* **au**: Author
* **pu**: Publisher
* **su**: Subject heading
* **no**: Notes
* **ab**: Description
* **no_rights**: Rights information
* **no_source**: Document source information

### Component

Example:

```
"metadata": {
  "lang": [
    "eng"
  ],
  "tx": [
    "..."
  ]
}
```

Possible fields include:

* **lang**: Language, provided in [ISO 639-2 codes](https://www.loc.gov/standards/iso639-2/php/code_list.php)
* **tx**: Text content gleaned from OCR

## Authorization

Access to Canadiana&rsquo;s subscription-based collections is restricted to institutions with valid subscriptions. Gorilla performs the same IP address validation as the collections&rsquo; standard web interfaces.

## TODO

* Provide access to the remainder of Canadiana&rsquo;s collections
* Support for ECO/Heritage subcollections
