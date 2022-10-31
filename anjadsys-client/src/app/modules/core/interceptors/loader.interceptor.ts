import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) {}

  removeRequest(req: HttpRequest<any>) {
    const index = this.requests.indexOf(req);
    if (index > -1) { this.requests.splice(index, 1); }
    this.loaderService.loading.next(this.requests.length > 0);
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.body?.skipLoadingInterceptor) {
      //TODO unsed skiploadingInterceptor variabel need to be removed
      let { skipLoadingInterceptor, ...restOfBody } = request.body;
      let newRequest: HttpRequest<any> = request.clone({
        body: { ...restOfBody }
      });
      return next.handle(newRequest);
    }
    this.requests.push(request);

    // console.log("No of requests---> " + this.requests.length);

    this.loaderService.loading.next(true);

    return new Observable(observer => {
      const subscription = next.handle(request)
        .subscribe({
          next: event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(request);
              observer.next(event);
            }
          },
          error: err => {
            this.removeRequest(request);
            observer.error(err);
          },
          complete: () => {
            this.removeRequest(request);
            observer.complete();
          }
        });
        //if request canceled, should be removed from array!
      return () => {
        this.removeRequest(request);
        subscription.unsubscribe();
      };
    });
  }

}
