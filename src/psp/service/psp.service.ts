import { Injectable } from '@nestjs/common';
import {Stripe} from "stripe";
import * as config from "config";

@Injectable()
export class PspService {

  private static readonly KEY : string = config.get("stripe.secretKey");

  constructor(
  ) {

  }

  createProduct(name : string): Promise<Stripe.Product>{
    return this.getStipe().products.create({
      name: name
    });
  }

  public createCustomer(email: string): Promise<Stripe.Customer> {
    return this.getStipe().customers.create({
      email:email
    });
  }

  private getStipe(): Stripe {
    return new Stripe(PspService.KEY,<Stripe.StripeConfig>{apiVersion: "2020-03-02"});
  }


}


