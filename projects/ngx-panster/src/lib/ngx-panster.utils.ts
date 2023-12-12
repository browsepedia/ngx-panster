export const zoomElementIn = (
  element: HTMLElement,
  percentage: number
): void => {
  const currentScale = parseFloat(
    element.style.transform?.match(/scale\((.*?)\)/)?.[1] || '1'
  );
  const newScale = currentScale + percentage / 100;
  element.style.transform = `scale(${newScale})`;
};

export const setElementZoom = (
  element: HTMLElement,
  percentage: number
): void => {
  const newScale = percentage / 100;
  element.style.transform = `scale(${newScale})`;
};

export const zoomElementOut = (
  element: HTMLElement,
  percentage: number
): void => {
  const currentScale = parseFloat(
    element.style.transform?.match(/scale\((.*?)\)/)?.[1] || '1'
  );
  const newScale = currentScale - percentage / 100;
  element.style.transform = `scale(${newScale})`;
};

export const centerContentTop = (
  container: HTMLElement,
  content: HTMLElement
) => {
  content.style.top = `0px`;

  const containerWidth = container.offsetWidth;
  const contentWidth = content.offsetWidth;
  const leftPosition = (containerWidth - contentWidth) / 2;
  content.style.left = `${leftPosition}px`;
};

export const centerContent = (container: HTMLElement, content: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const contentHeight = content.offsetHeight;
  const topPosition = (containerHeight - contentHeight) / 2;
  content.style.top = `${topPosition}px`;

  const containerWidth = container.offsetWidth;
  const contentWidth = content.offsetWidth;
  const leftPosition = (containerWidth - contentWidth) / 2;
  content.style.left = `${leftPosition}px`;
};

export const centerContentPoint = (
  container: HTMLElement,
  content: HTMLElement,
  x: number,
  y: number
) => {
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  const leftPosition = containerWidth / 2 - x;
  const topPosition = containerHeight / 2 - y;

  content.style.left = `${leftPosition}px`;
  content.style.top = `${topPosition}px`;
};
