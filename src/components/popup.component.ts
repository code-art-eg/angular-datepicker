﻿import { Component, Renderer2, ElementRef, Inject, AfterViewInit, ViewChild, HostListener, ViewContainerRef, ComponentRef, ComponentFactoryResolver, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { datesEqual, applyMixins } from '../util';
import { BaseTimeValueAccessor } from '../base-time-value-accessor';
import { ICultureService, CANG_CULTURE_SERVICE } from '@code-art/angular-globalize';
import { TimePickerDirective } from '../directives/time-picker.directive';
import { IPopupComponent, IPopupDirective } from '../popups';
import { IBaseValueAccessor } from '../base-value-accessor';
import { PopupHostDirective } from '../directives/popup-host.directive';


@Component({
    templateUrl: './templates/popup.component.html',
    styleUrls: ['./styles/popup.component.less']
})
export class PopupComponent implements AfterViewInit, IPopupComponent {

    private _mouseIn = false;
    hostedElement: ElementRef;
    popupDirective: IPopupDirective;
    private componentRef: ComponentRef<IBaseValueAccessor>;
    private _show = false;
    private _componenthost: PopupHostDirective;
    @ViewChild("inputhost") inputHost: ElementRef;

    @ViewChild(PopupHostDirective) set componenthost(val: PopupHostDirective) {
        if (val !== this._componenthost) {
            if (this.componentRef) {
                this.componentRef.destroy();
                this.componentRef = null;
            }
            this._componenthost = val;
            if (val) {
                this.componentRef = this._componenthost.viewContainerRef.createComponent(this.popupDirective.resolveFactory(this.resolver));
                this.popupDirective.addBoundChild(this.componentRef.instance);
            }
        }
    }

    get componenthost(): PopupHostDirective {
        return this._componenthost;
    }
    
    constructor(@Inject(Renderer2) private readonly renderer: Renderer2,
        @Inject(CANG_CULTURE_SERVICE) private readonly cultureService: ICultureService,
        @Inject(ComponentFactoryResolver) private readonly resolver: ComponentFactoryResolver
    ) {
    }


    ngAfterViewInit(): void {
        let element = this.hostedElement.nativeElement;
        while (element.newNativeElement) {
            element = element.newNativeElement;
        }
        //element.newNativeElement = host;
        this.renderer.appendChild(this.inputHost.nativeElement, element);
    }

    @HostListener('mouseenter') mouseEnter(): void {
        this._mouseIn = true;
    };

    @HostListener('mouseleave') mouseLeave(): void {
        setTimeout(() => this._mouseIn = false, 50);
    };

    set show(val: boolean) {
        val = !!val;
        if (this._show !== val) {
            this._show = val;
        }
    }

    get show(): boolean {
        return this.show;
    }

    get isVisible(): boolean {
        let show = this._show || this._mouseIn;
        return show;
    }

    get orientTop(): boolean {
        return this.popupDirective.orientTop;
    }

    get orientRight(): boolean {
        return this.popupDirective.orientRight;
    }
}
