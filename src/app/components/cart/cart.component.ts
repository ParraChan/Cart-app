import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CartItem } from '../../models/cartItem';

@Component({
  selector: 'cart',
  imports: [],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnChanges {
  
  @Input() items: CartItem[]= [];
  total =0;

  @Output() idProductEventEmitter= new EventEmitter();
  
  ngOnChanges(changes: SimpleChanges): void {
    let itemsChanges = changes ['items'];
    this.caculateTotal();
    
   this.saveSession();
    
  }
  onDeleteCart(id: number){
    this.idProductEventEmitter.emit(id);
  }
    caculateTotal():void{
    this.total= this.items.reduce((accumulator, item)=>
    accumulator + item.product.price * item.quantity,0);
  }
  saveSession():void{
    sessionStorage.setItem('cart',JSON.stringify(this.items))
  }

}
