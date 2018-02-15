import { EventEmitter, Output, Input } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { ICultureService, ITypeConverterService } from '@code-art/angular-globalize';
import { BaseValueAccessor } from "./base-value-accessor";
import { datesEqual, IDateRange, similarInLocal, createDate } from "./util";

export class BaseDateRangeAccessor extends BaseValueAccessor {

    private static readonly maximumYear = 9999;
    private static readonly minimumYear = 0;
    private static readonly defaultMaxDate = similarInLocal(createDate(BaseDateRangeAccessor.maximumYear, 11, 31));
    private static readonly defaultMinDate = similarInLocal(createDate(BaseDateRangeAccessor.minimumYear, 0, 1));
    
    private _rangeSelection: boolean = false;
    private _minDate: Date | null = null;
    private _maxDate: Date | null = null;

    get dir(): string {
        return this.isRtl ? 'rtl' : 'ltr';
    }

    constructor(cultureService: ICultureService,
        protected readonly converterService: ITypeConverterService) {
        super(cultureService);
    }

    @Input() set rangeSelection(val: boolean) {
        if (this.parent) {
            (this.parent as BaseDateRangeAccessor).rangeSelection = val;
            return;
        }
        val = !!val;
        if (val !== this._rangeSelection) {
            this._rangeSelection = val;
            if (!this._rangeSelection) {
                this.value = this.selectionStart;
            }
        }
    }

    get rangeSelection(): boolean {
        if (this.parent) {
            return (this.parent as BaseDateRangeAccessor).rangeSelection;
        }
        return this._rangeSelection;
    }

    @Input() set minDate(val: Date | null) {
        if (this.parent) {
            (this.parent as BaseDateRangeAccessor).minDate = val;
            return;
        }
        val = val || null;
        if (!datesEqual(this._minDate, val)) {
            this._minDate = val;
        }
    }
    get minDate(): Date | null {
        if (this.parent) {
            return (this.parent as BaseDateRangeAccessor).minDate;
        }
        return this._minDate || BaseDateRangeAccessor.defaultMinDate;
    }

    @Input() set maxDate(val: Date | null) {
        if (this.parent) {
            (this.parent as BaseDateRangeAccessor).maxDate = val;
            return;
        }
        val = val || null;
        if (!datesEqual(this._maxDate, val)) {
            this._maxDate = val;
        }
    }

    get maxDate(): Date | null {
        if (this.parent) {
            return (this.parent as BaseDateRangeAccessor).maxDate;
        }
        return this._maxDate || BaseDateRangeAccessor.defaultMaxDate;
    }
    
    get selectionStart(): Date | null {
        if (this.parent) {
            return (this.parent as BaseDateRangeAccessor).selectionStart;
        }
        const val = this.value;
        if (val instanceof Date) {
            return val;
        }
        return val ? val.from as Date : null;
    }

    set selectionStart(val: Date | null) {
        if (this.parent) {
            (this.parent as BaseDateRangeAccessor).selectionStart = val;
            return;
        }
        val = val || null;
        if (!this.rangeSelection) {
            this.value = val;
        } else {
            const v = this.value;
            const oldFrom = v ? v.from : null;
            if (!datesEqual(val, oldFrom)) {
                const to = v ? v.to : null;
                this.value = { from: val, to: to };
            }
        }
    }

    get selectionEnd(): Date | null {
        if (this.parent) {
            return (this.parent as BaseDateRangeAccessor).selectionEnd;
        }
        if (!this.rangeSelection) {
            return null;
        }
        const v = this.value;
        return v ? v.to : null;
    }

    set selectionEnd(val: Date | null) {
        if (this.parent) {
            (this.parent as BaseDateRangeAccessor).selectionEnd = val;
            return;
        }
        if (!this.rangeSelection) {
            return;
        }
        const v = this.value;
        const oldTo = v ? v.to : null;
        if (!datesEqual(val, oldTo)) {
            const from = v ? (v instanceof Date ? v : v.from) : null;
            this.value = { from: from, to: val };
        }
    }

    compareValues(v1: any, v2: any): boolean {
        if (v1 instanceof Date && v2 instanceof Date) {
            return datesEqual(v1, v2);
        }
        if (v1 && v2) {
            return datesEqual(v1.from, v2.from) && datesEqual(v1.to, v2.to);
        }
        return false;
    }

    coerceValue(val: any): any {
        let s: Date | null = null;
        let e: Date | null = null;
        if (val !== null && val !== undefined) {
            if (this.rangeSelection) {
                if (Array.isArray(val)) {
                    s = val.length > 0 ? this.converterService.convertToDate(val[0], this.effectiveLocale) : null;
                    e = val.length > 1 ? this.converterService.convertToDate(val[1], this.effectiveLocale) : null;
                } else {
                    s = this.converterService.convertToDate(val.from, this.effectiveLocale) || null;
                    e = this.converterService.convertToDate(val.to, this.effectiveLocale) || null;
                }
            } else {
                s = this.converterService.convertToDate(val, this.effectiveLocale);
            }
        }
        if (s && e && e.valueOf() < s.valueOf()) {
            throw 'From date must be before or at to date.';
        }
        if (!this.rangeSelection) {
            return s;
        } else if (s || e) {
            return {
                from: s,
                to: e
            }
        } else {
            return null;
        }
    }
}