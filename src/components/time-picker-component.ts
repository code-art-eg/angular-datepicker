﻿import { Component, Inject, forwardRef, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseTimeValueAccessor } from "../base-time-value-accessor";
import { CANG_GLOBALIZATION_SERVICE, CANG_CULTURE_SERVICE, ICultureService, IGlobalizationService } from "@code-art/angular-globalize";
import { formatTimeComponent, KEY_CODE } from '../util';


@Component({
    selector: 'ca-timepicker',
    templateUrl: './templates/time-picker.component.html',
    styleUrls: ['./styles/time-picker.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimePickerComponent), multi: true
    }]
})
export class TimePickerComponent extends BaseTimeValueAccessor implements AfterViewInit {

   
    private _minutes: number;
    private _hours: number;
    private _seconds: number;
    private _minutesText: string;
    private _hoursText: string;
    private _secondsText: string;
    @ViewChild('hoursInput') hoursElement: ElementRef;
    @ViewChild('minutesInput') minutesElement: ElementRef;
    @ViewChild('secondsInput') secondsElement: ElementRef;

    constructor(@Inject(CANG_CULTURE_SERVICE) cultureService: ICultureService,
        @Inject(CANG_GLOBALIZATION_SERVICE) globalizeService: IGlobalizationService) {
        super(cultureService, globalizeService);
    }

    private selectAllOnFocus(ref: ElementRef, keyup?: () => void, keydown?: () => void): void {
        let input = ref.nativeElement as HTMLInputElement;
        if (input && typeof input.addEventListener === 'function' && typeof input.select === 'function') {
            input.addEventListener('focus', () => {
                let i = ref.nativeElement;
                if (i && typeof i.select === 'function') {
                    i.select();
                }
            });
            if (keyup || keydown) {
                input.addEventListener('keyup', (e): void => {
                    if (e.keyCode === KEY_CODE.UP_ARROW && keyup) {
                        keyup();
                    }
                    if (e.keyCode === KEY_CODE.DOWN_ARROW && keydown) {
                        keydown();
                    }
                });
            }
        }
    }

    ngAfterViewInit(): void {
        this.selectAllOnFocus(this.hoursElement, () => this.hours--, () => this.hours++);
        this.selectAllOnFocus(this.minutesElement, () => this.decreaseMinutes(), () => this.increaseMinutes());
        this.selectAllOnFocus(this.secondsElement, () => this.decreaseSeconds(), () => this.increaseSeconds());
    }
    
    private updateValue(): void {
        this.value = (this.seconds + (this.minutes + this.hours * 60) * 60) * 1000;
    }


    set minutesText(val: string) {
        let v = this.globalizeService.parseNumber(val, this.effectiveLocale, { style: 'decimal' });
        if (v !== null) {
            if (v >= 0 && v < 60) {
                if (this._minutes !== v) {
                    this._minutes = v;
                    this.updateValue();
                }
                this._minutes = v;
                this._minutesText = val;
                if (v > 9 && this.secondsElement && this.secondsElement.nativeElement && typeof this.secondsElement.nativeElement.focus === 'function') {
                    this.secondsElement.nativeElement.focus();
                }
            }
        }
    }

    get minutesText(): string {
        return this._minutesText ? this._minutesText : formatTimeComponent(this.globalizeService, this.minutes, this.effectiveLocale);;
    }

    set hoursText(val: string) {
        let v = this.globalizeService.parseNumber(val, this.effectiveLocale, { style: 'decimal' });
        if (v !== null) {
            if (v >= 0 && v < 24) {
                if (this._hours !== v) {
                    this._hours = v;
                    this.updateValue();
                }
                this._hoursText = val;
                if (v > 2 && this.minutesElement && this.minutesElement.nativeElement && typeof this.minutesElement.nativeElement.focus === 'function') {
                    this.minutesElement.nativeElement.focus();
                }
            }
        }
    }

    get hoursText(): string {
        return this._hoursText ? this._hoursText : formatTimeComponent(this.globalizeService, this.hours, this.effectiveLocale);
    }

    set secondsText(val: string) {
        let v = this.globalizeService.parseNumber(val, this.effectiveLocale, { style: 'decimal' });
        if (v !== null) {
            if (v >= 0 && v < 60) {
                if (this._seconds !== v) {
                    this._seconds = v;
                    this.updateValue();
                }
                this._secondsText = val;
            }
        }
    }

    get secondsText(): string {
        return this._secondsText ? this._secondsText : formatTimeComponent(this.globalizeService, this.seconds, this.effectiveLocale);;
    }


    set minutes(val: number) {
        this._minutesText = null;
        if (typeof val === 'number') {
            val = Math.round(val);
            if (val < 0 || val >= 60) {
                const dh = Math.floor(val / 60);
                this._minutes = val - dh * 60;
                this.hours += dh;
                return;
            }
        }
        if (val !== this._minutes) {
            this._minutes = val;
            this.updateValue();
        }
    }

    get minutes(): number {
        return typeof this._minutes === 'number' ? this._minutes : 0;
    }

    set hours(val: number) {
        this._hoursText = null;
        if (typeof val === 'number') {
            val = Math.round(val);
            if (val < 0 || val >= 24) {
                const d = Math.floor(val / 24);
                val = val -  d * 24;
            }
        } else {
            val = null;

        }
        if (val !== this._hours) {
            this._hours = val;
            this.updateValue();
        }
    }

    get hours(): number {
        return typeof this._hours === 'number' ? this._hours : 0;
    }

    set seconds(val: number) {
        this._secondsText = null;
        if (typeof val === 'number') {
            val = Math.round(val);
            if (val < 0 || val >= 60) {
                const dm = Math.floor(val / 60);
                this._seconds = val - dm * 60;
                this.minutes += dm;
                return;
            }
        } else {
            val = null;

        }
        if (val !== this._seconds) {
            this._seconds = val;
            this.updateValue();
        }
    }

    get seconds(): number {
        return typeof this._seconds === 'number' ? this._seconds : 0;
    }

    decreaseMinutes(): void {
        this.minutes = Math.ceil(this.minutes / this.minutesIncrement) * this.minutesIncrement - this.minutesIncrement;
    }

    increaseMinutes(): void {
        this.minutes = Math.floor(this.minutes / this.minutesIncrement) * this.minutesIncrement + this.minutesIncrement;
    }


    decreaseSeconds(): void {
        this.seconds = Math.ceil(this.seconds / this.secondsIncrement) * this.secondsIncrement - this.secondsIncrement;
    }

    increaseSeconds(): void {
        this.seconds = Math.floor(this.seconds / this.secondsIncrement) * this.secondsIncrement + this.secondsIncrement;
    }
}