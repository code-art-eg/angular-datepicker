﻿import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GlobalizationModule } from "@code-art/angular-globalize";

import { DaysViewComponent } from "./components/days-view.component";
import { MonthsViewComponent } from "./components/months-view.component";
import { NextPreviousComponent } from "./components/next-prev.component";
import { YearsViewComponent } from "./components/years-view.component";

import { DatePickerComponent } from "./components/date-picker.component";
import { DateTimePickerComponent } from "./components/datetime-picker.component";
import { TimePickerComponent } from "./components/time-picker.component";

import { PopupComponent } from "./components/popup.component";

import { ICON_COMPONENTS } from "./components/icons/index";

import { DateRangePickerComponent } from "./components/date-range-picker.component";
import { DatePickerDirective } from "./directives/date-picker.directive";
import { DateRangePickerDirective } from "./directives/date-range-picker.directive";
import { DateTimePickerDirective } from "./directives/datetime-picker.directive";
import { PopupHostDirective } from "./directives/popup-host.directive";
import { TimePickerDirective } from "./directives/time-picker.directive";

@NgModule({
    declarations: [
        DatePickerComponent,
        DateTimePickerComponent,
        DateRangePickerComponent,
        DaysViewComponent,
        MonthsViewComponent,
        NextPreviousComponent,
        YearsViewComponent,
        TimePickerComponent,
        PopupComponent,

        DatePickerDirective,
        DateRangePickerDirective,
        TimePickerDirective,
        DateTimePickerDirective,

        PopupHostDirective,

        ICON_COMPONENTS,
    ],
    entryComponents: [
        PopupComponent,
        TimePickerComponent,
        DatePickerComponent,
        DateRangePickerComponent,
        DateTimePickerComponent],
    exports: [
        DatePickerComponent,
        DateRangePickerComponent,
        DatePickerDirective,
        DateRangePickerDirective,
        TimePickerComponent,
        TimePickerDirective,
        DateTimePickerComponent,
        DateTimePickerDirective],
    imports: [GlobalizationModule, CommonModule, FormsModule],
})
export class DatePickerModule {

}