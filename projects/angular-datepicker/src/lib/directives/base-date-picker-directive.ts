import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  Input,
  ViewContainerRef,
  } from '@angular/core';

import type { ComponentFactory, OnDestroy, OnInit } from '@angular/core';
import { CurrentCultureService, GlobalizationService, TypeConverterService } from '@code-art-eg/angular-globalize';
import { DateFormatterOptions } from 'globalize';
import { BaseDatePickerAccessorDirective } from '../base-date-picker-accessor-directive';
import { BaseDatePickerComponentDirective } from '../components/base-date-picker-component-directive';
import { IDatePicker, IPopupDirective } from '../interfaces';
import { isPlainObject } from '../util';

@Directive()
export abstract class BaseDatePickerDirective extends BaseDatePickerAccessorDirective<IDatePicker>
  implements IPopupDirective<IDatePicker>, IDatePicker, OnInit, OnDestroy {

  @HostListener('focus') public onFocus?: () => void;
  @HostListener('blur') public onBlur?: () => void;
  @Input() public orientTop: boolean | undefined;
  @Input() public orientRight: boolean | undefined;
  @Input() public format!: string;
  public initPopupDirective!: (resolver: ComponentFactoryResolver,
                               viewContainerRef: ViewContainerRef,
                               el: ElementRef,
                               injector: Injector) => void;

  constructor(resolver: ComponentFactoryResolver,
              viewContainerRef: ViewContainerRef,
              el: ElementRef,
              injector: Injector,
              cultureService: CurrentCultureService,
              private readonly globalizationService: GlobalizationService,
              changeDetector: ChangeDetectorRef,
              converterService: TypeConverterService) {
    super(cultureService, converterService, changeDetector);
    this.initPopupDirective(resolver, viewContainerRef, el, injector);
  }

  public getDefaultFormat(): string {
    return 'short';
  }

  public abstract resolveFactory(resolver: ComponentFactoryResolver): ComponentFactory<BaseDatePickerComponentDirective>;

  public formatValue(val: any, locale: string, format: string): string {
    if (val === undefined || val === null) {
      return '';
    }
    if (val instanceof Date) {
      return this.formatDate(val, locale, format);
    } else if (isPlainObject(val)) {
      let from: any = val.from;
      if (from instanceof Date) {
        from = this.formatDate(from, locale, format);
      } else {
        from = null;
      }

      let to: any = val.to;
      if (to instanceof Date) {
        to = this.formatDate(to, locale, format);
      } else {
        to = null;
      }

      if (!from) {
        if (!to) {
          return '';
        }
        return to;
      } else {
        if (!to) {
          return from;
        }
        return `${from} - ${to}`;
      }
    }
    return '';
  }

  public ngOnInit(): void {
    // do nothing
  }

  public ngOnDestroy(): void {
    // do nothing
  }

  private formatDate(val: Date, locale: string, format: string) {
    format = format || 'short';
    let options: DateFormatterOptions;
    switch (format) {
      case 'short':
      case 'medium':
      case 'long':
      case 'full':
        options = { date: format };
        break;
      default:
        if (format.indexOf('raw:')) {
          options = { raw: format.substr(4) };
        } else {
          options = { skeleton: format };
        }
        break;
    }
    return this.globalizationService.formatDate(val, locale, options);
  }
}
