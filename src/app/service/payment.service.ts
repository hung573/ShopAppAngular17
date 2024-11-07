import { Injectable } from "@angular/core";
import { environment } from "../enviroments/environment";
import { HttpClient } from "@angular/common/http";
import { Payment } from "../models/payment";
import { Observable } from "rxjs";
import { PaymentResponse } from "../reponses/payment.response";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiGetPayments = `${environment.apiBaseUrl}/payments`;
  constructor(private http: HttpClient) { }
  getPayments(): Observable<Payment[]> {
    debugger
    return this.http.get<Payment[]>(this.apiGetPayments);
  }

  getPaymentId(idPayment: number) {
    return this.http.get(`${this.apiGetPayments}/${idPayment}`);
  }
}


