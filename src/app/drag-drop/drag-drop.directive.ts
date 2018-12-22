import { Directive, Renderer2, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';


@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective implements AfterViewInit, OnDestroy {

  events: any[] = [];
  input: HTMLElement;

  constructor(
    private render: Renderer2,
    private el: ElementRef
  ) { }

  ngAfterViewInit() {

    this.events[0] = this.render.listen(this.el.nativeElement, 'mouseenter', () => {
      this.render.addClass(this.el.nativeElement, 'dropHover');
    });

    this.events[1] = this.render.listen(this.el.nativeElement, 'mouseout', () => {
      this.render.removeClass(this.el.nativeElement, 'dropHover');
    });

    for(const d of this.el.nativeElement.children) {
      if(d.id === 'images') {
        this.input = d;
        break;
      }
    }

    this.events[2] = this.render.listen(this.input, 'dragenter', () => {
      this.render.addClass(this.el.nativeElement, 'dropHover');
      this.render.setStyle(this.el.nativeElement, 'border-color', '#398bf7');
    });

    const eventName = ['dragleave', 'dragend', 'mouseout', 'drop'];

    for(let e = 0; e < eventName.length; e++) {
      this.events[e + 3] = this.render.listen(this.input, eventName[e], () => {
        this.render.removeClass(this.el.nativeElement, 'dropHover');
        this.render.setStyle(this.el.nativeElement, 'border-color', '#DADFE3');
      });
    }

  }

  ngOnDestroy() {
    this.events.forEach( e => e());
  }

}
