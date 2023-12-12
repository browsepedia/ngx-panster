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

  private _mouseDownEvent?: MouseEvent;
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
          this._mouseDownEvent = undefined;
        })
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'mousedown')
      .pipe(
        tap((event) => {
          this._mouseDownEvent = event;
          this.isPanning = true;

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
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'mouseup')
      .pipe(
        filter(() => this.isPanning),
        tap(() => {
          this.isPanning = false;
          this._mouseDownEvent = undefined;
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer, 'mousemove')
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter(() => this.isPanning),
        tap((event) =>
          this._utils.updatePosition(
            event.pageX,
            event.pageY,
            this._initialPanX,
            this._initialPanY,
            this._mouseDownEvent as MouseEvent
          )
        )
      )
      .subscribe();
  }
}
