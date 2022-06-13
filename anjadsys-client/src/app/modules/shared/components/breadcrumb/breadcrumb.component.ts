import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IBreadCrumb } from '../../../core/model/breadcrumb';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[]

  constructor(
    private router: Router,
    private activiatedRoute: ActivatedRoute
    ){
      this.breadcrumbs = this.buildBreadCrumb(this.activiatedRoute.root);
   }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => this.breadcrumbs = this.buildBreadCrumb(this.activiatedRoute.root))
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): IBreadCrumb[]{
    //If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data['breadcrumb'] : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';
    console.log(label, path);
    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path!.split('/').pop();
    const isDynamicRoute = lastRoutePart?.startsWith(':');
    if(isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart!.split(':')[1];
      path = path!.replace(lastRoutePart!, route.snapshot.params[paramName!]);
      label = label + ': ' +route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
        label: label,
        url: nextUrl,
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [ ...breadcrumbs, breadcrumb ] : [ ...breadcrumbs];
    if (route.firstChild) {
        //If we are not on our current path yet,
        //there will be more children to look after, to build our breadcumb
        return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

}