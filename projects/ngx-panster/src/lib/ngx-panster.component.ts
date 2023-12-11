import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, filter, from, fromEvent, takeUntil, tap } from 'rxjs';
import {
  centerContent,
  centerContentTop,
  zoomElementIn,
  zoomElementOut,
} from './ngx-panster.utils';

@Component({
  selector: 'ngx-panster',
  standalone: true,
  imports: [],
  templateUrl: './ngx-panster.component.html',
  styleUrl: './ngx-panster.component.scss',
})
export class NgxPansterComponent implements AfterViewInit {
  @ViewChild('panElement')
  private readonly _panElement!: ElementRef<HTMLDivElement>;

  @ViewChild('panContainer')
  private readonly _panContainer!: ElementRef<HTMLDivElement>;

  protected isPanning = false;

  private _mouseDownEvent?: MouseEvent;
  private _initialPanX = 0;
  private _initialPanY = 0;

  private readonly _destroyRef = inject(DestroyRef);
  private pattern = /-?\b\d+(?=px\b)/g;

  zoomIn(percentage: number) {
    zoomElementIn(this._panElement.nativeElement, percentage);
  }

  zoomOut(percentage: number) {
    zoomElementOut(this._panElement.nativeElement, percentage);
  }

  centerContent(): void {
    centerContent(
      this._panContainer.nativeElement,
      this._panElement.nativeElement
    );
  }

  centerContentTop(): void {
    centerContentTop(
      this._panContainer.nativeElement,
      this._panElement.nativeElement
    );
  }

  ngAfterViewInit(): void {
    fromEvent<MouseEvent>(this._panElement.nativeElement, 'mouseleave').pipe(
      takeUntilDestroyed(this._destroyRef),
      filter(() => this.isPanning),
      tap(() => {
        this.isPanning = false;
        this._mouseDownEvent = undefined;
      })
    );

    fromEvent<MouseEvent>(this._panContainer.nativeElement, 'mousedown')
      .pipe(
        tap((event) => {
          this._mouseDownEvent = event;
          this.isPanning = true;

          if (this._panElement.nativeElement.style.left) {
            this._initialPanX = parseInt(
              this._panElement.nativeElement.style.left.match(
                this.pattern
              )?.[0] || '0',
              10
            );
          } else {
            this._initialPanX = 0;
          }

          if (this._panElement.nativeElement.style.top) {
            this._initialPanY = parseInt(
              this._panElement.nativeElement.style.top.match(
                this.pattern
              )?.[0] || '0',
              10
            );
          } else {
            this._initialPanY = 0;
          }
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer.nativeElement, 'mouseup')
      .pipe(
        filter(() => this.isPanning),
        tap((event) => {
          this.isPanning = false;
          this._mouseDownEvent = undefined;
        }),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe();

    fromEvent<MouseEvent>(this._panContainer.nativeElement, 'mousemove')
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        filter(() => this.isPanning),
        tap((event) => {
          const offsetX = event.pageX - (this._mouseDownEvent?.pageX || 0);
          const offsetY = event.pageY - (this._mouseDownEvent?.pageY || 0);

          const newLeft = this._initialPanX + offsetX;
          const newTop = this._initialPanY + offsetY;
          this._panElement.nativeElement.style.left = `${newLeft}px`;
          this._panElement.nativeElement.style.top = `${newTop}px`;
        })
      )
      .subscribe();
  }
}
