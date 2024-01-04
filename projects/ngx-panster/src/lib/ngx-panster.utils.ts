import { Injectable } from '@angular/core';

@Injectable()
export class NgxPansterUtils {
  private _container!: HTMLElement;
  private _content!: HTMLElement;

  setContainerElement(element: HTMLElement): void {
    this._container = element;
  }

  setPanElement(element: HTMLElement): void {
    this._content = element;
  }

  updatePosition(
    x: number,
    y: number,
    initialX: number,
    initialY: number,
    initialEvent: MouseEvent
  ): void {
    const offsetX = x - initialEvent.pageX;
    const offsetY = y - initialEvent.pageY;

    const newLeft = initialX + offsetX;
    const newTop = initialY + offsetY;
    this._content.style.left = `${newLeft}px`;
    this._content.style.top = `${newTop}px`;
  }

  zoomElementIn(percentage: number, maxZoom?: number): void {
    const currentScale = parseFloat(
      this._content.style.transform?.match(/scale\((.*?)\)/)?.[1] || '1'
    );
    let newScale = currentScale + percentage / 100;

    if (maxZoom && newScale > maxZoom / 100) {
      newScale = maxZoom / 100;
    }

    this._setElementScale(newScale);
  }

  setElementZoom(percentage: number): void {
    const newScale = percentage / 100;

    this._setElementScale(newScale);
  }

  zoomElementOut(percentage: number, minZoom: number): void {
    const currentScale = parseFloat(
      this._content.style.transform?.match(/scale\((.*?)\)/)?.[1] || '1'
    );

    let newScale = currentScale - percentage / 100;

    if (newScale < minZoom / 100) {
      newScale = minZoom / 100;
    }

    this._setElementScale(newScale);
  }

  centerX() {
    const containerWidth = this._container.offsetWidth;
    const contentWidth = this._content.offsetWidth;
    const leftPosition = (containerWidth - contentWidth) / 2;
    this._content.style.left = `${leftPosition}px`;
  }

  centerY() {
    const containerHeight = this._container.offsetHeight;
    const contentHeight = this._content.offsetHeight;
    const topPosition = (containerHeight - contentHeight) / 2;
    this._content.style.top = `${topPosition}px`;
  }

  centerContentTop() {
    this._content.style.top = `0px`;

    this.centerX();
  }

  centerContent() {
    this.centerX();
    this.centerY();
  }

  centerContentPoint(x: number, y: number) {
    const rect = this._content.getBoundingClientRect();

    const contentX = x - rect.left;
    const contentY = y - rect.top;

    if (
      contentX >= 0 &&
      contentX <= rect.width &&
      contentY >= 0 &&
      contentY <= rect.height
    ) {
      const containerWidth = this._container.offsetWidth;
      const containerHeight = this._container.offsetHeight;

      const leftPosition = containerWidth / 2 - x;
      const topPosition = containerHeight / 2 - y;

      this._content.style.left = `${leftPosition}px`;
      this._content.style.top = `${topPosition}px`;
    }
  }

  private _setElementScale(scale: number) {
    setTimeout(() => {
      if (this._content) {
        this._content.style.transform = `scale(${scale})`;
      }
    });
  }
}
