
## ngx-panster - A simple content panning/zooming library
NgxPanster is a simple Angular 17 content panning and zooming library. 
### Installation
```npm 
npm install ngx-panster
```

### DEMO
You can find a stackblitz demo [here](https://stackblitz.com/edit/angular-i6deiw).

###  Usage
```html
<button  (click)="panster.zoomIn(25)">Zoom in</button>
<button  (click)="panster.zoomOut(25)">Zoom out</button>
<button  (click)="panster.centerContentTop()">Center top</button>
<button  (click)="panster.centerContent()">Center</button>
<ngx-panster  #panster>
	<!-- CONTENT -->
</ngx-panster>
 ``` 
 
 #### The library uses the Standalone API
 ```ts
import { NgxPansterComponent } from 'ngx-panster';

 @Component({
	selector:  'app-root',
	standalone:  true,
	imports:  [NgxPansterComponent],
	templateUrl:  './app.component.html',
})
export  class  AppComponent {}
```

### NgxPansterComponent inputs
| Name                   | Description                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| zoomPercentage: number | Sets the zoom of the content (good use case is with slider to determine the zoom)                                                                          |
| minZoom: number        | The minimum zoom percentage allowed. Calling zoomOut will set the zoom to minZoom's value if the new value would be less than minZoom. Defaults to 10      |
| maxZoom: number        | The maximum zoom percentage allowed. Calling zoomOut will set the zoom to maxZoom's value if the new value would be greater than maxZoom. No default value |
| zoomStep: number       | Sets the default zoomIn/zoomOut value. Defaults to 25%.                                                                                                    |

### NgxPansterComponent methods

| Method name                              | Description                                                                                                                                                                            |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| zoomIn(percentage: number)               | A method that receives a percentage (25 for 25%) and zooms the content in with the given percentage                                                                                    |
| zoomOut(percentage: number)              | A method that receives a percentage (25 for 25%) and zooms the content out with the given percentage                                                                                   |
| centerContent()                          | A method that centers the content both vertically and horizontally                                                                                                                     |
| centerContentTop()                       | A method that centers the content both horizontally and aligns it to the top                                                                                                           |
| centerElementPoint(x: number, y: number) | A method that receives pageX and pageY coordinates and centers them within the pan element. If the x and y coordinates are NOT within the pan element then this function does nothing. |
| centerX()                                | A method that centers the content horizontally                                                                                                                                         |
| centerY()                                | A method that centers the content vertically                                                                                                                                           |