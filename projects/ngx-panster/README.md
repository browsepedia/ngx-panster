
## ngx-panster - A simple content panning/zooming library
NgxPanster is a simple Angular 17 content panning and zooming library. 
### Installation
```npm 
npm install @browsepedia/ngx-panster
```

###  Usage
```html
<button  (click)="panster.zoomIn(25)">zoom in</button>
<button  (click)="panster.zoomOut(25)">zoom out</button>
<button  (click)="panster.centerContentTop()">centerTop</button>
<button  (click)="panster.centerContent()">center</button>
<ngx-panster  #panster>
	<!-- CONTENT -->
</ngx-panster>
 ``` 
 
 #### The library uses the Standalone API
 ```ts
import { NgxPansterComponent } from '@browsepedia/ngx-panster';

 @Component({
	selector:  'app-root',
	standalone:  true,
	imports:  [NgxPansterComponent],
	templateUrl:  './app.component.html',
})
export  class  AppComponent {}
```

### NgxPansterComponent inputs
| Name                   | Description                                                                       |
| ---------------------- | --------------------------------------------------------------------------------- |
| zoomPercentage: number | Sets the zoom of the content (good use case is with slider to determine the zoom) |

### NgxPansterComponent methods

| Method name                 | Description                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| zoomIn(percentage: number)  | A method that receives a percentage (25 for 25%) and zooms the content in with the given percentage  |
| zoomOut(percentage: number) | A method that receives a percentage (25 for 25%) and zooms the content out with the given percentage |
| centerContent()             | no parameter                                                                                         | A method that centers the content both vertically and horizontally           |
| centerContentTop()          | no parameter                                                                                         | A method that centers the content both horizontally and aligns it to the top |