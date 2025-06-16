import { Injectable } from "@angular/core";
import { ProductService } from "../../services/product.service";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { findAll, load } from "../products.actions";
import { EMPTY, catchError, exhaustMap, map } from "rxjs";

@Injectable()
export class ProductsEffects {

  loadProduct$: any;

  constructor(
    private actions$: Actions,
    private service: ProductService
  ) {
     this.loadProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(load),
        exhaustMap(() => this.service.findAll()),
        map(products => findAll({ products })),
        catchError(() => EMPTY)
      )
    );
  }
}