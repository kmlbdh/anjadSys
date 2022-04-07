import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  loading: boolean = false;
  constructor(private loaderService: LoaderService) {
    this.loaderService.loading.subscribe({
      next: (value) => {
        // console.log(value);
        this.loading = value;
      }
    })
  }

  ngOnInit(): void {}

}
