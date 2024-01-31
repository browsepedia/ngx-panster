import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  Input,
  ViewChild,
  inject,
  numberAttribute,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, fromEvent, tap } from 'rxjs';
import { NgxPansterUtils } from './ngx-panster.utils';

@Component({
  selector: 'ngx-panster',
  standalone: true,
  imports: [],
  templateUrl: './ngx-panster.component.html',
  styleUrl: './ngx-panster.component.scss',
  providers: [NgxPansterUtils],
})
export class NgxPansterComponent implements AfterViewInit {
  @Input() public set zoomPercentage(percentage: number) {
    this._utils.setElementZoom(percentage);
  }

  @Input({ transform: numberAttribute }) public minZoom: number = 10;
  @Input({ transform: numberAttribute }) public maxZoom?: number;
  @Input({ transform: numberAttribute }) public zoomStep = 25;

  @ViewChild('panElement')
  private set _panElementRef(element: ElementRef<HTMLDivElement>) {
    this._utils.setPanElement(element.nativeElement);
    this._panElement = element.nativeElement;
  }

  @ViewChild('panContainer')
  private set _panContainerRef(element: ElementRef<HTMLDivElement>) {
    this._utils.setContainerElement(element.nativeElement);
    this._panContainer = element.nativeElement;
  }

  protected isPanning = false;

  private _startEvent?: MouseEvent | TouchEvent;
  private _initialPanX = 0;
  private _initialPanY = 0;

  private readonly _destroyRef = inject(DestroyRef);
  private pattern = /-?\b\d+(\.\d+)?(?=px\b)/g;

  private readonly _utils = inject(NgxPansterUtils);

  private _panElement!: HTMLDivElement;
  private _panContainer!: HTMLDivElement;

  public get zoomPercentage(): number {
    const currentZoom =
      this._panElement?.style.transform?.match(/scale\((.*?)\)/)?.[1] || '1';

    return Number(currentZoom) * 100;
  }

  zoomIn(percentage?: number) {
    this._utils.zoomElementIn(percentage || this.zoomStep, this.maxZoom);
  }

  zoomOut(percentage?: number) {
    this._utils.zoomElementOut(percentage || this.zoomStep, this.minZoom);
  }

  centerX(): void {
    this._utils.centerX();
  }

  centerY(): void {
    this._utils.centerY();
  }

  centerElementPoint(x: number, y: number): void {
    this._utils.centerContentPoint(x, y);
  }

  centerContent(): void {
    this._utils.centerContent();
  }

  centerContentTop(): void {
    this._utils.centerContentTop();
  }

  ngAfterViewInit(): void {
    fromEvent<MouseEvent>(this._panContainer, 'mouseleave')
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter(() => this.isPanning),
        tap(() => {
          this.isPanning = false;
          this._startEvent = undefined;
        })
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'mousedown')
      .pipe(tap(this._onMouseDown), takeUntilDestroyed(this._destroyRef))
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'touchstart')
      .pipe(tap(this._onMouseDown), takeUntilDestroyed(this._destroyRef))
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'mouseup')
      .pipe(
        filter(() => this.isPanning),
        tap(this._onMouseUp),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'touchend')
      .pipe(
        filter(() => this.isPanning),
        tap(this._onMouseUp),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'mousemove')
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter(() => this.isPanning),
        tap(this._onMouseMove)
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'touchmove')
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter(() => this.isPanning),
        tap(this._onMouseMove)
      )
      .subscribe();
  }

  private readonly _onMouseDown = (event: MouseEvent | TouchEvent): void => {
    this._startEvent = event;
    this.isPanning = true;

    if (event instanceof TouchEvent) {
      event.stopPropagation();
    }

    if (this._panElement.style.left) {
      this._initialPanX = parseFloat(
        this._panElement.style.left.match(this.pattern)?.[0] || '0'
      );
    } else {
      this._initialPanX = 0;
    }

    if (this._panElement.style.top) {
      this._initialPanY = parseFloat(
        this._panElement.style.top.match(this.pattern)?.[0] || '0'
      );
    } else {
      this._initialPanY = 0;
    }
  };

  private readonly _onMouseUp = (event: MouseEvent): void => {
    this.isPanning = false;
    this._startEvent = undefined;
  };

  private readonly _onMouseMove = (event: MouseEvent | TouchEvent) => {
    const pageX =
      event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;
    const pageY =
      event instanceof MouseEvent ? event.pageY : event.touches[0].pageY;

    if (event instanceof TouchEvent) {
      event.stopPropagation();
    }

    console.log('pageX', pageX, pageY);

    this._utils.updatePosition(
      pageX,
      pageY,
      this._initialPanX,
      this._initialPanY,
      this._startEvent as MouseEvent | TouchEvent
    );
  };
}
