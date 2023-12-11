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
  const leftPosition = container.offsetWidth / 2;
  content.style.left = `${leftPosition}px`;
  content.style.top = '0px';
};

export const centerContent = (container: HTMLElement, content: HTMLElement) => {
  const leftPosition = container.offsetWidth / 2;
  const topPosition = container.offsetHeight / 2;
  content.style.left = `${leftPosition}px`;
  content.style.top = `${topPosition}px`;
};
