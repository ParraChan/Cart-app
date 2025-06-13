import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartItem } from '../models/cartItem';
import { NavbarComponent } from './navbar/navbar.component';
import { Router, RouterOutlet } from '@angular/router';
import { SharingDataService } from '../services/sharing-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'cart-app',
  imports: [NavbarComponent, RouterOutlet],
  templateUrl: './cart-app.component.html'
})
export class CartAppComponent implements OnInit {
  
  items: CartItem[] = [];

  total : number =0;
  
  constructor(private router: Router, private sharingDataService: SharingDataService, private service: ProductService){}
  
  ngOnInit(): void {
   this.items= JSON.parse(sessionStorage.getItem('cart') || '[]');
   this.caculateTotal();
   this.onDeleteCart();
   this.onAddCart();
  }

  onAddCart(): void {
    this.sharingDataService.productEventEmitter.subscribe(product =>{
      const hasItem = this.items.find(item => item.product.id === product.id);
    if (hasItem) {
      this.items = this.items.map(item => {
        if (item.product.id === product.id) {
          return {
            ...item,
            quantity: item.quantity + 1
          }
        }
        return item;
      })
    } else {
      this.items = [... this.items, { product: { ...product }, quantity: 1 }];
    }
    this.caculateTotal();
    this.saveSession();
    this.router.navigate(['/cart'],{
      state:{items : this.items, total:this.total}
    });
    Swal.fire({
        title: "Shopping Cart",
        text: "Nuevo producto agregado",
        icon: "success"
      });

    });
    
  }
  onDeleteCart(): void {
    this.sharingDataService.idProductEventEmitter.subscribe(id =>{
      console.log(id + 'se ha ejecutado el evento idProductEmitter')
        Swal.fire({
        title: "Estas seguro que deseas eliminar?",
        text: "Estos cambios son irreversibles",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar!"
      }).then((result) => {
        if (result.isConfirmed) {
               this.items = this.items.filter(item => item.product.id !== id);
                if(this.items.length== 0){
                  sessionStorage.removeItem('cart');
                  sessionStorage.clear();
                }
                this.caculateTotal();
                this.saveSession();
                this.router.navigateByUrl('/',{skipLocationChange: true}).then(() =>{
                  this.router.navigate(['/cart'],{
                  state:{items : this.items, total:this.total}
                }); 
                });

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });
      
 
      
  });
  }
  
  caculateTotal():void{
    this.total= this.items.reduce((accumulator, item)=>
    accumulator + item.product.price * item.quantity,0);
  }
  saveSession():void{
    sessionStorage.setItem('cart',JSON.stringify(this.items))
  }
}
