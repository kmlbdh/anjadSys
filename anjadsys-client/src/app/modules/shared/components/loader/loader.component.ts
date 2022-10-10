import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {

  loading: boolean = false;
  constructor(private loaderService: LoaderService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loaderService.loading
      .subscribe({
        next: value => {
          this.loading = value;
          this.cd.markForCheck();
        },
      });
  }

}
