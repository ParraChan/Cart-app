import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cartItem';

@Component({
  selector: 'navbar',
  imports: [],
  templateUrl: './navbar.component.html'

})
export class NavbarComponent {

  @Input() items: CartItem[]=[];

}
