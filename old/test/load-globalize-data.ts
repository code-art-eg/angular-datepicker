﻿import { globalizeStatic } from "@code-art/angular-globalize";

export const loadedGlobalize = ((Globalize: GlobalizeStatic): GlobalizeStatic => {

    Globalize.load(require("cldr-data/supplemental/metaZones.json"));
    Globalize.load(require("cldr-data/supplemental/timeData.json"));
    Globalize.load(require("cldr-data/supplemental/weekData.json"));

    Globalize.load(require("cldr-data/supplemental/currencyData.json"));
    Globalize.load(require("cldr-data/supplemental/plurals.json"));

    Globalize.load(require("cldr-data/main/en-GB/numbers.json"));
    Globalize.load(require("cldr-data/main/en-GB/ca-gregorian.json"));
    Globalize.load(require("cldr-data/main/en-GB/timeZoneNames.json"));
    Globalize.load(require("cldr-data/main/en-GB/currencies.json"));

    Globalize.load(require("cldr-data/main/de/ca-gregorian.json"));
    Globalize.load(require("cldr-data/main/de/timeZoneNames.json"));
    Globalize.load(require("cldr-data/main/de/numbers.json"));
    Globalize.load(require("cldr-data/main/de/currencies.json"));

    Globalize.load(require("cldr-data/main/ar-EG/ca-gregorian.json"));
    Globalize.load(require("cldr-data/main/ar-EG/timeZoneNames.json"));
    Globalize.load(require("cldr-data/main/ar-EG/numbers.json"));
    Globalize.load(require("cldr-data/main/ar-EG/currencies.json"));
    return Globalize;
})(globalizeStatic);