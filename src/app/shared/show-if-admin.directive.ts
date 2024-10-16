import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[roles]',
  standalone: true,
})
export class ShowIfRoleDirective {
  private role: string = '';

  @Input() set roles(role: string) {
    this.role = role;
    this.updateVisibility();
  } // Input can be an array of roles

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}
  private get userRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role;
  }

  private updateVisibility() {
    if (this.userRole == this.role) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  // @HostListener('mouseover')
  // onMouseOver() {
  //   this.renderer.setStyle(this.el.nativeElement, 'background', 'red');
  // }

  // @HostListener('mouseout')
  // onMouseOut() {
  //   this.updateVisibility();
  //   this.renderer.setStyle(this.el.nativeElement, 'background', 'inherit');
  // }
}
